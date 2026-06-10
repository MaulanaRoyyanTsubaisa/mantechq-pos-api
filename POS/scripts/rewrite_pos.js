import fs from 'fs';

const filePath = 'POS/src/features/pos/PosApp.jsx';
const content = fs.readFileSync(filePath, 'utf-8');

const lines = content.split('\n');
const splitIndex = lines.findIndex(line => line.includes('// --- Main PoS Screen ---'));

if (splitIndex === -1) {
  console.error("Could not find '// --- Main PoS Screen ---'");
  process.exit(1);
}

const beforeMain = lines.slice(0, splitIndex + 1).join('\n');

const newMainUi = `
  return (
    <div className="flex h-screen bg-[#e5e7eb] font-sans overflow-hidden">
      
      {/* ========== SIDEBAR KIRI (KERANJANG) ========== */}
      <div className={\`\${isCartOpen ? 'flex' : 'hidden'} lg:flex w-full lg:w-[380px] bg-white border-r border-gray-200 flex-col shadow-sm fixed lg:relative z-50 h-full\`}>
        
        {/* Header Keranjang */}
        <div className="p-5 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <ShoppingCart className="text-[#f97316]" size={20} />
              </div>
              <div>
                <span className="font-bold text-gray-800 text-lg">ManTechQ POS</span>
                <p className="text-xs text-gray-400">Keranjang Belanja</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-[#f97316]/10 text-[#f97316] font-bold px-3 py-1 rounded-full text-sm">
                {cart.reduce((sum, i) => sum + i.qty, 0)} item
              </span>
              <button className="lg:hidden text-gray-400 hover:text-gray-600" onClick={() => setIsCartOpen(false)}>
                <X size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Daftar Item Keranjang */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scroll">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
                <ShoppingCart className="text-gray-300" size={32} />
              </div>
              <p className="text-gray-400 font-medium">Keranjang kosong</p>
              <p className="text-gray-300 text-xs mt-1">Klik menu untuk memesan</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex flex-col gap-2 p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">{item.item_name}</h4>
                    <p className="text-[#08a88c] font-bold text-xs">{formatRupiah(item.price)}</p>
                  </div>
                  <button onClick={() => removeCartItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-gray-500 text-xs font-medium">Subtotal: {formatRupiah(item.price * item.qty)}</p>
                  <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-200">
                    <button onClick={() => updateCartQty(item.id, -1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:bg-gray-50"><Minus size={14} /></button>
                    <span className="font-bold text-sm min-w-[20px] text-center">{item.qty}</span>
                    <button onClick={() => updateCartQty(item.id, 1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:bg-gray-50"><Plus size={14} /></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Total */}
        <div className="p-5 border-t border-gray-200 bg-white">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-500 text-sm font-medium">Total</span>
            <span className="text-2xl font-black text-gray-800">{formatRupiah(grandTotal)}</span>
          </div>
          <div className="flex gap-2">
            <button 
              disabled={saving || cart.length === 0}
              onClick={handleCheckout}
              className="flex-1 bg-[#1d4ed8] hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all flex justify-center items-center gap-2"
            >
              <ShoppingCart size={18} />
              {saving ? 'Memproses...' : 'Bayar'}
            </button>
            <button onClick={resetTransaction} className="w-12 h-12 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl flex items-center justify-center transition-colors">
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* ========== AREA KATALOG (KANAN) ========== */}
      <div className="flex-1 flex flex-col h-full bg-[#f8fafc] w-full">
        {/* Header Katalog */}
        <div className="bg-white px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-gray-600">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Katalog Produk</h1>
              <p className="text-xs text-gray-500">Pilih outlet: {selectedOutlet}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Cari produk..." 
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 outline-none w-full md:w-64 transition-all text-sm"
              />
            </div>
            <button className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors">
              <Plus size={16} /> Tambah
            </button>
          </div>
        </div>

        {/* Categories (Horizontal Scroll) */}
        <div className="bg-white border-b border-gray-100 p-2 shadow-sm z-10">
          <div className="flex overflow-x-auto gap-2 px-4 pb-2 pt-2 custom-scroll">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={\`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors \${selectedCategory === cat ? 'bg-[#1d4ed8] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}\`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scroll relative">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 pb-24">
            {filteredStock.map(item => {
              const imageSource = item.image_url ? item.image_url : \`https://ui-avatars.com/api/?name=\${encodeURIComponent(item.item_name)}&background=random&color=fff&size=200\`;
              return (
                <div 
                  key={item.id} 
                  onClick={() => handleProductClick(item)}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group flex flex-col"
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-50 flex items-center justify-center p-4">
                    <img src={imageSource} alt={item.item_name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                    {item.qty_on_hand <= 0 && (
                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center backdrop-blur-[1px]">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">Habis</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1 border-t border-gray-100">
                    <h3 className="font-bold text-gray-800 text-sm leading-tight mb-1 line-clamp-2 flex-1">{item.item_name}</h3>
                    <p className="text-[#1d4ed8] font-bold text-base mt-2">{formatRupiah(item.sell_price)}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* FAB for Mobile */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-[#f97316] text-white rounded-full flex items-center justify-center shadow-xl shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all z-40"
          >
            <div className="relative">
              <ShoppingCart size={24} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-[#f97316] text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#f97316]">
                  {cart.length}
                </span>
              )}
            </div>
          </button>
        </div>
      </div>
      
      {/* Mobile Scrim */}
      {isCartOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40"
          onClick={() => setIsCartOpen(false)}
        ></div>
      )}
    </div>
  )
}
\`;

fs.writeFileSync(filePath, beforeMain + '\n' + newMainUi);
console.log('Successfully updated PosApp.jsx with Tailwind layout!');
