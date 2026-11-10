import { IMAGES, type ImageId } from "@/data/views";

type Props = {
  id: ImageId;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  style?: React.CSSProperties;
  /** Show the tiny blurred placeholder behind the image while it loads. */
  blur?: boolean;
  onLoad?: () => void;
};

const srcSet = (list: { w: number; src: string }[]) => list.map((i) => `${i.src} ${i.w}w`).join(", ");

/**
 * <picture> with AVIF → WebP → original JPG fallback, responsive srcsets and a
 * blurred placeholder. Renders at the box given by `className` / `style`.
 */
export default function RoomImage({ id, alt, sizes, priority, className, style, blur = true, onLoad }: Props) {
  const img = IMAGES[id];
  return (
    <picture>
      <source type="image/avif" srcSet={srcSet(img.avif)} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(img.webp)} sizes={sizes} />
      <img
        src={img.original}
        alt={alt}
        width={img.width}
        height={img.height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        draggable={false}
        onLoad={onLoad}
        ref={(el) => {
          // Cached images may finish before hydration attaches onLoad.
          if (el && el.complete && el.naturalWidth > 0) onLoad?.();
        }}
        className={className}
        style={{
          ...(blur
            ? {
                backgroundImage: `url(${img.blurDataURL})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : null),
          ...style,
        }}
      />
    </picture>
  );
}
