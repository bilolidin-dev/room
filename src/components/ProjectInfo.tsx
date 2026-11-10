import Reveal from "./Reveal";
import { SITE } from "@/config/site";

const FACTS = [
  { label: "Студия", value: SITE.studioFull },
  { label: "Проект", value: SITE.project },
  { label: "Помещение", value: "Спальня" },
  { label: "Формат", value: "Визуализация интерьера · 4 ракурса" },
];

export default function ProjectInfo() {
  return (
    <section id="project" className="scroll-mt-16 bg-paper py-24 sm:py-32 lg:scroll-mt-20 lg:py-40">
      <div className="mx-auto grid max-w-[1440px] gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:px-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <p className="eyebrow section-label">О проекте</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="display mt-6 text-[clamp(2.375rem,9vw,4rem)] text-ink">{SITE.project}</h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-4 font-serif text-xl font-light italic text-muted sm:text-[1.375rem]">
                {SITE.presentation}
              </p>
            </Reveal>
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal>
            <p className="font-serif text-[1.4375rem] font-light leading-[1.45] text-ink sm:text-[1.75rem] sm:leading-[1.4]">
              Спокойный интерьер спальни в мягких оттенках, с классическими молдингами и выразительными тёмными
              акцентами.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="lede mt-8 max-w-[34rem] space-y-5 text-body">
              <p>
                Низкая кровать с мягкой обивкой расположена у акцентной стены с молдингами; по обе стороны —
                лаконичные подвесные светильники. Высокие шкафы с выразительными кольцевыми ручками задают ритм
                интерьеру, а многослойные полупрозрачные шторы мягко рассеивают дневной свет.
              </p>
              <p>
                Крупные абстрактные работы в чёрных, белых и золотистых тонах контрастируют со спокойной палитрой.
                Тепла интерьеру добавляет пол с укладкой «ёлочкой».
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <dl className="mt-14 grid grid-cols-1 border-t border-line sm:mt-16 sm:grid-cols-2 sm:gap-x-10">
              {FACTS.map((f) => (
                <div key={f.label} className="border-b border-line py-5 sm:py-6">
                  <dt className="eyebrow text-muted">{f.label}</dt>
                  <dd className="mt-2 font-serif text-[1.1875rem] font-normal leading-snug text-ink">{f.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
