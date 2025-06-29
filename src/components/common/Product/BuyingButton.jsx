import ProductService from "../../../services/ProductService";
import { ShoppingCart } from 'lucide-react';

const BuyingButton = ({productId}) => {
    const handleCheckout = async () => {
    try {
      const { url } = await ProductService.goToCheckout(productId);
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error(error);
      alert('Une erreur est survenue lors du processus de paiement. Veuillez réessayer plus tard.');
    }
  };

  return (
    <button 
        className="bg-gradient-to-r bg-secondary text-white px-8 py-4 rounded-md font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center"
        onClick={() => {
            handleCheckout();
        }}
    >
        <ShoppingCart size={20} className="mr-2" />
        Acheter
    </button>
  )
}

export default BuyingButton