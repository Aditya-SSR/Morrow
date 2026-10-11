"use client";

import { useState } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import Hero from "@/components/Hero";

export default function Home() {
  // `revealed` flips the moment the preloader begins wiping away, so the hero
  // animates in *beneath* it for one continuous motion. `done` flips once the
  // overlay has fully cleared — that is when we unmount it and unlock scroll.
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);

  return (
    <SmoothScroll locked={!done}>
      <Hero ready={revealed} />
      {!done && (
        <Preloader
          onReveal={() => setRevealed(true)}
          onDone={() => setDone(true)}
        />
      )}
    </SmoothScroll>
  );
}