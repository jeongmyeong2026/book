import React from 'react';
import { UserProfile } from '../types';
import { DEMO_PRESET_USERS } from '../data/mockBooks';
import { Sparkles, Users, RefreshCw } from 'lucide-react';

interface HackathonDemoBarProps {
  currentProfile: UserProfile | null;
  onSelectPreset: (profile: UserProfile) => void;
  onResetSurvey: () => void;
}

export const HackathonDemoBar: React.FC<HackathonDemoBarProps> = ({
  currentProfile,
  onSelectPreset,
  onResetSurvey,
}) => {
  return (
    <div className="bg-gradient-to-r from-violet-950 via-slate-900 to-indigo-950 border-b border-indigo-500/30 px-4 py-2 text-slate-200 text-xs">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-bold text-[10px] tracking-wide flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3 h-3" />
            해커톤 시연용 데모
          </span>
          <span className="text-slate-300 hidden md:inline text-[11px]">
            다양한 중학생 프로필을 클릭하여 취향별 주간 AI 도서 추천의 변화를 즉시 확인해보세요!
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <span className="text-slate-400 text-[11px] whitespace-nowrap flex items-center gap-1">
            <Users className="w-3 h-3 text-indigo-400" /> 학생 선택:
          </span>

          {DEMO_PRESET_USERS.map((preset) => {
            const isSelected = currentProfile?.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                }`}
              >
                <span>{preset.badgeEmoji}</span>
                <span>{preset.nickname}</span>
                <span className="text-[10px] opacity-75">({preset.favoriteGenres[0]})</span>
              </button>
            );
          })}

          <button
            onClick={onResetSurvey}
            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium border border-slate-700 transition-colors flex items-center gap-1 whitespace-nowrap"
          >
            <RefreshCw className="w-3 h-3 text-amber-400" />
            직접 설문하기
          </button>
        </div>
      </div>
    </div>
  );
};
