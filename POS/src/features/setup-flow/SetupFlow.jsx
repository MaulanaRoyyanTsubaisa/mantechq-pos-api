import React, { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import {
  Bell,
  Boxes,
  CalendarDays,
  CheckCircle2,
  ChartColumn,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CircleDollarSign,
  ClipboardList,
  CreditCard,
  Download,
  FileText,
  Gift,
  HeartHandshake,
  HelpCircle,
  Home,
  Info,
  ListFilter,
  LayoutDashboard,
  Menu,
  Megaphone,
  MoreVertical,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  Percent,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  Tags,
  Trash2,
  Truck,
  Upload,
  Users,
  X,
} from 'lucide-react'
import { Button } from '../../shared/ui/Button.jsx'
import { Brand } from '../../shared/ui/Brand.jsx'
import { FormRow } from '../../shared/ui/FormRow.jsx'
import { UploadBox } from '../../shared/ui/UploadBox.jsx'
import { SelectInput } from '../../shared/ui/SelectInput.jsx'
import { Toggle } from '../../shared/ui/Toggle.jsx'
import { FeaturePanel } from '../../shared/ui/FeaturePanel.jsx'
import { cn } from '../../shared/lib/cn.js'
import { createProduct, updateProduct, uploadProductPhoto } from '../../shared/api/posApi.js'
import { formatRupiah, formatQty, membershipOutletLabel, parseCurrencyInput, parseQuantityInput } from '../../shared/lib/formatters.js'
import {
  accessRoleOptions,
  categoryOptions,
  unitOptions,
  serialInputOptions,
  groupOptions,
  extraOptions,
  recipeOptions,
  paymentMethodOptions,
  provinceOptions,
  cityOptions,
  socialOptions,
  scheduleDays,
} from '../modules/moduleBlueprints.js'
import { TourSpotlight, GuideBubble, GuideDone } from './guideComponents.jsx'

const productSections = ['Informasi Produk', 'Varian', 'Ekstra', 'Resep', 'ManTechQ Order']

const productGuideSteps = [
  {
    key: 'outlet',
    title: 'Daftar Outlet',
    body: 'Tambahkan produk pada outlet yang diinginkan.',
    count: '1 / 8',
  },
  {
    key: 'identity',
    title: 'Informasi Produk',
    body: 'Gunakan nama produk yang berbeda untuk setiap produk agar mudah dikenali.',
    count: '2 / 8',
  },
  {
    key: 'category',
    title: 'Kategori Produk',
    body: 'Buat kategori untuk mengelompokkan produk-produk yang serupa.',
    count: '3 / 8',
  },
  {
    key: 'options',
    title: 'Opsi Lanjutan',
    body: 'Atur produk favorit dan tampilkan produk di halaman kasir.',
    count: '4 / 8',
  },
  {
    key: 'stock',
    title: 'Monitor Persediaan',
    body: 'Aktifkan monitor persediaan untuk memantau kuantitas produk.',
    count: '5 / 8',
  },
  {
    key: 'unit',
    title: 'Satuan & Konversi',
    body: 'Sesuaikan satuan produk untuk memudahkan pembelian berdasarkan ukuran atau jumlah.',
    count: '6 / 8',
  },
  {
    key: 'price',
    title: 'Harga Jual',
    body: 'Harga jual adalah harga yang akan dibayar pembeli dan tampil pada menu kasir.',
    count: '7 / 8',
  },
  {
    key: 'dimension',
    title: 'Dimensi Produk',
    body: 'Atur dimensi produk yang dapat dikirim menggunakan jasa ekspedisi.',
    count: '8 / 8',
  },
]

function SetupFlow({ type, onClose, outlets, onOutletCreated, posData, session, initialData }) {
  if (type === 'product') return <ProductSetupFlow onClose={onClose} outlets={outlets} memberships={posData.memberships} session={session} onSaved={posData.refresh} initialData={initialData} />
  if (type === 'category') return <CategorySetupFlow onClose={onClose} outlets={outlets} />
  if (type === 'outlet') return <OutletDetailFlow onClose={onClose} onOutletSaved={onOutletCreated} outlets={outlets} />
  return <SimpleSetupFlow type={type} onClose={onClose} outlets={outlets} onOutletCreated={onOutletCreated} />
}

function CategorySetupFlow({ onClose, outlets }) {
  const [values, setValues] = useState({
    outlet: outlets[0] || '',
    name: '',
    order: '',
    department: '',
    visible: true,
  })
  const [errors, setErrors] = useState({})
  const [confirmClose, setConfirmClose] = useState(false)
  const setField = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }
  const validate = () => {
    const nextErrors = {}
    if (!values.outlet) nextErrors.outlet = 'Outlet wajib dipilih.'
    if (!values.name.trim()) nextErrors.name = 'Nama kategori wajib diisi.'
    if (!values.order.trim()) nextErrors.order = 'Urutan wajib diisi.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      toast.error(Object.values(nextErrors)[0])
      return false
    }
    toast.success('Kategori berhasil divalidasi dan siap disimpan')
    return true
  }

  return (
    <div className="setup-flow category-flow">
      <FlowHeader title="Tambah Kategori" onClose={() => setConfirmClose(true)} />
      <main className="category-flow-body">
        <section className="flow-card category-form-card">
          <FormRow label="Atur Outlet*" error={errors.outlet}>
            <SelectInput placeholder="Pilih" value={values.outlet} options={outlets} onChange={(value) => setField('outlet', value)} />
            <div className="selected-chip">
              <span>{values.outlet || 'Software Ho...'}</span>
              <button onClick={() => setField('outlet', '')}><X size={14} /></button>
            </div>
          </FormRow>
          <FormRow label="Nama Kategori*" error={errors.name}>
            <input value={values.name} onChange={(event) => setField('name', event.target.value)} placeholder="Contoh: Snack" />
          </FormRow>
          <FormRow label="Ikon Kategori">
            <div className="category-upload-row">
              <p>Gunakan rasio gambar 1:1 dengan ukuran 10Kb dan maksimal 100Kb. Format foto .jpg .jpeg .png ukuran minimum 100px x 100px.</p>
              <UploadBox />
            </div>
          </FormRow>
          <FormRow label="Urutan*" error={errors.order}>
            <input value={values.order} onChange={(event) => setField('order', event.target.value)} placeholder="Contoh: 1" />
          </FormRow>
          <FormRow label="Departemen">
            <SelectInput placeholder="Pilih" value={values.department} options={['IT', 'Food', 'Beverage', 'Retail']} onChange={(value) => setField('department', value)} />
          </FormRow>
          <FormRow label="Tampil di Menu">
            <button className="toggle-button" onClick={() => setField('visible', !values.visible)}>
              <Toggle checked={values.visible} />
            </button>
            <span className="form-inline-note">Tampilkan kategori pada aplikasi kasir</span>
          </FormRow>
        </section>
      </main>
      <FlowFooter simple onCancel={() => setConfirmClose(true)} onSave={validate} />
      {confirmClose ? (
        <div className="modal-scrim">
          <div className="confirm-dialog">
            <header>
              <h2>Batal Tambah Kategori</h2>
              <button onClick={() => setConfirmClose(false)}><X size={18} /></button>
            </header>
            <p>Membatalkan <strong>Tambah Kategori</strong> akan menghapus seluruh data yang telah diinput dan tidak dapat dibatalkan. Lanjutkan?</p>
            <footer>
              <button onClick={() => setConfirmClose(false)}>Batal</button>
              <Button variant="danger" onClick={onClose}>Ya, Lanjutkan</Button>
            </footer>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function ProductSetupFlow({ onClose, outlets, memberships = [], session, onSaved, initialData }) {
  const outletOptions = memberships.length ? memberships.map(membershipOutletLabel) : outlets
  const defaultMembership = memberships.find((item) => item.outlet_id) || memberships[0]
  const [activeSection, setActiveSection] = useState('Informasi Produk')
  const [guideStep, setGuideStep] = useState(0)
  const [guideDone, setGuideDone] = useState(false)
  const [guideRect, setGuideRect] = useState(null)
  const [saving, setSaving] = useState(false)
  const [values, setValues] = useState({
    outlet: defaultMembership ? membershipOutletLabel(defaultMembership) : outlets[0] || '',
    productName: initialData?.item_name || '',
    category: initialData?.category_name || '',
    unit: initialData?.unit || '',
    sku: initialData?.sku || '',
    minPurchase: '1',
    sellPrice: initialData?.sell_price || '',
    qtyOnHand: initialData?.qty_on_hand || '0',
    length: '1',
    width: '1',
    height: '1',
    weight: '100',
    photoUrl: initialData?.photo_url || '',
  })
  const [errors, setErrors] = useState({})
  const refs = useRef({})
  const currentGuide = productGuideSteps[guideStep]

  useEffect(() => {
    if (!currentGuide) return
    const node = refs.current[currentGuide.key]
    node?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    const measure = () => {
      if (!node) return
      const rect = node.getBoundingClientRect()
      setGuideRect({
        top: Math.max(72, rect.top - 6),
        left: Math.max(12, rect.left - 6),
        width: rect.width + 12,
        height: rect.height + 12,
      })
    }
    measure()
    const timer = window.setTimeout(measure, 380)
    window.addEventListener('resize', measure)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('resize', measure)
    }
  }, [currentGuide])

  const register = (key) => (node) => {
    if (node) refs.current[key] = node
  }

  const setField = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  const goSection = (section) => {
    setActiveSection(section)
    refs.current[`section-${section}`]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const nextGuide = () => {
    if (guideStep >= productGuideSteps.length - 1) {
      setGuideStep(null)
      setGuideRect(null)
      setGuideDone(true)
      return
    }
    setGuideStep((step) => step + 1)
  }

  const sectionIndex = productSections.indexOf(activeSection)
  const nextSection = () => {
    const next = productSections[Math.min(sectionIndex + 1, productSections.length - 1)]
    goSection(next)
  }

  const validateProduct = async () => {
    const nextErrors = {}
    if (!values.outlet) nextErrors.outlet = 'Daftar outlet wajib dipilih.'
    if (!values.productName.trim()) nextErrors.productName = 'Nama produk wajib diisi.'
    if (!values.category) nextErrors.category = 'Kategori produk wajib dipilih.'
    if (!values.unit) nextErrors.unit = 'Satuan wajib dipilih.'
    if (!values.sku.trim()) nextErrors.sku = 'SKU wajib diisi.'
    if (!values.minPurchase.trim()) nextErrors.minPurchase = 'Minimum pembelian wajib diisi.'
    if (!values.sellPrice.trim()) nextErrors.sellPrice = 'Harga jual wajib diisi.'
    if (!values.length || !values.width || !values.height || !values.weight) {
      nextErrors.dimension = 'Dimensi dan berat produk wajib diisi.'
    }
    setErrors(nextErrors)
    const firstField = Object.keys(nextErrors)[0]
    const fieldToRef = {
      outlet: 'outlet',
      productName: 'identity',
      category: 'category',
      unit: 'unit',
      sku: 'unit',
      minPurchase: 'unit',
      sellPrice: 'price',
      dimension: 'dimension',
    }
    if (firstField) {
      refs.current[fieldToRef[firstField]]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      toast.error(nextErrors[firstField])
      return false
    }
    const membership = memberships.find((item) => membershipOutletLabel(item) === values.outlet) || defaultMembership
    if (!membership?.org_id || !membership?.outlet_id) {
      toast.error('Outlet belum valid. Pastikan user punya outlet_id di pos_team_members.')
      return false
    }

    setSaving(true)
    try {
      const payload = {
        orgId: membership.org_id,
        outletId: membership.outlet_id,
        sku: values.sku.trim(),
        itemName: values.productName.trim(),
        categoryName: values.category,
        unit: values.unit,
        sellPrice: parseCurrencyInput(values.sellPrice),
        qtyOnHand: parseQuantityInput(values.qtyOnHand),
        qtyMinimum: 0,
        photoUrl: values.photoUrl,
        createdBy: session?.user?.id,
      }
      if (initialData?.id) {
        await updateProduct(initialData.id, payload)
      } else {
        await createProduct(payload)
      }
    } catch (error) {
      const message = error.code === '23505'
        ? 'SKU sudah dipakai di outlet ini.'
        : error.message
      toast.error(message)
      setSaving(false)
      return false
    }
    setSaving(false)

    toast.success(initialData?.id ? 'Produk berhasil diperbarui' : 'Produk berhasil ditambahkan')
    await onSaved?.()
    onClose()
    return true
  }

  return (
    <div className="setup-flow">
      <FlowHeader title={initialData?.id ? 'Edit Produk' : 'Tambahkan Produk'} onClose={onClose} />
      {currentGuide ? <TourSpotlight rect={guideRect} /> : null}
      <div className="flow-body">
        <aside className="flow-sidebar">
          {productSections.map((section, index) => {
            const completed = productSections.indexOf(activeSection) > index
            return (
              <button key={section} className={cn(activeSection === section && 'active', completed && 'done')} onClick={() => goSection(section)}>
                {completed ? <CheckCircle2 size={16} /> : null}
                <span>{section}</span>
              </button>
            )
          })}
        </aside>

        <main className="flow-main">
          <section ref={register('section-Informasi Produk')} className="flow-card">
            <h2>Informasi Produk</h2>
            <FormRow refNode={register('outlet')} guideKey="outlet" currentKey={currentGuide?.key} label="Daftar Outlet*" error={errors.outlet} wide>
              <SelectInput placeholder="Pilih" value={values.outlet} options={outletOptions} onChange={(value) => setField('outlet', value)} />
            </FormRow>
            <FormRow refNode={register('identity')} guideKey="identity" currentKey={currentGuide?.key} label="Nama Produk*" hint={`${values.productName.length}/255`} error={errors.productName}>
              <textarea value={values.productName} onChange={(event) => setField('productName', event.target.value)} placeholder="Contoh: nasi padang" />
            </FormRow>
            <FormRow label="Deskripsi Produk">
              <textarea placeholder="Contoh: yang best seller" />
            </FormRow>
            <FormRow label="Foto Produk">
              <div className="photo-row">
                <p>Gunakan rasio foto 1:1 dengan ukuran 10Kb dan maksimal 1Mb. Format foto .jpg, .jpeg, .png ukuran minimum 100px x 100px.</p>
                <div className="flex gap-4 items-start mt-2">
                  <label className="upload-box" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px', border: '2px dashed #cbd5e1', borderRadius: '8px', background: '#f8fafc', color: '#64748b' }}>
                    <Package size={20} />
                    <span>Pilih atau letakkan berkas di sini</span>
                    <input 
                      type="file" 
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          try {
                            toast.loading('Mengunggah foto...', { id: 'upload-toast' })
                            const res = await uploadProductPhoto(file)
                            setField('photoUrl', res.url)
                            toast.success('Foto berhasil diunggah', { id: 'upload-toast' })
                          } catch (err) {
                            toast.error('Gagal mengunggah foto', { id: 'upload-toast' })
                          }
                        }
                      }} 
                    />
                  </label>
                  {values.photoUrl && (
                    <img src={values.photoUrl} alt="Preview" style={{ height: '90px', width: '90px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                  )}
                </div>
              </div>
            </FormRow>
            <FormRow refNode={register('category')} guideKey="category" currentKey={currentGuide?.key} label="Kategori Produk*" error={errors.category}>
              <SelectInput placeholder="Pilih Kategori" value={values.category} options={categoryOptions} onChange={(value) => setField('category', value)} />
              <small>
                Kategori belum tersedia? <button>Buat Kategori Baru</button>
              </small>
            </FormRow>
            <FormRow refNode={register('options')} guideKey="options" currentKey={currentGuide?.key} label="Opsi Lanjutan">
              <label className="check-line">
                <input type="checkbox" /> Produk Favorit
              </label>
              <label className="check-line">
                <input type="checkbox" defaultChecked /> Tampil di Menu
              </label>
            </FormRow>
            <FormRow refNode={register('stock')} guideKey="stock" currentKey={currentGuide?.key} label="Monitor Persediaan">
              <div className="inline-control">
                <Toggle /> <span>Aktifkan Monitor Persediaan</span>
              </div>
              <input value={values.qtyOnHand} onChange={(event) => setField('qtyOnHand', event.target.value)} placeholder="Stok awal" />
            </FormRow>
            <FormRow label="Serial Number">
              <FeaturePanel title="Serial Number" text="Kasir wajib memilih manual serial number saat penjualan. Nomor seri bisa dicatat per produk untuk pelacakan stok.">
                <div className="two-col">
                  <SelectInput placeholder="Metode input serial number" options={serialInputOptions} />
                  <input placeholder="Contoh: SN-0001" />
                </div>
              </FeaturePanel>
            </FormRow>
            <FormRow label="Batch Number">
              <FeaturePanel title="Batch Number" text="Kelola batch produksi, tanggal kedaluwarsa, dan stok masuk untuk produk ini.">
                <div className="two-col">
                  <input placeholder="Nomor batch" />
                  <input placeholder="Tanggal kedaluwarsa" />
                </div>
              </FeaturePanel>
            </FormRow>
            <FormRow label="Grup">
              <SelectInput placeholder="Pilih" options={groupOptions} />
              <label className="check-line">
                <input type="checkbox" /> Tetapkan sebagai Induk
              </label>
            </FormRow>
            <FormRow label="Izinkan Ubah Produk Tidak Dijual">
              <div className="inline-control">
                <Toggle /> <span>Izinkan kasir mengubah produk menjadi tidak tersedia/tidak dapat dijual di POS/Order Online</span>
              </div>
            </FormRow>
          </section>

          <section className="flow-card">
            <h2>Harga dan Satuan</h2>
            <FormRow refNode={register('unit')} guideKey="unit" currentKey={currentGuide?.key} label="Satuan*" error={errors.unit || errors.sku || errors.minPurchase}>
              <div className="two-col">
                <SelectInput placeholder="Pilih Satuan" value={values.unit} options={unitOptions} onChange={(value) => setField('unit', value)} />
                <input value={values.sku} onChange={(event) => setField('sku', event.target.value)} placeholder="Contoh: S001" />
                <input value={values.minPurchase} onChange={(event) => setField('minPurchase', event.target.value)} placeholder="Min. Pembelian" />
                <input value="1" readOnly />
              </div>
            </FormRow>
            <FormRow refNode={register('price')} guideKey="price" currentKey={currentGuide?.key} label="Harga*" error={errors.sellPrice}>
              <div className="two-col">
                <input value={values.sellPrice} onChange={(event) => setField('sellPrice', event.target.value)} placeholder="Rp 0" />
                <input value="Rp    0" readOnly />
              </div>
            </FormRow>
            <FormRow refNode={register('dimension')} guideKey="dimension" currentKey={currentGuide?.key} label="Dimensi Produk*" error={errors.dimension}>
              <div className="dimension-row">
                <input value={values.length} onChange={(event) => setField('length', event.target.value)} />
                <input value={values.width} onChange={(event) => setField('width', event.target.value)} />
                <input value={values.height} onChange={(event) => setField('height', event.target.value)} />
                <span>cm</span>
                <input value={values.weight} onChange={(event) => setField('weight', event.target.value)} />
                <span>gram</span>
              </div>
              <button className="outline-wide">Tambah Satuan</button>
            </FormRow>
            <FormRow label="Ubah Harga Jual">
              <div className="inline-control">
                <Toggle /> <span>Izinkan kasir untuk mengubah harga jual</span>
              </div>
              <input value="Maks.    0%" readOnly />
            </FormRow>
            <FormRow label="Harga Grosir">
              <FeaturePanel title="Harga Grosir" text="Berikan harga bertingkat untuk pelanggan yang membeli dalam jumlah tertentu.">
                <div className="tier-row">
                  <input placeholder="Min. Qty" />
                  <input placeholder="Harga Grosir" />
                  <button>Tambah Tier</button>
                </div>
              </FeaturePanel>
            </FormRow>
          </section>

          <section ref={register('section-Varian')} className="flow-card compact-flow-card">
            <h2>Varian Produk</h2>
            <FeaturePanel title="Produk Memiliki Varian" text="Tambahkan variasi ukuran, warna, rasa, atau opsi lain untuk produk ini.">
              <div className="variant-builder">
                <input placeholder="Nama varian, contoh: Ukuran" />
                <input placeholder="Pilihan, contoh: S, M, L" />
                <button>Tambah Varian</button>
              </div>
            </FeaturePanel>
          </section>

          <section ref={register('section-Ekstra')} className="flow-card compact-flow-card">
            <h2>Ekstra</h2>
            <FormRow label="Produk Memiliki Ekstra">
              <div className="inline-control">
                <Toggle checked /> <HelpCircle size={16} />
              </div>
            </FormRow>
            <FormRow label="Ubah Data Ekstra">
              <div className="inline-control">
                <Toggle /> <HelpCircle size={16} />
              </div>
            </FormRow>
            <FormRow label="Atur Ekstra">
              <SelectInput placeholder="Pilih Ekstra" options={extraOptions} />
              <div className="tier-row">
                <input placeholder="Nama ekstra, contoh: Sambal" />
                <input placeholder="Harga ekstra" />
                <button>Tambah Ekstra</button>
              </div>
            </FormRow>
          </section>

          <section ref={register('section-Resep')} className="flow-card compact-flow-card">
            <h2>Resep</h2>
            <FeaturePanel title="Master Resep" text="Pilih resep yang sudah tersedia atau buat komposisi bahan baku langsung untuk produk ini.">
              <SelectInput placeholder="Pilih Master Resep" options={recipeOptions} />
            </FeaturePanel>
            <FormRow label="Resep Produk">
              <div className="inline-control">
                <Toggle checked /> <span>Aktifkan untuk menambahkan resep pada produk</span>
              </div>
            </FormRow>
            <FormRow label="Atur Bahan Baku">
              <button className="outline-wide">Tambah Bahan Baku</button>
            </FormRow>
          </section>

          <section ref={register('section-ManTechQ Order')} className="flow-card compact-flow-card">
            <h2>ManTechQ Order</h2>
            <div className="integration-empty">
              <Store size={92} />
              <p>Outlet ini belum terintegrasi dengan marketplace, silakan lakukan proses integrasi terlebih dahulu untuk menggunakan fitur ini</p>
              <Button>Ajukan Integrasi</Button>
            </div>
          </section>
        </main>
      </div>

      {currentGuide ? <GuideBubble step={currentGuide} rect={guideRect} onSkip={() => { setGuideStep(null); setGuideRect(null) }} onNext={nextGuide} /> : null}
      {guideDone ? <GuideDone onRepeat={() => setGuideStep(0)} onClose={() => setGuideDone(false)} /> : null}
      <FlowFooter onCancel={onClose} onBack={() => goSection(productSections[Math.max(sectionIndex - 1, 0)])} onNext={nextSection} onSave={validateProduct} saving={saving} />
    </div>
  )
}

function OutletDetailFlow({ onClose, onOutletSaved }) {
  const [values, setValues] = useState({
    name: 'Software House',
    manager: 'royyan',
    managerEmail: 'maulanaroyyan33@gmail.com',
    type: 'Penjualan',
    status: 'Buka',
    plan: 'TRIAL',
    expires: '19 Juni 2026',
    phone: '089530132499',
    whatsapp: '',
    email: 'maulanaroyyan33@gmail.com',
    country: 'Indonesia',
    province: 'Jawa Tengah',
    city: 'Kab. Tegal',
    address: '',
    socialType: 'Instagram',
    socialAccount: '',
    closeStore: false,
  })
  const [errors, setErrors] = useState({})
  const [managerOpen, setManagerOpen] = useState(false)
  const refs = useRef({})

  const setOutletField = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  const validateOutlet = () => {
    const nextErrors = {}
    if (!values.name.trim()) nextErrors.name = 'Nama outlet wajib diisi.'
    if (!values.phone.trim()) nextErrors.phone = 'Telepon wajib diisi.'
    if (!values.country.trim()) nextErrors.country = 'Negara wajib diisi.'
    if (!values.province.trim()) nextErrors.province = 'Provinsi wajib dipilih.'
    if (!values.city.trim()) nextErrors.city = 'Kota wajib dipilih.'
    if (!values.address.trim()) nextErrors.address = 'Alamat lengkap wajib diisi.'
    setErrors(nextErrors)
    const first = Object.keys(nextErrors)[0]
    if (first) {
      refs.current[first]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      toast.error(nextErrors[first])
      return false
    }
    onOutletSaved?.(values.name)
    toast.success(`Outlet ${values.name} berhasil disimpan`)
    return true
  }

  const addManager = (manager) => {
    setValues((current) => ({ ...current, manager: manager.name, managerEmail: manager.email }))
    setManagerOpen(false)
    toast.success('Manager outlet ditambahkan')
  }

  return (
    <div className="setup-flow outlet-detail-flow">
      <FlowHeader title="Detail Outlet" onClose={onClose} />
      <main className="outlet-detail-body">
        <div className="info-banner">
          <Info size={16} />
          <span>Pengaturan pada nama, logo, jadwal operasional, dan alamat outlet akan tersimpan di berbagai fitur dan produk ManTechQ PoS yang terintegrasi</span>
        </div>

        <section className="flow-card outlet-detail-card">
          <h2>Informasi Outlet</h2>
          <h3>Detail Logo</h3>
          <FormRow label={<span className="label-inline">Logo Outlet <Info size={16} /></span>}>
            <div className="outlet-upload-line">
              <small>Ukuran 500px x 500px, maks 1MB</small>
              <UploadBox />
            </div>
          </FormRow>
          <FormRow label="Logo Struk">
            <div className="outlet-upload-line">
              <small>Ukuran dapat diatur sesuai kebutuhan, maks 1MB</small>
              <UploadBox />
            </div>
          </FormRow>

          <h3>Detail Outlet</h3>
          <FormRow refNode={(node) => { if (node) refs.current.name = node }} label={<span className="label-inline">Nama Outlet* <Info size={16} /></span>} error={errors.name}>
            <input value={values.name} onChange={(event) => setOutletField('name', event.target.value)} />
          </FormRow>
          <FormRow label="Manager Outlet">
            <div className="manager-field">
              <input value={values.manager} readOnly />
              <button type="button" onClick={() => setManagerOpen(true)}>...</button>
            </div>
            <small>{values.managerEmail}</small>
            <button type="button" className="outline-wide" onClick={() => setManagerOpen(true)}>Tambah Manager</button>
          </FormRow>
          <FormRow label="Jenis Outlet">
            <div className="radio-grid">
              <RadioCard label="Penjualan" checked={values.type === 'Penjualan'} onChange={() => setOutletField('type', 'Penjualan')} />
              <RadioCard label="Gudang" checked={values.type === 'Gudang'} onChange={() => setOutletField('type', 'Gudang')} />
            </div>
          </FormRow>
          <FormRow label="Status Outlet">
            <div className="radio-grid">
              <RadioCard label="Buka" checked={values.status === 'Buka'} onChange={() => setOutletField('status', 'Buka')} />
              <RadioCard label="Tutup" checked={values.status === 'Tutup'} onChange={() => setOutletField('status', 'Tutup')} />
            </div>
          </FormRow>
          <FormRow label="Layanan Langganan">
            <input value={values.plan} readOnly />
          </FormRow>
          <FormRow label="Masa Berlaku">
            <div className="expiry-row">
              <input value={values.expires} readOnly />
              <Button variant="outline">Perpanjang</Button>
            </div>
          </FormRow>

          <OutletSchedule />
        </section>

        <section className="flow-card outlet-detail-card">
          <h2>Tutup Toko</h2>
          <FormRow label="Tutup Toko">
            <div className="inline-control">
              <button type="button" className="toggle-button" onClick={() => setOutletField('closeStore', !values.closeStore)}>
                <Toggle checked={values.closeStore} />
              </button>
              <strong>{values.closeStore ? 'Tutup Toko Aktif' : 'Tutup Toko Tidak Aktif'}</strong>
            </div>
            <div className="notice-pill">Fitur tersedia pada POS versi 3.2.23100 ke atas</div>
            <small>Fitur Tutup Toko berfungsi untuk mengakhiri operasional harian di POS sekaligus menghasilkan laporan tutup toko</small>
          </FormRow>
        </section>

        <section className="flow-card outlet-detail-card">
          <h2>Kontak Outlet</h2>
          <FormRow refNode={(node) => { if (node) refs.current.phone = node }} label="Telepon*" error={errors.phone}>
            <input value={values.phone} onChange={(event) => setOutletField('phone', event.target.value)} />
          </FormRow>
          <FormRow label="Whatsapp">
            <input value={values.whatsapp} onChange={(event) => setOutletField('whatsapp', event.target.value)} placeholder="Contoh: 081 231600681" />
          </FormRow>
          <FormRow label="Email">
            <input value={values.email} onChange={(event) => setOutletField('email', event.target.value)} />
          </FormRow>
          <FormRow label={<span className="label-inline">Alamat <Info size={16} /></span>}>
            <div className="address-grid">
              <label>
                Negara*
                <input ref={(node) => { if (node) refs.current.country = node }} value={values.country} onChange={(event) => setOutletField('country', event.target.value)} />
              </label>
              <label>
                Provinsi*
                <SelectInput placeholder="Pilih provinsi" value={values.province} options={provinceOptions} onChange={(value) => setOutletField('province', value)} />
              </label>
              <label className="wide">
                Kota*
                <SelectInput placeholder="Pilih kota" value={values.city} options={cityOptions} onChange={(value) => setOutletField('city', value)} />
              </label>
              <label className="wide address-input">
                Alamat Lengkap*
                <div>
                  <input ref={(node) => { if (node) refs.current.address = node }} value={values.address} onChange={(event) => setOutletField('address', event.target.value)} placeholder="Contoh: Jalan Mangga No.12" />
                  <Button variant="outline">Ubah</Button>
                </div>
                <small>Pilih lokasi melalui Maps</small>
              </label>
            </div>
            {(errors.country || errors.province || errors.city || errors.address) ? <p className="field-error">{errors.country || errors.province || errors.city || errors.address}</p> : null}
          </FormRow>
        </section>

        <section className="flow-card outlet-detail-card">
          <h2>Media Sosial</h2>
          <p className="section-note">Jika media sosial lebih dari 1, silakan isi Nama Akun dan tekan enter untuk menambahkan (maks 4)</p>
          <FormRow label="Media Sosial">
            <div className="two-col">
              <SelectInput placeholder="Pilih media sosial" value={values.socialType} options={socialOptions} onChange={(value) => setOutletField('socialType', value)} />
              <input value={values.socialAccount} onChange={(event) => setOutletField('socialAccount', event.target.value)} placeholder="Contoh: serudimajoo" />
            </div>
          </FormRow>
        </section>
      </main>
      {managerOpen ? <ManagerModal outlet={values.name} onClose={() => setManagerOpen(false)} onSave={addManager} /> : null}
      <FlowFooter simple onCancel={onClose} onSave={validateOutlet} />
    </div>
  )
}

function RadioCard({ label, checked, onChange }) {
  return (
    <label className={cn('radio-card', checked && 'checked')}>
      <input type="radio" checked={checked} onChange={onChange} />
      <span>{label}</span>
    </label>
  )
}

function OutletSchedule() {
  return (
    <div className="schedule-block">
      <h3>
        Jadwal Operasional Outlet
        <Info size={16} />
      </h3>
      <p>Tentukan hari dan jam operasional outlet serta atur buka dan tutup outlet</p>
      <div className="schedule-grid">
        <strong>Hari</strong>
        <strong>Jam Buka</strong>
        <strong>Jam Tutup</strong>
        <strong>Shift</strong>
        {scheduleDays.map((day) => (
          <React.Fragment key={day}>
            <div className="schedule-day">
              <span>{day}</span>
              <Toggle />
            </div>
            <div className="time-input"><Clock3 size={15} /> 00:00</div>
            <div className="time-input"><Clock3 size={15} /> 23:59</div>
            <div className="shift-cell">
              <label className="check-line"><input type="checkbox" defaultChecked /> 24 Jam</label>
              <button type="button"><Plus size={16} /></button>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

function ManagerModal({ outlet, onClose, onSave }) {
  const [values, setValues] = useState({
    name: '',
    employeeNo: 'SO260001',
    phone: '',
    position: '',
    outlet,
    pin: '123456',
    access: '',
    email: '',
  })
  const [errors, setErrors] = useState({})
  const setField = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }
  const save = () => {
    const nextErrors = {}
    if (!values.name.trim()) nextErrors.name = 'Nama wajib diisi.'
    if (!values.access.trim()) nextErrors.access = 'Hak akses wajib dipilih.'
    if (!values.email.trim()) nextErrors.email = 'Email wajib diisi.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      toast.error(Object.values(nextErrors)[0])
      return
    }
    onSave(values)
  }
  return (
    <div className="modal-scrim">
      <div className="manager-modal">
        <header>
          <h2>Tambah Manager Outlet</h2>
          <button type="button" onClick={onClose}><X size={22} /></button>
        </header>
        <div className="manager-grid">
          <label className={cn(errors.name && 'has-error')}>Nama*<input value={values.name} onChange={(event) => setField('name', event.target.value)} placeholder="Contoh: Adi" />{errors.name ? <span>{errors.name}</span> : null}</label>
          <label>Nomor Induk Pegawai<input value={values.employeeNo} onChange={(event) => setField('employeeNo', event.target.value)} /></label>
          <label>No Telepon<input value={values.phone} onChange={(event) => setField('phone', event.target.value)} placeholder="Contoh: 081222333444" /></label>
          <label>Posisi<input value={values.position} onChange={(event) => setField('position', event.target.value)} placeholder="Contoh: Kasir" /></label>
          <label>Outlet<input value={values.outlet} readOnly /></label>
          <label>PIN<div className="pin-field"><input type="password" maxLength={6} value={values.pin} onChange={(event) => setField('pin', event.target.value)} /><HelpCircle size={17} /></div><small>Default PIN: 123456</small></label>
          <label className={cn(errors.access && 'has-error')}>Hak Akses*<SelectInput placeholder="Pilih" value={values.access} options={accessRoleOptions} onChange={(value) => setField('access', value)} />{errors.access ? <span>{errors.access}</span> : null}</label>
          <label className={cn(errors.email && 'has-error')}>Email*<input value={values.email} onChange={(event) => setField('email', event.target.value)} placeholder="Contoh: adi@gmail.com" />{errors.email ? <span>{errors.email}</span> : null}</label>
        </div>
        <footer>
          <button type="button" onClick={onClose}>Batal</button>
          <Button onClick={save}>Simpan</Button>
        </footer>
      </div>
    </div>
  )
}

function SimpleSetupFlow({ type, onClose, outlets, onOutletCreated }) {
  const isEmployee = type === 'employee'
  const title = isEmployee ? 'Tambah Akses Karyawan' : 'Lengkapi Data Outlet'
  const fields = isEmployee
    ? ['Nama*', 'Nomor Induk Pegawai*', 'Hak Akses*', 'Outlet*', 'PIN*']
    : ['Nama Outlet*', 'Alamat Outlet*', 'Kota*', 'Nomor Telepon*', 'Jam Operasional*']
  const [values, setValues] = useState(isEmployee ? { 'Nomor Induk Pegawai*': 'SO260001', 'Hak Akses*': 'Kasir', 'Outlet*': outlets[0] || '', 'PIN*': '123456' } : {})
  const [errors, setErrors] = useState({})
  const simpleRefs = useRef({})
  const setSimpleField = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }
  const validateSimple = () => {
    const nextErrors = {}
    fields.forEach((field) => {
      if (field.includes('*') && !String(values[field] || '').trim()) {
        nextErrors[field] = `${field.replace('*', '')} wajib diisi.`
      }
    })
    setErrors(nextErrors)
    const first = Object.keys(nextErrors)[0]
    if (first) {
      simpleRefs.current[first]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      toast.error(nextErrors[first])
      return false
    }
    if (!isEmployee) {
      onOutletCreated?.(values['Nama Outlet*'])
    }
    toast.success(`${title} berhasil divalidasi dan siap disimpan`)
    return true
  }
  const renderEmployeeForm = () => (
    <section className="flow-card employee-card">
      <FormRow label="Foto Karyawan">
        <div className="photo-row employee-photo">
          <div className="flex gap-4 items-start mt-2">
            <label className="upload-box" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px', border: '2px dashed #cbd5e1', borderRadius: '8px', background: '#f8fafc', color: '#64748b' }}>
              <Users size={20} />
              <span>Unggah Foto Karyawan</span>
              <input 
                type="file" 
                accept="image/*"
                style={{ display: 'none' }}
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    try {
                      toast.loading('Mengunggah foto...', { id: 'upload-toast' })
                      const res = await uploadProductPhoto(file)
                      setSimpleField('FotoURL', res.url)
                      toast.success('Foto berhasil diunggah', { id: 'upload-toast' })
                    } catch (err) {
                      toast.error('Gagal mengunggah foto', { id: 'upload-toast' })
                    }
                  }
                }} 
              />
            </label>
            {values['FotoURL'] && (
              <img src={values['FotoURL']} alt="Preview" style={{ height: '90px', width: '90px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            )}
          </div>
        </div>
      </FormRow>
      <FormRow refNode={(node) => { if (node) simpleRefs.current['Nama*'] = node }} label="Nama*" error={errors['Nama*']}>
        <input value={values['Nama*'] || ''} onChange={(event) => setSimpleField('Nama*', event.target.value)} placeholder="Contoh: Budi" />
      </FormRow>
      <FormRow refNode={(node) => { if (node) simpleRefs.current['Nomor Induk Pegawai*'] = node }} label="Nomor Induk Pegawai*" error={errors['Nomor Induk Pegawai*']}>
        <input value={values['Nomor Induk Pegawai*'] || 'SO260001'} onChange={(event) => setSimpleField('Nomor Induk Pegawai*', event.target.value)} placeholder="SO260001" />
      </FormRow>
      <FormRow refNode={(node) => { if (node) simpleRefs.current['Hak Akses*'] = node }} label="Hak Akses*" error={errors['Hak Akses*']}>
        <SelectInput placeholder="Pilih" value={values['Hak Akses*']} options={accessRoleOptions} onChange={(value) => setSimpleField('Hak Akses*', value)} />
      </FormRow>
      <FormRow label={<span className="label-inline">Akses Karyawan <Info size={16} /></span>}>
        <div className="inline-control">
          <Toggle checked />
          <span>Akses Karyawan Aktif</span>
        </div>
      </FormRow>
      <div className="flow-divider" />
      <FormRow label="Telepon">
        <input value={values.Telepon || ''} onChange={(event) => setSimpleField('Telepon', event.target.value)} placeholder="Contoh: 081111111111" />
      </FormRow>
      <FormRow label="Email">
        <input value={values.Email || ''} onChange={(event) => setSimpleField('Email', event.target.value)} placeholder="Contoh: emailsaya@gmail.com" />
      </FormRow>
      <FormRow label="Posisi">
        <input value={values.Posisi || ''} onChange={(event) => setSimpleField('Posisi', event.target.value)} placeholder="Contoh: Manager" />
      </FormRow>
      <FormRow refNode={(node) => { if (node) simpleRefs.current['Outlet*'] = node }} label="Outlet*" error={errors['Outlet*']}>
        <SelectInput placeholder="Pilih" value={values['Outlet*']} options={outlets} onChange={(value) => setSimpleField('Outlet*', value)} />
      </FormRow>
      <FormRow refNode={(node) => { if (node) simpleRefs.current['PIN*'] = node }} label="PIN*" error={errors['PIN*']}>
        <div className="pin-field">
          <input type="password" maxLength={6} value={values['PIN*'] || '123456'} onChange={(event) => setSimpleField('PIN*', event.target.value)} placeholder="Maksimal 6 digit" />
          <HelpCircle size={17} />
        </div>
        <small>Default: 123456 (Maksimal 6 digit)</small>
      </FormRow>
    </section>
  )
  return (
    <div className="setup-flow">
      <FlowHeader title={title} onClose={onClose} />
      <div className="flow-body simple-flow">
        <main className="flow-main">
          {isEmployee ? renderEmployeeForm() : (
          <section className="flow-card outlet-card">
            <h2>{title}</h2>
            {fields.map((field) => (
              <FormRow key={field} refNode={(node) => { if (node) simpleRefs.current[field] = node }} label={field} error={errors[field]}>
                {field.includes('Alamat') ? (
                  <textarea value={values[field] || ''} onChange={(event) => setSimpleField(field, event.target.value)} placeholder={`Masukkan ${field.replace('*', '').toLowerCase()}`} />
                ) : (
                  <input value={values[field] || ''} onChange={(event) => setSimpleField(field, event.target.value)} placeholder={`Masukkan ${field.replace('*', '').toLowerCase()}`} />
                )}
              </FormRow>
            ))}
            <FeaturePanel title="Pengaturan Operasional" text="Atur multi-outlet, pajak, service charge, dan integrasi pembayaran outlet.">
              <div className="two-col">
                <input placeholder="Pajak default" />
                <input placeholder="Service charge" />
              </div>
            </FeaturePanel>
          </section>
          )}
        </main>
      </div>
      <FlowFooter simple={isEmployee} onCancel={onClose} onBack={onClose} onNext={validateSimple} onSave={validateSimple} />
    </div>
  )
}

function FlowHeader({ title, onClose }) {
  return (
    <header className="flow-header">
      <button onClick={onClose} aria-label="Tutup">
        <X size={21} />
      </button>
      <strong>{title}</strong>
      <Brand />
    </header>
  )
}

function FlowFooter({ onCancel, onBack, onNext, onSave, simple, saving }) {
  return (
    <footer className="flow-footer">
      <button onClick={onCancel}>Batal</button>
      <div>
        {!simple ? <button onClick={onBack}>Kembali</button> : null}
        {!simple ? <button onClick={onNext}>Selanjutnya</button> : null}
        <Button disabled={saving} onClick={onSave || (() => toast.success('Data berhasil disimpan'))}>{saving ? 'Menyimpan...' : 'Simpan'}</Button>
      </div>
    </footer>
  )
}


export {
  productSections,
  productGuideSteps,
  SetupFlow,
  CategorySetupFlow,
  ProductSetupFlow,
  OutletDetailFlow,
  RadioCard,
  OutletSchedule,
  ManagerModal,
  SimpleSetupFlow,
  FlowHeader,
  FlowFooter,
}
