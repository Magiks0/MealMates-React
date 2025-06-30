import { CheckCircle, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';
import QrCodeScanner from '../common/Product/QrCodeScanner'

function OrderStatusCard({ chat }) {
    const PICKUP_PAGE = import.meta.env.VITE_VALIDATE_PICKUP_DOMAIN;

    const [isScannerOpen, setIsScannerOpen] = useState(false);

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
                        <QRCodeSVG value={PICKUP_PAGE + chat.linkedOrder.qrCodeToken} size={100} className='border p-2 rounded-lg' />
                    </div>
                </div>
            );
        }

        if (chat.linkedOrder.status === 'completed' ) {
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
                            La remise du produit <span className="font-semibold">"{chat.productName}"</span> a bien été enregistrée.
                        </p>
                    </div>
                </div>
            );
        }
    } else if (chat.linkedOrder.role === 'buyer') {
        if (chat.linkedOrder.status === 'awaiting_pickup') {
            return (
                <>
                    {isScannerOpen && (
                        <QrCodeScanner
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
        }
    }

    return null;
}

export default OrderStatusCard;