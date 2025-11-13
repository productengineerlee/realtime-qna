import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { useQuestions } from '@/hooks/useQuestions';
import { useLikes } from '@/hooks/useLikes';
import QuestionForm from '@/components/questions/QuestionForm';
import QuestionList from '@/components/questions/QuestionList';
import type { Tables } from '@/lib/database.types';
import { supabase } from '@/lib/supabase';
import Header from '@/components/layout/Header';

type Session = Tables<'sessions'>;

export default function ParticipantSession() {
  const { sessionCode } = useParams<{ sessionCode: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [sessionLoading, setSessionLoading] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);

  const { joinSession } = useSession();
  const {
    questions,
    loading: questionsLoading,
    error: questionsError,
    addQuestion,
    deleteQuestion,
    updateQuestion,
    sortBy,
    setSortBy,
    filterStatus,
    setFilterStatus,
  } = useQuestions(sessionId);

  const {
    likedQuestions,
    toggleLike,
  } = useLikes();

  // 세션 조회
  useEffect(() => {
    if (!sessionCode) return;

    const loadSession = async () => {
      setSessionLoading(true);
      try {
        const sessionData = await joinSession(sessionCode.toUpperCase());
        if (!sessionData) {
          setSessionError('세션을 찾을 수 없습니다. 코드를 확인하세요.');
          setTimeout(() => navigate('/'), 3000);
          return;
        }
        setSession(sessionData);
        setSessionId(sessionData.id);
      } catch (err) {
        const message = err instanceof Error ? err.message : '세션 로드 실패';
        setSessionError(message);
        setTimeout(() => navigate('/'), 3000);
      } finally {
        setSessionLoading(false);
      }
    };

    loadSession();

    // 세션 상태 모니터링
    const channel = supabase
      .channel(`session:${sessionCode}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'sessions',
          filter: `session_code=eq.${sessionCode}`,
        },
        (payload) => {
          if (payload.new.status === 'closed') {
            setSessionError('세션이 종료되었습니다.');
            setTimeout(() => navigate('/'), 3000);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionCode, navigate, joinSession]);

  const handleAddQuestion = async (content: string) => {
    await addQuestion(content);
  };

  if (sessionLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-2xl mb-4">로딩 중...</div>
          <div className="text-gray-600">세션을 준비하고 있습니다.</div>
        </div>
      </div>
    );
  }

  if (sessionError || !session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-red-50 p-8 rounded-lg">
          <div className="text-2xl mb-4">⚠️</div>
          <div className="text-xl font-semibold mb-2 text-red-600">{sessionError}</div>
          <div className="text-sm text-gray-600">
            홈으로 돌아갑니다...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <Header />

      {/* 메인 콘텐츠 */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 질문 작성 폼 */}
        <div className="mb-8">
          <QuestionForm onSubmit={handleAddQuestion} isLoading={questionsLoading} />
        </div>

        {/* 질문 목록 */}
        <QuestionList
          questions={questions}
          loading={questionsLoading}
          error={questionsError}
          sortBy={sortBy}
          onSortChange={setSortBy}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
          onDelete={async (id) => {
            await deleteQuestion(id);
          }}
          onUpdate={async (id, content) => {
            await updateQuestion(id, content);
          }}
          onToggleLike={toggleLike}
          likedQuestions={likedQuestions}
        />
      </main>
    </div>
  );
}

