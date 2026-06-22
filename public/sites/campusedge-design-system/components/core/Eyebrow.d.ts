import React from 'react';

export interface EyebrowProps {
  children?: React.ReactNode;
  /** Accent color of label + rule. @default royal blue */
  color?: string;
  style?: React.CSSProperties;
}

/** Mono uppercase kicker shown above section headings. */
export function Eyebrow(props: EyebrowProps): JSX.Element;
