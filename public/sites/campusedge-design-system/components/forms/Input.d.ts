import React from 'react';

export interface InputProps {
  label?: string;
  /** @default "text" */
  type?: string;
  /** Leading Font Awesome icon class. */
  icon?: string;
  hint?: string;
  /** Render a multi-line textarea. @default false */
  textarea?: boolean;
  id?: string;
  placeholder?: string;
  style?: React.CSSProperties;
}

/** Labelled input / textarea with icon slot and focus ring. */
export function Input(props: InputProps): JSX.Element;
