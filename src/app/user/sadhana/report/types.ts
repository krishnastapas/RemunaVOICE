export type YesNo = 0 | 1;
export type JapaTime = 0 | 1 | 2;

export interface SadhanaDaily {
  userId: string;
  date: string; // YYYY-MM-DD

  japaTime: JapaTime;

  personalHearingMin: number;
  spBookReadingMin: number;
  slokaLearntCount: number;

  bookReadingClass: YesNo;
  dayRestBelow30: YesNo;
  sleptBeforeTime: YesNo;
  wakeUpBeforeTime: YesNo;
  studyOrPreaching1hr: YesNo;
}

export interface Devotee {
  id: string;
  firstName: string;
  lastName?: string;
  features?: {
    sadhana?: boolean;
  };
}
