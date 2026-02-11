
export enum AppView {
  DASHBOARD = 'dashboard',
  LEARNING_PATH = 'learning_path',
  COURSES = 'courses',
  AI_TUTOR = 'ai_tutor',
  LIVE_LAB = 'live_lab',
  VOICE_TEACHER = 'voice_teacher',
  SLIDE_LESSON = 'slide_lesson',
  INTERACTIVE_CHAT_LESSON = 'interactive_chat_lesson',
  ONLINE_CLASS = 'online_class',
  QUIZ = 'quiz',
  COMMUNITY = 'community',
  LIVE_CLASS = 'live_class',
  PROFILE = 'profile'
}

export interface UserProgress {
  level: number;
  xp: number;
  badges: string[];
  streak: number;
  completedLessons: string[];
}

export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: Date;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface CourseModule {
  id: string;
  title: string;
  content: string;
  duration: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  duration: string;
  xpReward: number;
  isFree?: boolean;
  modules?: CourseModule[];
}
