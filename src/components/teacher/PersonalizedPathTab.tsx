import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student, LearningPathType } from '../../types';
import {
  TrendingUp,
  Target,
  Zap,
  Award,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Brain,
  ShieldCheck,
  Edit3,
  RotateCcw,
  BookOpen,
} from 'lucide-react';

export const PersonalizedPathTab: React.FC = () => {
  const { students, updateStudentPath, isDemoMode } = useApp();
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [editingNote, setEditingNote] = useState(false);
  const [teacherNoteInput, setTeacherNoteInput] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState('');

  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  const handleSelectPath = (path: LearningPathType, note?: string) => {
    if (!currentStudent) return;
    updateStudentPath(currentStudent.id, path, note || `Giáo viên phê duyệt chuyển sang lộ trình ${path}`);
    setFeedbackSuccess(`Đã cập nhật lộ trình thành công cho học sinh ${currentStudent.name}!`);
    setTimeout(() => setFeedbackSuccess(''), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-teal-700 via-indigo-800 to-blue-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-400 text-slate-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                CHỨC NĂNG TRỌNG TÂM CỐT LÕI
              </span>
              <span className="text-xs text-blue-200">Chuẩn GDPT 2018</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading">
              Động Cơ Cá Nhân Hóa Lộ Trình Học Tập AI
            </h1>
            <p className="text-sm text-blue-100 mt-1 max-w-2xl leading-relaxed">
              Phân luồng thích ứng dựa trên kết quả thực hiện từng Yêu cầu cần đạt. <strong>Tuyệt đối không gắn nhãn năng lực cố định</strong>, hỗ trợ chuyển đổi lộ trình linh hoạt sau mỗi nhiệm vụ.
            </p>
          </div>
        </div>
      </div>

      {/* Progress Flow Diagram (As specified in prompt) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 text-center">
          Sơ Đồ Tiến Trình Dạy Học Phân Hóa AI La Bàn 5/3
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-center text-xs">
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
            <span className="font-mono text-blue-600 font-bold block text-[10px]">BƯỚC 1</span>
            <span className="font-bold text-blue-900">KHẢO SÁT</span>
            <p className="text-[10px] text-slate-500 mt-1">Đánh giá theo YCCĐ</p>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200">
            <span className="font-mono text-indigo-600 font-bold block text-[10px]">BƯỚC 2</span>
            <span className="font-bold text-indigo-900">PHÂN TÍCH</span>
            <p className="text-[10px] text-slate-500 mt-1">Phát hiện rào cản lỗi</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
            <span className="font-mono text-amber-600 font-bold block text-[10px]">BƯỚC 3</span>
            <span className="font-bold text-amber-900">GỢI Ý LỘ TRÌNH</span>
            <p className="text-[10px] text-slate-500 mt-1">AI đề xuất 3 nhánh</p>
          </div>
          <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
            <span className="font-mono text-purple-600 font-bold block text-[10px]">BƯỚC 4</span>
            <span className="font-bold text-purple-900">LUYỆN TẬP</span>
            <p className="text-[10px] text-slate-500 mt-1">Bài tập & Trò chơi</p>
          </div>
          <div className="p-3 rounded-xl bg-teal-50 border border-teal-200">
            <span className="font-mono text-teal-600 font-bold block text-[10px]">BƯỚC 5</span>
            <span className="font-bold text-teal-900">PHẢN HỒI</span>
            <p className="text-[10px] text-slate-500 mt-1">Trợ lý La Bàn & GV</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="font-mono text-emerald-600 font-bold block text-[10px]">BƯỚC 6</span>
            <span className="font-bold text-emerald-900">ĐIỀU CHỈNH</span>
            <p className="text-[10px] text-slate-500 mt-1">Chuyển lộ trình mới</p>
          </div>
        </div>
      </div>

      {feedbackSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{feedbackSuccess}</span>
        </div>
      )}

      {/* Main Student Adaptation Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Student Selector */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Chọn Học Sinh Lớp 5/3 ({students.length})
          </h3>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {students.map((st) => (
              <button
                key={st.id}
                onClick={() => {
                  setSelectedStudentId(st.id);
                  setTeacherNoteInput(st.notes || '');
                }}
                className={`w-full p-3 rounded-xl text-left transition-all border flex items-center justify-between ${
                  currentStudent?.id === st.id
                    ? 'bg-blue-50 border-blue-400 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{st.avatar}</span>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{st.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{st.code}</div>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    st.currentPath === 'KHOI_DONG'
                      ? 'bg-amber-100 text-amber-800'
                      : st.currentPath === 'TANG_TOC'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-teal-100 text-teal-800'
                  }`}
                >
                  {st.currentPath === 'KHOI_DONG' && 'Khởi động'}
                  {st.currentPath === 'TANG_TOC' && 'Tăng tốc'}
                  {st.currentPath === 'CHINH_PHUC' && 'Chinh phục'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right (2/3): Adaptation Detail & Decision */}
        {currentStudent && (
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{currentStudent.avatar}</span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{currentStudent.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-mono font-bold text-blue-700">{currentStudent.code}</span>
                    <span>•</span>
                    <span>Lớp 5/3 (Năm học 2026-2027)</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 font-medium block">Lộ trình hiện hành:</span>
                <span
                  className={`inline-block font-extrabold text-sm px-3 py-1 rounded-full mt-1 ${
                    currentStudent.currentPath === 'KHOI_DONG'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : currentStudent.currentPath === 'TANG_TOC'
                      ? 'bg-blue-100 text-blue-900 border border-blue-300'
                      : 'bg-teal-100 text-teal-900 border border-teal-300'
                  }`}
                >
                  {currentStudent.currentPath === 'KHOI_DONG' && 'LỘ TRÌNH 1: KHỞI ĐỘNG'}
                  {currentStudent.currentPath === 'TANG_TOC' && 'LỘ TRÌNH 2: TĂNG TỐC'}
                  {currentStudent.currentPath === 'CHINH_PHUC' && 'LỘ TRÌNH 3: CHINH PHỤC'}
                </span>
              </div>
            </div>

            {/* AI Diagnostic Reasoning Grounded in GDPT 2018 */}
            <div className="p-4 bg-linear-to-r from-slate-50 to-blue-50/50 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-800 mb-2">
                <Brain className="w-4 h-4 text-blue-600" />
                <span>PHÂN TÍCH NHẬN THỨC VÀ KHUYẾN NGHỊ CỦA AI LA BÀN:</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {currentStudent.notes ||
                  'Học sinh đã hoàn thành các bài khảo sát định kỳ. AI ghi nhận sự tiến bộ đều đặn qua từng tuần học.'}
              </p>

              {currentStudent.currentPath === 'KHOI_DONG' && (
                <div className="mt-3 p-3 bg-amber-50 text-amber-900 text-xs rounded-xl border border-amber-200">
                  <strong>Khuyến nghị sư phạm: </strong>
                  Ưu tiên bài luyện đặt tính có giàn giáo ô lưới phân vị (hàng chục, hàng đơn vị, dấu phẩy, phần mười, phần trăm) để khắc phục lỗi lệch dấu phẩy. Khích lệ qua lời khen của Bạn La Bàn AI.
                </div>
              )}

              {currentStudent.currentPath === 'TANG_TOC' && (
                <div className="mt-3 p-3 bg-blue-50 text-blue-900 text-xs rounded-xl border border-blue-200">
                  <strong>Khuyến nghị sư phạm: </strong>
                  Kỹ năng tính toán cơ bản đã rất tốt. Đề xuất tăng cường bài toán có lời văn gắn với thực tế (mua bán siêu thị, tính chiều dài, cân nặng) để phát triển tư duy đọc hiểu đề bài.
                </div>
              )}

              {currentStudent.currentPath === 'CHINH_PHUC' && (
                <div className="mt-3 p-3 bg-teal-50 text-teal-900 text-xs rounded-xl border border-teal-200">
                  <strong>Khuyến nghị sư phạm: </strong>
                  Nắm chắc chuẩn kiến thức kỹ năng. Đề xuất các bài toán mở, tìm nhiều cách giải thuận tiện, và khuyến khích em tự biên soạn đề toán đố để thử thách các bạn trong nhóm.
                </div>
              )}
            </div>

            {/* Teacher Decision: 3 Path Switchers */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>Phê Duyệt / Điều Chỉnh Lộ Trình Cho Học Sinh (Quyền của Giáo Viên):</span>
                <span className="text-[11px] text-slate-400 font-normal">Thầy Diêm Nhật Minh toàn quyền quyết định</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Option 1: Khoi dong */}
                <button
                  onClick={() => handleSelectPath('KHOI_DONG')}
                  className={`p-4 rounded-xl text-left border-2 transition-all cursor-pointer ${
                    currentStudent.currentPath === 'KHOI_DONG'
                      ? 'border-amber-500 bg-amber-50/80 shadow-md ring-2 ring-amber-300'
                      : 'border-slate-200 hover:border-amber-300 bg-white'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-2">
                    <Target className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-slate-900">1. KHỞI ĐỘNG</div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Củng cố nền tảng, bài tập cơ bản có giàn giáo, khích lệ tự tin.
                  </p>
                  {currentStudent.currentPath === 'KHOI_DONG' && (
                    <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3" /> Đang áp dụng
                    </span>
                  )}
                </button>

                {/* Option 2: Tang toc */}
                <button
                  onClick={() => handleSelectPath('TANG_TOC')}
                  className={`p-4 rounded-xl text-left border-2 transition-all cursor-pointer ${
                    currentStudent.currentPath === 'TANG_TOC'
                      ? 'border-blue-500 bg-blue-50/80 shadow-md ring-2 ring-blue-300'
                      : 'border-slate-200 hover:border-blue-300 bg-white'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center mb-2">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-slate-900">2. TĂNG TỐC</div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Rèn luyện thực hành, tình huống đời sống, giải toán 1-2 bước.
                  </p>
                  {currentStudent.currentPath === 'TANG_TOC' && (
                    <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-blue-800 bg-blue-200/70 px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3" /> Đang áp dụng
                    </span>
                  )}
                </button>

                {/* Option 3: Chinh phuc */}
                <button
                  onClick={() => handleSelectPath('CHINH_PHUC')}
                  className={`p-4 rounded-xl text-left border-2 transition-all cursor-pointer ${
                    currentStudent.currentPath === 'CHINH_PHUC'
                      ? 'border-teal-500 bg-teal-50/80 shadow-md ring-2 ring-teal-300'
                      : 'border-slate-200 hover:border-teal-300 bg-white'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center mb-2">
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-slate-900">3. CHINH PHỤC</div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Vận dụng sáng tạo, toán tư duy mở rộng, giải thích nhiều cách.
                  </p>
                  {currentStudent.currentPath === 'CHINH_PHUC' && (
                    <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-teal-800 bg-teal-200/70 px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3" /> Đang áp dụng
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
