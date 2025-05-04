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
  role: string; // ✅ Assuming one role per user
};

type Props = {
  user: User;
  currentUserId?: number;
  currentUserRole?: string;
  onDeleteConfirm: (userId: number) => void;
  isSelected: boolean;
  onToggleSelect: (userId: number) => void;
};

const UserTableRow: React.FC<Props> = (props) => {
  const {
    user,
    currentUserId,
    currentUserRole,
    onDeleteConfirm,
    isSelected,
    onToggleSelect,
  } = props;

  const canDelete =
    currentUserRole === 'superadmin' && currentUserId !== user.id; 

  return (
    <tr className="hover:bg-gray-50">
       <td className="text-center border" >
        {canDelete && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(user.id)}
            className=" mr-2 "
          />
        )}
      </td>
      <td className="border px-4 py-2">{user.id}</td>
      <td className="border px-4 py-2">{user.name}</td>
      <td className="border px-4 py-2">{user.email}</td>
      <td className="border px-4 py-2">
      {user.roles.length > 0 ? user.roles[0].name : 'No role assigned'}

        </td>
      <td className="border px-4 py-2 space-x-2">
        <NavLink
          to={`/superadmin/users/${user.id}/edit`}
          className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm"
        >
          Edit
        </NavLink>
        {canDelete && (
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
