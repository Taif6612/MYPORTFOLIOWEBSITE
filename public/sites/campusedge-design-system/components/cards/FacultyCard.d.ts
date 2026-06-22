import React from 'react';

export interface FacultyCardProps {
  /** Square portrait URL. */
  photo: string;
  name: string;
  /** Title, e.g. "Professor of Robotics". */
  role?: string;
  /** Short department label shown as a glass chip. */
  department?: string;
  qualification?: string;
  research?: string;
  /** Show social row. @default true */
  socials?: boolean;
  style?: React.CSSProperties;
}

/** Faculty member profile card with portrait, department, credentials. */
export function FacultyCard(props: FacultyCardProps): JSX.Element;
