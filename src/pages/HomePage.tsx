import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';

export default function HomePage() {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <Header />

      {/* 메인 콘텐츠 */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        {user ? (
          // 로그인 상태
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {userRole === 'presenter' && (
              <Link
                to="/my-sessions"
                className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition transform hover:scale-105"
              >
                <div className="text-4xl mb-4">📊</div>
                <h2 className="text-2xl font-bold mb-2">발표자 대시보드</h2>
                <p className="text-gray-600">새로운 세션을 생성하고 질문을 관리하세요.</p>
              </Link>
            )}

            {userRole === 'participant' && (
              <Link
                to="/join"
                className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition transform hover:scale-105"
              >
                <div className="text-4xl mb-4">📝</div>
                <h2 className="text-2xl font-bold mb-2">세션 입장</h2>
                <p className="text-gray-600">세션 코드를 입력하여 질문에 참가하세요.</p>
              </Link>
            )}
          </div>
        ) : (
          // 비로그인 상태
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              실시간 Q&A 플랫폼
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              행사와 수업에서 실시간으로 질문하고 투표하세요.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              {/* 발표자 섹션 */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="text-5xl mb-4 text-center">🎯</div>
                <h2 className="text-2xl font-bold mb-4 text-center">발표자</h2>
                <p className="text-gray-600 text-center mb-6">
                  세션을 생성하고 참가자의 질문을 관리하세요.
                </p>
                <div className="space-y-3">
                  <Link
                    to="/login"
                    className="block w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 text-center transition"
                  >
                    로그인
                  </Link>
                  <Link
                    to="/signup"
                    className="block w-full bg-blue-100 text-blue-700 py-3 rounded-lg font-medium hover:bg-blue-200 text-center transition"
                  >
                    회원가입
                  </Link>
                </div>
              </div>

              {/* 참가자 섹션 */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="text-5xl mb-4 text-center">💬</div>
                <h2 className="text-2xl font-bold mb-4 text-center">참가자</h2>
                <p className="text-gray-600 text-center mb-6">
                  세션 코드로 입장하여 질문하고 투표하세요.
                </p>
                <Link
                  to="/join"
                  className="block w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 text-center transition"
                >
                  세션 입장
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* 기능 소개 */}
        {!user && (
          <div className="mt-20 pt-12 border-t">
            <h2 className="text-3xl font-bold text-center mb-12">주요 기능</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-3">🔐</div>
                <h3 className="text-lg font-semibold mb-2">실시간 동기화</h3>
                <p className="text-gray-600">
                  모든 참가자에게 즉시 반영되는 실시간 Q&A
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">👍</div>
                <h3 className="text-lg font-semibold mb-2">투표 시스템</h3>
                <p className="text-gray-600">
                  좋아요로 중요한 질문을 우선 처리
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">📱</div>
                <h3 className="text-lg font-semibold mb-2">모바일 지원</h3>
                <p className="text-gray-600">
                  모든 기기에서 원활하게 작동합니다
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 푸터 */}
      <footer className="bg-gray-800 text-gray-300 mt-20 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>&copy; 2024 Q&A Live. 모든 권리 보유.</p>
        </div>
      </footer>
    </div>
  );
}

