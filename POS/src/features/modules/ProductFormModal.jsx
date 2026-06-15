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
    item_type: initialData?.item_type || 'product',
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
        itemType: formData.item_type,
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
    <div className="modal-backdrop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="report-dialog" style={{ width: 'min(560px, calc(100vw - 32px))', padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
        <header style={{ padding: '18px 24px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <h2 style={{ margin: 0, fontSize: 18, color: 'var(--brand-dark)' }}>{initialData?.id ? (formData.item_type === 'material' ? 'Edit Bahan Baku' : 'Edit Produk') : (formData.item_type === 'material' ? 'Tambah Bahan Baku' : 'Tambah Produk Baru')}</h2>
          <button type="button" onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}><X size={20} /></button>
        </header>
        
        <form id="product-form" onSubmit={handleSubmit} style={{ padding: '24px', display: 'grid', gap: 18, overflowY: 'auto', flex: 1 }}>
          <div style={{ display: 'grid', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#343941' }}>SKU / Barcode <span style={{ color: 'red' }}>*</span></label>
            <input required name="sku" value={formData.sku} onChange={handleChange} style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', border: '1px solid var(--line)', borderRadius: 6, outline: 'none' }} placeholder="Contoh: BRC-001" />
          </div>
          <div style={{ display: 'grid', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#343941' }}>{formData.item_type === 'material' ? 'Nama Bahan Baku' : 'Nama Produk'} <span style={{ color: 'red' }}>*</span></label>
            <input required name="item_name" value={formData.item_name} onChange={handleChange} style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', border: '1px solid var(--line)', borderRadius: 6, outline: 'none' }} placeholder={formData.item_type === 'material' ? 'Contoh: Biji Kopi Arabica' : 'Contoh: Kopi Susu'} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <div style={{ display: 'grid', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#343941' }}>Kategori</label>
              <select name="category_name" value={formData.category_name} onChange={handleChange} style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', border: '1px solid var(--line)', borderRadius: 6, outline: 'none', backgroundColor: '#fff' }}>
                <option value="">-- Pilih Kategori --</option>
                {(posData?.categories || []).map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#343941' }}>Harga Jual (Rp) <span style={{ color: 'red' }}>*</span></label>
              <input required type="number" name="sell_price" value={formData.sell_price} onChange={handleChange} style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', border: '1px solid var(--line)', borderRadius: 6, outline: 'none' }} placeholder="0" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <div style={{ display: 'grid', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#343941' }}>Stok Awal</label>
              <input type="number" name="qty_on_hand" value={formData.qty_on_hand} onChange={handleChange} style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', border: '1px solid var(--line)', borderRadius: 6, outline: 'none' }} placeholder="0" />
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#343941' }}>Stok Minimum</label>
              <input type="number" name="qty_minimum" value={formData.qty_minimum} onChange={handleChange} style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', border: '1px solid var(--line)', borderRadius: 6, outline: 'none' }} placeholder="0" />
            </div>
          </div>
          <div style={{ display: 'grid', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#343941' }}>Foto Produk</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
              {formData.photo_url && (
                <div style={{ width: 64, height: 64, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--line)', flexShrink: 0 }}>
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
                style={{ flex: 1, minWidth: 200, boxSizing: 'border-box', padding: '8px 12px', border: '1px dashed #ccc', borderRadius: 6, background: '#fafafa', cursor: 'pointer' }} 
              />
            </div>
          </div>
        </form>
        
        <footer style={{ padding: '16px 24px', background: '#f8fafc', borderTop: '1px solid var(--line)', display: 'flex', gap: 12, justifyContent: 'flex-end', flexShrink: 0 }}>
          <button type="button" onClick={onClose} style={{ padding: '0 16px', height: 38, border: '1px solid var(--line)', background: '#fff', borderRadius: 6, fontWeight: 600, cursor: 'pointer', color: '#343941' }}>Batal</button>
          <button form="product-form" type="submit" disabled={loading} style={{ padding: '0 16px', height: 38, border: 'none', background: 'var(--brand)', color: '#fff', borderRadius: 6, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Menyimpan...' : (formData.item_type === 'material' ? 'Simpan Bahan Baku' : 'Simpan Produk')}
          </button>
        </footer>
      </div>
    </div>
  )
}
