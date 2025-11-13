import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';

export default function CreateSession() {
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [sessionCode, setSessionCode] = useState('');
  const { createSession, loading } = useSession();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('세션 제목을 입력해주세요.');
      return;
    }

    const newSession = await createSession(title);
    if (newSession) {
      setSessionCode(newSession.session_code);
      setSuccess(true);
      setTimeout(() => {
        navigate(`/presenter/session/${newSession.id}`);
      }, 2000);
    } else {
      setError('세션 생성 실패');
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold mb-2">세션이 생성되었습니다!</h2>
          <p className="text-gray-600 mb-4">세션 코드:</p>
          <div className="bg-gray-100 p-4 rounded-lg mb-6 font-mono text-2xl font-bold">
            {sessionCode}
          </div>
          <p className="text-sm text-gray-600 mb-2">참가자들에게 이 코드를 공유하세요.</p>
          <p className="text-sm text-gray-500">곧 대시보드로 이동합니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full mx-4 bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-2 text-center">새로운 세션 생성</h1>
        <p className="text-gray-600 text-center mb-6">
          행사 또는 수업의 제목을 입력하세요.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">세션 제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: React 입문 강의"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-400 transition"
          >
            {loading ? '생성 중...' : '세션 생성'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t text-center">
          <p className="text-sm text-gray-600">
            <a href="/presenter-dashboard" className="text-blue-500 hover:underline">
              대시보드로 돌아가기
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

