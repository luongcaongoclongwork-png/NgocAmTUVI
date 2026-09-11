/**
 * Display-only alias overrides layered on top of locale/starNames.vi.ts at
 * render time. The canonical star id never changes — only what label is
 * shown — so switching an alias here can never affect rule lookups
 * (brightness, Tu Hoa, etc. all key off the id, not the display name).
 */
export const STAR_DISPLAY_ALIASES: Record<string, string> = {
  // tianyao: "Thiên Diêu" (default, per locale/starNames.vi.ts) is the more common
  // spelling; some Vietnamese texts render it "Thiên Riêu". Flip this entry to
  // override the display without touching the "tianyao" id used everywhere else.
  // tianyao: "Thiên Riêu",
};

export function displayStarName(starId: string, canonicalName: string): string {
  return STAR_DISPLAY_ALIASES[starId] ?? canonicalName;
}
