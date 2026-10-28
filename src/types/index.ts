export type UserRole = 'teacher' | 'student' | 'guest';

export type SubjectId = 
  | 'toan'
  | 'tieng_viet'
  | 'khoa_hoc'
  | 'lich_su_dia_li'
  | 'dao_duc'
  | 'tin_hoc'
  | 'cong_nghe'
  | 'hoat_dong_trai_nghiem';

export interface SubjectInfo {
  id: SubjectId;
  name: string;
  icon: string;
  color: string;
  grade: number;
}

export type LearningPathType = 'KHOI_DONG' | 'TANG_TOC' | 'CHINH_PHUC';

export interface LearningObjective {
  id: string;
  subjectId: SubjectId;
  topic: string;
  code: string; // e.g. YCCD-TOAN5-01
  description: string;
  gradeLevel: number;
}

export interface Student {
  id: string;
  code: string; // HS-01, HS-DEMO-01 (privacy-first identifier)
  name: string; // Tên hiển thị
  gender: 'Nam' | 'Nữ';
  dob?: string;
  avatar: string;
  classId: string;
  currentPath: LearningPathType;
  masteryScores: Record<string, number>; // objectiveId -> 0..100
  recentActivity?: string;
  isDemo?: boolean;
  notes?: string;
  badges: string[];
}

export type QuestionType = 
  | 'multiple_choice'
  | 'short_answer'
  | 'true_false'
  | 'match_pair'
  | 'ordering'
  | 'error_detection'
  | 'word_problem';

export interface Question {
  id: string;
  subjectId: SubjectId;
  topic: string;
  objectiveId: string;
  type: QuestionType;
  prompt: string;
  options?: string[]; // for multiple choice
  correctAnswer: string | string[];
  explanation: string;
  difficulty: 'Khởi động' | 'Tăng tốc' | 'Chinh phục';
  isApprovedByTeacher?: boolean;
  aiGenerated?: boolean;
  pairData?: { left: string; right: string }[];
  steps?: string[];
}

export interface Assignment {
  id: string;
  title: string;
  subjectId: SubjectId;
  topic: string;
  objectiveId: string;
  targetType: 'all' | 'group' | 'individual' | 'path';
  targetPath?: LearningPathType;
  targetStudentIds?: string[];
  questions: Question[];
  dueDate: string;
  createdAt: string;
  timeLimitMinutes?: number;
  showSolutionAfterSubmit: boolean;
  maxAttempts: number;
  status: 'active' | 'draft' | 'closed';
  isDemo?: boolean;
}

export interface StudentAnswer {
  questionId: string;
  answer: string | string[];
  isCorrect?: boolean;
  score?: number;
  timeSpentSeconds?: number;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentCode: string;
  submittedAt: string;
  answers: StudentAnswer[];
  totalScore: number;
  maxScore: number;
  percentage: number;
  feedback?: string;
  teacherVerified: boolean;
  recommendedPath?: LearningPathType;
  identifiedIssues?: string[];
  isDemo?: boolean;
}

export interface DiagnosticSurvey {
  id: string;
  title: string;
  subjectId: SubjectId;
  topic: string;
  objectiveIds: string[];
  questions: Question[];
  createdAt: string;
  isActive: boolean;
}

export interface PersonalizedRecommendation {
  studentId: string;
  studentName: string;
  studentCode: string;
  currentScore: number;
  detectedIssues: string[];
  recommendedPath: LearningPathType;
  reason: string;
  actionItems: string[];
  teacherApproved: boolean;
  suggestedTasks: string[];
}

export interface CompetitionEvidence {
  id: string;
  title: string;
  date: string;
  category: 'log' | 'survey' | 'result' | 'feedback_student' | 'feedback_teacher' | 'before_after';
  description: string;
  metrics?: { label: string; value: string }[];
  verifiedBy: string;
  notes: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isSafetyWarning?: boolean;
}
