"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import jsQR from "jsqr";
import {
  Link as LinkIcon,
  Type,
  Wifi,
  Mail,
  Phone,
  MessageSquare,
  Contact,
  Send,
  Download,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Palette,
  Shapes,
  Image as ImageIcon,
  Square,
  HelpCircle,
  Eye,
} from "lucide-react";
import {
  type QrType,
  type QrFormData,
  INITIAL_QR_FORM_DATA,
  encodeQrData,
  getExportFilename,
} from "@/app/free-tools/qr-generator/qr-encoders";
import {
  type FramePreset,
  type FrameOptions,
  INITIAL_FRAME_OPTIONS,
  compositeFramedQr,
} from "@/app/free-tools/qr-generator/frame-compositor";
import {
  auditColors,
  type ContrastAudit,
} from "@/app/free-tools/qr-generator/contrast";

type DotType =
  | "rounded"
  | "dots"
  | "classy"
  | "classy-rounded"
  | "square"
  | "extra-rounded";

type CornerSquareType = "extra-rounded" | "dot" | "square";
type CornerDotType = "dot" | "square";
type FillMode = "solid" | "linear" | "radial";
type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

interface StyleOptions {
  dotType: DotType;
  cornerSquareType: CornerSquareType;
  cornerDotType: CornerDotType;
  fillMode: FillMode;
  fgColor1: string;
  fgColor2: string;
  gradientAngle: number;
  bgColor: string;
  transparentBg: boolean;
  logoUrl: string | null;
  logoSize: number;
  logoMargin: number;
  hideDotsBehindLogo: boolean;
  errorCorrectionLevel: ErrorCorrectionLevel;
}

const DEFAULT_STYLE_OPTIONS: StyleOptions = {
  dotType: "rounded",
  cornerSquareType: "extra-rounded",
  cornerDotType: "dot",
  fillMode: "solid",
  fgColor1: "#0e0f12",
  fgColor2: "#4353ff",
  gradientAngle: 45,
  bgColor: "#ffffff",
  transparentBg: false,
  logoUrl: null,
  logoSize: 0.22,
  logoMargin: 6,
  hideDotsBehindLogo: true,
  errorCorrectionLevel: "M",
};

export function QrGeneratorApp() {
  const [formData, setFormData] = useState<QrFormData>(INITIAL_QR_FORM_DATA);
  const [styleOptions, setStyleOptions] = useState<StyleOptions>(DEFAULT_STYLE_OPTIONS);
  const [frameOptions, setFrameOptions] = useState<FrameOptions>(INITIAL_FRAME_OPTIONS);
  const [exportSize, setExportSize] = useState<number>(1024);
  const [activeSection, setActiveSection] = useState<"colors" | "shapes" | "logo" | "frame" | null>("colors");

  // Scannability test states
  const [isScannable, setIsScannable] = useState<boolean | null>(null);
  const [scanDiagnostic, setScanDiagnostic] = useState<string>("");
  const [hasCopied, setHasCopied] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const qrCodeInstanceRef = useRef<any>(null);
  const rawQrContainerRef = useRef<HTMLDivElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Compile raw QR string
  const rawPayload = useMemo(() => encodeQrData(formData), [formData]);
  const payloadLength = rawPayload.length;

  // Error correction guardrail: force 'H' if logo is present
  const effectiveEcl = useMemo(() => {
    return styleOptions.logoUrl ? "H" : styleOptions.errorCorrectionLevel;
  }, [styleOptions.logoUrl, styleOptions.errorCorrectionLevel]);

  // Contrast analysis
  const contrastAudit: ContrastAudit = useMemo(() => {
    return auditColors(
      styleOptions.fgColor1,
      styleOptions.bgColor,
      styleOptions.transparentBg
    );
  }, [styleOptions.fgColor1, styleOptions.bgColor, styleOptions.transparentBg]);

  // Live Composite Render & jsQR Verification
  const renderCompositePreview = useCallback(async () => {
    if (!rawQrContainerRef.current || !previewCanvasRef.current) return;
    const rawCanvas = rawQrContainerRef.current.querySelector("canvas");
    if (!rawCanvas) return;

    try {
      // 1. Live scan check on the unscaled/unframed QR code
      const rawCtx = rawCanvas.getContext("2d", { willReadFrequently: true });
      if (rawCtx) {
        const imgData = rawCtx.getImageData(0, 0, rawCanvas.width, rawCanvas.height);
        const decoded = jsQR(imgData.data, rawCanvas.width, rawCanvas.height);

        if (decoded && decoded.data) {
          setIsScannable(true);
          setScanDiagnostic("Passes camera decode check.");
        } else {
          setIsScannable(false);
          if (contrastAudit.isInverted) {
            setScanDiagnostic("Failed decode: inverted colors (light code on dark background).");
          } else if (contrastAudit.ratio < 3.0) {
            setScanDiagnostic("Failed decode: color contrast is too low.");
          } else if (styleOptions.logoUrl && styleOptions.logoSize > 0.25) {
            setScanDiagnostic("Failed decode: logo size is blocking critical position markers.");
          } else {
            setScanDiagnostic("Failed decode: check color contrast or reduce logo size.");
          }
        }
      }

      // 2. Composite with selected frame preset
      const framed = await compositeFramedQr(rawCanvas, frameOptions, 320);

      const targetCanvas = previewCanvasRef.current;
      targetCanvas.width = framed.width;
      targetCanvas.height = framed.height;
      const targetCtx = targetCanvas.getContext("2d");
      if (targetCtx) {
        targetCtx.clearRect(0, 0, framed.width, framed.height);
        targetCtx.drawImage(framed, 0, 0);
      }
    } catch (err) {
      console.error("Preview render failed:", err);
    }
  }, [frameOptions, contrastAudit, styleOptions.logoUrl, styleOptions.logoSize]);

  // Initialize qr-code-styling instance
  useEffect(() => {
    let isMounted = true;

    async function initQr() {
      const QRCodeStyling = (await import("qr-code-styling")).default;
      if (!isMounted) return;

      const instance = new QRCodeStyling({
        width: 320,
        height: 320,
        type: "canvas",
        data: rawPayload || "https://clydeabenojar.site",
        image: styleOptions.logoUrl || undefined,
        dotsOptions: {
          type: styleOptions.dotType,
          color: styleOptions.fgColor1,
        },
        cornersSquareOptions: {
          type: styleOptions.cornerSquareType,
          color: styleOptions.fgColor1,
        },
        cornersDotOptions: {
          type: styleOptions.cornerDotType,
          color: styleOptions.fgColor1,
        },
        backgroundOptions: {
          color: styleOptions.transparentBg ? "transparent" : styleOptions.bgColor,
        },
        imageOptions: {
          crossOrigin: "anonymous",
          hideBackgroundDots: styleOptions.hideDotsBehindLogo,
          imageSize: styleOptions.logoSize,
          margin: styleOptions.logoMargin,
        },
        qrOptions: {
          errorCorrectionLevel: effectiveEcl,
        },
      });

      if (rawQrContainerRef.current) {
        rawQrContainerRef.current.innerHTML = "";
        instance.append(rawQrContainerRef.current);
      }
      qrCodeInstanceRef.current = instance;
      renderCompositePreview();
    }

    initQr();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update QR instance when options change
  useEffect(() => {
    if (!qrCodeInstanceRef.current) return;

    let dotsColorConfig: any = {
      type: styleOptions.dotType,
    };

    if (styleOptions.fillMode === "solid") {
      dotsColorConfig.color = styleOptions.fgColor1;
      dotsColorConfig.gradient = undefined;
    } else {
      dotsColorConfig.color = undefined;
      dotsColorConfig.gradient = {
        type: styleOptions.fillMode,
        rotation: (styleOptions.gradientAngle * Math.PI) / 180,
        colorStops: [
          { offset: 0, color: styleOptions.fgColor1 },
          { offset: 1, color: styleOptions.fgColor2 },
        ],
      };
    }

    qrCodeInstanceRef.current.update({
      data: rawPayload || "https://clydeabenojar.site",
      image: styleOptions.logoUrl || undefined,
      dotsOptions: dotsColorConfig,
      cornersSquareOptions: {
        type: styleOptions.cornerSquareType,
        color: styleOptions.fgColor1,
      },
      cornersDotOptions: {
        type: styleOptions.cornerDotType,
        color: styleOptions.fgColor1,
      },
      backgroundOptions: {
        color: styleOptions.transparentBg ? "transparent" : styleOptions.bgColor,
      },
      imageOptions: {
        hideBackgroundDots: styleOptions.hideDotsBehindLogo,
        imageSize: styleOptions.logoSize,
        margin: styleOptions.logoMargin,
      },
      qrOptions: {
        errorCorrectionLevel: effectiveEcl,
      },
    });

    const timeout = setTimeout(() => {
      renderCompositePreview();
    }, 80);

    return () => clearTimeout(timeout);
  }, [rawPayload, styleOptions, effectiveEcl, frameOptions, renderCompositePreview]);

  // Logo upload handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setStyleOptions((prev) => ({
            ...prev,
            logoUrl: event.target!.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // High-Resolution Export Generator
  const generateExportBlob = async (format: "image/png" | "image/jpeg", size: number): Promise<Blob> => {
    const QRCodeStyling = (await import("qr-code-styling")).default;

    let dotsColorConfig: any = {
      type: styleOptions.dotType,
    };
    if (styleOptions.fillMode === "solid") {
      dotsColorConfig.color = styleOptions.fgColor1;
    } else {
      dotsColorConfig.gradient = {
        type: styleOptions.fillMode,
        rotation: (styleOptions.gradientAngle * Math.PI) / 180,
        colorStops: [
          { offset: 0, color: styleOptions.fgColor1 },
          { offset: 1, color: styleOptions.fgColor2 },
        ],
      };
    }

    const exportInstance = new QRCodeStyling({
      width: size,
      height: size,
      type: "canvas",
      data: rawPayload || "https://clydeabenojar.site",
      image: styleOptions.logoUrl || undefined,
      dotsOptions: dotsColorConfig,
      cornersSquareOptions: {
        type: styleOptions.cornerSquareType,
        color: styleOptions.fgColor1,
      },
      cornersDotOptions: {
        type: styleOptions.cornerDotType,
        color: styleOptions.fgColor1,
      },
      backgroundOptions: {
        color:
          format === "image/jpeg"
            ? styleOptions.bgColor
            : styleOptions.transparentBg
            ? "transparent"
            : styleOptions.bgColor,
      },
      imageOptions: {
        hideBackgroundDots: styleOptions.hideDotsBehindLogo,
        imageSize: styleOptions.logoSize,
        margin: styleOptions.logoMargin * (size / 320),
      },
      qrOptions: {
        errorCorrectionLevel: effectiveEcl,
      },
    });

    const exportDiv = document.createElement("div");
    exportInstance.append(exportDiv);

    // Wait for canvas to draw
    await new Promise((r) => setTimeout(r, 100));
    const rawExportCanvas = exportDiv.querySelector("canvas");
    if (!rawExportCanvas) throw new Error("Export canvas generation failed.");

    const framedCanvas = await compositeFramedQr(
      rawExportCanvas,
      {
        ...frameOptions,
        backgroundColor: format === "image/jpeg" ? styleOptions.bgColor : frameOptions.backgroundColor,
        transparentBg: format === "image/jpeg" ? false : frameOptions.transparentBg,
      },
      size
    );

    return new Promise((resolve, reject) => {
      framedCanvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error("Canvas blob conversion failed."));
        },
        format,
        0.95
      );
    });
  };

  const handleDownload = async (format: "png" | "jpeg" | "svg") => {
    try {
      setIsExporting(true);
      const filename = `${getExportFilename(formData)}.${format}`;

      if (format === "svg") {
        if (!qrCodeInstanceRef.current) return;
        await qrCodeInstanceRef.current.download({
          name: getExportFilename(formData),
          extension: "svg",
        });
      } else {
        const mime = format === "png" ? "image/png" : "image/jpeg";
        const blob = await generateExportBlob(mime, exportSize);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      setIsExporting(true);
      const blob = await generateExportBlob("image/png", exportSize);
      if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
        await navigator.clipboard.write([
          new ClipboardItem({
            "image/png": blob,
          }),
        ]);
        setHasCopied(true);
        setTimeout(() => setHasCopied(false), 2000);
      }
    } catch (err) {
      console.error("Copy to clipboard error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_QR_FORM_DATA);
    setStyleOptions(DEFAULT_STYLE_OPTIONS);
    setFrameOptions(INITIAL_FRAME_OPTIONS);
  };

  const QR_TYPE_TABS: { id: QrType; label: string; icon: any }[] = [
    { id: "url", label: "Link", icon: LinkIcon },
    { id: "text", label: "Text", icon: Type },
    { id: "wifi", label: "Wi-Fi", icon: Wifi },
    { id: "vcard", label: "Contact", icon: Contact },
    { id: "email", label: "Email", icon: Mail },
    { id: "phone", label: "Phone", icon: Phone },
    { id: "sms", label: "SMS", icon: MessageSquare },
    { id: "whatsapp", label: "WhatsApp", icon: Send },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto py-6 text-[var(--v2-text)]">
      {/* Hidden container for headless qr-code-styling canvas */}
      <div ref={rawQrContainerRef} className="hidden" aria-hidden="true" />
      <input
        ref={logoInputRef}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml"
        className="hidden"
        onChange={handleLogoUpload}
      />

      {/* Header */}
      <div className="text-center mb-8">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs v2-mono mb-4 border"
          style={{
            borderColor: "var(--v2-border)",
            background: "var(--v2-surface)",
            color: "var(--v2-accent-text)",
          }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Client-Side Vector & Canvas Engine</span>
        </div>
        <h1 className="v2-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[var(--v2-text)]">
          Custom QR Code Studio
        </h1>
        <p
          className="mt-3 text-base sm:text-lg max-w-2xl mx-auto"
          style={{ color: "var(--v2-muted)" }}
        >
          Generate beautiful, branded QR codes with live scannability checks, custom shapes,
          logos, and frame banners. 100% private, runs entirely on your device.
        </p>
      </div>

      {/* Two-Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Data Input & Styling Controls */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Type Selector Tabs */}
          <div
            className="rounded-2xl border p-2 flex flex-wrap gap-1.5"
            style={{
              background: "var(--v2-surface)",
              borderColor: "var(--v2-border)",
            }}
          >
            {QR_TYPE_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = formData.type === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, type: tab.id }))
                  }
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all active:scale-95"
                  style={{
                    background: isActive ? "var(--v2-accent)" : "transparent",
                    color: isActive ? "var(--v2-accent-ink)" : "var(--v2-muted)",
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form Content Card */}
          <div
            className="rounded-2xl border p-5 sm:p-6"
            style={{
              background: "var(--v2-surface)",
              borderColor: "var(--v2-border)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold v2-mono uppercase tracking-wider text-[var(--v2-text)]">
                Content Payload
              </h3>
              <div
                className="text-xs v2-mono"
                style={{
                  color: payloadLength > 280 ? "#f59e0b" : "var(--v2-faint)",
                }}
              >
                {payloadLength} characters
                {payloadLength > 280 && " (High density)"}
              </div>
            </div>

            {/* URL Form */}
            {formData.type === "url" && (
              <div className="flex flex-col gap-2">
                <label className="text-xs text-[var(--v2-muted)]">Website or destination URL</label>
                <input
                  type="text"
                  placeholder="https://example.com"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, url: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors"
                  style={{
                    background: "var(--v2-elevated)",
                    borderColor: "var(--v2-border)",
                    color: "var(--v2-text)",
                  }}
                />
              </div>
            )}

            {/* Plain Text Form */}
            {formData.type === "text" && (
              <div className="flex flex-col gap-2">
                <label className="text-xs text-[var(--v2-muted)]">Plain text message or note</label>
                <textarea
                  rows={4}
                  placeholder="Type any message, serial number, or note..."
                  value={formData.text}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, text: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors"
                  style={{
                    background: "var(--v2-elevated)",
                    borderColor: "var(--v2-border)",
                    color: "var(--v2-text)",
                  }}
                />
              </div>
            )}

            {/* Wi-Fi Form */}
            {formData.type === "wifi" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs text-[var(--v2-muted)]">Network Name (SSID)</label>
                  <input
                    type="text"
                    placeholder="Home_WiFi"
                    value={formData.wifi.ssid}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        wifi: { ...prev.wifi, ssid: e.target.value },
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                    style={{
                      background: "var(--v2-elevated)",
                      borderColor: "var(--v2-border)",
                      color: "var(--v2-text)",
                    }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[var(--v2-muted)]">Password</label>
                  <input
                    type="text"
                    placeholder="Network password"
                    value={formData.wifi.password}
                    disabled={formData.wifi.encryption === "nopass"}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        wifi: { ...prev.wifi, password: e.target.value },
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none disabled:opacity-50"
                    style={{
                      background: "var(--v2-elevated)",
                      borderColor: "var(--v2-border)",
                      color: "var(--v2-text)",
                    }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[var(--v2-muted)]">Security</label>
                  <select
                    value={formData.wifi.encryption}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        wifi: {
                          ...prev.wifi,
                          encryption: e.target.value as any,
                        },
                      }))
                    }
                    className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                    style={{
                      background: "var(--v2-elevated)",
                      borderColor: "var(--v2-border)",
                      color: "var(--v2-text)",
                    }}
                  >
                    <option value="WPA">WPA / WPA2 / WPA3</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">None (Open Network)</option>
                  </select>
                </div>

                <div className="sm:col-span-2 flex items-center gap-2 mt-1">
                  <input
                    id="wifi-hidden"
                    type="checkbox"
                    checked={formData.wifi.hidden}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        wifi: { ...prev.wifi, hidden: e.target.checked },
                      }))
                    }
                    className="rounded border-[var(--v2-border)]"
                  />
                  <label htmlFor="wifi-hidden" className="text-xs text-[var(--v2-muted)] cursor-pointer">
                    Hidden Network (SSID is not broadcast)
                  </label>
                </div>
              </div>
            )}

            {/* vCard Form */}
            {formData.type === "vcard" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-[var(--v2-muted)]">First Name</label>
                  <input
                    type="text"
                    placeholder="John"
                    value={formData.vcard.firstName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        vcard: { ...prev.vcard, firstName: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                    style={{
                      background: "var(--v2-elevated)",
                      borderColor: "var(--v2-border)",
                      color: "var(--v2-text)",
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-[var(--v2-muted)]">Last Name</label>
                  <input
                    type="text"
                    placeholder="Doe"
                    value={formData.vcard.lastName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        vcard: { ...prev.vcard, lastName: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                    style={{
                      background: "var(--v2-elevated)",
                      borderColor: "var(--v2-border)",
                      color: "var(--v2-text)",
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-[var(--v2-muted)]">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+1 555 123 4567"
                    value={formData.vcard.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        vcard: { ...prev.vcard, phone: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                    style={{
                      background: "var(--v2-elevated)",
                      borderColor: "var(--v2-border)",
                      color: "var(--v2-text)",
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-[var(--v2-muted)]">Email</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={formData.vcard.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        vcard: { ...prev.vcard, email: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                    style={{
                      background: "var(--v2-elevated)",
                      borderColor: "var(--v2-border)",
                      color: "var(--v2-text)",
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-[var(--v2-muted)]">Company</label>
                  <input
                    type="text"
                    placeholder="Acme Corp"
                    value={formData.vcard.company}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        vcard: { ...prev.vcard, company: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                    style={{
                      background: "var(--v2-elevated)",
                      borderColor: "var(--v2-border)",
                      color: "var(--v2-text)",
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-[var(--v2-muted)]">Job Title</label>
                  <input
                    type="text"
                    placeholder="Product Designer"
                    value={formData.vcard.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        vcard: { ...prev.vcard, title: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                    style={{
                      background: "var(--v2-elevated)",
                      borderColor: "var(--v2-border)",
                      color: "var(--v2-text)",
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-xs text-[var(--v2-muted)]">Website</label>
                  <input
                    type="text"
                    placeholder="https://example.com"
                    value={formData.vcard.website}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        vcard: { ...prev.vcard, website: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                    style={{
                      background: "var(--v2-elevated)",
                      borderColor: "var(--v2-border)",
                      color: "var(--v2-text)",
                    }}
                  />
                </div>
              </div>
            )}

            {/* Email Form */}
            {formData.type === "email" && (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-[var(--v2-muted)]">Recipient Email</label>
                  <input
                    type="email"
                    placeholder="support@example.com"
                    value={formData.email.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: { ...prev.email, email: e.target.value },
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                    style={{
                      background: "var(--v2-elevated)",
                      borderColor: "var(--v2-border)",
                      color: "var(--v2-text)",
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-[var(--v2-muted)]">Subject</label>
                  <input
                    type="text"
                    placeholder="Inquiry regarding design services"
                    value={formData.email.subject}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: { ...prev.email, subject: e.target.value },
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                    style={{
                      background: "var(--v2-elevated)",
                      borderColor: "var(--v2-border)",
                      color: "var(--v2-text)",
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-[var(--v2-muted)]">Pre-filled Body</label>
                  <textarea
                    rows={3}
                    placeholder="Hello Clyde, I would like to discuss..."
                    value={formData.email.body}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: { ...prev.email, body: e.target.value },
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                    style={{
                      background: "var(--v2-elevated)",
                      borderColor: "var(--v2-border)",
                      color: "var(--v2-text)",
                    }}
                  />
                </div>
              </div>
            )}

            {/* Phone Form */}
            {formData.type === "phone" && (
              <div className="flex flex-col gap-2">
                <label className="text-xs text-[var(--v2-muted)]">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+1 555 123 4567"
                  value={formData.phone.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      phone: { phone: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                  style={{
                    background: "var(--v2-elevated)",
                    borderColor: "var(--v2-border)",
                    color: "var(--v2-text)",
                  }}
                />
              </div>
            )}

            {/* SMS Form */}
            {formData.type === "sms" && (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-[var(--v2-muted)]">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+1 555 123 4567"
                    value={formData.sms.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        sms: { ...prev.sms, phone: e.target.value },
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                    style={{
                      background: "var(--v2-elevated)",
                      borderColor: "var(--v2-border)",
                      color: "var(--v2-text)",
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-[var(--v2-muted)]">Message</label>
                  <textarea
                    rows={3}
                    placeholder="Hello! Let's connect."
                    value={formData.sms.message}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        sms: { ...prev.sms, message: e.target.value },
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                    style={{
                      background: "var(--v2-elevated)",
                      borderColor: "var(--v2-border)",
                      color: "var(--v2-text)",
                    }}
                  />
                </div>
              </div>
            )}

            {/* WhatsApp Form */}
            {formData.type === "whatsapp" && (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-[var(--v2-muted)]">Phone Number (include country code, digits only)</label>
                  <input
                    type="tel"
                    placeholder="15551234567"
                    value={formData.whatsapp.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        whatsapp: { ...prev.whatsapp, phone: e.target.value },
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                    style={{
                      background: "var(--v2-elevated)",
                      borderColor: "var(--v2-border)",
                      color: "var(--v2-text)",
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-[var(--v2-muted)]">Pre-filled Chat Message</label>
                  <textarea
                    rows={3}
                    placeholder="Hi! I found your portfolio and would like to chat."
                    value={formData.whatsapp.message}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        whatsapp: { ...prev.whatsapp, message: e.target.value },
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                    style={{
                      background: "var(--v2-elevated)",
                      borderColor: "var(--v2-border)",
                      color: "var(--v2-text)",
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Collapsible Style Controls Accordion */}
          <div
            className="rounded-2xl border divide-y"
            style={{
              background: "var(--v2-surface)",
              borderColor: "var(--v2-border)",
              borderBottomColor: "var(--v2-border)",
            }}
          >
            {/* 1. Colors & Gradients */}
            <div>
              <button
                type="button"
                onClick={() =>
                  setActiveSection(activeSection === "colors" ? null : "colors")
                }
                className="w-full px-5 py-4 flex items-center justify-between text-left font-medium text-sm transition-colors hover:bg-[var(--v2-elevated)]"
              >
                <div className="flex items-center gap-2.5">
                  <Palette className="w-4 h-4 text-[var(--v2-accent-text)]" />
                  <span>Colors & Fill</span>
                </div>
                <span className="text-xs v2-mono" style={{ color: "var(--v2-muted)" }}>
                  {activeSection === "colors" ? "− Hide" : "+ Expand"}
                </span>
              </button>

              {activeSection === "colors" && (
                <div className="p-5 pt-2 flex flex-col gap-4">
                  {/* Fill mode selector */}
                  <div className="flex gap-2">
                    {(["solid", "linear", "radial"] as FillMode[]).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() =>
                          setStyleOptions((prev) => ({ ...prev, fillMode: mode }))
                        }
                        className="px-3 py-1.5 rounded-lg text-xs capitalize border transition-all"
                        style={{
                          borderColor:
                            styleOptions.fillMode === mode
                              ? "var(--v2-accent)"
                              : "var(--v2-border)",
                          background:
                            styleOptions.fillMode === mode
                              ? "var(--v2-accent)"
                              : "var(--v2-elevated)",
                          color:
                            styleOptions.fillMode === mode
                              ? "var(--v2-accent-ink)"
                              : "var(--v2-muted)",
                        }}
                      >
                        {mode} Fill
                      </button>
                    ))}
                  </div>

                  {/* Color pickers */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-[var(--v2-muted)]">Foreground Color 1</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={styleOptions.fgColor1}
                          onChange={(e) =>
                            setStyleOptions((prev) => ({
                              ...prev,
                              fgColor1: e.target.value,
                            }))
                          }
                          className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                        />
                        <input
                          type="text"
                          value={styleOptions.fgColor1}
                          onChange={(e) =>
                            setStyleOptions((prev) => ({
                              ...prev,
                              fgColor1: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-1.5 rounded-lg border text-xs v2-mono"
                          style={{
                            background: "var(--v2-elevated)",
                            borderColor: "var(--v2-border)",
                            color: "var(--v2-text)",
                          }}
                        />
                      </div>
                    </div>

                    {styleOptions.fillMode !== "solid" && (
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-[var(--v2-muted)]">Gradient Stop 2</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={styleOptions.fgColor2}
                            onChange={(e) =>
                              setStyleOptions((prev) => ({
                                ...prev,
                                fgColor2: e.target.value,
                              }))
                            }
                            className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                          />
                          <input
                            type="text"
                            value={styleOptions.fgColor2}
                            onChange={(e) =>
                              setStyleOptions((prev) => ({
                                ...prev,
                                fgColor2: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-1.5 rounded-lg border text-xs v2-mono"
                            style={{
                              background: "var(--v2-elevated)",
                              borderColor: "var(--v2-border)",
                              color: "var(--v2-text)",
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-[var(--v2-muted)]">Background Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={styleOptions.bgColor}
                          disabled={styleOptions.transparentBg}
                          onChange={(e) =>
                            setStyleOptions((prev) => ({
                              ...prev,
                              bgColor: e.target.value,
                            }))
                          }
                          className="w-8 h-8 rounded border-none cursor-pointer bg-transparent disabled:opacity-30"
                        />
                        <input
                          type="text"
                          value={styleOptions.bgColor}
                          disabled={styleOptions.transparentBg}
                          onChange={(e) =>
                            setStyleOptions((prev) => ({
                              ...prev,
                              bgColor: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-1.5 rounded-lg border text-xs v2-mono disabled:opacity-50"
                          style={{
                            background: "var(--v2-elevated)",
                            borderColor: "var(--v2-border)",
                            color: "var(--v2-text)",
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:self-end pb-2">
                      <input
                        id="transparent-bg"
                        type="checkbox"
                        checked={styleOptions.transparentBg}
                        onChange={(e) =>
                          setStyleOptions((prev) => ({
                            ...prev,
                            transparentBg: e.target.checked,
                          }))
                        }
                      />
                      <label htmlFor="transparent-bg" className="text-xs text-[var(--v2-muted)] cursor-pointer">
                        Transparent Background
                      </label>
                    </div>
                  </div>

                  {styleOptions.fillMode === "linear" && (
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-[var(--v2-muted)]">Gradient Angle</span>
                        <span className="v2-mono text-[var(--v2-faint)]">{styleOptions.gradientAngle}°</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        step="5"
                        value={styleOptions.gradientAngle}
                        onChange={(e) =>
                          setStyleOptions((prev) => ({
                            ...prev,
                            gradientAngle: parseInt(e.target.value),
                          }))
                        }
                        className="w-full accent-[var(--v2-accent)]"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 2. Shape & Dots */}
            <div>
              <button
                type="button"
                onClick={() =>
                  setActiveSection(activeSection === "shapes" ? null : "shapes")
                }
                className="w-full px-5 py-4 flex items-center justify-between text-left font-medium text-sm transition-colors hover:bg-[var(--v2-elevated)]"
              >
                <div className="flex items-center gap-2.5">
                  <Shapes className="w-4 h-4 text-[var(--v2-accent-text)]" />
                  <span>Pattern & Corner Shapes</span>
                </div>
                <span className="text-xs v2-mono" style={{ color: "var(--v2-muted)" }}>
                  {activeSection === "shapes" ? "− Hide" : "+ Expand"}
                </span>
              </button>

              {activeSection === "shapes" && (
                <div className="p-5 pt-2 flex flex-col gap-4">
                  {/* Dot Types */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-[var(--v2-muted)]">Body Dots Style</label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {(
                        [
                          "rounded",
                          "dots",
                          "classy",
                          "classy-rounded",
                          "square",
                          "extra-rounded",
                        ] as DotType[]
                      ).map((dot) => (
                        <button
                          key={dot}
                          type="button"
                          onClick={() =>
                            setStyleOptions((prev) => ({ ...prev, dotType: dot }))
                          }
                          className="px-2 py-2 rounded-xl text-xs capitalize border transition-all text-center"
                          style={{
                            borderColor:
                              styleOptions.dotType === dot
                                ? "var(--v2-accent)"
                                : "var(--v2-border)",
                            background:
                              styleOptions.dotType === dot
                                ? "var(--v2-accent)"
                                : "var(--v2-elevated)",
                            color:
                              styleOptions.dotType === dot
                                ? "var(--v2-accent-ink)"
                                : "var(--v2-muted)",
                          }}
                        >
                          {dot.replace("-", " ")}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Corner Square Style */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-[var(--v2-muted)]">Corner Squares</label>
                      <div className="flex gap-2">
                        {(["extra-rounded", "dot", "square"] as CornerSquareType[]).map((cs) => (
                          <button
                            key={cs}
                            type="button"
                            onClick={() =>
                              setStyleOptions((prev) => ({
                                ...prev,
                                cornerSquareType: cs,
                              }))
                            }
                            className="flex-1 px-3 py-2 rounded-xl text-xs capitalize border transition-all text-center"
                            style={{
                              borderColor:
                                styleOptions.cornerSquareType === cs
                                  ? "var(--v2-accent)"
                                  : "var(--v2-border)",
                              background:
                                styleOptions.cornerSquareType === cs
                                  ? "var(--v2-accent)"
                                  : "var(--v2-elevated)",
                              color:
                                styleOptions.cornerSquareType === cs
                                  ? "var(--v2-accent-ink)"
                                  : "var(--v2-muted)",
                            }}
                          >
                            {cs.replace("-", " ")}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-[var(--v2-muted)]">Corner Center Dots</label>
                      <div className="flex gap-2">
                        {(["dot", "square"] as CornerDotType[]).map((cd) => (
                          <button
                            key={cd}
                            type="button"
                            onClick={() =>
                              setStyleOptions((prev) => ({
                                ...prev,
                                cornerDotType: cd,
                              }))
                            }
                            className="flex-1 px-3 py-2 rounded-xl text-xs capitalize border transition-all text-center"
                            style={{
                              borderColor:
                                styleOptions.cornerDotType === cd
                                  ? "var(--v2-accent)"
                                  : "var(--v2-border)",
                              background:
                                styleOptions.cornerDotType === cd
                                  ? "var(--v2-accent)"
                                  : "var(--v2-elevated)",
                              color:
                                styleOptions.cornerDotType === cd
                                  ? "var(--v2-accent-ink)"
                                  : "var(--v2-muted)",
                            }}
                          >
                            {cd}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Center Logo */}
            <div>
              <button
                type="button"
                onClick={() =>
                  setActiveSection(activeSection === "logo" ? null : "logo")
                }
                className="w-full px-5 py-4 flex items-center justify-between text-left font-medium text-sm transition-colors hover:bg-[var(--v2-elevated)]"
              >
                <div className="flex items-center gap-2.5">
                  <ImageIcon className="w-4 h-4 text-[var(--v2-accent-text)]" />
                  <span>Center Logo</span>
                  {styleOptions.logoUrl && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  )}
                </div>
                <span className="text-xs v2-mono" style={{ color: "var(--v2-muted)" }}>
                  {activeSection === "logo" ? "− Hide" : "+ Expand"}
                </span>
              </button>

              {activeSection === "logo" && (
                <div className="p-5 pt-2 flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl border text-xs font-medium transition-colors hover:bg-[var(--v2-elevated)]"
                      style={{
                        borderColor: "var(--v2-border)",
                        color: "var(--v2-text)",
                      }}
                    >
                      {styleOptions.logoUrl ? "Replace Logo" : "Upload Logo (PNG, JPG, SVG)"}
                    </button>

                    {styleOptions.logoUrl && (
                      <button
                        type="button"
                        onClick={() =>
                          setStyleOptions((prev) => ({ ...prev, logoUrl: null }))
                        }
                        className="text-xs text-red-400 hover:underline"
                      >
                        Remove Logo
                      </button>
                    )}
                  </div>

                  {styleOptions.logoUrl && (
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-[var(--v2-muted)]">Logo Size (Capped at 28% for scanning safety)</span>
                          <span className="v2-mono text-[var(--v2-faint)]">
                            {Math.round(styleOptions.logoSize * 100)}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0.10"
                          max="0.28"
                          step="0.02"
                          value={styleOptions.logoSize}
                          onChange={(e) =>
                            setStyleOptions((prev) => ({
                              ...prev,
                              logoSize: parseFloat(e.target.value),
                            }))
                          }
                          className="w-full accent-[var(--v2-accent)]"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-[var(--v2-muted)]">Logo Margin</span>
                          <span className="v2-mono text-[var(--v2-faint)]">{styleOptions.logoMargin}px</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="15"
                          step="1"
                          value={styleOptions.logoMargin}
                          onChange={(e) =>
                            setStyleOptions((prev) => ({
                              ...prev,
                              logoMargin: parseInt(e.target.value),
                            }))
                          }
                          className="w-full accent-[var(--v2-accent)]"
                        />
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <input
                          id="hide-dots"
                          type="checkbox"
                          checked={styleOptions.hideDotsBehindLogo}
                          onChange={(e) =>
                            setStyleOptions((prev) => ({
                              ...prev,
                              hideDotsBehindLogo: e.target.checked,
                            }))
                          }
                        />
                        <label htmlFor="hide-dots" className="text-xs text-[var(--v2-muted)] cursor-pointer">
                          Clear pattern dots behind logo
                        </label>
                      </div>

                      <div
                        className="p-3 rounded-xl border text-xs leading-relaxed"
                        style={{
                          borderColor: "var(--v2-border)",
                          background: "var(--v2-elevated)",
                          color: "var(--v2-muted)",
                        }}
                      >
                        <strong className="text-[var(--v2-text)]">Scannability Guardrail:</strong> Error correction level is automatically boosted to <strong>High (30% recovery)</strong> while a logo is active to guarantee camera readability.
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 4. Frame & Badges */}
            <div>
              <button
                type="button"
                onClick={() =>
                  setActiveSection(activeSection === "frame" ? null : "frame")
                }
                className="w-full px-5 py-4 flex items-center justify-between text-left font-medium text-sm transition-colors hover:bg-[var(--v2-elevated)]"
              >
                <div className="flex items-center gap-2.5">
                  <Square className="w-4 h-4 text-[var(--v2-accent-text)]" />
                  <span>Frame & Label Banner</span>
                  {frameOptions.preset !== "none" && (
                    <span className="w-2 h-2 rounded-full bg-[var(--v2-accent)]" />
                  )}
                </div>
                <span className="text-xs v2-mono" style={{ color: "var(--v2-muted)" }}>
                  {activeSection === "frame" ? "− Hide" : "+ Expand"}
                </span>
              </button>

              {activeSection === "frame" && (
                <div className="p-5 pt-2 flex flex-col gap-4">
                  {/* Preset Buttons */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { id: "none", label: "No Frame" },
                      { id: "border", label: "Line Border" },
                      { id: "rounded", label: "Rounded Card" },
                      { id: "badge-bottom", label: "Bottom Badge" },
                      { id: "badge-top", label: "Top Badge" },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() =>
                          setFrameOptions((prev) => ({
                            ...prev,
                            preset: f.id as FramePreset,
                          }))
                        }
                        className="px-2.5 py-2 rounded-xl text-xs border text-center transition-all"
                        style={{
                          borderColor:
                            frameOptions.preset === f.id
                              ? "var(--v2-accent)"
                              : "var(--v2-border)",
                          background:
                            frameOptions.preset === f.id
                              ? "var(--v2-accent)"
                              : "var(--v2-elevated)",
                          color:
                            frameOptions.preset === f.id
                              ? "var(--v2-accent-ink)"
                              : "var(--v2-muted)",
                        }}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {frameOptions.preset !== "none" && (
                    <div className="flex flex-col gap-3 mt-1">
                      {(frameOptions.preset === "badge-bottom" ||
                        frameOptions.preset === "badge-top") && (
                        <div className="flex flex-col gap-1">
                          <label className="text-xs text-[var(--v2-muted)]">Banner Label Text</label>
                          <input
                            type="text"
                            value={frameOptions.text}
                            maxLength={24}
                            onChange={(e) =>
                              setFrameOptions((prev) => ({
                                ...prev,
                                text: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                            style={{
                              background: "var(--v2-elevated)",
                              borderColor: "var(--v2-border)",
                              color: "var(--v2-text)",
                            }}
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <label className="text-xs text-[var(--v2-muted)]">Frame / Badge Color</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={frameOptions.frameColor}
                              onChange={(e) =>
                                setFrameOptions((prev) => ({
                                  ...prev,
                                  frameColor: e.target.value,
                                }))
                              }
                              className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                            />
                            <input
                              type="text"
                              value={frameOptions.frameColor}
                              onChange={(e) =>
                                setFrameOptions((prev) => ({
                                  ...prev,
                                  frameColor: e.target.value,
                                }))
                              }
                              className="w-full px-3 py-1.5 rounded-lg border text-xs v2-mono"
                              style={{
                                background: "var(--v2-elevated)",
                                borderColor: "var(--v2-border)",
                                color: "var(--v2-text)",
                              }}
                            />
                          </div>
                        </div>

                        {(frameOptions.preset === "badge-bottom" ||
                          frameOptions.preset === "badge-top") && (
                          <div className="flex flex-col gap-1">
                            <label className="text-xs text-[var(--v2-muted)]">Text Color</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={frameOptions.textColor}
                                onChange={(e) =>
                                  setFrameOptions((prev) => ({
                                    ...prev,
                                    textColor: e.target.value,
                                  }))
                                }
                                className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                              />
                              <input
                                type="text"
                                value={frameOptions.textColor}
                                onChange={(e) =>
                                  setFrameOptions((prev) => ({
                                    ...prev,
                                    textColor: e.target.value,
                                  }))
                                }
                                className="w-full px-3 py-1.5 rounded-lg border text-xs v2-mono"
                                style={{
                                  background: "var(--v2-elevated)",
                                  borderColor: "var(--v2-border)",
                                  color: "var(--v2-text)",
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Reset Action */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 text-xs v2-mono transition-colors hover:text-[var(--v2-text)]"
              style={{ color: "var(--v2-muted)" }}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Defaults</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Sticky Live Preview, Scannability Audit & Export */}
        <div className="lg:col-span-5 sticky top-24 flex flex-col gap-4">
          <div
            className="rounded-2xl border p-6 flex flex-col items-center text-center"
            style={{
              background: "var(--v2-surface)",
              borderColor: "var(--v2-border)",
            }}
          >
            {/* Live Render Canvas */}
            <div
              className="relative p-4 rounded-xl border flex items-center justify-center overflow-hidden max-w-full"
              style={{
                borderColor: "var(--v2-border)",
                background: styleOptions.transparentBg ? "repeating-conic-gradient(#1e2128 0% 25%, #15171c 0% 50%) 50% / 16px 16px" : "#0e0f12",
              }}
            >
              <canvas
                ref={previewCanvasRef}
                className="max-w-[280px] sm:max-w-[320px] max-h-[360px] object-contain shadow-lg"
              />
            </div>

            {/* Scannability Diagnostics */}
            <div className="w-full mt-5 flex flex-col gap-2">
              {/* Camera Scan Status Badge */}
              <div
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs text-left"
                style={{
                  borderColor: isScannable
                    ? "rgba(16, 185, 129, 0.3)"
                    : "rgba(239, 68, 68, 0.3)",
                  background: isScannable
                    ? "rgba(16, 185, 129, 0.08)"
                    : "rgba(239, 68, 68, 0.08)",
                }}
              >
                <div className="flex items-center gap-2">
                  {isScannable ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                  )}
                  <div>
                    <div
                      className="font-medium"
                      style={{ color: isScannable ? "#34d399" : "#f87171" }}
                    >
                      {isScannable
                        ? "Scannable with smartphone camera"
                        : "Potentially unscannable"}
                    </div>
                    <div className="text-[11px] text-[var(--v2-muted)] mt-0.5">
                      {scanDiagnostic}
                    </div>
                  </div>
                </div>

                <span className="v2-mono text-[10px] px-2 py-0.5 rounded border border-white/10 uppercase">
                  ECL {effectiveEcl}
                </span>
              </div>

              {/* Contrast warning if applicable */}
              {contrastAudit.warning && (
                <div
                  className="flex items-start gap-2 p-2.5 rounded-xl border text-xs text-left"
                  style={{
                    borderColor: "rgba(245, 158, 11, 0.3)",
                    background: "rgba(245, 158, 11, 0.08)",
                    color: "#fbbf24",
                  }}
                >
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-relaxed">{contrastAudit.warning}</span>
                </div>
              )}
            </div>

            {/* Resolution Selector */}
            <div className="w-full mt-4 flex items-center justify-between text-xs">
              <span className="text-[var(--v2-muted)]">Export Size</span>
              <div className="flex gap-1.5">
                {[512, 1024, 2048].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setExportSize(size)}
                    className="px-2.5 py-1 rounded-lg border v2-mono transition-colors"
                    style={{
                      borderColor:
                        exportSize === size
                          ? "var(--v2-accent)"
                          : "var(--v2-border)",
                      background:
                        exportSize === size
                          ? "var(--v2-accent)"
                          : "var(--v2-elevated)",
                      color:
                        exportSize === size
                          ? "var(--v2-accent-ink)"
                          : "var(--v2-muted)",
                    }}
                  >
                    {size}px
                  </button>
                ))}
              </div>
            </div>

            {/* Export Action Buttons */}
            <div className="w-full grid grid-cols-2 gap-2 mt-4">
              <button
                type="button"
                onClick={() => handleDownload("png")}
                disabled={isExporting}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium transition-transform active:scale-95 shadow-sm"
                style={{
                  background: "var(--v2-accent)",
                  color: "var(--v2-accent-ink)",
                }}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PNG</span>
              </button>

              <button
                type="button"
                onClick={handleCopyToClipboard}
                disabled={isExporting}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium border transition-colors hover:bg-[var(--v2-elevated)]"
                style={{
                  borderColor: "var(--v2-border)",
                  color: "var(--v2-text)",
                }}
              >
                {hasCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy PNG</span>
                  </>
                )}
              </button>
            </div>

            <div className="w-full grid grid-cols-2 gap-2 mt-2">
              <button
                type="button"
                onClick={() => handleDownload("svg")}
                disabled={isExporting}
                className="px-3 py-2 rounded-full text-xs font-medium border transition-colors hover:bg-[var(--v2-elevated)]"
                style={{
                  borderColor: "var(--v2-border)",
                  color: "var(--v2-muted)",
                }}
                title={frameOptions.preset !== "none" ? "Exports vector QR without raster frame banner" : "Export crisp scalable vector"}
              >
                Download SVG
              </button>

              <button
                type="button"
                onClick={() => handleDownload("jpeg")}
                disabled={isExporting}
                className="px-3 py-2 rounded-full text-xs font-medium border transition-colors hover:bg-[var(--v2-elevated)]"
                style={{
                  borderColor: "var(--v2-border)",
                  color: "var(--v2-muted)",
                }}
              >
                Download JPEG
              </button>
            </div>

            {frameOptions.preset !== "none" && (
              <p className="text-[11px] v2-mono mt-3" style={{ color: "var(--v2-faint)" }}>
                Note: Frame banners are composited into high-res PNG & JPEG exports. SVG exports the clean vector code.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Trust & Privacy Notice */}
      <div
        className="mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs v2-mono"
        style={{
          borderColor: "var(--v2-border)",
          color: "var(--v2-faint)",
        }}
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Everything is generated on your device. Nothing is uploaded.</span>
        </div>

        <div>
          <span>
            Powered by{" "}
            <a
              href="https://github.com/kozakdenys/qr-code-styling"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-[var(--v2-muted)]"
            >
              qr-code-styling (MIT)
            </a>{" "}
            and{" "}
            <a
              href="https://github.com/cozmo/jsQR"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-[var(--v2-muted)]"
            >
              jsQR (Apache-2.0)
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
