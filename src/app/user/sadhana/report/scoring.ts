import { SadhanaDaily } from "./types";

/* ---------- WEEKLY RULES ---------- */

export function weeklyMinuteMarks(min: number): number {
  if (min >= 420) return 7;
  if (min >= 360) return 6;
  if (min >= 300) return 5;
  if (min >= 240) return 4;
  if (min >= 180) return 3;
  if (min >= 120) return 2;
  if (min >= 60) return 1;
  return 0;
}

export function weeklySlokaMarks(count: number): number {
  if (count >= 7) return 7;
  if (count >= 6) return 6;
  if (count >= 5) return 5;
  if (count >= 4) return 4;
  if (count >= 3) return 3;
  if (count >= 2) return 2;
  if (count >= 1) return 1;
  return 0;
}

/* ---------- MAIN CALCULATOR ---------- */

export function calculateWeeklyScore(records: SadhanaDaily[]) {
  const hearingMin = records.reduce(
    (s, r) => s + r.personalHearingMin,
    0
  );

  const readingMin = records.reduce(
    (s, r) => s + r.spBookReadingMin,
    0
  );

  const slokaCount = records.reduce(
    (s, r) => s + r.slokaLearntCount,
    0
  );

  const hearingMarks = weeklyMinuteMarks(hearingMin);
  const readingMarks = weeklyMinuteMarks(readingMin);
  const slokaMarks = weeklySlokaMarks(slokaCount);

  const disciplineMarks = records.reduce((s, r) => {
    return (
      s +
      (r.bookReadingClass ? 1 : 0) +
      (r.dayRestBelow30 ? 1 : 0) +
      (r.sleptBeforeTime ? 1 : 0) +
      (r.wakeUpBeforeTime ? 1 : 0) +
      (r.studyOrPreaching1hr ? 1 : 0)
    );
  }, 0);

  const japaMarks = records.reduce((s, r) => {
    if (r.japaTime === 2) return s + 2;
    if (r.japaTime === 1) return s + 1;
    return s;
  }, 0);

  const total =
    hearingMarks +
    readingMarks +
    slokaMarks +
    disciplineMarks +
    japaMarks;

  return {
    hearingMin,
    readingMin,
    slokaCount,

    hearingMarks,
    readingMarks,
    slokaMarks,
    disciplineMarks,
    japaMarks,

    total,
  };
}
