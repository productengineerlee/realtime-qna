import { useState, useEffect, useCallback } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import type { Tables } from '@/lib/database.types';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

type Question = Tables<'questions'>;

export type SortOption = 'latest' | 'popular';
export type FilterStatus = 'all' | 'normal' | 'pinned' | 'answered' | 'hidden';

export function useQuestions(sessionId: string) {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  // 질문 정렬 및 필터링
  const getSortedAndFilteredQuestions = useCallback(
    (items: Question[]) => {
      let result = [...items];

      // 필터링
      if (filterStatus !== 'all') {
        result = result.filter((q) => q.status === filterStatus);
      }

      // 정렬
      if (sortBy === 'popular') {
        result.sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0));
      } else {
        result.sort(
          (a, b) =>
            new Date(b.created_at || 0).getTime() -
            new Date(a.created_at || 0).getTime()
        );
      }

      return result;
    },
    [sortBy, filterStatus]
  );

  // 초기 로드 및 실시간 구독 설정
  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // 초기 질문 로드
    const fetchQuestions = async () => {
      try {
        const { data, error: dbError } = await supabase
          .from('questions')
          .select('*')
          .eq('session_id', sessionId)
          .order('created_at', { ascending: false });

        if (dbError) throw dbError;
        setQuestions(data || []);
        setLoading(false);
      } catch (err) {
        const message = err instanceof Error ? err.message : '질문 조회 실패';
        setError(message);
        setLoading(false);
      }
    };

    fetchQuestions();

    // Realtime 구독 설정
    let channel: RealtimeChannel | null = null;

    const setupSubscription = () => {
      channel = supabase
        .channel(`questions:session_id=eq.${sessionId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'questions',
            filter: `session_id=eq.${sessionId}`,
          },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              setQuestions((prev) => [payload.new as Question, ...prev]);
            } else if (payload.eventType === 'UPDATE') {
              setQuestions((prev) =>
                prev.map((q) => (q.id === payload.new.id ? (payload.new as Question) : q))
              );
            } else if (payload.eventType === 'DELETE') {
              setQuestions((prev) =>
                prev.filter((q) => q.id !== payload.old.id)
              );
            }
          }
        )
        .subscribe();
    };

    setupSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [sessionId]);

  // 질문 작성
  const addQuestion = async (content: string): Promise<Question | null> => {
    if (!user || !sessionId) {
      setError('사용자가 인증되지 않았습니다.');
      return null;
    }

    if (!content.trim()) {
      setError('질문 내용을 입력해주세요.');
      return null;
    }

    try {
      const { error: dbError } = await supabase.from('questions').insert({
        session_id: sessionId,
        participant_id: user.id,
        content: content.trim(),
        status: 'normal',
        likes_count: 0,
      });

      if (dbError) throw dbError;

      // Realtime이 자동으로 업데이트하므로 여기서는 null 반환
      return null;
    } catch (err) {
      const message = err instanceof Error ? err.message : '질문 작성 실패';
      setError(message);
      return null;
    }
  };

  // 질문 삭제
  const deleteQuestion = async (questionId: string): Promise<boolean> => {
    if (!user) {
      setError('사용자가 인증되지 않았습니다.');
      return false;
    }

    try {
      const { error: dbError } = await supabase
        .from('questions')
        .delete()
        .eq('id', questionId)
        .eq('participant_id', user.id);

      if (dbError) throw dbError;
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : '질문 삭제 실패';
      setError(message);
      return false;
    }
  };

  // 질문 수정
  const updateQuestion = async (
    questionId: string,
    content: string
  ): Promise<boolean> => {
    if (!user) {
      setError('사용자가 인증되지 않았습니다.');
      return false;
    }

    if (!content.trim()) {
      setError('질문 내용을 입력해주세요.');
      return false;
    }

    try {
      const { error: dbError } = await supabase
        .from('questions')
        .update({
          content: content.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', questionId)
        .eq('participant_id', user.id);

      if (dbError) throw dbError;
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : '질문 수정 실패';
      setError(message);
      return false;
    }
  };

  // 정렬된 및 필터링된 질문 반환
  const displayedQuestions = getSortedAndFilteredQuestions(questions);

  return {
    questions: displayedQuestions,
    allQuestions: questions,
    loading,
    error,
    addQuestion,
    deleteQuestion,
    updateQuestion,
    sortBy,
    setSortBy,
    filterStatus,
    setFilterStatus,
  };
}

