/* ======================================================================
   НАСТРОЙКА EMAILJS — автописьмо клиенту "Спасибо за заказ"
   ------------------------------------------------------------------
   Письмо клиенту отправляется ТОЛЬКО после успешной оплаты PayPal.
 
   БЕЗОПАСНОСТЬ: EMAILJS_PUBLIC_KEY / SERVICE_ID / TEMPLATE_ID видны
   в исходниках — это нормально для клиентской интеграции EmailJS,
   но чтобы этими ключами нельзя было воспользоваться с чужого сайта
   (спам через ваш аккаунт), в личном кабинете EmailJS обязательно
   включите ограничение по разрешённым доменам (Allowed Origins /
   Domain restriction), указав только домен InkTheory.
   ====================================================================== */
const EMAILJS_PUBLIC_KEY  = "6ck12n75Ku0jwZinW";
const EMAILJS_SERVICE_ID  = "service_ee9a096";
const EMAILJS_TEMPLATE_ID = "template_kco6uyf";
 
/* БЕЗОПАСНОСТЬ: прямой email в открытом виде в коде легко собирают
   спам-боты. После активации формы на formsubmit.co там выдаётся
   персональный хэш-эндпоинт вида https://formsubmit.co/xxxxxxxxx —
   рекомендуется заменить им FORMSUBMIT_URL и оба "action" в PayPal.js. */
const FORMSUBMIT_URL = "https://formsubmit.co/lyvero.company@gmail.com";
 
 
if (window.emailjs && EMAILJS_PUBLIC_KEY) {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}
 
function sendCustomerConfirmationEmail(params) {
    if (!window.emailjs || !EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
        console.warn('EmailJS не настроен — письмо клиенту не отправлено. См. комментарий "НАСТРОЙКА EMAILJS" в начале script.js.');
        return;
    }
 
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params).catch(err => {
        console.error('EmailJS error:', err);
    });
}
 
// =========================================================================
// HTML ESCAPE
// -------------------------------------------------------------------------
// Единственная функция экранирования на весь файл (раньше была
// продублирована в двух местах — вторая копия незаметно перекрывала
// первую; оставлена одна, чтобы не путать при дальнейшей доработке).
// =========================================================================
 
function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
 
// Стоимость доставки
const shippingRates = {
    "omniva": 2.99,
    "dpd": 2.99,
    "europe": 2.99
};
 
// Официальные страницы с картами пунктов выдачи по каждому перевозчику
const carrierLocatorLinks = {
    omniva: "https://www.omniva.ee/asukohad",
    dpd: "https://www.dpd.ee/",
    europe: "https://www.smartpost.ee/"
};
 
// =========================================================================
// ДАННЫЕ О ТОВАРАХ И ИХ ТЕКУЩЕМ ВЫБОРЕ ДЛЯ МОДАЛКИ PAYPAL
//
// TODO ДЛЯ НОВЫХ ТОВАРОВ "new-product-1" / "new-product-2":
//  1) поменять id на реальный (и точно так же — в index.html
//     в data-product-id, и в объекте productNames ниже)
//  2) вписать реальное name / price
//  3) вписать реальные пути к картинкам вместо TODO-...
//
// ПРОВЕРЬ ВРУЧНУЮ (несостыковки путей, найденные при аудите — их нельзя
// исправить вслепую без доступа к реальной папке images/ на сервере):
//  - "signal-lost": data-white в index.html указывает на
//    "images/TODO-new-3-white.png" — незаполненный плейсхолдер.
//  - "no-kings": в этом объекте colors.black указывает на
//    "images/No Kings.jpg", но в index.html для No Kings в селекте
//    цвета доступен только "white", а data-black вообще пустой —
//    похоже на неиспользуемые/устаревшие данные.
//  - в data-images-* на некоторых карточках (No Kings, Time to live)
//    часть путей начинается с "img/" вместо "images/", плюс опечатка
//    "No KIngs-back.png" — с большой "I". Если файлы реально лежат
//    в "images/", карусель для этих ракурсов будет показывать разбитую
//    картинку.
// =========================================================================
 
const products = [
    { id: 'signal-lost', name: 'Signal Lost', price: 18.00, colors: { black: 'images/signal-front.jpg', white: 'images/TODO-new-3-white.png' } },
    { id: 'no-kings', name: 'No Kings', price: 18.00, colors: { black: 'images/No Kings.jpg', white: 'images/No Kings.png' } },
    { id: 'connection', name: 'Connection', price: 16.00, colors: { black: 'images/ConnectionB.jpg', white: 'images/ConnectionW.jpg' } },
    { id: 'time-to-live', name: 'Time ti live', price: 16.00, colors: { black: 'images/Time to liveB.png', white: 'images/Time to liveW.png' } },
    { id: 'never', name: 'Never Give Up', price: 15.00, colors: { black: 'images/Never Give Up.png', white: 'images/Never Give Up.png' } },
    { id: 'chaos', name: 'Chaos', price: 15.00, colors: { black: 'images/Chaos (2).png', white: 'images/Chaos (2).png' } },
    { id: 'summer', name: 'Summer Vibes', price: 15.00, colors: { black: 'images/Summer Vibes Black.png', white: 'images/Summer Vibes White.png' } },
    { id: 'drive', name: 'Tokyo Drive', price: 15.00, colors: { black: 'images/Tokyo Drive Black.png', white: 'images/Tokyo Drive White.png' } },
    { id: 'samurai', name: 'Shadow Ronin', price: 15.00, colors: { black: 'images/Shadow ronin Black.png', white: 'images/Shadow ronin Black.png' } }
    
];
 
const catalogSelection = {
    'signal-lost': { color: 'black', size: 'S', fit: 'regular' },
    'no-kings': { color: 'black', size: 'S', fit: 'regular' },
    'connection': { color: 'black', size: 'S', fit: 'regular' },
    'time-to-live': { color: 'black', size: 'S', fit: 'regular' },
    never: { color: 'black', size: 'S', fit: 'regular' },
    chaos: { color: 'white', size: 'S', fit: 'regular' },
    summer: { color: 'black', size: 'S', fit: 'regular' },
    drive: { color: 'black', size: 'S', fit: 'regular' },
    samurai: { color: 'black', size: 'S', fit: 'regular' }
};
 
function updateCatalogSelection() {
    document.querySelectorAll('.product-card').forEach(card => {
        const prodId = card.getAttribute('data-product-id');
        if (!prodId || !catalogSelection[prodId]) return;
 
        const colorSelect = card.querySelector('.color-select');
        const sizeSelect = card.querySelectorAll('.options select')[1];
        const fitSelect = card.querySelector('.fit-select');
 
        if (colorSelect) {
            catalogSelection[prodId].color = colorSelect.value;
            colorSelect.addEventListener('change', (e) => {
                catalogSelection[prodId].color = e.target.value;
            });
        }
 
        if (sizeSelect) {
            catalogSelection[prodId].size = sizeSelect.value;
            sizeSelect.addEventListener('change', (e) => {
                catalogSelection[prodId].size = e.target.value;
            });
        }
 
        if (fitSelect) {
            catalogSelection[prodId].fit = fitSelect.value;
            fitSelect.addEventListener('change', (e) => {
                catalogSelection[prodId].fit = e.target.value;
            });
        }
    });
}
 
updateCatalogSelection();
 
// =========================================================================
// КАРТА ВЫБОРА МЕСТА ДОСТАВКИ
// (универсальная: принимает id элементов, чтобы работать
//  и в модалке одного товара, и в модалке корзины)
// =========================================================================
 
function initDeliveryMap(ids = {}) {
    const canvasId      = ids.canvas      || 'fastMapCanvas';
    const addressId     = ids.address     || 'fastDeliveryAddress';
    const searchInputId = ids.searchInput || 'fastMapSearchInput';
    const searchBtnId   = ids.searchBtn   || 'fastMapSearchBtn';
 
    const canvas = document.getElementById(canvasId);
 
    if (!canvas || !window.L) return;
 
    const map = L.map(canvas, {
        attributionControl: true
    }).setView([59.4370, 24.7536], 12);
 
    L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap'
        }
    ).addTo(map);
 
    let marker = null;
 
    const addressField =
        document.getElementById(addressId);
 
    function setMarker(lat, lon, popupText) {
        if (marker) {
            map.removeLayer(marker);
        }
 
        marker = L.marker([lat, lon], {
            draggable: true
        }).addTo(map);
 
        if (popupText) {
            marker
                .bindPopup(popupText)
                .openPopup();
        }
 
        marker.on('dragend', () => {
            const pos = marker.getLatLng();
 
            reverseGeocode(
                pos.lat,
                pos.lng
            );
        });
    }
 
    function reverseGeocode(lat, lon) {
        fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
        )
            .then(r => r.json())
            .then(data => {
                if (addressField) {
                    addressField.value =
                        data.display_name ||
                        `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
                }
            })
            .catch(() => {});
    }
 
    map.on('click', (e) => {
        setMarker(
            e.latlng.lat,
            e.latlng.lng
        );
 
        reverseGeocode(
            e.latlng.lat,
            e.latlng.lng
        );
    });
 
    const searchInputEl =
        document.getElementById(searchInputId);
 
    const searchBtnEl =
        document.getElementById(searchBtnId);
 
    function runSearch() {
        const q =
            (searchInputEl.value || '').trim();
 
        if (!q) return;
 
        fetch(
            `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q + ', Eesti')}`
        )
            .then(r => r.json())
            .then(results => {
                if (results && results[0]) {
 
                    const lat =
                        parseFloat(results[0].lat);
 
                    const lon =
                        parseFloat(results[0].lon);
 
                    map.setView(
                        [lat, lon],
                        15
                    );
 
                    setMarker(
                        lat,
                        lon,
                        results[0].display_name
                    );
 
                    if (addressField) {
                        addressField.value =
                            results[0].display_name;
                    }
                }
            })
            .catch(() => {});
    }
 
    if (searchBtnEl) {
        searchBtnEl.addEventListener(
            'click',
            runSearch
        );
    }
 
    if (searchInputEl) {
        searchInputEl.addEventListener(
            'keydown',
            (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    runSearch();
                }
            }
        );
    }
 
    setTimeout(
        () => map.invalidateSize(),
        250
    );
}
 
function renderMapLinks(method, d, linksId = 'fastMapLinks') {
    const box =
        document.getElementById(linksId);
 
    if (!box) return;
 
    const labels = {
        omniva: d.mapLinkOmniva,
        dpd: d.mapLinkDpd,
        europe: d.mapLinkSmartpost
    };
 
    const href =
        carrierLocatorLinks[method] ||
        carrierLocatorLinks.omniva;
 
    const label =
        labels[method] ||
        labels.omniva;
 
    box.innerHTML = `
        <a
            class="delivery-map-link"
            href="${href}"
            target="_blank"
            rel="noopener"
        >
            🗺 ${escapeHTML(label)}
        </a>
    `;
}
 
// =========================================================================
// КОРЗИНА INKTHEORY
// =========================================================================
 
const CART_SHIPPING = 2.99;
const CART_STORAGE_KEY = "inktheory_cart_v3";
 
let cart = [];
 
// =========================================================================
// ЗАГРУЗКА КОРЗИНЫ
// =========================================================================
 
try {
    const savedCart = JSON.parse(
        localStorage.getItem(CART_STORAGE_KEY) || "[]"
    );
 
    if (Array.isArray(savedCart)) {
        cart = savedCart;
    }
} catch (error) {
    console.warn("Ошибка загрузки корзины:", error);
    cart = [];
}
 
// =========================================================================
// ЭЛЕМЕНТЫ
// =========================================================================
 
const cartButtons = document.querySelectorAll(".cart-btn");
const cartCounter = document.querySelector(".cart-count");
const cartTrigger = document.querySelector(".cart-trigger");
const cartWindow = document.querySelector(".cart-window");
const cartItems = document.querySelector(".cart-items");
const clearCartButton = document.querySelector(".clear-cart");
const closeCartButton = document.querySelector(".cart-close");
 
const checkoutButton =
    document.getElementById("lang-cart-checkout") ||
    document.querySelector(".checkout-btn");
 
// =========================================================================
// СОХРАНЕНИЕ
// =========================================================================
 
function saveCart() {
    localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cart)
    );
}
 
// =========================================================================
// МОБИЛЬНАЯ КОРЗИНА — "ПОРТАЛ" В <body>
// Чтобы position:fixed у .cart-window не ломался из-за transform/filter
// у родителей (шапка, .cart-wrapper, анимации reveal и т.д.)
// =========================================================================
 
const MOBILE_BREAKPOINT = 700;
 
const cartWindowOriginalParent = cartWindow ? cartWindow.parentElement : null;
const cartWindowOriginalNextSibling = cartWindow ? cartWindow.nextSibling : null;
 
function isMobileViewport() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
}
 
function placeCartWindow() {
    if (!cartWindow) return;
 
    if (isMobileViewport()) {
        // На мобильном переносим корзину прямо в body,
        // чтобы fixed-позиционирование считалось от экрана, а не от шапки
        if (cartWindow.parentElement !== document.body) {
            document.body.appendChild(cartWindow);
        }
    } else {
        // На десктопе возвращаем корзину туда, где она была
        // (нужно для position:absolute относительно .cart-wrapper)
        if (cartWindowOriginalParent && cartWindow.parentElement !== cartWindowOriginalParent) {
            cartWindowOriginalParent.insertBefore(cartWindow, cartWindowOriginalNextSibling);
        }
    }
}
 
window.addEventListener("resize", placeCartWindow);
placeCartWindow();
 
// =========================================================================
// ФОРМАТ ЦЕНЫ
// =========================================================================
 
function money(value) {
    return Number(value || 0).toFixed(2);
}
 
// =========================================================================
// ПОЛУЧЕНИЕ ДАННЫХ ТОВАРА
// =========================================================================
 
function getCartProductData(button) {
    const card = button.closest(".product-card");
 
    if (!card) {
        return null;
    }
 
    const id = card.dataset.productId || "";
 
    const product =
        typeof products !== "undefined"
            ? products.find(item => item.id === id)
            : null;
 
    const name =
        card.querySelector(".lang-p-title")?.textContent.trim() ||
        card.querySelector("h3")?.textContent.trim() ||
        product?.name ||
        id;
 
    const priceText =
        card.querySelector(".product-price")?.textContent || "";
 
    const parsedPrice = parseFloat(
        priceText.replace(",", ".").replace(/[^\d.]/g, "")
    );
 
    const price = Number.isFinite(parsedPrice)
        ? parsedPrice
        : Number(product?.price || 0);
 
    const image =
        card.querySelector(".product-image")?.getAttribute("src") || "";
 
    const colorSelect = card.querySelector(".color-select");
    const fitSelect = card.querySelector(".fit-select");
    const selects = card.querySelectorAll(".options select");
 
    let size = "S";
 
    selects.forEach(select => {
        if (select !== colorSelect && select !== fitSelect) {
            size = select.value || "S";
        }
    });
 
    return {
        id,
        name,
        price,
        image,
        color: colorSelect?.value || "black",
        size,
        fit: fitSelect?.value || "regular",
        quantity: 1
    };
}
 
// =========================================================================
// УНИКАЛЬНОСТЬ ТОВАРА
// =========================================================================
 
function cartItemKey(item) {
    return [item.id, item.color, item.size, item.fit].join("|");
}
 
// =========================================================================
// ОБЩЕЕ КОЛИЧЕСТВО И СУММЫ
// =========================================================================
 
function cartUnits() {
    return cart.reduce(
        (total, item) => total + Math.max(1, Number(item.quantity) || 1),
        0
    );
}
 
function cartSubtotal() {
    return cart.reduce(
        (total, item) =>
            total + Number(item.price || 0) * Math.max(1, Number(item.quantity) || 1),
        0
    );
}
 
function cartShipping() {
    return cart.length > 0 ? CART_SHIPPING : 0;
}
 
function cartTotal() {
    return cartSubtotal() + cartShipping();
}
 
// =========================================================================
// ДОБАВЛЕНИЕ В КОРЗИНУ
// =========================================================================
 
function addToCart(item) {
    if (!item || !item.id) return;
 
    const existing = cart.find(
        product => cartItemKey(product) === cartItemKey(item)
    );
 
    if (existing) {
        existing.quantity = Math.min(
            99,
            (Number(existing.quantity) || 1) + 1
        );
    } else {
        cart.push({ ...item, quantity: 1 });
    }
 
    saveCart();
    updateCart();
    bumpCartIcon();
 
    if (typeof showMessage === "function") {
        showMessage(dictionary[activeLang].msgAdded);
    }
}
 
// =========================================================================
// АНИМАЦИЯ ИКОНКИ КОРЗИНЫ
// =========================================================================
 
function bumpCartIcon() {
    if (!cartTrigger) return;
 
    cartTrigger.classList.remove("bump");
    void cartTrigger.offsetWidth; // форсируем рефлоу, чтобы анимация перезапустилась
    cartTrigger.classList.add("bump");
 
    setTimeout(() => cartTrigger.classList.remove("bump"), 400);
}
 
// =========================================================================
// КНОПКИ "ДОБАВИТЬ В КОРЗИНУ"
// =========================================================================
 
cartButtons.forEach(button => {
    button.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
 
        const item = getCartProductData(button);
        if (item) {
            addToCart(item);
        }
    });
});
 
// =========================================================================
// ИЗМЕНЕНИЕ КОЛИЧЕСТВА И УДАЛЕНИЕ
// =========================================================================
 
function changeCartQuantity(index, delta) {
    const item = cart[index];
    if (!item) return;
 
    const current = Math.max(1, Number(item.quantity) || 1);
    const next = current + delta;
 
    if (next <= 0) {
        cart.splice(index, 1);
    } else {
        item.quantity = Math.min(99, next);
    }
 
    saveCart();
    updateCart();
}
 
function removeCartItem(index) {
    if (index < 0 || index >= cart.length) return;
 
    cart.splice(index, 1);
    saveCart();
    updateCart();
 
    if (typeof showMessage === "function") {
        showMessage(dictionary[activeLang].msgRemoved);
    }
}
 
function clearCart() {
    if (cart.length === 0) {
        if (typeof showMessage === "function") {
            showMessage(dictionary[activeLang].msgEmpty);
        }
        return;
    }
 
    cart = [];
    saveCart();
    updateCart();
    closeCart();
 
    if (typeof showMessage === "function") {
       showMessage(dictionary[activeLang].msgCleared);
    }
}
 
// =========================================================================
// ОБНОВЛЕНИЕ КОРЗИНЫ
// =========================================================================
 
function updateCart() {
    if (!cartCounter || !cartItems) return;
 
    const d = dictionary[activeLang] || dictionary.ru;
 
    // Обновляем счётчик товаров
    cartCounter.textContent = cartUnits();
    cartCounter.classList.remove("pop");
    void cartCounter.offsetWidth;
    cartCounter.classList.add("pop");
 
    const subtotalElement = document.querySelector(".cart-subtotal");
    const shippingElement = document.querySelector(".cart-shipping");
    const totalElement = document.querySelector(".cart-total");
 
    // =========================================================================
    // ПУСТАЯ КОРЗИНА
    // =========================================================================
 
    if (!cart.length) {
        cartItems.innerHTML = `
            <p id="lang-cart-empty">${escapeHTML(d.cartEmpty)}</p>
        `;
 
        if (subtotalElement) {
            subtotalElement.textContent = "0.00 €";
        }
 
        if (shippingElement) {
            shippingElement.textContent = "0.00 €";
        }
 
        if (totalElement) {
            totalElement.textContent = "0.00 €";
        }
 
        return;
    }
 
    // =========================================================================
    // ТОВАРЫ В КОРЗИНЕ
    // =========================================================================
 
    cartItems.innerHTML = cart
        .map((item, index) => {
 
            const quantity = Math.max(
                1,
                Number(item.quantity) || 1
            );
 
            const lineTotal =
                Number(item.price || 0) * quantity;
 
            // =========================================================================
            // ПЕРЕВОД ЦВЕТА
            // =========================================================================
 
            const colorMap = {
                white: d.clrWhite,
                black: d.clrBlack
            };
 
            const color =
                colorMap[item.color] ||
                item.color ||
                "";
 
            // =========================================================================
            // ПЕРЕВОД ПОСАДКИ
            // =========================================================================
 
            const fitMap = {
                slim: d.fitSlim,
                regular: d.fitRegular,
                relaxed: d.fitRelaxed,
                loose: d.fitLoose,
                oversize: d.fitOversize
            };
 
            const fit =
                fitMap[item.fit] ||
                item.fit ||
                d.fitRegular;
 
            // =========================================================================
            // НАЗВАНИЕ ТОВАРА
            // =========================================================================
 
            const translatedName =
                productNames[item.id]?.[activeLang] ||
                item.name ||
                "";
 
            // =========================================================================
            // HTML ТОВАРА
            // =========================================================================
 
            return `
                <div class="cart-product" data-index="${index}">
 
                    <img
                        src="${escapeHTML(item.image || "")}"
                        class="cart-img"
                        alt="${escapeHTML(translatedName)}"
                    >
 
                    <div class="cart-info">
 
                        <span class="cart-product-name">
                            ${escapeHTML(translatedName)}
                        </span>
 
                        <small>
                            ${escapeHTML(d.cartSize || "Size: ")}
                            ${escapeHTML(item.size || "S")}
                        </small>
 
                        <small>
                            ${escapeHTML(d.lblFit || "Fit: ")}
                            ${escapeHTML(fit)}
                        </small>
 
                        <small>
                            ${escapeHTML(d.lblColor || "Color: ")}
                            ${escapeHTML(color)}
                        </small>
 
                        <div class="cart-product-bottom">
 
                            <div class="cart-quantity">
 
                                <button
                                    type="button"
                                    class="qty-btn qty-minus"
                                    data-index="${index}"
                                >
                                    −
                                </button>
 
                                <span class="qty-value">
                                    ${quantity}
                                </span>
 
                                <button
                                    type="button"
                                    class="qty-btn qty-plus"
                                    data-index="${index}"
                                >
                                    +
                                </button>
 
                            </div>
 
                            <b>
                                ${money(lineTotal)} €
                            </b>
 
                        </div>
 
                    </div>
 
                    <button
                        type="button"
                        class="remove-item"
                        data-index="${index}"
                        aria-label="${escapeHTML(d.cartRemove || "Remove item")}"
                    >
                        ✕
                    </button>
 
                </div>
            `;
        })
        .join("");
 
    // =========================================================================
    // ИТОГИ
    // =========================================================================
 
    if (subtotalElement) {
        subtotalElement.textContent =
            `${money(cartSubtotal())} €`;
    }
 
    if (shippingElement) {
        shippingElement.textContent =
            `${money(cartShipping())} €`;
    }
 
    if (totalElement) {
        totalElement.textContent =
            `${money(cartTotal())} €`;
    }
 
    // =========================================================================
    // КНОПКА -
    // =========================================================================
 
    cartItems
        .querySelectorAll(".qty-minus")
        .forEach(button => {
 
            button.addEventListener("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
 
                changeCartQuantity(
                    Number(button.dataset.index),
                    -1
                );
            });
 
        });
 
    // =========================================================================
    // КНОПКА +
    // =========================================================================
 
    cartItems
        .querySelectorAll(".qty-plus")
        .forEach(button => {
 
            button.addEventListener("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
 
                changeCartQuantity(
                    Number(button.dataset.index),
                    1
                );
            });
 
        });
 
    // =========================================================================
    // УДАЛЕНИЕ ТОВАРА
    // =========================================================================
 
    cartItems
        .querySelectorAll(".remove-item")
        .forEach(button => {
 
            button.addEventListener("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
 
                removeCartItem(
                    Number(button.dataset.index)
                );
            });
 
        });
}
 
// =========================================================================
// УПРАВЛЕНИЕ ОКНОМ КОРЗИНЫ И СКРОЛЛОМ
// =========================================================================
 
function openCart() {
    if (!cartWindow) return;
 
    placeCartWindow();
    updateCart();
    cartWindow.classList.add("active");
    document.body.classList.add("cart-open");
 
    if (cartTrigger) {
        cartTrigger.setAttribute("aria-expanded", "true");
    }
}
 
function closeCart() {
    if (!cartWindow) return;
 
    cartWindow.classList.remove("active");
    document.body.classList.remove("cart-open");
 
    if (cartTrigger) {
        cartTrigger.setAttribute("aria-expanded", "false");
    }
}
 
// =========================================================================
// СОБЫТИЯ ЗАКРЫТИЯ И ОПЛАТЫ
// =========================================================================
 
if (cartTrigger) {
    cartTrigger.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        if (cartWindow?.classList.contains("active")) {
            closeCart();
        } else {
            openCart();
        }
    });
}
 
if (closeCartButton) {
    closeCartButton.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        closeCart();
    });
}
 
document.addEventListener("click", function (event) {
    if (!cartWindow || !cartWindow.classList.contains("active")) return;
    
    const wrapper = document.querySelector(".cart-wrapper");
    const isClickInsideWrapper = wrapper && wrapper.contains(event.target);
    const isClickOnTrigger = cartTrigger && cartTrigger.contains(event.target);
 
    if (!isClickInsideWrapper && !isClickOnTrigger) {
        closeCart();
    }
});
 
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && cartWindow?.classList.contains("active")) {
        closeCart();
    }
});
 
if (clearCartButton) {
    clearCartButton.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        clearCart();
    });
}
 
if (checkoutButton) {
    checkoutButton.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
 
        if (!Array.isArray(cart) || cart.length === 0) {
            if (typeof showMessage === "function") {
               showMessage(dictionary[activeLang].msgEmpty);
            }
            return;
        }
 
        closeCart();
 
        if (typeof buyNowCart === "function") {
            buyNowCart();
        } else {
            console.error("buyNow() не найдена. Проверь подключение PayPal JS.");
            if (typeof showMessage === "function") {
                showMessage(dictionary[activeLang].msgPaymentError);
            }
        }
    });
}
 
// ИНИЦИАЛИЗАЦИЯ
window.addEventListener("load", function () {
    updateCart();
});
 
 
// =========================================================================
// УВЕДОМЛЕНИЯ
// =========================================================================
 
function showMessage(text) {
 
    let message =
        document.querySelector(
            ".cart-message"
        );
 
    if (!message) {
 
        message =
            document.createElement(
                "div"
            );
 
        message.className =
            "cart-message";
 
        document.body.appendChild(
            message
        );
 
    }
 
    message.textContent =
        text;
 
    message.classList.add(
        "show"
    );
 
    setTimeout(
        () => {
 
            message.classList.remove(
                "show"
            );
 
        },
        1500
    );
 
}
 
// =========================================================================
// ПРОСТАЯ КАРУСЕЛЬ ФОТО ТОВАРА (разные ракурсы одного цвета)
// -------------------------------------------------------------------------
// Источник фото для карусели — атрибуты data-images-black / data-images-white
// на <img class="product-image">, список путей через запятую.
// Если список не задан, карусель падает обратно на одиночное фото из
// data-black / data-white (как раньше) — так старые карточки не ломаются.
// =========================================================================
 
function capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
}
 
function getCardCurrentColor(card) {
    const colorSelect = card ? card.querySelector('.color-select') : null;
    return colorSelect ? colorSelect.value : 'black';
}
 
function getImageListForColor(image, color) {
    const listAttr = image.dataset['images' + capitalize(color)];
 
    if (listAttr && listAttr.trim()) {
        return listAttr.split(',').map(s => s.trim()).filter(Boolean);
    }
 
    const single = image.dataset[color];
    return single ? [single] : [];
}
 
function initCardCarousel(wrap) {
    const image = wrap.querySelector('.product-image');
    const prevBtn = wrap.querySelector('.carousel-prev');
    const nextBtn = wrap.querySelector('.carousel-next');
    const dotsBox = wrap.querySelector('.carousel-dots');
    const card = wrap.closest('.product-card');
 
    if (!image) return;
 
    let index = 0;
 
        // =========================================================
    // СВАЙП ПАЛЬЦЕМ НА ТЕЛЕФОНЕ
    // =========================================================
 
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
 
    const SWIPE_THRESHOLD = 45;
 
    image.addEventListener('touchstart', (e) => {
        if (!e.touches || !e.touches.length) return;
 
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
 
 
    image.addEventListener('touchend', (e) => {
        if (!e.changedTouches || !e.changedTouches.length) return;
 
        touchEndX = e.changedTouches[0].clientX;
        touchEndY = e.changedTouches[0].clientY;
 
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
 
        // Если движение в основном вертикальное —
        // не переключаем картинку, чтобы не мешать прокрутке страницы
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
            return;
        }
 
        // Слишком короткое движение — считаем обычным касанием
        if (Math.abs(deltaX) < SWIPE_THRESHOLD) {
            return;
        }
 
        // Свайп влево → следующая картинка
        if (deltaX < 0) {
            index += 1;
            render();
        }
 
        // Свайп вправо → предыдущая картинка
        if (deltaX > 0) {
            index -= 1;
            render();
        }
    }, { passive: true });
 
    function render() {
        const color = getCardCurrentColor(card);
        let images = getImageListForColor(image, color);
 
        if (images.length === 0) {
            images = [image.getAttribute('src')];
        }
 
        if (index >= images.length) index = 0;
        if (index < 0) index = images.length - 1;
 
        image.src = images[index];
 
        const showControls = images.length > 1;
 
        if (prevBtn) prevBtn.style.display = showControls ? '' : 'none';
        if (nextBtn) nextBtn.style.display = showControls ? '' : 'none';
 
        if (dotsBox) {
            dotsBox.innerHTML = '';
 
            if (showControls) {
                images.forEach((_, i) => {
                    const dot = document.createElement('span');
                    dot.className = 'carousel-dot' + (i === index ? ' active' : '');
                    dot.addEventListener('click', (e) => {
                        e.stopPropagation();
                        index = i;
                        render();
                    });
                    dotsBox.appendChild(dot);
                });
            }
        }
    }
 
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            index -= 1;
            render();
        });
    }
 
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            index += 1;
            render();
        });
    }
 
    // сохраняем ссылку на "сброс" карусели, чтобы вызвать её
    // при смене цвета товара (см. обработчик color-select ниже)
    wrap.__resetCarousel = () => {
        index = 0;
        render();
    };
 
    render();
}
 
document.querySelectorAll('.product-image-wrap').forEach(initCardCarousel);
 
// =========================================================================
// СМЕНА ЦВЕТА ТОВАРА
// =========================================================================
 
const colorSelects =
    document.querySelectorAll(
        ".color-select"
    );
 
colorSelects.forEach(select => {
 
    select.addEventListener(
        "change",
        () => {
 
            const card =
                select.closest(
                    ".product-card"
                );
 
            const image =
                card.querySelector(
                    ".product-image"
                );
 
            const wrap =
                card.querySelector(
                    ".product-image-wrap"
                );
 
            const color =
                select.value;
 
            const hasImages =
                (image.dataset[color] && image.dataset[color].trim()) ||
                (image.dataset['images' + capitalize(color)] && image.dataset['images' + capitalize(color)].trim());
 
            if (hasImages) {
 
                if (wrap && wrap.__resetCarousel) {
 
                    wrap.__resetCarousel();
 
                } else {
 
                    image.src =
                        image.dataset[color];
 
                }
 
            } else {
 
                showMessage(
                    dictionary[activeLang]
                        .msgColorUnavailable
                );
 
            }
 
        }
    );
 
});
 
// =========================================================================
// ЖИВОЙ ПОИСК
// =========================================================================
 
const searchInput =
    document.getElementById(
        "search-input"
    );
 
const searchResults =
    document.getElementById(
        "search-results"
    );
 
function closeSearchResults() {
 
    if (searchResults) {
 
        searchResults.classList.remove(
            "active"
        );
 
        searchResults.innerHTML =
            "";
 
    }
 
}
 
if (searchInput) {
 
    searchInput.addEventListener(
        "input",
        function() {
 
            const query =
                searchInput.value
                    .toLowerCase()
                    .trim();
 
            const cards =
                document.querySelectorAll(
                    ".product-card"
                );
 
            const matches = [];
 
            cards.forEach(card => {
 
                const title =
                    card
                        .querySelector("h3")
                        .textContent
                        .toLowerCase();
 
                const isMatch =
                    title.includes(query);
 
                card.style.display =
                    isMatch
                        ? ""
                        : "none";
 
                if (
                    query &&
                    isMatch
                ) {
 
                    matches.push(card);
 
                }
 
            });
 
            if (!searchResults)
                return;
 
            if (!query) {
 
                closeSearchResults();
 
                return;
 
            }
 
            if (matches.length === 0) {
 
                searchResults.innerHTML =
                    `<div class="search-no-results">
                        ${escapeHTML(dictionary[activeLang].msgNoResults)}
                    </div>`;
 
                searchResults.classList.add(
                    "active"
                );
 
                return;
 
            }
 
            searchResults.innerHTML =
                "";
 
            matches.forEach(card => {
 
                const name =
                    card
                        .querySelector("h3")
                        .textContent;
 
                const image =
                    card
                        .querySelector(
                            ".product-image"
                        )
                        .src;
 
                const item =
                    document.createElement(
                        "button"
                    );
 
                item.type =
                    "button";
 
                item.className =
                    "search-result-item";
 
                item.innerHTML =
                    `<img src="${escapeHTML(image)}" alt="">
                     <span>
                        ${escapeHTML(name)}
                     </span>`;
 
                item.addEventListener(
                    "click",
                    () => {
 
                        document
                            .querySelectorAll(
                                ".product-card"
                            )
                            .forEach(
                                c =>
                                    c.style.display =
                                        ""
                            );
 
                        searchInput.value =
                            "";
 
                        closeSearchResults();
 
                        card.scrollIntoView({
                            behavior: "smooth",
                            block: "center"
                        });
 
                        card.classList.remove(
                            "search-highlight"
                        );
 
                        void card.offsetWidth;
 
                        card.classList.add(
                            "search-highlight"
                        );
 
                        setTimeout(
                            () =>
                                card.classList.remove(
                                    "search-highlight"
                                ),
                            1600
                        );
 
                    }
                );
 
                searchResults.appendChild(
                    item
                );
 
            });
 
            searchResults.classList.add(
                "active"
            );
 
        }
    );
 
    document.addEventListener(
        "click",
        (e) => {
 
            if (
                !e.target.closest(
                    ".search-wrap"
                )
            ) {
 
                closeSearchResults();
 
            }
 
        }
    );
 
}
 
// =========================================================================
// СЛОВАРЬ НАЗВАНИЙ
//
// TODO: переименовать new-product-1 / new-product-2 (ключи объекта)
// в реальные id товаров и вписать настоящие названия на трёх языках.
// =========================================================================
 
const productNames = {
 
    'connection': {
        ru: "Connection",
        en: "Connection",
        et: "Connection"
    },
 
    'time-to-live': {
        ru: "Time to live",
        en: "Time to live",
        et: "Time to live"
    },
 
        'no-kings': {
        ru: "No Kings",
        en: "No Kings",
        et: "No Kings"
    },
 
    'signal-lost': {
        ru: "Signal Lost",
        en: "Signal Lost",
        et: "Signal Lost"
    },
 
    never: {
        ru: "Never Give Up",
        en: "Never Give Up",
        et: "Ära anna kunagi alla"
    },
 
    chaos: {
        ru: "Chaos",
        en: "Chaos",
        et: "Kaos"
    },
 
    summer: {
        ru: "Summer Vibes",
        en: "Summer Vibes",
        et: "Suve meeleolu"
    },
 
    drive: {
        ru: "Tokyo Drive",
        en: "Tokyo Drive",
        et: "Tokyo Sõit"
    },
 
    samurai: {
        ru: "Shadow Ronin",
        en: "Shadow Ronin",
        et: "Varju Ronin"
    }
 
};
 
// =========================================================================
// ПОЛНЫЙ СЛОВАРЬ МУЛЬТИЯЗЫЧНОСТИ
// =========================================================================
 
const dictionary = {
 
    ru: {
 
        navCatalog: "Каталог",
        navCollections: "О нас",
        navContacts: "Контакты",
        searchPlh: "Поиск...",
 
        cartTitle: "Корзина",
        cartEmpty: "Корзина пустая",
        cartCheckout: "Перейти к оплате",
        cartClear: "Очистить",
 
        cartSubtotalLabel: "Товары",
        cartShippingLabel: "Доставка",
        cartTotalLabel: "Итого",
 
        cartTotal: "Итого: ",
        cartSize: "Размер: ",
 
        collections:
        "Коллекция",
 
        heroEyebrow:
            "Ателье принта — основано в Эстонии",
 
        heroSubtitle:
            "Чернила, которые говорят<br>за тебя.",
 
        heroBtn:
            "Перейти в каталог",
 
        catalogTitle:
            "Каталог",
 
        catalogEyebrow:
            "Коллекция",
 
        lblColor:
            "Цвет",
 
        lblSize:
            "Размер",
 
        lblFit:
            "Посадка",
 
        clrBlack:
            "Черный",
 
        clrWhite:
            "Белый",
 
        btnAdd:
            "Добавить в корзину",
 
        btnBuy:
            "Купить сейчас",
 
        fitSlim:
            "Slim fit",
 
        fitRegular:
            "Regular",
 
        fitRelaxed:
            "Relaxed",
 
        fitLoose:
            "Loose",
 
        fitOversize:
            "Oversize",
 
        ftAbout:
            "Мы используем футболки H&M из 100% хлопка, и качетвенной плотной ткани, обеспечивающей комфорт и долговечность. Печать наносится с помощью высококачественной технологии DTF (Direct to Film), которая позволяет получить яркое и детализированное изображение с высокой стойкостью. ",
 
        ftContacts:
            "Контакты и Социальные сети",
 
        ftSocials:
            "Социальные сети",
 
        scrollCue:
            "Листайте",
 
        msgAdded:
            "Товар добавлен в корзину ✓",
 
        msgRemoved:
            "Товар удалён",
 
        msgCleared:
            "Корзина очищена",
 
        msgEmpty:
            "Корзина пустая",
 
        msgCheckout:
            "Переходим к оплате 💳",
 
        msgColorUnavailable:
            "❌ Этот цвет недоступен",
 
        msgNoResults:
            "Ничего не найдено",
 
        mapSearchPlh:
            "Введите город или улицу",
 
        mapSearchBtn:
            "Найти",
 
        mapHint:
            "Отметьте на карте примерный район или адрес — так проще выбрать ближайший автомат. Точный список автоматов — по кнопке выше.",
 
        mapLinkOmniva:
            "Автоматы Omniva на карте",
 
        mapLinkDpd:
            "Автоматы DPD на карте",
 
        mapLinkSmartpost:
            "Автоматы Smartpost на карте",
 
        addressPlh:
            "Таллинн, Kaubamaja Omniva...",
 
        deliverySaved:
            "✓ Данные доставки сохранены. Оплатите заказ:",
 
        savingBtn:
            "Сохранение...",
 
        paymentSuccess:
            "Успешно оплачено! ✔",
 
        paypalErrorMsg:
            "Ошибка PayPal ❌",
 
        saveErrorMsg:
            "Ошибка сохранения данных."
 
    },
 
    en: {
 
        collections:
        "Collection",
 
        navCatalog:
            "Catalog",
 
        navCollections:
            "About us",
 
        navContacts:
            "Contacts",
 
        searchPlh:
            "Search...",
 
        cartTitle:
            "Cart",
 
        cartEmpty:
            "Cart is empty",
 
        cartCheckout:
            "Checkout",
 
        cartClear:
            "Clear",
 
        cartSubtotal:
            "Subtotal: ",
 
        cartShipping:
            "Shipping: ",
 
        cartSubtotalLabel:
            "Products",
 
        cartShippingLabel:
            "Shipping",
 
        cartTotalLabel:
            "Total",
 
        cartTotal:
            "Total: ",
 
        cartSize:
            "Size: ",
 
        heroEyebrow:
            "Print atelier — founded in Estonia",
 
        heroSubtitle:
            "Inks that speak<br>for you.",
 
        heroBtn:
            "Go to catalog",
 
        catalogTitle:
            "Catalog",
 
        catalogEyebrow:
            "Collection",
 
        lblColor:
            "Color",
 
        lblSize:
            "Size",
 
        lblFit:
            "Fit",
 
        clrBlack:
            "Black",
 
        clrWhite:
            "White",
 
        btnAdd:
            "Add to cart",
 
        btnBuy:
            "Buy now",
 
        fitSlim:
            "Slim fit",
 
        fitRegular:
            "Regular",
 
        fitRelaxed:
            "Relaxed",
 
        fitLoose:
            "Loose",
 
        fitOversize:
            "Oversize",
 
        ftAbout:
            "We use H&M 100% cotton T-shirts made of high-quality, dense fabric that ensures comfort and durability. The print is applied using high-quality DTF (Direct to Film) technology, which delivers a bright, detailed image with exceptional resistance to wear.",
 
        ftContacts:
            "Contacts and Social Networks",
 
        ftSocials:
            "Social Networks",
 
        scrollCue:
            "Scroll",
 
        msgAdded:
            "Item added to cart ✓",
 
        msgRemoved:
            "Item removed",
 
        msgCleared:
            "Cart cleared",
 
        msgEmpty:
            "Cart is empty",
 
        msgCheckout:
            "Proceeding to checkout 💳",
 
        msgColorUnavailable:
            "❌ This color is unavailable",
 
        msgNoResults:
            "No results found",
 
        mapSearchPlh:
            "Enter a city or street",
 
        mapSearchBtn:
            "Search",
 
        mapHint:
            "Mark your general area or address on the map to help pick the nearest locker. For the exact list of lockers, use the button above.",
 
        mapLinkOmniva:
            "Omniva lockers on the map",
 
        mapLinkDpd:
            "DPD lockers on the map",
 
        mapLinkSmartpost:
            "Smartpost lockers on the map",
 
        addressPlh:
            "Tallinn, Kaubamaja Omniva...",
 
        deliverySaved:
            "✓ Delivery details saved. Please complete payment:",
 
        savingBtn:
            "Saving...",
 
        paymentSuccess:
            "Payment successful! ✔",
 
        paypalErrorMsg:
            "PayPal Error ❌",
 
        saveErrorMsg:
            "Error saving data."
 
    },
 
    et: {
 
        collections:
        "Kollektsioon",
 
        navCatalog:
            "Kataloog",
 
        navCollections:
            "Meie kohta",
 
        navContacts:
            "Kontaktid",
 
        searchPlh:
            "Otsi...",
 
        cartTitle:
            "Ostukorv",
 
        cartEmpty:
            "Ostukorv on tühi",
 
        cartCheckout:
            "Vormista ost",
 
        cartClear:
            "Tühjenda",
 
        cartSubtotalLabel:
            "Tooted",
 
        cartShippingLabel:
            "Tarne",
 
        cartTotalLabel:
            "Kokku",
 
        cartTotal:
            "Kokku: ",
 
        cartSize:
            "Suurus: ",
 
        heroEyebrow:
            "Trükiateljee — asutatud Eestis",
 
        heroSubtitle:
            "Tindid, mis räägivad<br>Sinu eest.",
 
        heroBtn:
            "Mine kataloogi",
 
        catalogTitle:
            "Kataloog",
 
        catalogEyebrow:
            "Kollektsioon",
 
        lblColor:
            "Värv",
 
        lblSize:
            "Suurus",
 
        lblFit:
            "Lõige",
 
        clrBlack:
            "Must",
 
        clrWhite:
            "Valge",
 
        btnAdd:
            "Lisa ostukorvi",
 
        btnBuy:
            "Osta kohe",
 
        fitSlim:
            "Slim fit",
 
        fitRegular:
            "Regular",
 
        fitRelaxed:
            "Relaxed",
 
        fitLoose:
            "Loose",
 
        fitOversize:
            "Oversize",
 
        ftAbout:
            "Kasutame 100% puuvillaseid H&M T-särke, mis on valmistatud kvaliteetsest ja tihedast kangast, tagades mugavuse ning vastupidavuse. Trükk kantakse peale tipptasemel DTF-tehnoloogiaga (Direct to Film), mis võimaldab saavutada erksa, detailse ja väga kulumiskindla pildi.",
 
        ftContacts:
            "Kontaktid ja sotsiaalmeedia",
 
        ftSocials:
            "Sotsiaalmeedia",
 
        scrollCue:
            "Keri edasi",
 
        msgAdded:
            "Toode lisatud ostukorvi ✓",
 
        msgRemoved:
            "Toode eemaldatud",
 
        msgCleared:
            "Ostukorv tühjendatud",
 
        msgEmpty:
            "Ostukorv on tühi",
 
        msgCheckout:
            "Suundume maksmisele 💳",
 
        msgColorUnavailable:
            "❌ See värv pole saadaval",
 
        msgNoResults:
            "Tulemusi ei leitud",
 
        mapSearchPlh:
            "Sisesta linn või tänav",
 
        mapSearchBtn:
            "Otsi",
 
        mapHint:
            "Märgi kaardile oma piirkond või aadress — nii on lihtsam valida lähim automaat. Täpne automaatide nimekiri on ülal oleva nupu taga.",
 
        mapLinkOmniva:
            "Omniva automaadid kaardil",
 
        mapLinkDpd:
            "DPD automaadid kaardil",
 
        mapLinkSmartpost:
            "Smartposti automaadid kaardil",
 
        addressPlh:
            "Tallinn, Kaubamaja Omniva...",
 
        deliverySaved:
            "✓ Tarneandmed salvestatud. Palun tasu:",
 
        savingBtn:
            "Salvestamine...",
 
        paymentSuccess:
            "Makse õnnestus! ✔",
 
        paypalErrorMsg:
            "PayPali viga ❌",
 
        saveErrorMsg:
            "Andmete salvestamise viga."
 
    }
 
};
 
// =========================================================================
// АВТОМАТИЧЕСКИЙ ЯЗЫК ПО ЯЗЫКУ БРАУЗЕРА
// =========================================================================
 
const browserLanguage =
    (navigator.language || "ru")
        .toLowerCase()
        .split("-")[0];
 
let activeLang =
    ["ru", "en", "et"].includes(browserLanguage)
        ? browserLanguage
        : "ru";
 
// =========================================================================
// ПЕРЕВОД КОРЗИНЫ
// =========================================================================
 
function applyCartTranslation() {
 
      const d = dictionary[activeLang] || dictionary['ru'];
 
    // =========================================================================
    // ЗАГОЛОВОК КОРЗИНЫ
    // =========================================================================
 
    const cartTitleEl =
        document.getElementById("lang-cart-title");
 
    if (cartTitleEl) {
        cartTitleEl.textContent =
            d.cartTitle;
    }
 
    // =========================================================================
    // ПОДПИСИ ИТОГОВ КОРЗИНЫ
    // =========================================================================
 
const cartSubtotalLabel =
    document.getElementById("lang-cart-subtotal-label");
 
const cartShippingLabel =
    document.getElementById("lang-cart-shipping-label");
 
const cartTotalLabel =
    document.getElementById("lang-cart-total-label");
 
if (cartSubtotalLabel) {
    cartSubtotalLabel.textContent =
        d.cartSubtotalLabel || "Товары";
}
 
if (cartShippingLabel) {
    cartShippingLabel.textContent =
        d.cartShippingLabel || "Доставка";
}
 
if (cartTotalLabel) {
    cartTotalLabel.textContent =
        d.cartTotalLabel || "Итого";
}
 
    // =========================================================================
    // ПУСТАЯ КОРЗИНА
    // =========================================================================
 
    const cartEmptyEl =
        document.getElementById("lang-cart-empty");
 
    if (cartEmptyEl) {
        cartEmptyEl.textContent =
            d.cartEmpty;
    }
 
    // =========================================================================
    // ОБЩАЯ СУММА
    // =========================================================================
 
    const totalEl =
        document.querySelector(".cart-total");
 
    if (totalEl) {
 
        totalEl.textContent =
            `${d.cartTotal}${money(cartTotal())} €`;
    }
 
    // =========================================================================
    // ТОВАРЫ В КОРЗИНЕ
    // =========================================================================
 
    document
        .querySelectorAll(".cart-product")
        .forEach(cartProd => {
 
            const index =
                Number(cartProd.dataset.index);
 
            const item =
                cart[index];
 
            if (!item) return;
 
            // -------------------------------------------------------------
            // НАЗВАНИЕ
            // -------------------------------------------------------------
 
            const nameSpan =
                cartProd.querySelector(
                    ".cart-product-name"
                );
 
            if (nameSpan) {
 
                const translatedName =
                    productNames[item.id]?.[activeLang];
 
                if (translatedName) {
                    nameSpan.textContent =
                        translatedName;
                }
            }
 
            // -------------------------------------------------------------
            // ДАННЫЕ ТОВАРА
            // -------------------------------------------------------------
 
            const smallElements =
                cartProd.querySelectorAll(
                    ".cart-info small"
                );
 
            if (smallElements.length >= 3) {
 
                // Размер
                smallElements[0].textContent =
                    `${d.cartSize}${item.size || "S"}`;
 
                // Посадка
                const fitMap = {
                    slim: d.fitSlim,
                    regular: d.fitRegular,
                    relaxed: d.fitRelaxed,
                    loose: d.fitLoose,
                    oversize: d.fitOversize
                };
 
                smallElements[1].textContent =
                    `${d.lblFit}: ${
                        fitMap[item.fit] ||
                        item.fit ||
                        "Regular"
                    }`;
 
                // Цвет
                const colorText =
                    item.color === "black"
                        ? d.clrBlack
                        : d.clrWhite;
 
                smallElements[2].textContent =
                    `${d.lblColor}: ${colorText}`;
            }
 
        });
 
}
 
// =========================================================================
// СМЕНА ЯЗЫКА
// =========================================================================
 
const langSelect =
    document.getElementById(
        "language-select"
    );
 
if (langSelect) {
 
    langSelect.addEventListener(
        "change",
        (e) => {
 
            activeLang =
                e.target.value;
 
            const d =
                dictionary[activeLang];
 
            document.getElementById(
                "lang-nav-catalog"
            ).textContent =
                d.navCatalog;
 
            document.getElementById(
                "lang-nav-collections"
            ).textContent =
                d.navCollections;
 
            document.getElementById(
                "lang-nav-contacts"
            ).textContent =
                d.navContacts;
 
            document.getElementById(
                "search-input"
            ).placeholder =
                d.searchPlh;
 
            const heroEyebrowEl =
                document.getElementById(
                    "lang-hero-eyebrow"
                );
 
            if (heroEyebrowEl) {
 
                heroEyebrowEl.textContent =
                    d.heroEyebrow;
 
            }
 
            document.getElementById(
                "lang-hero-subtitle"
            ).innerHTML =
                d.heroSubtitle;
 
            document.getElementById(
                "lang-hero-btn"
            ).textContent =
                d.heroBtn;
 
            document.getElementById(
                "lang-catalog-title"
            ).textContent =
                d.catalogTitle;
 
            const catalogEyebrowEl =
                document.getElementById(
                    "lang-catalog-eyebrow"
                );
 
            if (catalogEyebrowEl) {
 
                catalogEyebrowEl.textContent =
                    d.catalogEyebrow;
 
            }
 
            document
                .querySelectorAll(
                    ".product-card"
                )
                .forEach(card => {
 
                    const pId =
                        card.getAttribute(
                            "data-product-id"
                        );
 
                    if (
                        pId &&
                        productNames[pId]
                    ) {
 
                        card.querySelector(
                            ".lang-p-title"
                        ).textContent =
                            productNames[pId][
                                activeLang
                            ];
 
                    }
 
                });
 
            document
                .querySelectorAll(
                    ".lang-label-color"
                )
                .forEach(el => {
 
                    el.textContent =
                        d.lblColor;
 
                });
 
            document
                .querySelectorAll(
                    ".lang-label-size"
                )
                .forEach(el => {
 
                    el.textContent =
                        d.lblSize;
 
                });
 
            document
                .querySelectorAll(
                    ".lang-label-fit"
                )
                .forEach(el => {
 
                    el.textContent =
                        d.lblFit;
 
                });
 
            document
                .querySelectorAll(
                    ".lang-color-black"
                )
                .forEach(el => {
 
                    el.textContent =
                        d.clrBlack;
 
                });
 
            document
                .querySelectorAll(
                    ".lang-color-white"
                )
                .forEach(el => {
 
                    el.textContent =
                        d.clrWhite;
 
                });
 
            document
                .querySelectorAll(
                    ".lang-fit-slim"
                )
                .forEach(el => {
 
                    el.textContent =
                        d.fitSlim;
 
                });
 
            document
                .querySelectorAll(
                    ".lang-fit-regular"
                )
                .forEach(el => {
 
                    el.textContent =
                        d.fitRegular;
 
                });
 
            document
                .querySelectorAll(
                    ".lang-fit-relaxed"
                )
                .forEach(el => {
 
                    el.textContent =
                        d.fitRelaxed;
 
                });
 
            document
                .querySelectorAll(
                    ".lang-fit-loose"
                )
                .forEach(el => {
 
                    el.textContent =
                        d.fitLoose;
 
                });
 
            document
                .querySelectorAll(
                    ".lang-fit-oversize"
                )
                .forEach(el => {
 
                    el.textContent =
                        d.fitOversize;
 
                });
 
            document
                .querySelectorAll(
                    ".lang-btn-add"
                )
                .forEach(el => {
 
                    el.textContent =
                        d.btnAdd;
 
                });
 
            document
                .querySelectorAll(
                    ".lang-btn-buy"
                )
                .forEach(el => {
 
                    el.textContent =
                        d.btnBuy;
 
                });
 
            const scrollCueEl =
                document.getElementById(
                    "lang-scroll-cue"
                );
 
            if (scrollCueEl) {
 
                scrollCueEl.textContent =
                    d.scrollCue;
 
            }
 
            document.getElementById(
                "lang-cart-checkout"
            ).textContent =
                d.cartCheckout;
 
            document.getElementById(
                "lang-cart-clear"
            ).textContent =
                d.cartClear;
 
            applyCartTranslation();
 
            document.getElementById(
                "lang-footer-about"
            ).textContent =
                d.ftAbout;
 
            document.getElementById(
                "lang-footer-contacts-title"
            ).textContent =
                d.ftContacts;
 
            document.getElementById(
                "lang-footer-socials"
            ).textContent =
                d.ftSocials;
 
        }
    );
 
}
 
// =========================================================================
// УСТАНОВКА ЯЗЫКА БРАУЗЕРА ПРИ ЗАГРУЗКЕ
// =========================================================================
 
if (langSelect) {
 
    langSelect.value = activeLang;
 
    // Запускаем существующую систему перевода
    langSelect.dispatchEvent(
        new Event("change")
    );
 
}
 
// =========================================================================
// BUY NOW
// =========================================================================
 
document
    .querySelectorAll(".buy-btn")
    .forEach(button => {
 
        button.addEventListener(
            "click",
            () => {
 
                const card =
                    button.closest(
                        ".product-card"
                    );
 
                const prodId =
                    card.getAttribute(
                        "data-product-id"
                    );
 
                if (prodId) {
 
                    buyNow(prodId);
 
                }
 
            }
        );
 
    });
 
// =========================================================================
// ФИКСИРОВАННАЯ ШАПКА
// =========================================================================
 
const siteNav =
    document.getElementById(
        "siteNav"
    );
 
if (siteNav) {
 
    const toggleNav = () => {
 
        if (window.scrollY > 40) {
 
            siteNav.classList.add(
                "scrolled"
            );
 
        } else {
 
            siteNav.classList.remove(
                "scrolled"
            );
 
        }
 
    };
 
    toggleNav();
 
    window.addEventListener(
        "scroll",
        toggleNav,
        {
            passive: true
        }
    );
 
}
 
// =========================================================================
// ПОЯВЛЕНИЕ ЭЛЕМЕНТОВ ПРИ ПРОКРУТКЕ
// =========================================================================
 
const revealItems =
    document.querySelectorAll(
        ".reveal"
    );
 
if (
    "IntersectionObserver" in window &&
    revealItems.length
) {
 
    const revealObserver =
        new IntersectionObserver(
            (entries) => {
 
                entries.forEach(entry => {
 
                    if (
                        entry.isIntersecting
                    ) {
 
                        entry.target.classList.add(
                            "in-view"
                        );
 
                        revealObserver.unobserve(
                            entry.target
                        );
 
                    }
 
                });
 
            },
            {
                threshold: 0.15
            }
        );
 
    revealItems.forEach(item =>
        revealObserver.observe(item)
    );
 
} else {
 
    revealItems.forEach(item =>
        item.classList.add(
            "in-view"
        )
    );
 
}
 