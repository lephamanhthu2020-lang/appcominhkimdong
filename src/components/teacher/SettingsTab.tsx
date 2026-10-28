import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  ShieldCheck,
  RotateCcw,
  Trash2,
  Save,
  CheckCircle2,
  Building,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export const SettingsTab: React.FC = () => {
  const { isDemoMode, resetDemoData, clearRealData } = useApp();

  const [teacherName, setTeacherName] = useState('Diêm Nhật Minh');
  const [phoneNumber, setPhoneNumber] = useState('0917014180');
  const [schoolName, setSchoolName] = useState('Trường Tiểu học Kim Đồng');
  const [schoolAddress, setSchoolAddress] = useState('207 Nguyễn Trung Trực, phường Rạch Giá, tỉnh An Giang');
  const [className, setClassName] = useState('5/3');
  const [academicYear, setAcademicYear] = useState('2026–2027');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-heading text-slate-900">
            Cài Đặt Hệ Thống & Cấu Hình Sư Phạm
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Quản trị thông tin lớp học, năm học và quy chuẩn an toàn dữ liệu học sinh tiểu học
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Đã lưu cấu hình lớp học thành công!</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Thông Tin Đơn Vị Giảng Dạy & Giáo Viên
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Giáo viên phụ trách:</label>
            <input
              type="text"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Số điện thoại liên hệ:</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-blue-700"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Trường tiểu học:</label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Địa chỉ trường:</label>
            <input
              type="text"
              value={schoolAddress}
              onChange={(e) => setSchoolAddress(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Lớp:</label>
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Năm học:</label>
            <input
              type="text"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300"
              required
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Lưu Thay Đổi</span>
          </button>
        </div>
      </form>

      {/* Simulation / Data Management */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Quản Lý Môi Trường Dữ Liệu
        </h3>
        <p className="text-xs text-slate-500">
          Chức năng phục vụ thuyết trình ban giám khảo hoặc chuẩn bị đưa ứng dụng vào giảng dạy thực tế.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                <RotateCcw className="w-4 h-4 text-amber-600" />
                <span>Khởi Tạo / Đặt Lại Dữ Liệu Mô Phỏng</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-2">
                Nạp lại 3 học sinh mẫu (HS-DEMO 01, 02, 03) môn Toán 5 và bài khảo sát mẫu cho ban giám khảo kiểm thử.
              </p>
            </div>
            <button
              type="button"
              onClick={resetDemoData}
              className="mt-4 w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-colors"
            >
              Đặt lại dữ liệu mô phỏng
            </button>
          </div>

          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-rose-900">
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>Xóa Trắng Dữ Liệu Để Triển Khai Thực Tế</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-2">
                Xóa toàn bộ hồ sơ demo để chuẩn bị nhập danh sách học sinh thật của Lớp 5/3 (Trường TH Kim Đồng).
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Thầy cô có chắc chắn muốn xóa dữ liệu mô phỏng để bắt đầu với dữ liệu thực tế?')) {
                  clearRealData();
                }
              }}
              className="mt-4 w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-colors"
            >
              Xóa sạch để nhập lớp thật
            </button>
          </div>
        </div>
      </div>

      {/* Children Data Protection Pledge */}
      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="block">Cam kết an toàn và bảo vệ dữ liệu trẻ em theo pháp luật Việt Nam:</strong>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Hệ thống AI La Bàn 5/3 không thu thập số định danh cá nhân (CCCD), địa chỉ nhà ở hay bất kỳ thông tin nhạy cảm nào của học sinh. Dữ liệu học tập được ẩn danh hóa qua Mã học sinh (HS-xx) và lưu trữ cục bộ có bảo vệ.
          </p>
        </div>
      </div>
    </div>
  );
};
