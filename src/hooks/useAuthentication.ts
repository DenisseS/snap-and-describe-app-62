
import { useAuth as useAuthContext } from '../contexts/AuthContext';

export const useAuthentication = () => {
  return useAuthContext();
};
