import React, { useState, useMemo, useEffect } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

function Kas() {
  const [transactions, setTransactions] = useState(() => {
    const savedTransactions = localStorage.getItem('kasTransactions');
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('pemasukan');

  useEffect(() => {
    localStorage.setItem('kasTransactions', JSON.stringify(transactions));
  }, [transactions]);


  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!description || !amount || isNaN(parseFloat(amount))) {
      toast.error('Deskripsi dan jumlah harus diisi dengan benar.');
      return;
    }

    const newTransaction = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      type,
      date: new Date().toLocaleDateString('id-ID'),
    };
    
    setTransactions([newTransaction, ...transactions]);
    
    setDescription('');
    setAmount('');
    setIsFormVisible(false);
    toast.success('Transaksi berhasil ditambahkan!');
  };

  const totalSaldo = useMemo(() => {
    return transactions.reduce((acc, curr) => {
      return curr.type === 'pemasukan' ? acc + curr.amount : acc - curr.amount;
    }, 0);
  }, [transactions]);
  
  const formatRupiah = (number) => {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  }

  const handleClearAll = () => {
      if(window.confirm("Apakah Anda yakin ingin menghapus semua riwayat transaksi?")) {
          setTransactions([]);
          toast.success('Semua riwayat transaksi telah dihapus.');
      }
  }

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-800">Manajemen Kas</h1>
            <p className="text-sm text-gray-500">Ringkasan keuangan Anda saat ini.</p>
          </div>
          <div className="text-center">
             <p className="text-sm font-medium text-gray-500">Total Saldo</p>
             <p className="text-2xl lg:text-3xl font-bold text-green-600">{formatRupiah(totalSaldo)}</p>
          </div>
          <div>
            <button
              onClick={() => setIsFormVisible(true)}
              className="flex items-center justify-center gap-2 w-full sm:w-auto bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 active:scale-95 transition-all"
            >
              <FaPlus />
              <span>Tambah Transaksi</span>
            </button>
          </div>
        </div>
      </section>

      {isFormVisible && (
        <section className="bg-white rounded-lg shadow-md p-6">
           <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Form Transaksi Baru</h2>
              <button onClick={() => setIsFormVisible(false)} className="text-gray-500 hover:text-gray-800">
                <FaTimes size={20} />
              </button>
           </div>
            <form onSubmit={handleAddTransaction} className="space-y-4">
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Deskripsi</label>
                    <input id="description" type="text" placeholder="Contoh: Beli Kopi" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"/>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Jumlah (Rp)</label>
                        <input id="amount" type="number" placeholder="50000" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"/>
                    </div>
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Jenis Transaksi</label>
                        <select id="type" value={type} onChange={(e) => setType(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
                            <option value="pemasukan">Pemasukan</option>
                            <option value="pengeluaran">Pengeluaran</option>
                        </select>
                    </div>
                </div>
                <div className="text-right">
                    <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700">
                        Simpan Transaksi
                    </button>
                </div>
            </form>
        </section>
      )}

      <section className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Riwayat Transaksi</h2>
            {transactions.length > 0 && (
                <button onClick={handleClearAll} className="text-sm text-red-500 hover:text-red-700 font-semibold">
                    Hapus Semua
                </button>
            )}
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b-2 border-gray-200">
                    <th className="p-3">Deskripsi</th>
                    <th className="p-3">Jumlah</th>
                    <th className="p-3">Jenis</th>
                    <th className="p-3">Tanggal</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.length > 0 ? (
                        transactions.map(t => (
                        <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="p-3">{t.description}</td>
                            <td className={`p-3 font-semibold ${t.type === 'pemasukan' ? 'text-green-600' : 'text-red-600'}`}>
                            {t.type === 'pemasukan' ? '+' : '-'} {formatRupiah(t.amount)}
                            </td>
                            <td className="p-3 capitalize">{t.type}</td>
                            <td className="p-3 text-sm text-gray-600">{t.date}</td>
                        </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="p-4 text-center text-gray-500">Belum ada riwayat transaksi.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </section>
    </div>
  );
}

export default Kas;