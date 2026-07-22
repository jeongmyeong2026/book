import React, { useState } from 'react';
import { Book, UserProfile } from '../types';
import { Sparkles, BookOpen, Clock, Calendar, CheckCircle, Plus, Star, Tag, RefreshCw, Flame } from 'lucide-react';

interface WeeklyRecommendationProps {
  userProfile: UserProfile | null;
  currentWeek: number;
  onSelectWeek: (week: number) => void;
  books: Book[];
  onOpenBookDetail: (book: Book) => void;
  onQuickAddReview: (book: Book) => void;
  onRegenerateWeekly: () => void;
  isRegenerating: boolean;
  savedBookIds: string[];
  onToggleSaveBook: (bookId: string) => void;
}

const WEEK_INFO = [
  { week: 1, title: '1주차', subtitle: '방학 시작! 몰입 베스트셀러', desc: '쉽고 재미있게 독서 엔진을 거는 주차' },
  { week: 2, title: '2주차', subtitle: '취향 몰입 장르 탐험', desc: '내 성향에 딱 맞는 재미있고 깊이있는 소설' },
  { week: 3, title: '3주차', subtitle: '생각과 지식을 넓히기', desc: '미스터리, 인문과학으로 상상력 키우기' },
  { week: 4, title: '4주차', subtitle: '개학 전 자신감 충전', desc: '마음에 울림과 감동을 주는 방학 마무리작' },
];

export const WeeklyRecommendation: React.FC<WeeklyRecommendationProps> = ({
  userProfile,
  currentWeek,
  onSelectWeek,
  books,
  onOpenBookDetail,
  onQuickAddReview,
  onRegenerateWeekly,
  isRegenerating,
  savedBookIds,
  onToggleSaveBook,
}) => {
  const [selectedGenreFilter, setSelectedGenreFilter] = useState<string>('전체');

  const filteredBooks = books.filter((b) => {
    if (b.targetWeek !== currentWeek) return false;
    if (selectedGenreFilter !== '전체' && !b.genre.includes(selectedGenreFilter)) return false;
    return true;
  });

  const availableGenres = ['전체', ...Array.from(new Set(books.map((b) => b.genre.split('/')[0])))];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Week Selector Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                주간 맞춤 큐레이션
              </span>
              <span className="text-xs text-slate-400">
                {userProfile ? `${userProfile.nickname} 학생 맞춤 추천` : '중학생 방학 추천'}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-100 mt-1 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" />
              {WEEK_INFO.find((w) => w.week === currentWeek)?.title}: {WEEK_INFO.find((w) => w.week === currentWeek)?.subtitle}
            </h2>
          </div>

          <button
            onClick={onRegenerateWeekly}
            disabled={isRegenerating}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold border border-indigo-500/30 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>{isRegenerating ? 'AI 도서 조율 중...' : 'Gemini 추천 새로고침'}</span>
          </button>
        </div>

        {/* 4-Week Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {WEEK_INFO.map((item) => {
            const isActive = currentWeek === item.week;
            return (
              <button
                key={item.week}
                onClick={() => onSelectWeek(item.week)}
                className={`p-3 rounded-xl text-left transition-all border relative overflow-hidden ${
                  isActive
                    ? 'bg-gradient-to-br from-indigo-900/80 to-slate-900 border-indigo-500 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isActive ? 'text-indigo-300' : 'text-slate-400'}`}>
                    {item.title}
                  </span>
                  {isActive && <Flame className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                <p className="text-xs font-semibold text-slate-200 mt-0.5 truncate">{item.subtitle}</p>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{item.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Genre Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1 pl-1">
          <Tag className="w-3.5 h-3.5 text-indigo-400" /> 필터:
        </span>
        {availableGenres.map((g) => (
          <button
            key={g}
            onClick={() => setSelectedGenreFilter(g)}
            className={`px-3 py-1 rounded-lg font-medium transition-all whitespace-nowrap border ${
              selectedGenreFilter === g
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Book Recommendation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBooks.map((book) => {
          const isSaved = savedBookIds.includes(book.id);
          return (
            <div
              key={book.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all flex flex-col group shadow-lg"
            >
              {/* Cover Gradient Header */}
              <div className={`h-36 bg-gradient-to-tr ${book.coverGradient || 'from-indigo-600 to-purple-600'} p-4 relative flex flex-col justify-between`}>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-950/60 backdrop-blur-md text-white text-[10px] font-bold border border-white/20">
                    {book.genre}
                  </span>

                  <button
                    onClick={() => onToggleSaveBook(book.id)}
                    className={`p-1.5 rounded-full backdrop-blur-md transition-all ${
                      isSaved
                        ? 'bg-pink-500 text-white'
                        : 'bg-slate-950/40 text-slate-300 hover:bg-slate-950/70 hover:text-white'
                    }`}
                    title={isSaved ? '보관함에 저장됨' : '읽고 싶어요 추가'}
                  >
                    <Plus className={`w-4 h-4 ${isSaved ? 'rotate-45' : ''}`} />
                  </button>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="text-lg font-black text-white drop-shadow-md line-clamp-1">
                      {book.title}
                    </h3>
                    <p className="text-xs text-white/90 font-medium drop-shadow-sm">
                      {book.author} · {book.publisher}
                    </p>
                  </div>
                  <span className="text-3xl drop-shadow-lg">{book.coverEmoji || '📖'}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  {/* Meta Tags */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-medium">
                      난이도: {book.difficulty}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-indigo-400" /> {book.estimatedTime}
                    </span>
                    <span>· {book.pages}p</span>
                  </div>

                  {/* Recommendation Reason Box */}
                  <div className="bg-indigo-950/40 border border-indigo-500/30 p-2.5 rounded-xl text-xs text-indigo-200">
                    <p className="font-bold text-[11px] text-indigo-300 flex items-center gap-1 mb-0.5">
                      <Sparkles className="w-3 h-3 text-amber-400" /> 추천 이유
                    </p>
                    <p className="leading-relaxed text-slate-300 line-clamp-2">{book.recommendationReason}</p>
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {book.summary}
                  </p>

                  {/* Key Highlights */}
                  {book.keyPoints && book.keyPoints.length > 0 && (
                    <div className="space-y-1 pt-1">
                      {book.keyPoints.slice(0, 2).map((kp, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                          <span className="truncate">{kp}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => onQuickAddReview(book)}
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs flex items-center justify-center gap-1 shadow-md shadow-indigo-600/20 transition-all active:scale-95"
                  >
                    <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                    한 줄 서평 쓰기
                  </button>

                  <button
                    onClick={() => onOpenBookDetail(book)}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
                  >
                    상세
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-400 space-y-2">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-300">선택한 장르의 추천 도서가 없어요.</p>
          <p className="text-xs text-slate-500">'전체' 필터를 선택하거나 'Gemini 추천 새로고침'을 눌러보세요.</p>
        </div>
      )}

    </div>
  );
};
