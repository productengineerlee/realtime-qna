import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ParticipantEntry() {
  const [sessionCode, setSessionCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signInAnonymously } = useAuth();
  const navigate = useNavigate();

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!sessionCode.trim()) {
        throw new Error('세션 코드를 입력해주세요.');
      }

      // 익명 로그인
      await signInAnonymously();

      // 세션 코드로 이동
      navigate(`/session/${sessionCode.toUpperCase()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '입장 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-2 text-center">Q&A 세션 참가</h2>
      <p className="text-gray-600 text-center mb-6">세션 코드를 입력하여 질문에 참가하세요.</p>

      <form onSubmit={handleJoin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">세션 코드</label>
          <input
            type="text"
            value={sessionCode}
            onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
            placeholder="예: ABC123"
            maxLength={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg tracking-widest"
          />
        </div>

        {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white py-2 rounded-lg font-medium hover:bg-green-600 disabled:bg-gray-400 transition"
        >
          {loading ? '입장 중...' : '입장'}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t">
        <p className="text-center text-sm text-gray-600">
          세션을 호스트하시나요?{' '}
          <a href="/login" className="text-blue-500 hover:underline font-medium">
            로그인
          </a>
        </p>
      </div>
    </div>
  );
}

