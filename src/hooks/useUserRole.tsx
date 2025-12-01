import { useState, useEffect } from 'react';

type UserRole = 'admin' | 'staff' | 'user' | null;

export const useUserRole = () => {
  const [role, setRole] = useState<UserRole>('user');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // TODO: Replace with backend API call to fetch user role
    // For now, default to 'user' role
    // In the future, this should call backend API: GET /api/v1/users/me/role
    console.log('useUserRole (stub) - defaulting to user role');

    setRole('user');
    setLoading(false);
  }, []);

  return { role, loading, isAdmin: role === 'admin', isStaff: role === 'staff' };
};
