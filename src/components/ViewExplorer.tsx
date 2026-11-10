"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { ChevronLeft, ChevronRight, Maximize2, Play, X } from "lucide-react";
import RoomImage from "./RoomImage";
import { ROOM_VIEWS, type Hotspot, type RoomView } from "@/data/views";

const COUNT = ROOM_VIEWS.length;
const ease = [0.22, 1, 0.36, 1] as const;
const STAGE_SIZES = "(min-width: 1440px) 1100px, (min-width: 768px) 80vw, 100vw";

type Props = {
  index: number;
  onNavigate: (index: number, direction: number) => void;
  onFullscreen: (index: number) => void;
  onWalkthrough: () => void;
  /** Disable keyboard handling while an overlay is open. */
  keyboardEnabled: boolean;
};

/**
 * Four-view stage. The stage has the exact 4:3 proportions of the renders and
 * is sized to fit the viewport, so every viewpoint is always shown in full:
 * no crop, no zoom past the frame, no movement outside the visible area.
 * All controls sit outside the image.
 */
export default function ViewExplorer({
  index,
  onNavigate,
  onFullscreen,
  onWalkthrough,
  keyboardEnabled,
}: Props) {
  const reduce = useReducedMotion() ?? false;
  const sectionRef = useRef<HTMLElement>(null);
  const [showDetails, setShowDetails] = useState(true);
  const [active, setActive] = useState<Hotspot | null>(null);
  const [interacted, setInteracted] = useState(false);
  const view = ROOM_VIEWS[index];

  const go = useCallback(
    (dir: number) => {
      setActive(null);
      setInteracted(true);
      onNavigate((index + dir + COUNT) % COUNT, dir);
    },
    [index, onNavigate],
  );

  const goTo = useCallback(
    (i: number) => {
      if (i === index) return;
      setActive(null);
      setInteracted(true);
      onNavigate(i, i > index ? 1 : -1);
    },
    [index, onNavigate],
  );

  /* ---------- Keyboard (desktop): only while the section is on screen ---------- */
  const inView = useRef(false);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => (inView.current = e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!keyboardEnabled) return;
    const onKey = (e: KeyboardEvent) => {
      if (!inView.current || e.altKey || e.ctrlKey || e.metaKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      } else if (e.key === "Escape") {
        setActive(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, keyboardEnabled]);

  /* ---------- Swipe / drag ----------
   * The image never moves while dragging (that would push it out of frame);
   * a soft dim gives feedback instead. */
  const dragX = useMotionValue(0);
  const dragOpacity = useTransform(dragX, [-160, 0, 160], [0.55, 1, 0.55]);
  const gesture = useRef<{ x: number; y: number; t: number; id: number; axis: "x" | "y" | null } | null>(null);
  const suppressClick = useRef(false);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    gesture.current = { x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId, axis: null };
    suppressClick.current = false;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const g = gesture.current;
    if (!g || g.id !== e.pointerId) return;
    const dx = e.clientX - g.x;
    const dy = e.clientY - g.y;
    if (!g.axis) {
      if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
        g.axis = "x";
        suppressClick.current = true;
        (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
      } else if (Math.abs(dy) > 8) {
        g.axis = "y";
      }
    }
    if (g.axis === "x" && !reduce) dragX.set(dx);
  };

  const endGesture = (e: React.PointerEvent, cancelled = false) => {
    const g = gesture.current;
    gesture.current = null;
    if (!g || g.id !== e.pointerId) return;
    if (g.axis === "x" && !cancelled) {
      const dx = e.clientX - g.x;
      const velocity = Math.abs(dx) / Math.max(1, performance.now() - g.t);
      if (Math.abs(dx) > 60 || (Math.abs(dx) > 24 && velocity > 0.45)) go(dx < 0 ? 1 : -1);
    }
    animate(dragX, 0, { duration: 0.35, ease });
  };

  const detailPanel = (overlay: boolean) => (
    <AnimatePresence>
      {active && (
        <motion.div
          key={`${view.id}-${active.id}`}
          role="dialog"
          aria-label={active.title}
          initial={{ opacity: 0, y: overlay ? 16 : -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: overlay ? 10 : -6 }}
          transition={{ duration: 0.4, ease }}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          className={
            overlay
              ? "absolute bottom-6 left-6 z-30 w-[360px] bg-paper px-7 pb-7 pt-6 pr-14 text-ink shadow-[0_24px_48px_-28px_rgba(0,0,0,0.55)]"
              : "relative bg-paper px-5 pb-5 pt-4 pr-12 text-ink"
          }
        >
          <p className="eyebrow section-label">Деталь</p>
          <h3 className="display mt-3 text-[1.625rem] leading-[1.1]">{active.title}</h3>
          <p className="mt-2.5 text-[13.5px] leading-[1.7] text-body">{active.text}</p>
          <button
            type="button"
            onClick={() => setActive(null)}
            className="icon-btn absolute right-1.5 top-1.5 text-muted hover:text-ink"
            aria-label="Закрыть описание детали"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <section
      id="views"
      ref={sectionRef}
      aria-roledescription="carousel"
      aria-label="Четыре ракурса спальни"
      className="relative scroll-mt-16 bg-night pb-20 pt-6 text-paper sm:pb-28 sm:pt-8 lg:scroll-mt-20"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        {/* Hairline separating the opening from the presentation */}
        <div aria-hidden className="h-px bg-paper/10" />
        <div className="flex flex-col gap-6 pb-10 pt-16 sm:pb-14 sm:pt-24 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div>
            <p className="eyebrow section-label">Интерьер · 4 ракурса</p>
            <h2 className="display mt-6 text-[clamp(2.25rem,8.5vw,4rem)]">
              Одна спальня, <em className="italic text-paper/70">четыре ракурса.</em>
            </h2>
          </div>
          <p className="lede max-w-[22rem] text-paper/55 lg:pb-2">
            Рассмотрите спальню с разных сторон. Нажмите на маркеры, чтобы узнать больше об отдельных деталях.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] sm:px-8 lg:px-12">
        {/* Width follows the viewport height so the full 4:3 frame always fits on screen. */}
        <div className="mx-auto w-full md:w-[min(100%,calc((100svh_-_9.5rem)*4/3))] short-landscape:w-[min(100%,calc((100svh_-_5rem)*4/3))]">
          {/* ---------------- Stage (exact 4:3) ---------------- */}
          <div
            className="relative isolate aspect-[4/3] w-full touch-pan-y select-none overflow-hidden bg-night-deep"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={(e) => endGesture(e)}
            onPointerCancel={(e) => endGesture(e, true)}
            onClickCapture={(e) => {
              if (suppressClick.current) {
                e.stopPropagation();
                e.preventDefault();
                suppressClick.current = false;
              }
            }}
            onClick={() => setActive(null)}
            aria-live="polite"
            data-stage
          >
            <motion.div className="absolute inset-0" style={{ opacity: dragOpacity }}>
              <AnimatePresence initial={false} custom={reduce}>
                <ViewLayer
                  key={view.id}
                  view={view}
                  reduce={reduce}
                  showDetails={showDetails}
                  activeId={active?.id ?? null}
                  onHotspot={(h) => setActive((cur) => (cur?.id === h.id ? null : h))}
                />
              </AnimatePresence>
            </motion.div>

            {/* Preload the neighbouring viewpoints so transitions never wait on the network. */}
            <div aria-hidden className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0">
              {[1, -1].map((d) => {
                const v = ROOM_VIEWS[(index + d + COUNT) % COUNT];
                return <RoomImage key={`${v.id}-${d}`} id={v.id} alt="" sizes={STAGE_SIZES} priority blur={false} />;
              })}
            </div>

            {/* Detail panel — overlay only where the stage is large enough */}
            <div className="hidden md:block">{detailPanel(true)}</div>
          </div>

          {/* Detail panel — below the image on phones, so the render stays uncovered */}
          <div className="px-3 pt-3 sm:px-0 md:hidden">{detailPanel(false)}</div>

          {/* ---------------- Toolbar (outside the image) ---------------- */}
          <div className="flex items-center justify-between gap-2 px-5 pt-3 sm:px-0">
            <button
              type="button"
              onClick={onWalkthrough}
              className="text-link text-paper/75 hover:text-paper"
            >
              <Play className="h-2.5 w-2.5 fill-current" strokeWidth={1} aria-hidden />
              <span className="text-link-label">Обзор</span>
            </button>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setShowDetails((s) => !s);
                  setActive(null);
                }}
                aria-pressed={showDetails}
                aria-label="Показать маркеры деталей"
                className="text-link min-w-11 justify-center px-1 text-paper/75 hover:text-paper"
              >
                <span
                  className={`h-[7px] w-[7px] rounded-full border border-current transition-colors duration-500 ${
                    showDetails ? "border-accent bg-accent" : ""
                  }`}
                  aria-hidden
                />
                <span className="text-link-label hidden min-[380px]:inline">Детали</span>
              </button>
              <span aria-hidden className="mx-2 h-4 w-px bg-paper/15" />
              <button
                type="button"
                onClick={() => onFullscreen(index)}
                className="icon-btn -mr-3 text-paper/75 hover:text-paper"
                aria-label="На весь экран"
              >
                <Maximize2 className="h-4 w-4" strokeWidth={1.25} />
              </button>
            </div>
          </div>

          {/* ---------------- Caption + navigation ---------------- */}
          <div className="px-5 pt-7 sm:px-0 sm:pt-9">
            <div className="flex items-start justify-between gap-6">
              <div className="min-h-[96px] min-w-0 flex-1">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={view.id}
                    initial={{ opacity: 0, y: reduce ? 0 : 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: reduce ? 0 : -6 }}
                    transition={{ duration: 0.5, ease }}
                  >
                    <p className="eyebrow text-accent">
                      Ракурс {view.number} <span className="text-paper/25">/ 0{COUNT}</span>
                    </p>
                    <h3 className="display mt-3 text-[1.875rem] leading-[1.1] sm:text-[2.5rem]">{view.title}</h3>
                    <p className="mt-3 max-w-xl text-[13.5px] leading-[1.75] text-paper/50 sm:text-sm">
                      {view.caption}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="flex shrink-0 gap-2">
                <ArrowButton dir={-1} onClick={() => go(-1)} />
                <ArrowButton dir={1} onClick={() => go(1)} />
              </div>
            </div>

            {/* Four-view progress indicator */}
            <ol className="mt-8 grid grid-cols-4 gap-2 sm:mt-10 sm:gap-5" aria-label="Ракурсы">
              {ROOM_VIEWS.map((v, i) => (
                <li key={v.id}>
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={i === index ? "step" : undefined}
                    aria-label={`Ракурс ${v.number}: ${v.title}`}
                    className="group block w-full py-3 text-left"
                  >
                    <span className="relative block h-px w-full bg-paper/12">
                      {i === index && (
                        <motion.span
                          layoutId="view-progress"
                          className="absolute inset-0 bg-accent"
                          transition={{ duration: reduce ? 0 : 0.6, ease }}
                        />
                      )}
                    </span>
                    <span
                      className={`mt-3.5 flex items-baseline gap-3 text-[10.5px] font-medium uppercase tracking-[0.24em] transition-colors duration-500 ${
                        i === index ? "text-paper" : "text-paper/35 group-hover:text-paper/70"
                      }`}
                    >
                      <span className="tabular-nums">{v.number}</span>
                      <span className="hidden truncate tracking-[0.2em] lg:inline">{v.title}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>

            <AnimatePresence>
              {!interacted && (
                <motion.p
                  exit={{ opacity: 0 }}
                  className="eyebrow mt-5 text-center text-paper/30 md:hidden"
                  aria-hidden
                >
                  Проведите по изображению, чтобы сменить ракурс
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------- */

/*
 * Transition: the incoming view fades in while settling from 97% to 100% of
 * the frame; the outgoing view fades out while easing back to 98.5%.
 * Scale never exceeds 1, so no edge of the render is ever cut off.
 */
const layerVariants = {
  enter: (reduce: boolean) => (reduce ? { opacity: 0, zIndex: 2 } : { opacity: 0, scale: 0.97, zIndex: 2 }),
  center: (reduce: boolean) => ({
    opacity: 1,
    scale: 1,
    zIndex: 2,
    transition: {
      opacity: { duration: reduce ? 0.35 : 1.1, ease },
      scale: { duration: reduce ? 0 : 1.6, ease },
    },
  }),
  exit: (reduce: boolean) => ({
    opacity: 0,
    zIndex: 1,
    scale: reduce ? 1 : 0.985,
    transition: {
      opacity: { duration: reduce ? 0.3 : 0.9, delay: reduce ? 0 : 0.3, ease },
      scale: { duration: reduce ? 0 : 1.2, ease },
    },
  }),
};

function ViewLayer({
  view,
  reduce,
  showDetails,
  activeId,
  onHotspot,
}: {
  view: RoomView;
  reduce: boolean;
  showDetails: boolean;
  activeId: string | null;
  onHotspot: (h: Hotspot) => void;
}) {
  return (
    <motion.div
      className="absolute inset-0"
      custom={reduce}
      variants={layerVariants}
      initial="enter"
      animate="center"
      exit="exit"
    >
      <RoomImage
        id={view.id}
        alt={view.alt}
        sizes={STAGE_SIZES}
        priority
        className="absolute inset-0 h-full w-full object-contain"
      />

      <AnimatePresence>
        {showDetails &&
          view.hotspots.map((h, i) => {
            const isActive = activeId === h.id;
            return (
              <motion.button
                key={h.id}
                type="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: reduce ? 0 : 1 + i * 0.12, duration: 0.5, ease } }}
                exit={{ opacity: 0, transition: { duration: 0.25 } }}
                onClick={(e) => {
                  e.stopPropagation();
                  onHotspot(h);
                }}
                aria-label={`Деталь: ${h.title}`}
                aria-expanded={isActive}
                className="absolute z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                style={{ left: `${h.x * 100}%`, top: `${h.y * 100}%` }}
              >
                {!isActive && (
                  <span className="hotspot-ring absolute h-5 w-5 rounded-full border border-paper/80 sm:h-6 sm:w-6" />
                )}
                <span
                  className={`relative flex h-5 w-5 items-center justify-center rounded-full border transition-colors duration-300 sm:h-6 sm:w-6 ${
                    isActive ? "border-accent bg-accent" : "border-paper/90 bg-night/35"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-paper" />
                </span>
              </motion.button>
            );
          })}
      </AnimatePresence>
    </motion.div>
  );
}

function ArrowButton({ dir, onClick }: { dir: 1 | -1; onClick: () => void }) {
  const Icon = dir < 0 ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      className="icon-btn h-12 w-12 border border-paper/15 text-paper/80 hover:border-paper/45 hover:text-paper"
      aria-label={dir < 0 ? "Предыдущий ракурс" : "Следующий ракурс"}
    >
      <Icon className="h-[18px] w-[18px]" strokeWidth={1} />
    </button>
  );
}
