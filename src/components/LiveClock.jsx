import { useEffect, useState } from 'react';

const LiveClock = () => {
  const [time, setTime] = useState(getCurrentTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getCurrentTime());
    }, 1000);

    return () => clearInterval(timer); // bersihin interval pas komponen unmount
  }, []);

  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Makassar', // WITA (Waktu Indonesia Tengah)
      hour12: false
    });
  }
  return (
    <div className="px-4">
      <span>{time} WITA</span>
    </div>
  );
};

export default LiveClock;
