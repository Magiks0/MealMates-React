import React from 'react';
import { Clock, MapPin, User, Heart } from 'lucide-react';

const ProductCard = ({product}) => {
  return (
    <div className="relative max-w-2xs w-64 h-full rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img 
          src='/assets/bg-first-section.png' 
          alt={product.title} 
          className="w-full h-48 object-cover"
        />
        <button className="absolute top-0 right-0 m-2 p-2 bg-white rounded-full shadow hover:bg-gray-100">
          <Heart className={`w-5 h-5 ${product.saved ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
        </button>
      </div>
      
      <div className="px-4 py-3">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-lg text-gray-800 truncate">{product.title}</h3>
          <div className="flex items-baseline">
            <span className="text-lg font-bold text-green-600">
              {product.price > 0 ? `${product.price}€` : 'Don'}
            </span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <Clock className="w-4 h-4 mr-1" /> 
          <span>{new Date(product.peremptionDate).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </span>
        </div>
        
        <div className="flex items-center text-xs text-gray-500 mb-2 pb-3">
          <MapPin className="w-4 h-4 mr-1" /> 
          <span>{product.location}</span>
        </div>
      </div>
      
      <div className="px-4 py-2 w-full bg-gray-50 border-t border-gray-100 absolute bottom-0 flex justify-between items-center">
        <div className="flex items-center">
          <User className="w-4 h-4 text-gray-500 mr-1" />
          <span className="text-sm text-gray-700">{product.user.username}</span>
        </div>
        <div className="px-2 py-1 rounded text-xs font-medium text-secondary">
          ★ {product.user.note}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;