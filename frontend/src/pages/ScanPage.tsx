import React, { useState } from 'react';
import { scanService } from '../services/api';
import { BarcodeScannerModal } from '../components/BarcodeScannerModal';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  AlertCircle, 
  FileText, 
  ArrowRight
} from 'lucide-react';

interface ScanPageProps {
  onNavigate: (tab: string, data?: any) => void;
}

export const ScanPage: React.FC<ScanPageProps> = ({ onNavigate }) => {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBarcodeSuccess = async (barcode: string) => {
    setIsScannerOpen(false);
    setLoading(true);
    setError('');
    try {
      const scanRes = await scanService.scanBarcode(barcode);
      onNavigate('product_details', scanRes);
    } catch (err: any) {
      setError(err.response?.data?.detail || `Barcode '${barcode}' not found in Open Food Facts. Try OCR Label Scan below!`);
    } finally {
      setLoading(false);
    }
  };

  const handleManualLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      handleBarcodeSuccess(manualBarcode.trim());
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleOcrSubmit = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError('');
    try {
      const scanRes = await scanService.scanLabelImage(selectedFile);
      onNavigate('product_details', scanRes);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'OCR label processing failed. Please try a clearer picture.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
      
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 mb-2">
          <Sparkles className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-white">Food Intelligence Scanner</h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Scan product barcodes or upload food label images to decode ingredients, nutrition, and suitability.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {loading && (
        <div className="p-8 rounded-3xl glass-panel-glow text-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h3 className="text-lg font-bold text-white">Analyzing Product Data...</h3>
          <p className="text-xs text-slate-400">Running OpenCV preprocessing, Open Food Facts lookup, & deterministic scoring</p>
        </div>
      )}

      {/* Primary Scanner Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Method 1 & 2: Barcode Scanner */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Method 1 — Barcode Scan</h3>
              <p className="text-xs text-slate-400 mt-1">Use your device camera or manually type product barcode number</p>
            </div>

            <button
              onClick={() => setIsScannerOpen(true)}
              className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <Camera className="w-5 h-5" /> Open Camera Barcode Scanner
            </button>

            <div className="pt-4 border-t border-slate-800">
              <form onSubmit={handleManualLookup} className="space-y-3">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Manual Barcode Input</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. 8901058852387"
                    value={manualBarcode}
                    onChange={(e) => setManualBarcode(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl font-bold bg-slate-800 text-emerald-400 border border-slate-700 hover:bg-slate-700"
                  >
                    Lookup
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Method 3: OCR Label Image Upload */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Method 2 — OCR Label Fallback</h3>
              <p className="text-xs text-slate-400 mt-1">Upload a photo of the food packaging nutrition label or ingredient list</p>
            </div>

            <div className="border-2 border-dashed border-slate-700 rounded-2xl p-6 text-center hover:border-teal-500 transition-colors bg-slate-900/40 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="label-upload"
              />
              <label htmlFor="label-upload" className="cursor-pointer space-y-2 block">
                {previewUrl ? (
                  <img src={previewUrl} alt="Label preview" className="max-h-32 mx-auto rounded-xl border border-slate-700" />
                ) : (
                  <>
                    <FileText className="w-10 h-10 mx-auto text-slate-500" />
                    <p className="text-xs font-semibold text-slate-300">Click to choose image or drag & drop</p>
                    <p className="text-[10px] text-slate-500">Supports JPG, PNG, WEBP</p>
                  </>
                )}
              </label>
            </div>

            {selectedFile && (
              <button
                onClick={handleOcrSubmit}
                disabled={loading}
                className="w-full py-4 rounded-2xl font-bold bg-teal-500 text-slate-950 shadow-xl shadow-teal-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                Analyze Label via OCR <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

      </div>

      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleBarcodeSuccess}
      />

    </div>
  );
};
