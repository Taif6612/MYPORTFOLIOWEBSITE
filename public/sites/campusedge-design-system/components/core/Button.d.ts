import React from 'react';

/**
 * Primary call-to-action button for CampusEdge surfaces.
 * @startingPoint section="Core" subtitle="Buttons — primary, accent, outline, ghost, glass" viewport="700x180"
 */
export interface ButtonProps {
  children?: React.ReactNode;
  /** Visual style. @default "primary" */
  variant?: 'primary' | 'accent' | 'outline' | 'ghost' | 'glass';
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg';
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  /** Stretch to full width. @default false */
  full?: boolean;
  /** Render as a different element, e.g. "a". @default "button" */
  as?: any;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Primary call-to-action button for CampusEdge surfaces.
 */
export function Button(props: ButtonProps): JSX.Element;
