import React from 'react';

export interface FeatureCardProps {
  /** Font Awesome class. @default "fa-solid fa-star" */
  icon?: string;
  title: string;
  children?: React.ReactNode;
  /** Gold medallion instead of blue. @default false */
  accent?: boolean;
  style?: React.CSSProperties;
}

/** Feature / value-proposition tile with icon medallion. */
export function FeatureCard(props: FeatureCardProps): JSX.Element;
