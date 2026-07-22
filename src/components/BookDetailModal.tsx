import React, { useState } from 'react';
import { Book, BookReview, UserProfile } from '../types';
import { X, Star, Sparkles, BookOpen, Clock, Tag, MessageSquareQuote, CheckCircle2, Send } from 'lucide-react';

interface BookDetailModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
  onSubmitReview: (review: BookReview) => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  book,
  isOpen,
  onClose,
  userProfile,
  onSubmitReview,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [status, setStatus] = useState<'완독' | '읽는 중' | '읽고 싶음'>('완독');
  const [oneLiner, setOneLiner] = useState<string>('');
  const [favoriteQuote, setFavoriteQuote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen || !book) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oneLiner.trim()) {
      alert('한 줄 서평을 작성해 주세요!');
      return;
    }

    setIsSubmitting(true);

    let aiComment = '✨ 멋진 서평을 남겨주셔서 고마워요! 다음 방학 추천 책도 알피와 함께 읽어봐요!';

    try {
      const response = await fetch('/api/ai-review-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookTitle: book.title,
          author: book.author,
          rating,
          oneLiner,
          favoriteQuote,
          userNickname: userProfile?.nickname || '중학생 독서가',
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.comment) {
        aiComment = resData.comment;
      }
    } catch (err) {
      console.error('AI Review Comment failed:', err);
    }

    const newReview: BookReview = {
      id: `rev-${Date.now()}`,
      bookId: book.id,
      bookTitle: book.title,
      author: book.author,
      coverGradient: book.coverGradient,
      coverEmoji: book.coverEmoji,
      rating,
      oneLiner,
      favoriteQuote,
      userNickname: userProfile?.nickname || '나의 독서록',
      createdDate: new Date().toISOString().split('T')[0],
      aiComment,
      status,
    };

    onSubmitReview(newReview);
    setIsSubmitting(false);

    // Reset form
    setOneLiner('');
    setFavoriteQuote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className={`p-6 bg-gradient-to-tr ${book.coverGradient || 'from-indigo-600 to-purple-600'} text-white relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-950/40 text-white hover:bg-slate-950/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <span className="text-5xl drop-shadow-md">{book.coverEmoji || '📖'}</span>
            <div className="flex-1 pr-6">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-950/50 text-[10px] font-bold border border-white/20">
                {book.genre}
              </span>
              <h2 className="text-xl sm:text-2xl font-black mt-1 drop-shadow-md">{book.title}</h2>
              <p className="text-xs sm:text-sm text-white/90 font-medium">{book.author} · {book.publisher}</p>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          
          {/* Metadata & Summary */}
          <div className="space-y-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-3 text-xs text-slate-400 pb-2 border-b border-slate-800">
              <span>난이도: <strong className="text-indigo-300">{book.difficulty}</strong></span>
              <span>· 분량: <strong className="text-slate-200">{book.pages}p</strong></span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-400" /> {book.estimatedTime}
              </span>
            </div>

            <div>
              <h4 className="font-bold text-slate-200 mb-1 flex items-center gap-1 text-xs">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> 줄거리
              </h4>
              <p className="text-slate-300 leading-relaxed text-xs">{book.summary}</p>
            </div>

            {/* Why Recommended */}
            <div className="bg-indigo-950/50 p-3 rounded-lg border border-indigo-500/30">
              <p className="font-bold text-indigo-300 text-xs flex items-center gap-1 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI 맞춤 추천 이유
              </p>
              <p className="text-slate-200 text-xs leading-relaxed">{book.recommendationReason}</p>
            </div>
          </div>

          {/* Review Form Section */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                한 줄 서평 쓰기
              </h3>
              <span className="text-xs text-indigo-400 font-semibold">
                작성 즉시 AI 알피의 응원 댓글 생성! ✨
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Rating */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">별점 평가</label>
                <div className="flex items-center gap-1 bg-slate-800 p-2 rounded-xl border border-slate-700 w-fit">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-400 ml-2">{rating}점</span>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">독서 상태</label>
                <div className="flex items-center gap-2">
                  {(['완독', '읽는 중', '읽고 싶음'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatus(st)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        status === st
                          ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* One Liner */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                한 줄 서평 <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={oneLiner}
                onChange={(e) => setOneLiner(e.target.value)}
                placeholder="책을 읽고 느낀 가장 깊은 감정이나 생각을 1~2문장으로 남겨주세요."
                maxLength={150}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Favorite Quote */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <MessageSquareQuote className="w-3.5 h-3.5 text-indigo-400" /> 인상 깊은 구절 (선택)
              </label>
              <input
                type="text"
                value={favoriteQuote}
                onChange={(e) => setFavoriteQuote(e.target.value)}
                placeholder="예: '구할 수 없는 인간이란 없다. 구하려는 노력을 그만둘 뿐이다.'"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 hover:opacity-90 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>AI 알피가 댓글 작성 중...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>서평 저장 및 AI 피드백 받기</span>
                </>
              )}
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
