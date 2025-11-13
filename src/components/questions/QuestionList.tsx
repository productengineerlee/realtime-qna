import type { Tables } from '@/lib/database.types';
import QuestionItem from './QuestionItem';
import type { SortOption, FilterStatus } from '@/hooks/useQuestions';
import type { QuestionStatus } from '@/hooks/useQuestionStatus';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

type Question = Tables<'questions'>;

interface QuestionListProps {
  questions: Question[];
  loading?: boolean;
  error?: string | null;
  sortBy?: SortOption;
  onSortChange?: (sort: SortOption) => void;
  filterStatus?: FilterStatus;
  onFilterChange?: (status: FilterStatus) => void;
  onDelete?: (questionId: string) => Promise<void>;
  onUpdate?: (questionId: string, content: string) => Promise<void>;
  onToggleLike?: (questionId: string) => Promise<boolean>;
  likedQuestions?: Record<string, boolean>;
  sessionId?: string;
  onStatusChange?: (questionId: string, status: QuestionStatus) => Promise<boolean>;
  isPresenter?: boolean;
}

export default function QuestionList({
  questions,
  loading = false,
  error = null,
  sortBy = 'latest',
  onSortChange,
  filterStatus = 'all',
  onFilterChange,
  onDelete,
  onUpdate,
  onToggleLike,
  likedQuestions = {},
  sessionId,
  onStatusChange,
  isPresenter = false,
}: QuestionListProps) {
  return (
    <div>
      {/* 상단 컨트롤 */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {onSortChange && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">정렬:</label>
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">최신순</SelectItem>
                <SelectItem value="popular">인기순</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {onFilterChange && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">필터:</label>
            <Select value={filterStatus} onValueChange={onFilterChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 질문</SelectItem>
                <SelectItem value="normal">일반</SelectItem>
                <SelectItem value="pinned">고정</SelectItem>
                <SelectItem value="answered">답변완료</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* 로딩 상태 */}
      {loading && (
        <div className="text-center py-12">
          <div className="text-gray-500">로딩 중...</div>
        </div>
      )}

      {/* 에러 상태 */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* 질문 목록 */}
      {!loading && !error && questions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            아직 질문이 없습니다
          </h3>
          <p className="text-gray-600">
            첫 번째 질문을 작성해보세요!
          </p>
        </div>
      )}

      {!loading && !error && questions.length > 0 && (
        <div>
          <div className="mb-4 text-sm text-gray-600">
            총 {questions.length}개의 질문
          </div>
          <div>
            {questions.map((question) => (
              <QuestionItem
                key={question.id}
                question={question}
                sessionId={sessionId}
                onDelete={onDelete}
                onUpdate={onUpdate}
                onToggleLike={onToggleLike}
                onStatusChange={onStatusChange}
                isLiked={likedQuestions[question.id] || false}
                isPresenter={isPresenter}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

