import { useRef } from "react";
import ProductCard from "../common/ProductCard";

const ProductSlider = ({ sectionTitle, products }) => {
  const scrollContainer = useRef(null);
  const limitedProducts = products.slice(0, 10);

  const scrollLeft = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({ left: -330, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({ left: 330, behavior: "smooth" });
    }
  };

  return (
    <div className="relative mb-12">
      <div className="flex justify-between items-center mb-2 px-8 py-4">
        <h2 className="text-2xl font-bold text-gray-800">{sectionTitle}</h2>
        <div className="flex space-x-2">
          <button
            onClick={scrollLeft}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            aria-label="Défiler à gauche"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            onClick={scrollRight}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            aria-label="Défiler à droite"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
      <div
        ref={scrollContainer}
        className="flex overflow-x-auto scrollbar-hide scroll-smooth gap-8"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {limitedProducts.map((product) => (
          <div key={product.id} className="flex-shrink-0 w-64 px-8 pb-6">
            <ProductCard product={product} />
          </div>
        ))}

        <div className="flex-shrink-0 w-68 p-6">
          <a
            href="#"
            className="block h-full border border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
          >
            <div className="flex flex-col items-center justify-center h-full p-6">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
              <span className="text-gray-700 font-medium">Voir plus</span>
            </div>
          </a>
        </div>
      </div>

      {/* CSS pour masquer la scrollbar sur Chrome, Safari et Opera */}
      <style>{`
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`}</style>
    </div>
  );
};

export default ProductSlider;
