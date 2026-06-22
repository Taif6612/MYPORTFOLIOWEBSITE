import React from 'react';

/**
 * Academic program tile with image, degree badge, duration and learn-more link.
 * @startingPoint section="Cards" subtitle="Program card — image, degree, duration" viewport="380x420"
 */
export interface ProgramCardProps {
  /** Program image URL (16:10 crop). */
  image: string;
  title: string;
  /** @default "Bachelor" */
  degree?: string;
  /** @default "4 Years" */
  duration?: string;
  blurb?: string;
  /** Font Awesome class for the corner glyph. @default "fa-solid fa-graduation-cap" */
  icon?: string;
  onLearnMore?: () => void;
  style?: React.CSSProperties;
}

/**
 * Academic program tile with image, degree badge, duration and learn-more link.
 */
export function ProgramCard(props: ProgramCardProps): JSX.Element;
