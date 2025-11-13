import { useState, useEffect, useCallback } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export function useLikes() {
  const { user } = useAuth();
  const [likedQuestions, setLikedQuestions] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 사용자가 좋아요한 질문 목록 가져오기 및 실시간 구독
  useEffect(() => {
    if (!user) {
      setLikedQuestions({});
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // 초기 좋아요 데이터 로드
    const fetchLikedQuestions = async () => {
      try {
        const { data, error: dbError } = await supabase
          .from('likes')
          .select('question_id')
          .eq('participant_id', user.id);

        if (dbError) throw dbError;

        const likedMap: Record<string, boolean> = {};
        data?.forEach((like) => {
          likedMap[like.question_id] = true;
        });

        setLikedQuestions(likedMap);
        setLoading(false);
      } catch (err) {
        const message = err instanceof Error ? err.message : '좋아요 데이터 로드 실패';
        setError(message);
        setLoading(false);
      }
    };

    fetchLikedQuestions();

    // Realtime 구독 설정
    let channel: RealtimeChannel | null = null;

    const setupSubscription = () => {
      channel = supabase
        .channel(`likes:participant_id=eq.${user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'likes',
            filter: `participant_id=eq.${user.id}`,
          },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              setLikedQuestions((prev) => ({
                ...prev,
                [payload.new.question_id]: true,
              }));
            } else if (payload.eventType === 'DELETE') {
              setLikedQuestions((prev) => {
                const updated = { ...prev };
                delete updated[payload.old.question_id];
                return updated;
              });
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
  }, [user]);

  // 좋아요 토글 함수
  const toggleLike = useCallback(
    async (questionId: string): Promise<boolean> => {
      if (!user) {
        setError('사용자가 인증되지 않았습니다.');
        return false;
      }

      try {
        if (likedQuestions[questionId]) {
          // 좋아요 취소
          const { error: dbError } = await supabase
            .from('likes')
            .delete()
            .eq('question_id', questionId)
            .eq('participant_id', user.id);

          if (dbError) throw dbError;
        } else {
          // 좋아요 추가
          const { error: dbError } = await supabase.from('likes').insert({
            question_id: questionId,
            participant_id: user.id,
          });

          if (dbError) throw dbError;
        }

        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : '좋아요 토글 실패';
        setError(message);
        return false;
      }
    },
    [user, likedQuestions]
  );

  // 특정 질문의 좋아요 상태 확인
  const isLiked = useCallback(
    (questionId: string): boolean => {
      return !!likedQuestions[questionId];
    },
    [likedQuestions]
  );

  return {
    likedQuestions,
    loading,
    error,
    toggleLike,
    isLiked,
  };
}

