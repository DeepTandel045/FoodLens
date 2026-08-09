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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-700">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Scan Food Product</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-900/50">
          <button
            onClick={() => setActiveTab('camera')}
            className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'camera' ? 'border-b-2 border-emerald-500 text-emerald-400 bg-slate-800/40' : 'text-slate-400'
            }`}
          >
            <Camera className="w-4 h-4" /> Camera Scanner
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'manual' ? 'border-b-2 border-emerald-500 text-emerald-400 bg-slate-800/40' : 'text-slate-400'
            }`}
          >
            <Keyboard className="w-4 h-4" /> Enter Barcode
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          {activeTab === 'camera' ? (
            <div>
              <p className="text-xs text-slate-400 text-center mb-3">
                Align food package barcode inside camera box below
              </p>
              <div id="barcode-reader" className="w-full rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 min-h-[260px]"></div>
            </div>
          ) : (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                  Product Barcode (GTIN / EAN-13 / UPC)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 8901058852387"
                  value={manualBarcode}
                  onChange={(e) => setManualBarcode(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-lg"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-bold bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-all"
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
