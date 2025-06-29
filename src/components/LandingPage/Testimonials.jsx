import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

export default function Testimonials() {
  const [currentPage, setCurrentPage] = useState(0);
  
  const testimonials = [
    {
      id: 1,
      name: "Grégoire Carton",
      title: "Spécialiste Informatique",
      text: "Cette une entreprise dans laquelle j'ai confiance et je peux avoir plein de conseils adaptés à mes besoins. Je crois très sincèrement qu'ils sont dignes de notre confiance et ils ne m'ont jamais déçu car ils ont toujours leur parole et j'apprécie leur service.",
      rating: 5
    },
    {
      id: 2,
      name: "Sophie Dubois",
      title: "Directrice Marketing",
      text: "Un service client exceptionnel et des solutions adaptées à nos besoins professionnels. Je recommande vivement leurs services à toutes les entreprises.",
      rating: 5
    },
    {
      id: 3,
      name: "Marc Lefevre",
      title: "Entrepreneur",
      text: "Cela fait maintenant 3 ans que je travaille avec eux et je n'ai jamais été déçu. Rapidité, efficacité et professionnalisme sont au rendez-vous.",
      rating: 4
    },
    {
      id: 4,
      name: "Gérard Menvussa",
      title: "Spécialiste Informatique",
      text: "Cette une entreprise dans laquelle j'ai confiance et je peux avoir plein de conseils adaptés à mes besoins. Je crois très sincèrement qu'ils sont dignes de notre confiance et ils ne m'ont jamais déçu car ils ont toujours leur parole et j'apprécie leur service.",
      rating: 5
    },
    {
      id: 5,
      name: "Sophie Dubois",
      title: "Fondateur de Test.com",
      text: "Un service client exceptionnel et des solutions adaptées à nos besoins professionnels. Je recommande vivement leurs services à toutes les entreprises.",
      rating: 5
    },
    {
      id: 6,
      name: "Jean Valjan",
      title: "Entrepreneur",
      text: "Cela fait maintenant 3 ans que je travaille avec eux et je n'ai jamais été déçu. Rapidité, efficacité et professionnalisme sont au rendez-vous.",
      rating: 4
    }
  ];

  const isMobile = window.innerWidth < 768;
  const totalPages = isMobile ? testimonials.length : Math.ceil(testimonials.length / 3);

  const nextPage = () => {
    setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const getVisibleTestimonials = () => {
    const startIdx = currentPage * 3;
    const endIdx = Math.min(startIdx + 3, testimonials.length);
    return testimonials.slice(startIdx, endIdx);
  };

  const getMobileTestimonial = () => {
    return testimonials[currentPage];
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star 
          key={i} 
          size={16} 
          fill={i < rating ? "#FFD700" : "none"} 
          color={i < rating ? "#FFD700" : "#D3D3D3"} 
        />
      );
    }
    return stars;
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4">
      <div className="relative">
        <div className="block md:hidden">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {getMobileTestimonial() && (
              <div className="p-6 flex flex-col items-center">
                <img 
                  src="/api/placeholder/100/100" 
                  alt={getMobileTestimonial().name} 
                  className="w-24 h-24 rounded-full object-cover mb-4"
                />
                
                <div className="flex mb-2">
                  {renderStars(getMobileTestimonial().rating)}
                </div>
                
                <div className="text-center mb-4 text-gray-600 italic">
                  <p className="mb-4">{getMobileTestimonial().text}</p>
                </div>
                
                <div className="text-center">
                  <p className="font-bold text-lg">{getMobileTestimonial().name}</p>
                  <p className="text-sm text-gray-500">{getMobileTestimonial().title}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="hidden md:grid md:grid-cols-3 md:gap-4">
          {getVisibleTestimonials().map((testimonial) => (
            <div 
              key={testimonial.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6 flex flex-col items-center">
                <img 
                  src={`https://randomuser.me/api/portraits/men/${testimonial.id}.jpg`} 
                  alt={testimonial.name} 
                  className="w-24 h-24 rounded-full object-cover mb-4"
                />
                
                <div className="flex mb-2">
                  {renderStars(testimonial.rating)}
                </div>
                
                <div className="text-center mb-4 text-gray-600 italic">
                  <p className="mb-4 text-sm">{testimonial.text}</p>
                </div>
                
                <div className="text-center">
                  <p className="font-bold text-lg">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <button 
        className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6 md:-translate-x-12 bg-white rounded-full p-2 shadow-md"
        onClick={prevPage}
        aria-label="Précédent"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-6 md:translate-x-12 bg-white rounded-full p-2 shadow-md"
        onClick={nextPage}
        aria-label="Suivant"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};
