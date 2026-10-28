import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SUBJECTS, LEARNING_OBJECTIVES } from '../../data/mockData';
import { SubjectId, Question, QuestionType } from '../../types';
import {
  Database,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  BookOpen,
  PlusCircle,
  HelpCircle,
  Sparkles,
  Send,
  X,
  FileQuestion,
  Check,
  ChevronRight,
  Layers,
} from 'lucide-react';

export const QuestionBankTab: React.FC = () => {
  const { questions, addQuestion, deleteQuestion, addAssignment, setActiveTeacherTab } = useApp();
  const [selectedSubject, setSelectedSubject] = useState<SubjectId | 'ALL'>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  // Add Exercise Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addMode, setAddMode] = useState<'manual' | 'ai_quick'>('manual');
  
  // Form fields
  const [subject, setSubject] = useState<SubjectId>('toan');
  const [topic, setTopic] = useState('Phép cộng số thập phân');
  const [difficulty, setDifficulty] = useState<'Khởi động' | 'Tăng tốc' | 'Chinh phục'>('Khởi động');
  const [type, setType] = useState<QuestionType>('multiple_choice');
  const [prompt, setPrompt] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('A');
  const [explanation, setExplanation] = useState('');
  const [objectiveId, setObjectiveId] = useState('yccd-toan-01');
  const [formError, setFormError] = useState('');
  const [notification, setNotification] = useState('');

  // AI Quick generate inside modal
  const [aiGenerating, setAiGenerating] = useState(false);

  const filteredQuestions = questions.filter((q) => {
    const matchSubj = selectedSubject === 'ALL' || q.subjectId === selectedSubject;
    const matchDiff = selectedDifficulty === 'ALL' || q.difficulty === selectedDifficulty;
    const matchText =
      q.prompt.toLowerCase().includes(search.toLowerCase()) ||
      q.topic.toLowerCase().includes(search.toLowerCase());
    return matchSubj && matchDiff && matchText;
  });

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setFormError('Vui lòng nhập nội dung câu hỏi.');
      return;
    }

    let optionsArray: string[] | undefined = undefined;
    if (type === 'multiple_choice' || type === 'error_detection' || type === 'word_problem') {
      if (!optA.trim() || !optB.trim() || !optC.trim() || !optD.trim()) {
        setFormError('Vui lòng nhập đầy đủ 4 phương án A, B, C, D.');
        return;
      }
      optionsArray = [
        `A. ${optA.trim()}`,
        `B. ${optB.trim()}`,
        `C. ${optC.trim()}`,
        `D. ${optD.trim()}`,
      ];
    } else {
      if (!correctAnswer.trim()) {
        setFormError('Vui lòng nhập đáp án đúng.');
        return;
      }
    }

    const newQuestion: Question = {
      id: `q-manual-${Date.now()}`,
      subjectId: subject,
      topic: topic.trim() || 'Chủ đề môn học',
      objectiveId,
      type,
      prompt: prompt.trim(),
      options: optionsArray,
      correctAnswer: type === 'short_answer' ? correctAnswer.trim() : correctAnswer,
      explanation: explanation.trim() || 'Thực hiện phép tính theo đúng quy tắc SGK lớp 5.',
      difficulty,
      isApprovedByTeacher: true,
      aiGenerated: false,
    };

    addQuestion(newQuestion);
    setNotification('Đã thêm bài tập mới thành công vào Ngân hàng học liệu!');
    setTimeout(() => setNotification(''), 3000);

    // Reset fields
    setPrompt('');
    setOptA('');
    setOptB('');
    setOptC('');
    setOptD('');
    setExplanation('');
    setFormError('');
    setShowAddModal(false);
  };

  const handleQuickAiCreate = async () => {
    setAiGenerating(true);
    setFormError('');
    try {
      const res = await fetch('/api/ai/generate-exercise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: SUBJECTS.find((s) => s.id === subject)?.name || 'Toán học',
          topic,
          objective: 'YCCĐ GDPT 2018 Lớp 5',
          level: difficulty,
          count: 1,
          questionType: type,
        }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
        const q = data.questions[0];
        setPrompt(q.question || q.prompt || '');
        if (q.options && q.options.length >= 4) {
          setOptA(q.options[0].replace(/^[A-D]\.\s*/, ''));
          setOptB(q.options[1].replace(/^[A-D]\.\s*/, ''));
          setOptC(q.options[2].replace(/^[A-D]\.\s*/, ''));
          setOptD(q.options[3].replace(/^[A-D]\.\s*/, ''));
        }
        setCorrectAnswer(q.correctAnswer || 'A');
        setExplanation(q.explanation || '');
        setAddMode('manual');
      } else {
        setFormError('Không thể tạo tự động lúc này, thầy cô có thể nhập tay câu hỏi bên dưới.');
      }
    } catch (e) {
      setFormError('Lỗi kết nối tạo bài tập. Thầy cô vui lòng nhập nội dung thủ công.');
    } finally {
      setAiGenerating(false);
    }
  };

  const handleDelete = (id: string, promptText: string) => {
    if (window.confirm(`Thầy cô có chắc chắn muốn xóa câu hỏi:\n"${promptText.slice(0, 60)}..."?`)) {
      deleteQuestion(id);
      setNotification('Đã xóa câu hỏi khỏi ngân hàng bài tập!');
      setTimeout(() => setNotification(''), 2500);
    }
  };

  const handleAssignSingle = (q: Question) => {
    addAssignment({
      id: `assign-single-${Date.now()}`,
      title: `Luyện tập nhanh: ${q.topic} (${q.difficulty})`,
      subjectId: q.subjectId,
      topic: q.topic,
      objectiveId: q.objectiveId,
      targetType: 'all',
      questions: [q],
      dueDate: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString().slice(0, 10),
      createdAt: new Date().toISOString().slice(0, 10),
      timeLimitMinutes: 10,
      showSolutionAfterSubmit: true,
      maxAttempts: 2,
      status: 'active',
    });
    setNotification(`Đã tạo nhiệm vụ giao câu hỏi "${q.topic}" cho cả lớp 5/3!`);
    setTimeout(() => {
      setNotification('');
      setActiveTeacherTab('assignments');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-heading text-slate-900">
              Ngân Hàng Câu Hỏi & Bài Tập Đã Kiểm Duyệt
            </h2>
            <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
              {questions.length} câu
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kho học liệu chuẩn GDPT 2018 dành cho lớp 5 – Được Thầy Diêm Nhật Minh xác nhận tính sư phạm
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTeacherTab('workshop')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 transition-colors shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Xưởng Bài Tập AI</span>
          </button>

          <button
            onClick={() => {
              setShowAddModal(true);
              setFormError('');
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>THÊM BÀI TẬP MỚI</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {notification && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Filter bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value as any)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white"
          >
            <option value="ALL">Tất cả môn học ({questions.length})</option>
            {SUBJECTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white"
          >
            <option value="ALL">Tất cả mức độ</option>
            <option value="Khởi động">Khởi động (Cơ bản)</option>
            <option value="Tăng tốc">Tăng tốc (Thực hành)</option>
            <option value="Chinh phục">Chinh phục (Nâng cao)</option>
          </select>
        </div>

        <div className="w-full sm:w-64 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo nội dung câu hỏi..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-300"
          />
        </div>
      </div>

      {/* Questions list */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400">
            <Database className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="text-xs font-semibold text-slate-700">Không tìm thấy câu hỏi phù hợp.</p>
            <p className="text-xs text-slate-400 mt-1">Thầy cô hãy bấm nút "Thêm Bài Tập Mới" ở trên để bổ sung câu hỏi vào ngân hàng.</p>
          </div>
        ) : (
          filteredQuestions.map((q, idx) => (
            <div key={q.id || idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
                  <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-200">
                    {SUBJECTS.find((s) => s.id === q.subjectId)?.name || 'Toán học'} • {q.topic}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      q.difficulty === 'Khởi động'
                        ? 'bg-amber-100 text-amber-800'
                        : q.difficulty === 'Tăng tốc'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-teal-100 text-teal-800'
                    }`}
                  >
                    {q.difficulty}
                  </span>
                  {q.aiGenerated && (
                    <span className="text-[10px] font-semibold bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-purple-500" /> AI Thiết Kế
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Đã duyệt
                  </span>
                  <button
                    onClick={() => handleAssignSingle(q)}
                    title="Giao câu hỏi này cho học sinh làm ngay"
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(q.id, q.prompt)}
                    title="Xóa câu hỏi khỏi ngân hàng"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs font-bold text-slate-800 mt-2">{q.prompt}</p>

              {q.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                  {q.options.map((opt, oIdx) => (
                    <div
                      key={oIdx}
                      className={`text-xs p-2 rounded-lg border ${
                        opt.startsWith(q.correctAnswer as string)
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              )}

              {q.type === 'short_answer' && (
                <div className="mt-2 text-xs text-emerald-800 font-bold bg-emerald-50/60 p-2 rounded-lg border border-emerald-200">
                  Đáp án chuẩn: {Array.isArray(q.correctAnswer) ? q.correctAnswer.join(', ') : q.correctAnswer}
                </div>
              )}

              <div className="mt-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-600">
                <span className="font-bold text-blue-700">Hướng dẫn giải sư phạm: </span>
                {q.explanation}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Thêm Bài Tập Mới Vào Ngân Hàng */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
            {/* Modal Header */}
            <div className="p-5 bg-linear-to-r from-blue-700 via-indigo-700 to-teal-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
                  <FileQuestion className="w-6 h-6 text-yellow-300" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Thêm Bài Tập Mới Vào Ngân Hàng</h3>
                  <p className="text-xs text-blue-100">
                    Lớp 5/3 • TH Kim Đồng (207 Nguyễn Trung Trực, P. Rạch Giá, An Giang) • GV: Diêm Nhật Minh
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAddMode('manual')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  addMode === 'manual'
                    ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1. Soạn Thảo Thủ Công
              </button>
              <button
                type="button"
                onClick={() => setAddMode('ai_quick')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  addMode === 'ai_quick'
                    ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>2. AI Soạn Nhanh Cho Tôi</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              {addMode === 'ai_quick' && (
                <div className="p-4 bg-linear-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-900 font-bold">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Trí Tuệ Nhân Tạo Sẽ Soạn Một Câu Hỏi Mới Chuẩn GDPT 2018</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    AI sẽ tự động thiết kế câu hỏi, 4 phương án, đáp án đúng và lời giải sư phạm chi tiết. Sau đó thầy cô có thể kiểm tra và chỉnh sửa trước khi lưu.
                  </p>
                  <button
                    type="button"
                    onClick={handleQuickAiCreate}
                    disabled={aiGenerating}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
                  >
                    <Sparkles className={`w-4 h-4 ${aiGenerating ? 'animate-spin' : 'text-yellow-300'}`} />
                    <span>{aiGenerating ? 'AI Đang Thiết Kế...' : 'TẠO CÂU HỎI MẪU NGAY'}</span>
                  </button>
                </div>
              )}

              <form onSubmit={handleManualSubmit} className="space-y-4">
                {/* Subject & Topic */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Môn học lớp 5:</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value as any)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    >
                      {SUBJECTS.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tên bài học / Chủ đề:</label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="Ví dụ: Phép cộng số thập phân"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                      required
                    />
                  </div>
                </div>

                {/* Difficulty & Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Mức độ phân hóa:</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as any)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="Khởi động">Khởi động (Cơ bản, củng cố nền tảng)</option>
                      <option value="Tăng tốc">Tăng tốc (Vận dụng, thực hành)</option>
                      <option value="Chinh phục">Chinh phục (Mở rộng sáng tạo)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Dạng bài tập:</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as any)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="multiple_choice">Trắc nghiệm 4 lựa chọn (A, B, C, D)</option>
                      <option value="word_problem">Bài toán có lời văn thực tế</option>
                      <option value="error_detection">Tìm lỗi sai nhận thức</option>
                      <option value="short_answer">Điền số / Đáp án ngắn</option>
                    </select>
                  </div>
                </div>

                {/* Question Prompt */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nội dung đề bài / Câu hỏi:
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ví dụ: Đặt tính rồi tính: 48,25 + 7,9 = ?"
                    rows={3}
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>

                {/* Options if multiple choice or error detection */}
                {(type === 'multiple_choice' || type === 'error_detection' || type === 'word_problem') && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <span className="font-bold text-slate-800 block">4 Phương Án Trả Lời:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="font-bold text-blue-700">A:</span>
                        <input
                          type="text"
                          value={optA}
                          onChange={(e) => setOptA(e.target.value)}
                          placeholder="Phương án A"
                          className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                          required
                        />
                      </div>
                      <div>
                        <span className="font-bold text-blue-700">B:</span>
                        <input
                          type="text"
                          value={optB}
                          onChange={(e) => setOptB(e.target.value)}
                          placeholder="Phương án B"
                          className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                          required
                        />
                      </div>
                      <div>
                        <span className="font-bold text-blue-700">C:</span>
                        <input
                          type="text"
                          value={optC}
                          onChange={(e) => setOptC(e.target.value)}
                          placeholder="Phương án C"
                          className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                          required
                        />
                      </div>
                      <div>
                        <span className="font-bold text-blue-700">D:</span>
                        <input
                          type="text"
                          value={optD}
                          onChange={(e) => setOptD(e.target.value)}
                          placeholder="Phương án D"
                          className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <label className="block font-bold text-emerald-800 mb-1">
                        Đáp án đúng là:
                      </label>
                      <select
                        value={correctAnswer}
                        onChange={(e) => setCorrectAnswer(e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-900 font-bold"
                      >
                        <option value="A">Phương án A</option>
                        <option value="B">Phương án B</option>
                        <option value="C">Phương án C</option>
                        <option value="D">Phương án D</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* If short answer */}
                {type === 'short_answer' && (
                  <div>
                    <label className="block font-bold text-emerald-800 mb-1">
                      Đáp án chính xác (Số hoặc từ khóa):
                    </label>
                    <input
                      type="text"
                      value={correctAnswer}
                      onChange={(e) => setCorrectAnswer(e.target.value)}
                      placeholder="Ví dụ: 56,15"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-900 font-mono font-bold"
                      required
                    />
                  </div>
                )}

                {/* Explanation */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Hướng dẫn giải sư phạm chi tiết:
                  </label>
                  <textarea
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    placeholder="Giải thích các bước tính để học sinh hiểu bản chất khi xem lại bài..."
                    rows={2}
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>

                {formError && (
                  <div className="p-3 bg-rose-50 text-rose-700 rounded-xl font-bold border border-rose-200">
                    {formError}
                  </div>
                )}

                {/* Modal Footer */}
                <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Lưu Vào Ngân Hàng Bài Tập</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
