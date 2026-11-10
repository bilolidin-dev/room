/**
 * Geometry for showing a fixed-aspect render inside any container.
 * The image is always shown in full ("contain"): it is never cropped,
 * never stretched, and never scaled beyond the container.
 */

export type Box = { width: number; height: number };

/** Size + offset of the largest image box that fits entirely inside the container. */
export function containFrame(container: Box, aspect: number) {
  const { width: cw, height: ch } = container;
  let w = cw;
  let h = cw / aspect;
  if (h > ch) {
    h = ch;
    w = ch * aspect;
  }
  return { w, h, x: (cw - w) / 2, y: (ch - h) / 2 };
}
