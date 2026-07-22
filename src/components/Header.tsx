import React from 'react';
import { UserProfile } from '../types';
import { BookOpen, Sparkles, RotateCcw, Compass, Award } from 'lucide-react';

interface HeaderProps {
  userProfile: UserProfile | null;
  onOpenSurvey: () => void;
  onOpenAiSearch: () => void;
  activeTab: 'weekly' | 'reviews';
  setActiveTab: (tab: 'weekly' | 'reviews') => void;
  reviewsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  userProfile,
  onOpenSurvey,
  onOpenAiSearch,
  activeTab,
  setActiveTab,
  reviewsCount,
}) => {
  const goalProgress = userProfile 
    ? Math.min(100, Math.round((reviewsCount / userProfile.vacationGoalCount) * 100))
    : 0;

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-lg font-bold bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
                    북스윗
                  </h1>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    중학생 방학 독서
                  </span>
                </div>
                <p className="text-xs text-slate-400">맞춤 AI 도서 추천 & 한 줄 서평</p>
              </div>
            </div>

            {/* AI Search Quick Trigger (Mobile) */}
            <button
              onClick={onOpenAiSearch}
              className="sm:hidden flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 text-xs font-medium active:scale-95 transition-all"
            >
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              AI 나침반
            </button>
          </div>

          {/* User Profile Badge & Goal Progress Bar */}
          {userProfile ? (
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700/60">
              <div className="flex items-center gap-2">
                <span className="text-xl">{userProfile.badgeEmoji || '📚'}</span>
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                    <span>{userProfile.nickname}</span>
                    <span className="text-[10px] text-indigo-400 bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-800/50">
                      {userProfile.grade}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 max-w-[180px] sm:max-w-[220px] truncate" title={userProfile.bookPersonaTitle}>
                    {userProfile.bookPersonaTitle}
                  </p>
                </div>
              </div>

              {/* Goal Progress Ring/Bar */}
              <div className="hidden md:flex flex-col items-end pl-3 border-l border-slate-700">
                <div className="flex items-center gap-1 text-[11px] text-slate-300 font-medium">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>목표 {reviewsCount}/{userProfile.vacationGoalCount}권</span>
                </div>
                <div className="w-20 bg-slate-700 rounded-full h-1.5 mt-1 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-pink-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${goalProgress}%` }}
                  />
                </div>
              </div>

              <button
                onClick={onOpenSurvey}
                title="취향 설문 다시하기"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors text-xs flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">설문 수정</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenSurvey}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium text-xs sm:text-sm shadow-md shadow-indigo-500/20 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              1분 독서 취향 분석 시작
            </button>
          )}
        </div>

        {/* Main Navigation Tabs */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('weekly')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'weekly'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              주간 AI 추천 도서
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 relative ${
                activeTab === 'reviews'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              나의 독서록 & 한 줄 서평
              {reviewsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-pink-500 text-white font-bold">
                  {reviewsCount}
                </span>
              )}
            </button>
          </div>

          <button
            onClick={onOpenAiSearch}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all shadow-sm"
          >
            <Compass className="w-4 h-4 text-indigo-400" />
            <span>AI 독서 나침반</span>
            <span className="text-[10px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded">맞춤 질문</span>
          </button>
        </div>

      </div>
    </header>
  );
};
