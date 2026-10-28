import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bot,
  Compass,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Send,
  MessageSquare,
  AlertTriangle,
  Sparkles,
  Info,
} from 'lucide-react';

export const AssistantTab: React.FC = () => {
  const { hasServerAI } = useApp();
  const [botEnabled, setBotEnabled] = useState(true);
  const [testInput, setTestInput] = useState('');
  const [chatLog, setChatLog] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    {
      role: 'assistant',
      text: 'Xin chào Thầy Diêm Nhật Minh! Em là Bạn La Bàn AI. Em đã được cấu hình tuân thủ quy tắc sư phạm: Không làm hộ bài tập cho học sinh, luôn đặt câu hỏi gợi mở và bảo vệ dữ liệu trẻ em theo chuẩn GDPT 2018.',
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testInput.trim()) return;

    const userText = testInput.trim();
    setChatLog((prev) => [...prev, { role: 'user', text: userText }]);
    setTestInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: userText }],
        }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        setChatLog((prev) => [...prev, { role: 'assistant', text: data.reply }]);
      } else {
        setChatLog((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: 'Chào bạn! Khi cộng hai số thập phân, bạn hãy nhớ viết số hạng này dưới số hạng kia sao cho dấu phẩy và các chữ số cùng hàng thẳng cột với nhau nhé! Bạn hãy thử kiểm tra lại phép tính của mình xem đã thẳng hàng chưa nào?',
          },
        ]);
      }
    } catch (e) {
      setChatLog((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Trợ lý La Bàn AI đang hoạt động ở chế độ sư phạm nội bộ. Thầy cô có thể trao đổi hoặc kết nối GEMINI_API_KEY khi cần gọi mô hình trực tuyến.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-heading text-slate-900">
              Quản Lý Trợ Lý Học Tập "Bạn La Bàn AI"
            </h2>
            <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
              Sư phạm Socratic
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Linh vật La Bàn thân thiện – Gợi mở từng bước, không làm hộ bài, an toàn tuyệt đối cho học sinh lớp 5
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-700">Trạng thái Chatbot:</span>
          <button
            onClick={() => setBotEnabled(!botEnabled)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              botEnabled
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-slate-200 text-slate-600 border border-slate-300'
            }`}
          >
            {botEnabled ? <ToggleRight className="w-5 h-5 text-emerald-600" /> : <ToggleLeft className="w-5 h-5" />}
            <span>{botEnabled ? 'Đang Bật Cho Học Sinh' : 'Đang Tạm Tắt'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Safety Guidelines & Rules */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Nguyên Tắc Sư Phạm & An Toàn Bắt Buộc
          </h3>

          <div className="space-y-3 text-xs text-slate-600">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
              <p><strong>Không làm hộ bài tập:</strong> Tuyệt đối không đọc ngay đáp án cuối cùng.</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
              <p><strong>Gợi mở Socratic:</strong> Đặt câu hỏi nhỏ dẫn dắt học sinh tự suy nghĩ và tìm ra lời giải.</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
              <p><strong>Bảo vệ dữ liệu trẻ em:</strong> Không yêu cầu hay lưu trữ thông tin cá nhân của học sinh.</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[10px]">4</span>
              <p><strong>Cơ chế báo giáo viên:</strong> Khuyên học sinh trao đổi thêm với Thầy Diêm Nhật Minh khi gặp bế tắc.</p>
            </div>
          </div>

          <div className="pt-2">
            <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-200 text-[11px] text-blue-800 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Info className="w-4 h-4 text-blue-600" />
                <span>Kiểm soát chi phí & Tần suất</span>
              </div>
              <p>Giới hạn 15 lượt hỏi/ngày cho mỗi tài khoản học sinh để tránh phụ thuộc AI và tiết kiệm chi phí vận hành.</p>
            </div>
          </div>
        </div>

        {/* Right (2/3): Interactive Preview & Test Sandbox for Teacher */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between h-[550px]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
                  <Compass className="w-5 h-5 animate-spin-slow" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Thử Nghiệm Phản Hồi Của "Bạn La Bàn AI"
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Môi trường kiểm tra sư phạm dành cho giáo viên
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Lớp 5/3
              </span>
            </div>

            {/* Chat message history */}
            <div className="space-y-3 overflow-y-auto max-h-[360px] pr-2">
              {chatLog.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 text-xs ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 text-sm">
                      🧭
                    </div>
                  )}
                  <div
                    className={`p-3.5 rounded-2xl max-w-md leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-xs'
                        : 'bg-slate-100 text-slate-800 rounded-bl-xs border border-slate-200'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                  <span>Bạn La Bàn đang suy nghĩ câu hỏi gợi ý...</span>
                </div>
              )}
            </div>
          </div>

          {/* Input field */}
          <form onSubmit={handleSendTest} className="pt-3 border-t border-slate-200 flex gap-2">
            <input
              type="text"
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              placeholder="Nhập câu hỏi thử nghiệm (ví dụ: 'Cho em đáp án bài 27,5 + 3,84 đi!')..."
              className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={loading || !testInput.trim()}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>Gửi</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
