// ======================== DATA AWAL (MENU MAKANAN & MINUMAN) ========================
let products = [
  {
    id: 1,
    name: "Air Mineral",
    price: 3000,
    category: "Minuman",
    image: "images/air.jpg",
  },
  {
    id: 2,
    name: "Ayam Bakar",
    price: 25000,
    category: "Makanan",
    image: "images/ayam_bakar.jpg",
  },
  {
    id: 3,
    name: "Es Jeruk",
    price: 8000,
    category: "Minuman",
    image: "images/es_jeruk.jpg",
  },
  {
    id: 4,
    name: "Es Teh",
    price: 5000,
    category: "Minuman",
    image: "images/es_teh.jpg",
  },
  {
    id: 5,
    name: "Jus Jeruk",
    price: 12000,
    category: "Minuman",
    image: "images/jus_jeruk.jpg",
  },
  {
    id: 6,
    name: "Kentang Goreng",
    price: 15000,
    category: "Makanan",
    image: "images/kentang_goreng.jpg",
  },
  {
    id: 7,
    name: "Kerupuk",
    price: 2000,
    category: "Camilan",
    image: "images/kerupuk.jpg",
  },
  {
    id: 8,
    name: "Kopi Hitam",
    price: 7000,
    category: "Minuman",
    image: "images/kopi_hitam.jpg",
  },
  {
    id: 9,
    name: "Mie Goreng",
    price: 15000,
    category: "Makanan",
    image: "images/mie_goreng.jpg",
  },
  {
    id: 10,
    name: "Mie Rebus",
    price: 15000,
    category: "Makanan",
    image: "images/mie_rebus.jpg",
  },
  {
    id: 11,
    name: "Nasi Goreng",
    price: 18000,
    category: "Makanan",
    image: "images/nasi_goreng.jpg",
  },
  {
    id: 12,
    name: "Pisang Goreng",
    price: 10000,
    category: "Camilan",
    image: "images/pisang_goreng.jpg",
  },
  {
    id: 13,
    name: "Teh Pucuk",
    price: 6000,
    category: "Minuman",
    image: "images/teh_pucuk.jpg",
  },
];

let cart = [];

// ======================== HELPER FUNCTIONS ========================
function formatRupiah(angka) {
  return "Rp " + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function saveToLocalStorage() {
  localStorage.setItem("warung_products", JSON.stringify(products));
  localStorage.setItem("warung_cart", JSON.stringify(cart));
}

function loadFromLocalStorage() {
  const storedProducts = localStorage.getItem("warung_products");
  const storedCart = localStorage.getItem("warung_cart");
  if (storedProducts) products = JSON.parse(storedProducts);
  if (storedCart) cart = JSON.parse(storedCart);
}

// ======================== RENDER PRODUK (Horizontal Card Style) ========================
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
            <div class="col-span-full flex flex-col items-center justify-center py-20 bg-white/40 backdrop-blur rounded-3xl">
                <i class="fas fa-search text-5xl text-gray-300 mb-3"></i>
                <p class="text-gray-400 font-medium">Menu tidak ditemukan</p>
                <p class="text-xs text-gray-300 mt-1">Coba kata kunci lain</p>
            </div>
        `);
    return;
  }

  filteredProducts.forEach((product) => {
    // Fallback jika gambar error
    const imagePath = product.image;

    const card = $(`
            <div class="product-card-fresh p-4 cursor-pointer group">
                <div class="flex gap-4 items-center">
                    <div class="relative">
                        <img src="${imagePath}" alt="${product.name}" class="product-img-fresh w-20 h-20 rounded-2xl object-cover shadow-md" onerror="this.src='https://placehold.co/400x300/f97316/white?text=${encodeURIComponent(product.name)}'">
                        <div class="absolute -top-2 -right-2 category-tag">${product.category}</div>
                    </div>
                    <div class="flex-1">
                        <h3 class="font-extrabold text-gray-800 text-lg">${product.name}</h3>
                        <p class="text-orange-500 font-black text-xl mt-1">${formatRupiah(product.price)}</p>
                    </div>
                    <button data-id="${product.id}" class="add-to-cart-btn w-12 h-12 rounded-2xl bg-orange-500 text-white shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center transform hover:scale-110">
                        <i class="fas fa-plus text-xl"></i>
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
            <div class="flex flex-col items-center justify-center h-full text-center py-10">
                <div class="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center empty-cart-animation mb-3">
                    <i class="fas fa-hand-peace text-3xl text-gray-400"></i>
                </div>
                <p class="text-gray-400 font-medium">Keranjang kosong</p>
                <p class="text-xs text-gray-300 mt-1">Klik menu untuk memesan</p>
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
            <div class="cart-item-fresh flex justify-between items-center gap-2">
                <div class="flex-1 min-w-0">
                    <h4 class="font-bold text-gray-800 text-sm truncate">${item.name}</h4>
                    <p class="text-orange-500 text-xs font-bold mt-0.5">${formatRupiah(item.price)}</p>
                </div>
                <div class="flex items-center gap-2">
                    <button data-idx="${idx}" class="cart-qty-minus w-8 h-8 rounded-xl bg-gray-100 hover:bg-rose-100 text-gray-600 hover:text-rose-500 transition-all flex items-center justify-center font-bold">
                        <i class="fas fa-minus text-xs"></i>
                    </button>
                    <span class="w-8 text-center font-black text-gray-700 quantity-badge">${item.quantity}</span>
                    <button data-idx="${idx}" class="cart-qty-plus w-8 h-8 rounded-xl bg-gray-100 hover:bg-emerald-100 text-gray-600 hover:text-emerald-500 transition-all flex items-center justify-center font-bold">
                        <i class="fas fa-plus text-xs"></i>
                    </button>
                    <button data-idx="${idx}" class="cart-remove-item w-8 h-8 rounded-xl bg-gray-100 hover:bg-rose-100 text-gray-400 hover:text-rose-500 transition-all flex items-center justify-center">
                        <i class="fas fa-trash-alt text-xs"></i>
                    </button>
                </div>
            </div>
        `;
  });

  container.html(itemsHtml);
  $("#totalPrice").text(formatRupiah(total));

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
      category: product.category,
    });
  }

  saveToLocalStorage();
  renderCart();

  // Pop effect on add
  $('.add-to-cart-btn[data-id="' + productId + '"]').css(
    "transform",
    "scale(1.2)",
  );
  setTimeout(() => {
    $('.add-to-cart-btn[data-id="' + productId + '"]').css("transform", "");
  }, 200);

  Swal.fire({
    icon: "success",
    title: "Ditambahkan!",
    text: `${product.name} masuk ke keranjang`,
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1000,
    background: "#ffffff",
    iconColor: "#f97316",
  });
}

// ======================== CHECKOUT ========================
function checkout() {
  if (cart.length === 0) {
    Swal.fire({
      icon: "info",
      title: "Keranjang Kosong",
      text: "Tambahkan produk terlebih dahulu",
      confirmButtonColor: "#f97316",
    });
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  Swal.fire({
    title: "🍽️ Konfirmasi Pesanan",
    html: `
            <div class="text-left space-y-2 mt-2">
                <div class="flex justify-between"><span>Jumlah Item:</span><strong>${itemCount} item</strong></div>
                <div class="flex justify-between"><span>Total:</span><strong class="text-orange-500 text-xl">${formatRupiah(total)}</strong></div>
            </div>
        `,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#f97316",
    cancelButtonColor: "#ef4444",
    confirmButtonText:
      '<i class="fas fa-check-circle mr-1"></i> Bayar Sekarang',
    cancelButtonText: '<i class="fas fa-times mr-1"></i> Batal',
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      cart = [];
      saveToLocalStorage();
      renderCart();
      Swal.fire({
        icon: "success",
        title: "Pembayaran Berhasil! 🎉",
        html: `Terima kasih telah memesan!<br><span class="text-sm text-gray-500">Total pembayaran ${formatRupiah(total)}</span>`,
        confirmButtonColor: "#f97316",
      });
    }
  });
}

// ======================== TAMBAH PRODUK ========================
function openModal() {
  $("#productModal").removeClass("hidden").addClass("flex");
  $("body").addClass("modal-open");
}

function closeModal() {
  $("#productModal").addClass("hidden").removeClass("flex");
  $("body").removeClass("modal-open");
  $("#modalProductName").val("");
  $("#modalProductPrice").val("");
  $("#modalProductImage").val("");
}

function addNewProduct() {
  const name = $("#modalProductName").val().trim();
  const price = parseInt($("#modalProductPrice").val());
  let imageFile = $("#modalProductImage").val().trim();

  if (!name) {
    Swal.fire("Oops!", "Nama menu harus diisi", "error");
    return;
  }
  if (isNaN(price) || price <= 0) {
    Swal.fire("Oops!", "Harga harus angka positif", "error");
    return;
  }
  if (!imageFile) {
    imageFile = "default.jpg";
  }
  if (
    !imageFile.endsWith(".jpg") &&
    !imageFile.endsWith(".png") &&
    !imageFile.endsWith(".jpeg")
  ) {
    imageFile = imageFile + ".jpg";
  }

  const newId =
    products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 14;
  const newProduct = {
    id: newId,
    name: name,
    price: price,
    category: "Custom",
    image: `images/${imageFile}`,
  };

  products.push(newProduct);
  saveToLocalStorage();
  renderProducts($("#searchProduct").val());
  closeModal();

  Swal.fire({
    icon: "success",
    title: "Berhasil!",
    text: `"${name}" ditambahkan ke menu`,
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1500,
  });
}

// ======================== RESET ========================
function resetAllData() {
  Swal.fire({
    title: "Reset Semua Data?",
    text: "Semua menu custom akan hilang!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#f97316",
    confirmButtonText: "Ya, Reset!",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      products = [
        {
          id: 1,
          name: "Air Mineral",
          price: 3000,
          category: "Minuman",
          image: "images/air.jpg",
        },
        {
          id: 2,
          name: "Ayam Bakar",
          price: 25000,
          category: "Makanan",
          image: "images/ayam_bakar.jpg",
        },
        {
          id: 3,
          name: "Es Jeruk",
          price: 8000,
          category: "Minuman",
          image: "images/es_jeruk.jpg",
        },
        {
          id: 4,
          name: "Es Teh",
          price: 5000,
          category: "Minuman",
          image: "images/es_teh.jpg",
        },
        {
          id: 5,
          name: "Jus Jeruk",
          price: 12000,
          category: "Minuman",
          image: "images/jus_jeruk.jpg",
        },
        {
          id: 6,
          name: "Kentang Goreng",
          price: 15000,
          category: "Makanan",
          image: "images/kentang_goreng.jpg",
        },
        {
          id: 7,
          name: "Kerupuk",
          price: 2000,
          category: "Camilan",
          image: "images/kerupuk.jpg",
        },
        {
          id: 8,
          name: "Kopi Hitam",
          price: 7000,
          category: "Minuman",
          image: "images/kopi_hitam.jpg",
        },
        {
          id: 9,
          name: "Mie Goreng",
          price: 15000,
          category: "Makanan",
          image: "images/mie_goreng.jpg",
        },
        {
          id: 10,
          name: "Mie Rebus",
          price: 15000,
          category: "Makanan",
          image: "images/mie_rebus.jpg",
        },
        {
          id: 11,
          name: "Nasi Goreng",
          price: 18000,
          category: "Makanan",
          image: "images/nasi_goreng.jpg",
        },
        {
          id: 12,
          name: "Pisang Goreng",
          price: 10000,
          category: "Camilan",
          image: "images/pisang_goreng.jpg",
        },
        {
          id: 13,
          name: "Teh Pucuk",
          price: 6000,
          category: "Minuman",
          image: "images/teh_pucuk.jpg",
        },
      ];
      cart = [];
      saveToLocalStorage();
      renderProducts();
      renderCart();
      Swal.fire("Reset Selesai!", "Menu kembali ke awal", "success");
    }
  });
}

// ======================== FAB MENU TOGGLE ========================
function initFabMenu() {
  $("#fabMenuBtn").on("click", function (e) {
    e.stopPropagation();
    $("#fabMenu").toggleClass("hidden");
    const icon = $(this).find("i");
    if ($("#fabMenu").hasClass("hidden")) {
      icon.css("transform", "rotate(0deg)");
    } else {
      icon.css("transform", "rotate(45deg)");
    }
  });

  $(document).on("click", function (e) {
    if (
      !$(e.target).closest("#fabMenuBtn").length &&
      !$(e.target).closest("#fabMenu").length
    ) {
      $("#fabMenu").addClass("hidden");
      $("#fabMenuBtn").find("i").css("transform", "rotate(0deg)");
    }
  });
}

// ======================== INITIALIZATION ========================
$(document).ready(function () {
  loadFromLocalStorage();
  renderProducts();
  renderCart();
  initFabMenu();

  let searchTimeout;
  $("#searchProduct").on("input", function () {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      renderProducts($(this).val());
    }, 300);
  });

  $("#openModalBtn").on("click", openModal);
  $("#closeModalBtn, #cancelModalBtn").on("click", closeModal);
  $("#confirmAddProductBtn").on("click", addNewProduct);
  $("#resetBtn").on("click", resetAllData);

  $("#productModal").on("click", function (e) {
    if ($(e.target).is("#productModal")) closeModal();
  });

  $("#checkoutBtn").on("click", checkout);
  $("#clearCartBtn").on("click", () => {
    if (cart.length === 0) return;
    Swal.fire({
      text: "Kosongkan semua item di keranjang?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Ya, Kosongkan",
    }).then((res) => {
      if (res.isConfirmed) {
        cart = [];
        saveToLocalStorage();
        renderCart();
      }
    });
  });

  $("#modalProductName, #modalProductPrice, #modalProductImage").on(
    "keypress",
    function (e) {
      if (e.which === 13) addNewProduct();
    },
  );
});
