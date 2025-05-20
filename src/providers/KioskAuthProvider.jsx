import { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import KioskAuthContext from '@/context/KiosAuth';

export default function KioskAuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const timerRef = useRef(null);

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    setUser(null);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      logout();
    }, 100000);
  }, [logout]);

  const login = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    resetTimer();
  };

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'scroll', 'click'];

    events.forEach((event) => window.addEventListener(event, resetTimer));

    // trigger reset saat mount kalau user sudah login
    if (user) resetTimer();

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [resetTimer, user]);

  return <KioskAuthContext.Provider value={{ user, login, logout }}>{children}</KioskAuthContext.Provider>;
}

KioskAuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};
