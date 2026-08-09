"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type LaptopBrowserMockupProps = {
  src: string;
  alt: string;
  url?: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  quality?: number;
  priority?: boolean;
};

export function LaptopBrowserMockup({
  src,
  alt,
  url,
  className,
  imageClassName,
  sizes = "(max-width: 768px) 92vw, 620px",
  quality = 70,
  priority = false,
}: LaptopBrowserMockupProps) {
  return (
    <div className={cn("laptop-mockup", className)}>
      <div className="laptop-mockup-lid">
        <div className="laptop-mockup-bezel">
          <div className="laptop-mockup-browser">
            <div className="laptop-mockup-chrome">
              <div className="laptop-mockup-dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <div className="laptop-mockup-address">
                <span className="laptop-mockup-address-text">
                  {url ?? "clydeabenojar.site"}
                </span>
              </div>
            </div>
            <div className="laptop-mockup-screen">
              <Image
                src={src}
                alt={alt}
                fill
                quality={quality}
                priority={priority}
                sizes={sizes}
                className={cn("object-cover object-top", imageClassName)}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="laptop-mockup-base" aria-hidden="true">
        <div className="laptop-mockup-notch" />
      </div>
    </div>
  );
}
