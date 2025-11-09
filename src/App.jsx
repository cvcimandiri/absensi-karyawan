import React, { useState, useRef } from 'react';
import { Calendar, User, Clock, DollarSign, Plus, Trash2, Edit3, Save, X, Receipt, Star, ArrowLeft, LogIn, FileText, Download } from 'lucide-react';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [selectedEmployeeForSlip, setSelectedEmployeeForSlip] = useState(null);
  const pdfRef = useRef();

  const [employees, setEmployees] = useState([
    { id: 1, name: 'Budi Santoso', position: 'Pekerja Harian', dailyWage: 120000, overtimeRate: 15000 },
    { id: 2, name: 'Siti Aminah', position: 'Pekerja Harian', dailyWage: 115000, overtimeRate: 14500 },
    { id: 3, name: 'Ahmad Fauzi', position: 'Pekerja Harian', dailyWage: 125000, overtimeRate: 15500 }
  ]);

  const [attendance, setAttendance] = useState([
    { id: 1, employeeId: 1, date: '2025-11-01', checkIn: '08:00', checkOut: '16:00', status: 'present', notes: '', overtimeHours: 0 }, // Sabtu
    { id: 2, employeeId: 1, date: '2025-11-02', checkIn: '08:00', checkOut: '16:00', status: 'present', notes: '', overtimeHours: 2 }, // Minggu
    { id: 3, employeeId: 1, date: '2025-11-03', checkIn: '08:00', checkOut: '16:00', status: 'present', notes: '', overtimeHours: 0 }, // Senin
    { id: 4, employeeId: 1, date: '2025-11-04', checkIn: '08:00', checkOut: '16:00', status: 'present', notes: '', overtimeHours: 0 }, // Selasa
    { id: 5, employeeId: 1, date: '2025-11-05', checkIn: '08:00', checkOut: '16:00', status: 'present', notes: '', overtimeHours: 0 }, // Rabu
    { id: 6, employeeId: 1, date: '2025-11-06', checkIn: '08:00', checkOut: '16:00', status: 'present', notes: '', overtimeHours: 0 }, // Kamis
    { id: 7, employeeId: 1, date: '2025-11-07', checkIn: '08:00', checkOut: '16:00', status: 'present', notes: '', overtimeHours: 0 }, // Jumat
    { id: 8, employeeId: 2, date: '2025-11-01', checkIn: '08:15', checkOut: '15:45', status: 'present', notes: 'Terlambat 15 menit', overtimeHours: 1 }, // Sabtu
    { id: 9, employeeId: 2, date: '2025-11-02', checkIn: '08:00', checkOut: '16:00', status: 'present', notes: '', overtimeHours: 0 }, // Minggu
    { id: 10, employeeId: 2, date: '2025-11-03', checkIn: '08:00', checkOut: '16:00', status: 'present', notes: '', overtimeHours: 0 }, // Senin
    { id: 11, employeeId: 2, date: '2025-11-04', checkIn: '08:00', checkOut: '16:00', status: 'present', notes: '', overtimeHours: 0 }, // Selasa
    { id: 12, employeeId: 2, date: '2025-11-05', checkIn: '08:00', checkOut: '16:00', status: 'present', notes: '', overtimeHours: 0 }, // Rabu
    { id: 13, employeeId: 2, date: '2025-11-06', checkIn: '08:00', checkOut: '16:00', status: 'present', notes: '', overtimeHours: 0 }, // Kamis
    { id: 14, employeeId: 2, date: '2025-11-07', checkIn: '08:00', checkOut: '16:00', status: 'present', notes: '', overtimeHours: 0 } // Jumat
  ]);

  const [payments, setPayments] = useState([
    { id: 1, employeeId: 1, amount: 870000, date: '2025-11-01', description: 'Pembayaran gaji mingguan (Sabtu - Jumat)' },
    { id: 2, employeeId: 2, amount: 704500, date: '2025-11-01', description: 'Pembayaran gaji mingguan (Sabtu - Jumat)' }
  ]);

  // State for previous salary balance
  const [previousBalances, setPreviousBalances] = useState([
    { employeeId: 1, amount: 50000, period: 'Oktober 2025', description: 'Sisa gaji bulan sebelumnya' },
    { employeeId: 2, amount: 30000, period: 'Oktober 2025', description: 'Sisa gaji bulan sebelumnya' },
    { employeeId: 3, amount: 0, period: 'Oktober 2025', description: 'Lunas' }
  ]);

  const [newEmployee, setNewEmployee] = useState({ name: '', position: '', dailyWage: '', overtimeRate: '' });
  const [newAttendance, setNewAttendance] = useState({ employeeId: '', date: new Date().toISOString().split('T')[0], checkIn: '08:00', checkOut: '16:00', notes: '', overtimeHours: 0 });
  const [newPayment, setNewPayment] = useState({ employeeId: '', amount: '', date: new Date().toISOString().split('T')[0], description: '' });
  const [newPreviousBalance, setNewPreviousBalance] = useState({ employeeId: '', amount: '', period: 'November 2025', description: '' });
  const [editingAttendance, setEditingAttendance] = useState(null);
  const [editAttendanceData, setEditAttendanceData] = useState({});
  const [activeTab, setActiveTab] = useState('attendance');
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

  // Get week range (Sabtu to Jumat)
  const getWeekRange = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDay(); // 0 = Minggu, 1 = Senin, ..., 6 = Sabtu
    // Calculate days to subtract to get to the previous Saturday (6)
    const daysFromSaturday = (day + 1) % 7; // 0 for Saturday, 1 for Sunday, ..., 6 for Friday
    const saturday = new Date(date);
    saturday.setDate(date.getDate() - daysFromSaturday);
    
    const friday = new Date(saturday);
    friday.setDate(saturday.getDate() + 6);
    
    return {
      start: saturday.toISOString().split('T')[0],
      end: friday.toISOString().split('T')[0],
      saturday: saturday.toLocaleDateString('id-ID'),
      friday: friday.toLocaleDateString('id-ID')
    };
  };

  // Get current week range
  const currentWeek = getWeekRange(new Date().toISOString().split('T')[0]);

  // Handle login
  const handleLogin = (e) => {
    e.preventDefault();
    if (loginForm.username === 'admincm' && loginForm.password === 'admincm123') {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Username atau password salah');
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginForm({ username: '', password: '' });
    setLoginError('');
  };

  // Calculate salary for each employee including overtime
  const calculateSalary = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) return 0;
    
    const employeeAttendance = attendance.filter(att => att.employeeId === employeeId && att.status === 'present');
    const regularDays = employeeAttendance.length;
    const totalOvertimeHours = employeeAttendance.reduce((sum, att) => sum + (att.overtimeHours || 0), 0);
    
    return (regularDays * employee.dailyWage) + (totalOvertimeHours * employee.overtimeRate);
  };

  // Calculate weekly salary for specific week (Sabtu to Jumat)
  const calculateWeeklySalary = (employeeId, weekStart, weekEnd) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) return 0;
    
    const employeeAttendance = attendance.filter(att => 
      att.employeeId === employeeId && 
      att.status === 'present' && 
      att.date >= weekStart && 
      att.date <= weekEnd
    );
    const regularDays = employeeAttendance.length;
    const totalOvertimeHours = employeeAttendance.reduce((sum, att) => sum + (att.overtimeHours || 0), 0);
    
    return (regularDays * employee.dailyWage) + (totalOvertimeHours * employee.overtimeRate);
  };

  // Calculate total payments for employee in specific week
  const calculateWeeklyPayments = (employeeId, weekStart, weekEnd) => {
    const employeePayments = payments.filter(pay => 
      pay.employeeId === employeeId && 
      pay.date >= weekStart && 
      pay.date <= weekEnd
    );
    return employeePayments.reduce((total, pay) => total + pay.amount, 0);
  };

  // Calculate total payments for employee
  const calculateTotalPayments = (employeeId) => {
    const employeePayments = payments.filter(pay => pay.employeeId === employeeId);
    return employeePayments.reduce((total, pay) => total + pay.amount, 0);
  };

  // Get previous balance for employee
  const getPreviousBalance = (employeeId) => {
    const balance = previousBalances.find(bal => bal.employeeId === employeeId);
    return balance ? balance.amount : 0;
  };

  // Calculate total payable amount (previous balance + current salary)
  const calculateTotalPayable = (employeeId) => {
    return getPreviousBalance(employeeId) + calculateSalary(employeeId);
  };

  // Calculate remaining salary after payments
  const calculateRemainingSalary = (employeeId) => {
    return calculateTotalPayable(employeeId) - calculateTotalPayments(employeeId);
  };

  // Calculate overtime pay for a specific attendance record
  const calculateOvertimePay = (attendanceRecord) => {
    const employee = employees.find(emp => emp.id === attendanceRecord.employeeId);
    if (!employee) return 0;
    return (attendanceRecord.overtimeHours || 0) * employee.overtimeRate;
  };

  // Handle employee submission
  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (newEmployee.name && newEmployee.position && newEmployee.dailyWage && newEmployee.overtimeRate) {
      const employee = {
        id: Date.now(),
        ...newEmployee,
        dailyWage: Number(newEmployee.dailyWage),
        overtimeRate: Number(newEmployee.overtimeRate)
      };
      setEmployees([...employees, employee]);
      setNewEmployee({ name: '', position: '', dailyWage: '', overtimeRate: '' });
      
      // Add default zero balance for new employee
      setPreviousBalances([...previousBalances, { 
        employeeId: employee.id, 
        amount: 0, 
        period: 'November 2025', 
        description: 'Lunas' 
      }]);
    }
  };

  // Handle attendance submission
  const handleAddAttendance = (e) => {
    e.preventDefault();
    if (newAttendance.employeeId && newAttendance.date && newAttendance.checkIn && newAttendance.checkOut) {
      const attendanceRecord = {
        id: Date.now(),
        ...newAttendance,
        employeeId: Number(newAttendance.employeeId),
        status: 'present',
        overtimeHours: Number(newAttendance.overtimeHours) || 0
      };
      setAttendance([...attendance, attendanceRecord]);
      setNewAttendance({ employeeId: '', date: new Date().toISOString().split('T')[0], checkIn: '08:00', checkOut: '16:00', notes: '', overtimeHours: 0 });
    }
  };

  // Handle payment submission
  const handleAddPayment = (e) => {
    e.preventDefault();
    if (newPayment.employeeId && newPayment.amount && newPayment.date) {
      const payment = {
        id: Date.now(),
        ...newPayment,
        employeeId: Number(newPayment.employeeId),
        amount: Number(newPayment.amount)
      };
      setPayments([...payments, payment]);
      setNewPayment({ employeeId: '', amount: '', date: new Date().toISOString().split('T')[0], description: '' });
    }
  };

  // Handle previous balance submission
  const handleAddPreviousBalance = (e) => {
    e.preventDefault();
    if (newPreviousBalance.employeeId && newPreviousBalance.amount !== '') {
      const balance = {
        id: Date.now(),
        ...newPreviousBalance,
        employeeId: Number(newPreviousBalance.employeeId),
        amount: Number(newPreviousBalance.amount)
      };
      
      // Update existing balance or add new one
      const existingIndex = previousBalances.findIndex(bal => bal.employeeId === balance.employeeId);
      if (existingIndex >= 0) {
        const updatedBalances = [...previousBalances];
        updatedBalances[existingIndex] = balance;
        setPreviousBalances(updatedBalances);
      } else {
        setPreviousBalances([...previousBalances, balance]);
      }
      
      setNewPreviousBalance({ employeeId: '', amount: '', period: 'November 2025', description: '' });
    }
  };

  // Generate PDF slip function
  const generatePDFSlip = (employee, weekStart, weekEnd, weekRange) => {
    setSelectedEmployeeForSlip({
      employee,
      weekStart,
      weekEnd,
      weekRange
    });
  };

  // Start editing attendance
  const startEditAttendance = (record) => {
    setEditingAttendance(record.id);
    setEditAttendanceData({ ...record });
  };

  // Save edited attendance
  const saveEditAttendance = () => {
    setAttendance(attendance.map(att => 
      att.id === editingAttendance ? editAttendanceData : att
    ));
    setEditingAttendance(null);
    setEditAttendanceData({});
  };

  // Delete attendance record
  const deleteAttendance = (id) => {
    setAttendance(attendance.filter(att => att.id !== id));
  };

  // Delete payment record
  const deletePayment = (id) => {
    setPayments(payments.filter(pay => pay.id !== id));
  };

  // Delete employee
  const deleteEmployee = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id));
    setAttendance(attendance.filter(att => att.employeeId !== id));
    setPayments(payments.filter(pay => pay.employeeId !== id));
    setPreviousBalances(previousBalances.filter(bal => bal.employeeId !== id));
  };

  // Filter attendance by date
  const filteredAttendance = attendance.filter(att => att.date === filterDate);

  // Get employee name by ID
  const getEmployeeName = (id) => {
    const employee = employees.find(emp => emp.id === id);
    return employee ? employee.name : 'Unknown';
  };

  // Get employee position by ID
  const getEmployeePosition = (id) => {
    const employee = employees.find(emp => emp.id === id);
    return employee ? employee.position : 'Unknown';
  };

  // Get employee previous balance object
  const getPreviousBalanceObject = (employeeId) => {
    return previousBalances.find(bal => bal.employeeId === employeeId) || { amount: 0, period: 'November 2025', description: 'Lunas' };
  };

  // Login Form
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <LogIn className="text-blue-600" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Login Sistem Gaji</h1>
            <p className="text-gray-600 mt-2">Masukkan kredensial Anda</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan username"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan password"
                required
              />
            </div>
            
            {loginError && (
              <div className="text-red-600 text-sm text-center">{loginError}</div>
            )}
            
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Login
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Silahkan masuk dengan user dan pasword anda</p>
          </div>
        </div>
      </div>
    );
  }

  // PDF Slip Modal
  const PDFSlipModal = ({ employee, weekStart, weekEnd, weekRange, onClose }) => {
    const weeklySalary = calculateWeeklySalary(employee.id, weekStart, weekEnd);
    const weeklyPayments = calculateWeeklyPayments(employee.id, weekStart, weekEnd);
    const remainingSalary = weeklySalary - weeklyPayments;
    
    const employeeAttendance = attendance
      .filter(att => att.employeeId === employee.id && att.status === 'present' && att.date >= weekStart && att.date <= weekEnd)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('id-ID', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    };

    const formatTime = (timeString) => {
      const [hours, minutes] = timeString.split(':');
      return `${hours}:${minutes}`;
    };

    const totalDays = employeeAttendance.length;
    const totalOvertime = employeeAttendance.reduce((sum, att) => sum + (att.overtimeHours || 0), 0);
    const overtimePay = totalOvertime * employee.overtimeRate;
    const regularPay = totalDays * employee.dailyWage;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-screen overflow-auto">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-800">Slip Gaji Mingguan</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  // Simulate PDF download - in real app you'd use a PDF library
                  alert('Fitur export PDF akan menghasilkan file slip gaji dalam format PDF.\n\nUntuk demo ini, Anda bisa mencetak halaman ini sebagai PDF menggunakan Ctrl+P (Cmd+P di Mac) dan pilih "Simpan sebagai PDF".');
                }}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center"
              >
                <Download className="mr-2" size={18} />
                Download PDF
              </button>
              <button
                onClick={onClose}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
          
          <div ref={pdfRef} className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">SLIP GAJI</h1>
              <p className="text-gray-600">Periode: {weekRange.saturday} - {weekRange.friday}</p>
              <p className="text-sm text-gray-500 mt-2">Pembayaran dilakukan setiap hari Sabtu</p>
            </div>

            {/* Employee Info */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">INFORMASI KARYAWAN</h3>
                <div className="space-y-1">
                  <p><span className="font-medium">Nama:</span> {employee.name}</p>
                  <p><span className="font-medium">Jabatan:</span> {employee.position}</p>
                  <p><span className="font-medium">ID Karyawan:</span> {employee.id}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">DETAIL GAJI</h3>
                <div className="space-y-1">
                  <p><span className="font-medium">Gaji Harian:</span> Rp {employee.dailyWage.toLocaleString('id-ID')}</p>
                  <p><span className="font-medium">Tarif Lembur:</span> Rp {employee.overtimeRate.toLocaleString('id-ID')}/jam</p>
                  <p><span className="font-medium">Tanggal Cetak:</span> {new Date().toLocaleDateString('id-ID')}</p>
                </div>
              </div>
            </div>

            {/* Attendance Details */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-700 mb-4">RIWAYAT KEHADIRAN MINGGU INI</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">Tanggal</th>
                      <th className="border p-2 text-left">Hari</th>
                      <th className="border p-2 text-left">Jam Masuk</th>
                      <th className="border p-2 text-left">Jam Keluar</th>
                      <th className="border p-2 text-left">Lembur (jam)</th>
                      <th className="border p-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeeAttendance.length > 0 ? (
                      employeeAttendance.map((att, index) => (
                        <tr key={index} className="border">
                          <td className="border p-2">{formatDate(att.date)}</td>
                          <td className="border p-2">{new Date(att.date).toLocaleDateString('id-ID', { weekday: 'long' })}</td>
                          <td className="border p-2">{formatTime(att.checkIn)}</td>
                          <td className="border p-2">{formatTime(att.checkOut)}</td>
                          <td className="border p-2">{att.overtimeHours || 0}</td>
                          <td className="border p-2">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Hadir</span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="border p-4 text-center text-gray-500">Tidak ada data kehadiran untuk minggu ini</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-700 mb-4">RINGKASAN PEMBAYARAN</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Gaji Pokok ({totalDays} hari × Rp {employee.dailyWage.toLocaleString('id-ID')})</span>
                  <span>Rp {regularPay.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bonus Lembur ({totalOvertime} jam × Rp {employee.overtimeRate.toLocaleString('id-ID')})</span>
                  <span>Rp {overtimePay.toLocaleString('id-ID')}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>TOTAL GAJI MINGGU INI</span>
                    <span>Rp {weeklySalary.toLocaleString('id-ID')}</span>
                  </div>
                </div>
                
                {/* Payment Section */}
                <div className="mt-4">
                  <div className="flex justify-between">
                    <span>Total Dibayar Minggu Ini</span>
                    <span className="text-green-600 font-bold">Rp {weeklyPayments.toLocaleString('id-ID')}</span>
                  </div>
                  
                  {remainingSalary > 0 ? (
                    <div className="flex justify-between">
                      <span className="text-red-600">Sisa Gaji Belum Dibayar</span>
                      <span className="text-red-600 font-bold">Rp {remainingSalary.toLocaleString('id-ID')}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between">
                      <span className="text-green-600">Status Pembayaran</span>
                      <span className="text-green-600 font-bold">Lunas</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-gray-500 mt-8">
              <p>Slip gaji ini berlaku sebagai bukti pembayaran resmi.</p>
              <p>Harap simpan dengan baik untuk keperluan administrasi.</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main App
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header with Logout */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Sistem Absensi & Gaji Karyawan</h1>
            <p className="text-sm text-gray-600">Selamat datang, admincm</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center"
          >
            <LogIn className="mr-2" size={18} />
            Logout
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === 'attendance'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              <Clock className="inline mr-2" size={18} />
              Absensi
            </button>
            <button
              onClick={() => setActiveTab('employees')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === 'employees'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              <User className="inline mr-2" size={18} />
              Karyawan
            </button>
            <button
              onClick={() => setActiveTab('salary')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === 'salary'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              <DollarSign className="inline mr-2" size={18} />
              Gaji
            </button>
          </div>
        </div>

        {/* PDF Slip Modal */}
        {selectedEmployeeForSlip && (
          <PDFSlipModal
            employee={selectedEmployeeForSlip.employee}
            weekStart={selectedEmployeeForSlip.weekStart}
            weekEnd={selectedEmployeeForSlip.weekEnd}
            weekRange={selectedEmployeeForSlip.weekRange}
            onClose={() => setSelectedEmployeeForSlip(null)}
          />
        )}

        {/* Attendance & Overtime Tab */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            {/* Add Attendance Form */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <Clock className="mr-2 text-blue-500" />
                Tambah Absensi & Lembur Baru
              </h2>
              <form onSubmit={handleAddAttendance} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={newAttendance.date}
                    onChange={(e) => setNewAttendance({...newAttendance, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Karyawan</label>
                  <select
                    value={newAttendance.employeeId}
                    onChange={(e) => setNewAttendance({...newAttendance, employeeId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Pilih Karyawan</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jam Masuk</label>
                  <input
                    type="time"
                    value={newAttendance.checkIn}
                    onChange={(e) => setNewAttendance({...newAttendance, checkIn: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jam Keluar</label>
                  <input
                    type="time"
                    value={newAttendance.checkOut}
                    onChange={(e) => setNewAttendance({...newAttendance, checkOut: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lembur (jam)</label>
                  <input
                    type="number"
                    min="0"
                    value={newAttendance.overtimeHours}
                    onChange={(e) => setNewAttendance({...newAttendance, overtimeHours: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
                  <input
                    type="text"
                    value={newAttendance.notes}
                    onChange={(e) => setNewAttendance({...newAttendance, notes: e.target.value})}
                    placeholder="Catatan tambahan"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center"
                  >
                    <Plus className="mr-2" size={18} />
                    Tambah
                  </button>
                </div>
              </form>
            </div>

            {/* Date Filter */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Filter Tanggal</h2>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Attendance List */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Daftar Absensi & Lembur</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        <th className="py-3 px-4 font-semibold text-gray-700">Nama</th>
                        <th className="py-3 px-4 font-semibold text-gray-700">Tanggal</th>
                        <th className="py-3 px-4 font-semibold text-gray-700">Masuk</th>
                        <th className="py-3 px-4 font-semibold text-gray-700">Keluar</th>
                        <th className="py-3 px-4 font-semibold text-gray-700">Durasi</th>
                        <th className="py-3 px-4 font-semibold text-gray-700">Lembur (jam)</th>
                        <th className="py-3 px-4 font-semibold text-gray-700">Bonus Lembur</th>
                        <th className="py-3 px-4 font-semibold text-gray-700">Status</th>
                        <th className="py-3 px-4 font-semibold text-gray-700">Catatan</th>
                        <th className="py-3 px-4 font-semibold text-gray-700">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAttendance.map((record) => {
                        const employee = employees.find(emp => emp.id === record.employeeId);
                        const overtimePay = calculateOvertimePay(record);
                        const overtimeHours = record.overtimeHours || 0;
                        
                        return (
                          <tr key={record.id} className="border-t border-gray-200 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              {editingAttendance === record.id ? (
                                <select
                                  value={editAttendanceData.employeeId}
                                  onChange={(e) => setEditAttendanceData({...editAttendanceData, employeeId: Number(e.target.value)})}
                                  className="w-full px-2 py-1 border border-gray-300 rounded"
                                >
                                  {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                                  ))}
                                </select>
                              ) : (
                                getEmployeeName(record.employeeId)
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {editingAttendance === record.id ? (
                                <input
                                  type="date"
                                  value={editAttendanceData.date}
                                  onChange={(e) => setEditAttendanceData({...editAttendanceData, date: e.target.value})}
                                  className="w-full px-2 py-1 border border-gray-300 rounded"
                                />
                              ) : (
                                new Date(record.date).toLocaleDateString('id-ID')
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {editingAttendance === record.id ? (
                                <input
                                  type="time"
                                  value={editAttendanceData.checkIn}
                                  onChange={(e) => setEditAttendanceData({...editAttendanceData, checkIn: e.target.value})}
                                  className="w-full px-2 py-1 border border-gray-300 rounded"
                                />
                              ) : (
                                record.checkIn
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {editingAttendance === record.id ? (
                                <input
                                  type="time"
                                  value={editAttendanceData.checkOut}
                                  onChange={(e) => setEditAttendanceData({...editAttendanceData, checkOut: e.target.value})}
                                  className="w-full px-2 py-1 border border-gray-300 rounded"
                                />
                              ) : (
                                record.checkOut
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {(() => {
                                const [inHours, inMinutes] = record.checkIn.split(':').map(Number);
                                const [outHours, outMinutes] = record.checkOut.split(':').map(Number);
                                const totalMinutes = (outHours * 60 + outMinutes) - (inHours * 60 + inMinutes);
                                const hours = Math.floor(totalMinutes / 60);
                                const minutes = totalMinutes % 60;
                                return `${hours}h ${minutes}m`;
                              })()}
                            </td>
                            <td className="py-3 px-4">
                              {editingAttendance === record.id ? (
                                <input
                                  type="number"
                                  min="0"
                                  value={editAttendanceData.overtimeHours || 0}
                                  onChange={(e) => setEditAttendanceData({...editAttendanceData, overtimeHours: Number(e.target.value) || 0})}
                                  className="w-full px-2 py-1 border border-gray-300 rounded"
                                />
                              ) : (
                                overtimeHours
                              )}
                            </td>
                            <td className="py-3 px-4 font-semibold text-green-600">
                              {editingAttendance === record.id ? (
                                `Rp ${((editAttendanceData.overtimeHours || 0) * (employee?.overtimeRate || 0)).toLocaleString('id-ID')}`
                              ) : (
                                `Rp ${overtimePay.toLocaleString('id-ID')}`
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                record.status === 'present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {record.status === 'present' ? 'Hadir' : 'Tidak Hadir'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {editingAttendance === record.id ? (
                                <input
                                  type="text"
                                  value={editAttendanceData.notes}
                                  onChange={(e) => setEditAttendanceData({...editAttendanceData, notes: e.target.value})}
                                  className="w-full px-2 py-1 border border-gray-300 rounded"
                                />
                              ) : (
                                record.notes || '-'
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {editingAttendance === record.id ? (
                                <div className="flex space-x-1">
                                  <button
                                    onClick={saveEditAttendance}
                                    className="p-1 text-green-600 hover:bg-green-100 rounded"
                                  >
                                    <Save size={16} />
                                  </button>
                                  <button
                                    onClick={() => setEditingAttendance(null)}
                                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex space-x-1">
                                  <button
                                    onClick={() => startEditAttendance(record)}
                                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                                  >
                                    <Edit3 size={16} />
                                  </button>
                                  <button
                                    onClick={() => deleteAttendance(record.id)}
                                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {filteredAttendance.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      Tidak ada data absensi untuk tanggal yang dipilih
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Employees Tab */}
        {activeTab === 'employees' && (
          <div className="space-y-6">
            {/* Add Employee Form */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <User className="mr-2 text-blue-500" />
                Tambah Karyawan Baru
              </h2>
              <form onSubmit={handleAddEmployee} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                    placeholder="Nama karyawan"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan</label>
                  <input
                    type="text"
                    value={newEmployee.position}
                    onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                    placeholder="Jabatan"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gaji Harian (Rp)</label>
                  <input
                    type="number"
                    value={newEmployee.dailyWage}
                    onChange={(e) => setNewEmployee({...newEmployee, dailyWage: e.target.value})}
                    placeholder="Gaji per hari"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tarif Lembur (Rp/jam)</label>
                  <input
                    type="number"
                    value={newEmployee.overtimeRate}
                    onChange={(e) => setNewEmployee({...newEmployee, overtimeRate: e.target.value})}
                    placeholder="Tarif lembur per jam"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center"
                  >
                    <Plus className="mr-2" size={18} />
                    Tambah
                  </button>
                </div>
              </form>
            </div>

            {/* Employees List */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Daftar Karyawan</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        <th className="py-3 px-4 font-semibold text-gray-700">Nama</th>
                        <th className="py-3 px-4 font-semibold text-gray-700">Jabatan</th>
                        <th className="py-3 px-4 font-semibold text-gray-700">Gaji Harian</th>
                        <th className="py-3 px-4 font-semibold text-gray-700">Tarif Lembur/jam</th>
                        <th className="py-3 px-4 font-semibold text-gray-700">Total Hadir</th>
                        <th className="py-3 px-4 font-semibold text-gray-700">Total Lembur (jam)</th>
                        <th className="py-3 px-4 font-semibold text-gray-700">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((employee) => {
                        const attendanceCount = attendance.filter(att => att.employeeId === employee.id && att.status === 'present').length;
                        const totalOvertimeHours = attendance
                          .filter(att => att.employeeId === employee.id && att.status === 'present')
                          .reduce((sum, att) => sum + (att.overtimeHours || 0), 0);
                        const totalSalary = calculateSalary(employee.id);
                        
                        return (
                          <tr key={employee.id} className="border-t border-gray-200 hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium">{employee.name}</td>
                            <td className="py-3 px-4">{employee.position}</td>
                            <td className="py-3 px-4">Rp {employee.dailyWage.toLocaleString('id-ID')}</td>
                            <td className="py-3 px-4">Rp {employee.overtimeRate.toLocaleString('id-ID')}</td>
                            <td className="py-3 px-4">{attendanceCount} hari</td>
                            <td className="py-3 px-4">{totalOvertimeHours} jam</td>
                            <td className="py-3 px-4">
                              <button
                                onClick={() => deleteEmployee(employee.id)}
                                className="p-1 text-red-600 hover:bg-red-100 rounded"
                              >
                                <Trash2 size={16} />
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
          </div>
        )}

        {/* Salary Tab */}
        {activeTab === 'salary' && (
          <div className="space-y-6">
            {/* Add Previous Balance Form */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <ArrowLeft className="mr-2 text-purple-500" />
                Sisa Gaji Sebelumnya
              </h2>
              <form onSubmit={handleAddPreviousBalance} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Karyawan</label>
                  <select
                    value={newPreviousBalance.employeeId}
                    onChange={(e) => setNewPreviousBalance({...newPreviousBalance, employeeId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Pilih Karyawan</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Sisa (Rp)</label>
                  <input
                    type="number"
                    value={newPreviousBalance.amount}
                    onChange={(e) => setNewPreviousBalance({...newPreviousBalance, amount: e.target.value})}
                    placeholder="Jumlah sisa gaji"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Periode</label>
                  <input
                    type="text"
                    value={newPreviousBalance.period}
                    onChange={(e) => setNewPreviousBalance({...newPreviousBalance, period: e.target.value})}
                    placeholder="Contoh: Oktober 2025"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                  <input
                    type="text"
                    value={newPreviousBalance.description}
                    onChange={(e) => setNewPreviousBalance({...newPreviousBalance, description: e.target.value})}
                    placeholder="Keterangan sisa gaji"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-4 flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors flex items-center justify-center"
                  >
                    <Plus className="mr-2" size={18} />
                    Simpan Sisa Gaji
                  </button>
                </div>
              </form>
            </div>

            {/* Add Payment Form */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <Receipt className="mr-2 text-green-500" />
                Tambah Pembayaran
              </h2>
              <form onSubmit={handleAddPayment} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Karyawan</label>
                  <select
                    value={newPayment.employeeId}
                    onChange={(e) => setNewPayment({...newPayment, employeeId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Pilih Karyawan</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Bayar (Rp)</label>
                  <input
                    type="number"
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})}
                    placeholder="Jumlah pembayaran"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={newPayment.date}
                    onChange={(e) => setNewPayment({...newPayment, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                  <input
                    type="text"
                    value={newPayment.description}
                    onChange={(e) => setNewPayment({...newPayment, description: e.target.value})}
                    placeholder="Deskripsi pembayaran"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-4 flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors flex items-center justify-center"
                  >
                    <Plus className="mr-2" size={18} />
                    Tambah Pembayaran
                  </button>
                </div>
              </form>
            </div>

            {/* Salary Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <User className="text-blue-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Total Karyawan</p>
                    <p className="text-2xl font-bold text-gray-800">{employees.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Clock className="text-green-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Total Kehadiran</p>
                    <p className="text-2xl font-bold text-gray-800">{attendance.filter(att => att.status === 'present').length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <DollarSign className="text-purple-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Total Gaji</p>
                    <p className="text-2xl font-bold text-gray-800">
                      Rp {attendance
                        .filter(att => att.status === 'present')
                        .reduce((total, att) => {
                          const employee = employees.find(emp => emp.id === att.employeeId);
                          return total + (employee ? employee.dailyWage : 0) + ((att.overtimeHours || 0) * (employee?.overtimeRate || 0));
                        }, 0)
                        .toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <ArrowLeft className="text-orange-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Total Sisa Sebelumnya</p>
                    <p className="text-2xl font-bold text-gray-800">
                      Rp {previousBalances
                        .reduce((total, bal) => total + bal.amount, 0)
                        .toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Salary Detail */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Rincian Gaji & Pembayaran Per Karyawan</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        <th className="py-3 px-4 font-semibold text-gray-700">Nama</th>
                        <th className="py-3 px-4 font-semibold text-gray-700">Jabatan</th>
                        <th className="py-3 px-4 font-semibold text-gray-700">Gaji Harian</th>
                        <th className="py-3 px-4 font-semibold text-gray-700">Tarif Lembur/jam</th>
                        <th className="py-3 px-4 font-semibold text-gray-700">Jumlah Hadir</th>
                        <th className="py-3 px-4 font-semibold text-gray-700">Total Lembur (jam)</th>
                        <th className="py-3 px-4 font-semibold text-gray-700">Gaji Pokok</th>
                        <th className="py-3 px-4 font-semibold text-gray-700">Bonus Lembur</th>
                        <th className="py-3 px-4 font-semibold text-gray-700">Sisa Sebelumnya</th>
                        <th className="py-3 px-4 font-semibold text-gray-700">Total Tagihan</th>
                        <th className="py-3 px-4 font-semibold text-gray-700">Total Bayar</th>
                        <th className="py-3 px-4 font-semibold text-gray-700">Sisa Gaji</th>
                        <th className="py-3 px-4 font-semibold text-gray-700">Slip Gaji</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((employee) => {
                        const attendanceCount = attendance.filter(att => att.employeeId === employee.id && att.status === 'present').length;
                        const totalOvertimeHours = attendance
                          .filter(att => att.employeeId === employee.id && att.status === 'present')
                          .reduce((sum, att) => sum + (att.overtimeHours || 0), 0);
                        const regularSalary = attendanceCount * employee.dailyWage;
                        const overtimePay = totalOvertimeHours * employee.overtimeRate;
                        const currentSalary = regularSalary + overtimePay;
                        const previousBalance = getPreviousBalance(employee.id);
                        const totalPayable = currentSalary + previousBalance;
                        const totalPayments = calculateTotalPayments(employee.id);
                        const remainingSalary = totalPayable - totalPayments;
                        
                        return (
                          <tr key={employee.id} className="border-t border-gray-200 hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium">{employee.name}</td>
                            <td className="py-3 px-4">{employee.position}</td>
                            <td className="py-3 px-4">Rp {employee.dailyWage.toLocaleString('id-ID')}</td>
                            <td className="py-3 px-4">Rp {employee.overtimeRate.toLocaleString('id-ID')}</td>
                            <td className="py-3 px-4">{attendanceCount} hari</td>
                            <td className="py-3 px-4">{totalOvertimeHours} jam</td>
                            <td className="py-3 px-4 font-semibold text-blue-600">Rp {regularSalary.toLocaleString('id-ID')}</td>
                            <td className="py-3 px-4 font-semibold text-green-600">Rp {overtimePay.toLocaleString('id-ID')}</td>
                            <td className="py-3 px-4 font-semibold text-orange-600">Rp {previousBalance.toLocaleString('id-ID')}</td>
                            <td className="py-3 px-4 font-semibold text-purple-600">Rp {totalPayable.toLocaleString('id-ID')}</td>
                            <td className="py-3 px-4 font-semibold text-blue-600">Rp {totalPayments.toLocaleString('id-ID')}</td>
                            <td className={`py-3 px-4 font-semibold ${
                              remainingSalary > 0 ? 'text-red-600' : 'text-green-600'
                            }`}>
                              Rp {remainingSalary.toLocaleString('id-ID')}
                            </td>
                            <td className="py-3 px-4">
                              <button
                                onClick={() => generatePDFSlip(employee, currentWeek.start, currentWeek.end, currentWeek)}
                                className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors"
                                title="Generate Slip Gaji Minggu Ini (Sabtu - Jumat)"
                              >
                                <FileText size={16} />
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

            {/* Previous Balances List */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Daftar Sisa Gaji Sebelumnya</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        <th className="py-3 px-4 font-semibold text-gray-700">Nama</th>
                        <th className="py-3 px-4 font-semibold text-gray-700">Periode</th>
                        <th className="py-3 px-4 font-semibold text-gray-700">Jumlah Sisa</th>
                        <th className="py-3 px-4 font-semibold text-gray-700">Deskripsi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((employee) => {
                        const balance = getPreviousBalanceObject(employee.id);
                        return (
                          <tr key={employee.id} className="border-t border-gray-200 hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium">{employee.name}</td>
                            <td className="py-3 px-4">{balance.period}</td>
                            <td className="py-3 px-4 font-semibold text-orange-600">Rp {balance.amount.toLocaleString('id-ID')}</td>
                            <td className="py-3 px-4">{balance.description}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Payment History */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Riwayat Pembayaran</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        <th className="py-3 px-4 font-semibold text-gray-700">Nama</th>
                        <th className="py-3 px-4 font-semibold text-gray-700">Tanggal</th>
                        <th className="py-3 px-4 font-semibold text-gray-700">Jumlah Bayar</th>
                        <th className="py-3 px-4 font-semibold text-gray-700">Deskripsi</th>
                        <th className="py-3 px-4 font-semibold text-gray-700">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr key={payment.id} className="border-t border-gray-200 hover:bg-gray-50">
                          <td className="py-3 px-4">{getEmployeeName(payment.employeeId)}</td>
                          <td className="py-3 px-4">{new Date(payment.date).toLocaleDateString('id-ID')}</td>
                          <td className="py-3 px-4 font-semibold text-green-600">Rp {payment.amount.toLocaleString('id-ID')}</td>
                          <td className="py-3 px-4">{payment.description || 'Pembayaran gaji mingguan (Sabtu - Jumat)'}</td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => deletePayment(payment.id)}
                              className="p-1 text-red-600 hover:bg-red-100 rounded"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {payments.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      Belum ada pembayaran yang dicatat
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
