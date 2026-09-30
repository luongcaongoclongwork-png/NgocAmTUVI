import type { InkLayer } from "./inkShader";

/**
 * The opening painting.
 *
 * Today: one flat painting, depth is faked by the shader.
 * When the layered paintings are ready (see docs/V2-TU-LIEU-HINH-ANH.md),
 * drop them in public/images/thuy-mac/ and list them here, back to front,
 * with a depth from 0 (far) to 1 (near) — at most 4. For example:
 *
 *   { src: "/images/thuy-mac/lop-1-troi-nui-xa.webp", depth: 0 },
 *   { src: "/images/thuy-mac/lop-2-suong-nui-giua.webp", depth: 0.3 },
 *   { src: "/images/thuy-mac/lop-3-bo-lau-mat-nuoc.webp", depth: 0.6 },
 *   { src: "/images/thuy-mac/lop-4-canh-thong.webp", depth: 1 },
 */
export const PAINTING = "/images/06-thuy-mac-song-huong.webp";
export const PAINTING_ALT = "Tranh thuỷ mặc sông Hương: con thuyền nhỏ, núi mờ sương, lầu cổ bên bờ, cành thông";
export const PAINTING_LAYERS: InkLayer[] = [];
