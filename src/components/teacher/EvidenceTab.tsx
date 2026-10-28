import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CompetitionEvidence } from '../../types';
import {
  Award,
  FileText,
  Printer,
  Download,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Building,
  User,
  ExternalLink,
  PlusCircle,
  FileSpreadsheet,
} from 'lucide-react';

export const EvidenceTab: React.FC = () => {
  const { evidenceList, addEvidence } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const filtered = evidenceList.filter(
    (e) => activeCategory === 'ALL' || e.category === activeCategory
  );

  const handlePrintReport = () => {
    window.print();
  };

  const handleExportCsv = () => {
    const headers = ['Mã minh chứng', 'Tên minh chứng', 'Ngày thực hiện', 'Danh mục', 'Người xác nhận', 'Mô tả'];
    const rows = evidenceList.map((e) => [
      e.id,
      `"${e.title}"`,
      e.date,
      e.category,
      `"${e.verifiedBy}"`,
      `"${e.description.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Ho_so_minh_chung_AI_La_Ban_5_3_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-heading text-slate-900">
              Hồ Sơ Minh Chứng Dự Thi AI La Bàn 5/3
            </h2>
            <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
              Cuộc thi Giáo Dục AI 2026
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Minh chứng trung thực, có thời gian và chữ ký xác nhận của nhà trường – Tuyệt đối không suy diễn số liệu
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Xuất CSV</span>
          </button>
          <button
            onClick={handlePrintReport}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>In Báo Cáo Tổng Kết</span>
          </button>
        </div>
      </div>

      {/* Author & School Identity Badge Card */}
      <div className="bg-linear-to-r from-blue-50 via-indigo-50 to-teal-50 rounded-2xl p-4 border border-blue-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider block">
            THÔNG TIN TÁC GIẢ SÁNG KIẾN DỰ THI 2026
          </span>
          <div className="text-sm font-bold text-slate-900 mt-0.5">
            Giáo viên: Diêm Nhật Minh • SĐT: <span className="font-mono text-blue-700 font-bold">0917014180</span>
          </div>
          <div className="text-slate-600 mt-0.5">
            Trường: Tiểu học Kim Đồng • Lớp phụ trách: 5/3
          </div>
        </div>

        <div className="text-left md:text-right border-t md:border-t-0 pt-2 md:pt-0 border-blue-200/60">
          <span className="text-[11px] font-semibold text-slate-700 block">
            📍 207 Nguyễn Trung Trực, phường Rạch Giá, tỉnh An Giang
          </span>
          <span className="text-[10px] text-slate-500">
            Năm học triển khai: 2026 – 2027
          </span>
        </div>
      </div>

      {/* 9-Part Standard Competition Framework (As specified in prompt) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" />
          Khung Đề Cương Báo Cáo Sáng Kiến (9 Mục Chuẩn Cuộc Thi 2026)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-blue-700 block mb-1">1. Bối cảnh & Vấn đề</span>
            <p className="text-slate-600">Sĩ số lớp tiểu học đông, mức độ tiếp thu không đồng đều ở môn Toán lớp 5.</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-blue-700 block mb-1">2. Mục tiêu triển khai</span>
            <p className="text-slate-600">Mỗi học sinh một hành trình tiến bộ, không dán nhãn cố định theo GDPT 2018.</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-blue-700 block mb-1">3. Công cụ AI sử dụng</span>
            <p className="text-slate-600">Gemini 3.8-flash, hệ thống phân tích YCCĐ và chatbot Bạn La Bàn AI.</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-blue-700 block mb-1">4. Quy trình thực hiện</span>
            <p className="text-slate-600">Khảo sát → Phân tích → Gợi ý lộ trình → Giáo viên duyệt → Luyện tập → Điều chỉnh.</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-blue-700 block mb-1">5. Minh chứng triển khai</span>
            <p className="text-slate-600">Nhật ký 4 tuần, bài khảo sát, phản hồi học sinh và tổ chuyên môn khối 5.</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-blue-700 block mb-1">6. Phương pháp đánh giá</span>
            <p className="text-slate-600">Đánh giá thường xuyên kết hợp đối sánh trước/sau can thiệp phân hóa.</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-blue-700 block mb-1">7. Kết quả thu được</span>
            <p className="text-slate-600">Tỷ lệ đạt chuẩn tăng từ 68.7% lên 93.8%; 100% học sinh tự tin hơn.</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-blue-700 block mb-1">8. Hạn chế còn tồn tại</span>
            <p className="text-slate-600">Phụ thuộc đường truyền Internet gia đình; cần giám sát tự học buổi tối.</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-blue-700 block mb-1">9. Khả năng nhân rộng</span>
            <p className="text-slate-600">Áp dụng dễ dàng cho toàn khối 5 và các môn Tiếng Việt, Khoa học, Lịch sử - Địa lí.</p>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveCategory('ALL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            activeCategory === 'ALL' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Tất cả minh chứng ({evidenceList.length})
        </button>
        <button
          onClick={() => setActiveCategory('survey')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            activeCategory === 'survey' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Phiếu khảo sát
        </button>
        <button
          onClick={() => setActiveCategory('log')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            activeCategory === 'log' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Nhật ký triển khai
        </button>
        <button
          onClick={() => setActiveCategory('before_after')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            activeCategory === 'before_after' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Đối sánh trước/sau
        </button>
        <button
          onClick={() => setActiveCategory('feedback_student')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            activeCategory === 'feedback_student' ? 'bg-amber-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Phản hồi học sinh
        </button>
      </div>

      {/* Evidence Cards */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {item.id.toUpperCase()}
                </span>
                <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Ngày: {item.date}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>

            {item.metrics && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                {item.metrics.map((m, mIdx) => (
                  <div key={mIdx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-medium block">{m.label}</span>
                    <span className="text-xs font-bold text-slate-900 mt-0.5 block">{m.value}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 gap-2">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Xác nhận: {item.verifiedBy}</span>
              </div>
              <span className="italic">{item.notes}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
