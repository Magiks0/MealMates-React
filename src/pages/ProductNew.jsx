import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { MapPin, Camera, ArrowRight, ArrowLeft } from 'lucide-react';
import ProductService from '../services/ProductService';

export default function ProductNew() {
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  const [selectedImages, setSelectedImages] = useState([]);

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      category: '',
      quantity: 1,
      peremptionDate: '',
      price: 0,
      donation: false,
      collectionDate: '',
      files: [],
      location: {
        address: '',
        coordinates: null
      }
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData();
      formData.append('title', value.title);
      formData.append('description', value.description);
      formData.append('category', value.category);
      formData.append('quantity', value.quantity.toString());
      formData.append('peremptionDate', value.peremptionDate);
      formData.append('price', value.price.toString());
      formData.append('donation', value.donation.toString());
      formData.append('collection_date', value.collectionDate);
      formData.append('location', JSON.stringify(value.location));

      value.files.forEach((file) => {
        formData.append('files[]', file);
      });

      const res = await ProductService.createProduct(formData);

      if (res.status !== 200) {
        
      } else {
        console.log('Annonce créée avec succès:', res.data);
        alert(res.message);
        form.reset();
        setStep(1);
        setSelectedImages([]);
      }
    },
  });

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleImageSelection = (e) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages(files.map(file => URL.createObjectURL(file)));
    form.setFieldValue('files', files);
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

  return (
    <div className="max-w-md mx-auto h-screen bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="text-center text-lg font-medium">
          {step === 1 && "Poster une nouvelle annonce"}
          {step === 2 && "Poster une nouvelle annonce"}
          {step === 3 && "Ajouter des photos"}
          {step === 4 && "Ajouter une localisation"}
          {step === 5 && "Votre annonce a bien été publiée"}
        </div>
        {step < 5 && renderProgressBar()}
      </div>

      {/* Content */}
      <div className="p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (step < totalSteps) {
              nextStep();
            } else {
              form.handleSubmit();  // Appel direct de form.handleSubmit()
            }
          }}
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
                    <input
                      type="text"
                      placeholder="Ex: Tomates, Pâtes, Pizza..."
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
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
                    <h2 className="font-bold mb-1">Choisissez une catégorie correspondant à votre produit</h2>
                    <form.Field name="category">
                      {(field) => (
                        <select
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg"
                        >
                          <option value="">Sélectionner une catégorie</option>
                          <option value="fruits">Fruits</option>
                          <option value="legumes">Légumes</option>
                          <option value="cereales">Céréales</option>
                          <option value="autres">Autres</option>
                        </select>
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
                            placeholder="Prix"
                            value={priceField.state.value}
                            onChange={(e) => priceField.handleChange(Number(e.target.value))}
                            className={`w-full p-3 border border-gray-300 rounded-lg ${donationField.state.value ? 'bg-gray-100 text-gray-500' : ''}`}
                            min={0}
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
              <form.Field name="files">
                {(field) => (
                  <>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {selectedImages.length > 0 ? (
                        selectedImages.map((img, index) => (
                          <div key={index} className="aspect-square border border-gray-300 rounded-lg overflow-hidden bg-gray-100">
                            <img src={img} alt={`Selected ${index}`} className="w-full h-full object-cover" />
                          </div>
                        ))
                      ) : (
                        <>
                          <label className="aspect-square border border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer bg-gray-100">
                            <Camera size={24} className="text-gray-400 mb-1" />
                            <input
                              name='files[]'
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={handleImageSelection}
                              className="hidden"
                            />
                          </label>
                          {[...Array(5)].map((_, index) => (
                            <div key={index} className="aspect-square border border-gray-300 rounded-lg flex items-center justify-center bg-gray-100">
                              <Camera size={24} className="text-gray-400" />
                            </div>
                          ))}
                        </>
                      )}
                    </div>

                    {selectedImages.length === 0 && (
                      <label className="flex items-center justify-center p-3 bg-green-500 text-white rounded-lg w-full cursor-pointer">
                        <Camera size={20} className="mr-2" />
                        <span>Ajouter des photos</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageSelection}
                          className="hidden"
                        />
                      </label>
                    )}
                  </>
                )}
              </form.Field>
            </div>
          )}

          {/* Step 4: Location */}
          {step === 4 && (
            <div className="mb-6">
              <h2 className="font-bold mb-1">Où se trouve votre produit ?</h2>
              <div className="mb-4">
                <form.Field name="location.address">
                  {(field) => (
                    <input
                      type="text"
                      placeholder="Adresse"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  )}
                </form.Field>
              </div>
              
              <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                {/* Map placeholder - in a real app you would integrate a map component here */}
                <div className="w-full h-full bg-green-100 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin size={30} className="mx-auto mb-2 text-green-500" />
                    <span>Carte interactive</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Confirmation */}
          {step === 5 && (
            <div className="text-center mb-6">
              <div className="w-32 h-32 mx-auto mb-4">
                <img src="/api/placeholder/128/128" alt="Confirmation" className="w-full" />
              </div>
              <h2 className="text-xl font-bold mb-2">Votre annonce a bien été publiée !</h2>
              <p className="text-gray-500 text-sm mb-6">
                Votre annonce est maintenant visible par les utilisateurs proches de votre localisation.
              </p>
            </div>
          )}

          {/* Navigation buttons */}
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

            {step < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="py-2 px-4 bg-green-500 text-white rounded-lg flex items-center"
              >
                Suivant
                <ArrowRight size={20} className="ml-2" />
              </button>
            ) : (
              <button
                type="submit"
                className="py-2 px-4 bg-green-500 text-white rounded-lg"
              >
                Publier
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
