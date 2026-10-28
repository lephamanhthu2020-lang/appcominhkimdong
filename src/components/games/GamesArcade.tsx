import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Gamepad2,
  Bell,
  RotateCw,
  Layers,
  Flag,
  Search,
  MapPin,
  Trophy,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Volume2,
} from 'lucide-react';

export type GameId =
  | 'rung_chuong_vang'
  | 'vong_quay'
  | 'ghep_cap'
  | 'vuot_chuong_ngai_vat'
  | 'truy_tim_loi_sai'
  | 'nha_tham_hiem';

interface GamesArcadeProps {
  onScoreEarned?: (score: number) => void;
  isStudentMode?: boolean;
}

export const GamesArcade: React.FC<GamesArcadeProps> = ({
  onScoreEarned,
  isStudentMode = false,
}) => {
  const [activeGame, setActiveGame] = useState<GameId | null>(null);

  const gameList = [
    {
      id: 'rung_chuong_vang' as GameId,
      title: '1. AI Rung Chuông Vàng',
      desc: 'Trả lời nhanh trước khi đồng hồ đếm ngược hết giờ. Ai sẽ rung được chuông vàng?',
      icon: Bell,
      color: 'from-amber-500 to-yellow-600',
      badge: 'Đua thời gian',
    },
    {
      id: 'vong_quay' as GameId,
      title: '2. Vòng Quay Kiến Thức',
      desc: 'Quay vòng tròn may mắn chọn chủ đề câu hỏi thử thách Toán và Khoa học.',
      icon: RotateCw,
      color: 'from-blue-600 to-indigo-600',
      badge: 'Bất ngờ thú vị',
    },
    {
      id: 'ghep_cap' as GameId,
      title: '3. AI Ghép Cặp Thông Minh',
      desc: 'Ghép phép tính số thập phân với kết quả đúng tương ứng để mở khóa ô ảnh bí mật.',
      icon: Layers,
      color: 'from-emerald-600 to-teal-600',
      badge: 'Tư duy logic',
    },
    {
      id: 'vuot_chuong_ngai_vat' as GameId,
      title: '4. Vượt Chướng Ngại Vật',
      desc: 'Mỗi câu trả lời chính xác giúp em nhảy qua một rào cản để về đích nhanh nhất.',
      icon: Flag,
      color: 'from-rose-500 to-red-600',
      badge: 'Chinh phục chặng đua',
    },
    {
      id: 'truy_tim_loi_sai' as GameId,
      title: '5. AI Truy Tìm Lỗi Sai',
      desc: 'Hóa thân thành thám tử phát hiện và sửa lỗi đặt tính hoặc logic phép toán.',
      icon: Search,
      color: 'from-purple-600 to-pink-600',
      badge: 'Thám tử toán học',
    },
    {
      id: 'nha_tham_hiem' as GameId,
      title: '6. Nhà Thám Hiểm Tri Thức',
      desc: 'Du hành qua bản đồ 5 trạm học tập kỳ thú để thu thập huy hiệu vàng.',
      icon: MapPin,
      color: 'from-cyan-600 to-blue-700',
      badge: 'Bản đồ khám phá',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      {!activeGame && (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-heading text-slate-900">
                  Thư Viện Trò Chơi Học Tập Tương Tác
                </h2>
                <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                  6 Trò Chơi Sư Phạm
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Điểm thưởng chỉ có tính động viên, học qua chơi – Không tạo áp lực so sánh bêu tên học sinh
              </p>
            </div>
          </div>

          {/* Game Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {gameList.map((g) => {
              const Icon = g.icon;
              return (
                <div
                  key={g.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-linear-to-tr ${g.color} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        {g.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">{g.title}</h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">{g.desc}</p>
                  </div>

                  <button
                    onClick={() => setActiveGame(g.id)}
                    className="w-full mt-5 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Bắt Đầu Chơi</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Render Active Game */}
      {activeGame && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
            <button
              onClick={() => setActiveGame(null)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              ← Trở về danh sách trò chơi
            </button>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Lớp 5/3 • GDPT 2018
            </span>
          </div>

          {activeGame === 'rung_chuong_vang' && <RungChuongVangView />}
          {activeGame === 'vong_quay' && <VongQuayView />}
          {activeGame === 'ghep_cap' && <GhepCapView />}
          {activeGame === 'vuot_chuong_ngai_vat' && <VuotChuongNgaiVatView />}
          {activeGame === 'truy_tim_loi_sai' && <TruyTimLoiSaiView />}
          {activeGame === 'nha_tham_hiem' && <NhaThamHiemView />}
        </div>
      )}
    </div>
  );
};

// 1. Rung Chuông Vàng Mini-Component
const RungChuongVangView: React.FC = () => {
  const questions = [
    {
      q: 'Kết quả của phép cộng 18,25 + 4,75 là bao nhiêu?',
      opts: ['A. 22', 'B. 23', 'C. 23,10', 'D. 22,90'],
      ans: 'B',
      exp: '18,25 + 4,75: 0,25 + 0,75 = 1; 18 + 4 + 1 = 23.',
    },
    {
      q: 'Để cộng hai số thập phân, ta phải đặt các chữ số ở cùng một hàng...',
      opts: ['A. Lệch nhau một chữ số', 'B. Thẳng cột với nhau', 'C. Tùy ý', 'D. Gấp đôi nhau'],
      ans: 'B',
      exp: 'Quy tắc SGK Toán lớp 5: Viết số hạng này dưới số hạng kia sao cho các chữ số ở cùng một hàng đặt thẳng cột với nhau.',
    },
    {
      q: 'Tính: 0,8 + 0,25 = ?',
      opts: ['A. 0,33', 'B. 1,05', 'C. 0,105', 'D. 0,258'],
      ans: 'B',
      exp: '0,80 + 0,25 = 1,05.',
    },
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (isFinished || selectedOpt !== null) return;
    if (timeLeft <= 0) {
      handleAnswer('');
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isFinished, selectedOpt]);

  const handleAnswer = (optLetter: string) => {
    setSelectedOpt(optLetter);
    if (optLetter === questions[currentIdx].ans) {
      setScore((s) => s + 10);
      try {
        confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  const nextQuestion = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((i) => i + 1);
      setSelectedOpt(null);
      setTimeLeft(15);
    } else {
      setIsFinished(true);
      try {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      } catch (e) {}
    }
  };

  if (isFinished) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto text-3xl">
          🔔
        </div>
        <h3 className="text-2xl font-extrabold text-slate-900">CHÚC MỪNG EM ĐÃ RUNG CHUÔNG VÀNG!</h3>
        <p className="text-sm text-slate-600">
          Điểm động viên của em: <strong className="text-amber-600 text-lg">{score} điểm</strong>
        </p>
        <button
          onClick={() => {
            setCurrentIdx(0);
            setSelectedOpt(null);
            setTimeLeft(15);
            setScore(0);
            setIsFinished(false);
          }}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs"
        >
          Chơi lại
        </button>
      </div>
    );
  }

  const q = questions[currentIdx];

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
          Câu {currentIdx + 1} / {questions.length}
        </span>
        <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
          ⏱️ {timeLeft}s
        </div>
        <span className="text-xs font-bold text-slate-700">Điểm: {score}</span>
      </div>

      <div className="p-5 bg-amber-50/60 rounded-2xl border border-amber-200 text-center">
        <p className="text-base font-bold text-slate-900">{q.q}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {q.opts.map((opt) => {
          const letter = opt.substring(0, 1);
          const isSelected = selectedOpt === letter;
          const isCorrect = letter === q.ans;
          let btnClass = 'bg-white border-slate-200 hover:border-amber-400 text-slate-800';

          if (selectedOpt !== null) {
            if (isCorrect) btnClass = 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold';
            else if (isSelected) btnClass = 'bg-rose-100 border-rose-400 text-rose-900';
          }

          return (
            <button
              key={opt}
              disabled={selectedOpt !== null}
              onClick={() => handleAnswer(letter)}
              className={`p-3.5 rounded-xl border text-xs text-left font-semibold transition-all cursor-pointer ${btnClass}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {selectedOpt !== null && (
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
          <p>
            <strong className="text-blue-700">Giải thích: </strong>
            {q.exp}
          </p>
          <div className="text-right">
            <button
              onClick={nextQuestion}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
            >
              Tiếp theo →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// 2. Vòng Quay Kiến Thức
const VongQuayView: React.FC = () => {
  const topics = [
    { title: 'Đặt tính số thập phân', q: '3,5 + 2,1 = ?', ans: '5,6' },
    { title: 'Tính chất giao hoán', q: 'a + b = ... ?', ans: 'b + a' },
    { title: 'Đổi đơn vị đo', q: '1,5 m = ... dm?', ans: '15 dm' },
    { title: 'Toán thực tế', q: 'Bút 3,5 nghìn + vở 6,5 nghìn = ?', ans: '10 nghìn đồng' },
    { title: 'Tính nhanh', q: '1,25 + 0,75 = ?', ans: '2' },
    { title: 'Khám phá khoa học', q: 'Nguồn điện phổ biến trong gia đình là?', ans: 'Điện lưới 220V' },
  ];

  const [spinning, setSpinning] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<any>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);
    setSelectedTopic(null);
    setShowAnswer(false);

    setTimeout(() => {
      const randomIdx = Math.floor(Math.random() * topics.length);
      setSelectedTopic(topics[randomIdx]);
      setSpinning(false);
      try {
        confetti({ particleCount: 40, spread: 50 });
      } catch (e) {}
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto text-center space-y-6">
      <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
        <div
          className={`w-44 h-44 rounded-full border-8 border-indigo-500 bg-linear-to-tr from-amber-400 via-rose-400 to-blue-400 shadow-xl flex items-center justify-center text-white font-bold text-center p-4 transition-transform duration-1000 ${
            spinning ? 'rotate-[720deg]' : ''
          }`}
        >
          <RotateCw className="w-12 h-12 text-white/90" />
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-6 bg-red-600 rounded-b-md shadow-md z-10" />
      </div>

      <button
        disabled={spinning}
        onClick={handleSpin}
        className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
      >
        {spinning ? 'ĐANG QUAY...' : 'QUAY VÒNG KIẾN THỨC'}
      </button>

      {selectedTopic && (
        <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-200 text-left space-y-2 animate-in fade-in">
          <span className="text-[10px] font-bold text-indigo-700 uppercase bg-indigo-100 px-2 py-0.5 rounded">
            Chủ đề: {selectedTopic.title}
          </span>
          <p className="text-xs font-bold text-slate-900 mt-1">{selectedTopic.q}</p>
          {showAnswer ? (
            <p className="text-xs font-bold text-emerald-700 bg-white p-2 rounded-lg border border-emerald-200">
              Đáp án: {selectedTopic.ans}
            </p>
          ) : (
            <button
              onClick={() => setShowAnswer(true)}
              className="text-xs font-bold text-blue-600 hover:underline block pt-1"
            >
              Xem đáp án gợi ý →
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// 3. AI Ghép Cặp Thông Minh
const GhepCapView: React.FC = () => {
  const pairs = [
    { id: 1, left: '12,4 + 5,6', right: '18' },
    { id: 2, left: '3,75 + 2,25', right: '6' },
    { id: 3, left: '9,8 + 0,25', right: '10,05' },
    { id: 4, left: '15,1 + 4,09', right: '19,19' },
  ];

  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [matched, setMatched] = useState<number[]>([]);

  const handleLeftClick = (id: number) => {
    if (matched.includes(id)) return;
    setSelectedLeft(id);
  };

  const handleRightClick = (id: number) => {
    if (matched.includes(id) || selectedLeft === null) return;
    if (selectedLeft === id) {
      setMatched((m) => [...m, id]);
      setSelectedLeft(null);
      if (matched.length + 1 === pairs.length) {
        try {
          confetti({ particleCount: 60, spread: 70 });
        } catch (e) {}
      }
    } else {
      setSelectedLeft(null);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div className="text-center">
        <h3 className="text-sm font-bold text-slate-800">Ghép Phép Tính Với Kết Quả Đúng</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Nhấn vào ô phép tính bên trái, sau đó nhấn vào kết quả tương ứng bên phải.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Left column */}
        <div className="space-y-2">
          {pairs.map((p) => {
            const isMatched = matched.includes(p.id);
            const isSelected = selectedLeft === p.id;
            return (
              <button
                key={p.id}
                disabled={isMatched}
                onClick={() => handleLeftClick(p.id)}
                className={`w-full p-3 rounded-xl border text-xs font-bold transition-all ${
                  isMatched
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300 opacity-60'
                    : isSelected
                    ? 'bg-amber-100 text-amber-900 border-amber-400 ring-2 ring-amber-300'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                {p.left} {isMatched && '✓'}
              </button>
            );
          })}
        </div>

        {/* Right column */}
        <div className="space-y-2">
          {[pairs[2], pairs[0], pairs[3], pairs[1]].map((p) => {
            const isMatched = matched.includes(p.id);
            return (
              <button
                key={p.id}
                disabled={isMatched}
                onClick={() => handleRightClick(p.id)}
                className={`w-full p-3 rounded-xl border text-xs font-bold transition-all ${
                  isMatched
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300 opacity-60'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                {p.right} {isMatched && '✓'}
              </button>
            );
          })}
        </div>
      </div>

      {matched.length === pairs.length && (
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center text-xs font-bold text-emerald-800">
          🎉 Xuất sắc! Em đã ghép đúng toàn bộ 4 cặp phép tính số thập phân!
        </div>
      )}
    </div>
  );
};

// 4. Vượt Chướng Ngại Vật
const VuotChuongNgaiVatView: React.FC = () => {
  const hurdles = [
    { step: 1, label: 'Rào 1: Đặt tính', q: '3,2 + 1,5 = ?', ans: '4,7' },
    { step: 2, label: 'Rào 2: Nhớ sang hàng đơn vị', q: '4,8 + 2,7 = ?', ans: '7,5' },
    { step: 3, label: 'Rào 3: Độ dài phần thập phân khác nhau', q: '6,4 + 1,25 = ?', ans: '7,65' },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [userAns, setUserAns] = useState('');
  const [msg, setMsg] = useState('');

  const handleCheck = () => {
    if (userAns.trim().replace(',', '.') === hurdles[currentStep].ans.replace(',', '.')) {
      setMsg('Chính xác! Em đã vượt qua chướng ngại vật!');
      try {
        confetti({ particleCount: 30, spread: 50 });
      } catch (e) {}
      setTimeout(() => {
        if (currentStep + 1 < hurdles.length) {
          setCurrentStep((s) => s + 1);
          setUserAns('');
          setMsg('');
        } else {
          setMsg('VỀ ĐÍCH THÀNH CÔNG! 🏆');
        }
      }, 1000);
    } else {
      setMsg('Chưa chính xác, em hãy kiểm tra lại phép tính nhé!');
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-5 text-center">
      <div className="flex items-center justify-between px-2">
        {hurdles.map((h, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                i < currentStep
                  ? 'bg-emerald-500 text-white'
                  : i === currentStep
                  ? 'bg-rose-500 text-white animate-bounce'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              🏃
            </div>
            <span className="text-[10px] text-slate-500 mt-1">{h.label}</span>
          </div>
        ))}
      </div>

      {currentStep < hurdles.length ? (
        <div className="p-5 bg-rose-50/60 rounded-2xl border border-rose-200 space-y-3">
          <p className="text-sm font-bold text-slate-900">{hurdles[currentStep].q}</p>
          <input
            type="text"
            value={userAns}
            onChange={(e) => setUserAns(e.target.value)}
            placeholder="Nhập kết quả..."
            className="w-full text-center font-mono text-sm px-3 py-2 rounded-xl border border-slate-300"
          />
          <button
            onClick={handleCheck}
            className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl"
          >
            Nhảy qua rào chắn!
          </button>
          {msg && <p className="text-xs font-bold text-rose-700">{msg}</p>}
        </div>
      ) : (
        <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 font-bold text-sm">
          🏆 CHÚC MỪNG EM ĐÃ VƯỢT TOÀN BỘ CHƯỚNG NGẠI VẬT XUẤT SẮC!
        </div>
      )}
    </div>
  );
};

// 5. AI Truy Tìm Lỗi Sai
const TruyTimLoiSaiView: React.FC = () => {
  const [selectedFix, setSelectedFix] = useState<string | null>(null);

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="text-center">
        <h3 className="text-sm font-bold text-slate-900">Vụ Án Phép Tính: "45,2 + 3,18 = 7,70"</h3>
        <p className="text-xs text-slate-500">
          Em hãy đóng vai thám tử tìm xem bạn học sinh đã mắc phải lỗi sai nhận thức nào nhé!
        </p>
      </div>

      <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 font-mono text-xs text-center space-y-1">
        <div>&nbsp;&nbsp;45,2</div>
        <div>+&nbsp;&nbsp;3,18&nbsp;(chữ số 8 viết thẳng chữ số 2)</div>
        <div className="border-t border-purple-300 pt-1">-------</div>
        <div className="text-rose-600 font-bold">&nbsp;&nbsp;7,70&nbsp;(SAI)</div>
      </div>

      <div className="space-y-2 text-xs">
        {[
          { label: 'A. Bạn đã cộng sai phép tính nhẩm', correct: false },
          { label: 'B. Bạn chưa đặt dấu phẩy và các hàng cùng tên thẳng cột với nhau', correct: true },
          { label: 'C. Phép tính không có lỗi gì', correct: false },
        ].map((item, i) => (
          <button
            key={i}
            onClick={() => setSelectedFix(item.correct ? 'correct' : 'wrong')}
            className="w-full p-3 rounded-xl border border-slate-200 text-left font-semibold hover:bg-slate-50 text-slate-800 transition-colors"
          >
            {item.label}
          </button>
        ))}
      </div>

      {selectedFix === 'correct' && (
        <div className="p-4 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200 text-xs font-bold space-y-1">
          <div>🔍 Thám tử xuất sắc! Em đã tìm đúng lỗi sai!</div>
          <div className="font-normal text-slate-600">
            Đặt đúng: 45,20 + 03,18 = <strong>48,38</strong>.
          </div>
        </div>
      )}

      {selectedFix === 'wrong' && (
        <div className="p-3 bg-rose-50 text-rose-800 rounded-xl text-xs font-medium">
          Chưa đúng, em hãy quan sát kỹ xem dấu phẩy và vị trí các hàng chữ số có thẳng hàng không nhé!
        </div>
      )}
    </div>
  );
};

// 6. Nhà Thám Hiểm Tri Thức
const NhaThamHiemView: React.FC = () => {
  const stations = [
    { id: 1, name: 'Trạm 1: Cổng Trường Kim Đồng', done: true },
    { id: 2, name: 'Trạm 2: Vườn Cây Tri Thức', done: true },
    { id: 3, name: 'Trạm 3: Thư Viện La Bàn', done: true },
    { id: 4, name: 'Trạm 4: Đỉnh Núi Toán Học', done: false },
    { id: 5, name: 'Trạm 5: Ngọn Hải Đăng Thành Công', done: false },
  ];

  return (
    <div className="max-w-md mx-auto space-y-5">
      <div className="text-center">
        <h3 className="text-sm font-bold text-slate-900">Bản Đồ Thám Hiểm Lớp 5/3</h3>
        <p className="text-xs text-slate-500">Hoàn thành nhiệm vụ ở mỗi trạm để thắp sáng huy hiệu</p>
      </div>

      <div className="space-y-3">
        {stations.map((s) => (
          <div
            key={s.id}
            className={`p-3.5 rounded-xl border flex items-center justify-between ${
              s.done ? 'bg-cyan-50/70 border-cyan-300' : 'bg-slate-50 border-slate-200 opacity-60'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{s.done ? '🧭' : '🔒'}</span>
              <span className="text-xs font-bold text-slate-800">{s.name}</span>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                s.done ? 'bg-cyan-100 text-cyan-800' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {s.done ? 'Đã hoàn thành' : 'Chưa mở'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
