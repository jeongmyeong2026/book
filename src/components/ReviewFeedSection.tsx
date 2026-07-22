import React, { useState } from 'react';
import { BookReview, UserProfile } from '../types';
import { Star, MessageSquareQuote, Sparkles, BookOpen, Trash2, Award, Filter, Heart, CheckCircle } from 'lucide-react';

interface ReviewFeedSectionProps {
  reviews: BookReview[];
  userProfile: UserProfile | null;
  onDeleteReview: (reviewId: string) => void;
  onExploreWeekly: () => void;
}

export const ReviewFeedSection: React.FC<ReviewFeedSectionProps> = ({
  reviews,
  userProfile,
  onDeleteReview,
  onExploreWeekly,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('전체');

  const filteredReviews = reviews.filter((r) => {
    if (filterStatus === '전체') return true;
    return r.status === filterStatus;
  });

  const completedCount = reviews.filter((r) => r.status === '완독').length;
  const vacationGoal = userProfile?.vacationGoalCount || 5;
  const progressPercent = Math.min(100, Math.round((completedCount / vacationGoal) * 100));

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Vacation Reading Progress Stats Banner */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                나의 방학 독서록
              </span>
              <span className="text-xs text-slate-400">{userProfile?.nickname || '학생'}의 기록</span>
            </div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-400" />
              방학 목표 {completedCount} / {vacationGoal}권 완독 완료!
            </h2>
            <p className="text-xs text-slate-300">
              한 줄 서평을 남기면 AI 알피의 다정한 분석과 응원 댓글이 함께 기록됩니다.
            </p>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 min-w-[200px] space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-400">달성률</span>
              <span className="text-amber-400">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-indigo-400" /> 필터:
          </span>
          {['전체', '완독', '읽는 중', '읽고 싶음'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all border ${
                filterStatus === st
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400 font-medium hidden sm:inline">
          총 <strong className="text-slate-200">{filteredReviews.length}개</strong>의 독서록
        </span>
      </div>

      {/* Review Cards Grid */}
      <div className="space-y-4">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg space-y-4 transition-all"
          >
            {/* Review Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${rev.coverGradient || 'from-indigo-600 to-purple-600'} flex items-center justify-center text-2xl shadow-md`}>
                  {rev.coverEmoji || '📖'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-slate-100">{rev.bookTitle}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      rev.status === '완독'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : rev.status === '읽는 중'
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {rev.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{rev.author} · {rev.createdDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Rating Stars */}
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= rev.rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-700'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => onDeleteReview(rev.id)}
                  title="서평 삭제"
                  className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Student's One-line Review */}
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 text-xs sm:text-sm text-slate-200">
              <p className="font-semibold text-slate-100 leading-relaxed">
                "{rev.oneLiner}"
              </p>

              {rev.favoriteQuote && (
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-xs text-indigo-300 italic flex items-start gap-1.5">
                  <MessageSquareQuote className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <span>"{rev.favoriteQuote}"</span>
                </div>
              )}
            </div>

            {/* AI Reading Mentor Reaction Box */}
            {rev.aiComment && (
              <div className="bg-gradient-to-r from-indigo-950/70 via-slate-900 to-purple-950/70 border border-indigo-500/30 p-3.5 rounded-xl text-xs space-y-1">
                <div className="flex items-center justify-between text-indigo-300 font-bold text-[11px]">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    AI 독서친구 알피의 피드백
                  </span>
                  <span className="text-[10px] text-slate-400">Gemini 3.6 Flash</span>
                </div>
                <p className="text-slate-200 leading-relaxed">{rev.aiComment}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-3">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
          <p className="text-base font-bold text-slate-300">작성된 한 줄 서평이 없어요.</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            주간 추천 도서를 살펴보고, 읽은 책에 짧은 서평을 남겨 AI 알피의 다정한 응원 댓글을 받아보세요!
          </p>
          <button
            onClick={onExploreWeekly}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all"
          >
            주간 추천 도서 둘러보기
          </button>
        </div>
      )}

    </div>
  );
};
