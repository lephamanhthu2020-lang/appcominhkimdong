import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SUBJECTS, LEARNING_OBJECTIVES, INITIAL_QUESTIONS } from '../../data/mockData';
import { Question, SubjectId } from '../../types';
import {
  Compass,
  Sparkles,
  CheckCircle2,
  ListPlus,
  Send,
  Eye,
  FileCheck,
  Edit3,
  Trash2,
  AlertCircle,
  HelpCircle,
  Bot,
} from 'lucide-react';

export const DiagnosticTab: React.FC = () => {
  const { addAssignment, addQuestion, questions, hasServerAI, setActiveTeacherTab } = useApp();

  const [selectedSubject, setSelectedSubject] = useState<SubjectId>('toan');
  const [topic, setTopic] = useState('Phép cộng số thập phân');
  const [selectedObjective, setSelectedObjective] = useState(LEARNING_OBJECTIVES[0].code);
  const [questionCount, setQuestionCount] = useState(4);
  const [questionType, setQuestionType] = useState('multiple_choice');
  const [timeLimit, setTimeLimit] = useState(20);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>(INITIAL_QUESTIONS.slice(0, 4));
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Filter learning objectives by subject
  const currentObjectives = LEARNING_OBJECTIVES.filter((o) => o.subjectId === selectedSubject);

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    setPublishSuccess(false);

    try {
      const res = await fetch('/api/ai/generate-exercise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: SUBJECTS.find((s) => s.id === selectedSubject)?.name || 'Toán học',
          topic,
          objective: selectedObjective,
          level: 'Mức 1-2 (Nhận biết và Thông hiểu - Khảo sát đầu vào GDPT 2018)',
          count: questionCount,
          questionType,
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
        const mapped: Question[] = data.questions.map((q: any, i: number) => ({
          id: `diag-gen-${Date.now()}-${i}`,
          subjectId: selectedSubject,
          topic,
          objectiveId: LEARNING_OBJECTIVES[0].id,
          type: (q.type as any) || 'multiple_choice',
          prompt: q.question,
          options: q.options || ['A. ...', 'B. ...', 'C. ...', 'D. ...'],
          correctAnswer: q.correctAnswer || 'A',
          explanation: q.explanation || 'Hướng dẫn giải chi tiết...',
          difficulty: 'Khởi động',
          isApprovedByTeacher: false,
          aiGenerated: true,
        }));
        setGeneratedQuestions(mapped);
      } else {
        // High-standard pedagogical fallback for Vietnam Grade 5 GDPT 2018
        setGeneratedQuestions([
          {
            id: `q-p5-${Date.now()}-1`,
            subjectId: selectedSubject,
            topic,
            objectiveId: LEARNING_OBJECTIVES[0].id,
            type: 'multiple_choice',
            prompt: 'Đặt tính rồi tính: 15,32 + 4,8 = ?',
            options: ['A. 19,40', 'B. 20,12', 'C. 19,12', 'D. 63,32'],
            correctAnswer: 'B',
            explanation: 'Đặt tính chữ số 4 thẳng hàng đơn vị với 5; chữ số 8 thẳng hàng phần mười với 3: 15,32 + 04,80 = 20,12.',
            difficulty: 'Khởi động',
            isApprovedByTeacher: false,
            aiGenerated: true,
          },
          {
            id: `q-p5-${Date.now()}-2`,
            subjectId: selectedSubject,
            topic,
            objectiveId: LEARNING_OBJECTIVES[1]?.id || LEARNING_OBJECTIVES[0].id,
            type: 'multiple_choice',
            prompt: 'Tính bằng cách thuận tiện nhất: 3,45 + 8,92 + 6,55',
            options: ['A. 18,92', 'B. 17,92', 'C. 19,92', 'D. 18'],
            correctAnswer: 'A',
            explanation: 'Áp dụng tính chất giao hoán và kết hợp: (3,45 + 6,55) + 8,92 = 10 + 8,92 = 18,92.',
            difficulty: 'Tăng tốc',
            isApprovedByTeacher: false,
            aiGenerated: true,
          },
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApproveAndPublish = () => {
    // Add questions to global question bank
    generatedQuestions.forEach((q) => {
      addQuestion({ ...q, isApprovedByTeacher: true });
    });

    // Create active assignment for class
    addAssignment({
      id: `assign-diag-${Date.now()}`,
      title: `Khảo sát năng lực: ${topic} (${SUBJECTS.find((s) => s.id === selectedSubject)?.name})`,
      subjectId: selectedSubject,
      topic,
      objectiveId: LEARNING_OBJECTIVES[0].id,
      targetType: 'all',
      questions: generatedQuestions,
      dueDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 10),
      createdAt: new Date().toISOString().slice(0, 10),
      timeLimitMinutes: timeLimit,
      showSolutionAfterSubmit: true,
      maxAttempts: 2,
      status: 'active',
    });

    setPublishSuccess(true);
    setTimeout(() => {
      setActiveTeacherTab('assignments');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-heading text-slate-900">
              Khảo Sát Năng Lực Đầu Vào Bằng AI
            </h2>
            <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
              GDPT 2018 Lớp 5
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Thiết kế bài kiểm tra đầu chủ đề để phân luồng 3 nhánh học tập – Không dán nhãn cố định học sinh
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Trạng thái AI:</span>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              hasServerAI
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : 'bg-amber-100 text-amber-800 border border-amber-200'
            }`}
          >
            {hasServerAI ? 'Gemini 3.8-flash Đã Kết Nối' : 'Bộ Đề Sư Phạm Tích Hợp'}
          </span>
        </div>
      </div>

      {/* Main Builder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form Configuration */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Compass className="w-4 h-4 text-blue-600" />
            Thiết Lập Khảo Sát
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Môn học lớp 5:</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value as any)}
              className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-white"
            >
              {SUBJECTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tên bài / Chủ đề:</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ví dụ: Phép cộng số thập phân"
              className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Yêu cầu cần đạt (YCCĐ):
            </label>
            <select
              value={selectedObjective}
              onChange={(e) => setSelectedObjective(e.target.value)}
              className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-white"
            >
              {currentObjectives.map((o) => (
                <option key={o.id} value={o.code}>
                  {o.code}: {o.description}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Số lượng câu:</label>
              <input
                type="number"
                min={2}
                max={10}
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value, 10) || 4)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Thời gian (phút):</label>
              <input
                type="number"
                min={5}
                max={60}
                value={timeLimit}
                onChange={(e) => setTimeLimit(parseInt(e.target.value, 10) || 20)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Hình thức câu hỏi:</label>
            <select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
              className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-white"
            >
              <option value="multiple_choice">Trắc nghiệm 4 lựa chọn (A, B, C, D)</option>
              <option value="error_detection">Tìm và sửa lỗi sai nhận thức</option>
              <option value="word_problem">Bài toán có lời văn 1-2 bước</option>
              <option value="match_pair">Ghép cặp tương ứng</option>
              <option value="short_answer">Điền số / Đáp án ngắn</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              onClick={handleGenerateAI}
              disabled={isGenerating}
              className="w-full inline-flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-xl text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : 'text-amber-300'}`} />
              <span>{isGenerating ? 'AI Đang Khởi Tạo Đề...' : 'AI TẠO BÀI KHẢO SÁT'}</span>
            </button>
          </div>
        </div>

        {/* Right Column (2/3): Question Review and Publish */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Nội Dung Bài Khảo Sát Được AI Thiết Kế
                </h3>
                <p className="text-xs text-slate-500">
                  Giáo viên kiểm tra tính chuẩn xác của câu hỏi, đáp án và lời giải trước khi công bố
                </p>
              </div>

              <span className="text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
                {generatedQuestions.length} câu hỏi
              </span>
            </div>

            {/* Questions list */}
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {generatedQuestions.map((q, idx) => (
                <div
                  key={q.id || idx}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-800">{q.prompt}</span>
                    </div>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                      {q.difficulty}
                    </span>
                  </div>

                  {/* Options if multiple choice */}
                  {q.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pl-8">
                      {q.options.map((opt, optIdx) => (
                        <div
                          key={optIdx}
                          className={`text-xs p-2 rounded-lg border ${
                            opt.startsWith(q.correctAnswer as string)
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold'
                              : 'bg-white text-slate-700 border-slate-200'
                          }`}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Explanation */}
                  <div className="mt-3 pl-8 text-xs text-slate-600 bg-white/80 p-2.5 rounded-lg border border-slate-200">
                    <strong className="text-blue-700">Lời giải sư phạm: </strong>
                    {q.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action bottom bar */}
          <div className="pt-5 mt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Nội dung đã sẵn sàng để giao cho học sinh lớp 5/3</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleGenerateAI}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Tạo lại
              </button>
              <button
                onClick={handleApproveAndPublish}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>PHÊ DUYỆT & GIAO KHẢO SÁT</span>
              </button>
            </div>
          </div>

          {publishSuccess && (
            <div className="mt-3 p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Đã phê duyệt và phát bài khảo sát thành công tới Lớp 5/3!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
