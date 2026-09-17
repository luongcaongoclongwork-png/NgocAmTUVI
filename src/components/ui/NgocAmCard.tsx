"use client";

/**
 * Shared card hover foundation for every card type on the site (service,
 * product, consultant, article/knowledge, pillar). Unifies motion, border,
 * shadow, image reveal, CTA movement, timing and color behavior — layout
 * is intentionally left to each caller, cards are not forced into one shape.
 */

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import "./NgocAmCard.css";

export type NgocAmCardVariant =
  | "default"
  | "tuvi"
  | "phongthuy"
  | "tradao"
  | "consultant"
  | "article";

interface NgocAmCardImage {
  src: string;
  alt: string;
  sizes?: string;
}

interface NgocAmCardProps {
  /** Internal route. Renders a <Link> when set, otherwise a plain <div>. */
  href?: string;
  variant?: NgocAmCardVariant;
  eyebrow?: string;
  title: string;
  description?: string;
  /** e.g. "6 phút đọc" or a price row — rendered under the description. */
  meta?: ReactNode;
  ctaLabel?: string;
  image?: NgocAmCardImage;
  /** Initials shown in a plain avatar plate when there is no photo yet. */
  avatarInitials?: string;
  /** Arbitrary illustration (e.g. an SVG mark) in the same media slot as a photo. */
  media?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export default function NgocAmCard({
  href,
  variant = "default",
  eyebrow,
  title,
  description,
  meta,
  ctaLabel,
  image,
  avatarInitials,
  media,
  children,
  className = "",
}: NgocAmCardProps) {
  const body = (
    <>
      {image && (
        <div className="ngoc-am-card__media">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes={image.sizes ?? "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
            className="ngoc-am-card__media-img"
          />
          <div className="ngoc-am-card__veil" aria-hidden="true" />
          <div className="ngoc-am-card__paper-light" aria-hidden="true" />
          {variant === "tradao" && (
            // reserved slot for a very subtle animated-webp/video steam layer later
            <div className="ngoc-am-card__steam" aria-hidden="true" />
          )}
        </div>
      )}

      {!image && media && <div className="ngoc-am-card__media ngoc-am-card__media--custom">{media}</div>}

      {!image && !media && avatarInitials && (
        <div className="ngoc-am-card__avatar-plate">
          <span>{avatarInitials}</span>
        </div>
      )}

      <div className="ngoc-am-card__body">
        {eyebrow && <p className="ngoc-am-card__eyebrow">{eyebrow}</p>}
        <h3 className="ngoc-am-card__title">{title}</h3>
        {description && <p className="ngoc-am-card__desc">{description}</p>}
        {children}
        {meta && <div className="ngoc-am-card__meta">{meta}</div>}
        {ctaLabel && (
          <span className="ngoc-am-card__cta">
            <span className="ngoc-am-card__ink-line" aria-hidden="true" />
            <span className="ngoc-am-card__cta-label">
              {ctaLabel}
              <span className="ngoc-am-card__cta-arrow" aria-hidden="true">
                →
              </span>
            </span>
          </span>
        )}
      </div>
    </>
  );

  const classes = `ngoc-am-card ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={classes} data-variant={variant}>
        {body}
      </Link>
    );
  }

  return (
    <div className={classes} data-variant={variant} tabIndex={0}>
      {body}
    </div>
  );
}
