import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Assignment, Submission } from '../../types';
import {
  Send,
  CheckCircle2,
  Clock,
  User,
  Check,
  AlertCircle,
  Eye,
  MessageSquare,
  Sparkles,
  Calendar,
  X,
} from 'lucide-react';

export const AssignmentsTab: React.FC = () => {
  const { assignments, submissions, students, verifySubmission } = useApp();
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [teacherFeedbackInput, setTeacherFeedbackInput] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleOpenReview = (sub: Submission) => {
    setSelectedSubmission(sub);
    setTeacherFeedbackInput(sub.feedback || '');
    setSaveSuccess(false);
  };

  const handleSaveReview = () => {
    if (!selectedSubmission) return;
    verifySubmission(selectedSubmission.id, true, teacherFeedbackInput);
    setSaveSuccess(true);
    setTimeout(() => {
      setSelectedSubmission(null);
      setSaveSuccess(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-heading text-slate-900">
              Giao Bài Và Chấm Điểm Thường Xuyên
            </h2>
            <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
              {assignments.length} nhiệm vụ • {submissions.length} bài đã nộp
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Chấm trắc nghiệm tự động – Giáo viên trực tiếp kiểm duyệt và xác nhận phản hồi sư phạm
          </p>
        </div>
      </div>

      {/* Grid: Active Assignments & Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of Assignments */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Danh Sách Nhiệm Vụ Đang Mở ({assignments.length})</span>
          </h3>

          <div className="space-y-3">
            {assignments.map((asg) => {
              const asgSubmissions = submissions.filter((s) => s.assignmentId === asg.id);
              return (
                <div key={asg.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900">{asg.title}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        asg.targetType === 'path'
                          ? asg.targetPath === 'KHOI_DONG'
                            ? 'bg-amber-100 text-amber-800'
                            : asg.targetPath === 'TANG_TOC'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-teal-100 text-teal-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {asg.targetType === 'path' ? `Lộ trình ${asg.targetPath}` : 'Toàn lớp 5/3'}
                    </span>
                  </div>

                  <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Hạn: {asg.dueDate}</span>
                    <span className="font-semibold text-slate-700">
                      {asgSubmissions.length} bài đã nộp
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right (2/3): Student Submissions Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
            <h3 className="text-base font-bold text-slate-900">
              Bài Nộp Của Học Sinh Cần Chấm & Phê Duyệt
            </h3>
            <span className="text-xs text-slate-500">
              {submissions.filter((s) => !s.teacherVerified).length} bài chờ duyệt
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Học Sinh</th>
                  <th className="py-3 px-3">Nhiệm Vụ</th>
                  <th className="py-3 px-3">Điểm Số</th>
                  <th className="py-3 px-3">Gợi Ý Lộ Trình AI</th>
                  <th className="py-3 px-3">Trạng Thái GV</th>
                  <th className="py-3 px-3 text-right">Xem & Duyệt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {submissions.map((sub) => {
                  const student = students.find((s) => s.id === sub.studentId);
                  const asg = assignments.find((a) => a.id === sub.assignmentId);
                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{student?.avatar || '👤'}</span>
                          <div>
                            <div className="font-bold text-slate-900">{student?.name || sub.studentCode}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{sub.studentCode}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 max-w-[180px] truncate text-slate-700">
                        {asg?.title || 'Bài tập Toán'}
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`font-mono font-bold text-xs ${
                            sub.percentage >= 80
                              ? 'text-emerald-700'
                              : sub.percentage >= 60
                              ? 'text-blue-700'
                              : 'text-amber-700'
                          }`}
                        >
                          {sub.totalScore}/{sub.maxScore} ({sub.percentage}%)
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            sub.recommendedPath === 'KHOI_DONG'
                              ? 'bg-amber-100 text-amber-800'
                              : sub.recommendedPath === 'TANG_TOC'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-teal-100 text-teal-800'
                          }`}
                        >
                          {sub.recommendedPath || 'Chưa xếp'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        {sub.teacherVerified ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <Check className="w-3 h-3 text-emerald-600" /> Đã xác nhận
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" /> Chờ GV duyệt
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={() => handleOpenReview(sub)}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs transition-colors cursor-pointer"
                        >
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Review & Grading Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
            <div className="p-5 bg-linear-to-r from-blue-700 to-indigo-700 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
                  CHI TIẾT BÀI LÀM CỦA HỌC SINH
                </span>
                <h3 className="text-base font-bold">
                  {students.find((s) => s.id === selectedSubmission.studentId)?.name} ({selectedSubmission.studentCode})
                </h3>
              </div>
              <button onClick={() => setSelectedSubmission(null)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 block">Kết quả tự động:</span>
                  <span className="text-base font-bold text-blue-700">
                    {selectedSubmission.totalScore} / {selectedSubmission.maxScore} điểm ({selectedSubmission.percentage}%)
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Thời gian nộp bài:</span>
                  <span className="font-medium text-slate-700">{selectedSubmission.submittedAt}</span>
                </div>
              </div>

              {/* Answers list */}
              <div>
                <h4 className="font-bold text-slate-800 mb-2">Câu trả lời của học sinh:</h4>
                <div className="space-y-2">
                  {selectedSubmission.answers.map((ans, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-xl border flex items-center justify-between ${
                        ans.isCorrect ? 'bg-emerald-50/70 border-emerald-200' : 'bg-rose-50/70 border-rose-200'
                      }`}
                    >
                      <div>
                        <span className="font-bold">Câu {i + 1}: </span>
                        <span>Đã chọn: <strong className="font-mono">{Array.isArray(ans.answer) ? ans.answer.join(', ') : ans.answer}</strong></span>
                      </div>
                      <span className={`font-bold ${ans.isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {ans.isCorrect ? '+2.5 điểm (Đúng)' : '0 điểm (Cần xem lại)'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Teacher Feedback input */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Nhận xét & Lời khuyên sư phạm của Thầy Diêm Nhật Minh:
                </label>
                <textarea
                  value={teacherFeedbackInput}
                  onChange={(e) => setTeacherFeedbackInput(e.target.value)}
                  placeholder="Ví dụ: Em hãy chú ý giữ dấu phẩy thẳng cột khi đặt tính nhé. Thầy tin em sẽ làm tốt hơn ở bài tiếp theo!"
                  rows={3}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {saveSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 font-bold rounded-xl border border-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Đã lưu nhận xét và chuyển phản hồi tới học sinh!</span>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-100"
              >
                Đóng
              </button>
              <button
                onClick={handleSaveReview}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Xác Nhận & Gửi Phản Hồi</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
