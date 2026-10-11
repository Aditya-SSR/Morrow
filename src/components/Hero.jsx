"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(useGSAP, SplitText);

/**
 * Hero — the landing composition. Once the preloader begins wiping away (`ready`),
 * the text reveals word-by-word with the same blur-fade used in the intro, so the
 * two read as one continuous motion. A magnetic pull on the black CTA gives it a
 * physical response.
 *
 * Props:
 *  - ready: boolean — flips true when the preloader starts its wipe.
 */
export default function Hero({ ready }) {
  const root = useRef(null);
  const ctaRef = useRef(null);
  const { contextSafe } = useGSAP(
    () => {
      if (!ready) return;
      if (prefersReducedMotion()) return; // leave everything in its natural state

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Wordmark.
      tl.from("[data-hero='mark']", { autoAlpha: 0, y: 10, duration: 0.6 }, 0.05);

      // Headline — same blur-fade as the preloader, revealed word-by-word.
      const headline = new SplitText("[data-hero='headline']", {
        type: "words",
        wordsClass: "hero-word",
      });
      tl.fromTo(
        headline.words,
        { opacity: 0, y: 26, filter: "blur(12px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.85,
          stagger: 0.055,
        },
        0.15
      );

      // CTA — settle in beneath the type.
      tl.from(
        "[data-hero='cta']",
        { autoAlpha: 0, y: 18, duration: 0.7 },
        "-=0.45"
      );

      // Magnetic button — physical response tied to pointer position.
      const cta = ctaRef.current;
      if (!cta) return;
      const xTo = gsap.quickTo(cta, "x", { duration: 0.4, ease: "power3" });
      const yTo = gsap.quickTo(cta, "y", { duration: 0.4, ease: "power3" });

      const move = contextSafe((e) => {
        const r = cta.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.3);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.3);
      });
      const leave = contextSafe(() => {
        xTo(0);
        yTo(0);
      });

      cta.addEventListener("pointermove", move);
      cta.addEventListener("pointerleave", leave);
      return () => {
        cta.removeEventListener("pointermove", move);
        cta.removeEventListener("pointerleave", leave);
      };
    },
    { scope: root, dependencies: [ready] }
  );

  return (
    <section
      ref={root}
      className="bg-cream relative flex min-h-screen flex-col justify-between overflow-hidden px-6 pt-8 pb-14 sm:px-10"
    >
      {/* Top — wordmark */}
      <header className="flex w-full items-center justify-start">
        <a
          href="/"
          data-hero="mark"
          className="font-display text-ink text-lg font-bold tracking-tight"
        >
          morrow
        </a>
      </header>

      {/* Center — the layered statement */}
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <h1
          data-hero="headline"
          className="font-display text-ink max-w-4xl text-[11vw] leading-[0.98] font-bold tracking-[-0.03em] text-balance sm:text-6xl md:text-7xl"
        >
          Every future deserves a beginning.
          <span className="text-ink-soft mt-1 block">
            Morrow makes it possible
          </span>
        </h1>

        <a
          href="#mission"
          data-hero="cta"
          ref={ctaRef}
          className="group bg-ink text-cream hover:bg-ink/90 mt-11 inline-flex items-center gap-3 rounded-full px-7 py-3.5 transition-colors duration-300"
        >
          <span className="font-body text-sm font-medium">
            Discover our mission
          </span>
          <span
            aria-hidden
            className="bg-cream inline-block h-1.5 w-1.5 rounded-full transition-transform duration-300 group-hover:scale-150"
          />
        </a>
      </div>

      {/* Kept intentionally empty — the composition breathes with nothing below. */}
    </section>
  );
}