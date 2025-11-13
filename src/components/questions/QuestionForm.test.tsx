import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import QuestionForm from './QuestionForm';
import { AuthProvider } from '@/contexts/AuthContext';

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      onAuthStateChange: vi.fn(() => ({
        data: {
          subscription: {
            unsubscribe: vi.fn(),
          },
        },
      })),
      getSession: vi.fn(() => ({
        data: {
          session: {
            user: {
              id: 'test-user-id',
              email: 'test@example.com',
            },
          },
        },
      })),
    },
  },
}));

describe('QuestionForm', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('should render form', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    render(
      <QuestionForm onSubmit={mockOnSubmit} />,
      { wrapper }
    );

    expect(screen.getByText('질문 작성')).toBeDefined();
  });

  it('should show error when submitting empty content', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    render(
      <QuestionForm onSubmit={mockOnSubmit} />,
      { wrapper }
    );

    const submitButton = screen.getByRole('button', { name: /질문 등록/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('질문을 입력해주세요.')).toBeDefined();
    });
  });

  it('should call onSubmit with content', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    render(
      <QuestionForm onSubmit={mockOnSubmit} />,
      { wrapper }
    );

    const textarea = screen.getByPlaceholderText('질문을 입력하세요...');
    fireEvent.change(textarea, { target: { value: '테스트 질문' } });

    const submitButton = screen.getByRole('button', { name: /질문 등록/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith('테스트 질문');
    });
  });

  it('should show character count', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    render(
      <QuestionForm onSubmit={mockOnSubmit} />,
      { wrapper }
    );

    const textarea = screen.getByPlaceholderText('질문을 입력하세요...');
    fireEvent.change(textarea, { target: { value: '안녕하세요' } });

    expect(screen.getByText('5/500')).toBeDefined();
  });
});

