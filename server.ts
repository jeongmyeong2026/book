import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is missing in process.env');
  }
  return new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API 1: Survey Analysis & Book Persona Generation
app.post('/api/survey-analyze', async (req, res) => {
  try {
    const { nickname, grade, personalityTraits, favoriteGenres, readingSpeed, readingPreference, vacationGoalCount } = req.body;

    const prompt = `
당신은 대한민국 중학생 방학 맞춤 독서 컨설턴트 및 AI 독서 파트너 "알피"입니다.
다음 중학생의 설문 결과를 바탕으로 학생의 독서 캐릭터(Book Persona)와 방학 독서 가이드를 생성해주세요.

[학생 설문 정보]
- 닉네임: ${nickname}
- 학년: ${grade}
- 성격/특성: ${personalityTraits?.join(', ')}
- 선호 장르: ${favoriteGenres?.join(', ')}
- 독서 속도: ${readingSpeed}
- 좋아하는 책 스타일: ${readingPreference}
- 방학 목표 독서량: ${vacationGoalCount}권

[응답 요구사항]
1. bookPersonaTitle: 학생의 취향과 성격을 반영한 매력적인 1줄 페르소나 제목 (예: "🚀 우주와 미스터리를 넘나드는 SF 뇌섹 탐험가", "🌸 인물의 마음에 공감하는 따뜻한 독서 감성파")
2. bookPersonaDesc: 학생의 성격과 독서 스타일을 긍정적이고 멋지게 칭찬해주는 2~3문장의 설명
3. badgeEmoji: 페르소나에 어울리는 대표 이모지 1개
4. weeklyFocusTips: 1주차부터 4주차까지 방학 동안 권장하는 독서 테마 추천
5. customMessage: 중학생 맞춤 따뜻한 격려 메시지 (1~2문장)
`;

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bookPersonaTitle: { type: Type.STRING },
            bookPersonaDesc: { type: Type.STRING },
            badgeEmoji: { type: Type.STRING },
            weeklyFocusTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '4개의 주차별 테마 팁'
            },
            customMessage: { type: Type.STRING }
          },
          required: ['bookPersonaTitle', 'bookPersonaDesc', 'badgeEmoji', 'weeklyFocusTips', 'customMessage']
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error in /api/survey-analyze:', error);
    res.status(500).json({
      success: false,
      message: 'AI 성향 분석 중 오류가 발생했습니다.',
      fallback: {
        bookPersonaTitle: '📚 지혜와 상상력을 넓히는 방학 독서가',
        bookPersonaDesc: '방학 동안 자신만의 속도로 새로운 책의 세계를 탐험하는 멋진 중학생입니다!',
        badgeEmoji: '⭐',
        weeklyFocusTips: [
          '1주차: 흥미진진한 베스트셀러 소설로 가볍게 시작하기',
          '2주차: 관심 장르의 깊이 있는 이야기 속으로 들어가기',
          '3주차: 새로운 분야나 교양서로 지식 채우기',
          '4주차: 나를 돌아보고 미래의 꿈을 찾는 감동 서적 읽기'
        ],
        customMessage: '이번 방학, 책과 함께 더욱 성장하는 멋진 시간을 만들어봐요!'
      }
    });
  }
});

// API 2: Weekly Personalized Book Recommendations
app.post('/api/weekly-recommendations', async (req, res) => {
  try {
    const { userProfile, targetWeek } = req.body;

    const prompt = `
당신은 중학생 전문 AI 도서 추천 시스템입니다.
아래 중학생의 프로필과 현재 방학 주차(${targetWeek}주차)에 가장 적합한 한국 실제 출판 중학생 추천 도서 3권을 제안해주세요.

[학생 프로필]
- 학년: ${userProfile?.grade || '중2'}
- 선호 장르: ${userProfile?.favoriteGenres?.join(', ') || '소설'}
- 독서 속도: ${userProfile?.readingSpeed || '보통'}
- 선호 스타일: ${userProfile?.readingPreference || '재미있는 이야기'}
- 독서 페르소나: ${userProfile?.bookPersonaTitle || '독서가'}

[주차별 가이드라인]
- 1주차: 방학 시작! 몰입감 높고 진입장벽이 낮은 대표 베스트셀러
- 2주차: 선호 장르의 매력을 깊이 경험할 수 있는 장르 대표작
- 3주차: 생각의 깊이를 넓혀주는 교양, 가치관, 미스터리, 인문과학
- 4주차: 개학 전 자신감을 북돋아주고 감동을 남기는 책

[출력 요구사항]
실제 존재하는 중학생 필독서 및 추천도서를 엄선하여 아래 JSON 형식으로 3권의 도서 정보를 전달하세요.
`;

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: '도서 제목' },
              author: { type: Type.STRING, description: '저자' },
              publisher: { type: Type.STRING, description: '출판사' },
              genre: { type: Type.STRING, description: '장르' },
              difficulty: { type: Type.STRING, description: '쉬움, 보통, 도전 중 하나' },
              pages: { type: Type.INTEGER, description: '페이지 수' },
              estimatedTime: { type: Type.STRING, description: '예상 읽기 시간 (예: 약 2.5시간)' },
              summary: { type: Type.STRING, description: '줄거리 및 특징 (2~3문장)' },
              recommendationReason: { type: Type.STRING, description: '이 학생에게 특별히 추천하는 이유 (친근한 말투)' },
              keyPoints: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '3가지 주요 매력 포인트'
              },
              coverEmoji: { type: Type.STRING, description: '어울리는 이모지 1개' }
            },
            required: ['title', 'author', 'publisher', 'genre', 'difficulty', 'pages', 'estimatedTime', 'summary', 'recommendationReason', 'keyPoints', 'coverEmoji']
          }
        }
      }
    });

    const books = JSON.parse(response.text || '[]');
    res.json({ success: true, books });
  } catch (error: any) {
    console.error('Error in /api/weekly-recommendations:', error);
    res.status(500).json({ success: false, message: '주간 추천 도서 생성 실패' });
  }
});

// API 3: AI Reading Friend Comment on 1-line Review
app.post('/api/ai-review-comment', async (req, res) => {
  try {
    const { bookTitle, author, rating, oneLiner, favoriteQuote, userNickname } = req.body;

    const prompt = `
당신은 중학생 독서 동아리의 친절하고 다정한 AI 독서 선배 "알피"입니다.
학생(${userNickname})이 막 완독 후 작성한 한 줄 서평을 읽고, 다정하고 친근한 말투(이모지 포함, 2~3문장)로 칭찬과 공감 댓글을 달아주세요.

[작성된 서평]
- 책 제목: ${bookTitle} (${author})
- 별점: ${rating} / 5
- 한 줄 서평: ${oneLiner}
${favoriteQuote ? `- 인상 깊은 구절: "${favoriteQuote}"` : ''}

[응답 가이드]
- "우와! ~학생", "~ 구절이 정말 인상적이었군요!" 와 같이 학생 이름을 부르며 친근하게 소통하세요.
- 비판보다는 칭찬, 공감, 격려를 적극적으로 표현해주세요.
- 중학생이 부담 없이 읽을 수 있도록 상냥하고 귀여운 말투를 사용하세요.
`;

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        temperature: 0.8,
      }
    });

    const comment = response.text?.trim() || '멋진 서평을 남겨줘서 고마워요! 다음 책도 알피와 함께 즐겁게 읽어봐요! ✨';
    res.json({ success: true, comment });
  } catch (error: any) {
    console.error('Error in /api/ai-review-comment:', error);
    res.json({
      success: true,
      comment: '✨ 멋진 한 줄 서평이에요! 방학 동안 정성스럽게 기록을 남기는 모습이 정말 훌륭합니다!'
    });
  }
});

// API 4: AI Compass Custom Query Recommendation
app.post('/api/ai-book-search', async (req, res) => {
  try {
    const { query, userProfile } = req.body;

    const prompt = `
당신은 중학생 독서 도우미 AI "알피"입니다.
학생이 다음과 같은 고민이나 상황에 맞는 책을 요청했습니다: "${query}".

[학생 정보]
- 학년: ${userProfile?.grade || '중학생'}
- 관심 장르: ${userProfile?.favoriteGenres?.join(', ') || '다양함'}

상황에 딱 맞는 중학생 도서 2권과 이유를 친절하게 추천해주세요.
`;

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            adviceMessage: { type: Type.STRING, description: '학생 요청에 대한 따뜻한 맞춤 답변' },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  author: { type: Type.STRING },
                  genre: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  coverEmoji: { type: Type.STRING }
                },
                required: ['title', 'author', 'genre', 'reason', 'coverEmoji']
              }
            }
          },
          required: ['adviceMessage', 'recommendations']
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    res.json({ success: true, data });
  } catch (error: any) {
    console.error('Error in /api/ai-book-search:', error);
    res.status(500).json({ success: false, message: '검색 중 오류 발생' });
  }
});

// Serve frontend assets or Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
