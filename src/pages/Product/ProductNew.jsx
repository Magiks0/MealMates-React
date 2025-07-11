  import { useEffect, useState, useRef } from 'react';
  import { useForm } from '@tanstack/react-form';
  import { MapPin, Camera, ArrowRight, ArrowLeft, X, CheckCircle, Package, Calendar, Tag, DollarSign, Heart, Image, Home, Check } from 'lucide-react'; // Ajout d'icônes pertinentes
  import ProductService from '../../services/ProductService';
  import DashBoardService from '../../services/DashBoardService';
  import { useNavigate } from 'react-router';
  import imageCompression from 'browser-image-compression';

  export default function ProductNew() {
    const [step, setStep] = useState(1);
    const totalSteps = 5;
    const [selectedImages, setSelectedImages] = useState([]);
    const [loading, setLoading] = useState(false);
  
  // États pour la gestion de la carte et de la recherche d'adresses
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markerRef = useRef(null);
  const userMarkerRef = useRef(null);

  // TODO: Récupérer l'adresse de l'utilisateur depuis son profil
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [productTypes, setProductTypes] = useState([]);
    const [productDietaries, setProductDietaries] = useState([])
    const navigate = useNavigate();

    const form = useForm({
      defaultValues: {
        title: '',
        description: '',
        category: '',
        quantity: 1,
        peremptionDate: '',
        price: '',
        dietaries: [],
        donation: false,
        collectionDate: '',
        files: [],
        location: {
          address: '',
          coordinates: null
        }
      },
      onSubmit: async ({ value }) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('title', value.title);
        formData.append('description', value.description);
        formData.append('type', value.type);
        formData.append('quantity', value.quantity.toString());
        formData.append('peremptionDate', value.peremptionDate);
        formData.append('price', value.price.toString());
        formData.append('donation', value.donation.toString());
        formData.append('collection_date', value.collectionDate);
        formData.append('dietaries', JSON.stringify(value.dietaries)) 
        formData.append('location', JSON.stringify(value.location));

        value.files.forEach((file) => {
          formData.append(`files[]`, file);
        });

        const res = await ProductService.createProduct(formData);

        if (res.status === 'success') {
          setLoading(false);
          setStep(5);
        } else {
          console.error('Error creating product:', res);
        }
      },
    });

    useEffect(() => {
    if (step === 4) {
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      if (!window.L) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        document.body.appendChild(script);
      }
    }
  }, [step]);

  useEffect(() => {
    if (step === 4 && !leafletMapRef.current && mapRef.current && window.L) {
      leafletMapRef.current = window.L.map(mapRef.current).setView([48.8566, 2.3522], 5);

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(leafletMapRef.current);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            leafletMapRef.current.setView([latitude, longitude], 12);
            
            const userIcon = window.L.divIcon({
              html: '<div style="background-color: #4285F4; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 1px 4px rgba(0,0,0,0.3);"></div>',
              iconSize: [20, 20],
              className: 'user-location-marker'
            });
            
            userMarkerRef.current = window.L.marker([latitude, longitude], { icon: userIcon })
              .addTo(leafletMapRef.current)
              .bindPopup("Votre position actuelle");
          },
          (error) => {
            console.error("Géolocalisation refusée ou indisponible:", error);
          }
        );
      }
    }

    return () => {
      if (step !== 4 && leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
        userMarkerRef.current = null;
        markerRef.current = null;
      }
    };
  }, [step]);

  useEffect(() => {
    const searchAddresses = async () => {
      if (searchTerm.length < 3) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(
          `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(searchTerm)}&limit=5`
        );
        const data = await response.json();
        setSuggestions(data.features || []);
      } catch (error) {
        console.error('Erreur lors de la recherche d\'adresses:', error);
        setSuggestions([]);
      }
    };

    const debounceTimer = setTimeout(() => {
      searchAddresses();
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, step]);

  const handleAddressSelect = (feature) => {
    const address = feature.properties.label;
    const coordinates = feature.geometry.coordinates;
    
    setSearchTerm(address);
    setShowSuggestions(false);
    setSelectedLocation({
      address,
      coordinates: {
        lat: coordinates[1],
        lng: coordinates[0]
      }
    });

    form.setFieldValue('location', {
      address,
      coordinates: {
        lat: coordinates[1],
        lng: coordinates[0]
      }
    });

    if (leafletMapRef.current && window.L) {
      leafletMapRef.current.setView([coordinates[1], coordinates[0]], 13);
      
      if (markerRef.current) {
        markerRef.current.remove();
      }
      
      markerRef.current = window.L.marker([coordinates[1], coordinates[0]])
        .addTo(leafletMapRef.current)
        .bindPopup(address)
        .openPopup();
    }

  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleImageSelection = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const options = {
        maxSizeMB: 0.8,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: 'image/webp',
    };

    try {
        setLoading(true); // Affiche un indicateur pendant la compression
        const compressionPromises = files.map(file => imageCompression(file, options));
        const compressedFiles = await Promise.all(compressionPromises);

        const newImageUrls = compressedFiles.map(file => URL.createObjectURL(file));
        setSelectedImages(prev => [...prev, ...newImageUrls]);
        
        // On ajoute les fichiers COMPRESSÉS à l'état du formulaire
        const allFiles = [...form.getFieldValue('files'), ...compressedFiles];
        form.setFieldValue('files', allFiles);
        
        setLoading(false);
    } catch (error) {
        console.error("Erreur lors de la compression :", error);
        setLoading(false);
        alert("Une erreur est survenue lors du traitement des images.");
    }
};

    const renderProgressBar = () => {
      return (
        <div className="w-full bg-gray-200 h-1 mt-2 rounded-full overflow-hidden">
          <div 
            className="bg-green-500 h-full" 
            style={{ width: `${(step / totalSteps) * 100}%` }}
          ></div>
        </div>
      );
    };

    const removeImage = (indexToRemove) => {
      setSelectedImages(prev => prev.filter((current, currentIndex) => currentIndex !== indexToRemove));
      setSelectedFiles(prev => {
        const newFiles = prev.filter((current, currentIndex) => currentIndex !== indexToRemove);
        form.setFieldValue('files', newFiles);
        return newFiles;
      });
    };

    useEffect(() => {
      const fetchProductTypes = async () => {
        try {
          const types = await DashBoardService.getTypes();
          setProductTypes(types);
        } catch (error) {
          console.error('Error fetching product types:', error);
          throw error;
        }
      };
      fetchProductTypes();
    }, []);

    useEffect(() => {
      const fetchProductDietaries = async () => {
        try {
          const dietaries = await DashBoardService.getDietaries();
          setProductDietaries(dietaries);
        } catch(err) {
          console.error('Error fetching product dietaries:', err);
          throw err;
        }
      };
      fetchProductDietaries();
    }, [])

    if (loading) {
      return <div className="p-4 text-center">Chargement...</div>;
    }

    return (
      <div className="max-w-md mx-auto h-full bg-white rounded-lg shadow-lg overflow-y-auto">
        <div className="p-4 border-b">
          <div className="text-center text-lg font-medium">
            {step === 1 && "Poster une nouvelle annonce"}
            {step === 2 && "Poster une nouvelle annonce"}
            {step === 3 && "Ajouter des photos"}
            {step === 4 && "Ajouter une localisation"}
            {step === 5 && "Annonce publiée !"}
          </div>
          {step < 5 && renderProgressBar()}
        </div>

        {/* Content */}
        <div className="p-4 pb-16">
          <form
            className="space-y-4"
          >
            {/* Step 1: Product Details */}
            {step === 1 && (
              <>
              <h2 className='font-bold text-xl'>Décrivez votre Produit</h2>
              <p className='text-gray-500 text-sm mb-2'>Mettez en avant votre produit ! Plus il y a de détails, plus votre annonce sera de qualité. Détaillez ici ce qui a de l’importance </p>
                <div className="mb-6">
                  <h2 className="font-bold mb-1">Quel est le titre de votre annonce ?</h2>
                  <form.Field name="title">
                    {(field) => (
                      <>
                        <input
                          type="text"
                          placeholder="Ex: Tomates, Pâtes, Pizza..."
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className={'w-full p-3 border rounded-lg'}
                        />
                      </>
                    )}
                  </form.Field>
                </div>

                <div className="mb-6">
                  <h2 className="font-bold mb-1">Décrivez ce produit</h2>
                  <p className="text-gray-500 text-sm mb-2">Indiquez les caractéristiques du produit, sa marque, etc.</p>
                  <form.Field name="description">
                    {(field) => (
                      <textarea
                        placeholder="Ex: Oeufs fraichement pondus, bio, ..."
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        rows={3}
                      />
                    )}
                  </form.Field>
                </div>
              </>
            )}

            {/* Step 2: Quantity and Price */}
            {step === 2 && (
              <>
                <h2 className="font-bold mb-1 text-xl">Détaillez le produit</h2>
                <p className="text-gray-500 text-sm mb-2">Précisez les caractéristiques de votre produit pour aider les acheteurs à faire leur choix. Catégorie, régime alimentaire, allergènes… Plus vous fournissez d’informations, plus votre annonce sera pertinente !</p>
                <div className="mb-6">
                  <h2 className="font-bold mb-1">Choisissez le type correspondant à votre produit</h2>
                  <form.Field name="type">
                    {(field) => (
                      <select
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      >
                        <option value="">Sélectionner un type de produit</option>
                        {productTypes.map((type) => (
                          <option key={type.id} value={type.name}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </form.Field>
                  </div>
                  <div className="mb-6">
                    <h2 className="font-bold mb-1">Le produit correspond-il à un régime alimentaire spécifique ?</h2>
                    <p className="text-gray-500 text-sm mb-2">Sélectionnez un ou plusieurs régimes si nécessaire.</p>
                    <form.Field name="dietaries">
                      {(field) => (
                        <div className="grid grid-cols-2 gap-2">
                          {productDietaries.map((dietary) => (
                            <div key={dietary.id} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`dietary-${dietary.id}`}
                                checked={field.state.value.includes(dietary.id)}
                                onChange={(e) => {
                                  const newDietaries = e.target.checked
                                    ? [...field.state.value, dietary.id]
                                    : field.state.value.filter((id) => id !== dietary.id);
                                  field.handleChange(newDietaries);
                                }}
                                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                              />
                              <label htmlFor={`dietary-${dietary.id}`} className="ml-2 block text-sm text-gray-900">
                                {dietary.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </form.Field>
                  </div>
                <div className="mb-6">
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Quelle quantité ?</label>
                    <form.Field name="quantity">
                      {(field) => (
                        <input
                          type="number"
                          placeholder="Quantité"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(Number(e.target.value))}
                          className="w-full p-3 border border-gray-300 rounded-lg"
                          min={1}
                        />
                      )}
                    </form.Field>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Définissez la date de péremption de votre produit</label>
                    <form.Field name="peremptionDate">
                      {(field) => (
                        <input
                          type="date"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg"
                        />
                      )}
                    </form.Field>
                  </div>
                </div>
                <div className="mb-6">
                  <h2 className="font-bold mb-1">Souhaitez-vous en faire un don ?</h2>
                  <form.Field name="donation">
                    {(field) => (
                      <div className="flex items-center space-x-4">
                        <button 
                          type="button"
                          onClick={() => field.handleChange(true)}
                          className={`flex-1 py-2 px-4 rounded-lg border ${field.state.value ? 'bg-green-500 text-white border-green-600' : 'bg-white border-gray-300'}`}
                        >
                          Oui
                        </button>
                        <button 
                          type="button"
                          onClick={() => field.handleChange(false)}
                          className={`flex-1 py-2 px-4 rounded-lg border ${!field.state.value ? 'bg-green-500 text-white border-green-600' : 'bg-white border-gray-300'}`}
                        >
                          Non
                        </button>
                      </div>
                    )}
                  </form.Field>
                </div>

                <div className="mb-6">
                  <h2 className="font-bold mb-1">Quel est votre prix ?</h2>
                  <form.Field name="donation">
                    {(donationField) => (
                      <form.Field name="price">
                        {(priceField) => (
                          <div className="relative">
                            <input
                              type="number"
                              disabled={donationField.state.value}
                              placeholder="prix en €"
                              onChange={(e) => priceField.handleChange(Number(e.target.value))}
                              className={`w-full p-3 border border-gray-300 rounded-lg ${donationField.state.value ? 'bg-gray-100 text-gray-500' : ''}`}
                              step="0.01"
                            />
                            <div className="absolute right-4 top-3 text-xl font-bold text-red-500">€</div>
                          </div>
                        )}
                      </form.Field>
                    )}
                  </form.Field>
                </div>
              </>
            )}

            {/* Step 3: Photos */}
            {step === 3 && (
              <div className="mb-6">
                <h2 className="font-bold mb-1 text-xl">Ajoutez des photos</h2>
                <p className="text-gray-500 text-sm mb-2">Ajoutez des photos claires et attractives de votre produit ! Les images attirent l’attention des acheteurs, augmentent la confiance et multiplient vos chances de vendre rapidement. N’hésitez pas à montrer plusieurs angles et détails importants.</p>
                <form.Field name="files[]">
                  {(field) => (
                    <>
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {selectedImages.map((img, index) => (
                          <div key={index} className="aspect-square border border-gray-300 rounded-lg overflow-hidden bg-gray-100 relative group">
                            <img src={img} alt={`Selected ${index}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}

                        {selectedImages.length < 6 && (
                          <label className="aspect-square border border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer bg-gray-100 hover:bg-gray-200 transition-colors">
                            <Camera size={24} className="text-gray-400 mb-1" />
                            <span className="text-xs text-gray-500">Ajouter</span>
                            <input
                              name='files[]'
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={handleImageSelection}
                              className="hidden"
                              capture="environment"
                            />
                          </label>
                        )}

                        {[...Array(Math.max(0, 6 - selectedImages.length - 1))].map((_, index) => (
                          <div key={`empty-${index}`} className="aspect-square border border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                            <Camera size={24} className="text-gray-300" />
                          </div>
                        ))}
                      </div>

                      <label className="flex items-center justify-center p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg w-full cursor-pointer transition-colors">
                        <Camera size={20} className="mr-2" />
                        <span>
                          {selectedImages.length === 0 
                            ? "Ajouter des photos" 
                            : `Ajouter plus de photos (${selectedImages.length}/6)`
                          }
                        </span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageSelection}
                          className="hidden"
                          capture="environment"
                        />
                      </label>

                      {selectedImages.length > 0 && (
                        <div className="mt-2 text-sm text-gray-600 text-center">
                          {selectedImages.length} photo{selectedImages.length > 1 ? 's' : ''} sélectionnée{selectedImages.length > 1 ? 's' : ''}
                        </div>
                      )}
                    </>
                  )}
                </form.Field>
              </div>
            )}

          {/* Step 4: Location - NOUVELLE VERSION AVEC MAP ET RECHERCHE */}
          {step === 4 && (
            <div className="mb-6 h-full">
              <h2 className="font-bold mb-1">Où se trouve votre produit ?</h2>
              
              {/* Barre de recherche avec autocomplétion */}
              <div className="mb-4 relative">
                <input
                  type="text"
                  placeholder="Rechercher une adresse..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full p-3 border border-gray-300 rounded-lg pr-10"
                />
                <MapPin className="absolute right-3 top-3.5 text-gray-400" size={20} />
                
                {/* Liste des suggestions */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10 max-h-60 overflow-y-auto">
                    {suggestions.map((feature, index) => (
                      <div
                        key={index}
                        onClick={() => handleAddressSelect(feature)}
                        className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                      >
                        <div className="font-medium text-sm">{feature.properties.label}</div>
                        <div className="text-xs text-gray-500">
                          {feature.properties.context}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Adresse sélectionnée */}
              {selectedLocation && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <span className="font-medium">Adresse sélectionnée:</span> {selectedLocation.address}
                  </p>
                </div>
              )}
              
              {/* Carte */}
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden relative">
                <div ref={mapRef} className="w-full h-full" />
                {!leafletMapRef.current && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Chargement de la carte...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

            {/* Step 5: Confirmation */}
            {step === 5 && (
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                  <Check size={48} className="text-white" />
                </div>
                <h2 className="text-xl font-bold mb-2">Votre annonce a bien été publiée !</h2>
                <p className="text-gray-500 text-sm mb-6">
                  Votre annonce est maintenant visible par les utilisateurs proches de votre localisation.
                </p>

                {/* Nouvelle section de résumé */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-left shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Résumé de votre annonce</h3>
                  
                  <div className="space-y-2 text-gray-700 text-sm">
                    <div className="flex items-center">
                      <Tag size={16} className="text-green-500 mr-2 flex-shrink-0" />
                      <strong className="w-24 flex-shrink-0">Titre:</strong>
                      <span>{form.getFieldValue('title')}</span>
                    </div>
                    <div className="flex items-start">
                      <Package size={16} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <strong className="w-24 flex-shrink-0">Description:</strong>
                      <span className="break-words">{form.getFieldValue('description')}</span>
                    </div>
                    <div className="flex items-center">
                      <Tag size={16} className="text-green-500 mr-2 flex-shrink-0" />
                      <strong className="w-24 flex-shrink-0">Type:</strong>
                      <span>{form.getFieldValue('type') || 'Non spécifié'}</span>
                    </div>
                    <div className="flex items-center">
                      <Package size={16} className="text-green-500 mr-2 flex-shrink-0" />
                      <strong className="w-24 flex-shrink-0">Quantité:</strong>
                      <span>{form.getFieldValue('quantity')}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={16} className="text-green-500 mr-2 flex-shrink-0" />
                      <strong className="w-24 flex-shrink-0">Péremption:</strong>
                      <span>{form.getFieldValue('peremptionDate') || 'Non spécifiée'}</span>
                    </div>
                    
                    {form.getFieldValue('donation') ? (
                      <div className="flex items-center">
                        <Heart size={16} className="text-pink-500 mr-2 flex-shrink-0" />
                        <strong className="w-24 flex-shrink-0">Statut:</strong>
                        <span className="font-semibold text-pink-600">Don</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <DollarSign size={16} className="text-green-500 mr-2 flex-shrink-0" />
                        <strong className="w-24 flex-shrink-0">Prix:</strong>
                        <span>{form.getFieldValue('price') ? `${form.getFieldValue('price')} €` : 'Non défini'}</span>
                      </div>
                    )}

                    <div className="flex items-center">
                      <MapPin size={16} className="text-green-500 mr-2 flex-shrink-0" />
                      <strong className="w-24 flex-shrink-0">Localisation:</strong>
                      <span className="break-words">{form.getFieldValue('location.address') || 'Non spécifiée'}</span>
                    </div>

                    {form.getFieldValue('dietaries')?.length > 0 && (
                      <div className="flex items-start">
                        <Heart size={16} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <strong className="w-24 flex-shrink-0">Régimes:</strong>
                        <span className="break-words">
                          {productDietaries
                            .filter(d => form.getFieldValue('dietaries').includes(d.id))
                            .map(d => d.name)
                            .join(', ')
                          }
                        </span>
                      </div>
                    )}

                    {selectedImages.length > 0 && (
                      <div className="flex items-start">
                        <Image size={16} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <strong className="w-24 flex-shrink-0">Photos:</strong>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedImages.map((imgSrc, index) => (
                            <img key={index} src={imgSrc} alt={`Produit ${index + 1}`} className="w-12 h-12 object-cover rounded-md shadow-sm border border-gray-200" />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/home')}
                  className="w-full flex items-center justify-center space-x-2 bg-green-500 text-white py-4 px-6 rounded-lg hover:bg-green-600 mt-6"
                >
                  <Home className="w-5 h-5" />
                  <span>Retour à l'accueil</span>
                </button>
              </div>
            )}

            {step < 5 && (
            <div className="flex justify-between items-center">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="py-2 px-4 bg-gray-300 text-gray-700 rounded-lg flex items-center"
                >
                  <ArrowLeft size={20} className="mr-2" />
                  Précédent
                </button>
              )}

              {step < 4 &&   (
                <button
                    type="button"
                    onClick={nextStep}
                    className={`py-2 px-4 bg-green-500 text-white rounded-lg flex items-center ${step === 1 ? 'ml-auto' : ''}`}
                >
                    Suivant
                    <ArrowRight size={20} className="ml-2" />
                </button>
              )} {step === 4 && ( 
                <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      form.handleSubmit();
                    }}
                    className="py-2 px-4 bg-green-500 text-white rounded-lg flex items-center ml-auto"
                >
                    Publier
                </button>
              )}
            </div>
            )}
          </form>
        </div>
      </div>
    );
  }
