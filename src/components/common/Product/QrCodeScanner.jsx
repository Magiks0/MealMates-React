import React from 'react';
import { X, ScanLine } from 'lucide-react';
import { useNavigate } from 'react-router';
import BarcodeScanner from "react-qr-barcode-scanner";


const QrCodeScanner = ({ onClose }) => {
    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="relative bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md border">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <ScanLine className="text-secondary" size={24} />
                        <h2 className="text-xl font-bold text-secondary ">Scanner le Code</h2>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 text-slate-400 rounded-full hover:bg-secondary hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-black flex justify-center items-center">
                    <BarcodeScanner
                        className="absolute inset-0 w-full h-full object-cover"
                        onUpdate={(err, result) => {
                            if (result) {
                                onClose();
                                navigate('/validate-pickup/' + result.text);
                            }
                        }}
                    />

                    <div className="absolute inset-0">
                        <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-secondary rounded-tl-lg"></div>
                        <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-secondary rounded-tr-lg"></div>
                        <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-secondary rounded-bl-lg"></div>
                        <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-secondary rounded-br-lg"></div>
                        <div className="absolute top-0 left-0 right-0 h-1 bg-secondary shadow-[0_0_20px_theme('colors.secondary')] animate-scan"></div>
                    </div>
                </div>

                <p className="text-center text-secondary  mt-4 text-sm">
                    Positionnez le QR Code du vendeur dans le cadre.
                </p>
            </div>
        </div>
    );
};

export default QrCodeScanner;