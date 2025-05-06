// src/components/superadmin/CatTableHeader.tsx
import React from 'react';

type Props = {

  allSelected?: boolean;
  onToggleSelectAll?: () => void;
};

const CatTableHeader: React.FC<Props> = ({
    allSelected,
    onToggleSelectAll,
  }) => {
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
  
          {['id', 'name'].map((field) => (
            <th
              key={field}
              className="border px-4 py-2 text-left cursor-pointer select-none"
            >
              <div className="flex flex-col items-start">
                <span>{field.charAt(0).toUpperCase() + field.slice(1)}</span>
              
              </div>
            </th>
          ))}
          <th className="border px-4 py-2 text-left">Actions</th>
        </tr>
      </thead>
    );
  };

export default CatTableHeader;
