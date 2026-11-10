"use client";

import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { ChevronLeft, ChevronRight, Maximize, Minimize, X, ZoomIn, ZoomOut } from "lucide-react";
import { IMAGES, ROOM_VIEWS } from "@/data/views";

const SLIDES = ROOM_VIEWS.map((v) => {
  const img = IMAGES[v.id];
  const ratio = img.height / img.width;
  return {
    src: img.original,
    alt: v.alt,
    width: img.width,
    height: img.height,
    title: `${v.number} · ${v.title}`,
    description: `View ${v.number} — ${v.caption}`,
    srcSet: img.webp.map((s) => ({ src: s.src, width: s.w, height: Math.round(s.w * ratio) })),
  };
});

const icon = { strokeWidth: 1.25, className: "h-6 w-6" };

type Props = {
  open: boolean;
  index: number;
  onClose: () => void;
  /** Request browser fullscreen on open (where supported, e.g. Android Chrome / desktop). */
  autoFullscreen?: boolean;
};

export default function RoomLightbox({ open, index, onClose, autoFullscreen = false }: Props) {
  return (
    <Lightbox
      open={open}
      close={onClose}
      index={index}
      slides={SLIDES}
      plugins={[Zoom, Fullscreen, Captions, Thumbnails]}
      animation={{ fade: 350, swipe: 450, zoom: 400 }}
      carousel={{ finite: false, preload: 1, padding: 0, spacing: "8%", imageFit: "contain" }}
      controller={{ closeOnBackdropClick: true, closeOnPullDown: true }}
      zoom={{
        maxZoomPixelRatio: 3,
        zoomInMultiplier: 2,
        doubleTapDelay: 300,
        doubleClickDelay: 300,
        scrollToZoom: true,
        pinchZoomV4: true,
      }}
      fullscreen={{ auto: autoFullscreen }}
      captions={{ descriptionTextAlign: "start", descriptionMaxLines: 2, showToggle: false }}
      thumbnails={{ width: 76, height: 57, border: 1, borderRadius: 2, padding: 0, gap: 10, vignette: false }}
      // Slide padding (globals.css) keeps the render clear of the toolbar and caption:
      // the image is fitted in full inside the remaining area, never under the UI.
      styles={{ container: { paddingTop: "env(safe-area-inset-top)" } }}
      render={{
        iconPrev: () => <ChevronLeft {...icon} />,
        iconNext: () => <ChevronRight {...icon} />,
        iconClose: () => <X {...icon} />,
        iconZoomIn: () => <ZoomIn {...icon} className="h-5 w-5" />,
        iconZoomOut: () => <ZoomOut {...icon} className="h-5 w-5" />,
        iconEnterFullscreen: () => <Maximize {...icon} className="h-5 w-5" />,
        iconExitFullscreen: () => <Minimize {...icon} className="h-5 w-5" />,
      }}
      labels={{ Close: "Закрыть", Previous: "Предыдущее изображение", Next: "Следующее изображение" }}
    />
  );
}
