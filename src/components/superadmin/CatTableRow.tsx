
// src/components/superadmin/CatTableRow.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';

type Role = {
  name: string;
};

type Cat = {
  id: number;
  name: string;


};

type Props = {
  cat:Cat;
  currentUserRole?: string;
  onDeleteConfirm: (catId: number) => void;
  isSelected: boolean;
  onToggleSelect: (catId: number) => void;
};

const CatTableRow: React.FC<Props> = (props) => {
  const {
    cat,
    currentUserRole,
    onDeleteConfirm,
    isSelected,
    onToggleSelect,
  } = props;

  const canDelete =
    currentUserRole === 'superadmin'; 

  return (
    <tr className="hover:bg-gray-50">
       <td className="text-center border" >
        {canDelete && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(cat.id)}
            className=" mr-2 "
          />
        )}
      </td>
      <td className="border px-4 py-2">{cat.id}</td>
      <td className="border px-4 py-2">{cat.name}</td>


      <td className="border px-4 py-2 space-x-2">
        <NavLink
          to={`/superadmin/cat/edit/${cat.id}`}
          className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm"
        >
          Edit
        </NavLink>
        {canDelete && (
          <button
            onClick={() => onDeleteConfirm(cat.id)}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            Delete
          </button>
        )}
      </td>
    </tr>
  );
};

export default CatTableRow;
