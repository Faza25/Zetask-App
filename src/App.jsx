import React from 'react';
import { Routes, Route, Link, Outlet } from 'react-router-dom';
import AbsenGamifikasi from './pages/AbsenGamifikasi';
import Kas from './pages/Kas';
import { Toaster } from 'react-hot-toast';

// Komponen Home sederhana
const Home = () => (
  <div className="p-8 text-center bg-white rounded-lg shadow-md">
    <h1 className="text-4xl font-bold">Selamat Datang di Aplikasi Absensi & Kas!</h1>
    <p className="mt-2 text-lg text-gray-600">Pilih menu di atas untuk memulai.</p>
  </div>
);

// Layout utama dengan Navbar
function Layout() {
  return (
    <div>
      <Toaster 
        position="top-center" 
        toastOptions={{
          duration: 3000,
        }}
      />
      <nav className="bg-gray-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <span className="font-semibold text-3xl">ZETASK</span>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link to="/" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</Link>
                            <Link to="/absen" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">CheckIn</Link>
                            <Link to="/kas" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Saldo</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </nav>
      <main className="bg-gray-100">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Outlet />
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="absen" element={<AbsenGamifikasi />} />
        <Route path="kas" element={<Kas />} />
      </Route>
    </Routes>
  );
}

export default App;