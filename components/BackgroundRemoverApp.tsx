"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Upload,
  Download,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Cpu,
  Layers,
  AlertCircle,
  MoveHorizontal,
  WifiOff,
} from "lucide-react";
import {
  prepareImageForRemoval,
  applyMaskAndExportPng,
  normalizeImageFile,
  type PreparedImage,
} from "@/app/free-tools/background-remover/image-pipeline";

type AppState =
  | "idle"
  | "confirm_datasaver"
  | "downloading_model"
  | "processing"
  | "done"
  | "error";

interface ProgressData {
  progress?: number;
  loaded?: number;
  total?: number;
  statusText?: string;
}

export function BackgroundRemoverApp() {
  const [state, setState] = useState<AppState>("idle");
  const [statusText, setStatusText] = useState<string>("Ready");
  const [progressData, setProgressData] = useState<ProgressData>({});
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [imageMeta, setImageMeta] = useState<{
    width: number;
    height: number;
    filename: string;
  } | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<{
    device: string;
    dtype: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const workerRef = useRef<Worker | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const sliderContainerRef = useRef<HTMLDivElement | null>(null);
  const pendingBlobRef = useRef<{ blob: Blob; filename: string } | null>(null);
  const preparedImageRef = useRef<PreparedImage | null>(null);
  const originalUrlRef = useRef<string | null>(null);
  const resultUrlRef = useRef<string | null>(null);

  const cleanupResources = useCallback(() => {
    if (originalUrlRef.current) {
      URL.revokeObjectURL(originalUrlRef.current);
      originalUrlRef.current = null;
    }
    if (resultUrlRef.current) {
      URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = null;
    }
    if (preparedImageRef.current?.displayUrl) {
      URL.revokeObjectURL(preparedImageRef.current.displayUrl);
    }
    preparedImageRef.current = null;
  }, []);

  // Initialize Web Worker
  useEffect(() => {
    const worker = new Worker("/workers/remover.worker.js", { type: "module" });
    workerRef.current = worker;

    worker.onmessage = async (e: MessageEvent) => {
      const data = e.data;
      if (!data) return;

      if (data.type === "STATUS") {
        setStatusText(data.status || "Processing...");
      } else if (data.type === "PROGRESS") {
        setProgressData({
          progress: data.progress,
          loaded: data.loaded,
          total: data.total,
          statusText: "Downloading AI model...",
        });
      } else if (data.type === "MODEL_READY") {
        setDeviceInfo({ device: data.device, dtype: data.dtype });
      } else if (data.type === "PROCESS_COMPLETE") {
        try {
          setStatusText("Refining edges and generating transparent PNG...");
          if (data.device && data.dtype) {
            setDeviceInfo({ device: data.device, dtype: data.dtype });
          }

          if (!preparedImageRef.current) {
            throw new Error("Source image buffer unavailable.");
          }

          const { url } = await applyMaskAndExportPng(
            preparedImageRef.current.sourceCanvas,
            data.maskBuffer
          );

          resultUrlRef.current = url;
          setResultUrl(url);
          setState("done");
        } catch (err: any) {
          console.error("Mask application error:", err);
          setErrorMessage(
            err?.message || "Failed to composite final transparent PNG."
          );
          setState("error");
        }
      } else if (data.type === "ERROR") {
        setErrorMessage(data.message || "An unexpected error occurred.");
        setState("error");
      }
    };

    return () => {
      worker.terminate();
      workerRef.current = null;
      cleanupResources();
    };
  }, [cleanupResources]);

  const runPipeline = useCallback(
    async (blob: Blob, outFilename: string) => {
      try {
        cleanupResources();
        setState("downloading_model");
        setStatusText("Preparing neural network...");

        const prepared = await prepareImageForRemoval(blob);
        preparedImageRef.current = prepared;
        originalUrlRef.current = prepared.displayUrl;
        setOriginalUrl(prepared.displayUrl);
        setImageMeta({
          width: prepared.width,
          height: prepared.height,
          filename: outFilename,
        });

        setState("processing");
        setStatusText("Removing background...");

        // Send 512x512 RGB buffer to worker
        const buffer = prepared.input512Rgb.buffer;
        workerRef.current?.postMessage(
          {
            type: "PROCESS",
            payload: { rgbBuffer: buffer },
          },
          [buffer]
        );
      } catch (err: any) {
        console.error("Image preparation error:", err);
        setErrorMessage(
          err?.message || "Failed to decode image. Please check file format."
        );
        setState("error");
      }
    },
    [cleanupResources]
  );

  // Handle incoming file selection (from picker, drop, or clipboard)
  const processSelectedFile = useCallback(
    async (file: File) => {
      try {
        setErrorMessage(null);
        setState("processing");
        setStatusText("Preparing image on device...");

        // HEIC conversion if needed
        const normalizedBlob = await normalizeImageFile(file);

        // Check navigator.connection.saveData
        const isDataSaver =
          typeof navigator !== "undefined" &&
          (navigator as any).connection?.saveData === true;

        if (isDataSaver && !deviceInfo) {
          pendingBlobRef.current = {
            blob: normalizedBlob,
            filename: file.name.replace(/\.[^/.]+$/, "") + "-cutout.png",
          };
          setState("confirm_datasaver");
          return;
        }

        await runPipeline(
          normalizedBlob,
          file.name.replace(/\.[^/.]+$/, "") + "-cutout.png"
        );
      } catch (err: any) {
        console.error("Pipeline initiation error:", err);
        setErrorMessage(
          err?.message || "Failed to process photo. Please try a different image."
        );
        setState("error");
      }
    },
    [deviceInfo, runPipeline]
  );

  // Clipboard paste support (Cmd+V / Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (state !== "idle" && state !== "done") return;
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            processSelectedFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [state, processSelectedFile]);

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/") || /\.(heic|heif)$/i.test(file.name)) {
        processSelectedFile(file);
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processSelectedFile(e.target.files[0]);
    }
  };

  // Slider touch / pointer drag calculation
  const updateSliderPosition = (clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const pos = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.min(100, Math.max(0, pos)));
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDraggingSlider(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateSliderPosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingSlider) return;
    updateSliderPosition(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDraggingSlider(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if capture was already released
    }
  };

  const resetAll = () => {
    cleanupResources();
    setOriginalUrl(null);
    setResultUrl(null);
    setImageMeta(null);
    setErrorMessage(null);
    setState("idle");
    setStatusText("Ready");
    setSliderPos(50);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatBytes = (bytes?: number) => {
    if (!bytes || bytes <= 0) return "";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8 text-[var(--v2-text)]">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif,.heic,.heif"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Header */}
      <div className="text-center mb-10">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs v2-mono mb-4 border"
          style={{
            borderColor: "var(--v2-border)",
            background: "var(--v2-surface)",
            color: "var(--v2-accent-text)",
          }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>BiRefNet ONNX 512 • In-Browser Vision</span>
        </div>
        <h1 className="v2-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[var(--v2-text)]">
          In-Browser Background Remover
        </h1>
        <p
          className="mt-3 text-base sm:text-lg max-w-xl mx-auto"
          style={{ color: "var(--v2-muted)" }}
        >
          Free, high-fidelity subject cutout running 100% on your device. No
          cloud upload, full privacy, and instant transparent PNG export.
        </p>
      </div>

      {/* Main Interactive Stage */}
      <div
        className="relative rounded-2xl border p-6 sm:p-8 transition-colors duration-200"
        style={{
          background: "var(--v2-surface)",
          borderColor: isDragOver ? "var(--v2-accent)" : "var(--v2-border)",
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* IDLE STATE */}
        {state === "idle" && (
          <div className="flex flex-col items-center justify-center py-12 sm:py-20 text-center">
            <div
              className="w-16 h-16 rounded-2xl border flex items-center justify-center mb-6 transition-transform duration-200 hover:scale-105"
              style={{
                borderColor: "var(--v2-border)",
                background: "var(--v2-elevated)",
              }}
            >
              <Upload className="w-7 h-7 text-[var(--v2-accent-text)]" />
            </div>

            <h3 className="text-xl sm:text-2xl font-medium text-[var(--v2-text)]">
              Drop an image here, or choose a file
            </h3>
            <p
              className="mt-2 text-sm sm:text-base max-w-md"
              style={{ color: "var(--v2-muted)" }}
            >
              Supports PNG, JPG, WebP, AVIF, and iPhone HEIC/HEIF photos. Or
              press <kbd className="v2-mono px-1.5 py-0.5 rounded border border-[var(--v2-border)] bg-[var(--v2-elevated)] text-xs">Ctrl+V</kbd> to paste.
            </p>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-8 px-6 py-3 rounded-full text-sm font-medium transition-all duration-150 active:scale-95 shadow-sm"
              style={{
                background: "var(--v2-accent)",
                color: "var(--v2-accent-ink)",
              }}
            >
              Select Image
            </button>

            {/* Feature Pills */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl text-left">
              <div
                className="p-4 rounded-xl border flex items-start gap-3"
                style={{
                  borderColor: "var(--v2-border)",
                  background: "var(--v2-elevated)",
                }}
              >
                <ShieldCheck className="w-5 h-5 text-[var(--v2-accent-text)] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold v2-mono uppercase tracking-wider text-[var(--v2-text)]">
                    100% Private
                  </h4>
                  <p
                    className="text-xs mt-1 leading-relaxed"
                    style={{ color: "var(--v2-muted)" }}
                  >
                    Images never leave your computer or phone. Processed purely in-memory.
                  </p>
                </div>
              </div>

              <div
                className="p-4 rounded-xl border flex items-start gap-3"
                style={{
                  borderColor: "var(--v2-border)",
                  background: "var(--v2-elevated)",
                }}
              >
                <Cpu className="w-5 h-5 text-[var(--v2-accent-text)] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold v2-mono uppercase tracking-wider text-[var(--v2-text)]">
                    WebGPU & WASM
                  </h4>
                  <p
                    className="text-xs mt-1 leading-relaxed"
                    style={{ color: "var(--v2-muted)" }}
                  >
                    Hardware accelerated on modern GPUs with automatic WebAssembly fallback.
                  </p>
                </div>
              </div>

              <div
                className="p-4 rounded-xl border flex items-start gap-3"
                style={{
                  borderColor: "var(--v2-border)",
                  background: "var(--v2-elevated)",
                }}
              >
                <Layers className="w-5 h-5 text-[var(--v2-accent-text)] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold v2-mono uppercase tracking-wider text-[var(--v2-text)]">
                    Full Resolution
                  </h4>
                  <p
                    className="text-xs mt-1 leading-relaxed"
                    style={{ color: "var(--v2-muted)" }}
                  >
                    Alpha mask is upscaled and anti-aliased over the original dimensions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DATA SAVER CONFIRMATION MODAL */}
        {state === "confirm_datasaver" && (
          <div className="flex flex-col items-center justify-center py-14 text-center max-w-lg mx-auto">
            <div
              className="w-14 h-14 rounded-2xl border flex items-center justify-center mb-5"
              style={{
                borderColor: "var(--v2-border)",
                background: "var(--v2-elevated)",
              }}
            >
              <WifiOff className="w-7 h-7 text-amber-400" />
            </div>
            <h3 className="text-xl font-medium text-[var(--v2-text)]">
              Data Saver is Active
            </h3>
            <p
              className="mt-3 text-sm leading-relaxed"
              style={{ color: "var(--v2-muted)" }}
            >
              Your browser reports that Data Saver is enabled. The AI model requires a
              one-time download of approximately <strong>94 MB</strong>. Once
              downloaded, it is stored in your local browser cache and works offline.
            </p>
            <div className="mt-8 flex gap-4">
              <button
                type="button"
                onClick={() => {
                  if (pendingBlobRef.current) {
                    runPipeline(
                      pendingBlobRef.current.blob,
                      pendingBlobRef.current.filename
                    );
                  }
                }}
                className="px-6 py-2.5 rounded-full text-sm font-medium transition-transform active:scale-95"
                style={{
                  background: "var(--v2-accent)",
                  color: "var(--v2-accent-ink)",
                }}
              >
                Proceed with Download
              </button>
              <button
                type="button"
                onClick={resetAll}
                className="px-5 py-2.5 rounded-full text-sm font-medium border transition-colors hover:bg-[var(--v2-elevated)]"
                style={{
                  borderColor: "var(--v2-border)",
                  color: "var(--v2-text)",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* DOWNLOADING / PROCESSING STATES */}
        {(state === "downloading_model" || state === "processing") && (
          <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center max-w-md mx-auto">
            <div className="relative mb-6">
              <div
                className="w-16 h-16 rounded-full border-2 border-t-transparent animate-spin"
                style={{
                  borderColor: "var(--v2-border)",
                  borderTopColor: "var(--v2-accent)",
                }}
              />
              <Sparkles className="w-6 h-6 text-[var(--v2-accent-text)] absolute inset-0 m-auto" />
            </div>

            <h3 className="text-xl font-medium text-[var(--v2-text)]">
              {state === "downloading_model"
                ? "Downloading AI Model (~94 MB)"
                : "Segmenting Image..."}
            </h3>

            <p
              className="mt-2 text-sm"
              style={{ color: "var(--v2-muted)" }}
            >
              {statusText}
            </p>

            {/* Progress Bar */}
            {progressData.progress !== undefined && (
              <div className="w-full mt-6">
                <div
                  className="w-full h-2 rounded-full overflow-hidden"
                  style={{ background: "var(--v2-elevated)" }}
                >
                  <div
                    className="h-full transition-all duration-200 rounded-full"
                    style={{
                      background: "var(--v2-accent)",
                      width: `${progressData.progress}%`,
                    }}
                  />
                </div>
                <div
                  className="flex justify-between text-xs v2-mono mt-2"
                  style={{ color: "var(--v2-faint)" }}
                >
                  <span>{progressData.progress}%</span>
                  <span>
                    {progressData.loaded && progressData.total
                      ? `${formatBytes(progressData.loaded)} / ${formatBytes(
                          progressData.total
                        )}`
                      : "Cached locally afterward"}
                  </span>
                </div>
              </div>
            )}

            <div
              className="mt-8 px-4 py-2 rounded-lg border text-xs v2-mono flex items-center gap-2"
              style={{
                borderColor: "var(--v2-border)",
                background: "var(--v2-elevated)",
                color: "var(--v2-muted)",
              }}
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Please keep this tab open during inference</span>
            </div>
          </div>
        )}

        {/* DONE STATE: BEFORE/AFTER SLIDER */}
        {state === "done" && originalUrl && resultUrl && (
          <div className="flex flex-col items-center">
            {/* Action Bar */}
            <div className="w-full flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={resetAll}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border transition-colors hover:bg-[var(--v2-elevated)]"
                  style={{
                    borderColor: "var(--v2-border)",
                    color: "var(--v2-text)",
                  }}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Process Another</span>
                </button>

                {imageMeta && (
                  <span
                    className="text-xs v2-mono px-3 py-1.5 rounded-full border hidden sm:inline-block"
                    style={{
                      borderColor: "var(--v2-border)",
                      color: "var(--v2-muted)",
                    }}
                  >
                    {imageMeta.width} × {imageMeta.height} px
                  </span>
                )}

                {deviceInfo && (
                  <span
                    className="text-xs v2-mono px-3 py-1.5 rounded-full border hidden md:inline-block"
                    style={{
                      borderColor: "var(--v2-border)",
                      color: "var(--v2-accent-text)",
                    }}
                  >
                    {deviceInfo.device.toUpperCase()} ({deviceInfo.dtype})
                  </span>
                )}
              </div>

              <a
                href={resultUrl}
                download={imageMeta?.filename || "cutout.png"}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-transform duration-150 active:scale-95 shadow-md"
                style={{
                  background: "var(--v2-accent)",
                  color: "var(--v2-accent-ink)",
                }}
              >
                <Download className="w-4 h-4" />
                <span>Download Transparent PNG</span>
              </a>
            </div>

            {/* Split View Comparison Slider */}
            <div
              ref={sliderContainerRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[680px] rounded-xl overflow-hidden cursor-ew-resize select-none border"
              style={{
                borderColor: "var(--v2-border)",
                touchAction: "none",
              }}
            >
              {/* Layer 1: Cutout over Dark Transparency Checkerboard */}
              <div
                className="absolute inset-0 w-full h-full flex items-center justify-center"
                style={{
                  backgroundImage: `
                    linear-gradient(45deg, #1d2027 25%, transparent 25%),
                    linear-gradient(-45deg, #1d2027 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, #1d2027 75%),
                    linear-gradient(-45deg, transparent 75%, #1d2027 75%)
                  `,
                  backgroundSize: "20px 20px",
                  backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                  backgroundColor: "#131418",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resultUrl}
                  alt="Background Removed"
                  className="w-full h-full object-contain pointer-events-none"
                />
              </div>

              {/* Layer 2: Original Image, clipped to slider position */}
              <div
                className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
                style={{
                  clipPath: `inset(0 0 0 ${sliderPos}%)`,
                }}
              >
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: "#0e0f12" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={originalUrl}
                    alt="Original"
                    className="w-full h-full object-contain pointer-events-none"
                  />
                </div>
              </div>

              {/* Badges */}
              <div
                className="absolute top-4 left-4 pointer-events-none px-3 py-1 rounded-full text-xs v2-mono border backdrop-blur-md"
                style={{
                  background: "rgba(21, 23, 28, 0.8)",
                  borderColor: "var(--v2-border)",
                  color: "var(--v2-text)",
                }}
              >
                Cutout
              </div>

              <div
                className="absolute top-4 right-4 pointer-events-none px-3 py-1 rounded-full text-xs v2-mono border backdrop-blur-md"
                style={{
                  background: "rgba(21, 23, 28, 0.8)",
                  borderColor: "var(--v2-border)",
                  color: "var(--v2-text)",
                }}
              >
                Original
              </div>

              {/* Divider Handle */}
              <div
                className="absolute top-0 bottom-0 w-0.5 pointer-events-none"
                style={{
                  left: `${sliderPos}%`,
                  background: "var(--v2-accent)",
                  boxShadow: "0 0 10px rgba(67, 83, 255, 0.5)",
                }}
              >
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full border flex items-center justify-center shadow-lg transition-transform"
                  style={{
                    background: "var(--v2-surface)",
                    borderColor: "var(--v2-accent)",
                    transform: isDraggingSlider ? "translate(-50%, -50%) scale(1.15)" : "translate(-50%, -50%)",
                  }}
                >
                  <MoveHorizontal className="w-4 h-4 text-[var(--v2-accent-text)]" />
                </div>
              </div>
            </div>

            <p
              className="mt-3 text-xs v2-mono"
              style={{ color: "var(--v2-faint)" }}
            >
              Drag or swipe the divider to compare the original and transparent cutout
            </p>
          </div>
        )}

        {/* ERROR STATE */}
        {state === "error" && (
          <div className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto">
            <div
              className="w-14 h-14 rounded-2xl border flex items-center justify-center mb-5"
              style={{
                borderColor: "rgba(239, 68, 68, 0.3)",
                background: "rgba(239, 68, 68, 0.1)",
              }}
            >
              <AlertCircle className="w-7 h-7 text-red-400" />
            </div>

            <h3 className="text-xl font-medium text-[var(--v2-text)]">
              Processing Error
            </h3>
            <p
              className="mt-2 text-sm leading-relaxed"
              style={{ color: "var(--v2-muted)" }}
            >
              {errorMessage || "Unable to complete background removal."}
            </p>

            <button
              type="button"
              onClick={resetAll}
              className="mt-6 px-6 py-2.5 rounded-full text-sm font-medium border transition-colors hover:bg-[var(--v2-elevated)]"
              style={{
                borderColor: "var(--v2-border)",
                color: "var(--v2-text)",
              }}
            >
              Try Another Image
            </button>
          </div>
        )}
      </div>

      {/* Trust & Licensing Footer */}
      <div
        className="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs v2-mono"
        style={{
          borderColor: "var(--v2-border)",
          color: "var(--v2-faint)",
        }}
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Processed on your device. Your image is never uploaded.</span>
        </div>

        <div>
          <span>
            Powered by{" "}
            <a
              href="https://github.com/ZhengPeng7/BiRefNet"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-[var(--v2-muted)]"
            >
              BiRefNet (MIT)
            </a>{" "}
            • 512 ONNX build by{" "}
            <a
              href="https://huggingface.co/studioludens/birefnet-lite-512"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-[var(--v2-muted)]"
            >
              Studio Ludens
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
