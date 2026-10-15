"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { focus } from "@/components/site/ui";

type Slide = { src: string; alt: string; caption: string };

/** Screenshots that swipe on touch and step with buttons on every device. */
export function EvidenceCarousel({ slides }: { slides: Slide[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const many = slides.length > 1;

  const goTo = (next: number) => {
    const el = track.current;
    if (!el) return;
    const target = Math.max(0, Math.min(slides.length - 1, next));
    el.scrollTo({ left: target * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div aria-roledescription="carousel" aria-label="Screenshots">
      <div
        ref={track}
        onScroll={(event) => {
          const el = event.currentTarget;
          setIndex(Math.round(el.scrollLeft / el.clientWidth));
        }}
        className="hero-rail-scroll flex snap-x snap-mandatory overflow-x-auto rounded-2xl border border-line bg-night shadow-sm"
      >
        {slides.map((slide, i) => (
          <figure
            key={slide.src + slide.caption}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}`}
            className="w-full shrink-0 snap-start"
          >
            <div className="relative aspect-[16/10]">
              <Image src={slide.src} alt={slide.alt} fill sizes="(max-width: 1024px) 100vw, 800px" className="object-cover object-top" />
            </div>
          </figure>
        ))}
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <p className="text-sm text-mist" aria-live="polite">
          {slides[index]?.caption}
        </p>
        {many ? (
          <div className="flex shrink-0 items-center gap-2">
            <span className="mr-1 text-sm text-mist tabular-nums">
              {index + 1} / {slides.length}
            </span>
            <button
              type="button"
              aria-label="Previous screenshot"
              disabled={index === 0}
              onClick={() => goTo(index - 1)}
              className={`flex size-10 items-center justify-center rounded-full border border-line bg-canvas text-fog transition hover:border-purple disabled:opacity-40 ${focus}`}
            >
              <ChevronLeft aria-hidden className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next screenshot"
              disabled={index === slides.length - 1}
              onClick={() => goTo(index + 1)}
              className={`flex size-10 items-center justify-center rounded-full border border-line bg-canvas text-fog transition hover:border-purple disabled:opacity-40 ${focus}`}
            >
              <ChevronRight aria-hidden className="size-5" />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
