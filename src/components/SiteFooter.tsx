import { SITE } from "@/config/site";

export default function SiteFooter() {
  return (
    <footer className="bg-night text-paper/45" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-6 border-t border-paper/10 py-10 sm:flex-row sm:items-end sm:justify-between sm:gap-10 sm:py-12">
          <div className="flex flex-col leading-none">
            <span className="wordmark text-[15px] text-paper/85">Hermitage</span>
            <span className="mt-[7px] text-[8.5px] font-medium uppercase tracking-[0.38em] text-paper/40">
              Дизайн интерьера
            </span>
          </div>
          <p className="max-w-[34rem] text-[12px] leading-[1.75] sm:text-right">
            {SITE.project} · {SITE.presentation}. Изображения — фотореалистичная визуализация предложенного дизайна.
          </p>
        </div>
      </div>
    </footer>
  );
}
