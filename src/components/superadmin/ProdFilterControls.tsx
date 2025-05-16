// ProdFilterControls.tsx 


import React from 'react';
import Select from 'react-select';

type Cat = {
    id: number;
    name: string;
    subcats_count: number;
    catprods_count: number;
  };

  type Subcat = {
    id: number;
    name: string;
    catid: number; 
    subprods_count: number;
  };

  type Tagg = {
    id: number;
    name: string;
  };

  type Props = {
    alltags: Tagg[];
    cats: Cat[];
    subcats: Subcat[];
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedCategoryId: string;
    setSelectedCategoryId: (id: string) => void;
    selectedSubcategoryId: string;
    setSelectedSubcategoryId: (id: string) => void;
    taggids: number[];
    handleTaggidsChange: (selectedOptions: { value: number; label: string }[]) => void;
  };

  const ProdFilterControls: React.FC<Props> = ({
    cats = [],
    subcats = [],
    alltags = [], 
    searchTerm,
    setSearchTerm,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedSubcategoryId,
    setSelectedSubcategoryId,
    taggids,
    handleTaggidsChange,
  }) => {



  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...cats.map((cat) => ({
      value: String(cat.id),
      label: `${cat.name}-(${cat.subcats_count}subcategories-${cat.catprods_count} Items)`,
      subcats_count: cat.subcats_count,
      catprods_count: cat.catprods_count,
    })),
  ];


  const subcategoryOptions = [
    { value: '', label: 'All Subcategories' },
    ...subcats.map((subcat) => ({
      value: String(subcat.id),
      label: `${subcat.name}-(${subcat.subprods_count} Items)`, 
      subprods_count: subcat.subprods_count, 
    })),
  ];

  const tagOptions = [
    { value: '', label: 'All Tags' },
    ...alltags.map((tag) => ({
      value: tag.id,
      label: tag.name,
    })),
  ];
  console.log('tagOptions inside filtercontrols:', tagOptions);


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
                className="w-85"
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
                className="w-75"
                classNamePrefix="react-select"
              />

            <Select
              options={tagOptions}
              isMulti={true}
              onChange={handleTaggidsChange}
              value={tagOptions.filter((opt) => taggids.includes(opt.value))}
              placeholder="Select tags..."
              isSearchable={true}
              className="w-[98%]"
              classNamePrefix="react-select"
            />


       </div>
    
    </>

  );
};

export default ProdFilterControls;




