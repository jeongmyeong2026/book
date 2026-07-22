import { Book, UserProfile, BookReview } from '../types';

export const DEFAULT_MOCK_BOOKS: Book[] = [
  // 1주차
  {
    id: 'book-1',
    title: '아몬드',
    author: '손원평',
    publisher: '창비',
    genre: '청소년소설/성장',
    coverGradient: 'from-amber-400 via-orange-500 to-rose-500',
    coverEmoji: '🌱',
    difficulty: '보통',
    pages: 264,
    estimatedTime: '약 3시간',
    summary: '감정을 느끼지 못하는 소년 윤재의 특별한 성장 이야기. 타인과의 공감과 우정의 가치를 일깨워주는 최고의 청소년 모범 추천작.',
    recommendationReason: '방학 첫 주, 감정의 깊은 울림을 선사하는 최고의 베스트셀러! 공감 능력을 키우고 나 자신을 돌아보기에 최적입니다.',
    targetWeek: 1,
    keyPoints: ['타인의 감정에 공감하는 법', '몰입감 높은 흥미진진한 전개', '중학생 대표 필수 교양 도서']
  },
  {
    id: 'book-2',
    title: '시간을 파는 상점',
    author: '김선영',
    publisher: '자음과모음',
    genre: '청소년소설/성장',
    coverGradient: 'from-blue-500 via-indigo-600 to-violet-700',
    coverEmoji: '⏳',
    difficulty: '쉬움',
    pages: 240,
    estimatedTime: '약 2.5시간',
    summary: '시간을 파는 인터넷 카페를 개설한 온조. 손님들의 의뢰를 해결하며 시간의 가치와 삶의 의미를 배워가는 흥미진진 미스터리 성장소설.',
    recommendationReason: '시간 관리가 중요한 방학! 시간을 어떻게 가치 있게 보낼지 고민하는 학생들에게 흥미와 교훈을 모두 선물합니다.',
    targetWeek: 1,
    keyPoints: ['시간의 참된 의미 탐구', '의뢰를 해결해나가는 추리적 흥미', '빠르고 경쾌한 문체']
  },
  {
    id: 'book-3',
    title: '지구 끝의 온실',
    author: '김초엽',
    publisher: '자이언트북스',
    genre: 'SF/판타지',
    coverGradient: 'from-emerald-400 via-teal-600 to-cyan-800',
    coverEmoji: '🌿',
    difficulty: '보통',
    pages: 392,
    estimatedTime: '약 4시간',
    summary: '멸망 이후의 세계, 기괴한 식물 모스바나와 함께 세상을 구한 여성들의 은밀하고 따뜻한 이야기. 한국 SF 대표작.',
    recommendationReason: '여름/겨울 방학에 밤새워 읽기 좋은 SF 소설! 상상력을 극대화하고 환경과 인류의 미래를 생각하게 합니다.',
    targetWeek: 1,
    keyPoints: ['포스트 아포칼립스 속 따뜻한 연대', '눈앞에 그려지는 감성적 묘사', 'SF 장르 입문용 강추']
  },

  // 2주차
  {
    id: 'book-4',
    title: '페인트',
    author: '이희영',
    publisher: '창비',
    genre: 'SF/판타지',
    coverGradient: 'from-sky-400 via-blue-500 to-indigo-600',
    coverEmoji: '🎨',
    difficulty: '쉬움',
    pages: 208,
    estimatedTime: '약 2시간',
    summary: '청소년이 직접 부모를 면접보고 선택하는 가상 미래 국가 시스템. 부모와 자녀의 진정한 관계에 대해 질문을 던지는 화제작.',
    recommendationReason: '부모님과의 관계와 나의 존재 가치에 대해 깊이 생각해볼 수 있는 가볍고도 강렬한 몰입감의 소설!',
    targetWeek: 2,
    keyPoints: ['부모 선택이라는 파격적 설정', '진정한 가족의 의미', '쉬운 문장과 빠른 속도감']
  },
  {
    id: 'book-5',
    title: '체리새우 : 비밀글입니다',
    author: '황영미',
    publisher: '문학동네',
    genre: '청소년소설/성장',
    coverGradient: 'from-rose-300 via-pink-500 to-purple-600',
    coverEmoji: '🦐',
    difficulty: '쉬움',
    pages: 200,
    estimatedTime: '약 2시간',
    summary: '중학교 2학년 다현이가 또래 집단 속에서 솔직한 나 자신을 지키며 진짜 친구를 만들어가는 가슴 따뜻한 학교 생활 이야기.',
    recommendationReason: '중학교 단짝 관계, 친구 눈치, 은따 고민을 겪어본 중학생이라면 200% 공감할 마음 치유 소설!',
    targetWeek: 2,
    keyPoints: ['중학생 현실 학교생활 100% 반영', '자존감 회복 가이드', '따뜻한 위로와 공감']
  },
  {
    id: 'book-6',
    title: '코스모스 (청소년을 위한)',
    author: '칼 세이건',
    publisher: '사이언스북스',
    genre: '과학/우주',
    coverGradient: 'from-slate-900 via-indigo-950 to-blue-900',
    coverEmoji: '🌌',
    difficulty: '도전',
    pages: 350,
    estimatedTime: '약 5시간',
    summary: '우주의 탄생부터 외계 생명체, 인류의 탐험 역사까지 우주에 대한 경이로움과 과학적 탐구심을 자극하는 대작.',
    recommendationReason: '탐구심이 높은 과학/우주 덕후 중학생에게 추천! 방학 동안 지적 호기심을 지평선 끝까지 넓혀줍니다.',
    targetWeek: 2,
    keyPoints: ['우주 시각으로 바라본 지혜', '과학적 탐구 심화', '중고등 과학교과 연계']
  },

  // 3주차
  {
    id: 'book-7',
    title: '완득이',
    author: '김려령',
    publisher: '창비',
    genre: '청소년소설/성장',
    coverGradient: 'from-amber-500 via-red-500 to-rose-700',
    coverEmoji: '🥊',
    difficulty: '쉬움',
    pages: 252,
    estimatedTime: '약 2.5시간',
    summary: '가난하고 반항적인 소년 완득이와 똥주 선생님의 유쾌하고 감동적인 사제 관계. 세상에 당당히 펀치를 날리는 완득이의 성장기.',
    recommendationReason: '웃음과 눈물이 함께하는 유쾌한 성장소설! 방학 3주차 유쾌한 에너지 충전이 필요할 때 강추합니다.',
    targetWeek: 3,
    keyPoints: ['유쾌하고 통쾌한 유머', '다문화 사회와 포용', '영화화된 검증된 명작']
  },
  {
    id: 'book-8',
    title: '셜록 홈즈 : 주홍색 연구',
    author: '아서 코난 도일',
    publisher: '황금가지',
    genre: '추리/미스터리',
    coverGradient: 'from-stone-700 via-neutral-800 to-zinc-900',
    coverEmoji: '🔍',
    difficulty: '보통',
    pages: 220,
    estimatedTime: '약 3시간',
    summary: '명탐정 셜록 홈즈와 왓슨 박사의 역사적인 첫 만남! 런던의 미스터리 사건을 날카로운 추리로 풀어가는 탐정 추리물의 원점.',
    recommendationReason: '뇌섹 소년소녀를 위한 고전 추리극! 두뇌를 자극하고 논리적 사고력을 높여주는 최고의 미스터리.',
    targetWeek: 3,
    keyPoints: ['명탐정 셜록 홈즈의 첫 사건', '논리적 연쇄 추리의 쾌감', '몰입감 폭발']
  },

  // 4주차
  {
    id: 'book-9',
    title: '죽은 시인의 사회',
    author: 'N. H. 클라인바움',
    publisher: '서교출판사',
    genre: '고전/역사',
    coverGradient: 'from-amber-700 via-orange-800 to-amber-950',
    coverEmoji: '📜',
    difficulty: '보통',
    pages: 230,
    estimatedTime: '약 3시간',
    summary: '"카르페 디엠(오늘을 살라)!" 입시 압박 속 명문고 학생들에게 진정한 삶과 꿈의 가치를 가르쳐주는 키팅 선생님의 진정한 교육 이야기.',
    recommendationReason: '방학 마무리를 앞두고, 개학 후 나의 꿈과 진로에 대해 생각하게 만드는 가슴 깊은 명작.',
    targetWeek: 4,
    keyPoints: ['내 삶의 주인이 되는 법', '꿈과 진로에 대한 깊은 인사이트', '세계 청소년 필독서']
  },
  {
    id: 'book-10',
    title: '공부의 신 중학생 공부법',
    author: '강성태',
    publisher: '다산에듀',
    genre: '자기계발/공부법',
    coverGradient: 'from-blue-600 via-cyan-600 to-teal-500',
    coverEmoji: '⚡',
    difficulty: '쉬움',
    pages: 210,
    estimatedTime: '약 2.5시간',
    summary: '개학 전 습관을 다잡는 중학생 맞춤 공부 습관 완성 전략. 실전 팁과 자신감을 극대화해주는 알짜 가이드.',
    recommendationReason: '방학 마지막 주! 다음 학기를 맞이하는 실전 멘탈 관리와 공부 자신감을 충전하세요.',
    targetWeek: 4,
    keyPoints: ['중학생 실전 메타인지 전략', '작은 습관의 힘', '개학 전 동기부여']
  }
];

export const DEMO_PRESET_USERS: UserProfile[] = [
  {
    id: 'user-minjun',
    nickname: '중2 김민준',
    grade: '중2',
    personalityTraits: ['호기심 많은 탐험가', '논리적인 문제해결사', '엉뚱한 아이디어파'],
    favoriteGenres: ['SF/판타지', '추리/미스터리', '과학/우주'],
    readingSpeed: '몰입해서 빠르게',
    readingPreference: '스토리가 흥미진진한 책',
    vacationGoalCount: 5,
    bookPersonaTitle: '🚀 미지의 우주를 개척하는 SF 뇌섹 탐험가',
    bookPersonaDesc: '치밀한 사건 복선과 우주 과학적 상상력에 열광하는 지적 호기심 왕! 한번 빠지면 밤을 새워 완독하는 몰입력의 소유자입니다.',
    badgeEmoji: '🚀',
    createdDate: '2026-07-21'
  },
  {
    id: 'user-seoyeon',
    nickname: '중1 이서연',
    grade: '중1',
    personalityTraits: ['감성적인 dreamer', '따뜻한 공감 능력자'],
    favoriteGenres: ['청소년소설/성장', '시/수필', '웹툰/그래픽노블'],
    readingSpeed: '느긋하게 천천히',
    readingPreference: '감동과 여운이 깊은 책',
    vacationGoalCount: 4,
    bookPersonaTitle: '🌸 마음의 울림을 남기는 감성 소설가',
    bookPersonaDesc: '인물의 마음과 솔직한 대화에 깊이 공감하는 따뜻한 시선을 가진 학생. 책 속 문장에 마음표를 남기는 섬세한 독서가입니다.',
    badgeEmoji: '🌸',
    createdDate: '2026-07-21'
  },
  {
    id: 'user-dohyun',
    nickname: '중3 박도현',
    grade: '중3',
    personalityTraits: ['지식 탐구자', '끈기있는 완독파'],
    favoriteGenres: ['고전/역사', '자기계발/공부법', '과학/우주'],
    readingSpeed: '보통 속도로',
    readingPreference: '새로운 지식을 주는 책',
    vacationGoalCount: 6,
    bookPersonaTitle: '📚 세상을 관통하는 역사의 원리와 지식 수집가',
    bookPersonaDesc: '역사적 사건의 이유와 과학적 원리를 차근차근 배우고 노트에 기록하기를 즐기는 깊이 있는 중3 미래 지성인입니다.',
    badgeEmoji: '📚',
    createdDate: '2026-07-21'
  }
];

export const INITIAL_MOCK_REVIEWS: BookReview[] = [
  {
    id: 'rev-1',
    bookId: 'book-1',
    bookTitle: '아몬드',
    author: '손원평',
    coverGradient: 'from-amber-400 via-orange-500 to-rose-500',
    coverEmoji: '🌱',
    rating: 5,
    oneLiner: '남과 조금 달라도 괜찮다는 용기와 참된 공감이 무엇인지 알게 해준 감동적인 책!',
    favoriteQuote: '"구할 수 없는 인간이란 없다. 구하려는 노력을 그만두는 사람들이 있을 뿐이다."',
    userNickname: '중1 이서연',
    createdDate: '2026-07-18',
    aiComment: '✨ 서연 학생, "구하려는 노력을 그만두지 않는다"는 구절에 깊은 감명을 받았군요! 타인의 차이를 있는 그대로 품어주는 서연 학생의 따뜻한 마음에 AI 독서친구 알피도 크게 공감해요!',
    status: '완독'
  },
  {
    id: 'rev-2',
    bookId: 'book-3',
    bookTitle: '지구 끝의 온실',
    author: '김초엽',
    coverGradient: 'from-emerald-400 via-teal-600 to-cyan-800',
    coverEmoji: '🌿',
    rating: 5,
    oneLiner: '식물 모스바나의 비밀과 인류의 따뜻한 연대가 여름밤 내내 가슴을 두근거리게 만들었어요!',
    favoriteQuote: '"어떤 사랑은 멸망하는 세계를 구하기도 한다."',
    userNickname: '중2 김민준',
    createdDate: '2026-07-20',
    aiComment: '🚀 민준 학생의 미스터리 SF 열정이 그대로 느껴지는 최고의 서평이네요! 멸망하는 세계 속에서도 싹트는 온기를 알아본 민준 학생의 서평에 100점 드립니다!',
    status: '완독'
  }
];
