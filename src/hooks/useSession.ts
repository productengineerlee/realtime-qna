import { useState } from 'react';
import type { Tables } from '@/lib/database.types';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

type Session = Tables<'sessions'>;

export function useSession() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 세션 생성 함수
  const createSession = async (title: string): Promise<Session | null> => {
    if (!user) {
      setError('사용자가 인증되지 않았습니다.');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // 랜덤 세션 코드 생성 (6자리)
      const sessionCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      const { error: dbError } = await supabase.from('sessions').insert({
        presenter_id: user.id,
        session_code: sessionCode,
        title,
        status: 'active',
      });

      if (dbError) throw dbError;

      // 생성된 데이터 반환을 위해 다시 조회
      const { data: sessionData, error: fetchError } = await supabase
        .from('sessions')
        .select('*')
        .eq('session_code', sessionCode)
        .single();

      if (fetchError) throw fetchError;
      return sessionData;
    } catch (err) {
      const message = err instanceof Error ? err.message : '세션 생성 실패';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 세션 참가 함수
  const joinSession = async (sessionCode: string): Promise<Session | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: dbError } = await supabase
        .from('sessions')
        .select('*')
        .eq('session_code', sessionCode.toUpperCase())
        .eq('status', 'active')
        .single();

      if (dbError) throw new Error('세션을 찾을 수 없습니다.');
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : '세션 참가 실패';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 세션 상태 변경 함수
  const updateSessionStatus = async (
    sessionId: string,
    status: 'active' | 'closed'
  ): Promise<boolean> => {
    if (!user) {
      setError('사용자가 인증되지 않았습니다.');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: dbError } = await supabase
        .from('sessions')
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', sessionId)
        .eq('presenter_id', user.id);

      if (dbError) throw dbError;
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : '세션 상태 변경 실패';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 발표자의 모든 세션 조회
  const getUserSessions = async (): Promise<Session[]> => {
    if (!user) {
      setError('사용자가 인증되지 않았습니다.');
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: dbError } = await supabase
        .from('sessions')
        .select('*')
        .eq('presenter_id', user.id)
        .order('created_at', { ascending: false });

      if (dbError) throw dbError;
      return data || [];
    } catch (err) {
      const message = err instanceof Error ? err.message : '세션 조회 실패';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // 특정 세션 조회
  const getSession = async (sessionId: string): Promise<Session | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: dbError } = await supabase
        .from('sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (dbError) throw dbError;
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : '세션 조회 실패';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createSession,
    joinSession,
    updateSessionStatus,
    getUserSessions,
    getSession,
    loading,
    error,
  };
}

