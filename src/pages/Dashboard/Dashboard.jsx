  import React, { useEffect, useState } from "react";
  import { useLocation } from "react-router";
  import { MapPin, Bookmark, BookmarkPlus } from "lucide-react";
  import AdvancedFilter from "../../components/Dashboard/AdvancedFilter";
  import { useSearchParams } from "react-router";
  import ProductSlider from "../../components/Dashboard/ProductSlider";
  import ProductCard from "../../components/common/ProductCard";
  import ProductService from "../../services/ProductService";
  import SavedSearches from "../../components/Dashboard/SavedSearches";
  import { listSavedSearches } from "../../services/SavedSearchService";
  import { buildSearchParams } from "../../utils/cleanParams";
  import { toast } from "react-toastify";

  export default function Dashboard() {
    const [products, setProducts] = useState([]);
    const [lastChanceProducts, setLastChanceProducts] = useState([]);
    const [recentProducts, setRecentProducts] = useState([]);
    const [recomendedProducts, setRecomendedProducts] = useState([]);
    const [filterOpen, setFilterOpen] = useState(false);
    const [filters, setFilters] = useSearchParams();
    const [searchText, setSearchText] = useState(filters.get("keyword") ?? "");
    const [savedSearches, setSavedSearches] = useState([]);
    const location = useLocation();

    useEffect(() => {
      fetchSavedSearches();
    }, []);

    const [showSavedList, setShowSavedList] = useState(false);

    useEffect(() => {
      const load = async () => {
        try {
          const [filtered, lastChance, recent] = await Promise.all([
            ProductService.getFilteredProducts(filters),
            ProductService.getLastChanceProducts(),
            ProductService.getRecentProducts(),
          ]);

          setRecomendedProducts(filtered);
          setLastChanceProducts(lastChance);lm:! 
          setRecentProducts(recent);
        } catch (error) {
          console.error("Erreur :", error);
        }
      };

      load();
    }, [filters]);

    useEffect(() => {
      if (location.state?.success) {
      toast.success("Votre transaction a bien été validée ");
      window.history.replaceState({}, document.title);
    }
  }, [location]);

    function handleShowSavedSearches() {
      setShowSavedList((open) => {
        if (!open) fetchSavedSearches();
        return !open;
      });
    }

    const hasActiveFilters = filters.toString() !== "";

    const isCurrentSearchSaved = savedSearches.some(
      (s) =>
        JSON.stringify(s.criteria) ===
        JSON.stringify(Object.fromEntries([...filters]))
    );

    async function fetchSavedSearches() {
      try {
        const data = await listSavedSearches();
        setSavedSearches(data);
      } catch (e) {
        console.error("Erreur chargement recherches :", e);
      }
    }

    return (
      <div className="h-full flex flex-col bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm z-10 px-4 flex-shrink-0">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <MapPin className="w-5 h-5 text-gray-500 mr-2" />
              <div className="font-medium">10 Rue de la Paix, Paris</div>
            </div>
            <div className="flex items-center space-x-1">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setFilterOpen(true)}
                  className="p-2 text-white"
                  aria-label="Filtres avancés"
                >
                  <img src="/assets/filter-icon.png" alt="filter-icon" />
                </button>
                <SavedSearches
                  filters={filters}
                  setFilters={setFilters}
                  searchText={searchText}
                  setSearchText={setSearchText}
                  savedSearches={savedSearches}
                  fetchSavedSearches={fetchSavedSearches}
                  showSavedList={showSavedList}
                  setShowSavedList={setShowSavedList}
                  hasActiveFilters={hasActiveFilters}
                />
              </div>
            </div>
          </div>

          <div className="px-4 pb-3">
            <div className="relative">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const next = buildSearchParams(filters, {
                      keyword: searchText.trim() || null,
                    });
                    setFilters(next);
                  }
                }}
                placeholder="Rechercher..."
                className="w-10/12 p-2 pl-9 border rounded-md bg-gray-100"
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-2 top-2.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="px-4 py-2 bg-green-50 flex items-center justify-between">
              <div className="text-sm text-green-800">
                Produits filtrés ({recomendedProducts.length})
              </div>
            </div>
          )}
        </div>

        {/* Contenu conditionnel */}
        {hasActiveFilters ? (
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recomendedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ) : (
          <>
            <ProductSlider
              sectionTitle="Nos recommendations"
              products={recomendedProducts}
            />
            <ProductSlider
              sectionTitle="Dernières chances !"
              products={lastChanceProducts}
            />
            <ProductSlider
              sectionTitle="Récemment ajoutés"
              products={recentProducts}
            />
          </>
        )}

        {/* Filtres avancés */}
        <AdvancedFilter
          isOpen={filterOpen}
          onClose={() => setFilterOpen(false)}
        />
        {filterOpen && (
          <div
            className="fixed inset-0 bg-black opacity-20 z-40"
            onClick={() => setFilterOpen(false)}
          ></div>
        )}
      </div>
    );
  }
