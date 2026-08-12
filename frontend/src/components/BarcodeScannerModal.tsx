import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Camera, Keyboard, X, Sparkles } from 'lucide-react';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (barcode: string) => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({ isOpen, onClose, onScanSuccess }) => {
  const [activeTab, setActiveTab] = useState<'camera' | 'manual'>('camera');
  const [manualBarcode, setManualBarcode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;
    if (isOpen && activeTab === 'camera') {
      try {
        scanner = new Html5QrcodeScanner(
          'barcode-reader',
          { fps: 10, qrbox: { width: 250, height: 180 } },
          /* verbose= */ false
        );
        scanner.render(
          (decodedText) => {
            if (scanner) {
              scanner.clear().catch(console.error);
            }
            onScanSuccess(decodedText);
          },
          () => {
            // Ignore frame scan errors
          }
        );
      } catch (err) {
        setError('Could not start camera. Please try manual entry.');
      }
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(console.error);
      }
    };
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualBarcode.trim()) {
      setError('Please enter a valid barcode number');
      return;
    }
    onScanSuccess(manualBarcode.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-[24px] overflow-hidden shadow-2xl border border-[#E5E9E6]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E5E9E6]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#DDF3E7] text-[#164B3A]">
              <Sparkles className="w-5 h-5 text-[#164B3A]" />
            </div>
            <h3 className="text-lg font-black text-[#17201C]">Scan Food Product</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full text-[#5A6561] hover:bg-[#F8F8F4]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#E5E9E6] bg-[#F8F8F4]">
          <button
            onClick={() => setActiveTab('camera')}
            className={`flex-1 py-3 text-xs font-extrabold flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'camera' ? 'border-b-2 border-[#164B3A] text-[#164B3A] bg-white' : 'text-[#5A6561]'
            }`}
          >
            <Camera className="w-4 h-4" /> Camera Scanner
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-3 text-xs font-extrabold flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'manual' ? 'border-b-2 border-[#164B3A] text-[#164B3A] bg-white' : 'text-[#5A6561]'
            }`}
          >
            <Keyboard className="w-4 h-4" /> Enter Barcode
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-[#FEF2F2] border border-[#E8785D]/30 text-[#E8785D] text-xs font-bold">
              {error}
            </div>
          )}

          {activeTab === 'camera' ? (
            <div className="space-y-2">
              <p className="text-xs text-[#5A6561] text-center font-semibold">
                Align food package barcode inside camera viewfinder below
              </p>
              <div id="barcode-reader" className="w-full rounded-[18px] overflow-hidden border border-[#E5E9E6] bg-black min-h-[260px]"></div>
            </div>
          ) : (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-[#17201C] mb-2 uppercase tracking-wider">
                  Product Barcode (GTIN / EAN-13 / UPC)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 8901058852387"
                  value={manualBarcode}
                  onChange={(e) => setManualBarcode(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#F8F8F4] border border-[#E5E9E6] text-[#17201C] font-mono text-lg placeholder-[#5A6561] focus:outline-none focus:border-[#164B3A]"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 rounded-[16px] font-extrabold bg-[#164B3A] text-white hover:bg-[#0F3629] transition-all text-xs shadow-md"
              >
                Lookup Barcode
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
