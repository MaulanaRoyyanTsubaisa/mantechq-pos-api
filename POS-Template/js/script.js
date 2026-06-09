// ======================== DATA AWAL ========================
let products = [
  {
    id: 1,
    name: "Indomie Goreng",
    price: 3500,
    image: "https://placehold.co/400x300/FFEAA7/5D4037?text=🍜+Indomie",
  },
  {
    id: 2,
    name: "Aqua 600ml",
    price: 4000,
    image: "https://placehold.co/400x300/D4F1F9/2C3E50?text=💧+Aqua",
  },
  {
    id: 3,
    name: "Roti Tawar",
    price: 12000,
    image: "https://placehold.co/400x300/F3E5F5/4A235A?text=🍞+Roti",
  },
  {
    id: 4,
    name: "Pensil 2B",
    price: 2500,
    image: "https://placehold.co/400x300/FFDAB9/8B4513?text=✏️+Pensil",
  },
  {
    id: 5,
    name: "Buku Notes",
    price: 8000,
    image: "https://placehold.co/400x300/CCE2CB/1E3A1E?text=📓+Buku",
  },
  {
    id: 6,
    name: "Sabun Mandi",
    price: 6500,
    image: "https://placehold.co/400x300/E8E0F0/3B1E54?text=🧼+Sabun",
  },
  {
    id: 7,
    name: "Mie Level 15",
    price: 15000,
    image: "https://placehold.co/400x300/FCE4EC/880E4F?text=🌶️+Mie+Pedas",
  },
  {
    id: 8,
    name: "Teh Botol",
    price: 6000,
    image: "https://placehold.co/400x300/C8E6C9/1B5E20?text=🍵+Teh",
  },
  {
    id: 9,
    name: "Kerupuk",
    price: 2000,
    image: "https://placehold.co/400x300/FFF9C4/6B4E2E?text=🍘+Kerupuk",
  },
  {
    id: 10,
    name: "Kopi Hitam",
    price: 5000,
    image: "https://placehold.co/400x300/D7CCC8/4E342E?text=☕+Kopi",
  },
];
let cart = [];

// ======================== HELPER FUNCTIONS ========================
function formatRupiah(angka) {
  return "Rp " + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function saveToLocalStorage() {
  localStorage.setItem("pos_products", JSON.stringify(products));
  localStorage.setItem("pos_cart", JSON.stringify(cart));
}

function loadFromLocalStorage() {
  const storedProducts = localStorage.getItem("pos_products");
  const storedCart = localStorage.getItem("pos_cart");
  if (storedProducts) products = JSON.parse(storedProducts);
  if (storedCart) cart = JSON.parse(storedCart);
}

// ======================== RENDER PRODUK ========================
function renderProducts(searchTerm = "") {
  const grid = $("#productsGrid");
  grid.empty();

  let filteredProducts = products;
  if (searchTerm) {
    filteredProducts = products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }

  if (filteredProducts.length === 0) {
    grid.html(`
            <div class="col-span-full flex flex-col items-center justify-center py-16 text-gray-400">
                <i class="fas fa-search text-5xl mb-3 opacity-50"></i>
                <p class="text-sm">Produk tidak ditemukan</p>
                <p class="text-xs mt-1">Coba kata kunci lain</p>
            </div>
        `);
    return;
  }

  filteredProducts.forEach((product) => {
    const card = $(`
            <div class="product-card group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100">
                <div class="relative overflow-hidden">
                    <img src="${product.image}" alt="${product.name}" class="product-img w-full h-28 object-cover group-hover:scale-105 transition-transform duration-300">
                    <div class="absolute top-2 right-2 bg-white/90 backdrop-blur rounded-full px-2 py-0.5 text-xs font-bold text-indigo-600 shadow-sm">
                        ${formatRupiah(product.price)}
                    </div>
                </div>
                <div class="p-3">
                    <h3 class="font-semibold text-gray-800 text-sm truncate">${product.name}</h3>
                    <button data-id="${product.id}" class="add-to-cart-btn mt-2 w-full bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-500 hover:to-purple-500 hover:text-white text-indigo-600 text-xs font-medium py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-1">
                        <i class="fas fa-cart-plus text-xs"></i> Tambah
                    </button>
                </div>
            </div>
        `);
    grid.append(card);
  });

  $(".add-to-cart-btn")
    .off("click")
    .on("click", function (e) {
      e.stopPropagation();
      const productId = parseInt($(this).data("id"));
      addToCart(productId);
    });
}

// ======================== RENDER KERANJANG ========================
function renderCart() {
  const container = $("#cartItemsContainer");
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  $("#cartCount").text(totalItems);

  if (cart.length === 0) {
    container.html(`
            <div class="empty-state flex flex-col items-center justify-center py-16 text-gray-400">
                <i class="fas fa-shopping-bag text-6xl mb-4 opacity-30"></i>
                <p class="text-sm font-medium">Keranjang Kosong</p>
                <p class="text-xs mt-1">Yuk, pilih produk favoritmu</p>
            </div>
        `);
    $("#totalPrice").text(formatRupiah(0));
    return;
  }

  let total = 0;
  let itemsHtml = "";

  cart.forEach((item, idx) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;
    itemsHtml += `
            <div class="cart-item p-3 bg-white rounded-xl shadow-sm border border-gray-100 flex justify-between items-center gap-2">
                <div class="flex-1 min-w-0">
                    <h4 class="font-semibold text-gray-800 text-sm truncate">${item.name}</h4>
                    <p class="text-indigo-600 text-xs font-bold mt-0.5">${formatRupiah(item.price)}</p>
                </div>
                <div class="flex items-center gap-2">
                    <button data-idx="${idx}" class="cart-qty-minus w-7 h-7 rounded-full bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 transition-all flex items-center justify-center">
                        <i class="fas fa-minus text-xs"></i>
                    </button>
                    <span class="w-8 text-center font-bold text-sm text-gray-700">${item.quantity}</span>
                    <button data-idx="${idx}" class="cart-qty-plus w-7 h-7 rounded-full bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-600 transition-all flex items-center justify-center">
                        <i class="fas fa-plus text-xs"></i>
                    </button>
                    <button data-idx="${idx}" class="cart-remove-item w-7 h-7 rounded-full bg-gray-100 hover:bg-red-100 text-gray-400 hover:text-red-500 transition-all flex items-center justify-center">
                        <i class="fas fa-trash-alt text-xs"></i>
                    </button>
                </div>
            </div>
        `;
  });

  container.html(itemsHtml);
  $("#totalPrice").text(formatRupiah(total));

  // Event handlers for cart buttons
  $(".cart-qty-plus")
    .off("click")
    .on("click", function () {
      const idx = $(this).data("idx");
      if (cart[idx]) {
        cart[idx].quantity++;
        saveToLocalStorage();
        renderCart();
      }
    });

  $(".cart-qty-minus")
    .off("click")
    .on("click", function () {
      const idx = $(this).data("idx");
      if (cart[idx]) {
        if (cart[idx].quantity > 1) {
          cart[idx].quantity--;
        } else {
          cart.splice(idx, 1);
        }
        saveToLocalStorage();
        renderCart();
      }
    });

  $(".cart-remove-item")
    .off("click")
    .on("click", function () {
      const idx = $(this).data("idx");
      cart.splice(idx, 1);
      saveToLocalStorage();
      renderCart();
    });
}

// ======================== ADD TO CART ========================
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const existingItem = cart.find((item) => item.id === product.id);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  }

  saveToLocalStorage();
  renderCart();

  // Subtle notification
  Swal.fire({
    icon: "success",
    title: "Ditambahkan!",
    text: `${product.name} masuk ke keranjang`,
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1000,
    background: "#f0fdf4",
    iconColor: "#10b981",
  });
}

// ======================== CHECKOUT ========================
function checkout() {
  if (cart.length === 0) {
    Swal.fire({
      icon: "info",
      title: "Keranjang Kosong",
      text: "Belum ada produk yang dipilih",
      confirmButtonColor: "#6366f1",
    });
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  Swal.fire({
    title: "Konfirmasi Pembayaran",
    html: `
            <div class="text-left space-y-2 mt-2">
                <p><i class="fas fa-receipt text-indigo-500 w-6"></i> <strong>${itemCount}</strong> item</p>
                <p><i class="fas fa-tag text-indigo-500 w-6"></i> Total: <strong class="text-indigo-600">${formatRupiah(total)}</strong></p>
            </div>
        `,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#10b981",
    cancelButtonColor: "#6b7280",
    confirmButtonText: '<i class="fas fa-check-circle mr-1"></i> Ya, Bayar',
    cancelButtonText: '<i class="fas fa-times mr-1"></i> Batal',
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      cart = [];
      saveToLocalStorage();
      renderCart();
      Swal.fire({
        icon: "success",
        title: "Transaksi Berhasil!",
        html: `Terima kasih telah berbelanja!<br><span class="text-sm text-gray-500">Total pembayaran ${formatRupiah(total)}</span>`,
        confirmButtonColor: "#6366f1",
      });
    }
  });
}

// ======================== TAMBAH PRODUK (MODAL) ========================
function openModal() {
  $("#productModal").removeClass("hidden").addClass("flex");
  $("body").addClass("modal-open");
}

function closeModal() {
  $("#productModal").addClass("hidden").removeClass("flex");
  $("body").removeClass("modal-open");
  $("#modalProductName").val("");
  $("#modalProductPrice").val("");
}

function addNewProduct() {
  const name = $("#modalProductName").val().trim();
  const price = parseInt($("#modalProductPrice").val());

  if (!name) {
    Swal.fire("Oops!", "Nama produk harus diisi", "error");
    return;
  }
  if (isNaN(price) || price <= 0) {
    Swal.fire("Oops!", "Harga harus angka positif", "error");
    return;
  }

  const newId =
    products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
  const newProduct = {
    id: newId,
    name: name,
    price: price,
    image: `https://placehold.co/400x300/random?text=${encodeURIComponent(name.substring(0, 4))}`,
  };

  products.push(newProduct);
  saveToLocalStorage();
  renderProducts($("#searchProduct").val());
  closeModal();

  Swal.fire({
    icon: "success",
    title: "Berhasil!",
    text: `Produk "${name}" telah ditambahkan`,
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1500,
  });
}

// ======================== RESET ALL DATA ========================
function resetAllData() {
  Swal.fire({
    title: "Reset Semua Data?",
    text: "Semua produk custom akan hilang dan keranjang dikosongkan!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#6366f1",
    confirmButtonText: "Ya, Reset!",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      // Reset to default products
      products = [
        {
          id: 1,
          name: "Indomie Goreng",
          price: 3500,
          image: "https://placehold.co/400x300/FFEAA7/5D4037?text=🍜+Indomie",
        },
        {
          id: 2,
          name: "Aqua 600ml",
          price: 4000,
          image: "https://placehold.co/400x300/D4F1F9/2C3E50?text=💧+Aqua",
        },
        {
          id: 3,
          name: "Roti Tawar",
          price: 12000,
          image: "https://placehold.co/400x300/F3E5F5/4A235A?text=🍞+Roti",
        },
        {
          id: 4,
          name: "Pensil 2B",
          price: 2500,
          image: "https://placehold.co/400x300/FFDAB9/8B4513?text=✏️+Pensil",
        },
        {
          id: 5,
          name: "Buku Notes",
          price: 8000,
          image: "https://placehold.co/400x300/CCE2CB/1E3A1E?text=📓+Buku",
        },
        {
          id: 6,
          name: "Sabun Mandi",
          price: 6500,
          image: "https://placehold.co/400x300/E8E0F0/3B1E54?text=🧼+Sabun",
        },
        {
          id: 7,
          name: "Mie Level 15",
          price: 15000,
          image: "https://placehold.co/400x300/FCE4EC/880E4F?text=🌶️+Mie+Pedas",
        },
        {
          id: 8,
          name: "Teh Botol",
          price: 6000,
          image: "https://placehold.co/400x300/C8E6C9/1B5E20?text=🍵+Teh",
        },
        {
          id: 9,
          name: "Kerupuk",
          price: 2000,
          image: "https://placehold.co/400x300/FFF9C4/6B4E2E?text=🍘+Kerupuk",
        },
        {
          id: 10,
          name: "Kopi Hitam",
          price: 5000,
          image: "https://placehold.co/400x300/D7CCC8/4E342E?text=☕+Kopi",
        },
      ];
      cart = [];
      saveToLocalStorage();
      renderProducts();
      renderCart();
      Swal.fire("Reset Selesai!", "Semua data kembali ke awal", "success");
    }
  });
}

// ======================== INITIALIZATION ========================
$(document).ready(function () {
  loadFromLocalStorage();
  renderProducts();
  renderCart();

  // Search functionality
  let searchTimeout;
  $("#searchProduct").on("input", function () {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      renderProducts($(this).val());
    }, 300);
  });

  // Modal handlers
  $("#openModalBtn").on("click", openModal);
  $("#closeModalBtn, #cancelModalBtn").on("click", closeModal);
  $("#confirmAddProductBtn").on("click", addNewProduct);

  // Close modal on outside click
  $("#productModal").on("click", function (e) {
    if ($(e.target).is("#productModal")) closeModal();
  });

  // Action buttons
  $("#checkoutBtn").on("click", checkout);
  $("#clearCartBtn").on("click", () => {
    if (cart.length === 0) return;
    Swal.fire({
      text: "Kosongkan semua item di keranjang?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Ya, Kosongkan",
    }).then((res) => {
      if (res.isConfirmed) {
        cart = [];
        saveToLocalStorage();
        renderCart();
      }
    });
  });
  $("#resetBtn").on("click", resetAllData);

  // Enter key on modal inputs
  $("#modalProductName, #modalProductPrice").on("keypress", function (e) {
    if (e.which === 13) addNewProduct();
  });
});
