import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { LandingPage } from './components/landing/LandingPage';
import { TeacherLayout } from './components/teacher/TeacherLayout';
import { DashboardTab } from './components/teacher/DashboardTab';
import { StudentsTab } from './components/teacher/StudentsTab';
import { DiagnosticTab } from './components/teacher/DiagnosticTab';
import { ExerciseWorkshopTab } from './components/teacher/ExerciseWorkshopTab';
import { QuestionBankTab } from './components/teacher/QuestionBankTab';
import { PersonalizedPathTab } from './components/teacher/PersonalizedPathTab';
import { AssignmentsTab } from './components/teacher/AssignmentsTab';
import { AssistantTab } from './components/teacher/AssistantTab';
import { AnalyticsTab } from './components/teacher/AnalyticsTab';
import { EvidenceTab } from './components/teacher/EvidenceTab';
import { SettingsTab } from './components/teacher/SettingsTab';
import { GamesArcade } from './components/games/GamesArcade';
import { StudentPortal } from './components/student/StudentPortal';
import { DemoWalkthroughModal } from './components/demo/DemoWalkthroughModal';

const MainApp: React.FC = () => {
  const { userRole, activeTeacherTab } = useApp();
  const [demoGuideOpen, setDemoGuideOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      <Header onOpenDemoGuide={() => setDemoGuideOpen(true)} />

      <main className="flex-1">
        {userRole === 'guest' && (
          <LandingPage onOpenDemoGuide={() => setDemoGuideOpen(true)} />
        )}

        {userRole === 'teacher' && (
          <TeacherLayout>
            {activeTeacherTab === 'dashboard' && <DashboardTab />}
            {activeTeacherTab === 'students' && <StudentsTab />}
            {activeTeacherTab === 'diagnostic' && <DiagnosticTab />}
            {activeTeacherTab === 'workshop' && <ExerciseWorkshopTab />}
            {activeTeacherTab === 'bank' && <QuestionBankTab />}
            {activeTeacherTab === 'games' && <GamesArcade />}
            {activeTeacherTab === 'paths' && <PersonalizedPathTab />}
            {activeTeacherTab === 'assistant' && <AssistantTab />}
            {activeTeacherTab === 'assignments' && <AssignmentsTab />}
            {activeTeacherTab === 'analytics' && <AnalyticsTab />}
            {activeTeacherTab === 'evidence' && <EvidenceTab />}
            {activeTeacherTab === 'settings' && <SettingsTab />}
          </TeacherLayout>
        )}

        {userRole === 'student' && (
          <div className="p-4 sm:p-6 lg:p-8">
            <StudentPortal />
          </div>
        )}
      </main>

      <DemoWalkthroughModal
        isOpen={demoGuideOpen}
        onClose={() => setDemoGuideOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
