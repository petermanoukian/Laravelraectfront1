// src/components/superadmin/UserFilterControls.tsx

import React from 'react';

type Props = {
  roleFilter: string | null;
  setRoleFilter: (role: string | null) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortField: string;
  setSortField: (field: string) => void;
  sortDirection: 'asc' | 'desc';
  setSortDirection: (dir: 'asc' | 'desc') => void;
};

const UserFilterControls: React.FC<Props> = ({
  roleFilter,
  setRoleFilter,
  searchTerm,
  setSearchTerm,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
}) => {
  return (
    <div className="flex flex-wrap gap-4 items-center mb-4">
      {/* Role Filter Dropdown */}
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

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by name or email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border px-3 py-2 rounded w-64"
      />

      {/* Sort Field */}
      <select
        value={sortField}
        onChange={(e) => setSortField(e.target.value)}
        className="border px-3 py-2 rounded"
      >
        <option value="id">ID</option>
        <option value="name">Name</option>
        <option value="email">Email</option>
        <option value="role">Role</option>
      </select>

      {/* Sort Direction */}
      <select
        value={sortDirection}
        onChange={(e) => setSortDirection(e.target.value as 'asc' | 'desc')}
        className="border px-3 py-2 rounded"
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
};

export default UserFilterControls;
