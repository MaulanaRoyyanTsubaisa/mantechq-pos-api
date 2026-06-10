import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { createProduct, updateProduct, uploadProductPhoto } from '../../shared/api/posApi.js'

export function ProductFormModal({ posData, onClose, onSuccess, initialData }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    sku: initialData?.sku || '',
    item_name: initialData?.item_name || '',
    category_name: initialData?.category_name || '',
    sell_price: initialData?.sell_price || '',
    qty_on_hand: initialData?.qty_on_hand || '',
    qty_minimum: initialData?.qty_minimum || '',
    photo_url: initialData?.photo_url || '',
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
      const payload = {
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
      }
      if (initialData?.id) {
        await updateProduct(initialData.id, payload)
        toast.success('Produk berhasil diperbarui')
      } else {
        await createProduct(payload)
        toast.success('Produk berhasil ditambahkan')
      }
      onSuccess()
    } catch (err) {
      toast.error('Gagal menyimpan produk')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="report-dialog" style={{ width: 480, padding: 0, overflow: 'hidden' }}>
        <header style={{ padding: '20px 24px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: 18, color: 'var(--brand-dark)' }}>{initialData?.id ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}><X size={20} /></button>
        </header>
        
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'grid', gap: 16, maxHeight: '65vh', overflowY: 'auto' }}>
          <div style={{ display: 'grid', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#343941' }}>SKU / Barcode <span style={{ color: 'red' }}>*</span></label>
            <input required name="sku" value={formData.sku} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--line)', borderRadius: 6, outline: 'none' }} placeholder="Contoh: BRC-001" />
          </div>
          <div style={{ display: 'grid', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#343941' }}>Nama Produk <span style={{ color: 'red' }}>*</span></label>
            <input required name="item_name" value={formData.item_name} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--line)', borderRadius: 6, outline: 'none' }} placeholder="Contoh: Kopi Susu" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ display: 'grid', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#343941' }}>Kategori</label>
              <input name="category_name" value={formData.category_name} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--line)', borderRadius: 6, outline: 'none' }} placeholder="Contoh: Minuman" />
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#343941' }}>Harga Jual (Rp) <span style={{ color: 'red' }}>*</span></label>
              <input required type="number" name="sell_price" value={formData.sell_price} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--line)', borderRadius: 6, outline: 'none' }} placeholder="0" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ display: 'grid', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#343941' }}>Stok Awal</label>
              <input type="number" name="qty_on_hand" value={formData.qty_on_hand} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--line)', borderRadius: 6, outline: 'none' }} placeholder="0" />
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#343941' }}>Stok Minimum</label>
              <input type="number" name="qty_minimum" value={formData.qty_minimum} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--line)', borderRadius: 6, outline: 'none' }} placeholder="0" />
            </div>
          </div>
          <div style={{ display: 'grid', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#343941' }}>Foto Produk</label>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              {formData.photo_url && (
                <div style={{ width: 64, height: 64, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--line)' }}>
                  <img src={formData.photo_url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <input 
                type="file" 
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    try {
                      toast.loading('Mengunggah foto...', { id: 'upload-toast' })
                      const res = await uploadProductPhoto(file)
                      setFormData(prev => ({ ...prev, photo_url: res.url }))
                      toast.success('Foto berhasil diunggah', { id: 'upload-toast' })
                    } catch (err) {
                      toast.error('Gagal mengunggah foto', { id: 'upload-toast' })
                    }
                  }
                }} 
                style={{ flex: 1, padding: '8px 12px', border: '1px dashed #ccc', borderRadius: 6, background: '#fafafa', cursor: 'pointer' }} 
              />
            </div>
          </div>
        </form>
        
        <footer style={{ padding: '16px 24px', background: '#f8fafc', borderTop: '1px solid var(--line)', display: 'flex', gap: 12, justifyItems: 'flex-end', justifyContent: 'flex-end' }}>
          <button type="button" onClick={onClose} style={{ padding: '0 16px', height: 38, border: '1px solid var(--line)', background: '#fff', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>Batal</button>
          <button onClick={handleSubmit} disabled={loading} style={{ padding: '0 16px', height: 38, border: 'none', background: 'var(--brand)', color: '#fff', borderRadius: 6, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Menyimpan...' : 'Simpan Produk'}
          </button>
        </footer>
      </div>
    </div>
  )
}
