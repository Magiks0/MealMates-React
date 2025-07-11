import { CheckCircle, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import QrCodeScanner from '../common/Product/QrCodeScanner';
import RatingService from '../../services/RatingService';

function OrderStatusCard({ chat }) {
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const navigate = useNavigate();
    const [hasRated, setHasRated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkRatingStatus = async () => {
            if (chat.linkedOrder.status === 'completed') {
                try {
                    const result = await RatingService.checkIfRated(chat.linkedOrder.id);
                    setHasRated(result);
                } catch (error) {
                    console.error('Erreur lors de la vérification de l\'évaluation:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        checkRatingStatus();
    }, [chat.linkedOrder.id, chat.linkedOrder.status]);

    if (chat.linkedOrder.role === 'seller') {
        if (chat.linkedOrder.status === 'awaiting_pickup') {
            return (
                <div className="bg-white border border-gray-200 rounded-xl p-4 my-4 mx-auto w-full max-w-sm shadow-sm text-center">
                    <div className="flex flex-col items-center justify-center">
                        <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
                        <h3 className="font-semibold text-gray-800 text-lg">Transaction à finaliser</h3>
                    </div>
                    
                    <div className="text-sm text-gray-600 my-4 space-y-2 text-left px-2">
                        <p>
                            <span className="font-semibold">{chat.linkedOrder.buyer}</span> a effectué un achat de <span className="font-semibold">"{chat.productPrice}€"</span> pour votre produit <span className="font-semibold">"{chat.productName}".</span>
                        </p>
                        <p>
                            Pour finaliser la vente, veuillez présenter ce QR Code à l'acheteur afin qu'il puisse le scanner.
                        </p>
                    </div>

                    <div className="flex justify-center">
                        <QRCodeSVG value={chat.linkedOrder.qrToken} size={100} className='border p-2 rounded-lg' />
                    </div>
                </div>
            );
        }

        if (chat.linkedOrder.status === 'completed' ) {
            if (!hasRated) {
                return (
                    <div className="bg-green-100 border border-green-400 text-green-800 rounded-lg p-6 my-4 shadow-md text-center">
                        <CheckCircle size={64} className="text-green-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Commande Récupérée avec Succès !</h2>
                        <p className="text-gray-700 mb-4">Le retrait pour le produit "{chat.productName}" a été validé.</p>
                        <button
                            className="mt-4 px-6 py-3 text-white rounded-lg font-medium transition-colors shadow-sm hover:shadow-md transform hover:scale-105 duration-200"
                            style={{ backgroundColor: '#00a43d' }}
                            onClick={() => window.location.href = `/rate-transaction/${chat.linkedOrder.id}/${chat.otherUser.id}`}
                        >
                            Noter la transaction
                        </button>
                    </div>
                );
            } else {
                return (
                <div className="bg-white border border-gray-200 rounded-xl p-6 my-4 mx-auto w-full max-w-sm shadow-sm text-center">
                    {/* En-tête avec l'icône et le titre */}
                    <div className="flex flex-col items-center justify-center">
                        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                        <h2 className="text-xl font-bold text-gray-800">Transaction Validée !</h2>
                    </div>

                    {/* Paragraphe de confirmation */}
                    <div className="text-sm text-gray-600 mt-3">
                        <p>
                            La remise du produit <span className="font-semibold">"{chat.productName}"</span> a bien été validée.
                        </p>
                    </div>
                </div>
            );
            }
        }
    } else if (chat.linkedOrder.role === 'buyer') {
        if (chat.linkedOrder.status === 'awaiting_pickup') {
            return (
                <>
                    {isScannerOpen && (
                        <QrCodeScanner
                            qrtoken={chat.linkedOrder.qrToken}
                            onClose={() => setIsScannerOpen(false)}
                        />
                    )}

                    <div className="bg-white border border-gray-200 rounded-xl p-6 my-4 mx-auto w-full max-w-sm shadow-sm text-center">
                        <div className="flex flex-col items-center justify-center">
                            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                            <h2 className="text-xl font-bold text-gray-800">Transaction Validée !</h2>
                        </div>

                        <div className="text-sm text-gray-600 mt-3">
                            <p>
                            Votre achat de <span className="font-semibold">"{chat.productName}"</span> pour <span className="font-semibold">{chat.productPrice}€</span> a bien été validée.
                            </p>
                            <p>
                                Pour finaliser la transaction, veuillez scanner le QR Code présenté par le vendeur.
                            </p>
                        </div>
                        {/* 2. On s'assure que le onClick modifie bien l'état */}
                        <button 
                            className='bg-gradient-to-r bg-secondary text-white px-4 py-2 rounded-md font-semibold text-lg shadow-lg hover:shadow-xl transform flex items-center justify-between mt-4 mx-auto gap-4' 
                            onClick={() => setIsScannerOpen(true)}
                        >
                            <QrCode /> Ouvrir le scanner
                        </button>
                    </div>
                </>
            );
        } else if (chat.linkedOrder.status === 'completed' ) {
            if (!hasRated) {
                return (
                    <div className="bg-green-100 border border-green-400 text-green-800 rounded-lg p-6 my-4 shadow-md text-center">
                        <CheckCircle size={64} className="text-green-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Commande Récupérée avec Succès !</h2>
                        <p className="text-gray-700 mb-4">Le retrait pour le produit "{chat.productName}" a été validé.</p>
                        <button
                            className="mt-4 px-6 py-3 text-white rounded-lg font-medium transition-colors shadow-sm hover:shadow-md transform hover:scale-105 duration-200"
                            style={{ backgroundColor: '#00a43d' }}
                            onClick={() => window.location.href = `/rate-transaction/${chat.linkedOrder.id}/${chat.otherUser.id}`}
                        >
                            Noter la transaction
                        </button>
                    </div>
                );
            } else {
                return (
                <div className="bg-white border border-gray-200 rounded-xl p-6 my-4 mx-auto w-full max-w-sm shadow-sm text-center">
                    <div className="flex flex-col items-center justify-center">
                        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                        <h2 className="text-xl font-bold text-gray-800">Transaction Validée !</h2>
                    </div>

                    <div className="text-sm text-gray-600 mt-3">
                        <p>
                            La reception du produit <span className="font-semibold">"{chat.productName}"</span> a bien été validée.
                        </p>
                    </div>
                </div>
            );
            }
        }
    }

    return null;
}

export default OrderStatusCard;