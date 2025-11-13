import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface LikeButtonProps {
  questionId: string;
  isLiked: boolean;
  likesCount: number;
  onToggle: (questionId: string) => Promise<boolean>;
  disabled?: boolean;
}

export default function LikeButton({
  questionId,
  isLiked,
  likesCount,
  onToggle,
  disabled = false,
}: LikeButtonProps) {
  const [loading, setLoading] = useState(false);
  const { user, userRole } = useAuth();

  const handleClick = async () => {
    if (!user || userRole !== 'participant' || disabled || loading) return;

    setLoading(true);
    try {
      await onToggle(questionId);
    } finally {
      setLoading(false);
    }
  };

  if (!user || userRole !== 'participant') {
    return (
      <div className="flex items-center gap-2 text-gray-400">
        <span className="text-xl">👍</span>
        <span className="text-sm font-medium">{likesCount}</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={`flex items-center gap-2 px-3 py-1 rounded-lg transition ${
        isLiked
          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <span className={`text-lg transition ${loading ? 'animate-bounce' : ''}`}>
        👍
      </span>
      <span className="text-sm font-medium">{likesCount}</span>
    </button>
  );
}

