import { ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";

export default function ClosingCTA({ href }: { href: string }) {
  return (
    <section id="contact" className="relative scroll-mt-0 overflow-hidden bg-night text-paper">
      <div className="relative mx-auto flex min-h-[86svh] max-w-[1440px] flex-col items-center justify-center px-5 py-28 text-center sm:px-8 lg:px-12">
        <Reveal>
          <span aria-hidden className="mx-auto mb-8 block h-14 w-px bg-accent/60" />
          <p className="eyebrow text-accent">Начнём с разговора</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="display mt-7 text-[clamp(2.625rem,11vw,5.5rem)] leading-[1.02]">
            Ваше пространство.
            <br />
            <em className="italic text-paper/70">Ваш замысел.</em>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="lede mx-auto mt-8 max-w-[22rem] text-paper/60">
            Создадим интерьер, который отражает ваш образ жизни.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="btn mt-12 w-full max-w-xs bg-paper text-ink hover:bg-accent hover:text-paper sm:w-auto sm:max-w-none sm:px-12"
          >
            Обсудить проект
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.25} aria-hidden />
          </a>
        </Reveal>
        <Reveal delay={0.35}>
          <p className="eyebrow mt-6 !tracking-[0.22em] text-paper/35">Откроется WhatsApp</p>
        </Reveal>
      </div>
    </section>
  );
}
