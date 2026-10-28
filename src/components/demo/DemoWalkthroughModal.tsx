import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  CheckCircle,
  ArrowRight,
  RotateCcw,
  User,
  GraduationCap,
  BookOpen,
  Compass,
  FileSpreadsheet,
  ChevronRight,
  X,
} from 'lucide-react';

interface DemoWalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoWalkthroughModal: React.FC<DemoWalkthroughModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    loginAsTeacher,
    loginAsStudent,
    setActiveTeacherTab,
    resetDemoData,
  } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);

  if (!isOpen) return null;

  const steps = [
    {
      step: 1,
      title: 'Khảo sát năng lực Toán lớp 5',
      desc: 'Giáo viên thiết lập bài khảo sát chủ đề "Phép cộng số thập phân" gắn 3 Yêu cầu cần đạt (YCCĐ-T5.01, 02, 03).',
      actionLabel: 'Xem Bài Khảo Sát (GV)',
      action: () => {
        loginAsTeacher();
        setActiveTeacherTab('diagnostic');
        onClose();
      },
    },
    {
      step: 2,
      title: 'Bộ ba học sinh mẫu (HS-DEMO 01, 02, 03)',
      desc: '3 hồ sơ ẩn danh với các đặc điểm nhận thức đặc trưng của học sinh lớp 5: Hay nhầm dấu phẩy (01), nắm chắc cơ bản (02), tư duy vượt trội (03).',
      actionLabel: 'Xem Hồ Sơ Học Sinh',
      action: () => {
        loginAsTeacher();
        setActiveTeacherTab('students');
        onClose();
      },
    },
    {
      step: 3,
      title: 'Bộ câu trả lời & Phân tích sai sót',
      desc: 'Hệ thống tự động chấm trắc nghiệm và phát hiện các rào cản nhận thức (lệch hàng chữ số, quên nhớ số thập phân).',
      actionLabel: 'Xem Bài Đã Nộp & Chấm Bài',
      action: () => {
        loginAsTeacher();
        setActiveTeacherTab('assignments');
        onClose();
      },
    },
    {
      step: 4,
      title: 'Đề xuất 3 Lộ trình cá nhân hóa',
      desc: 'AI phân tích và xếp 3 học sinh vào: KHỞI ĐỘNG (HS-01), TĂNG TỐC (HS-02), CHINH PHỤC (HS-03) dựa trên YCCĐ thực tế.',
      actionLabel: 'Xem Lộ Trình Phân Hóa',
      action: () => {
        loginAsTeacher();
        setActiveTeacherTab('paths');
        onClose();
      },
    },
    {
      step: 5,
      title: 'Giáo viên phê duyệt & Tùy biến',
      desc: 'Thầy Diêm Nhật Minh kiểm tra sư phạm, điều chỉnh hoặc phê duyệt nhiệm vụ do AI gợi ý trước khi giao.',
      actionLabel: 'Phê Duyệt Lộ Trình',
      action: () => {
        loginAsTeacher();
        setActiveTeacherTab('paths');
        onClose();
      },
    },
    {
      step: 6,
      title: 'Học sinh trải nghiệm học tập (Góc Học Sinh)',
      desc: 'Vào vai học sinh Lê Gia Huy (HS-DEMO-01) nhận nhiệm vụ Khởi động có trợ lý Bạn La Bàn AI gợi mở từng bước.',
      actionLabel: 'Đăng Nhập HS-DEMO-01',
      action: () => {
        loginAsStudent('HS-DEMO-01');
        onClose();
      },
    },
    {
      step: 7,
      title: 'Trò chơi tương tác ôn luyện',
      desc: 'Học sinh tham gia 6 trò chơi sư phạm: Rung chuông vàng, Vòng quay kiến thức, Vượt chướng ngại vật, Ghép cặp...',
      actionLabel: 'Khám Phá Trò Chơi',
      action: () => {
        loginAsStudent('HS-DEMO-01');
        onClose();
      },
    },
    {
      step: 8,
      title: 'Cập nhật tiến bộ thời gian thực',
      desc: 'Khi học sinh hoàn thành nhiệm vụ, điểm số và mức độ đạt YCCĐ cập nhật ngay vào bảng theo dõi của giáo viên.',
      actionLabel: 'Xem Biểu Đồ Thống Kê',
      action: () => {
        loginAsTeacher();
        setActiveTeacherTab('analytics');
        onClose();
      },
    },
    {
      step: 9,
      title: 'Hồ sơ minh chứng dự thi 2026',
      desc: 'Toàn bộ nhật ký, bảng đối sánh trước/sau can thiệp, khảo sát học sinh được tổng hợp sẵn sàng xuất báo cáo.',
      actionLabel: 'Xem Hồ Sơ Minh Chứng',
      action: () => {
        loginAsTeacher();
        setActiveTeacherTab('evidence');
        onClose();
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="p-5 bg-linear-to-r from-blue-700 via-indigo-700 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
              <Compass className="w-6 h-6 text-yellow-300 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-bold bg-amber-400 text-slate-900 px-2 py-0.5 rounded-full">
                  KỊCH BẢN GIÁM KHẢO
                </span>
                <span className="text-xs text-blue-200 font-mono">Toán Lớp 5</span>
              </div>
              <h2 className="text-lg font-bold">Chu trình Khảo sát – Phân hóa – Tiến bộ</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning label */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-800 flex items-center justify-between">
          <span className="font-semibold">
            ⚠️ DỮ LIỆU MÔ PHỎNG – KHÔNG PHẢI KẾT QUẢ TRIỂN KHAI THỰC TẾ
          </span>
          <button
            onClick={() => {
              resetDemoData();
              setCurrentStep(1);
            }}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-200/70 hover:bg-amber-200 px-2 py-1 rounded transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Đặt lại kịch bản
          </button>
        </div>

        {/* Stepper overview */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 overflow-x-auto flex items-center gap-1">
          {steps.map((s) => (
            <button
              key={s.step}
              onClick={() => setCurrentStep(s.step)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                currentStep === s.step
                  ? 'bg-blue-600 text-white shadow-xs'
                  : currentStep > s.step
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-white text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <span>{s.step}.</span>
              <span className="hidden sm:inline">{s.title.split(':')[0]}</span>
            </button>
          ))}
        </div>

        {/* Step Detail Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {(() => {
            const current = steps[currentStep - 1];
            return (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    Bước {current.step} / 9
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Chủ đề: Phép cộng số thập phân (Lớp 5/3)
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900">{current.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {current.desc}
                </p>

                {/* Specific highlight for this step */}
                {current.step === 4 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-left">
                      <div className="text-xs font-bold text-amber-800 uppercase">1. Khởi Động</div>
                      <div className="text-sm font-semibold text-slate-800 mt-1">HS-DEMO-01</div>
                      <p className="text-xs text-slate-600 mt-1">Luyện đặt tính thẳng cột & bảng con hỗ trợ.</p>
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-left">
                      <div className="text-xs font-bold text-blue-800 uppercase">2. Tăng Tốc</div>
                      <div className="text-sm font-semibold text-slate-800 mt-1">HS-DEMO-02</div>
                      <p className="text-xs text-slate-600 mt-1">Bài toán lời văn thực tế đời sống 2 bước.</p>
                    </div>
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-left">
                      <div className="text-xs font-bold text-emerald-800 uppercase">3. Chinh Phục</div>
                      <div className="text-sm font-semibold text-slate-800 mt-1">HS-DEMO-03</div>
                      <p className="text-xs text-slate-600 mt-1">Thử thách mở rộng & giải thích nhiều cách tính.</p>
                    </div>
                  </div>
                )}

                {current.step === 6 && (
                  <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">👦</span>
                      <div>
                        <div className="text-xs font-bold text-blue-900">Lê Gia Huy (Mã: HS-DEMO-01)</div>
                        <div className="text-xs text-blue-700">Đang ở Lộ trình Khởi động • Điểm khảo sát: 25%</div>
                      </div>
                    </div>
                    <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-1 rounded">
                      Cần hỗ trợ đặt tính
                    </span>
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              disabled={currentStep === 1}
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors"
            >
              Quay lại
            </button>
            <button
              disabled={currentStep === steps.length}
              onClick={() => setCurrentStep((prev) => Math.min(steps.length, prev + 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors"
            >
              Bước tiếp
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={steps[currentStep - 1].action}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <span>{steps[currentStep - 1].actionLabel}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
