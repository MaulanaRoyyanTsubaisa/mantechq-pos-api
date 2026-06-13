import React, { useState, useEffect } from 'react'
import { ArrowLeft, Search, ShoppingCart, Minus, Plus, Trash2, CheckCircle2, ChevronRight, Store, X, Printer, MessageCircle, LogOut } from 'lucide-react'
import QRCode from 'react-qr-code'
import { toast } from 'sonner'
import { membershipOutletLabel, parseCurrencyInput, formatRupiah, formatQty, formatCurrencyInput } from '../../shared/lib/formatters.js'
import { createSale, getShift, updateShift } from '../../shared/api/posApi.js'
import './pos.css'

export function PosApp({ posData, onClose, session }) {
  const outletOptions = posData?.memberships?.map(membershipOutletLabel) || []
  const firstOutlet = outletOptions[0] || ''
  const [selectedOutlet, setSelectedOutlet] = useState(firstOutlet)

  // Shift State
  const [shift, setShift] = useState(null)
  const [isClosingShift, setIsClosingShift] = useState(false)
  const [modalAwal, setModalAwal] = useState('')
  const [kasAktual, setKasAktual] = useState('')

  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Semua')
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  
  // Checkout state
  const [paymentMethod, setPaymentMethod] = useState('Tunai')
  const [cashReceived, setCashReceived] = useState('')
  const [discountInput, setDiscountInput] = useState('')
  const [taxInput, setTaxInput] = useState('')
  
  // Split Payment State
  const [isSplit, setIsSplit] = useState(false)
  const [isDp, setIsDp] = useState(false)
  const [splitMethod1, setSplitMethod1] = useState('Tunai')
  const [splitMethod2, setSplitMethod2] = useState('QRIS')
  const [splitAmount1, setSplitAmount1] = useState('')

  const [saving, setSaving] = useState(false)
  const [receipt, setReceipt] = useState(null)
  
  // Variant Selection State
  const [selectedProductForVariant, setSelectedProductForVariant] = useState(null)
  
  // Order Type State
  const [orderType, setOrderType] = useState('Dine In')

  const membership = posData?.memberships?.find((item) => membershipOutletLabel(item) === selectedOutlet) || posData?.memberships?.[0]

  useEffect(() => {
    if (selectedOutlet || !firstOutlet) return
    setSelectedOutlet(firstOutlet)
  }, [firstOutlet, selectedOutlet])

  useEffect(() => {
    if (!membership || !session?.user?.id) return
    getShift(membership.org_id, membership.outlet_id, session.user.id).then(res => {
      if (res) {
        setShift({
          id: res.id,
          kasir: res.cashier_name,
          waktuBuka: res.start_time,
          modalAwal: Number(res.opening_amount) || 0,
          totalPenjualan: 0,
          uangMasuk: 0
        })
      }
    }).catch(err => console.error(err))
  }, [membership, session])

  const allStock = (posData?.stockItems || []).filter((item) => item.outlet_id === membership?.outlet_id && item.is_active)
  
  const masterCategories = [...(posData?.categories || [])]
    .filter(cat => cat.is_active !== false)
    .sort((a, b) => (Number(a.sequence) || 0) - (Number(b.sequence) || 0))
    .map(cat => cat.name)
    .filter(Boolean)
  const categories = ['Semua', ...masterCategories]

  const filteredStock = allStock.filter((item) => {
    const textMatch = `${item.item_name} ${item.sku}`.toLowerCase().includes(query.toLowerCase())
    const catMatch = selectedCategory === 'Semua' || item.category_name === selectedCategory
    return textMatch && catMatch
  })

  const subtotal = cart.reduce((sum, item) => sum + Math.max((item.qty * item.price) - item.discount, 0), 0)
  const discountValue = parseCurrencyInput(discountInput)
  const taxValue = parseCurrencyInput(taxInput)
  const grandTotal = Math.max(subtotal - discountValue + taxValue, 0)
  
  const cashValue = parseCurrencyInput(cashReceived)
  const change = Math.max(cashValue - grandTotal, 0)

  const splitValue1 = parseCurrencyInput(splitAmount1)
  const splitValue2 = Math.max(grandTotal - splitValue1, 0)

  // Shift Functions
  const handleOpenShift = async () => {
    const modal = parseCurrencyInput(modalAwal)
    if (modal < 0) return toast.error('Modal awal tidak valid')
    setSaving(true)
    try {
      const res = await updateShift({
        orgId: membership.org_id,
        outletId: membership.outlet_id,
        userId: session?.user?.id,
        cashierName: session?.user?.full_name || 'Kasir',
        action: 'open',
        openingAmount: modal
      })
      setShift({
        id: res.id,
        kasir: res.cashier_name,
        waktuBuka: res.start_time,
        modalAwal: Number(res.opening_amount) || 0,
        totalPenjualan: 0,
        uangMasuk: 0
      })
      toast.success('Shift berhasil dibuka')
    } catch (err) {
      toast.error('Gagal membuka shift')
    } finally {
      setSaving(false)
    }
  }

  const handleCloseShift = async () => {
    const aktual = parseCurrencyInput(kasAktual)
    const expected = shift.modalAwal + shift.uangMasuk
    const selisih = aktual - expected
    setSaving(true)
    try {
      await updateShift({
        orgId: membership.org_id,
        outletId: membership.outlet_id,
        userId: session?.user?.id,
        action: 'close',
        closingAmount: aktual,
        expectedAmount: expected
      })
      setShift(null)
      setIsClosingShift(false)
      toast.success(`Shift ditutup. Selisih kas: ${formatRupiah(selisih)}`)
    } catch (err) {
      toast.error('Gagal menutup shift')
    } finally {
      setSaving(false)
    }
  }

  const handleProductClick = (item) => {
    if (item.variants && item.variants.length > 0) {
      setSelectedProductForVariant(item)
    } else {
      addToCart(item)
    }
  }

  const addToCart = (item, variant = null) => {
    const stockQty = variant ? Number(variant.qty_on_hand || 0) : Number(item.qty_on_hand || 0)
    const id = variant ? `${item.id}-${variant.id}` : item.id
    const sku = variant ? variant.sku : item.sku
    const price = variant ? Number(variant.sell_price || 0) : Number(item.sell_price || 0)
    const itemName = variant ? `${item.item_name} - ${variant.name}` : item.item_name

    if (stockQty <= 0) {
      toast.error('Stok produk ini kosong.')
      return
    }

    setCart((current) => {
      const existing = current.find((row) => row.id === id)
      if (existing) {
        if (existing.qty + 1 > stockQty) {
          toast.error('Kuantitas melebihi stok yang tersedia.')
          return current
        }
        return current.map((row) => (row.id === id ? { ...row, qty: row.qty + 1 } : row))
      }
      return [
        ...current,
        {
          id,
          sku,
          item_name: itemName,
          unit: item.unit || 'Pcs',
          stock: stockQty,
          qty: 1,
          price,
          discount: 0,
        },
      ]
    })
    setSelectedProductForVariant(null)
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
    setDiscountInput('')
    setTaxInput('')
    setPaymentMethod('Tunai')
    setCashReceived('')
    setIsSplit(false)
    setIsDp(false)
    setSplitAmount1('')
    setOrderType('Dine In')
    setIsCartOpen(false)
  }

  const handleCheckout = async () => {
    if (!cart.length) return toast.error('Keranjang kosong.')
    if (!isSplit && !isDp && paymentMethod === 'Tunai' && cashValue < grandTotal) {
      return toast.error('Uang tunai kurang dari total bayar.')
    }
    if (isDp && cashValue >= grandTotal) {
      return toast.error('Untuk Uang Muka, uang tunai harus kurang dari total bayar.')
    }
    if (isDp && cashValue <= 0) {
      return toast.error('Uang Muka tidak boleh kosong.')
    }
    if (isSplit && splitValue1 <= 0) {
      return toast.error('Nominal split tidak valid.')
    }

    setSaving(true)
    try {
      const finalPaymentMethod = isSplit ? `Split (${splitMethod1} & ${splitMethod2})` : paymentMethod
      let amountPaid = grandTotal
      if (!isSplit && paymentMethod === 'Tunai') {
        amountPaid = isDp ? cashValue : grandTotal
      }
      
      let uangMasukShift = 0
      if (!isSplit && paymentMethod === 'Tunai') {
        uangMasukShift = isDp ? cashValue : grandTotal
      } else if (isSplit) {
        if (splitMethod1 === 'Tunai') uangMasukShift += splitValue1
        if (splitMethod2 === 'Tunai') uangMasukShift += splitValue2
      }

      const payload = {
        org_id: membership.org_id,
        outlet_id: membership.outlet_id,
        items: cart.map(c => ({ st_mast_id: c.id, qty: c.qty, price: c.price, discount: c.discount })),
        discount_total: discountValue,
        tax_total: taxValue,
        paid_total: amountPaid,
        payment_status: isDp ? 'partial' : 'paid',
        note: (isSplit ? `Split: ${splitMethod1} (${formatRupiah(splitValue1)}) + ${splitMethod2} (${formatRupiah(splitValue2)})` : isDp ? `DP / Uang Muka: ${paymentMethod}` : `Pembayaran: ${paymentMethod}`) + ` | ${orderType}`,
        userId: session?.user?.id,
      }
      
      const data = await createSale(payload)
      toast.success('Transaksi berhasil disimpan.')
      
      const receiptData = {
        ...payload,
        id: data.sale?.id || 'TRX-' + Date.now(),
        total: grandTotal,
        subtotal,
        change: change,
        date: new Date().toLocaleString('id-ID'),
        itemsDetail: cart,
        isSplit,
        splitDetail: isSplit ? [
          { method: splitMethod1, amount: splitValue1 },
          { method: splitMethod2, amount: splitValue2 }
        ] : []
      }

      // Update shift data
      if (shift) {
        const updatedShift = {
          ...shift,
          totalPenjualan: shift.totalPenjualan + grandTotal,
          uangMasuk: shift.uangMasuk + uangMasukShift
        }
        setShift(updatedShift)
      }

      setReceipt(receiptData)
      resetTransaction()
      
      if (posData?.refresh) {
        await posData.refresh()
      }
    } catch (err) {
      toast.error('Gagal memproses transaksi.')
    } finally {
      setSaving(false)
    }
  }

  const handleWA = () => {
    if (!receipt) return
    let paymentText = `Metode: ${receipt.payment_method}`
    if (receipt.isSplit) {
      paymentText = `Metode: Split Payment\n- ${receipt.splitDetail[0].method}: ${formatRupiah(receipt.splitDetail[0].amount)}\n- ${receipt.splitDetail[1].method}: ${formatRupiah(receipt.splitDetail[1].amount)}`
    }
    
    const text = `*ManTechQ PoS*
--------------------
No: ${receipt.id}
Tgl: ${receipt.date}
${paymentText}
--------------------
${receipt.itemsDetail.map(i => `${i.item_name} x${i.qty} = ${formatRupiah(i.qty * i.price)}`).join('\n')}
--------------------
Subtotal: ${formatRupiah(receipt.subtotal)}
Diskon: ${formatRupiah(receipt.discount)}
Pajak: ${formatRupiah(receipt.tax)}
Total: *${formatRupiah(receipt.total)}*
--------------------
Terima kasih telah berbelanja!`

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  // --- Render Variant Modal ---
  if (selectedProductForVariant) {
    return (
      <div className="pos-layout pos-modal-overlay">
        <div className="pos-modal">
          <div className="pos-modal-header">
            <h2>Pilih Varian</h2>
            <p>{selectedProductForVariant.item_name}</p>
          </div>
          <div className="pos-modal-body" style={{ gap: 8 }}>
            {selectedProductForVariant.variants.map(variant => {
              const stockQty = Number(variant.qty_on_hand || 0)
              const disabled = stockQty <= 0
              return (
                <button 
                  key={variant.id} 
                  className={`pos-product-card ${disabled ? 'disabled' : ''}`} 
                  style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '16px', opacity: disabled ? 0.6 : 1 }}
                  onClick={() => !disabled && addToCart(selectedProductForVariant, variant)}
                >
                  <div style={{ textAlign: 'left' }}>
                    <div className="pos-product-name">{variant.name}</div>
                    <div className="pos-product-sku">{variant.sku}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="pos-product-price" style={{ marginBottom: 4 }}>{formatRupiah(variant.sell_price)}</div>
                    <div className={`pos-product-stock ${stockQty <= 5 ? 'low' : ''}`} style={{ justifyContent: 'flex-end', margin: 0 }}>
                      Stok: {formatQty(stockQty)}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
          <div className="pos-modal-footer">
            <button className="btn btn-outline" style={{width: '100%'}} onClick={() => setSelectedProductForVariant(null)}>Batal</button>
          </div>
        </div>
      </div>
    )
  }

  // --- Render Shift Modals ---
  if (!shift) {
    return (
      <div className="pos-layout pos-modal-overlay">
        <div className="pos-modal">
          <div className="pos-modal-header">
            <h2>Buka Kasir</h2>
            <p>Anda harus membuka shift sebelum melakukan transaksi.</p>
          </div>
          <div className="pos-modal-body">
            <div className="pos-input-group">
              <label>Modal Awal (Kas Fisik)</label>
              <input 
                type="text" 
                placeholder="Rp 0" 
                value={modalAwal} 
                onChange={e => setModalAwal(formatCurrencyInput(e.target.value))}
                autoFocus
              />
            </div>
          </div>
          <div className="pos-modal-footer">
            <button className="btn btn-outline" style={{flex: 1}} onClick={onClose}>Kembali ke Admin</button>
            <button className="btn btn-default" style={{flex: 1, background: '#08a88c', border: 'none'}} onClick={handleOpenShift}>Buka Shift</button>
          </div>
        </div>
      </div>
    )
  }

  if (isClosingShift) {
    const expected = shift.modalAwal + shift.uangMasuk
    return (
      <div className="pos-layout pos-modal-overlay">
        <div className="pos-modal">
          <div className="pos-modal-header">
            <h2>Tutup Kasir</h2>
            <p>Akhiri shift dan rekapitulasi penjualan.</p>
          </div>
          <div className="pos-modal-body">
            <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, fontSize: 13, marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: '#64748b' }}>Modal Awal:</span>
                <strong style={{ color: '#0f172a' }}>{formatRupiah(shift.modalAwal)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: '#64748b' }}>Penerimaan Tunai:</span>
                <strong style={{ color: '#0f172a' }}>{formatRupiah(shift.uangMasuk)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #cbd5e1', paddingTop: 4, marginTop: 4 }}>
                <span style={{ color: '#64748b' }}>Sistem Harapkan:</span>
                <strong style={{ color: '#08a88c' }}>{formatRupiah(expected)}</strong>
              </div>
            </div>
            <div className="pos-input-group">
              <label>Kas Aktual (Dihitung Fisik)</label>
              <input 
                type="text" 
                placeholder="Rp 0" 
                value={kasAktual} 
                onChange={e => setKasAktual(formatCurrencyInput(e.target.value))}
                autoFocus
              />
            </div>
          </div>
          <div className="pos-modal-footer">
            <button className="btn btn-outline" style={{flex: 1}} onClick={() => setIsClosingShift(false)}>Batal</button>
            <button className="btn btn-default" style={{flex: 1, background: '#e11d48', border: 'none'}} onClick={handleCloseShift}>Akhiri Shift</button>
          </div>
        </div>
      </div>
    )
  }
  // --- Render Receipt ---
  if (receipt) {
    return (
      <div className="pos-layout" style={{ alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div className="pos-receipt-print" style={{ background: '#fff', padding: '32px', borderRadius: '16px', maxWidth: '400px', width: '100%', boxShadow: '0 12px 40px rgba(0,0,0,0.08)' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ width: 64, height: 64, background: '#ecfdf5', color: '#08a88c', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }} className="hide-on-print">
              <CheckCircle2 size={32} />
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: '#0f172a' }}>Transaksi Sukses</h2>
            <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>No: {receipt.id}</p>
          </div>
          
          <div style={{ borderTop: '1px dashed #e2e8f0', borderBottom: '1px dashed #e2e8f0', padding: '16px 0', margin: '16px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {receipt.itemsDetail.map(i => (
              <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#475569' }}>{i.item_name} (x{i.qty})</span>
                <span style={{ color: '#0f172a' }}>{formatRupiah(i.qty * i.price)}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid #f1f5f9', margin: '8px 0' }}></div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: '#64748b' }}>Subtotal</span>
              <span style={{ color: '#0f172a' }}>{formatRupiah(receipt.subtotal)}</span>
            </div>
            {receipt.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#64748b' }}>Diskon</span>
                <span style={{ color: '#e11d48' }}>-{formatRupiah(receipt.discount)}</span>
              </div>
            )}
            {receipt.tax > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#64748b' }}>Pajak</span>
                <span style={{ color: '#0f172a' }}>+{formatRupiah(receipt.tax)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 800, marginTop: 4 }}>
              <span style={{ color: '#0f172a' }}>Total Tagihan</span>
              <strong style={{ color: '#0f172a' }}>{formatRupiah(receipt.total)}</strong>
            </div>
            
            <div style={{ borderTop: '1px solid #f1f5f9', margin: '8px 0' }}></div>

            {!receipt.isSplit ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: '#64748b' }}>Metode Bayar</span>
                  <strong style={{ color: '#0f172a' }}>{receipt.payment_method}</strong>
                </div>
                {receipt.payment_method === 'Tunai' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: '#64748b' }}>Kembalian</span>
                    <strong style={{ color: '#08a88c' }}>{formatRupiah(receipt.change)}</strong>
                  </div>
                )}
              </>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                  <span style={{ color: '#64748b' }}>Split Payment</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: '#475569', paddingLeft: 8 }}>- {receipt.splitDetail[0].method}</span>
                  <strong style={{ color: '#0f172a' }}>{formatRupiah(receipt.splitDetail[0].amount)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: '#475569', paddingLeft: 8 }}>- {receipt.splitDetail[1].method}</span>
                  <strong style={{ color: '#0f172a' }}>{formatRupiah(receipt.splitDetail[1].amount)}</strong>
                </div>
              </>
            )}

          </div>
          
          <div className="hide-on-print" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => window.print()} style={{ flex: 1, padding: '12px', background: '#fff', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Printer size={16} /> Cetak Struk
              </button>
              <button onClick={handleWA} style={{ flex: 1, padding: '12px', background: '#fff', color: '#08a88c', border: '1px solid #6ee7b7', borderRadius: '10px', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <MessageCircle size={16} /> Kirim WA
              </button>
            </div>
            <button onClick={() => setReceipt(null)} style={{ width: '100%', padding: '14px', background: 'transparent', color: '#94a3b8', border: 'none', fontSize: 16, fontWeight: 700, cursor: 'pointer', marginTop: 8 }}>
              Transaksi Baru
            </button>
          </div>
        </div>
      </div>
    )
  }

  // --- Main PoS Screen ---
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
          <button className="pos-close-btn" onClick={() => setIsClosingShift(true)} style={{ color: '#e11d48', background: '#fff1f2', padding: '6px 12px', borderRadius: '6px', fontWeight: 600 }}>
            <LogOut size={14} />
            <span>Tutup Shift</span>
          </button>
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
                placeholder="Cari nama produk atau SKU (atau scan barcode)..." 
                value={query} 
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && query.trim() !== '') {
                    const q = query.trim()
                    const exactMatch = allStock.find(item => {
                      const fallbackSku = `SKU-${String(item.id || '').slice(0, 8)}`
                      return item.sku === q || item.barcode === q || fallbackSku === q
                    })
                    if (exactMatch) {
                      handleProductClick(exactMatch)
                      setQuery('')
                    } else {
                      toast.error('Produk dengan SKU tersebut tidak ditemukan')
                    }
                  }
                }}
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
                <div key={item.id} className="pos-product-card" onClick={() => handleProductClick(item)}>
                  <div className="pos-product-img-wrapper" style={{ width: '100%', height: '120px', backgroundColor: '#f1f5f9', borderRadius: '8px', marginBottom: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.photo_url ? (
                      <img src={item.photo_url} alt={item.item_name} loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Store size={32} color="#cbd5e1" />
                    )}
                  </div>
                  <div className="pos-product-name">{item.item_name}</div>
                  <div className="pos-product-sku">{item.sku}</div>
                  <div className="pos-product-price">
                    {item.variants?.length ? 'Mulai ' : ''}{formatRupiah(item.sell_price)}
                  </div>
                  <div className={`pos-product-stock ${item.qty_on_hand <= 5 ? 'low' : ''}`}>
                    {item.variants?.length ? `${item.variants.length} Varian` : `Stok: ${formatQty(item.qty_on_hand)} ${item.unit || 'Pcs'}`}
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
            
            <div className="pos-summary-row" style={{ marginTop: 4 }}>
              <span>Diskon (Rp)</span>
              <input 
                type="text" 
                className="pos-summary-input" 
                placeholder="0" 
                value={discountInput}
                onChange={e => setDiscountInput(formatCurrencyInput(e.target.value))}
              />
            </div>
            
            <div className="pos-summary-row" style={{ marginTop: 4 }}>
              <span>Pajak (Rp)</span>
              <input 
                type="text" 
                className="pos-summary-input" 
                placeholder="0" 
                value={taxInput}
                onChange={e => setTaxInput(formatCurrencyInput(e.target.value))}
              />
            </div>

            <div className="pos-summary-row grand-total">
              <span>Total Bayar</span>
              <span>{formatRupiah(grandTotal)}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>Jenis Order</span>
              <select className="pos-cash-input" style={{ width: '50%', padding: '6px 8px', fontSize: 13 }} value={orderType} onChange={e => setOrderType(e.target.value)}>
                <option>Dine In</option>
                <option>Take Away</option>
                <option>Delivery</option>
                <option>Online Order</option>
                <option>Reguler</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>Metode Bayar</span>
              <div style={{ display: 'flex', gap: 12 }}>
                <label style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', color: '#08a88c', fontWeight: 600 }}>
                  <input type="checkbox" checked={isDp} onChange={e => { setIsDp(e.target.checked); setIsSplit(false) }} />
                  Uang Muka (DP)
                </label>
                <label style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', color: '#08a88c', fontWeight: 600 }}>
                  <input type="checkbox" checked={isSplit} onChange={e => { setIsSplit(e.target.checked); setIsDp(false) }} />
                  Split Payment
                </label>
              </div>
            </div>

            {!isSplit ? (
              <>
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
                      onChange={e => setCashReceived(formatCurrencyInput(e.target.value))}
                    />
                    {cashValue >= grandTotal && grandTotal > 0 && (
                      <div style={{ textAlign: 'right', fontSize: 13, color: '#64748b', marginTop: 6, fontWeight: 600 }}>
                        Kembalian: <span style={{ color: '#08a88c', fontSize: 14 }}>{formatRupiah(change)}</span>
                      </div>
                    )}
                  </div>
                )}

                {paymentMethod === 'QRIS' && !isSplit && (
                  <div style={{ textAlign: 'center', marginTop: 12 }}>
                    <div style={{ width: 140, height: 140, background: '#fff', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, padding: 8 }}>
                      <QRCode value={`QRIS: ${grandTotal}`} size={124} />
                    </div>
                    <p style={{ fontSize: 13, color: '#64748b', marginTop: 8 }}>Scan QRIS untuk membayar <strong>{formatRupiah(grandTotal)}</strong></p>
                  </div>
                )}
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4, background: '#f8fafc', padding: 8, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <select className="pos-cash-input" style={{ width: '40%', padding: 8, fontSize: 13 }} value={splitMethod1} onChange={e => setSplitMethod1(e.target.value)}>
                    <option>Tunai</option><option>QRIS</option><option>Transfer</option>
                  </select>
                  <input type="text" className="pos-cash-input" style={{ flex: 1, padding: 8, fontSize: 13 }} placeholder="Rp" value={splitAmount1} onChange={e => setSplitAmount1(formatCurrencyInput(e.target.value))} />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <select className="pos-cash-input" style={{ width: '40%', padding: 8, fontSize: 13 }} value={splitMethod2} onChange={e => setSplitMethod2(e.target.value)}>
                    <option>Tunai</option><option>QRIS</option><option>Transfer</option>
                  </select>
                  <div className="pos-cash-input" style={{ flex: 1, padding: 8, fontSize: 13, background: '#e2e8f0', color: '#64748b' }}>
                    {formatRupiah(splitValue2)}
                  </div>
                </div>
              </div>
            )}

            <button 
              className="pos-pay-btn" 
              disabled={cart.length === 0 || saving || (!isSplit && !isDp && paymentMethod === 'Tunai' && cashValue < grandTotal) || (isDp && (cashValue <= 0 || cashValue >= grandTotal)) || (isSplit && splitValue1 <= 0)}
              onClick={handleCheckout}
            >
              {saving ? 'Memproses...' : 
                (!isSplit && !isDp && paymentMethod === 'Tunai' && cashValue < grandTotal) ? 'Uang Belum Cukup' : 
                (isDp && cashValue <= 0) ? 'Masukkan Nominal DP' :
                (isDp && cashValue >= grandTotal) ? 'Nominal DP Melebihi Total' :
                (isSplit && splitValue1 <= 0) ? 'Split Nominal Tidak Valid' : isDp ? 'Simpan Uang Muka' : 'Bayar Sekarang'}
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
