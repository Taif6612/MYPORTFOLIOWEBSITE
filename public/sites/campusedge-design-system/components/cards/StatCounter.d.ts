import React from 'react';

export interface StatCounterProps {
  /** Target number (animates up from 0 when scrolled into view). */
  value: number;
  /** Trailing symbol, e.g. "+", "%". */
  suffix?: string;
  prefix?: string;
  label: string;
  /** Light text for dark backgrounds. @default false */
  onDark?: boolean;
  /** Count-up duration in ms. @default 1600 */
  duration?: number;
  style?: React.CSSProperties;
}

/** Scroll-triggered animated statistic counter. */
export function StatCounter(props: StatCounterProps): JSX.Element;
