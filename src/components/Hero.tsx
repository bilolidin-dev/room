"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, Play } from "lucide-react";
import RoomImage from "./RoomImage";
import { ROOM_VIEWS } from "@/data/views";
import { SITE } from "@/config/site";

type Props = {
  revealed: boolean;
  onImageReady: () => void;
  onWalkthrough: () => void;
};

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Opening screen. The render is always shown in full (exact 4:3 frame, no
 * crop, no zoom): stacked above the text on phones and tablets, side by side
 * on desktop and on phones held in landscape.
 */
export default function Hero({ revealed, onImageReady, onWalkthrough }: Props) {
  const reduce = useReducedMotion();
  const view = ROOM_VIEWS[0];

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 18 },
    animate: revealed ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: reduce ? 0.3 : 1.1, ease, delay: reduce ? 0 : delay },
  });

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col bg-night text-paper"
      style={{ paddingTop: "calc(4rem + env(safe-area-inset-top))" }}
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col pb-10 sm:px-8 lg:grid lg:grid-cols-[minmax(340px,0.75fr)_1.6fr] lg:items-center lg:gap-14 lg:px-12 lg:pb-14 lg:pt-6 short-landscape:grid short-landscape:grid-cols-[1fr_auto] short-landscape:items-center short-landscape:gap-6 short-landscape:px-6 short-landscape:pb-4">
        {/* Render — full frame */}
        <motion.figure
          className="relative mx-auto w-full lg:order-2 lg:w-[min(100%,calc((100svh_-_9rem)*4/3))] short-landscape:order-2 short-landscape:w-[calc((100svh_-_5.5rem)*4/3)]"
          initial={{ opacity: 0 }}
          animate={revealed ? { opacity: 1 } : undefined}
          transition={{ duration: reduce ? 0.3 : 1.8, ease }}
        >
          <div className="relative aspect-[4/3] w-full bg-night-deep">
            <RoomImage
              id={view.id}
              alt={view.alt}
              sizes="(min-width: 1024px) 66vw, 100vw"
              priority
              onLoad={onImageReady}
              className="absolute inset-0 h-full w-full object-contain"
            />
          </div>
          {/* Plate caption — sits in the section's bottom padding, so the frame size is unchanged. */}
          <figcaption className="absolute inset-x-0 top-full hidden items-center justify-between pt-4 text-paper/45 lg:flex short-landscape:!hidden">
            <span className="eyebrow">
              Ракурс {view.number} <span className="mx-2 text-paper/25">—</span> {view.title}
            </span>
            <span className="eyebrow text-paper/30">01 / 04</span>
          </figcaption>
        </motion.figure>

        {/* Text */}
        <div className="flex flex-col px-5 pt-8 sm:px-0 sm:pt-10 lg:order-1 lg:pt-0 short-landscape:order-1 short-landscape:px-0 short-landscape:pt-0">
          <motion.p {...fadeUp(0.15)} className="eyebrow section-label">
            {SITE.category}
          </motion.p>
          <motion.h1
            {...fadeUp(0.3)}
            className="display mt-6 text-[clamp(2.75rem,12vw,4.5rem)] leading-[0.98] lg:text-[clamp(3.5rem,5.2vw,5.5rem)] short-landscape:mt-3 short-landscape:text-[2.375rem]"
          >
            Частная
            <br /> резиденция
          </motion.h1>
          <motion.p
            {...fadeUp(0.45)}
            className="lede mt-7 max-w-[24rem] text-paper/60 short-landscape:hidden"
          >
            Спальня в мягкой нейтральной гамме, с классическими молдингами и выразительными тёмными акцентами.
            Четыре ракурса раскрывают интерьер со всех сторон.
          </motion.p>

          <motion.div
            {...fadeUp(0.6)}
            className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-10 lg:flex-col lg:items-start lg:gap-4 short-landscape:mt-5 short-landscape:flex-col short-landscape:items-start short-landscape:gap-1"
          >
            <a href="#views" className="btn bg-paper text-ink hover:bg-accent hover:text-paper sm:px-10">
              Смотреть проект
              <ArrowDown className="h-3.5 w-3.5" strokeWidth={1.25} aria-hidden />
            </a>
            <button
              type="button"
              onClick={onWalkthrough}
              className="text-link self-center text-paper/80 hover:text-paper sm:self-auto"
            >
              <Play className="h-2.5 w-2.5 fill-current" strokeWidth={1} aria-hidden />
              <span className="text-link-label">Обзор проекта</span>
            </button>
          </motion.div>

          <motion.div
            {...fadeUp(0.8)}
            className="mt-12 hidden grid-cols-2 gap-8 border-t border-paper/10 pt-6 sm:grid lg:mt-14 short-landscape:hidden"
          >
            <div>
              <p className="eyebrow text-paper/35">Помещение</p>
              <p className="mt-2 font-serif text-lg font-light text-paper/80">Спальня</p>
            </div>
            <div>
              <p className="eyebrow text-paper/35">Формат</p>
              <p className="mt-2 font-serif text-lg font-light text-paper/80">Четыре ракурса</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
