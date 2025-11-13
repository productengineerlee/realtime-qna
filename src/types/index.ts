// Session Types
export interface Session {
  id: string;
  presenter_id: string;
  session_code: string;
  title: string;
  status: 'active' | 'closed';
  created_at: string;
  updated_at: string;
}

// Question Types
export interface Question {
  id: string;
  session_id: string;
  participant_id: string;
  content: string;
  likes_count: number;
  status: 'normal' | 'hidden' | 'pinned' | 'answered';
  created_at: string;
  updated_at: string;
}

// Like Types
export interface Like {
  id: string;
  question_id: string;
  participant_id: string;
  created_at: string;
}

// User Types
export interface User {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
  };
}

