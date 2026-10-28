"use client";

import LaBan, { type LaBanProps } from "./LaBan";
import "./tinh-hoa.css";
import "./la-ban-3d.css";

/**
 * La bàn 3D (owner-requested 2026-10-28): the blued-steel dial as a real object, standing still (owner: no tilt or
 * sway). Depth comes from its layers: a steel body under the face, cards and logo raised above it, a fixed light on
 * the steel. The logo keeps its own file; it only sits at its own depth. Takes any LaBan props.
 */
export function LaBanNoi(props: LaBanProps) {
  return (
    <div className="th lb3d-stage">
      <div className="lb3d-lift">
        <div className="lb3d-tilt">
          <div className="lb3d-edge" aria-hidden="true" />
          <LaBan {...props} />
          <div className="lb3d-spec" aria-hidden="true" />
        </div>
      </div>
      <div className="lb3d-shadow" aria-hidden="true" />
    </div>
  );
}
