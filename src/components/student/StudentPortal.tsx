import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Assignment, Question, Submission, StudentAnswer } from '../../types';
import { GamesArcade } from '../games/GamesArcade';
import confetti from 'canvas-confetti';
import {
  Compass,
  Award,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Clock,
  Send,
  HelpCircle,
  Gamepad2,
  Bot,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  RotateCcw,
  User,
  ShieldAlert,
} from 'lucide-react';

export const StudentPortal: React.FC = () => {
  const { currentStudent, assignments, submissions, submitAssignment, isDemoMode } = useApp();

  const [activeTab, setActiveTab] = useState<'tasks' | 'games' | 'chat' | 'journey'>('tasks');
  const [activeAssignment, setActiveAssignment] = useState<Assignment | null>(null);

  // Assignment solver state
  const [currentAnswers, setCurrentAnswers] = useState<Record<string, string>>({});
  const [submittedResult, setSubmittedResult] = useState<Submission | null>(null);

  // Student Chat state
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    {
      role: 'assistant',
      text: `Xin chào ${currentStudent?.name || 'bạn'}! Mình là Bạn La Bàn AI 🧭. Hôm nay chúng mình cùng khám phá kiến thức nhé! Bạn đang gặp khó khăn ở bài tập nào cần mình gợi ý từng bước không?`,
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  if (!currentStudent) return null;

  // Filter tasks applicable to this student (either targetType='all' or targetPath matches or targetStudentIds includes)
  const studentTasks = assignments.filter((asg) => {
    if (asg.targetType === 'all') return true;
    if (asg.targetType === 'path' && asg.targetPath === currentStudent.currentPath) return true;
    if (asg.targetType === 'individual' && asg.targetStudentIds?.includes(currentStudent.id)) return true;
    return false;
  });

  const getTaskStatus = (asgId: string) => {
    const sub = submissions.find((s) => s.assignmentId === asgId && s.studentId === currentStudent.id);
    if (sub) return { status: 'completed', text: 'Đã hoàn thành', score: `${sub.percentage}%` };
    return { status: 'pending', text: 'Chưa làm', score: null };
  };

  const handleStartTask = (asg: Assignment) => {
    setActiveAssignment(asg);
    setCurrentAnswers({});
    setSubmittedResult(null);
  };

  const handleSelectAnswer = (questionId: string, value: string) => {
    setCurrentAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmitTask = () => {
    if (!activeAssignment) return;

    let correctCount = 0;
    const studentAnswers: StudentAnswer[] = activeAssignment.questions.map((q) => {
      const userAns = (currentAnswers[q.id] || '').trim();
      let isCorrect = false;

      if (q.type === 'multiple_choice' || q.type === 'error_detection' || q.type === 'word_problem') {
        const correctLetter = (q.correctAnswer as string).trim().toUpperCase();
        isCorrect = userAns.toUpperCase().startsWith(correctLetter);
      } else {
        isCorrect = userAns.replace(',', '.').toLowerCase() === (q.correctAnswer as string).replace(',', '.').toLowerCase();
      }

      if (isCorrect) correctCount++;

      return {
        questionId: q.id,
        answer: userAns,
        isCorrect,
        score: isCorrect ? 10 / activeAssignment.questions.length : 0,
      };
    });

    const percentage = Math.round((correctCount / activeAssignment.questions.length) * 100);
    const totalScore = Math.round((percentage / 10) * 10) / 10;

    let pathRecommendation: 'KHOI_DONG' | 'TANG_TOC' | 'CHINH_PHUC' = 'TANG_TOC';
    if (percentage < 60) pathRecommendation = 'KHOI_DONG';
    else if (percentage >= 85) pathRecommendation = 'CHINH_PHUC';

    const newSub: Submission = {
      id: `sub-${Date.now()}`,
      assignmentId: activeAssignment.id,
      studentId: currentStudent.id,
      studentCode: currentStudent.code,
      submittedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN'),
      answers: studentAnswers,
      totalScore,
      maxScore: 10,
      percentage,
      teacherVerified: false,
      recommendedPath: pathRecommendation,
      isDemo: isDemoMode,
      feedback:
        percentage >= 80
          ? 'Thầy Diêm Nhật Minh khen ngợi em đã hoàn thành rất tốt!'
          : 'Em hãy xem kỹ lời giải gợi ý và tiếp tục cố gắng ở bài tập tiếp theo nhé!',
    };

    submitAssignment(newSub);
    setSubmittedResult(newSub);

    try {
      if (percentage >= 60) {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      }
    } catch (e) {}
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const query = chatInput.trim();
    setChatMessages((prev) => [...prev, { role: 'user', text: query }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: query }],
          studentContext: {
            name: currentStudent.name,
            code: currentStudent.code,
            path: currentStudent.currentPath,
          },
        }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        setChatMessages((prev) => [...prev, { role: 'assistant', text: data.reply }]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: `Bạn ${currentStudent.name} ơi, khi cộng số thập phân, bạn hãy nhớ viết số hạng này dưới số hạng kia sao cho dấu phẩy thẳng cột với dấu phẩy nhé. Bạn có muốn cùng mình thử làm một ví dụ nhỏ không nào?`,
          },
        ]);
      }
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Bạn La Bàn AI luôn sẵn sàng đồng hành cùng bạn! Hãy giữ bình tĩnh, đọc kỹ đề bài và thực hiện từng bước tính nhé.',
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Student Welcome Hero */}
      <div className="bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-4xl shadow-inner ring-2 ring-white/30">
              {currentStudent.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider bg-black/20 px-2.5 py-0.5 rounded-full">
                  GÓC HỌC TẬP CỦA EM
                </span>
                <span className="text-xs font-mono font-bold text-amber-100">
                  {currentStudent.code}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-heading mt-1">
                Chào em, {currentStudent.name}!
              </h1>
              <p className="text-xs text-amber-100 mt-1">
                Lớp 5/3 • TH Kim Đồng (207 Nguyễn Trung Trực, P. Rạch Giá, An Giang) • GVCN: Thầy Diêm Nhật Minh (0917014180)
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-1">
            <span className="text-xs text-amber-100 font-medium">Lộ trình học tập của em:</span>
            <span className="bg-white text-slate-900 font-extrabold text-xs px-3.5 py-1.5 rounded-xl shadow-md flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              {currentStudent.currentPath === 'KHOI_DONG' && 'Lộ trình 1: KHỞI ĐỘNG'}
              {currentStudent.currentPath === 'TANG_TOC' && 'Lộ trình 2: TĂNG TỐC'}
              {currentStudent.currentPath === 'CHINH_PHUC' && 'Lộ trình 3: CHINH PHỤC'}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => {
            setActiveTab('tasks');
            setActiveAssignment(null);
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'tasks' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>NHIỆM VỤ HÔM NAY ({studentTasks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('games')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'games' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Gamepad2 className="w-4 h-4" />
          <span>TRÒ CHƠI HỌC TẬP</span>
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'chat' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Compass className="w-4 h-4 text-blue-500" />
          <span>BẠN LA BÀN AI</span>
        </button>

        <button
          onClick={() => setActiveTab('journey')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'journey' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4 text-purple-500" />
          <span>HÀNH TRÌNH TIẾN BỘ</span>
        </button>
      </div>

      {/* TAB 1: NHIỆM VỤ HÔM NAY */}
      {activeTab === 'tasks' && !activeAssignment && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 font-heading">
              Danh Sách Nhiệm Vụ Được Giao Cho Em
            </h2>
            <span className="text-xs text-slate-500">
              {studentTasks.filter((t) => getTaskStatus(t.id).status === 'completed').length} / {studentTasks.length} bài đã làm
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studentTasks.map((t) => {
              const statusInfo = getTaskStatus(t.id);
              const isDone = statusInfo.status === 'completed';
              return (
                <div
                  key={t.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-amber-400 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-xs font-bold bg-amber-50 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-200">
                        {t.topic}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isDone
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {statusInfo.text} {statusInfo.score && `(${statusInfo.score})`}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mt-1">{t.title}</h3>

                    <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{t.timeLimitMinutes || 20} phút</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                        <span>{t.questions.length} câu hỏi</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Hạn nộp: {t.dueDate}</span>
                    <button
                      onClick={() => handleStartTask(t)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isDone
                          ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          : 'bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20'
                      }`}
                    >
                      <span>{isDone ? 'Làm lại' : 'Làm bài ngay'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Task Solver (Làm bài tập tương tác) */}
      {activeTab === 'tasks' && activeAssignment && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">
                ĐANG LÀM NHIỆM VỤ
              </span>
              <h2 className="text-lg font-bold text-slate-900">{activeAssignment.title}</h2>
            </div>
            <button
              onClick={() => setActiveAssignment(null)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50"
            >
              ← Trở về danh sách
            </button>
          </div>

          {!submittedResult ? (
            <div className="space-y-6">
              {activeAssignment.questions.map((q, idx) => (
                <div key={q.id || idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900">{q.prompt}</h4>
                    </div>
                  </div>

                  {/* Options */}
                  {q.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pl-8">
                      {q.options.map((opt, oIdx) => {
                        const letter = opt.substring(0, 1);
                        const isSelected = currentAnswers[q.id] === letter;
                        return (
                          <button
                            key={oIdx}
                            type="button"
                            onClick={() => handleSelectAnswer(q.id, letter)}
                            className={`p-3 text-xs rounded-xl border text-left font-semibold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-amber-100 text-amber-900 border-amber-400 ring-2 ring-amber-300'
                                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* If short answer */}
                  {q.type === 'short_answer' && (
                    <div className="pl-8 pt-1">
                      <input
                        type="text"
                        value={currentAnswers[q.id] || ''}
                        onChange={(e) => handleSelectAnswer(q.id, e.target.value)}
                        placeholder="Nhập câu trả lời của em tại đây..."
                        className="w-full sm:w-64 text-xs font-mono p-2.5 rounded-xl border border-slate-300"
                      />
                    </div>
                  )}
                </div>
              ))}

              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <button
                  onClick={handleSubmitTask}
                  className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-lg shadow-amber-500/25 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>NỘP BÀI LÊN THẦY MINH</span>
                </button>
              </div>
            </div>
          ) : (
            /* Result Screen */
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto text-3xl shadow-inner">
                {submittedResult.percentage >= 80 ? '🌟' : '👍'}
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {submittedResult.percentage >= 80 ? 'XUẤT SẮC LẮM EM ƠI!' : 'EM ĐÃ NỖ LỰC RẤT TUYỆT VỜI!'}
                </h3>
                <div className="text-3xl font-extrabold text-amber-600 mt-2 font-mono">
                  {submittedResult.totalScore} / 10 điểm ({submittedResult.percentage}%)
                </div>
              </div>

              <div className="max-w-md mx-auto p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 font-medium">
                {submittedResult.feedback}
              </div>

              {/* Explanations */}
              <div className="text-left space-y-3 max-w-2xl mx-auto pt-4 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-700 uppercase">
                  Xem lại lời giải từng câu:
                </h4>
                {activeAssignment.questions.map((q, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <div className="font-bold text-slate-800">
                      Câu {i + 1}: {q.prompt}
                    </div>
                    <div className="mt-1 text-emerald-700 font-semibold">
                      Đáp án đúng: {Array.isArray(q.correctAnswer) ? q.correctAnswer.join(', ') : q.correctAnswer}
                    </div>
                    <p className="mt-1 text-slate-600 italic">{q.explanation}</p>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => setActiveAssignment(null)}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
                >
                  Hoàn tất và về trang chủ
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TRÒ CHƠI HỌC TẬP */}
      {activeTab === 'games' && <GamesArcade isStudentMode={true} />}

      {/* TAB 3: BẠN LA BÀN AI CHAT */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-2xl shadow-md">
              🧭
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">BẠN LA BÀN AI</h3>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Gợi mở từng bước
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Trợ lý học tập thân thiện lớp 5/3 • Hãy hỏi mình cách giải, mình sẽ gợi ý cho bạn nhé!
              </p>
            </div>
          </div>

          {/* Chat dialog */}
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 text-xs">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 text-base">
                    🧭
                  </div>
                )}
                <div
                  className={`p-3.5 rounded-2xl max-w-md leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-amber-500 text-white rounded-br-xs font-medium'
                      : 'bg-slate-100 text-slate-800 rounded-bl-xs border border-slate-200'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <span>Bạn La Bàn đang suy nghĩ câu hỏi gợi ý cho em...</span>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSendChat} className="pt-3 border-t border-slate-200 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Hỏi Bạn La Bàn AI (ví dụ: 'Làm sao để đặt tính phép 12,5 + 3,84 vậy bạn?')..."
              className="flex-1 px-4 py-3 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={chatLoading || !chatInput.trim()}
              className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>Gửi</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: HÀNH TRÌNH CỦA EM */}
      {activeTab === 'journey' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h2 className="text-base font-bold text-slate-900 font-heading">
                Huy Hiệu & Cột Mốc Tiến Bộ Của {currentStudent.name}
              </h2>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                {currentStudent.badges.length} huy hiệu vinh danh
              </span>
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {currentStudent.badges.map((b, i) => (
                <div key={i} className="p-4 bg-purple-50 rounded-2xl border border-purple-200 text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-purple-200 text-purple-800 flex items-center justify-center mx-auto text-2xl">
                    🎖️
                  </div>
                  <div className="text-xs font-bold text-purple-900">{b}</div>
                  <span className="text-[10px] text-purple-600 block">Đã mở khóa</span>
                </div>
              ))}
            </div>

            {/* Mastery by Objective */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase">
                Tiến độ thực hiện Yêu cầu cần đạt (GDPT 2018):
              </h3>
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">YCCĐ-T5.01: Đặt tính cộng số thập phân</span>
                  <span className="font-mono font-bold text-emerald-700">Đã nắm vững (85%)</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">YCCĐ-T5.02: Tính thuận tiện giao hoán & kết hợp</span>
                  <span className="font-mono font-bold text-blue-700">Đang luyện tập (75%)</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">YCCĐ-T5.03: Bài toán lời văn thực tế 2 bước</span>
                  <span className="font-mono font-bold text-amber-700">Cần rèn luyện thêm (60%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
