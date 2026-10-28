import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  Student,
  Assignment,
  Submission,
  Question,
  CompetitionEvidence,
  LearningPathType,
} from '../types';
import {
  DEMO_STUDENTS,
  INITIAL_QUESTIONS,
  DEMO_ASSIGNMENTS,
  DEMO_SUBMISSIONS,
  DEMO_EVIDENCE_LIST,
} from '../data/mockData';

interface AppContextType {
  userRole: UserRole;
  currentStudent: Student | null;
  activeTeacherTab: string;
  setActiveTeacherTab: (tab: string) => void;
  isDemoMode: boolean;
  hasServerAI: boolean;
  students: Student[];
  assignments: Assignment[];
  submissions: Submission[];
  questions: Question[];
  evidenceList: CompetitionEvidence[];
  
  // Auth actions
  loginAsTeacher: () => void;
  loginAsStudent: (code: string) => boolean;
  logout: () => void;
  
  // Data actions
  setDemoMode: (enabled: boolean) => void;
  resetDemoData: () => void;
  clearRealData: () => void;
  addStudent: (student: Omit<Student, 'id'>) => Student;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  addQuestion: (question: Question) => void;
  deleteQuestion: (questionId: string) => void;
  addAssignment: (assignment: Assignment) => void;
  submitAssignment: (submission: Submission) => void;
  updateStudentPath: (studentId: string, path: LearningPathType, note?: string) => void;
  addEvidence: (evidence: CompetitionEvidence) => void;
  verifySubmission: (submissionId: string, verified: boolean, feedback?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole>('guest');
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [activeTeacherTab, setActiveTeacherTab] = useState<string>('dashboard');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [hasServerAI, setHasServerAI] = useState<boolean>(false);

  // Core Data States
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('ai_laban_students');
    return saved ? JSON.parse(saved) : DEMO_STUDENTS;
  });

  const [questions, setQuestions] = useState<Question[]>(() => {
    const saved = localStorage.getItem('ai_laban_questions');
    return saved ? JSON.parse(saved) : INITIAL_QUESTIONS;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('ai_laban_assignments');
    return saved ? JSON.parse(saved) : DEMO_ASSIGNMENTS;
  });

  const [submissions, setSubmissions] = useState<Submission[]>(() => {
    const saved = localStorage.getItem('ai_laban_submissions');
    return saved ? JSON.parse(saved) : DEMO_SUBMISSIONS;
  });

  const [evidenceList, setEvidenceList] = useState<CompetitionEvidence[]>(() => {
    const saved = localStorage.getItem('ai_laban_evidence');
    return saved ? JSON.parse(saved) : DEMO_EVIDENCE_LIST;
  });

  // Check backend server status
  useEffect(() => {
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.status === 'ok') {
          setHasServerAI(data.hasGeminiKey);
        }
      })
      .catch((err) => {
        console.warn('Backend server status check:', err);
      });
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('ai_laban_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('ai_laban_questions', JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem('ai_laban_assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('ai_laban_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('ai_laban_evidence', JSON.stringify(evidenceList));
  }, [evidenceList]);

  // Auth functions
  const loginAsTeacher = () => {
    setUserRole('teacher');
    setCurrentStudent(null);
  };

  const loginAsStudent = (code: string): boolean => {
    const normalized = code.trim().toUpperCase();
    const found = students.find((s) => s.code.toUpperCase() === normalized);
    if (found) {
      setCurrentStudent(found);
      setUserRole('student');
      return true;
    }
    return false;
  };

  const logout = () => {
    setUserRole('guest');
    setCurrentStudent(null);
  };

  // Reset demo data
  const resetDemoData = () => {
    setStudents(DEMO_STUDENTS);
    setQuestions(INITIAL_QUESTIONS);
    setAssignments(DEMO_ASSIGNMENTS);
    setSubmissions(DEMO_SUBMISSIONS);
    setEvidenceList(DEMO_EVIDENCE_LIST);
    setIsDemoMode(true);
  };

  const clearRealData = () => {
    setStudents([]);
    setAssignments([]);
    setSubmissions([]);
    setIsDemoMode(false);
  };

  // Entity mutations
  const addStudent = (studentData: Omit<Student, 'id'>): Student => {
    const newStudent: Student = {
      ...studentData,
      id: `hs-${Date.now()}`,
      masteryScores: studentData.masteryScores || {},
      badges: studentData.badges || ['Chào bạn mới'],
      isDemo: isDemoMode,
    };
    setStudents((prev) => [newStudent, ...prev]);
    return newStudent;
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
    if (currentStudent && currentStudent.id === id) {
      setCurrentStudent((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    if (currentStudent && currentStudent.id === id) {
      logout();
    }
  };

  const addQuestion = (question: Question) => {
    setQuestions((prev) => [question, ...prev]);
  };

  const deleteQuestion = (questionId: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== questionId));
  };

  const addAssignment = (assignment: Assignment) => {
    setAssignments((prev) => [assignment, ...prev]);
  };

  const submitAssignment = (submission: Submission) => {
    setSubmissions((prev) => {
      // replace if existing submission for same assignment & student or prepend
      const filtered = prev.filter(
        (s) => !(s.assignmentId === submission.assignmentId && s.studentId === submission.studentId)
      );
      return [submission, ...filtered];
    });

    // Update student's mastery score and recent activity
    if (submission.studentId) {
      const student = students.find((s) => s.id === submission.studentId);
      if (student) {
        const currentScores = { ...student.masteryScores };
        const assignment = assignments.find((a) => a.id === submission.assignmentId);
        if (assignment && assignment.objectiveId) {
          currentScores[assignment.objectiveId] = submission.percentage;
        }

        // Also if submission has recommendedPath, update student
        const newPath = submission.recommendedPath || student.currentPath;
        updateStudent(student.id, {
          masteryScores: currentScores,
          currentPath: newPath,
          recentActivity: `Đã nộp bài: ${assignment?.title || 'Bài tập'} (${submission.percentage}%)`,
        });
      }
    }
  };

  const updateStudentPath = (studentId: string, path: LearningPathType, note?: string) => {
    updateStudent(studentId, {
      currentPath: path,
      notes: note ? `${note}` : undefined,
    });
  };

  const addEvidence = (evidence: CompetitionEvidence) => {
    setEvidenceList((prev) => [evidence, ...prev]);
  };

  const verifySubmission = (submissionId: string, verified: boolean, feedback?: string) => {
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId
          ? {
              ...s,
              teacherVerified: verified,
              feedback: feedback !== undefined ? feedback : s.feedback,
            }
          : s
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        userRole,
        currentStudent,
        activeTeacherTab,
        setActiveTeacherTab,
        isDemoMode,
        hasServerAI,
        students,
        assignments,
        submissions,
        questions,
        evidenceList,
        loginAsTeacher,
        loginAsStudent,
        logout,
        setDemoMode: setIsDemoMode,
        resetDemoData,
        clearRealData,
        addStudent,
        updateStudent,
        deleteStudent,
        addQuestion,
        deleteQuestion,
        addAssignment,
        submitAssignment,
        updateStudentPath,
        addEvidence,
        verifySubmission,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
