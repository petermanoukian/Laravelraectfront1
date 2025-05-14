
// src/components/superadmin/CatTableRow.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Pencil, Trash2 , Plus, PlusCircle, Eye} from 'lucide-react';

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


  type Product = {
  id: number;            // Product ID
  name: string;          // Product name
  prix: number;          // Price (could be decimal, type `number` will handle decimals)
  des: string;           // Description (text field)
  dess: string;          // Detailed description (WYSIWYG editor content, HTML)
  img: string | null;      // Now correctly a string path
  pdf: string | null;      // Also a string path
  catid: number;        // Category ID
  subid: number;      // Subcategory ID
  vis: '0' | '1';        // Visibility (enum, either '0' or '1')
  quan: number;          // Quantity (integer)
  ordd: number;          // Order number (number)
  cat?: Cat; 
  sub?: SubCat;       // Subcategory object
};

type Props = {
  prod:Product;
  currentUserRole?: string;
  baseUrl: string;
  onDeleteConfirm: (prodId: number) => void;
  isSelected: boolean;
  onToggleSelect: (prodId: number) => void;
};

const ProdTableRow: React.FC<Props> = (props) => {
  const {
    prod,
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
            onChange={() => onToggleSelect(prod.id)}
            className=" mr-2 "
          />
        )}
      </td>
      <td className="border px-3 py-2 size-20">{prod.id}</td>
      <td className="border px-3 py-2 size-20">{prod.ordd}</td>
      <td className="border px-3 py-2">{prod.name}</td>
      <td className="border px-3 py-2">{prod.cat?.name}</td> 
      <td className="border px-3 py-2">{prod.sub?.name}</td>
      <td className="border px-3 py-2">

        {prod.img ? (
          <a
            href={`${baseUrl}${prod.img}`}
            target="_blank"
            rel="noopener noreferrer"
            title="View full image"
          >
            <img
              src={`${baseUrl}${prod.img.replace('prod/img/', 'prod/img/thumb/')}`}
              alt="Product"
              className="w-16 h-16 object-cover rounded hover:opacity-80"
            />
          </a>
        ) : (
          <img
            src={`${baseUrl}prod/img/nopic.jpg`}
            alt="No Product"
            className="w-16 h-16 object-cover rounded"
          />
        )}

      {prod.pdf ? (
        <a
          href={`${baseUrl}${prod.pdf}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          Open File
        </a>
      ) : (
        <span>No File</span>
      )}

      </td>





      <td className="border px-4 py-2 space-x-2">
      

        <div className="flex flex-col space-y-1">
          {/* Action Buttons */}
          <div className="flex space-x-2">
            <NavLink
              to={`/superadmin/prod/edit/${prod.id}`}
              className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm"
              title="Edit Product"
            >
              <Pencil className="w-4 h-4 inline" />
            </NavLink>

            {canDelete && (
              <button
                onClick={() => onDeleteConfirm(prod.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                title="Delete Product"
              >
                <Trash2 className="w-4 h-4 inline" />
              </button>
            )}
          </div>

          {/* Tagg Actions */}
          <div className="mt-0">
            <div className="font-semibold text-sm text-gray-700 mb-1">Tags:</div>
            <div className="flex space-x-2">
              <NavLink
                to={`/superadmin/addtaggprod/${prod.id}/0`}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                title="Add Tagg to Product"
              >
                <PlusCircle className="w-4 h-4 inline" />
              </NavLink>

              <NavLink
                to={`/superadmin/viewtaggprod/view/${prod.id}/0`}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                title="View Taggs for Product"
              >
                <Eye className="w-4 h-4 inline" />
              </NavLink>
            </div>
          </div>
        </div>




      </td>
    </tr>
  );
};

export default ProdTableRow;
