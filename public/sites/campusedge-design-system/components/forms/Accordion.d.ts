import React from 'react';

export interface AccordionItem { q: string; a: string; }
export interface AccordionProps {
  items: AccordionItem[];
  /** Index open on mount (-1 for none). @default 0 */
  defaultOpen?: number;
  style?: React.CSSProperties;
}

/** Single-open FAQ accordion with rotating plus toggle. */
export function Accordion(props: AccordionProps): JSX.Element;
