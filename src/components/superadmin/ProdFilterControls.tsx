// ProdFilterControls.tsx 


import React from 'react';
import Select from 'react-select';

type Cat = {
    id: number;
    name: string;
  };

  type Subcat = {
    id: number;
    name: string;
    catid: number; 
  };

type Props = {
 
  cats: Cat[];
  subcats: Subcat[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategoryId: string;
  setSelectedCategoryId: (id: string) => void;
  selectedSubcategoryId: string;
  setSelectedSubcategoryId: (id: string) => void;


};

const ProdFilterControls: React.FC<Props> = ({
  cats = [],
  subcats = [],
  searchTerm,
  setSearchTerm,
  selectedCategoryId,
  setSelectedCategoryId,
  selectedSubcategoryId,
  setSelectedSubcategoryId,

}) => {


  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...cats.map((cat) => ({
      value: String(cat.id),
      label: cat.name,
    })),
  ];

    const subcategoryOptions = [
        { value: '', label: 'All Subcategories' },
        ...subcats.map((subcat) => ({
        value: String(subcat.id),
        label: subcat.name,
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

                <Select
                options={subcategoryOptions}
                onChange={(selectedOption) =>
                    setSelectedSubcategoryId(selectedOption?.value || '')
                }
                value={
                    subcategoryOptions.find((option) => option.value === selectedSubcategoryId) || null
                }
                placeholder="Select a subcategory..."
                isSearchable={true}
                className="w-64"
                classNamePrefix="react-select"
                />


       </div>
    
    </>

  );
};

export default ProdFilterControls;




