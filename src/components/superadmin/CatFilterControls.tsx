//  CatFilterControls.tsx
// src/components/superadmin/CatFilterControls.tsx

import React from 'react';

type Props = {
 
  
  searchTerm: string;
  setSearchTerm: (term: string) => void;
};

const CatFilterControls: React.FC<Props> = ({
 
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <div className="flex flex-wrap gap-4 items-center mb-4">


      <input
        type="text"
        placeholder="Search by name "
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border px-3 py-2 rounded w-64"
      />
    </div>
  );
};

export default CatFilterControls;


