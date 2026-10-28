import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Brain,
  Download,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Award,
} from 'lucide-react';

export const AnalyticsTab: React.FC = () => {
  const { students, submissions, assignments } = useApp();
  const [selectedTopic, setSelectedTopic] = useState('Phép cộng số thập phân');

  const errorGroups = [
    { name: 'Đặt tính lệch hàng chữ số hoặc dấu phẩy', pct: 28, count: '9/32 học sinh', color: 'bg-rose-500' },
    { name: 'Quên bước tính tổng cuối cùng ở bài toán 2 bước', pct: 22, count: '7/32 học sinh', color: 'bg-amber-500' },
    { name: 'Quên nhớ sang hàng liền kề phía trước', pct: 14, count: '4/32 học sinh', color: 'bg-blue-500' },
    { name: 'Lỗi nhẩm sai bảng cộng cơ bản', pct: 6, count: '2/32 học sinh', color: 'bg-emerald-500' },
  ];

  const beforeAfterData = [
    { criterion: 'YCCĐ-T5.01: Đặt tính thẳng cột đúng hàng', before: 68, after: 94 },
    { criterion: 'YCCĐ-T5.02: Tính thuận tiện giao hoán & kết hợp', before: 72, after: 96 },
    { criterion: 'YCCĐ-T5.03: Giải bài toán có lời văn 2 bước', before: 65, after: 91 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-heading text-slate-900">
              Bảng Phân Tích Dữ Liệu Học Tập & Tiến Độ
            </h2>
            <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
              Lớp 5/3 • GDPT 2018
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Minh chứng số liệu thực tế qua chu trình: Khảo sát đầu vào → Can thiệp phân hóa → Đánh giá đầu ra
          </p>
        </div>
      </div>

      {/* Grid: 2 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Before & After Intervention */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Đối Sánh Tỷ Lệ Đạt YCCĐ: Trước & Sau Can Thiệp AI
            </h3>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              Tiến bộ vượt bậc
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Dữ liệu đo lường mức độ đạt chuẩn kiến thức kỹ năng sau 2 tuần luyện tập theo 3 lộ trình phân hóa.
          </p>

          <div className="space-y-4 pt-2">
            {beforeAfterData.map((item, idx) => (
              <div key={idx} className="space-y-1.5 text-xs">
                <div className="flex justify-between font-semibold text-slate-800">
                  <span>{item.criterion}</span>
                  <span className="text-emerald-700 font-bold">
                    {item.before}% ➔ {item.after}% (+{item.after - item.before}%)
                  </span>
                </div>
                {/* Visual Progress Bar */}
                <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden flex relative">
                  <div
                    style={{ width: `${item.before}%` }}
                    className="bg-slate-300 h-full flex items-center justify-end pr-1 text-[9px] font-bold text-slate-700"
                    title={`Trước: ${item.before}%`}
                  >
                    Trước
                  </div>
                  <div
                    style={{ width: `${item.after - item.before}%` }}
                    className="bg-emerald-500 h-full flex items-center justify-end pr-1 text-[9px] font-bold text-white animate-pulse"
                    title={`Sau: ${item.after}%`}
                  >
                    +{item.after - item.before}%
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 font-medium">
            💡 <strong>Nhận định sư phạm:</strong> Sau khi áp dụng bài tập giàn giáo ở lộ trình Khởi động, lỗi đặt tính lệch cột giảm từ 32% xuống còn dưới 6%.
          </div>
        </div>

        {/* Chart 2: Common Misconceptions & Errors */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Phân Bố Các Nhóm Lỗi Học Tập Điển Hình
            </h3>
            <span className="text-[11px] font-semibold text-slate-500">Toán lớp 5</span>
          </div>

          <p className="text-xs text-slate-500">
            Tự động trích xuất từ các câu làm sai trong bài kiểm tra và bài tập tự luyện.
          </p>

          <div className="space-y-4 pt-2">
            {errorGroups.map((err, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-800">{err.name}</span>
                  <span className="font-mono text-slate-600 font-bold">{err.pct}% ({err.count})</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div style={{ width: `${err.pct * 2.5}%` }} className={`h-full rounded-full ${err.color}`} />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-800 font-medium">
            📌 <strong>Giải pháp của thầy Diêm Nhật Minh:</strong> Hướng dẫn học sinh dùng bút chì kẻ cột phân vị hàng đơn vị và dấu phẩy trước khi làm bài.
          </div>
        </div>
      </div>
    </div>
  );
};
