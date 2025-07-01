import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import OrderService from "../../services/OrderService";
import UserService from "../../services/UserService";
import { CheckCircle, XCircle, Package, Tag, DollarSign } from 'lucide-react';

export default function ValidatePickup() {
    const { qrCodeToken } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await UserService.getCurrentUser();
                setUser(data);
            } catch (err) {
                console.error(err);
                setError("Impossible de charger les informations de l'utilisateur.");
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        if (user && user.id) { 
            const fetchOrder = async () => {
                setLoading(true);
                setError(null);
                try {
                    const response = await OrderService.getOrderByUserAndToken(user.id, qrCodeToken);
                    setOrder(response);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchOrder();
        }
    }, [qrCodeToken, user]);

    const handleConfirmPickup = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await OrderService.confirmPickup(qrCodeToken); 
            if (response) {
                navigate('/home');
            }
        } catch (err) {
            setError('Échec de la confirmation : ' +  err.message );
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    if (loading && !order) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
                <div className="text-lg font-semibold text-gray-700">Chargement de la commande...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative shadow-md">
                    <strong className="font-bold">Erreur : </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative shadow-md">
                    <strong className="font-bold">Information : </strong>
                    <span className="block sm:inline">Aucune commande trouvée pour ce QR code ou cet utilisateur.</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 max-w-md w-full">
                <div className="text-center mb-6">
                    <CheckCircle size={64} className="text-green-500 mx-auto mb-3" />
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Confirmer la récupération</h1>
                    <p className="text-gray-600 mt-2">Vérifiez les détails avant de confirmer le retrait de la commande.</p>
                </div>

                <div className="border-t border-gray-200 pt-6 mt-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Détails de la Commande</h2>
                    
                    <div className="flex items-center mb-3">
                        <Tag size={20} className="text-green-600 mr-3 flex-shrink-0" />
                        <span className="text-gray-800 font-medium">{order.product?.title}</span>
                    </div>

                    <div className="flex items-center mb-3">
                        <DollarSign size={20} className="text-green-600 mr-3 flex-shrink-0" />
                        <span className="text-gray-800">
                            Prix: <span className="font-medium">{order.product?.price !== undefined ? `${order.product.price} €` : 'N/A'}</span>
                        </span>
                    </div>

                    <div className="flex items-center mb-4">
                        <Package size={20} className="text-green-600 mr-3 flex-shrink-0" />
                        <span className="text-gray-800">
                            Quantité: <span className="font-medium">{order.product.quantity}</span>
                        </span>
                    </div>
                    
                    {order.product?.file?.path && (
                        <div className="mb-4">
                            <img 
                                src={`${import.meta.env.VITE_IMG_URL}${order.product.file.path}`} 
                                alt={order.product.name || 'Produit'} 
                                className="w-full h-48 object-cover rounded-lg shadow-sm" 
                            />
                        </div>
                    )}

                </div>

                <div className="mt-8">
                    {user.id === order.buyer.id && (
                        <button 
                            onClick={handleConfirmPickup}
                            disabled={loading}
                            className={`w-full py-3 px-6 rounded-lg text-white font-semibold transition-colors duration-200 ${
                                loading ? 'bg-green-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                            }`}
                        >
                            {loading ? 'Confirmation en cours...' : 'Confirmer la récupération'}
                        </button>
                    )}
                    
                    <button 
                        onClick={() => navigate(-1)}
                        className="w-full mt-3 py-2 px-6 rounded-lg border border-gray-300 text-gray-700 font-semibold bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                    >
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    );
}
