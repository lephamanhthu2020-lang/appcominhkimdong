import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student, LearningPathType } from '../../types';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  Upload,
  Edit2,
  Trash2,
  Award,
  CheckCircle,
  Clock,
  ShieldCheck,
  ChevronRight,
  X,
  FileSpreadsheet,
} from 'lucide-react';

export const StudentsTab: React.FC = () => {
  const { students, addStudent, updateStudent, deleteStudent, isDemoMode } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [pathFilter, setPathFilter] = useState<'ALL' | LearningPathType>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // New student form state
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newGender, setNewGender] = useState<'Nam' | 'Nữ'>('Nam');
  const [newPath, setNewPath] = useState<LearningPathType>('KHOI_DONG');
  const [newNotes, setNewNotes] = useState('');
  const [formError, setFormError] = useState('');

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPath = pathFilter === 'ALL' || s.currentPath === pathFilter;
    return matchesSearch && matchesPath;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newName.trim()) {
      setFormError('Vui lòng nhập Mã học sinh và Tên hiển thị.');
      return;
    }

    if (students.some((s) => s.code.toUpperCase() === newCode.trim().toUpperCase())) {
      setFormError(`Mã học sinh "${newCode.trim().toUpperCase()}" đã tồn tại.`);
      return;
    }

    addStudent({
      code: newCode.trim().toUpperCase(),
      name: newName.trim(),
      gender: newGender,
      avatar: newGender === 'Nam' ? '👦' : '👧',
      classId: '5/3',
      currentPath: newPath,
      masteryScores: {},
      recentActivity: 'Mới thêm vào danh sách lớp',
      notes: newNotes.trim() || 'Học sinh mới tiếp nhận',
      badges: ['Chào bạn mới'],
      isDemo: isDemoMode,
    });

    // Reset form
    setNewCode('');
    setNewName('');
    setNewNotes('');
    setFormError('');
    setShowAddModal(false);
  };

  const exportCsv = () => {
    const headers = ['Mã HS', 'Tên hiển thị', 'Lớp', 'Giới tính', 'Lộ trình hiện tại', 'Ghi chú sư phạm'];
    const rows = students.map((s) => [
      s.code,
      `"${s.name}"`,
      s.classId,
      s.gender,
      s.currentPath === 'KHOI_DONG' ? 'Khởi động' : s.currentPath === 'TANG_TOC' ? 'Tăng tốc' : 'Chinh phục',
      `"${s.notes || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Danh_sach_hoc_sinh_Lop_5_3_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-heading text-slate-900">
              Quản Lý Hồ Sơ Học Sinh Lớp 5/3
            </h2>
            <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
              {students.length} học sinh
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Bảo vệ dữ liệu trẻ em: Chỉ sử dụng Mã học sinh (HS-xx) thay vì thông tin định danh nhạy cảm.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Xuất CSV</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Thêm Học Sinh</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên hoặc mã HS (HS-01)..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Lộ trình:</span>
          <button
            onClick={() => setPathFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              pathFilter === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất cả ({students.length})
          </button>
          <button
            onClick={() => setPathFilter('KHOI_DONG')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              pathFilter === 'KHOI_DONG'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            Khởi động
          </button>
          <button
            onClick={() => setPathFilter('TANG_TOC')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              pathFilter === 'TANG_TOC'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
            }`}
          >
            Tăng tốc
          </button>
          <button
            onClick={() => setPathFilter('CHINH_PHUC')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              pathFilter === 'CHINH_PHUC'
                ? 'bg-teal-600 text-white'
                : 'bg-teal-50 text-teal-800 hover:bg-teal-100'
            }`}
          >
            Chinh phục
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Mã Học Tập</th>
                <th className="py-3.5 px-4">Tên Học Sinh</th>
                <th className="py-3.5 px-4">Lớp</th>
                <th className="py-3.5 px-4">Lộ Trình AI</th>
                <th className="py-3.5 px-4">Hoạt Động Gần Nhất</th>
                <th className="py-3.5 px-4">Huy Hiệu</th>
                <th className="py-3.5 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Không tìm thấy học sinh phù hợp.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                      {st.code}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{st.avatar}</span>
                        <div>
                          <div className="font-bold text-slate-900">{st.name}</div>
                          {st.isDemo && (
                            <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-1.5 py-0.2 rounded">
                              Mô phỏng
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-600">5/3</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          st.currentPath === 'KHOI_DONG'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : st.currentPath === 'TANG_TOC'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-teal-100 text-teal-800 border border-teal-200'
                        }`}
                      >
                        {st.currentPath === 'KHOI_DONG' && 'Khởi động'}
                        {st.currentPath === 'TANG_TOC' && 'Tăng tốc'}
                        {st.currentPath === 'CHINH_PHUC' && 'Chinh phục'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">
                      {st.recentActivity || 'Chưa có hoạt động'}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1">
                        {st.badges?.slice(0, 2).map((b, i) => (
                          <span
                            key={i}
                            title={b}
                            className="bg-purple-50 text-purple-700 text-[10px] font-medium px-2 py-0.5 rounded-md border border-purple-200"
                          >
                            🏅 {b}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedStudent(st)}
                          title="Xem chi tiết hồ sơ sư phạm"
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteStudent(st.id)}
                          title="Xóa khỏi lớp"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Student */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Thêm Học Sinh Mới Vào Lớp 5/3</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mã học sinh (Ẩn danh, bảo mật):
                </label>
                <input
                  type="text"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="Ví dụ: HS-06 hoặc HS-501"
                  className="w-full uppercase font-mono px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tên hiển thị của học sinh:
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ví dụ: Trần Quốc Anh"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Giới tính:</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Nam">Nam (👦)</option>
                    <option value="Nữ">Nữ (👧)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lộ trình ban đầu:</label>
                  <select
                    value={newPath}
                    onChange={(e) => setNewPath(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="KHOI_DONG">Khởi động</option>
                    <option value="TANG_TOC">Tăng tốc</option>
                    <option value="CHINH_PHUC">Chinh phục</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ghi chú sư phạm (Tùy chọn):</label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Ví dụ: Tiếp thu nhanh, cần rèn luyện tính kiên nhẫn khi đọc đề bài dài..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              {formError && (
                <div className="p-2 bg-rose-50 text-rose-600 rounded-lg font-medium">{formError}</div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Lưu Học Sinh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Student Detail */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedStudent.avatar}</span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedStudent.name}</h3>
                  <span className="font-mono text-xs font-bold text-blue-600">
                    Mã: {selectedStudent.code} • Lớp 5/3
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700 block mb-1">Lộ trình học tập hiện tại:</span>
                <div className="flex items-center gap-2">
                  <span
                    className={`font-bold px-2.5 py-1 rounded-full ${
                      selectedStudent.currentPath === 'KHOI_DONG'
                        ? 'bg-amber-100 text-amber-800'
                        : selectedStudent.currentPath === 'TANG_TOC'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-teal-100 text-teal-800'
                    }`}
                  >
                    {selectedStudent.currentPath === 'KHOI_DONG' && '1. Khởi động (Củng cố nền tảng)'}
                    {selectedStudent.currentPath === 'TANG_TOC' && '2. Tăng tốc (Rèn luyện vận dụng)'}
                    {selectedStudent.currentPath === 'CHINH_PHUC' && '3. Chinh phục (Mở rộng sáng tạo)'}
                  </span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">Ghi chú nhận thức sư phạm:</span>
                <p className="p-3 bg-amber-50/50 text-slate-700 rounded-xl border border-amber-200">
                  {selectedStudent.notes || 'Chưa có ghi chú đặc biệt.'}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">Huy hiệu đã đạt:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedStudent.badges?.map((b, i) => (
                    <span key={i} className="bg-purple-100 text-purple-800 font-bold px-2.5 py-1 rounded-lg">
                      🏅 {b}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl"
                >
                  Đóng hồ sơ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
