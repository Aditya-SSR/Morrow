"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * SmoothScroll — wires Lenis (inertia) into GSAP's ticker so ScrollTrigger
 * reads true scroll position. Follows the canonical Lenis + GSAP handshake:
 * drive lenis.raf from gsap.ticker and keep ScrollTrigger in sync.
 *
 * Props:
 *  - locked: boolean — while true, scroll is frozen (used during the preloader).
 */
export default function SmoothScroll({ children, locked = false }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return; // native scroll, no inertia (Apple a11y rule)

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (locked) lenis.stop();
    else lenis.start();
  }, [locked]);

  return children;
}
