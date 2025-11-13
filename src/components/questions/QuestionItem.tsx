import { useState } from 'react';
import type { Tables } from '@/lib/database.types';
import { useAuth } from '@/contexts/AuthContext';
import LikeButton from './LikeButton';
import QuestionStatusControls from './QuestionStatusControls';
import type { QuestionStatus } from '@/hooks/useQuestionStatus';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Edit2, Trash2 } from 'lucide-react';

type Question = Tables<'questions'>;

interface QuestionItemProps {
  question: Question;
  sessionId?: string;
  onDelete?: (questionId: string) => Promise<void>;
  onUpdate?: (questionId: string, content: string) => Promise<void>;
  onToggleLike?: (questionId: string) => Promise<boolean>;
  onStatusChange?: (questionId: string, status: QuestionStatus) => Promise<boolean>;
  isLiked?: boolean;
  isPresenter?: boolean;
  isEditing?: boolean;
}

function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return '';

  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return '방금 전';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}분 전`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}시간 전`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}일 전`;

  return date.toLocaleDateString('ko-KR');
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'pinned':
      return '📌 고정';
    case 'answered':
      return '✅ 답변완료';
    case 'hidden':
      return '🔒 숨김';
    default:
      return '질문';
  }
}

export default function QuestionItem({
  question,
  sessionId,
  onDelete,
  onUpdate,
  onToggleLike,
  onStatusChange,
  isLiked = false,
  isPresenter = false,
  isEditing: initialEditing = false,
}: QuestionItemProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(initialEditing);
  const [editContent, setEditContent] = useState(question.content);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOwner = user?.id === question.participant_id;

  const handleEdit = async () => {
    if (!editContent.trim()) {
      setError('질문 내용을 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      if (onUpdate) {
        await onUpdate(question.id, editContent);
      }
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : '수정 실패');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('질문을 삭제하시겠습니까?')) return;

    setLoading(true);
    try {
      if (onDelete) {
        await onDelete(question.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '삭제 실패');
    } finally {
      setLoading(false);
    }
  };

  if (isEditing) {
    return (
      <Card className="mb-4 border-l-4 border-blue-500">
        <CardContent className="pt-6 space-y-3">
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            maxLength={500}
            rows={3}
          />
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="flex gap-2">
            <Button
              onClick={handleEdit}
              disabled={loading}
              size="sm"
            >
              {loading ? '저장 중...' : '저장'}
            </Button>
            <Button
              onClick={() => {
                setIsEditing(false);
                setEditContent(question.content);
                setError(null);
              }}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              취소
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4 border-l-4 border-blue-500 hover:shadow-md transition">
      <CardContent className="pt-6 space-y-3">
        {/* 헤더 */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary">
              {getStatusLabel(question.status)}
            </Badge>
            <span className="text-xs text-gray-500">
              {formatRelativeTime(question.created_at)}
            </span>
          </div>

          {isOwner && (
            <div className="flex gap-2">
              <Button
                onClick={() => setIsEditing(true)}
                disabled={loading}
                variant="ghost"
                size="sm"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleDelete}
                disabled={loading}
                variant="ghost"
                size="sm"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          )}
        </div>

        {/* 질문 내용 */}
        <p className="text-gray-800 whitespace-pre-wrap break-words">
          {question.content}
        </p>

        {/* 발표자 컨트롤 */}
        {isPresenter && sessionId && onStatusChange && (
          <QuestionStatusControls
            question={question}
            sessionId={sessionId}
            onStatusChange={onStatusChange}
            isPresenter={isPresenter}
            loading={loading}
          />
        )}

        {/* 좋아요 버튼 */}
        {onToggleLike ? (
          <LikeButton
            questionId={question.id}
            isLiked={isLiked}
            likesCount={question.likes_count || 0}
            onToggle={onToggleLike}
          />
        ) : (
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-xl">👍</span>
            <span className="text-sm font-medium">{question.likes_count || 0}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

