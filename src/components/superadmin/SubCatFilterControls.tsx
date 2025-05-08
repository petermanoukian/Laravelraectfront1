//  SubCatFilterControls.tsx
// src/components/superadmin/SubCatFilterControls.tsx

import React from 'react';
import Select from 'react-select';

type Cat = {
    id: number;
    name: string;
  };

type Props = {
 
  cats: Cat[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategoryId: string;
  setSelectedCategoryId: (id: string) => void;
};

const SubCatFilterControls: React.FC<Props> = ({
  cats = [],
  searchTerm,
  setSearchTerm,
  selectedCategoryId,
  setSelectedCategoryId,

}) => {


  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...cats.map((cat) => ({
      value: String(cat.id),
      label: cat.name,
    })),
  ];

  return (
    <>
        <div className="flex flex-wrap gap-4 items-center mb-4">
            <input
                type="text"
                placeholder="Search by name "
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border px-3 py-2 rounded w-64"
            />


<Select
  options={categoryOptions}
  onChange={(selectedOption) =>
    setSelectedCategoryId(selectedOption?.value || '')
  }
  value={
    categoryOptions.find((option) => option.value === selectedCategoryId) || null
  }
  placeholder="Select a category..."
  isSearchable={true}
  className="w-64"
  classNamePrefix="react-select"
/>

            {/*}
            <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="border px-3 py-2 rounded w-64"
           
            >
            <option value="">All Categories</option>
            {Array.isArray(cats) && cats.length > 0 ? (
                cats.map((cat) => (
                <option key={cat.id} value={String(cat.id)}>
                    {cat.name}
                </option>
                ))
            ) : (
                <option disabled>No categories available</option>
            )}
            </select>

            */}


       </div>
    
    </>

  );
};

export default SubCatFilterControls;


