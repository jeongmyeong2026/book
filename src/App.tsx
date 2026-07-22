import React, { useState, useEffect } from 'react';
import { UserProfile, Book, BookReview } from './types';
import { DEFAULT_MOCK_BOOKS, DEMO_PRESET_USERS, INITIAL_MOCK_REVIEWS } from './data/mockBooks';
import { Header } from './components/Header';
import { HackathonDemoBar } from './components/HackathonDemoBar';
import { SurveyModal } from './components/SurveyModal';
import { WeeklyRecommendation } from './components/WeeklyRecommendation';
import { BookDetailModal } from './components/BookDetailModal';
import { ReviewFeedSection } from './components/ReviewFeedSection';
import { AiSearchModal } from './components/AiSearchModal';
import { BookOpen, Sparkles, Award, Heart, HelpCircle } from 'lucide-react';

export default function App() {
  // LocalStorage Keys
  const STORAGE_KEY_PROFILE = 'booksweet_user_profile';
  const STORAGE_KEY_REVIEWS = 'booksweet_user_reviews';
  const STORAGE_KEY_SAVED = 'booksweet_saved_book_ids';

  // State Management
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEMO_PRESET_USERS[0]; // Default demo profile: 중2 김민준
  });

  const [reviews, setReviews] = useState<BookReview[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_REVIEWS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_MOCK_REVIEWS;
  });

  const [savedBookIds, setSavedBookIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SAVED);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return ['book-1', 'book-3'];
  });

  const [weeklyBooks, setWeeklyBooks] = useState<Book[]>(DEFAULT_MOCK_BOOKS);
  const [currentWeek, setCurrentWeek] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'weekly' | 'reviews'>('weekly');
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);

  // Modals
  const [isSurveyOpen, setIsSurveyOpen] = useState<boolean>(false);
  const [isAiSearchOpen, setIsAiSearchOpen] = useState<boolean>(false);
  const [selectedBookForDetail, setSelectedBookForDetail] = useState<Book | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(userProfile));
    }
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(savedBookIds));
  }, [savedBookIds]);

  // Handlers
  const handleSelectPreset = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  const handleCompleteSurvey = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
  };

  const handleToggleSaveBook = (bookId: string) => {
    setSavedBookIds((prev) =>
      prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]
    );
  };

  const handleSubmitReview = (newReview: BookReview) => {
    setReviews((prev) => [newReview, ...prev]);
    setActiveTab('reviews');
  };

  const handleDeleteReview = (reviewId: string) => {
    if (window.confirm('서평을 삭제하시겠습니까?')) {
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    }
  };

  // AI Regenerate Recommendations for current week
  const handleRegenerateWeekly = async () => {
    if (!userProfile) {
      setIsSurveyOpen(true);
      return;
    }

    setIsRegenerating(true);

    try {
      const response = await fetch('/api/weekly-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile,
          targetWeek: currentWeek,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.books && resData.books.length > 0) {
        // Map new books to current week format with gradients
        const gradientList = [
          'from-indigo-600 via-purple-600 to-pink-600',
          'from-emerald-500 via-teal-600 to-cyan-700',
          'from-amber-500 via-orange-600 to-rose-600',
          'from-sky-500 via-blue-600 to-indigo-700',
        ];

        const formattedBooks: Book[] = resData.books.map((b: any, idx: number) => ({
          id: `gen-book-${currentWeek}-${Date.now()}-${idx}`,
          title: b.title,
          author: b.author,
          publisher: b.publisher,
          genre: b.genre,
          coverGradient: gradientList[idx % gradientList.length],
          coverEmoji: b.coverEmoji || '📖',
          difficulty: b.difficulty || '보통',
          pages: b.pages || 230,
          estimatedTime: b.estimatedTime || '약 2.5시간',
          summary: b.summary,
          recommendationReason: b.recommendationReason,
          targetWeek: currentWeek,
          keyPoints: b.keyPoints || [],
        }));

        // Replace books for this week
        setWeeklyBooks((prev) => [
          ...prev.filter((b) => b.targetWeek !== currentWeek),
          ...formattedBooks,
        ]);
      }
    } catch (e) {
      console.error('Failed to regenerate weekly books:', e);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Hackathon Demo Helper Bar */}
      <HackathonDemoBar
        currentProfile={userProfile}
        onSelectPreset={handleSelectPreset}
        onResetSurvey={() => setIsSurveyOpen(true)}
      />

      {/* Main Header */}
      <Header
        userProfile={userProfile}
        onOpenSurvey={() => setIsSurveyOpen(true)}
        onOpenAiSearch={() => setIsAiSearchOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        reviewsCount={reviews.filter((r) => r.status === '완독').length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 space-y-6">
        
        {/* User Persona Highlight Banner */}
        {userProfile && (
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <span className="text-3xl p-2 rounded-xl bg-slate-800/80 border border-slate-700">
                {userProfile.badgeEmoji || '📖'}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                    {userProfile.grade} {userProfile.nickname}
                  </span>
                  <span className="text-xs text-slate-400">선호: {userProfile.favoriteGenres.join(', ')}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-100 mt-0.5">
                  {userProfile.bookPersonaTitle}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs">
              <span className="text-slate-400">독서 속도:</span>
              <span className="font-semibold text-slate-200">{userProfile.readingSpeed}</span>
            </div>
          </div>
        )}

        {/* Tab 1: Weekly AI Recommendation View */}
        {activeTab === 'weekly' && (
          <WeeklyRecommendation
            userProfile={userProfile}
            currentWeek={currentWeek}
            onSelectWeek={setCurrentWeek}
            books={weeklyBooks}
            onOpenBookDetail={(book) => setSelectedBookForDetail(book)}
            onQuickAddReview={(book) => setSelectedBookForDetail(book)}
            onRegenerateWeekly={handleRegenerateWeekly}
            isRegenerating={isRegenerating}
            savedBookIds={savedBookIds}
            onToggleSaveBook={handleToggleSaveBook}
          />
        )}

        {/* Tab 2: My Reading Review Feed */}
        {activeTab === 'reviews' && (
          <ReviewFeedSection
            reviews={reviews}
            userProfile={userProfile}
            onDeleteReview={handleDeleteReview}
            onExploreWeekly={() => setActiveTab('weekly')}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 북스윗 (BookSweet) - 중학생 방학 맞춤 독서 추천 & 한 줄 서평 플랫폼</p>
          <p className="text-slate-600">Google AI Studio Gemini API Powered · Hackathon Project</p>
        </div>
      </footer>

      {/* Modals */}
      <SurveyModal
        isOpen={isSurveyOpen}
        onClose={() => setIsSurveyOpen(false)}
        onComplete={handleCompleteSurvey}
      />

      <BookDetailModal
        book={selectedBookForDetail}
        isOpen={!!selectedBookForDetail}
        onClose={() => setSelectedBookForDetail(null)}
        userProfile={userProfile}
        onSubmitReview={handleSubmitReview}
      />

      <AiSearchModal
        isOpen={isAiSearchOpen}
        onClose={() => setIsAiSearchOpen(false)}
        userProfile={userProfile}
      />

    </div>
  );
}
