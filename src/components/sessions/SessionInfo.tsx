import type { Tables } from '@/lib/database.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

type Session = Tables<'sessions'>;

interface SessionInfoProps {
  session: Session;
}

function formatDate(dateString: string | null): string {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function SessionInfo({ session }: SessionInfoProps) {
  const isActive = session.status === 'active';
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(session.session_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-2xl">{session.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 상태 */}
        <div>
          <p className="text-sm text-gray-600 mb-2">세션 상태</p>
          <Badge variant={isActive ? 'default' : 'secondary'}>
            {isActive ? '🟢 활성' : '🔴 종료됨'}
          </Badge>
        </div>

        {/* 세션 코드 */}
        <div>
          <p className="text-sm text-gray-600 mb-2">세션 코드</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-100 p-3 rounded-lg font-mono text-lg font-bold text-center">
              {session.session_code}
            </div>
            <Button
              onClick={handleCopyCode}
              variant="outline"
              size="icon"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {copied ? '✅ 복사됨!' : '참가자들에게 이 코드를 공유하세요'}
          </p>
        </div>

        {/* 생성 시간 */}
        <div>
          <p className="text-sm text-gray-600 mb-1">생성 시간</p>
          <p className="text-sm">{formatDate(session.created_at)}</p>
        </div>

        {/* 마지막 업데이트 */}
        <div>
          <p className="text-sm text-gray-600 mb-1">마지막 업데이트</p>
          <p className="text-sm">{formatDate(session.updated_at)}</p>
        </div>

        {/* 세션 ID */}
        <div>
          <p className="text-sm text-gray-600 mb-1">세션 ID</p>
          <p className="text-xs font-mono text-gray-500 break-all">{session.id}</p>
        </div>
      </CardContent>
    </Card>
  );
}

