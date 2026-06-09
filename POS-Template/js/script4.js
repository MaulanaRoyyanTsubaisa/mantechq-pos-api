// ======================== DATA PRODUK (sesuai gambar lokal) ========================
let products = [
  { id: 1, name: "Air Mineral", price: 3000, image: "air.jpg" },
  { id: 2, name: "Ayam Bakar", price: 25000, image: "ayam_bakar.jpg" },
  { id: 3, name: "Es Jeruk", price: 8000, image: "es_jeruk.jpg" },
  { id: 4, name: "Es Teh", price: 5000, image: "es_teh.jpg" },
  { id: 5, name: "Jus Jeruk", price: 12000, image: "jus_jeruk.jpg" },
  { id: 6, name: "Kentang Goreng", price: 15000, image: "kentang_goreng.jpg" },
  { id: 7, name: "Kerupuk", price: 2000, image: "kerupuk.jpg" },
  { id: 8, name: "Kopi Hitam", price: 7000, image: "kopi_hitam.jpg" },
  { id: 9, name: "Mie Goreng", price: 15000, image: "mie_goreng.jpg" },
  { id: 10, name: "Mie Rebus", price: 15000, image: "mie_rebus.jpg" },
  { id: 11, name: "Nasi Goreng", price: 18000, image: "nasi_goreng.jpg" },
  { id: 12, name: "Pisang Goreng", price: 10000, image: "pisang_goreng.jpg" },
  { id: 13, name: "Teh Pucuk", price: 6000, image: "teh_pucuk.jpg" },
];

let cart = [];

// ======================== HELPER ========================
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

// ======================== RENDER PRODUK (SQUARE TILE) ========================
function renderProducts(searchTerm = "") {
  const grid = $("#productsGrid");
  grid.empty();

  let filteredProducts = products;
  if (searchTerm) {
    filteredProducts = products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }

  //   lg(filteredProducts);
  //   alert("abc");
  if (filteredProducts.length === 0) {
    grid.html(`
            <div class="col-span-full flex flex-col items-center justify-center py-20">
                <i class="fas fa-search text-5xl text-gray-300 mb-3"></i>
                <p class="text-gray-400 font-medium">Menu tidak ditemukan</p>
                <p class="text-gray-300 text-xs mt-1">Coba kata kunci lain</p>
            </div>
        `);
    return;
  }

  filteredProducts.forEach((product) => {
    // Path gambar dari folder images/
    const imagePath = `images/${product.image}`;
    const tile = $(`
            <div class="product-tile" data-id="${product.id}">
                <div class="product-image-container">
                    <img src="${imagePath}" alt="${product.name}" class="product-image" onerror="this.src='https://placehold.co/400x400/fef3e8/f97316?text=' + encodeURIComponent('${product.name}')">
                </div>
                <div class="product-info">
                    <div class="product-name">${product.name}</div>
                    <div class="product-price">${formatRupiah(product.price)}</div>
                </div>
            </div>
        `);

    tile.on("click", () => addToCart(product.id));
    grid.append(tile);
  });
}

// ======================== RENDER KERANJANG ========================
function renderCart() {
  const container = $("#cartItemsContainer");
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  $("#cartCount").text(totalItems);

  if (cart.length === 0) {
    container.html(`
            <div class="flex flex-col items-center justify-center h-64 text-center">
                <div class="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
                    <i class="fas fa-receipt text-gray-300 text-3xl"></i>
                </div>
                <p class="text-gray-400 font-medium">Keranjang kosong</p>
                <p class="text-gray-300 text-xs mt-1">Klik menu untuk memesan</p>
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
            <div class="cart-item">
                <div class="flex justify-between items-start mb-2">
                    <div class="flex-1">
                        <div class="font-bold text-gray-800 text-sm">${item.name}</div>
                        <div class="text-[#f97316] text-xs font-bold mt-0.5">${formatRupiah(item.price)}</div>
                    </div>
                    <button data-idx="${idx}" class="remove-btn qty-btn bg-white border border-gray-200 text-gray-400 hover:text-red-500">
                        <i class="fas fa-trash-alt text-xs"></i>
                    </button>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-xs text-gray-400">Subtotal: ${formatRupiah(subtotal)}</span>
                    <div class="flex items-center gap-2">
                        <button data-idx="${idx}" class="cart-qty-minus qty-btn">
                            <i class="fas fa-minus text-xs"></i>
                        </button>
                        <span class="w-8 text-center font-bold text-sm text-gray-800">${item.quantity}</span>
                        <button data-idx="${idx}" class="cart-qty-plus qty-btn">
                            <i class="fas fa-plus text-xs"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
  });

  container.html(itemsHtml);
  $("#totalPrice").text(formatRupiah(total));

  // Event handlers
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

  $(".remove-btn")
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
      image: product.image,
    });
  }

  saveToLocalStorage();
  renderCart();

  // Pop animation on tile
  $(`.product-tile[data-id="${productId}"]`).addClass("tile-pop");
  setTimeout(
    () => $(`.product-tile[data-id="${productId}"]`).removeClass("tile-pop"),
    200,
  );

  // Toast notification
  Swal.fire({
    icon: "success",
    title: "Ditambahkan!",
    text: `${product.name} masuk ke keranjang`,
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1000,
    background: "#1e293b",
    color: "#fff",
    iconColor: "#f97316",
  });
}

// ======================== CHECKOUT ========================
function checkout() {
  if (cart.length === 0) {
    Swal.fire("Keranjang Kosong", "Tidak ada item untuk dibayar", "info");
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  Swal.fire({
    title: "🍽️ Konfirmasi Pesanan",
    html: `
            <div class="text-left space-y-2">
                <div class="flex justify-between border-b pb-2">
                    <span>Total Item:</span>
                    <strong>${itemCount}</strong>
                </div>
                <div class="flex justify-between">
                    <span>Total Bayar:</span>
                    <strong class="text-[#f97316] text-xl">${formatRupiah(total)}</strong>
                </div>
            </div>
        `,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#f97316",
    cancelButtonColor: "#64748b",
    confirmButtonText:
      '<i class="fas fa-check-circle mr-1"></i> Bayar Sekarang',
    cancelButtonText: '<i class="fas fa-times mr-1"></i> Batal',
  }).then((result) => {
    if (result.isConfirmed) {
      cart = [];
      saveToLocalStorage();
      renderCart();
      Swal.fire({
        icon: "success",
        title: "Pesanan Berhasil!",
        html: `Terima kasih telah memesan!<br><span class="text-sm text-gray-500">Total ${formatRupiah(total)}</span>`,
        confirmButtonColor: "#f97316",
      });
    }
  });
}

// ======================== TAMBAH PRODUK ========================
function openModal() {
  $("#productModal").removeClass("hidden");
  $("body").addClass("modal-open");
}

function closeModal() {
  $("#productModal").addClass("hidden");
  $("body").removeClass("modal-open");
  $("#modalProductName").val("");
  $("#modalProductPrice").val("");
  $("#modalProductImage").val("");
}

function addNewProduct() {
  const name = $("#modalProductName").val().trim();
  const price = parseInt($("#modalProductPrice").val());
  let image = $("#modalProductImage").val().trim();

  if (!name) {
    Swal.fire("Oops", "Nama menu harus diisi", "error");
    return;
  }
  if (isNaN(price) || price <= 0) {
    Swal.fire("Oops", "Harga harus angka positif", "error");
    return;
  }
  if (!image) {
    image = "default.jpg";
  }
  if (
    !image.endsWith(".jpg") &&
    !image.endsWith(".png") &&
    !image.endsWith(".jpeg")
  ) {
    image = image + ".jpg";
  }

  const newId =
    products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 14;
  const newProduct = {
    id: newId,
    name: name,
    price: price,
    image: image,
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
    title: "Reset Data?",
    text: "Semua menu custom akan hilang",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#64748b",
    confirmButtonText: "Ya, Reset",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      products = [
        { id: 1, name: "Air Mineral", price: 3000, image: "air.jpg" },
        { id: 2, name: "Ayam Bakar", price: 25000, image: "ayam_bakar.jpg" },
        { id: 3, name: "Es Jeruk", price: 8000, image: "es_jeruk.jpg" },
        { id: 4, name: "Es Teh", price: 5000, image: "es_teh.jpg" },
        { id: 5, name: "Jus Jeruk", price: 12000, image: "jus_jeruk.jpg" },
        {
          id: 6,
          name: "Kentang Goreng",
          price: 15000,
          image: "kentang_goreng.jpg",
        },
        { id: 7, name: "Kerupuk", price: 2000, image: "kerupuk.jpg" },
        { id: 8, name: "Kopi Hitam", price: 7000, image: "kopi_hitam.jpg" },
        { id: 9, name: "Mie Goreng", price: 15000, image: "mie_goreng.jpg" },
        { id: 10, name: "Mie Rebus", price: 15000, image: "mie_rebus.jpg" },
        { id: 11, name: "Nasi Goreng", price: 18000, image: "nasi_goreng.jpg" },
        {
          id: 12,
          name: "Pisang Goreng",
          price: 10000,
          image: "pisang_goreng.jpg",
        },
        { id: 13, name: "Teh Pucuk", price: 6000, image: "teh_pucuk.jpg" },
      ];
      cart = [];
      saveToLocalStorage();
      renderProducts();
      renderCart();
      Swal.fire("Reset Selesai", "Menu kembali ke awal", "success");
    }
  });
}

// ======================== FAB MENU TOGGLE ========================
function initFabMenu() {
  $("#fabMenuBtn").on("click", function (e) {
    e.stopPropagation();
    $("#fabMenu").toggleClass("hidden");
    // Rotate icon
    const icon = $(this).find("i");
    if ($("#fabMenu").hasClass("hidden")) {
      icon.css("transform", "rotate(0deg)");
    } else {
      icon.css("transform", "rotate(45deg)");
    }
  });

  // Close floating menu when clicking outside
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

function lg(log) {
  console.log(log);
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
    searchTimeout = setTimeout(() => renderProducts($(this).val()), 250);
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
      text: "Kosongkan keranjang?",
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
