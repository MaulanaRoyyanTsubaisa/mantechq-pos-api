// ======================== DATA AWAL ========================
let products = [
  { id: 1, name: "Mouse Wireless", price: 85000, icon: "fa-mouse" },
  { id: 2, name: "Keyboard Mekanik", price: 275000, icon: "fa-keyboard" },
  { id: 3, name: "Headset Gaming", price: 185000, icon: "fa-headphones" },
  { id: 4, name: "Flashdisk 32GB", price: 65000, icon: "fa-usb" },
  { id: 5, name: "Power Bank", price: 125000, icon: "fa-battery-full" },
  { id: 6, name: "Charger Fast", price: 45000, icon: "fa-plug" },
  { id: 7, name: "Kabel USB-C", price: 25000, icon: "fa-cable-car" },
  { id: 8, name: "Webcam HD", price: 165000, icon: "fa-camera" },
  { id: 9, name: "Speaker Bluetooth", price: 195000, icon: "fa-music" },
  { id: 10, name: "Microphone", price: 145000, icon: "fa-microphone" },
  { id: 11, name: "SSD External", price: 375000, icon: "fa-database" },
  { id: 12, name: "Dock Station", price: 225000, icon: "fa-plug" },
];

let cart = [];

// ======================== HELPER ========================
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

// ======================== RENDER PRODUK (TILE PERSEGI) ========================
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
            <div class="col-span-full flex flex-col items-center justify-center py-20">
                <i class="fas fa-box-open text-5xl text-gray-300 mb-3"></i>
                <p class="text-gray-400">Produk tidak ditemukan</p>
            </div>
        `);
    return;
  }

  filteredProducts.forEach((product) => {
    const tile = $(`
            <div class="product-tile" data-id="${product.id}">
                <div class="product-icon">
                    <i class="fas ${product.icon}"></i>
                </div>
                <div class="product-name">${product.name}</div>
                <div class="product-price">${formatRupiah(product.price)}</div>
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
                <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
                    <i class="fas fa-shopping-cart text-gray-300 text-2xl"></i>
                </div>
                <p class="text-gray-400 text-sm">Keranjang kosong</p>
                <p class="text-gray-300 text-xs mt-1">Klik produk untuk menambah</p>
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
                    <div>
                        <div class="font-semibold text-navy text-sm">${item.name}</div>
                        <div class="text-accent text-xs font-bold mt-0.5">${formatRupiah(item.price)}</div>
                    </div>
                    <button data-idx="${idx}" class="remove-btn qty-btn bg-white border border-gray-border text-gray-400 hover:text-red-500">
                        <i class="fas fa-trash-alt text-xs"></i>
                    </button>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-xs text-gray-400">Subtotal: ${formatRupiah(subtotal)}</span>
                    <div class="flex items-center gap-2">
                        <button data-idx="${idx}" class="cart-qty-minus qty-btn">
                            <i class="fas fa-minus text-xs"></i>
                        </button>
                        <span class="w-8 text-center font-semibold text-sm">${item.quantity}</span>
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
    title: "Ditambahkan",
    text: `${product.name} masuk ke keranjang`,
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1000,
    background: "#1e293b",
    color: "#fff",
    iconColor: "#2563eb",
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
    title: "Konfirmasi Pembayaran",
    html: `
            <div class="text-left space-y-2">
                <div class="flex justify-between"><span>Item:</span><strong>${itemCount} produk</strong></div>
                <div class="flex justify-between"><span>Total:</span><strong class="text-accent">${formatRupiah(total)}</strong></div>
            </div>
        `,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#2563eb",
    cancelButtonColor: "#64748b",
    confirmButtonText: "Ya, Bayar",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      cart = [];
      saveToLocalStorage();
      renderCart();
      Swal.fire(
        "Sukses!",
        `Pembayaran ${formatRupiah(total)} berhasil`,
        "success",
      );
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
  $("#modalProductIcon").val("");
  $("#iconPreview").attr("class", "fas fa-tag");
}

function addNewProduct() {
  const name = $("#modalProductName").val().trim();
  const price = parseInt($("#modalProductPrice").val());
  let icon = $("#modalProductIcon").val().trim();

  if (!name) {
    Swal.fire("Oops", "Nama produk harus diisi", "error");
    return;
  }
  if (isNaN(price) || price <= 0) {
    Swal.fire("Oops", "Harga harus angka positif", "error");
    return;
  }
  if (!icon) icon = "fa-tag";
  if (!icon.startsWith("fa-")) icon = "fa-" + icon;

  const newId =
    products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
  const newProduct = {
    id: newId,
    name: name,
    price: price,
    icon: icon,
  };

  products.push(newProduct);
  saveToLocalStorage();
  renderProducts($("#searchProduct").val());
  closeModal();

  Swal.fire({
    icon: "success",
    title: "Berhasil",
    text: `Produk "${name}" ditambahkan`,
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
    text: "Semua produk custom akan hilang",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#64748b",
    confirmButtonText: "Ya, Reset",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      products = [
        { id: 1, name: "Mouse Wireless", price: 85000, icon: "fa-mouse" },
        { id: 2, name: "Keyboard Mekanik", price: 275000, icon: "fa-keyboard" },
        { id: 3, name: "Headset Gaming", price: 185000, icon: "fa-headphones" },
        { id: 4, name: "Flashdisk 32GB", price: 65000, icon: "fa-usb" },
        { id: 5, name: "Power Bank", price: 125000, icon: "fa-battery-full" },
        { id: 6, name: "Charger Fast", price: 45000, icon: "fa-plug" },
        { id: 7, name: "Kabel USB-C", price: 25000, icon: "fa-cable-car" },
        { id: 8, name: "Webcam HD", price: 165000, icon: "fa-camera" },
        { id: 9, name: "Speaker Bluetooth", price: 195000, icon: "fa-music" },
        { id: 10, name: "Microphone", price: 145000, icon: "fa-microphone" },
        { id: 11, name: "SSD External", price: 375000, icon: "fa-database" },
        { id: 12, name: "Dock Station", price: 225000, icon: "fa-plug" },
      ];
      cart = [];
      saveToLocalStorage();
      renderProducts();
      renderCart();
      Swal.fire("Reset Selesai", "Data kembali ke awal", "success");
    }
  });
}

// ======================== ICON PREVIEW ========================
function updateIconPreview() {
  let icon = $("#modalProductIcon").val().trim();
  if (!icon) icon = "fa-tag";
  if (!icon.startsWith("fa-")) icon = "fa-" + icon;
  $("#iconPreview").attr("class", `fas ${icon} text-gray-500`);
}

// ======================== INIT ========================
$(document).ready(function () {
  loadFromLocalStorage();
  renderProducts();
  renderCart();

  let searchTimeout;
  $("#searchProduct").on("input", function () {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => renderProducts($(this).val()), 250);
  });

  $("#openModalBtn").on("click", openModal);
  $("#closeModalBtn, #cancelModalBtn").on("click", closeModal);
  $("#confirmAddProductBtn").on("click", addNewProduct);
  $("#modalProductIcon").on("input", updateIconPreview);

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
  $("#resetBtn").on("click", resetAllData);

  $("#modalProductName, #modalProductPrice").on("keypress", function (e) {
    if (e.which === 13) addNewProduct();
  });
});
