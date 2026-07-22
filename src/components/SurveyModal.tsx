import React, { useState } from 'react';
import { GradeType, GenreType, UserProfile, SurveyAnswers } from '../types';
import { Sparkles, X, CheckCircle2, ArrowRight, ArrowLeft, BookOpen, User, Compass, Target } from 'lucide-react';

interface SurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (profile: UserProfile) => void;
}

const PERSONALITY_OPTIONS = [
  { id: '호기심 많은 탐험가', label: '호기심 많은 탐험가', emoji: '🚀', desc: '새로운 사실과 신기한 세계에 흥미가 넘쳐요' },
  { id: '감성적인 dreamer', label: '감성적인 dreamer', emoji: '🌸', desc: '이야기 속 인물의 마음에 깊이 감정이입해요' },
  { id: '논리적인 문제해결사', label: '논리적인 문제해결사', emoji: '🔍', desc: '치밀한 사건 복선과 추리를 파헤치는 걸 좋아해요' },
  { id: '엉뚱한 아이디어파', label: '엉뚱한 아이디어파', emoji: '💡', desc: '기발하고 유쾌한 상상력이 넘치는 스토리를 찾아요' },
  { id: '몰입왕 집돌이/집순이', label: '몰입왕 집순이/집돌이', emoji: '🏠', desc: '조용한 방에서 책 속에 한참 동안 푹 빠져요' },
  { id: '끈기있는 완독파', label: '끈기있는 완독파', emoji: '📚', desc: '시작한 책은 마지막 장까지 차근차근 끝내요' },
];

const GENRE_OPTIONS: { id: GenreType; label: string; emoji: string }[] = [
  { id: 'SF/판타지', label: 'SF / 판타지', emoji: '🪐' },
  { id: '추리/미스터리', label: '추리 / 미스터리', emoji: '🕵️‍♂️' },
  { id: '청소년소설/성장', label: '청소년 성장 소설', emoji: '🌱' },
  { id: '과학/우주', label: '과학 / 우주 탐구', emoji: '🧪' },
  { id: '웹툰/그래픽노블', label: '웹툰 / 그래픽노블', emoji: '🎨' },
  { id: '고전/역사', label: '고전 / 역사 이야기', emoji: '📜' },
  { id: '자기계발/공부법', label: '자기계발 / 공부법', emoji: '⚡' },
  { id: '시/수필', label: '시 / 따뜻한 수필', emoji: '☕' },
];

export const SurveyModal: React.FC<SurveyModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [step, setStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analyzingText, setAnalyzingText] = useState<string>('취향 데이터 분석 중...');

  const [answers, setAnswers] = useState<SurveyAnswers>({
    nickname: '',
    grade: '중2',
    personalityTraits: ['호기심 많은 탐험가'],
    favoriteGenres: ['청소년소설/성장', 'SF/판타지'],
    readingSpeed: '보통 속도로',
    readingPreference: '스토리가 흥미진진한 책',
    vacationGoalCount: 5,
  });

  const [resultPersona, setResultPersona] = useState<{
    bookPersonaTitle: string;
    bookPersonaDesc: string;
    badgeEmoji: string;
    customMessage: string;
  } | null>(null);

  if (!isOpen) return null;

  const togglePersonality = (trait: string) => {
    if (answers.personalityTraits.includes(trait)) {
      if (answers.personalityTraits.length > 1) {
        setAnswers({
          ...answers,
          personalityTraits: answers.personalityTraits.filter((t) => t !== trait),
        });
      }
    } else {
      if (answers.personalityTraits.length < 3) {
        setAnswers({
          ...answers,
          personalityTraits: [...answers.personalityTraits, trait],
        });
      }
    }
  };

  const toggleGenre = (genre: GenreType) => {
    if (answers.favoriteGenres.includes(genre)) {
      if (answers.favoriteGenres.length > 1) {
        setAnswers({
          ...answers,
          favoriteGenres: answers.favoriteGenres.filter((g) => g !== genre),
        });
      }
    } else {
      if (answers.favoriteGenres.length < 3) {
        setAnswers({
          ...answers,
          favoriteGenres: [...answers.favoriteGenres, genre],
        });
      }
    }
  };

  const handleNextStep = () => {
    if (step === 1 && !answers.nickname.trim()) {
      alert('닉네임을 입력해 주세요!');
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handleSubmitSurvey = async () => {
    setIsLoading(true);
    setStep(5); // Analysis loading step

    const loadingTexts = [
      'Gemini AI가 설문 답변을 다각도로 분석하고 있어요...',
      '나만의 방학 독서 페르소나 카드 생성 중...',
      '주차별 맞춤 도서 가이드를 조율 중이에요...',
    ];

    let textIdx = 0;
    const interval = setInterval(() => {
      textIdx = (textIdx + 1) % loadingTexts.length;
      setAnalyzingText(loadingTexts[textIdx]);
    }, 1200);

    try {
      const response = await fetch('/api/survey-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
      });

      const resData = await response.json();
      clearInterval(interval);

      if (resData.success && resData.data) {
        setResultPersona(resData.data);
      } else if (resData.fallback) {
        setResultPersona(resData.fallback);
      } else {
        setResultPersona({
          bookPersonaTitle: '🚀 우주와 스토리를 탐험하는 감성독서가',
          bookPersonaDesc: '몰입감 넘치는 세계와 깊은 여운을 즐기는 멋진 중학생 독서가입니다.',
          badgeEmoji: '⭐',
          customMessage: '이번 방학 즐거운 독서 여정을 함께해요!',
        });
      }
      setIsLoading(false);
    } catch (e) {
      clearInterval(interval);
      console.error(e);
      setResultPersona({
        bookPersonaTitle: '📚 지혜와 상상력을 높이는 방학 독서가',
        bookPersonaDesc: '자신만의 재미있는 책 세상을 차근차근 발견해가는 멋진 중학생입니다.',
        badgeEmoji: '📖',
        customMessage: '알피가 추천하는 주간 맞춤 책을 만나보세요!',
      });
      setIsLoading(false);
    }
  };

  const handleFinishOnboarding = () => {
    if (!resultPersona) return;

    const newProfile: UserProfile = {
      id: `user-${Date.now()}`,
      nickname: answers.nickname,
      grade: answers.grade,
      personalityTraits: answers.personalityTraits,
      favoriteGenres: answers.favoriteGenres,
      readingSpeed: answers.readingSpeed,
      readingPreference: answers.readingPreference,
      vacationGoalCount: answers.vacationGoalCount,
      bookPersonaTitle: resultPersona.bookPersonaTitle,
      bookPersonaDesc: resultPersona.bookPersonaDesc,
      badgeEmoji: resultPersona.badgeEmoji || '📖',
      createdDate: new Date().toISOString().split('T')[0],
    };

    onComplete(newProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-100">
                {step === 5 && !isLoading ? '독서 성향 분석 완료!' : '중학생 맞춤 독서 성향 설문'}
              </h2>
              <p className="text-xs text-slate-400">
                {step <= 4 ? `Step ${step} / 4 - 1분이면 끝나요!` : '나만의 독서 캐릭터 발견'}
              </p>
            </div>
          </div>

          {step !== 5 && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Progress Bar (Steps 1-4) */}
        {step <= 4 && (
          <div className="w-full bg-slate-800 h-1">
            <div
              className="bg-gradient-to-r from-indigo-500 to-pink-500 h-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        )}

        {/* Step Contents */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="text-center space-y-1">
                <span className="text-3xl">👋</span>
                <h3 className="text-lg font-bold text-slate-100">반가워요! 어떻게 불러드릴까요?</h3>
                <p className="text-xs text-slate-400">방학 동안 사용할 닉네임과 학년을 선택해 주세요.</p>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-indigo-400" /> 닉네임
                  </label>
                  <input
                    type="text"
                    value={answers.nickname}
                    onChange={(e) => setAnswers({ ...answers, nickname: e.target.value })}
                    placeholder="예: 독서왕 민준이, 서연이, 도현이"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> 현재 학년
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['중1', '중2', '중3'] as GradeType[]).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setAnswers({ ...answers, grade: g })}
                        className={`py-3 rounded-xl border text-sm font-semibold transition-all ${
                          answers.grade === g
                            ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200 shadow-md shadow-indigo-600/20'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Personality & Vibe */}
          {step === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="text-center space-y-1">
                <span className="text-3xl">✨</span>
                <h3 className="text-lg font-bold text-slate-100">나의 평소 성격과 매력은?</h3>
                <p className="text-xs text-slate-400">1개~3개까지 선택할 수 있어요!</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {PERSONALITY_OPTIONS.map((item) => {
                  const isSelected = answers.personalityTraits.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => togglePersonality(item.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'bg-indigo-600/20 border-indigo-500 text-slate-100 shadow-sm'
                          : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <span className="text-2xl">{item.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-xs text-slate-200">{item.label}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{item.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Favorite Genres */}
          {step === 3 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="text-center space-y-1">
                <span className="text-3xl">📚</span>
                <h3 className="text-lg font-bold text-slate-100">어떤 종류의 책을 좋아하시나요?</h3>
                <p className="text-xs text-slate-400">관심 가는 분야 1~3개를 선택해주세요.</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {GENRE_OPTIONS.map((g) => {
                  const isSelected = answers.favoriteGenres.includes(g.id);
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => toggleGenre(g.id)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'bg-indigo-600/30 border-indigo-500 text-indigo-100 shadow-md shadow-indigo-600/10'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <span className="text-xl">{g.emoji}</span>
                      <span className="font-semibold text-xs text-slate-200">{g.label}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400 ml-auto" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Reading Habits & Goal */}
          {step === 4 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="text-center space-y-1">
                <span className="text-3xl">🎯</span>
                <h3 className="text-lg font-bold text-slate-100">방학 독서 습관과 목표 세우기</h3>
                <p className="text-xs text-slate-400">나에게 딱맞는 완벽한 추천을 준비할게요.</p>
              </div>

              <div className="space-y-4 pt-2">
                {/* Reading Speed */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-indigo-400" /> 나의 독서 속도는?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['느긋하게 천천히', '보통 속도로', '몰입해서 빠르게'] as const).map((speed) => (
                      <button
                        key={speed}
                        type="button"
                        onClick={() => setAnswers({ ...answers, readingSpeed: speed })}
                        className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${
                          answers.readingSpeed === speed
                            ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                        }`}
                      >
                        {speed}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preference */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    책을 읽을 때 가장 끌리는 요소는?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      '스토리가 흥미진진한 책',
                      '감동과 여운이 깊은 책',
                      '새로운 지식을 주는 책',
                      '가볍게 읽기 좋은 책',
                    ].map((pref) => (
                      <button
                        key={pref}
                        type="button"
                        onClick={() => setAnswers({ ...answers, readingPreference: pref as any })}
                        className={`p-2.5 rounded-xl text-xs font-semibold border text-left transition-all ${
                          answers.readingPreference === pref
                            ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                        }`}
                      >
                        {pref}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Vacation Goal Count */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                    <Target className="w-3.5 h-3.5 text-amber-400" /> 이번 방학 독서 목표 권수
                  </label>
                  <div className="flex items-center justify-between gap-2 bg-slate-800 p-3 rounded-xl border border-slate-700">
                    {[3, 4, 5, 7, 10].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setAnswers({ ...answers, vacationGoalCount: num })}
                        className={`w-10 h-10 rounded-xl text-xs font-bold transition-all border ${
                          answers.vacationGoalCount === num
                            ? 'bg-gradient-to-tr from-indigo-600 to-pink-600 text-white border-indigo-400 shadow-md'
                            : 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600'
                        }`}
                      >
                        {num}권
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: AI Analysis Loading or Result */}
          {step === 5 && (
            <div className="space-y-6 animate-fadeIn py-4">
              {isLoading ? (
                <div className="text-center py-10 space-y-4">
                  <div className="relative inline-block">
                    <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto" />
                    <Sparkles className="w-6 h-6 text-amber-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-100">Gemini AI 성향 분석 중</h4>
                    <p className="text-xs text-indigo-300 mt-1 animate-pulse">{analyzingText}</p>
                  </div>
                </div>
              ) : resultPersona ? (
                <div className="space-y-5">
                  {/* Result Persona Card */}
                  <div className="bg-gradient-to-br from-indigo-900/60 via-slate-900 to-slate-900 p-5 rounded-2xl border border-indigo-500/40 relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                    
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-pink-600 flex items-center justify-center text-3xl shadow-lg shadow-indigo-500/20">
                        {resultPersona.badgeEmoji || '📖'}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-indigo-300 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                          {answers.grade} {answers.nickname} 학생의 페르소나
                        </span>
                        <h3 className="text-base font-bold text-white mt-1">
                          {resultPersona.bookPersonaTitle}
                        </h3>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mt-4 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                      {resultPersona.bookPersonaDesc}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-slate-400">방학 독서 목표:</span>
                      <span className="font-bold text-amber-400">{answers.vacationGoalCount}권 완독하기 🎯</span>
                    </div>
                  </div>

                  <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 text-xs text-slate-300">
                    <p className="font-semibold text-indigo-300 mb-1 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI 독서친구 알피의 메시지
                    </p>
                    <p className="italic text-slate-200">"{resultPersona.customMessage}"</p>
                  </div>
                </div>
              ) : null}
            </div>
          )}

        </div>

        {/* Footer Navigation Controls */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          {step > 1 && step < 5 ? (
            <button
              onClick={() => setStep((prev) => prev - 1)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> 이전
            </button>
          ) : <div />}

          {step <= 3 && (
            <button
              onClick={handleNextStep}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1 transition-all shadow-md shadow-indigo-600/20 ml-auto"
            >
              다음 <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {step === 4 && (
            <button
              onClick={handleSubmitSurvey}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 hover:opacity-90 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-indigo-600/30 ml-auto"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              AI 독서 성향 분석하기
            </button>
          )}

          {step === 5 && !isLoading && (
            <button
              onClick={handleFinishOnboarding}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 hover:opacity-90 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/30"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              맞춤 도서 추천받으러 가기!
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
