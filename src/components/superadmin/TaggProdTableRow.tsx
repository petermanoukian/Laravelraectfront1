
// src/components/superadmin/TaggProdTableRow.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Pencil, Trash2 , Plus, PlusCircle, Eye} from 'lucide-react';

type Role = {
  name: string;
};

type Prod = {
  id: number;
  name: string;
};

type Tagg = {
    id: number;
    name: string;
 

  };


  type TaggProd = {
  id: number;            // Product ID
  prod?: Prod; 
  tagg?: Tagg;       // Subcategory object
};

type Props = {
  taggprod:TaggProd ;
  currentUserRole?: string;
  baseUrl: string;
  onDeleteConfirm: (taggprodId: number) => void;
  isSelected: boolean;
  onToggleSelect: (taggprodId: number) => void;
};

const TaggProdTableRow: React.FC<Props> = (props) => {
  const {
    taggprod,
    baseUrl,
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
            onChange={() => onToggleSelect(taggprod.id)}
            className=" mr-2 "
          />
        )}
      </td>
      <td className="border px-3 py-2 size-20">{taggprod.id}</td>
      <td className="border px-3 py-2">{taggprod.prod?.name}</td> 
      <td className="border px-3 py-2">{taggprod.tagg?.name}</td>
     



      <td className="border px-4 py-2 space-x-2">
      

        <div className="flex flex-col space-y-1">
          {/* Action Buttons */}
          <div className="flex space-x-2">
            <NavLink
              to={`/superadmin/edittaggprod/${taggprod.id}`}
              className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm"
              title="Edit Product"
            >
              <Pencil className="w-4 h-4 inline" />
            </NavLink>

            {canDelete && (
              <button
                onClick={() => onDeleteConfirm(taggprod.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                title="Delete Product"
              >
                <Trash2 className="w-4 h-4 inline" />
              </button>
            )}
          </div>

 
        </div>




      </td>
    </tr>
  );
};

export default TaggProdTableRow;
