import React from 'react';

export interface BadgeProps {
  children?: React.ReactNode;
  /** @default "blue" */
  tone?: 'blue' | 'gold' | 'navy' | 'success' | 'neutral';
  /** Soft tinted vs solid fill. @default true */
  soft?: boolean;
  style?: React.CSSProperties;
}

/** Compact category / status label pill. */
export function Badge(props: BadgeProps): JSX.Element;
