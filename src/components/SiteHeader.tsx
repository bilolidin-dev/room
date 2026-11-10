"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "#views", label: "Ракурсы" },
  { href: "#project", label: "Проект" },
  { href: "#gallery", label: "Галерея" },
  { href: "#contact", label: "Контакты" },
];

export default function SiteHeader() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,color,border-color] duration-700 ${
        solid ? "border-b border-line/80 bg-paper text-ink" : "border-b border-transparent text-paper"
      }`}
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:h-20 lg:px-12">
        <a href="#top" className="flex flex-col leading-none" aria-label="HERMITAGE · дизайн интерьера — наверх">
          <span className="wordmark text-[14px] sm:text-[15px]">Hermitage</span>
          <span
            className={`mt-[7px] text-[8.5px] font-medium uppercase tracking-[0.38em] transition-colors duration-700 ${
              solid ? "text-muted" : "text-paper/55"
            }`}
          >
            Дизайн интерьера
          </span>
        </a>
        <nav aria-label="Sections" className="hidden md:block">
          <ul className="flex items-center gap-10 lg:gap-12">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={`text-link nav-link !text-[10.5px] !tracking-[0.26em] ${
                    solid ? "text-ink/60 hover:text-ink" : "text-paper/65 hover:text-paper"
                  }`}
                >
                  <span className="text-link-label">{l.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a
          href="#contact"
          className={`text-link nav-link !text-[10.5px] md:hidden ${solid ? "text-ink" : "text-paper/85"}`}
        >
          <span className="text-link-label">Контакты</span>
        </a>
      </div>
    </header>
  );
}
