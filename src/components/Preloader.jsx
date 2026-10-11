"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(useGSAP, SplitText);

const SENTENCES = [
  "What did you want to become when you were younger?",
  "And who helped you believe it was possible?",
  "Not everyone has someone to ask.",
  "We want to change that.",
];

/**
 * Preloader — introduces the site through four statements instead of a counter.
 * A bare cream field, one sentence at a time. Each reveals word-by-word with a
 * clean blur-fade, holds, then dissolves before the next. When the last clears,
 * the overlay wipes up and hands off to the hero via onComplete so the whole
 * thing reads as one continuous motion.
 */
export default function Preloader({ onReveal, onDone }) {
  const root = useRef(null);
  const sentenceRefs = useRef([]);
  const { contextSafe } = useGSAP(
    () => {
      // Reduced motion: skip the performance, hand off immediately.
      if (prefersReducedMotion()) {
        gsap.set(root.current, { autoAlpha: 0 });
        onReveal?.();
        onDone?.();
        return;
      }

      const build = () => {
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
        });

        sentenceRefs.current.forEach((el, i) => {
          if (!el) return;

          const split = new SplitText(el, {
            type: "words",
            wordsClass: "pre-word",
          });
          const words = split.words;

          // Reveal the sentence container (visibility) so words can show.
          tl.set(el, { autoAlpha: 1 }, i === 0 ? 0.15 : "+=0.1")
            // Per-word: blur + rise + fade in.
            .fromTo(
              words,
              { opacity: 0, y: 26, filter: "blur(12px)" },
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.75,
                stagger: 0.07,
              },
              "<"
            )
            // Hold, then dissolve word-by-word (blur back + lift).
            .to(
              words,
              {
                opacity: 0,
                y: -18,
                filter: "blur(10px)",
                duration: 0.55,
                ease: "power2.in",
                stagger: { each: 0.02, from: "end" },
              },
              "+=0.6"
            )
            // Hide the container again so nothing lingers.
            .set(el, { autoAlpha: 0 });
        });

        // Wipe the overlay up to reveal the hero underneath. onReveal fires the
        // instant the wipe begins so the hero can animate in *beneath* it for a
        // seamless handoff; onDone fires once it's fully gone so we can unmount.
        tl.to(
          root.current,
          {
            yPercent: -100,
            duration: 1,
            ease: "power4.inOut",
            onStart: () => onReveal?.(),
          },
          "+=0.1"
        ).eventCallback("onComplete", () => onDone?.());
      };

      // Split only once webfonts are ready to avoid layout shift. Wrap the
      // deferred call in contextSafe so the tweens still register to the context.
      if (document.fonts && document.fonts.status !== "loaded") {
        document.fonts.ready.then(contextSafe(build));
      } else {
        build();
      }
    },
    { scope: root }
  );

  return (
    <div
      ref={root}
      className="bg-cream fixed inset-0 z-50 flex items-center justify-center px-6"
    >
      <div className="relative flex min-h-[9rem] w-full max-w-3xl items-center justify-center">
        {SENTENCES.map((sentence, i) => (
          <p
            key={i}
            ref={(el) => (sentenceRefs.current[i] = el)}
            style={{ visibility: "hidden" }}
            className="font-display text-ink absolute text-center text-2xl leading-snug font-medium tracking-tight text-balance sm:text-4xl md:text-5xl"
          >
            {sentence}
          </p>
        ))}
      </div>
    </div>
  );
}
