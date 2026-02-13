
/**
 * API Service untuk menghubungkan Frontend dengan Google Apps Script (Spreadsheet)
 */

export const api = {
  /**
   * Mengambil semua data dari Spreadsheet
   */
  async fetchAllData(url: string) {
    if (!url) return null;
    try {
      const response = await fetch(`${url}?action=getAll`);
      if (!response.ok) throw new Error('Gagal mengambil data dari database');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  /**
   * Menyimpan atau memperbarui data ke Spreadsheet
   * @param url URL Apps Script
   * @param sheet Nama sheet (Users, Submissions, dll)
   * @param data Objek data yang akan disimpan
   */
  async saveData(url: string, sheet: string, data: any) {
    if (!url) return null;
    try {
      // Menggunakan 'text/plain' agar browser tidak mengirim preflight OPTIONS request
      // yang sering gagal di Google Apps Script
      const response = await fetch(url, {
        method: 'POST',
        mode: 'no-cors', 
        headers: {
          'Content-Type': 'text/plain', 
        },
        body: JSON.stringify({
          action: 'save',
          sheet: sheet,
          data: data
        })
      });
      return true; 
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  /**
   * Menghapus data dari Spreadsheet
   */
  async deleteData(url: string, sheet: string, id: string) {
    if (!url) return null;
    try {
      await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({
          action: 'delete',
          sheet: sheet,
          id: id
        })
      });
      return true;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};
