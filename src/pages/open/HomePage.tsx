import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layouts/DefaultLayout';
import UserStatus from '@/components/open/UserStatus';

const HomePage = () => {
  const [user, setUser] = useState<null | { name: string; role: string }>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  return (
    <DefaultLayout>
      <div className="mt-3">
        <UserStatus />
      </div>
    </DefaultLayout>
  );
};

export default HomePage;
