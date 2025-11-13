import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, InfoIcon } from 'lucide-react';

interface QuestionFormProps {
  onSubmit: (content: string) => Promise<void>;
  isLoading?: boolean;
}

export default function QuestionForm({
  onSubmit,
  isLoading = false,
}: QuestionFormProps) {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, userRole } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!content.trim()) {
      setError('질문을 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(content);
      setContent('');
    } catch (err) {
      setError(err instanceof Error ? err.message : '질문 등록 실패');
    } finally {
      setLoading(false);
    }
  };

  if (!user || userRole !== 'participant') {
    return (
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          질문을 작성하려면 세션에 참가해주세요.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>질문 작성</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="질문을 입력하세요..."
              maxLength={500}
              disabled={loading || isLoading}
              rows={3}
            />
            <div className="text-right text-sm text-gray-500">
              {content.length}/500
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={loading || isLoading || !content.trim()}
            className="w-full"
          >
            {loading || isLoading ? '등록 중...' : '질문 등록'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

