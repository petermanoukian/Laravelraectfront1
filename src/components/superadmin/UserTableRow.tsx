// UserTableRow.tsx 

// src/components/superadmin/UserTableRow.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';

type Role = {
  name: string;
};

type User = {
  id: number;
  name: string;
  email: string;
  roles: Role[];
};

type Props = {
  user: User;
  currentUserId: number;
  onDeleteConfirm: (userId: number) => void;
};

const UserTableRow = ({ user, currentUserId, onDeleteConfirm }: { user: User, currentUserId: number | undefined, onDeleteConfirm: Function }) => {
 

  return (
    <tr className="hover:bg-gray-50">
      <td className="border px-4 py-2">{user.id}</td>
      <td className="border px-4 py-2">{user.name}</td>
      <td className="border px-4 py-2">{user.email}</td>
      <td className="border px-4 py-2">{user.roles[0]?.name || 'N/A'}</td>
      <td className="border px-4 py-2 space-x-2">
        <NavLink
          to={`/superadmin/users/${user.id}/edit`}
          className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm"
        >
          Edit
        </NavLink>
        {user.id !== currentUserId && (
          <button
            onClick={() => onDeleteConfirm(user.id)}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            Delete
          </button>
        )}
      </td>
    </tr>
  );
};

export default UserTableRow;
