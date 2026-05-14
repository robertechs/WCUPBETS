/**
 * FIFA World Cup 2026 USA/Canada/Mexico — resolution anchors for demo markets.
 * Dates are end-of-day UTC for the listed calendar day (marketing / countdown).
 */
export const TOURNAMENT_ROUNDS = {
  r32: {
    id: "r32" as const,
    label: "May 15",
    /** May 15, 2026 */
    deadlineIso: "2026-05-15T23:59:59.000Z",
  },
  r16: {
    id: "r16" as const,
    label: "May 16",
    /** May 16, 2026 */
    deadlineIso: "2026-05-16T23:59:59.000Z",
  },
  qf: {
    id: "qf" as const,
    label: "May 17",
    /** May 17, 2026 */
    deadlineIso: "2026-05-17T23:59:59.000Z",
  },
  sf: {
    id: "sf" as const,
    label: "May 18",
    /** May 18, 2026 */
    deadlineIso: "2026-05-18T23:59:59.000Z",
  },
  final: {
    id: "final" as const,
    label: "May 19",
    /** May 19, 2026 */
    deadlineIso: "2026-05-19T23:59:59.000Z",
  },
} as const;

export type TournamentRoundId = keyof typeof TOURNAMENT_ROUNDS;

export function getRoundDeadlineMs(roundId: TournamentRoundId): number {
  return new Date(TOURNAMENT_ROUNDS[roundId].deadlineIso).getTime();
}
