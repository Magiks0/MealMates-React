import React, { useState } from 'react';

const SelectInput = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options, 
  placeholder = "Sélectionner une option", 
  className = "", 
  optionValueKey = "id", 
  optionLabelKey = "name" 
}) => {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 ${className}`}
      >
        <option value="">{placeholder}</option>
        {options && options.map((option) => (
          <option 
            key={option[optionValueKey]} 
            value={option[optionValueKey]}
          >
            {option[optionLabelKey]}
          </option>
        ))}
      </select>
    </div>
  );
};

const SelectInputDemo = () => {
  const [formValues, setFormValues] = useState({
    category: '',
    cuisine: '',
    difficulty: ''
  });
  
  const dietetics = [
    { id: 1, name: 'Sans gluten' },
    { id: 2, name: 'Végétarien' },
    { id: 3, name: 'Végétalien' },
    { id: 4, name: 'Sans lactose' }
  ];
  
  const cuisines = [
    { id: 'fr', name: 'Française' },
    { id: 'it', name: 'Italienne' },
    { id: 'jp', name: 'Japonaise' },
    { id: 'mx', name: 'Mexicaine' }
  ];
  
  const difficulties = [
    { id: 'easy', name: 'Facile' },
    { id: 'medium', name: 'Moyen' },
    { id: 'hard', name: 'Difficile' }
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };
  
  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Filtres de recettes</h2>
      
      <SelectInput 
        label="Régime alimentaire"
        name="category"
        value={formValues.category}
        onChange={handleChange}
        options={dietetics}
        placeholder="Sélectionner un régime"
      />
    </div>
  );
};

export default SelectInputDemo;