"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw, X } from "lucide-react";
import RoomImage from "./RoomImage";
import { ROOM_VIEWS, type RoomView } from "@/data/views";
import { containFrame, type Box } from "@/lib/frame";
import { useElementSize } from "@/hooks/useElementSize";

const ASPECT = 4 / 3;
const COUNT = ROOM_VIEWS.length;
/** Seconds each viewpoint is "held" before the next one fades in. */
const SHOT = 7;
/** Crossfade length between viewpoints (seconds). */
const FADE = 1.8;
const ease = [0.22, 1, 0.36, 1] as const;
/** Smallest size of the render during the camera move (never above 1 → never cropped). */
const MIN_SCALE = 0.94;

const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

type Props = {
  onClose: () => void;
  onExplore: () => void;
  ctaHref: string;
};

/**
 * Guided presentation: the four original renders in sequence, each shown in
 * full with a slow settle-and-drift and a crossfade to the next viewpoint.
 * No geometry is generated and no render is ever cropped.
 */
export default function Walkthrough({ onClose, onExplore, ctaHref }: Props) {
  const reduce = useReducedMotion() ?? false;
  const [boxRef, box] = useElementSize<HTMLDivElement>();
  const closeRef = useRef<HTMLButtonElement>(null);

  // One clock drives everything (camera, progress bars) — pausing stops it all.
  const time = useMotionValue(0);
  const [shot, setShot] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [finished, setFinished] = useState(false);
  const [intro, setIntro] = useState(true);
  const playingRef = useRef(true);
  playingRef.current = playing && !finished;

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      // rAF timestamps can precede performance.now() on the first frame — never step backwards.
      const dt = Math.min(0.1, Math.max(0, (now - last) / 1000));
      last = now;
      if (playingRef.current) {
        const t = time.get() + dt;
        const total = SHOT * COUNT;
        if (t >= total) {
          time.set(total);
          setFinished(true);
        } else {
          time.set(t);
          const s = Math.min(COUNT - 1, Math.max(0, Math.floor(t / SHOT)));
          setShot((cur) => (cur === s ? cur : s));
          if (t > 2.4) setIntro(false);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [time]);

  const seek = useCallback(
    (i: number) => {
      const target = ((i % COUNT) + COUNT) % COUNT;
      time.set(target * SHOT);
      setShot(target);
      setFinished(false);
      setIntro(false);
    },
    [time],
  );

  const replay = () => {
    time.set(0);
    setShot(0);
    setFinished(false);
    setPlaying(true);
    setIntro(true);
  };

  // Lock page scroll, manage focus, keyboard.
  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      html.style.overflow = prevOverflow;
      prevFocus?.focus?.({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") seek(shot + 1);
      else if (e.key === "ArrowLeft") seek(shot - 1);
      else if (e.key === " ") {
        e.preventDefault();
        if (finished) replay();
        else setPlaying((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shot, finished, onClose, seek]);

  // Swipe between viewpoints.
  const touch = useRef<{ x: number; y: number } | null>(null);

  const view = ROOM_VIEWS[shot];

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Обзор интерьера спальни"
      className="fixed inset-0 z-[60] grid touch-none select-none grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden bg-night-deep text-paper [grid-template-areas:'top'_'stage'_'bottom'] short-landscape:grid-cols-[minmax(0,1fr)_minmax(200px,30%)] short-landscape:grid-rows-[auto_minmax(0,1fr)] short-landscape:[grid-template-areas:'stage_top'_'stage_bottom']"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease }}
      onPointerDown={(e) => (touch.current = { x: e.clientX, y: e.clientY })}
      onPointerUp={(e) => {
        const t = touch.current;
        touch.current = null;
        if (!t || finished) return;
        const dx = e.clientX - t.x;
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(e.clientY - t.y)) seek(shot + (dx < 0 ? 1 : -1));
      }}
    >
      {/* Image area: the render is fitted inside it in full (contain). */}
      <div className="relative min-h-0 min-w-0 px-0 sm:px-6 [grid-area:stage] short-landscape:px-0 short-landscape:py-2 short-landscape:pl-2">
        <div ref={boxRef} className="relative h-full w-full">
          <AnimatePresence initial={false}>
            {box.width > 0 && (
              <ShotLayer key={shot} view={view} index={shot} box={box} time={time} reduce={reduce} />
            )}
          </AnimatePresence>
        </div>

        {/* Intro title */}
        <AnimatePresence>
          {intro && !finished && (
            <motion.div
              className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center bg-night-deep/55 px-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 1.2 } }}
              transition={{ duration: 1, ease }}
            >
              <p className="eyebrow text-accent">Обзор проекта</p>
              <p className="display mt-5 text-[clamp(2.25rem,8vw,4.25rem)] leading-none">Частная резиденция</p>
              <p className="mt-5 max-w-xs text-[13px] leading-[1.75] text-paper/60">
                Четыре ракурса спальни в последовательной презентации.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Preload the next viewpoint */}
      <div aria-hidden className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0">
        <RoomImage id={ROOM_VIEWS[(shot + 1) % COUNT].id} alt="" sizes="100vw" priority blur={false} />
      </div>

      {/* Top bar: progress + close (outside the image) */}
      <div className="relative z-40 px-4 pb-4 pt-4 [grid-area:top] sm:px-8 short-landscape:px-5 short-landscape:pt-3">
        <div className="flex gap-1.5" aria-hidden>
          {ROOM_VIEWS.map((v, i) => (
            <ProgressSegment key={v.id} index={i} time={time} />
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="wordmark text-[13px] text-paper/80">Hermitage</span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="icon-btn -mr-2 text-paper/75 hover:text-paper"
            aria-label="Закрыть обзор"
          >
            <X className="h-5 w-5" strokeWidth={1.25} />
          </button>
        </div>
      </div>

      {/* Bottom bar: caption + controls (outside the image) */}
      <div className="relative z-20 flex min-h-[7.5rem] items-end justify-between gap-4 px-5 pb-6 pt-4 [grid-area:bottom] sm:px-8 short-landscape:min-h-0 short-landscape:flex-col short-landscape:items-start short-landscape:justify-end short-landscape:pb-3">
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            {!finished && (
              <motion.div
                key={view.id}
                initial={{ opacity: 0, y: reduce ? 0 : 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease, delay: 0.3 }}
              >
                <p className="eyebrow text-accent">
                  Ракурс {view.number} <span className="text-paper/30">/ 0{COUNT}</span>
                </p>
                <p className="display mt-3 text-[2rem] leading-[1.08] sm:text-[3rem] short-landscape:mt-2 short-landscape:text-2xl">
                  {view.title}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {!finished && (
          <div className="flex shrink-0 items-center gap-1 short-landscape:-ml-2">
            <button
              type="button"
              onClick={() => seek(shot - 1)}
              className="icon-btn text-paper/75 hover:text-paper"
              aria-label="Предыдущий ракурс"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.25} />
            </button>
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              className="icon-btn h-12 w-12 border border-paper/25 text-paper hover:border-paper/60"
              aria-label={playing ? "Приостановить обзор" : "Продолжить обзор"}
            >
              {playing ? (
                <Pause className="h-4 w-4 fill-current" strokeWidth={1} />
              ) : (
                <Play className="h-4 w-4 translate-x-px fill-current" strokeWidth={1} />
              )}
            </button>
            <button
              type="button"
              onClick={() => seek(shot + 1)}
              className="icon-btn text-paper/75 hover:text-paper"
              aria-label="Следующий ракурс"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={1.25} />
            </button>
          </div>
        )}
      </div>

      {/* End card */}
      <AnimatePresence>
        {finished && (
          <motion.div
            className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-night-deep/85 px-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease }}
          >
            <p className="eyebrow text-accent">Конец обзора</p>
            <p className="display mt-5 text-[clamp(2.125rem,7vw,3.75rem)] leading-[1.08]">
              Ваше пространство. <em className="italic text-paper/70">Ваш замысел.</em>
            </p>
            <div className="mt-10 flex w-full max-w-xs flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={onExplore}
                className="btn bg-paper text-ink hover:bg-accent hover:text-paper"
              >
                Смотреть ракурсы
              </button>
              <a
                href={ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn border border-paper/25 text-paper hover:border-paper/70"
              >
                Обсудить проект
              </a>
            </div>
            <button
              type="button"
              onClick={replay}
              className="text-link mt-6 text-paper/55 hover:text-paper"
            >
              <RotateCcw className="h-3 w-3" strokeWidth={1.25} aria-hidden />
              <span className="text-link-label">Повторить обзор</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ------------------------------------------------------------------------- */

function ShotLayer({
  view,
  index,
  box,
  time,
  reduce,
}: {
  view: RoomView;
  index: number;
  box: Box;
  time: MotionValue<number>;
  reduce: boolean;
}) {
  const start = index * SHOT;
  // The full render, fitted inside the available area.
  const frame = containFrame(box, ASPECT);

  /*
   * Gentle camera move without cropping: the render settles from 94% to 100%
   * of its fitted size while drifting sideways inside its own margin. Scale
   * never exceeds 1 and the drift never exceeds the margin, so all four edges
   * of the render stay visible at every moment.
   */
  const progress = (v: number) => (reduce ? 1 : easeInOutSine(clamp01((v - start) / (SHOT + FADE))));
  const scale = useTransform(time, (v) => MIN_SCALE + (1 - MIN_SCALE) * progress(v));
  const x = useTransform(time, (v) => {
    const s = MIN_SCALE + (1 - MIN_SCALE) * progress(v);
    return -view.drift * ((1 - s) / 2) * frame.w * 0.9;
  });

  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0, zIndex: 2 }}
      animate={{ opacity: 1, zIndex: 2 }}
      exit={{ opacity: 0, zIndex: 1, transition: { duration: reduce ? 0.4 : FADE, ease: "easeInOut" } }}
      transition={{ duration: reduce ? 0.4 : FADE, ease: "easeInOut" }}
    >
      <motion.div
        className="absolute will-change-transform"
        style={{ left: frame.x, top: frame.y, width: frame.w, height: frame.h, x, scale }}
      >
        <RoomImage id={view.id} alt={view.alt} sizes="100vw" priority className="h-full w-full object-contain" />
      </motion.div>
    </motion.div>
  );
}

function ProgressSegment({ index, time }: { index: number; time: MotionValue<number> }) {
  const scaleX = useTransform(time, (v) => clamp01((v - index * SHOT) / SHOT));
  return (
    <span className="relative h-px flex-1 overflow-hidden bg-paper/15">
      <motion.span className="absolute inset-0 origin-left bg-paper/85" style={{ scaleX }} />
    </span>
  );
}
