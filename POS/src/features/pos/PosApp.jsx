import React, { useState, useEffect } from 'react'
import { ArrowLeft, Search, ShoppingCart, Minus, Plus, Trash2, CheckCircle2, ChevronRight, Store, X } from 'lucide-react'
import { toast } from 'sonner'
import { membershipOutletLabel, parseCurrencyInput, formatRupiah, formatQty } from '../../shared/lib/formatters.js'
import { createSale } from '../../shared/api/posApi.js'
import './pos.css'

export function PosApp({ posData, onClose }) {
  const outletOptions = posData?.memberships?.map(membershipOutletLabel) || []
  const firstOutlet = outletOptions[0] || ''
  const [selectedOutlet, setSelectedOutlet] = useState(firstOutlet)

  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Semua')
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false) // Mobile cart drawer
  
  // Checkout state
  const [paymentMethod, setPaymentMethod] = useState('Tunai')
  const [cashReceived, setCashReceived] = useState('')
  const [discountTotal, setDiscountTotal] = useState('0')
  const [taxTotal, setTaxTotal] = useState('0')
  const [saving, setSaving] = useState(false)
  const [receipt, setReceipt] = useState(null)

  useEffect(() => {
    if (selectedOutlet || !firstOutlet) return
    setSelectedOutlet(firstOutlet)
  }, [firstOutlet, selectedOutlet])

  const membership = posData?.memberships?.find((item) => membershipOutletLabel(item) === selectedOutlet) || posData?.memberships?.[0]
  
  const allStock = (posData?.stockItems || []).filter((item) => item.outlet_id === membership?.outlet_id && item.is_active)
  
  // Extract unique categories
  const categories = ['Semua', ...new Set(allStock.map(item => item.category_name).filter(Boolean))]

  const filteredStock = allStock.filter((item) => {
    const textMatch = `${item.item_name} ${item.sku}`.toLowerCase().includes(query.toLowerCase())
    const catMatch = selectedCategory === 'Semua' || item.category_name === selectedCategory
    return textMatch && catMatch
  })

  const subtotal = cart.reduce((sum, item) => sum + Math.max((item.qty * item.price) - item.discount, 0), 0)
  const discountValue = parseCurrencyInput(discountTotal)
  const taxValue = parseCurrencyInput(taxTotal)
  const grandTotal = Math.max(subtotal - discountValue + taxValue, 0)
  
  const cashValue = parseCurrencyInput(cashReceived)
  const change = Math.max(cashValue - grandTotal, 0)

  const addToCart = (item) => {
    const stockQty = Number(item.qty_on_hand || 0)
    if (stockQty <= 0) {
      toast.error('Stok produk ini kosong.')
      return
    }

    setCart((current) => {
      const existing = current.find((row) => row.id === item.id)
      if (existing) {
        if (existing.qty + 1 > stockQty) {
          toast.error('Kuantitas melebihi stok yang tersedia.')
          return current
        }
        return current.map((row) => (row.id === item.id ? { ...row, qty: row.qty + 1 } : row))
      }
      return [
        ...current,
        {
          id: item.id,
          sku: item.sku,
          item_name: item.item_name,
          unit: item.unit || 'Pcs',
          stock: stockQty,
          qty: 1,
          price: Number(item.sell_price || 0),
          discount: 0,
        },
      ]
    })
  }

  const updateCartQty = (id, delta) => {
    setCart((current) => current.map((item) => {
      if (item.id !== id) return item
      const nextQty = item.qty + delta
      if (nextQty > item.stock) {
        toast.error('Kuantitas melebihi stok yang tersedia.')
        return item
      }
      if (nextQty < 1) return item
      return { ...item, qty: nextQty }
    }))
  }

  const removeCartItem = (id) => {
    setCart((current) => current.filter((item) => item.id !== id))
  }

  const resetTransaction = () => {
    setCart([])
    setDiscountTotal('0')
    setTaxTotal('0')
    setPaymentMethod('Tunai')
    setCashReceived('')
    setIsCartOpen(false)
  }

  const handleCheckout = async () => {
    if (!cart.length) return toast.error('Keranjang kosong.')
    if (paymentMethod === 'Tunai' && cashValue < grandTotal) {
      return toast.error('Uang tunai kurang dari total bayar.')
    }

    setSaving(true)
    try {
      const payload = {
        outlet_id: membership.outlet_id,
        items: cart.map(c => ({ item_id: c.id, qty: c.qty, price: c.price, discount: c.discount })),
        discount: discountValue,
        tax: taxValue,
        payment_method: paymentMethod,
        amount_paid: paymentMethod === 'Tunai' ? cashValue : grandTotal,
        note: '',
      }
      const data = await createSale(payload)
      toast.success('Transaksi berhasil disimpan.')
      setReceipt({
        ...payload,
        id: data.sale?.id || 'TRX-' + Date.now(),
        total: grandTotal,
        change: change,
        date: new Date().toLocaleString('id-ID'),
      })
      resetTransaction()
    } catch (err) {
      toast.error('Gagal memproses transaksi.')
    } finally {
      setSaving(false)
    }
  }

  if (receipt) {
    return (
      <div className="pos-layout" style={{ alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', maxWidth: '400px', width: '100%', boxShadow: '0 12px 40px rgba(0,0,0,0.08)' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ width: 64, height: 64, background: '#ecfdf5', color: '#08a88c', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle2 size={32} />
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: '#0f172a' }}>Transaksi Sukses</h2>
            <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>No: {receipt.id}</p>
          </div>
          
          <div style={{ borderTop: '1px dashed #e2e8f0', borderBottom: '1px dashed #e2e8f0', padding: '16px 0', margin: '16px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <span style={{ color: '#64748b' }}>Total Tagihan</span>
              <strong style={{ color: '#0f172a' }}>{formatRupiah(receipt.total)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <span style={{ color: '#64748b' }}>Metode Bayar</span>
              <strong style={{ color: '#0f172a' }}>{receipt.payment_method}</strong>
            </div>
            {receipt.payment_method === 'Tunai' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ color: '#64748b' }}>Kembalian</span>
                <strong style={{ color: '#08a88c' }}>{formatRupiah(receipt.change)}</strong>
              </div>
            )}
          </div>
          
          <button onClick={() => setReceipt(null)} style={{ width: '100%', padding: '14px', background: '#08a88c', color: '#fff', border: 'none', borderRadius: '10px', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
            Transaksi Baru
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="pos-layout">
      {/* Header */}
      <header className="pos-header">
        <div className="pos-header-left">
          <button className="pos-close-btn" onClick={onClose}>
            <ArrowLeft size={16} />
            <span>Kembali</span>
          </button>
          <div className="pos-brand">
            ManTechQ PoS
          </div>
        </div>
        <div className="pos-header-right">
          <div className="pos-outlet-badge">
            <Store size={14} />
            {selectedOutlet || 'Pilih Outlet'}
          </div>
          <div className="pos-time">
            {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="pos-main">
        {/* Left: Product Catalog */}
        <section className="pos-catalog">
          <div className="pos-toolbar">
            <div className="pos-search-bar">
              <Search size={18} color="#94a3b8" />
              <input 
                type="text" 
                placeholder="Cari nama produk atau SKU..." 
                value={query} 
                onChange={e => setQuery(e.target.value)}
              />
            </div>
            <div className="pos-categories">
              {categories.map(cat => (
                <button 
                  key={cat} 
                  className={`pos-cat-chip ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          <div className="pos-grid-wrap">
            <div className="pos-grid">
              {filteredStock.map(item => (
                <div key={item.id} className="pos-product-card" onClick={() => addToCart(item)}>
                  <div className="pos-product-name">{item.item_name}</div>
                  <div className="pos-product-sku">{item.sku}</div>
                  <div className="pos-product-price">{formatRupiah(item.sell_price)}</div>
                  <div className={`pos-product-stock ${item.qty_on_hand <= 5 ? 'low' : ''}`}>
                    Stok: {formatQty(item.qty_on_hand)} {item.unit || 'Pcs'}
                  </div>
                </div>
              ))}
              {filteredStock.length === 0 && (
                <div style={{ gridColumn: '1 / -1', padding: 40, textAlign: 'center', color: '#94a3b8' }}>
                  Tidak ada produk ditemukan.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Right / Bottom Sheet: Cart Panel */}
        <div className={`pos-scrim ${isCartOpen ? 'visible' : ''}`} onClick={() => setIsCartOpen(false)}></div>
        <aside className={`pos-cart-panel ${isCartOpen ? 'open' : ''}`}>
          <div className="pos-cart-header">
            <h2>
              <ShoppingCart size={20} />
              Pesanan Saat Ini
            </h2>
            <button className="pos-cart-close" onClick={() => setIsCartOpen(false)}>
              <X size={20} />
            </button>
          </div>
          
          <div className="pos-cart-body">
            {cart.length === 0 ? (
              <div className="pos-empty-cart">
                <ShoppingCart size={48} strokeWidth={1.5} />
                <p>Belum ada produk di keranjang</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="pos-cart-item">
                  <div className="pos-cart-item-info">
                    <div className="pos-cart-item-title">{item.item_name}</div>
                    <div className="pos-cart-item-price">{formatRupiah(item.price)}</div>
                    
                    <div className="pos-qty-ctrl" style={{ marginTop: 6, width: 'fit-content' }}>
                      <button className="pos-qty-btn" onClick={() => item.qty > 1 ? updateCartQty(item.id, -1) : removeCartItem(item.id)}>
                        {item.qty > 1 ? <Minus size={14} /> : <Trash2 size={14} color="#e11d48" />}
                      </button>
                      <span className="pos-qty-value">{item.qty}</span>
                      <button className="pos-qty-btn" onClick={() => updateCartQty(item.id, 1)}>
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="pos-cart-item-total">
                    {formatRupiah(item.qty * item.price)}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pos-cart-summary">
            <div className="pos-summary-row">
              <span>Subtotal</span>
              <span>{formatRupiah(subtotal)}</span>
            </div>
            <div className="pos-summary-row grand-total">
              <span>Total Bayar</span>
              <span>{formatRupiah(grandTotal)}</span>
            </div>
            
            <div className="pos-payment-methods">
              {['Tunai', 'QRIS', 'Transfer'].map(m => (
                <button 
                  key={m} 
                  className={`pos-pay-method ${paymentMethod === m ? 'active' : ''}`}
                  onClick={() => setPaymentMethod(m)}
                >
                  {m}
                </button>
              ))}
            </div>

            {paymentMethod === 'Tunai' && (
              <div style={{ marginTop: 8 }}>
                <input 
                  type="text" 
                  className="pos-cash-input"
                  placeholder="Uang Diterima (Rp)"
                  value={cashReceived}
                  onChange={e => setCashReceived(e.target.value)}
                />
                {cashValue >= grandTotal && grandTotal > 0 && (
                  <div style={{ textAlign: 'right', fontSize: 13, color: '#64748b', marginTop: 6, fontWeight: 600 }}>
                    Kembalian: <span style={{ color: '#08a88c', fontSize: 14 }}>{formatRupiah(change)}</span>
                  </div>
                )}
              </div>
            )}

            <button 
              className="pos-pay-btn" 
              disabled={cart.length === 0 || saving || (paymentMethod === 'Tunai' && cashValue < grandTotal)}
              onClick={handleCheckout}
            >
              {saving ? 'Memproses...' : 'Bayar Sekarang'}
              {!saving && <ChevronRight size={18} />}
            </button>
          </div>
        </aside>

        {/* Mobile Floating Cart Button */}
        <button className="pos-floating-cart" onClick={() => setIsCartOpen(true)}>
          <ShoppingCart size={18} />
          <span>Lihat Keranjang</span>
          {cart.length > 0 && (
            <span className="pos-floating-badge">{cart.reduce((a, b) => a + b.qty, 0)}</span>
          )}
        </button>

      </div>
    </div>
  )
}
