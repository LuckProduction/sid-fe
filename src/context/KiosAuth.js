import { createContext, useContext } from 'react';

const KioskAuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {}
});

export default KioskAuthContext;

export const useKioskAuth = () => useContext(KioskAuthContext);
