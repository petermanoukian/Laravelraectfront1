
// src/components/superadmin/CatTableRow.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';

type Role = {
  name: string;
};

type Tagg = {
  id: number;
  name: string;
  subcats_count: number;
  catprods_count: number;

};

type Props = {
  tagg:Tagg;
  currentUserRole?: string;
  onDeleteConfirm: (TaggId: number) => void;
  isSelected: boolean;
  onToggleSelect: (TaggId: number) => void;
};

const TaggTableRow: React.FC<Props> = (props) => {
  const {
    tagg,
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
            onChange={() => onToggleSelect(tagg.id)}
            className=" mr-2 "
          />
        )}
      </td>
      <td className="border px-4 py-2 size-20">{tagg.id}</td>
      <td className="border px-4 py-2">{tagg.name}</td>


      <td className="border px-4 py-2 space-x-2">
        <NavLink
          to={`/superadmin/tagg/edit/${tagg.id}`}
          className="bg-blue-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm"
        >
          Edit
        </NavLink>

        {canDelete && (
          <button
            onClick={() => onDeleteConfirm(tagg.id)}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            Delete
          </button>
        )}

    <NavLink
      to={`/superadmin/addtaggprod/0/${tagg.id}`}
 className="bg-blue-400 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm"
      title="Add Product to Tagg"
    >

      <span>Add Tags</span>
    </NavLink>

    <NavLink
      to={`/superadmin/viewtaggprod/view/0/${tagg.id}`}
      className="bg-blue-400 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm"
       title="View Products in Tagg"
    >
   
      <span>View Tags</span>
    </NavLink>



      </td>
    </tr>
  );
};

export default TaggTableRow;
