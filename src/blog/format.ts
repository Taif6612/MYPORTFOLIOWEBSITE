/* Deterministic, timezone-stable date formatting (UTC) so the server-rendered
   markup matches the client and never triggers a hydration mismatch. */

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** "June 20, 2026" */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

/** "2026-06-20" for <time datetime>. */
export function machineDate(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}
