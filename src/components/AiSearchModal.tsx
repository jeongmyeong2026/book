import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Compass, X, Sparkles, Send, BookOpen, ArrowRight } from 'lucide-react';

interface AiSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
}

const PRESET_QUERIES = [
  '시험 끝난 날 부담 없이 읽기 좋은 가벼운 책 추천해줘! 🎈',
  '친구 관계 때문에 마음이 답답할 때 위로가 되는 소설 🌸',
  '비 오는 여름밤에 읽기 좋은 오싹하고 흥미진진한 추리 소설 🔍',
  '우주와 미래 기술에 가슴이 두근거리는 입문용 SF 소설 🚀',
  '공부 의욕과 동기부여를 팍팍 얻을 수 있는 책 ⚡',
];

export const AiSearchModal: React.FC<AiSearchModalProps> = ({
  isOpen,
  onClose,
  userProfile,
}) => {
  const [query, setQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<{
    adviceMessage: string;
    recommendations: {
      title: string;
      author: string;
      genre: string;
      reason: string;
      coverEmoji: string;
    }[];
  } | null>(null);

  if (!isOpen) return null;

  const handleSearch = async (targetQuery?: string) => {
    const q = targetQuery || query;
    if (!q.trim()) return;

    setIsLoading(true);
    setSearchResult(null);

    try {
      const response = await fetch('/api/ai-book-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          userProfile,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setSearchResult(resData.data);
      }
    } catch (e) {
      console.error('AI Book Search failed:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Compass className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-100">AI 독서 나침반</h2>
              <p className="text-xs text-slate-400">내 마음, 기분, 관심사에 맞는 책을 바로 물어보세요!</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs sm:text-sm">
          
          {/* Preset Questions */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              추천 맞춤 질문 예시
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_QUERIES.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(preset);
                    handleSearch(preset);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 text-xs font-medium text-left transition-all hover:border-indigo-500/50"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Search Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="예: 방학 동안 밤에 부담 없이 읽을 힐링 소설 추천해줘!"
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>질문</span>
            </button>
          </form>

          {/* AI Result View */}
          {isLoading && (
            <div className="py-8 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto" />
              <p className="text-xs text-indigo-300 animate-pulse">
                Gemini AI가 상황에 딱 맞는 책을 찾고 있어요...
              </p>
            </div>
          )}

          {searchResult && (
            <div className="space-y-4 pt-2 animate-fadeIn">
              {/* Advice */}
              <div className="bg-indigo-950/60 border border-indigo-500/30 p-3.5 rounded-xl text-xs space-y-1">
                <p className="font-bold text-indigo-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI 독서친구 알피의 답변
                </p>
                <p className="text-slate-200 leading-relaxed">{searchResult.adviceMessage}</p>
              </div>

              {/* Recommendations */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs text-slate-300 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> 추천 도서
                </h4>

                {searchResult.recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl space-y-2 hover:border-slate-600 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{rec.coverEmoji || '📘'}</span>
                        <div>
                          <h5 className="font-bold text-sm text-slate-100">{rec.title}</h5>
                          <p className="text-xs text-slate-400">{rec.author} · {rec.genre}</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                      💡 {rec.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
