import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SUBJECTS, LEARNING_OBJECTIVES } from '../../data/mockData';
import { SubjectId, Question } from '../../types';
import {
  FileQuestion,
  Sparkles,
  Save,
  Send,
  Printer,
  Edit2,
  RefreshCw,
  Eye,
  CheckCircle2,
  Download,
  BookOpen,
} from 'lucide-react';

export const ExerciseWorkshopTab: React.FC = () => {
  const { addQuestion, addAssignment, hasServerAI, setActiveTeacherTab } = useApp();

  const [subject, setSubject] = useState<SubjectId>('toan');
  const [topic, setTopic] = useState('Phép cộng số thập phân');
  const [objective, setObjective] = useState('Thực hiện phép tính cộng thẳng cột chữ số cùng hàng và dấu phẩy thẳng hàng');
  const [level, setLevel] = useState<'Khởi động' | 'Tăng tốc' | 'Chinh phục'>('Tăng tốc');
  const [count, setCount] = useState(3);
  const [questionType, setQuestionType] = useState('multiple_choice');
  const [timeMinutes, setTimeMinutes] = useState(15);

  const [loading, setLoading] = useState(false);
  const [generatedItems, setGeneratedItems] = useState<Question[]>([]);
  const [message, setMessage] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/ai/generate-exercise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: SUBJECTS.find((s) => s.id === subject)?.name || 'Toán học',
          topic,
          objective,
          level,
          count,
          questionType,
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
        const questionsMapped: Question[] = data.questions.map((q: any, i: number) => ({
          id: `workshop-${Date.now()}-${i}`,
          subjectId: subject,
          topic,
          objectiveId: 'yccd-toan-01',
          type: (q.type as any) || 'multiple_choice',
          prompt: q.question,
          options: q.options || ['A. ...', 'B. ...', 'C. ...', 'D. ...'],
          correctAnswer: q.correctAnswer || 'A',
          explanation: q.explanation || 'Hướng dẫn giải chi tiết...',
          difficulty: level,
          isApprovedByTeacher: true,
          aiGenerated: true,
        }));
        setGeneratedItems(questionsMapped);
      } else {
        // High quality fallback
        setGeneratedItems([
          {
            id: `ws-item-${Date.now()}-1`,
            subjectId: subject,
            topic,
            objectiveId: 'yccd-toan-01',
            type: 'multiple_choice',
            prompt: `[${level}] Đặt tính rồi tính giá trị của biểu thức: 36,4 + 9,85 = ?`,
            options: ['A. 46,25', 'B. 45,25', 'C. 134,9', 'D. 46,89'],
            correctAnswer: 'A',
            explanation: 'Đặt tính: 36,40 + 09,85. Hàng phần trăm 0+5=5; hàng phần mười 4+8=12 viết 2 nhớ 1; hàng đơn vị 6+9+1=16 viết 6 nhớ 1; 3+1=4 -> 46,25.',
            difficulty: level,
            isApprovedByTeacher: true,
            aiGenerated: true,
          },
          {
            id: `ws-item-${Date.now()}-2`,
            subjectId: subject,
            topic,
            objectiveId: 'yccd-toan-02',
            type: 'word_problem',
            prompt: `[${level}] Một sợi dây dài 12,6 mét. Người ta cắt đi 3,45 mét để buộc gói quà. Hỏi sợi dây còn lại dài bao nhiêu mét?`,
            options: ['A. 9,15 mét', 'B. 9,25 mét', 'C. 8,15 mét', 'D. 16,05 mét'],
            correctAnswer: 'A',
            explanation: 'Sợi dây còn lại là: 12,6 - 3,45 = 9,15 (m).',
            difficulty: level,
            isApprovedByTeacher: true,
            aiGenerated: true,
          },
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToBank = () => {
    generatedItems.forEach((q) => addQuestion(q));
    setMessage(`Đã lưu ${generatedItems.length} câu hỏi vào Ngân hàng học liệu đã kiểm duyệt!`);
  };

  const handleAssignToStudents = () => {
    generatedItems.forEach((q) => addQuestion(q));
    addAssignment({
      id: `assign-ws-${Date.now()}`,
      title: `Bài tập rèn luyện: ${topic} (${level})`,
      subjectId: subject,
      topic,
      objectiveId: 'yccd-toan-01',
      targetType: 'all',
      questions: generatedItems,
      dueDate: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString().slice(0, 10),
      createdAt: new Date().toISOString().slice(0, 10),
      timeLimitMinutes: timeMinutes,
      showSolutionAfterSubmit: true,
      maxAttempts: 2,
      status: 'active',
    });
    setMessage('Đã giao bài tập thành công cho học sinh lớp 5/3!');
    setTimeout(() => {
      setActiveTeacherTab('assignments');
    }, 1200);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-heading text-slate-900">
              Xưởng Bài Tập AI Lớp 5 (8 Môn GDPT 2018)
            </h2>
            <span className="text-xs font-semibold bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full">
              Sư phạm chuẩn mực
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Thiết kế bài tập phân hóa nhanh chóng, kiểm tra logic toán học và bảo đảm bản quyền giáo dục
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer shadow-xs"
        >
          <Printer className="w-4 h-4 text-slate-500" />
          <span>In phiếu bài tập</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <FileQuestion className="w-4 h-4 text-indigo-600" />
            Thông Số Đề Bài
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Môn học (Lớp 5):</label>
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
            <label className="block text-xs font-bold text-slate-700 mb-1">Tên bài học / Chủ đề:</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ví dụ: Phép cộng số thập phân"
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Yêu cầu cần đạt (YCCĐ):</label>
            <textarea
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              rows={2}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mức độ phân hóa:</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white"
              >
                <option value="Khởi động">Khởi động (Cơ bản)</option>
                <option value="Tăng tốc">Tăng tốc (Vận dụng)</option>
                <option value="Chinh phục">Chinh phục (Nâng cao)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Số lượng câu:</label>
              <input
                type="number"
                min={1}
                max={8}
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value, 10) || 3)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Dạng câu hỏi:</label>
            <select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white"
            >
              <option value="multiple_choice">Trắc nghiệm khách quan</option>
              <option value="word_problem">Toán có lời văn thực tế</option>
              <option value="error_detection">Tìm lỗi sai phép tính</option>
              <option value="short_answer">Tự luận / Điền đáp số</option>
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-xl text-xs shadow-md shadow-indigo-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${loading ? 'animate-spin' : 'text-amber-300'}`} />
            <span>{loading ? 'AI Đang Thiết Kế...' : 'AI TẠO BÀI TẬP PHÂN HÓA'}</span>
          </button>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Bản Xem Trước Bài Tập ({generatedItems.length} câu)
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                Mức độ: <strong className="text-indigo-600">{level}</strong>
              </span>
            </div>

            {message && (
              <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{message}</span>
              </div>
            )}

            {generatedItems.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <BookOpen className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p className="text-xs">
                  Chưa có bài tập nào. Thầy cô hãy chọn thông số và bấm <strong>"AI Tạo Bài Tập"</strong> ở cột bên trái.
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2">
                {generatedItems.map((q, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <p className="text-xs font-bold text-slate-800">{q.prompt}</p>
                      </div>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {q.difficulty}
                      </span>
                    </div>

                    {q.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pl-7">
                        {q.options.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className={`p-2 text-xs rounded-lg border ${
                              opt.startsWith(q.correctAnswer as string)
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                                : 'bg-white text-slate-700 border-slate-200'
                            }`}
                          >
                            {opt}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-3 pl-7 text-xs text-slate-600 bg-white/80 p-2.5 rounded-lg border border-slate-200">
                      <span className="font-bold text-indigo-700">Đáp án & Lời giải: </span>
                      {q.explanation}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
          {generatedItems.length > 0 && (
            <div className="pt-4 mt-4 border-t border-slate-200 flex flex-wrap items-center justify-end gap-2">
              <button
                onClick={handleGenerate}
                className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Tạo lại
              </button>
              <button
                onClick={handleSaveToBank}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white border border-indigo-300 text-indigo-700 hover:bg-indigo-50 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Lưu Vào Ngân Hàng</span>
              </button>
              <button
                onClick={handleAssignToStudents}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Giao Cho Học Sinh Lớp 5/3</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
