// ProdFilterControls.tsx 


import React from 'react';
import Select from 'react-select';

type Prod = {
    id: number;
    name: string;
    prods_count: number;

  };

  type Tagg = {
    id: number;
    name: string;
    taggs_count: number;
  };

type Props = {
 
  prods: Prod[];
  taggs: Tagg[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedProdId: string;
  setSelectedProdId: (id: string) => void;
  selectedTaggId: string;
  setSelectedTaggId: (id: string) => void;


};

const ProdTaggFilterControls: React.FC<Props> = ({
  prods = [],
  taggs = [],
  searchTerm,
  setSearchTerm,
  selectedProdId,
  setSelectedProdId,
  selectedTaggId,
  setSelectedTaggId,

}) => {



  const prodOptions = [
    { value: '', label: 'All Products' },
    ...prods.map((prod) => ({
      value: String(prod.id),
      label: `${prod.name}`,

  
    })),
  ];


  const taggOptions = [
    { value: '', label: 'All Tags' },
    ...taggs.map((tagg) => ({
      value: String(tagg.id),
      label: `${tagg.name}`, 

    })),
  ];


  return (
    <>
        <div className="flex flex-wrap gap-4 items-center mb-4">
   

                <Select
                options={prodOptions}
                onChange={(selectedOption) =>
                    setSelectedProdId(selectedOption?.value || '')
                }
                value={
                    prodOptions.find((option) => option.value === selectedProdId) || null
                }
                placeholder="Select a product"
                isSearchable={true}
                className="w-85"
                classNamePrefix="react-select"
                />


                <Select
                options={taggOptions}
                onChange={(selectedOption) =>
                    setSelectedTaggId(selectedOption?.value || '')
                }
                value={
                    taggOptions.find((option) => option.value === selectedTaggId) || null
                }
                placeholder="Select a tag..."
                isSearchable={true}
                className="w-75"
                classNamePrefix="react-select"
                />



       </div>
    
    </>

  );
};

export default ProdTaggFilterControls;




