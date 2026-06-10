import React, { useState } from 'react'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { createProduct } from '../../shared/api/posApi.js'

export function ProductFormModal({ posData, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    sku: '',
    item_name: '',
    category_name: '',
    sell_price: '',
    qty_on_hand: '',
    qty_minimum: '',
    photo_url: '',
  })

  const orgId = posData?.memberships?.[0]?.org_id
  const outletId = posData?.memberships?.[0]?.outlet_id

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!orgId || !outletId) {
      return toast.error('Organisasi / Outlet tidak ditemukan')
    }

    setLoading(true)
    try {
      await createProduct({
        orgId,
        outletId,
        sku: formData.sku,
        itemName: formData.item_name,
        categoryName: formData.category_name,
        sellPrice: Number(formData.sell_price),
        qtyOnHand: Number(formData.qty_on_hand),
        qtyMinimum: Number(formData.qty_minimum),
        photoUrl: formData.photo_url,
        createdBy: posData?.user?.id
      })
      toast.success('Produk berhasil ditambahkan')
      onSuccess()
    } catch (err) {
      toast.error('Gagal menambahkan produk')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">Tambah Produk Baru</h2>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-700 bg-white rounded-full shadow-sm">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[70vh]">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">SKU / Barcode <span className="text-red-500">*</span></label>
            <input required name="sku" value={formData.sku} onChange={handleChange} className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-sm" placeholder="Contoh: BRC-001" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">Nama Produk <span className="text-red-500">*</span></label>
            <input required name="item_name" value={formData.item_name} onChange={handleChange} className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-sm" placeholder="Contoh: Kopi Susu" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">Kategori</label>
            <input name="category_name" value={formData.category_name} onChange={handleChange} className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-sm" placeholder="Contoh: Minuman" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">Harga Jual (Rp) <span className="text-red-500">*</span></label>
            <input required type="number" name="sell_price" value={formData.sell_price} onChange={handleChange} className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-sm" placeholder="Contoh: 15000" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">Stok Awal</label>
              <input type="number" name="qty_on_hand" value={formData.qty_on_hand} onChange={handleChange} className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-sm" placeholder="0" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">Stok Minimum</label>
              <input type="number" name="qty_minimum" value={formData.qty_minimum} onChange={handleChange} className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-sm" placeholder="0" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">Foto Produk</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setFormData(prev => ({ ...prev, photo_url: reader.result }));
                  };
                  reader.readAsDataURL(file);
                }
              }} 
              className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-sm" 
            />
            {formData.photo_url && formData.photo_url.startsWith('data:image') && (
              <img src={formData.photo_url} alt="Preview" className="mt-2 h-24 object-contain rounded border" />
            )}
          </div>
        </form>
        <div className="p-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Batal</button>
          <button onClick={handleSubmit} disabled={loading} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Menyimpan...' : 'Simpan Produk'}
          </button>
        </div>
      </div>
    </div>
  )
}
