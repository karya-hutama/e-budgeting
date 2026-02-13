
import React from 'react';
import { Save, Globe, Database, Image as ImageIcon, Link } from 'lucide-react';
import { WebSettings } from '../../types';

interface Props {
  settings: WebSettings;
  setSettings: (settings: WebSettings) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'warning') => void;
}

const WebSettingsView: React.FC<Props> = ({ settings, setSettings, showToast }) => {
  const [formData, setFormData] = React.useState(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSettings(formData);
    showToast('Pengaturan website berhasil diperbarui.');
  };

  return (
    <div className="max-w-4xl">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 bg-gray-50/50">
          <h3 className="text-xl font-bold text-gray-800">Manajemen Website & Koneksi</h3>
          <p className="text-gray-500 text-sm">Pastikan Backend URL sudah terpasang untuk sinkronisasi data.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <label className="block">
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                  <Globe size={16} className="text-[#f68b1f]" /> Nama Website
                </span>
                <input
                  type="text"
                  value={formData.siteName}
                  onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f68b1f] outline-none transition"
                  placeholder="Contoh: Katara Budget System"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                  <Link size={16} className="text-[#f68b1f]" /> Backend URL (Apps Script)
                </span>
                <input
                  type="url"
                  value={formData.backendUrl}
                  onChange={(e) => setFormData({ ...formData, backendUrl: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f68b1f] outline-none transition font-mono text-xs"
                  placeholder="https://script.google.com/macros/s/.../exec"
                />
                <p className="text-[10px] text-gray-400 mt-2 italic">* Tempelkan URL Web App hasil deploy Apps Script Anda.</p>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                  <Database size={16} className="text-[#f68b1f]" /> Spreadsheet ID
                </span>
                <input
                  type="text"
                  value={formData.databaseId}
                  onChange={(e) => setFormData({ ...formData, databaseId: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f68b1f] outline-none transition"
                  placeholder="ID Spreadsheet dari URL"
                />
              </label>
            </div>

            <div className="space-y-6">
              <label className="block">
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                  <ImageIcon size={16} className="text-[#f68b1f]" /> URL Logo Website
                </span>
                <input
                  type="url"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f68b1f] outline-none transition"
                  placeholder="https://link-gambar.com/logo.png"
                />
              </label>

              <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100">
                <span className="text-xs font-bold text-orange-400 uppercase block mb-3">Preview Logo</span>
                <div className="h-32 flex items-center justify-center bg-white rounded-xl shadow-inner overflow-hidden border border-orange-100">
                  {formData.logoUrl ? (
                    <img src={formData.logoUrl} alt="Preview" className="max-h-full object-contain p-4" />
                  ) : (
                    <span className="text-gray-300 text-xs italic">Belum ada logo</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              className="bg-[#f68b1f] text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-[#d57618] transition shadow-lg shadow-[#f68b1f]/20 active:scale-95"
            >
              <Save size={20} /> Simpan Semua Pengaturan
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 bg-blue-50 p-6 rounded-2xl border border-blue-100 text-blue-800 text-sm">
        <h4 className="font-bold flex items-center gap-2 mb-2">
           💡 Cara Menghubungkan Spreadsheet
        </h4>
        <ol className="list-decimal ml-5 space-y-1 text-xs leading-relaxed">
          <li>Buat Google Spreadsheet baru.</li>
          <li>Pergi ke <b>Extensions</b> &gt; <b>Apps Script</b>.</li>
          <li>Copy-paste kode Backend yang disediakan.</li>
          <li>Klik <b>Deploy</b> &gt; <b>New Deployment</b>.</li>
          <li>Pilih type <b>Web App</b>, set <i>Who has access</i> ke <b>Anyone</b>.</li>
          <li>Salin URL Web App yang muncul dan tempel di input <b>Backend URL</b> di atas.</li>
        </ol>
      </div>
    </div>
  );
};

export default WebSettingsView;
