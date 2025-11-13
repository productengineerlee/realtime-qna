import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useQuestions } from '@/hooks/useQuestions';
import { useQuestionStatus } from '@/hooks/useQuestionStatus';
import type { Tables } from '@/lib/database.types';
import SessionInfo from '@/components/sessions/SessionInfo';
import QRCodeDisplay from '@/components/sessions/QRCodeDisplay';
import QuestionList from '@/components/questions/QuestionList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, LogOut } from 'lucide-react';
import Header from '@/components/layout/Header';

type Session = Tables<'sessions'>;

export default function PresenterDashboard() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [endLoading, setEndLoading] = useState(false);

  const {
    questions,
    loading: questionsLoading,
    error: questionsError,
    sortBy,
    setSortBy,
    filterStatus,
    setFilterStatus,
  } = useQuestions(sessionId || '');

  const {
    hideQuestion,
    pinQuestion,
    markAsAnswered,
    resetQuestionStatus,
  } = useQuestionStatus(sessionId || '');

  // 세션 정보 로드
  useEffect(() => {
    if (!sessionId || !user) {
      setError('세션 정보를 로드할 수 없습니다.');
      setLoading(false);
      return;
    }

    const loadSession = async () => {
      setLoading(true);
      try {
        const { data, error: dbError } = await supabase
          .from('sessions')
          .select('*')
          .eq('id', sessionId)
          .eq('presenter_id', user.id)
          .single();

        if (dbError) throw new Error('세션을 찾을 수 없습니다.');
        setSession(data);
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : '세션 로드 실패';
        setError(message);
        setTimeout(() => navigate('/presenter-dashboard'), 3000);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, [sessionId, user, navigate]);

  // 세션 종료
  const handleEndSession = async () => {
    if (!session || !confirm('정말 세션을 종료하시겠습니까?')) return;

    setEndLoading(true);
    try {
      const { error: dbError } = await supabase
        .from('sessions')
        .update({
          status: 'closed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.id);

      if (dbError) throw dbError;
      setSession({ ...session, status: 'closed' });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '세션 종료 실패');
    } finally {
      setEndLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-2xl mb-4">로딩 중...</div>
          <div className="text-gray-600">세션을 준비하고 있습니다.</div>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-red-50 p-8 rounded-lg">
          <div className="text-2xl mb-4">⚠️</div>
          <div className="text-xl font-semibold mb-2 text-red-600">{error}</div>
          <div className="text-sm text-gray-600">홈으로 돌아갑니다...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <Header />

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 좌측 패널 - 세션 정보 및 관리 */}
          <div className="lg:col-span-1">
            {/* 세션 정보 */}
            <SessionInfo session={session} />

            {/* QR 코드 */}
            <QRCodeDisplay sessionCode={session.session_code} />

            {/* 세션 관리 버튼 */}
            <Card>
              <CardHeader>
                <CardTitle>세션 관리</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleEndSession}
                  disabled={session.status === 'closed' || endLoading}
                  variant={session.status === 'closed' ? 'outline' : 'destructive'}
                  className="w-full"
                  size="lg"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {endLoading
                    ? '종료 중...'
                    : session.status === 'active'
                      ? '세션 종료'
                      : '✓ 종료됨'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 우측 패널 - 질문 관리 */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">질문 관리</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {questionsError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{questionsError}</AlertDescription>
                  </Alert>
                )}

                <QuestionList
                  questions={questions}
                  loading={questionsLoading}
                  error={questionsError}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  filterStatus={filterStatus}
                  onFilterChange={setFilterStatus}
                  sessionId={sessionId}
                  onStatusChange={async (questionId, status) => {
                    switch (status) {
                      case 'pinned':
                        return await pinQuestion(questionId);
                      case 'hidden':
                        return await hideQuestion(questionId);
                      case 'answered':
                        return await markAsAnswered(questionId);
                      case 'normal':
                        return await resetQuestionStatus(questionId);
                      default:
                        return false;
                    }
                  }}
                  isPresenter={true}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

