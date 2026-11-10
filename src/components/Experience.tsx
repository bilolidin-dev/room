"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "motion/react";
import Loader from "./Loader";
import SiteHeader from "./SiteHeader";
import Hero from "./Hero";
import ViewExplorer from "./ViewExplorer";
import Walkthrough from "./Walkthrough";
import ProjectInfo from "./ProjectInfo";
import Gallery from "./Gallery";
import ClosingCTA from "./ClosingCTA";
import SiteFooter from "./SiteFooter";
import { whatsappHref } from "@/config/site";

// The lightbox (zoom, fullscreen, thumbnails) is only downloaded when first opened.
const RoomLightbox = dynamic(() => import("./RoomLightbox"), { ssr: false });

const MIN_LOADER_MS = 1100;
const MAX_LOADER_MS = 3500;

export default function Experience() {
  /* Loader: wait for the hero render (with a minimum for a calm entrance, and a hard cap). */
  const [heroReady, setHeroReady] = useState(false);
  const [minElapsed, setMinElapsed] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  useEffect(() => {
    const a = setTimeout(() => setMinElapsed(true), MIN_LOADER_MS);
    const b = setTimeout(() => setTimedOut(true), MAX_LOADER_MS);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);
  const revealed = (heroReady && minElapsed) || timedOut;
  const onHeroReady = useCallback(() => setHeroReady(true), []);

  /* Shared viewpoint state */
  const [view, setView] = useState({ index: 0, direction: 1 });
  const onNavigate = useCallback((index: number, direction: number) => setView({ index, direction }), []);

  /* Overlays */
  const [walkthrough, setWalkthrough] = useState(false);
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number; fullscreen: boolean; loaded: boolean }>({
    open: false,
    index: 0,
    fullscreen: false,
    loaded: false,
  });
  const openLightbox = useCallback(
    (index: number, fullscreen = false) => setLightbox({ open: true, index, fullscreen, loaded: true }),
    [],
  );
  const closeLightbox = useCallback(() => setLightbox((l) => ({ ...l, open: false })), []);

  const ctaHref = whatsappHref();
  const exploreRef = useRef(false);

  return (
    <>
      <Loader visible={!revealed} />
      <SiteHeader />
      <main>
        <Hero revealed={revealed} onImageReady={onHeroReady} onWalkthrough={() => setWalkthrough(true)} />
        <ViewExplorer
          index={view.index}
          onNavigate={onNavigate}
          onFullscreen={(i) => openLightbox(i, true)}
          onWalkthrough={() => setWalkthrough(true)}
          keyboardEnabled={!walkthrough && !lightbox.open}
        />
        <ProjectInfo />
        <Gallery onOpen={(i) => openLightbox(i)} />
        <ClosingCTA href={ctaHref} />
      </main>
      <SiteFooter />

      <AnimatePresence
        onExitComplete={() => {
          if (exploreRef.current) {
            exploreRef.current = false;
            document.getElementById("views")?.scrollIntoView({ behavior: "smooth" });
          }
        }}
      >
        {walkthrough && (
          <Walkthrough
            key="walkthrough"
            ctaHref={ctaHref}
            onClose={() => setWalkthrough(false)}
            onExplore={() => {
              exploreRef.current = true;
              setView({ index: 0, direction: 1 });
              setWalkthrough(false);
            }}
          />
        )}
      </AnimatePresence>

      {lightbox.loaded && (
        <RoomLightbox
          open={lightbox.open}
          index={lightbox.index}
          autoFullscreen={lightbox.fullscreen}
          onClose={closeLightbox}
        />
      )}
    </>
  );
}
