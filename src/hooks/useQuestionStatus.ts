import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export type QuestionStatus = 'normal' | 'hidden' | 'pinned' | 'answered';

export function useQuestionStatus(sessionId: string) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 세션 소유자 확인
  const checkSessionOwnership = async (): Promise<boolean> => {
    if (!user || !sessionId) return false;

    try {
      const { data, error: dbError } = await supabase
        .from('sessions')
        .select('presenter_id')
        .eq('id', sessionId)
        .single();

      if (dbError) throw dbError;
      return data.presenter_id === user.id;
    } catch (err) {
      return false;
    }
  };

  // 질문 상태 업데이트 함수
  const updateQuestionStatus = async (
    questionId: string,
    status: QuestionStatus
  ): Promise<boolean> => {
    if (!user || !sessionId) {
      setError('사용자가 인증되지 않았거나 세션 정보가 없습니다.');
      return false;
    }

    // 세션 소유자 확인
    const isOwner = await checkSessionOwnership();
    if (!isOwner) {
      setError('이 세션을 관리할 권한이 없습니다.');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // 고정 상태로 변경 시 기존 고정된 질문 해제
      if (status === 'pinned') {
        await supabase
          .from('questions')
          .update({ status: 'normal', updated_at: new Date().toISOString() })
          .eq('session_id', sessionId)
          .eq('status', 'pinned');
      }

      // 질문 상태 업데이트
      const { error: dbError } = await supabase
        .from('questions')
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', questionId);

      if (dbError) throw dbError;
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : '상태 업데이트 실패';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 질문 숨기기
  const hideQuestion = async (questionId: string): Promise<boolean> => {
    return updateQuestionStatus(questionId, 'hidden');
  };

  // 질문 고정하기
  const pinQuestion = async (questionId: string): Promise<boolean> => {
    return updateQuestionStatus(questionId, 'pinned');
  };

  // 질문 답변완료 표시
  const markAsAnswered = async (questionId: string): Promise<boolean> => {
    return updateQuestionStatus(questionId, 'answered');
  };

  // 질문 상태 초기화
  const resetQuestionStatus = async (questionId: string): Promise<boolean> => {
    return updateQuestionStatus(questionId, 'normal');
  };

  return {
    hideQuestion,
    pinQuestion,
    markAsAnswered,
    resetQuestionStatus,
    loading,
    error,
  };
}

