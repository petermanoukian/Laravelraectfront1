// src/components/superadmin/UserFilterControls.tsx

import React from 'react';

type Props = {
  roleFilter: string | null;
  setRoleFilter: (role: string | null) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
};

const UserFilterControls: React.FC<Props> = ({
  roleFilter,
  setRoleFilter,
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <div className="flex flex-wrap gap-4 items-center mb-4">
      <select
        value={roleFilter ?? ''}
        onChange={(e) => setRoleFilter(e.target.value || null)}
        className="border px-3 py-2 rounded"
      >
        <option value="">All Roles</option>
        <option value="superadmin">Superadmin</option>
        <option value="admin">Admin</option>
        <option value="user">User</option>
      </select>

      <input
        type="text"
        placeholder="Search by name or email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border px-3 py-2 rounded w-64"
      />
    </div>
  );
};

export default UserFilterControls;
