import React, { useState, useMemo, useEffect } from 'react';
import { FaCheck, FaPuzzlePiece, FaGift, FaHourglassHalf, FaFire } from 'react-icons/fa';
import toast from 'react-hot-toast';

const CHECKIN_REWARDS = [
  { day: 1, points: 5 },
  { day: 2, points: 5 },
  { day: 3, points: 10 },
  { day: 4, points: 10 },
  { day: 5, points: 15 },
  { day: 6, points: 15 },
  { day: 7, points: 50, isSpecial: true },
];

const COOLDOWN_PERIOD_MS = 24 * 60 * 60 * 1000;

function AbsenGamifikasi() {
  const [currentStreak, setCurrentStreak] = useState(() => {
    const saved = localStorage.getItem('currentStreak');
    return saved ? JSON.parse(saved) : 0;
  });

  const [totalPoints, setTotalPoints] = useState(() => {
    const saved = localStorage.getItem('totalPoints');
    return saved ? JSON.parse(saved) : 0;
  });

  const [lastCheckInTimestamp, setLastCheckInTimestamp] = useState(() => {
    const saved = localStorage.getItem('lastCheckInTimestamp');
    return saved ? JSON.parse(saved) : null;
  });

  const [consecutiveStreak, setConsecutiveStreak] = useState(() => {
    const saved = localStorage.getItem('consecutiveStreak');
    return saved ? JSON.parse(saved) : 0;
  });

  const [cooldownMessage, setCooldownMessage] = useState('');

  useEffect(() => {
    localStorage.setItem('currentStreak', JSON.stringify(currentStreak));
    localStorage.setItem('totalPoints', JSON.stringify(totalPoints));
    localStorage.setItem('lastCheckInTimestamp', JSON.stringify(lastCheckInTimestamp));
    localStorage.setItem('consecutiveStreak', JSON.stringify(consecutiveStreak));
  }, [currentStreak, totalPoints, lastCheckInTimestamp, consecutiveStreak]);


  const isCooldownActive = useMemo(() => {
    if (!lastCheckInTimestamp) return false;
    return (Date.now() - lastCheckInTimestamp) < COOLDOWN_PERIOD_MS;
  }, [lastCheckInTimestamp]);

  useEffect(() => {
    if (!isCooldownActive) {
      setCooldownMessage('');
      return;
    }

    const intervalId = setInterval(() => {
      const endTime = lastCheckInTimestamp + COOLDOWN_PERIOD_MS;
      const remainingTime = endTime - Date.now();

      if (remainingTime <= 0) {
        setCooldownMessage('');
        clearInterval(intervalId);
        return;
      }

      const hours = Math.floor(remainingTime / (1000 * 60 * 60));
      const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

      setCooldownMessage(`Tersedia dalam ${hours}j ${minutes}m ${seconds}d`);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isCooldownActive, lastCheckInTimestamp]);


  const handleCheckIn = () => {
    if (isCooldownActive) {
      toast.error("Anda masih dalam periode cooldown.");
      return;
    }

    if (lastCheckInTimestamp) {
      const lastDate = new Date(lastCheckInTimestamp);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      if (lastDate.toDateString() !== yesterday.toDateString() && lastDate.toDateString() !== today.toDateString()) {
        setConsecutiveStreak(1);
      } else if (lastDate.toDateString() === yesterday.toDateString()) {
        setConsecutiveStreak(prev => prev + 1);
      }
    } else {
      setConsecutiveStreak(1);
    }

    const newStreak = currentStreak >= CHECKIN_REWARDS.length ? 1 : currentStreak + 1;
    const reward = CHECKIN_REWARDS[newStreak - 1];
    
    setCurrentStreak(newStreak);
    setTotalPoints(prevPoints => prevPoints + reward.points);
    setLastCheckInTimestamp(Date.now());
    
    toast.success(`Check-in berhasil! Anda mendapatkan ${reward.points} poin.`);
  };
  
  const handleReset = () => {
    setCurrentStreak(0);
    setTotalPoints(0);
    setLastCheckInTimestamp(null);
    setConsecutiveStreak(0);
    toast('Progres telah di-reset.', { icon: '🔄' });
  }

  return (
    <section className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-shrink-0 text-center md:text-left">
          <h2 className="text-xl font-bold text-gray-800">Absensi Harian</h2>
          <div className="flex items-center justify-center md:justify-start gap-4 mt-2">
            <div className="text-lg font-bold text-indigo-600 flex items-center gap-2">
              <FaGift />
              <span>{totalPoints} Poin</span>
            </div>
            <div className="text-lg font-bold text-orange-500 flex items-center gap-2">
              <FaFire />
              <span>{consecutiveStreak} Hari</span>
            </div>
          </div>
        </div>
        <div className="w-full flex-grow flex items-center justify-center">
          {CHECKIN_REWARDS.map((reward, index) => {
            const isCompleted = index < currentStreak;
            return (
              <React.Fragment key={reward.day}>
                {index > 0 && (<div className={`flex-auto h-1.5 ${isCompleted ? 'bg-blue-500' : 'bg-gray-300'}`}></div>)}
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-lg transition-all duration-300 border-4 ${isCompleted ? 'bg-blue-500 border-blue-600' : 'bg-gray-300 border-gray-400'}`}>
                    {reward.isSpecial ? <FaPuzzlePiece /> : <FaCheck />}
                  </div>
                  <p className={`mt-2 text-xs font-semibold ${isCompleted ? 'text-blue-600' : 'text-gray-500'}`}>+{reward.points}</p>
                </div>
              </React.Fragment>
            );
          })}
        </div>
        <div className="flex-shrink-0 w-48 text-center">
          <button
            onClick={handleCheckIn}
            disabled={isCooldownActive}
            className={`w-full px-4 py-3 rounded-lg font-bold text-white transition-all duration-200 flex items-center justify-center gap-2 ${isCooldownActive ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 active:scale-95'}`}
          >
            {isCooldownActive ? <FaHourglassHalf /> : 'Check-in Hari Ini'}
            <span>{isCooldownActive ? 'Cooldown' : ''}</span>
          </button>
          {cooldownMessage && (
            <p className="text-xs text-indigo-600 font-semibold mt-2 animate-pulse">
                {cooldownMessage}
            </p>
          )}
           <button onClick={handleReset} className="block mx-auto mt-2 text-xs text-gray-400 hover:text-red-500">(Reset Progres)</button>
        </div>
      </div>
    </section>
  );
}

export default AbsenGamifikasi;