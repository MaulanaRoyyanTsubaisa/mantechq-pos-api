import React, { useState } from 'react'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { createCustomer } from '../../shared/api/posApi.js'

export function CustomerFormModal({ posData, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  })

  const orgId = posData?.memberships?.[0]?.org_id
  const outletId = posData?.memberships?.[0]?.outlet_id

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!orgId) {
      return toast.error('Organisasi tidak ditemukan')
    }

    setLoading(true)
    try {
      await createCustomer({
        orgId,
        outletId,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
      })
      toast.success('Pelanggan berhasil ditambahkan')
      onSuccess()
    } catch (err) {
      toast.error('Gagal menambahkan pelanggan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">Tambah Pelanggan Baru</h2>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-700 bg-white rounded-full shadow-sm">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[70vh]">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">Nama Pelanggan <span className="text-red-500">*</span></label>
            <input required name="name" value={formData.name} onChange={handleChange} className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-sm" placeholder="Contoh: Budi Santoso" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">No. Telepon / WhatsApp</label>
            <input name="phone" value={formData.phone} onChange={handleChange} className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-sm" placeholder="Contoh: 08123456789" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-sm" placeholder="Contoh: budi@gmail.com" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">Alamat</label>
            <textarea name="address" value={formData.address} onChange={handleChange} className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-sm min-h-[80px]" placeholder="Masukkan alamat lengkap..." />
          </div>
        </form>
        <div className="p-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Batal</button>
          <button onClick={handleSubmit} disabled={loading} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Menyimpan...' : 'Simpan Pelanggan'}
          </button>
        </div>
      </div>
    </div>
  )
}
