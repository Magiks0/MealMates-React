import {QRCodeSVG} from 'qrcode.react';
import { CheckCircle } from 'lucide-react';

function OrderStatusCard({ chat }) {
    const PICKUP_PAGE = import.meta.env.VITE_VALIDATE_PICKUP_DOMAIN;

    console.log('OrderStatusCard props:', chat);

    // if (chat.linkedOrder.status !== 'awaiting_pickup') {
    //     return (
    //         <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-3 my-2 shadow-sm text-center">
    //             <div className="flex items-center mb-2 justify-center">
    //                 <span className="font-semibold text-lg">✅ Bonne nouvelle !</span>
    //             </div>
    //             <p className="mb-3 text-sm text-left">
    //                 {chat.linkedOrder.buyer} a effectué un achat de {chat.productPrice}€ pour votre produit "{chat.productName}".
    //             </p>
    //             <p className="mb-3 text-sm text-left">
    //                 Faites scanner ce QR pour valider la transaction.
    //             </p>
    //             <div className="flex justify-center p-2 rounded-md">
    //                 <QRCodeSVG value={PICKUP_PAGE + chat.linkedOrder.qrCodeToken} />
    //             </div>
    //         </div>
    //     );
    // }


    // Message pour évaluer la transaction
    // if (chat.linkedOrder.status === 'completed' ) {
        console.log('OrderStatusCard:', chat);
    
        return (
            <div className="bg-green-100 border border-green-400 text-green-800 rounded-lg p-6 my-4 shadow-md text-center">
            <CheckCircle size={64} className="text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Commande Récupérée avec Succès !</h2>
            <p className="text-gray-700 mb-4">Le retrait pour le produit "{chat.productName}" a été validé.</p>
            <button
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                onClick={() => window.location.href = `/rate-transaction/${chat.linkedOrder.id}/${chat.otherUser.id}`}
            >
                Noter la transaction
            </button>
            </div>
        );
    // }

    return null;
}

export default OrderStatusCard;