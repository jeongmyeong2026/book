export type GradeType = '중1' | '중2' | '중3';

export type GenreType = 
  | 'SF/판타지' 
  | '추리/미스터리' 
  | '청소년소설/성장' 
  | '과학/우주' 
  | '웹툰/그래픽노블' 
  | '고전/역사' 
  | '자기계발/공부법' 
  | '시/수필';

export interface UserProfile {
  id: string;
  nickname: string;
  grade: GradeType;
  personalityTraits: string[];
  favoriteGenres: GenreType[];
  readingSpeed: '느긋하게 천천히' | '보통 속도로' | '몰입해서 빠르게';
  readingPreference: '스토리가 흥미진진한 책' | '감동과 여운이 깊은 책' | '새로운 지식을 주는 책' | '가볍게 읽기 좋은 책';
  vacationGoalCount: number;
  bookPersonaTitle: string; // e.g., "시공간을 탐험하는 감성 SF 사색가"
  bookPersonaDesc: string;
  badgeEmoji: string;
  createdDate: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  genre: GenreType;
  coverGradient: string;
  coverEmoji: string;
  difficulty: '쉬움' | '보통' | '도전';
  pages: number;
  estimatedTime: string;
  summary: string;
  recommendationReason: string;
  targetWeek: number; // 1 ~ 4주차
  keyPoints: string[];
  isbn?: string;
}

export interface BookReview {
  id: string;
  bookId: string;
  bookTitle: string;
  author: string;
  coverGradient?: string;
  coverEmoji?: string;
  rating: number; // 1 to 5
  oneLiner: string; // 한 줄 서평
  favoriteQuote?: string; // 감명 깊은 구절
  userNickname: string;
  createdDate: string;
  aiComment?: string; // AI 독서 친구의 응원 댓글
  status: '읽는 중' | '완독' | '읽고 싶음';
}

export interface SurveyAnswers {
  nickname: string;
  grade: GradeType;
  personalityTraits: string[];
  favoriteGenres: GenreType[];
  readingSpeed: '느긋하게 천천히' | '보통 속도로' | '몰입해서 빠르게';
  readingPreference: '스토리가 흥미진진한 책' | '감동과 여운이 깊은 책' | '새로운 지식을 주는 책' | '가볍게 읽기 좋은 책';
  vacationGoalCount: number;
}
