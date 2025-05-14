import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import ProductService from '../services/ProductService';

export default function SavedSearchDropdown({ visible, onClose }) {
  const [searches, setSearches] = useState([]);
  const [, setParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!visible) return;
    ProductService.getSavedSearches()
      .then(setSearches)
      .catch(console.error);
  }, [visible]);

  if (!visible || !searches.length) return null;

  const handleClick = (s) => {
    setParams(new URLSearchParams(Object.entries(s.filters)));
    onClose();
    navigate(0); 
  };

  return (
    <ul className="absolute left-0 right-0 mt-1 bg-white shadow-lg rounded-md z-20 max-h-60 overflow-y-auto">
      {searches.map((s) => (
        <li
          key={s.id}
          onMouseDown={() => handleClick(s)}  
          className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
        >
          {s.name}
        </li>
      ))}
    </ul>
  );
}
