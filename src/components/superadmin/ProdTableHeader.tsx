// src/components/superadmin/SubCatTableHeader.tsx
import React from 'react';
import {  ListOrdered } from "lucide-react";


type Props = {

  sortField: string;
  sortDirection: 'asc' | 'desc';
  setSortField: (field: string) => void;
  setSortDirection: (dir: 'asc' | 'desc') => void;
  allSelected?: boolean;
  onToggleSelectAll?: () => void;
};

const ProdTableHeader: React.FC<Props> = ({
    sortField,
    sortDirection,
    setSortField,
    setSortDirection,
    allSelected,
    onToggleSelectAll,
  }) => {



    const handleSort = (field: string) => {
      if (field === sortField) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortField(field);
        setSortDirection('asc');
      }
    };
  
    const renderArrows = (field: string) => (
      <div className="flex flex-col text-xs leading-none mt-1 ml-1">
        <span className={sortField === field && sortDirection === 'asc' ? 'text-blue-600 font-bold' : 'text-gray-400'}>
          ▲
        </span>
        <span className={sortField === field && sortDirection === 'desc' ? 'text-blue-600 font-bold' : 'text-gray-400'}>
          ▼
        </span>
      </div>
    );
    return (
      <thead>
        <tr className="bg-gray-100">
          <th className="border px-4 py-2">
            <input
              type="checkbox"
              checked={allSelected ?? false}
              onChange={onToggleSelectAll}
            />
          </th>
  
          {['id', 'order', 'name', 'category','subcategory'].map((field) => (
          <th
          key={field}
          className="border px-3 py-2 text-left cursor-pointer select-none"
          onClick={() => handleSort(field)}
        >
<div className="flex items-center gap-1">
      <span>
        {field === 'order' ? (
          <ListOrdered className="w-4 h-4" title="Order" />
        ) : (
          field.charAt(0).toUpperCase() + field.slice(1)
        )}
      </span>
      {renderArrows(field)}
    </div>
        </th>
          ))}
          <th className="border px-3 py-2 text-left">Image</th>
          <th className="border px-3 py-2 text-left">Actions</th>
        </tr>
      </thead>
    );
  };

export default ProdTableHeader;
