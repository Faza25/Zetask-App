// src/pages/Absen.jsx

import React, { useState } from 'react';

// Data karyawan sementara
const KARYAWAN_LIST = [
  { id: 1, name: 'Budi Santoso' },
  { id: 2, name: 'Ani Yudhoyono' },
  { id: 3, name: 'Cahyo Kumolo' },
];

function Absen() {
  const [selectedKaryawan, setSelectedKaryawan] = useState(KARYAWAN_LIST[0].id);
  const [absenLog, setAbsenLog] = useState([]);

  const handleCheckIn = () => {
    const karyawan = KARYAWAN_LIST.find(k => k.id === parseInt(selectedKaryawan));
    const now = new Date();
    
    // Cek apakah karyawan sudah absen hari ini
    const sudahAbsen = absenLog.some(log => 
      log.karyawanId === karyawan.id && 
      new Date(log.waktu).toDateString() === now.toDateString()
    );

    if (sudahAbsen) {
      alert(`${karyawan.name} sudah melakukan check-in hari ini.`);
      return;
    }

    const newLog = {
      id: Date.now(),
      karyawanId: karyawan.id,
      nama: karyawan.name,
      waktu: now.toLocaleString('id-ID'),
    };

    setAbsenLog([newLog, ...absenLog]);
    alert(`${karyawan.name} berhasil check-in!`);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Sistem Absensi Harian</h1>

      {/* Form Check-in */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Form Check-in</h2>
        <div className="flex items-center space-x-4">
          <select
            value={selectedKaryawan}
            onChange={(e) => setSelectedKaryawan(e.target.value)}
            className="flex-grow p-2 border rounded-md"
          >
            {KARYAWAN_LIST.map(k => (
              <option key={k.id} value={k.id}>{k.name}</option>
            ))}
          </select>
          <button
            onClick={handleCheckIn}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-semibold"
          >
            Check-in
          </button>
        </div>
      </div>

      {/* Tabel Log Absensi */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Log Absensi Hari Ini</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">Nama Karyawan</th>
              <th className="p-2">Waktu Check-in</th>
            </tr>
          </thead>
          <tbody>
            {absenLog.length > 0 ? (
              absenLog.map(log => (
                <tr key={log.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{log.nama}</td>
                  <td className="p-2">{log.waktu}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="p-4 text-center text-gray-500">Belum ada data absensi.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Absen;