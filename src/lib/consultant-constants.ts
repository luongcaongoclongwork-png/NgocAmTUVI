/** Types + the shared role tagline — kept separate from src/lib/consultants.ts
 * (server-only DB access), same reasoning as article-constants.ts. */

export const ROLE_TAGLINE = "Kế thừa tri thức cổ — Ứng dụng vào đời sống hiện đại";

export type Consultant = {
  id: number;
  slug: string;
  name: string;
  field: string;
  initials: string;
  bio: string;
  sortOrder: number;
  /** Uploaded portrait path ("/uploads/…"), "" when none yet (initials badge is shown instead). */
  photo: string;
};

export type ConsultantInput = {
  slug?: string;
  name: string;
  field: string;
  initials: string;
  bio: string;
  sortOrder: number;
};
