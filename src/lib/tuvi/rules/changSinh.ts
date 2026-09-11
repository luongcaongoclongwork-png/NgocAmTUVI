export { CHANG_SINH_VI } from "../locale/astronomyNames.vi";

/**
 * Truong Sinh's starting branch is determined by Ngu Hanh Cuc (Thuy Nhi Cuc ->
 * Than, Moc Tam Cuc -> Hoi, Kim Tu Cuc -> Ty, Tho Ngu Cuc -> Than, Hoa Luc Cuc
 * -> Dan), then runs forward for duong nam/am nu and backward for am nam/duong
 * nu. iztro's own changesheng12 algorithm already implements this correctly
 * (verified against node_modules/iztro/lib/star/decorativeStar.js) and its
 * positional output is reused as-is — only the star *labels* are translated
 * via CHANG_SINH_VI, per the pipeline in engine/vietnameseAdapter.ts.
 */
