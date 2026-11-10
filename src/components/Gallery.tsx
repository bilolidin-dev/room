"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Expand } from "lucide-react";
import RoomImage from "./RoomImage";
import Reveal from "./Reveal";
import { ROOM_VIEWS } from "@/data/views";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Gallery({ onOpen }: { onOpen: (index: number) => void }) {
  const [selected, setSelected] = useState(0);
  const view = ROOM_VIEWS[selected];

  return (
    <section id="gallery" className="scroll-mt-16 bg-stone py-24 sm:py-32 lg:scroll-mt-20 lg:py-40">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Text column */}
          <div className="flex flex-col lg:col-span-4 lg:pr-8">
            <Reveal>
              <p className="eyebrow section-label">Детали интерьера</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="display mt-6 text-[clamp(2.375rem,9vw,4rem)] text-ink">
                Рассмотрите детали.
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="lede mt-6 max-w-[22rem] text-body">
                Откройте любой ракурс в полный экран, чтобы рассмотреть фактуры, молдинги и отделку.
              </p>
            </Reveal>

            <div className="mt-auto hidden pt-14 lg:block">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={view.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="border-t border-line pt-6">
                    <p className="eyebrow text-accent">
                      Ракурс {view.number} <span className="text-muted/60">/ 0{ROOM_VIEWS.length}</span>
                    </p>
                    <p className="display mt-3 text-[2rem] leading-[1.1] text-ink">{view.title}</p>
                    <p className="mt-3 max-w-[20rem] text-[13.5px] leading-[1.75] text-body">{view.caption}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Image column */}
          <div className="lg:col-span-8">
            <Reveal>
              <button
                type="button"
                onClick={() => onOpen(selected)}
                className="group relative mx-auto block aspect-[4/3] w-full max-w-[calc((100svh_-_7rem)*4/3)] overflow-hidden bg-night"
                aria-label={`Открыть ракурс «${view.title}» на весь экран`}
              >
                <AnimatePresence initial={false}>
                  <motion.div
                    key={view.id}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.6, delay: 0.2 } }}
                    transition={{ duration: 0.9, ease }}
                  >
                    <RoomImage
                      id={view.id}
                      alt={view.alt}
                      sizes="(min-width: 1024px) 64vw, 100vw"
                      className="h-full w-full object-contain transition-opacity duration-700 group-hover:opacity-90"
                    />
                  </motion.div>
                </AnimatePresence>
              </button>
            </Reveal>

            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="min-w-0 lg:invisible">
                <p className="eyebrow text-accent">Ракурс {view.number}</p>
                <p className="display mt-1.5 text-[1.375rem] leading-tight text-ink sm:text-2xl">{view.title}</p>
              </div>
              <button
                type="button"
                onClick={() => onOpen(selected)}
                className="text-link shrink-0 text-ink/70 hover:text-ink"
              >
                <Expand className="h-3.5 w-3.5" strokeWidth={1.25} aria-hidden />
                <span className="text-link-label">На весь экран</span>
              </button>
            </div>

            {/* Thumbnail navigation */}
            <Reveal delay={0.1}>
              <ul className="mt-6 grid grid-cols-4 gap-2 sm:gap-4" aria-label="Выбрать ракурс">
                {ROOM_VIEWS.map((v, i) => (
                  <li key={v.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(i)}
                      onDoubleClick={() => onOpen(i)}
                      aria-label={`Показать ракурс ${v.number}: ${v.title}`}
                      aria-current={i === selected ? "true" : undefined}
                      className="group relative block aspect-[4/3] w-full overflow-hidden bg-night"
                    >
                      <RoomImage
                        id={v.id}
                        alt=""
                        sizes="(min-width: 1024px) 16vw, 25vw"
                        className={`h-full w-full object-contain transition-opacity duration-500 ${
                          i === selected ? "opacity-100" : "opacity-50 group-hover:opacity-85"
                        }`}
                      />
                      <span
                        className={`absolute inset-x-0 bottom-0 h-px transition-colors duration-500 ${
                          i === selected ? "bg-accent" : "bg-transparent"
                        }`}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
