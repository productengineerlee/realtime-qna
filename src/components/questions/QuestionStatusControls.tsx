import { useState } from 'react';
import type { Tables } from '@/lib/database.types';
import { useAuth } from '@/contexts/AuthContext';
import type { QuestionStatus } from '@/hooks/useQuestionStatus';

type Question = Tables<'questions'>;

interface QuestionStatusControlsProps {
  question: Question;
  sessionId: string;
  onStatusChange: (questionId: string, status: QuestionStatus) => Promise<boolean>;
  isPresenter?: boolean;
  loading?: boolean;
}

export default function QuestionStatusControls({
  question,
  sessionId,
  onStatusChange,
  isPresenter = false,
  loading = false,
}: QuestionStatusControlsProps) {
  const { user } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 세션 소유자 확인 (발표자만 상태 변경 가능)
  const canControl = isPresenter && user && sessionId;

  const handleStatusChange = async (newStatus: QuestionStatus) => {
    if (!canControl || updating) return;

    setUpdating(true);
    setError(null);

    try {
      const success = await onStatusChange(question.id, newStatus);
      if (!success) {
        setError('상태 변경 실패');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류 발생');
    } finally {
      setUpdating(false);
    }
  };

  if (!canControl) {
    return null;
  }

  const getButtonColor = (status: QuestionStatus): string => {
    if (question.status === status) {
      switch (status) {
        case 'pinned':
          return 'bg-amber-500 text-white';
        case 'answered':
          return 'bg-green-500 text-white';
        case 'hidden':
          return 'bg-gray-500 text-white';
        default:
          return 'bg-blue-500 text-white';
      }
    }
    return 'bg-gray-200 text-gray-700 hover:bg-gray-300';
  };

  const getButtonLabel = (status: QuestionStatus): string => {
    switch (status) {
      case 'pinned':
        return '📌 고정';
      case 'answered':
        return '✅ 답변완료';
      case 'hidden':
        return '🔒 숨김';
      default:
        return '일반';
    }
  };

  return (
    <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="text-xs font-semibold text-gray-600 w-full mb-1">
        발표자 컨트롤:
      </div>

      {error && <div className="text-xs text-red-600 w-full">{error}</div>}

      <button
        onClick={() => handleStatusChange('pinned')}
        disabled={updating || loading}
        className={`px-2 py-1 text-xs rounded transition ${getButtonColor('pinned')} disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {getButtonLabel('pinned')}
      </button>

      <button
        onClick={() => handleStatusChange('answered')}
        disabled={updating || loading}
        className={`px-2 py-1 text-xs rounded transition ${getButtonColor('answered')} disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {getButtonLabel('answered')}
      </button>

      <button
        onClick={() => handleStatusChange('hidden')}
        disabled={updating || loading}
        className={`px-2 py-1 text-xs rounded transition ${getButtonColor('hidden')} disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {getButtonLabel('hidden')}
      </button>

      {question.status !== 'normal' && (
        <button
          onClick={() => handleStatusChange('normal')}
          disabled={updating || loading}
          className={`px-2 py-1 text-xs rounded transition ${getButtonColor('normal')} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          초기화
        </button>
      )}
    </div>
  );
}

