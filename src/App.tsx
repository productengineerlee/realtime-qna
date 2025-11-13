import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import ParticipantEntry from '@/components/auth/ParticipantEntry';
import HomePage from '@/pages/HomePage';
import ParticipantSession from '@/pages/ParticipantSession';
import CreateSession from '@/pages/CreateSession';
import PresenterDashboard from '@/pages/PresenterDashboard';
import MySessionsPage from '@/pages/MySessionsPage';

// 보호된 라우트 - 발표자만
function PresenterRoute({ children }: { children: ReactNode }) {
  const { user, loading, userRole } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">로딩 중...</div>
      </div>
    );
  }

  if (!user || userRole !== 'presenter') {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// 보호된 라우트 - 참가자
function ParticipantRoute({ children }: { children: ReactNode }) {
  const { user, loading, userRole } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">로딩 중...</div>
      </div>
    );
  }

  if (!user || userRole !== 'participant') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AppContent() {
  return (
    <Routes>
      {/* 홈페이지 */}
      <Route path="/" element={<HomePage />} />

      {/* 인증 페이지 */}
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/join" element={<ParticipantEntry />} />

      {/* 발표자 - 내 세션 목록 */}
      <Route
        path="/my-sessions"
        element={
          <PresenterRoute>
            <MySessionsPage />
          </PresenterRoute>
        }
      />

      {/* 발표자 - 대시보드 */}
      <Route
        path="/presenter/session/:sessionId"
        element={
          <PresenterRoute>
            <PresenterDashboard />
          </PresenterRoute>
        }
      />

      {/* 발표자 대시보드 (리다이렉트) */}
      <Route
        path="/presenter-dashboard"
        element={
          <PresenterRoute>
            <Navigate to="/my-sessions" replace />
          </PresenterRoute>
        }
      />

      {/* 참가자 세션 뷰 */}
      <Route
        path="/session/:sessionCode"
        element={
          <ParticipantRoute>
            <ParticipantSession />
          </ParticipantRoute>
        }
      />

      {/* 세션 생성 */}
      <Route
        path="/create-session"
        element={
          <PresenterRoute>
            <CreateSession />
          </PresenterRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <AppContent />
          </div>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}
