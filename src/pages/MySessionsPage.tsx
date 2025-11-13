import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import type { Tables } from '@/lib/database.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Inbox } from 'lucide-react';

type Session = Tables<'sessions'>;

export default function MySessionsPage() {
  const navigate = useNavigate();
  const { getUserSessions, loading, error } = useSession();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  useEffect(() => {
    const loadSessions = async () => {
      setSessionsLoading(true);
      const data = await getUserSessions();
      setSessions(data);
      setSessionsLoading(false);
    };

    loadSessions();
  }, []);

  const handleCreateSession = () => {
    navigate('/create-session');
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">내 세션</h1>
            <p className="text-gray-600 mt-1">생성한 모든 세션을 관리하세요</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            ← 돌아가기
          </button>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 생성 버튼 */}
        <div className="mb-8">
          <Button onClick={handleCreateSession} size="lg">
            <Plus className="w-4 h-4 mr-2" />
            새 세션 생성
          </Button>
        </div>

        {/* 에러 */}
        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* 로딩 */}
        {sessionsLoading || loading ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">로딩 중...</div>
          </div>
        ) : sessions.length === 0 ? (
          /* 빈 상태 */
          <Card className="text-center">
            <CardContent className="pt-12 space-y-6">
              <div>
                <Inbox className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  세션이 없습니다
                </h3>
                <p className="text-gray-600">
                  첫 번째 세션을 생성하여 시작해보세요.
                </p>
              </div>
              <Button onClick={handleCreateSession} size="lg">
                <Plus className="w-4 h-4 mr-2" />
                세션 생성
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* 세션 목록 */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <Card
                key={session.id}
                className="hover:shadow-lg transition transform hover:scale-105 cursor-pointer"
              >
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 break-words mb-2">
                      {session.title}
                    </h3>
                    <Badge variant={session.status === 'active' ? 'default' : 'secondary'}>
                      {session.status === 'active' ? '🟢 활성' : '🔴 종료됨'}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-gray-600 font-medium">세션 코드</p>
                      <p className="font-mono font-bold text-lg bg-gray-100 p-2 rounded">
                        {session.session_code}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-600 font-medium">생성됨</p>
                      <p>{formatDate(session.created_at)}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => navigate(`/presenter/session/${session.id}`)}
                    className="w-full"
                  >
                    대시보드로 이동 →
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

