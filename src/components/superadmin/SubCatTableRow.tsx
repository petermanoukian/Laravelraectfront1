
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

type SubCat = {
    id: number;
    name: string;
    catid: number;
    cat: Cat;
  };

type Props = {
  subcat:SubCat;
  currentUserRole?: string;
  onDeleteConfirm: (subcatId: number) => void;
  isSelected: boolean;
  onToggleSelect: (subcatId: number) => void;
};

const SubCatTableRow: React.FC<Props> = (props) => {
  const {
    subcat,
    currentUserRole,
    onDeleteConfirm,
    isSelected,
    onToggleSelect,
  } = props;

  const canDelete =
    currentUserRole === 'superadmin'; 

  return (
    <tr className="hover:bg-gray-50 ">
       <td className="text-center border size-16" >
        {canDelete && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(subcat.id)}
            className=" mr-2 "
          />
        )}
      </td>
      <td className="border px-4 py-2 size-20">{subcat.id}</td>
      <td className="border px-4 py-2">{subcat.name}</td>
      <td className="border px-4 py-2">{subcat.cat.name}</td> 

      <td className="border px-4 py-2 space-x-2">
        <NavLink
          to={`/superadmin/subcat/edit/${subcat.id}`}
          className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm"
        >
          Edit
        </NavLink>

        <NavLink
            to={`/superadmin/subcats/view/${subcat.id}`}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
          >
            View Subcategories
          </NavLink>

          <NavLink
            to={`/superadmin/subcats/add/${subcat.id}`}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
          >
            Add Subcategories
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

export default SubCatTableRow;
