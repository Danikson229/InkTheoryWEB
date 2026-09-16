// =========================================================================
// ФУНКЦИЯ БЫСТРОЙ ОПЛАТЫ
// =========================================================================

function buyNow(prodId) {

    const product =
        products.find(p => p.id === prodId);

    if (!product) return;

    const selection =
        catalogSelection[prodId];

    const currentImgPath =
        product.colors[selection.color] ||
        product.colors['black'];

    let payModal =
        document.getElementById('paypal-fast-modal');

    if (!payModal) {

        payModal =
            document.createElement('div');

        payModal.id =
            'paypal-fast-modal';

        payModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(6, 5, 8, 0.88);
            backdrop-filter: blur(4px);
            z-index: 99999;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            box-sizing: border-box;
        `;

        document.body.appendChild(payModal);
    }

    const d =
        dictionary[activeLang] ||
        dictionary['ru'];

    const colorText =
        selection.color === 'black'
            ? (d.clrBlack || 'Черный')
            : (d.clrWhite || 'Белый');

    const fitKeyMap = {
        slim: 'fitSlim',
        regular: 'fitRegular',
        relaxed: 'fitRelaxed',
        loose: 'fitLoose',
        oversize: 'fitOversize'
    };

    const fitText =
        d[fitKeyMap[selection.fit]] ||
        'Regular';

    const orderId =
        'INK-' +
        Math.floor(Math.random() * 10000);

    const txtName =
        activeLang === 'et'
            ? 'Sinu nimi'
            : (
                activeLang === 'en'
                    ? 'Full Name'
                    : 'Ваше Имя и Фамилия'
            );

    const txtEmail =
        activeLang === 'et'
            ? 'E-posti aadress (kinnituse jaoks)'
            : (
                activeLang === 'en'
                    ? 'Email (for order confirmation)'
                    : 'Email (для подтверждения заказа)'
            );

    const txtPhone =
        activeLang === 'et'
            ? 'Telefoninumber (SMS jaoks)'
            : (
                activeLang === 'en'
                    ? 'Phone (for SMS)'
                    : 'Телефон (для SMS)'
            );

    const txtMethod =
        activeLang === 'et'
            ? 'Tarneviis'
            : (
                activeLang === 'en'
                    ? 'Shipping Method'
                    : 'Способ доставки'
            );

    const txtAddress =
        activeLang === 'et'
            ? 'Pakiautomaadi või pakiautomaadi aadress'
            : (
                activeLang === 'en'
                    ? 'Parcel locker or home address'
                    : 'Адрес автомата (или домашний адрес)'
            );

    const txtBtnSave =
        activeLang === 'et'
            ? 'Kinnita andmed'
            : (
                activeLang === 'en'
                    ? 'Confirm Details'
                    : 'Подтвердить данные'
            );

    const txtTotal =
        activeLang === 'et'
            ? 'Kokku tasumisele'
            : (
                activeLang === 'en'
                    ? 'Total to pay'
                    : 'Итого к оплате'
            );

    let initialShipping =
        shippingRates["omniva"];

    let initialTotal =
        product.price + initialShipping;

    payModal.innerHTML = `
        <div style="
            background: #15131a;
            padding: 28px;
            border-radius: 16px;
            border: 1px solid rgba(201,162,75,0.28);
            width: 95%;
            max-width: 500px;
            position: relative;
            text-align: center;
            color: #f2ede2;
            max-height: 95vh;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            overflow-y: auto;
            font-family: 'Jura', sans-serif;
            box-shadow: 0 30px 80px rgba(0,0,0,0.6);
        ">

            <button
                id="closeFastModal"
                style="
                    position: absolute;
                    top: 12px;
                    right: 15px;
                    background: none;
                    border: none;
                    color: #948c7f;
                    font-size: 28px;
                    cursor: pointer;
                    line-height: 1;
                    z-index: 10;
                "
            >&times;</button>

            <div style="flex-shrink: 0;">

                <div style="
                    width: 92px;
                    height: 92px;
                    margin: 0 auto 12px auto;
                    background: #1d1922;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    border: 1px solid rgba(201,162,75,0.2);
                ">

                    <img
                        src="${currentImgPath}"
                        alt="${escapeHTML(product.name)}"
                        style="
                            max-width: 100%;
                            max-height: 100%;
                            object-fit: contain;
                        "
                    >

                </div>

                <h3 style="
                    margin: 0 0 4px 0;
                    font-size: 19px;
                    font-family: 'Fraunces', serif;
                    font-weight: 500;
                    color: #f2ede2;
                ">
                    ${escapeHTML(
                        productNames[prodId]
                            ? productNames[prodId][activeLang]
                            : product.name
                    )}
                </h3>

                <p style="
                    margin: 0 0 15px 0;
                    color: #948c7f;
                    font-size: 13px;
                ">
                    ${d.lblSize}: ${selection.size}
                    |
                    ${d.lblColor}: ${colorText}
                    |
                    ${d.lblFit}: ${fitText}
                </p>

            </div>

            <form
                id="fastOrderForm"
                action="https://formsubmit.co/lyvero.company@gmail.com"
                method="POST"
                style="
                    text-align: left;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                "
            >

                <input
                    type="hidden"
                    name="_captcha"
                    value="false"
                >

                <input
                    type="hidden"
                    name="order_id"
                    value="${orderId}"
                >

                <input
                    type="hidden"
                    name="product"
                    value="${product.name} (${selection.size}/${selection.color}/${fitText})"
                >

                <input
                    type="hidden"
                    name="total_price"
                    id="hiddenTotalInput"
                    value="${initialTotal.toFixed(2)} €"
                >

                <label style="
                    font-size: 12.5px;
                    letter-spacing: 0.04em;
                    color: #948c7f;
                ">
                    ${txtName}:
                </label>

                <input
                    type="text"
                    name="customer_name"
                    required
                    style="
                        padding: 10px;
                        background: #1d1922;
                        border: 1px solid rgba(201,162,75,0.2);
                        color: #f2ede2;
                        border-radius: 8px;
                    "
                >

                <label style="
                    font-size: 12.5px;
                    letter-spacing: 0.04em;
                    color: #948c7f;
                ">
                    ${txtEmail}:
                </label>

                <input
                    type="email"
                    name="email"
                    id="fastCustomerEmail"
                    required
                    placeholder="you@example.com"
                    style="
                        padding: 10px;
                        background: #1d1922;
                        border: 1px solid rgba(201,162,75,0.2);
                        color: #f2ede2;
                        border-radius: 8px;
                    "
                >

                <label style="
                    font-size: 12.5px;
                    letter-spacing: 0.04em;
                    color: #948c7f;
                ">
                    ${txtPhone}:
                </label>

                <input
                    type="tel"
                    name="customer_phone"
                    required
                    placeholder="+372..."
                    style="
                        padding: 10px;
                        background: #1d1922;
                        border: 1px solid rgba(201,162,75,0.2);
                        color: #f2ede2;
                        border-radius: 8px;
                    "
                >

                <label style="
                    font-size: 12.5px;
                    letter-spacing: 0.04em;
                    color: #948c7f;
                ">
                    ${txtMethod}:
                </label>

                <select
                    name="shipping_method"
                    id="fastShippingMethod"
                    required
                    style="
                        padding: 10px;
                        background: #1d1922;
                        border: 1px solid rgba(201,162,75,0.2);
                        color: #f2ede2;
                        border-radius: 8px;
                    "
                >

                    <option value="omniva">
                        Omniva Pakiautomaat (€2.99)
                    </option>

                    <option value="dpd">
                        DPD Pakiautomaat (€2.99)
                    </option>

                    <option value="europe">
                        Smartposti Pakiautomaat (€2.99)
                    </option>

                </select>

                <div class="delivery-map-block">

                    <div
                        class="delivery-map-links"
                        id="fastMapLinks"
                    ></div>

                    <div class="delivery-map-search">

                        <input
                            type="text"
                            id="fastMapSearchInput"
                            placeholder="${d.mapSearchPlh}"
                        >

                        <button
                            type="button"
                            id="fastMapSearchBtn"
                        >
                            ${d.mapSearchBtn}
                        </button>

                    </div>

                    <div
                        class="delivery-map-canvas"
                        id="fastMapCanvas"
                    ></div>

                    <p class="delivery-map-hint">
                        ${d.mapHint}
                    </p>

                </div>

                <label style="
                    font-size: 12.5px;
                    letter-spacing: 0.04em;
                    color: #948c7f;
                ">
                    ${txtAddress}:
                </label>

                <textarea
                    name="delivery_address"
                    id="fastDeliveryAddress"
                    required
                    rows="2"
                    placeholder="${d.addressPlh}"
                    style="
                        padding: 10px;
                        background: #1d1922;
                        border: 1px solid rgba(201,162,75,0.2);
                        color: #f2ede2;
                        border-radius: 8px;
                        resize: none;
                    "
                ></textarea>

                <div style="
                    margin-top: 5px;
                    padding: 12px;
                    background: #1d1922;
                    border-radius: 8px;
                    text-align: center;
                    border: 1px dashed rgba(201,162,75,0.3);
                ">

                    <span style="
                        font-size: 13px;
                        color: #948c7f;
                    ">
                        ${txtTotal}:
                    </span>

                    <strong
                        id="modalTotalDisplay"
                        style="
                            font-size: 19px;
                            color: #e6c583;
                            margin-left: 6px;
                            font-family: 'Fraunces', serif;
                        "
                    >
                        ${initialTotal.toFixed(2)} €
                    </strong>

                </div>

                <button
                    type="submit"
                    id="fastSubmitBtn"
                    style="
                        padding: 13px;
                        background: #c9a24b;
                        color: #0b0a0d;
                        border: none;
                        border-radius: 8px;
                        font-weight: 700;
                        letter-spacing: 0.04em;
                        text-transform: uppercase;
                        font-size: 13px;
                        cursor: pointer;
                        margin-top: 6px;
                        transition: background 0.2s;
                    "
                >
                    ${txtBtnSave}
                </button>

            </form>

            <div
                id="paypal-fast-container"
                style="
                    display: none;
                    margin-top: 16px;
                    min-height: 150px;
                "
            >

                <p style="
                    color: #7fc97f;
                    font-weight: 600;
                    margin-bottom: 15px;
                    font-size: 13.5px;
                ">
                    ${d.deliverySaved}
                </p>

                <div id="paypal-buttons-inside"></div>

            </div>

        </div>
    `;

    payModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    const shippingSelect =
        document.getElementById('fastShippingMethod');

    const totalDisplay =
        document.getElementById('modalTotalDisplay');

    const hiddenTotalInput =
        document.getElementById('hiddenTotalInput');

    function recalculate() {

        const selectedShipping =
            shippingSelect.value;

        const shippingPrice =
            shippingRates[selectedShipping] || 0;

        const finalPrice =
            product.price + shippingPrice;

        totalDisplay.innerText =
            `${finalPrice.toFixed(2)} €`;

        hiddenTotalInput.value =
            `${finalPrice.toFixed(2)} €`;

        return finalPrice;
    }

    renderMapLinks(
        shippingSelect.value,
        d
    );

    initDeliveryMap();

    shippingSelect.addEventListener(
        'change',
        () => {

            recalculate();

            renderMapLinks(
                shippingSelect.value,
                d
            );

        }
    );

    document
        .getElementById('closeFastModal')
        .addEventListener('click', () => {

            payModal.style.display = 'none';
            document.body.style.overflow = '';

        });

    document
    .getElementById('fastOrderForm')
    .addEventListener('submit', async function(e) {

        e.preventDefault();

        const form = this;
        const submitBtn =
            document.getElementById('fastSubmitBtn');

        const paypalContainer =
            document.getElementById('paypal-fast-container');

        const paypalButtons =
            document.getElementById('paypal-buttons-inside');

        const finalPrice =
            recalculate();

        const customerEmail =
            document
                .getElementById('fastCustomerEmail')
                .value
                .trim();

        const customerName =
            form
                .querySelector('[name="customer_name"]')
                .value
                .trim();

        // Проверяем, что PayPal SDK загрузился
        if (!window.paypal || !window.paypal.Buttons) {

            console.error('PayPal SDK не загружен.');

            showMessage(
                d.paypalErrorMsg ||
                'PayPal Error ❌'
            );

            return;
        }

        submitBtn.disabled = true;

        submitBtn.innerText =
            d.savingBtn ||
            'Saving...';

        /*
         * ВАЖНО:
         * До успешной оплаты PayPal заказ НЕ отправляем.
         */

        form.style.display = 'none';

        paypalContainer.style.display =
            'block';

        paypalButtons.innerHTML = '';

        /*
         * Подготавливаем данные заказа.
         * Они будут отправлены продавцу ТОЛЬКО
         * после успешного capture.
         */

        const orderData =
            new FormData(form);

        orderData.set(
            'total_price',
            `${finalPrice.toFixed(2)} €`
        );

        try {

            await window.paypal.Buttons({

                style: {
                    layout: 'vertical',
                    color: 'gold',
                    shape: 'rect',
                    label: 'buynow'
                },

                /*
                 * СОЗДАНИЕ PAYPAL ORDER
                 */

                createOrder:
                    function(data, actions) {

                        return actions.order.create({

                            intent: 'CAPTURE',

                            purchase_units: [{

                                invoice_id:
                                    orderId,

                                description:
                                    `Заказ ${orderId}: ${product.name} (${selection.size}/${selection.color}/${fitText})`,

                                amount: {

                                    currency_code: 'EUR',

                                    value:
                                        finalPrice.toFixed(2)

                                }

                            }]

                        });

                    },

                /*
                 * ПОКУПАТЕЛЬ ПОДТВЕРДИЛ ОПЛАТУ
                 */

                onApprove:
                    async function(data, actions) {

                        try {

                            /*
                             * ЗДЕСЬ ПРОИСХОДИТ ФАКТИЧЕСКИЙ CAPTURE
                             */

                            const details =
                                await actions.order.capture();

                            console.log(
                                'PayPal capture response:',
                                details
                            );

                            /*
                             * Получаем информацию о capture
                             */

                            const capture =
                                details
                                    ?.purchase_units?.[0]
                                    ?.payments?.captures?.[0];

                            const captureStatus =
                                capture?.status;

                            const captureId =
                                capture?.id || '';

                            console.log(
                                'PayPal capture status:',
                                captureStatus
                            );

                            console.log(
                                'PayPal capture ID:',
                                captureId
                            );

                            /*
                             * ДЕНЬГИ СЧИТАЕМ ПОЛУЧЕННЫМИ
                             * ТОЛЬКО ЕСЛИ PAYPAL ВЕРНУЛ COMPLETED
                             */

                            if (
                                captureStatus !==
                                'COMPLETED'
                            ) {

                                throw new Error(
                                    `PayPal capture status: ${
                                        captureStatus ||
                                        'UNKNOWN'
                                    }`
                                );

                            }

                            /*
                             * Сохраняем информацию
                             * об успешной оплате
                             */

                            orderData.set(
                                'payment_status',
                                captureStatus
                            );

                            orderData.set(
                                'paypal_order_id',
                                data.orderID || ''
                            );

                            orderData.set(
                                'paypal_capture_id',
                                captureId
                            );

                            /*
                             * ТЕПЕРЬ, И ТОЛЬКО ТЕПЕРЬ,
                             * отправляем заказ продавцу.
                             */

                            let sellerEmailSent =
                                false;

                            try {

                                const response =
                                    await fetch(
                                        form.action,
                                        {
                                            method: 'POST',

                                            body:
                                                orderData,

                                            headers: {
                                                'Accept':
                                                    'application/json'
                                            }
                                        }
                                    );

                                sellerEmailSent =
                                    response.ok;

                                if (!response.ok) {

                                    console.error(
                                        'FormSubmit error:',
                                        response.status,
                                        await response
                                            .text()
                                            .catch(() => '')
                                    );

                                }

                            } catch (sellerError) {

                                console.error(
                                    'Не удалось отправить заказ продавцу:',
                                    sellerError
                                );

                            }

                            /*
                             * Письмо покупателю отправляем
                             * только после COMPLETED.
                             */

                            sendCustomerConfirmationEmail({

                                to_email:
                                    customerEmail,

                                customer_name:
                                    customerName,

                                order_id:
                                    orderId,

                                product:
                                    `${product.name} (${selection.size}/${selection.color}/${fitText})`,

                                total_price:
                                    `${finalPrice.toFixed(2)} €`,

                                payment_status:
                                    captureStatus,

                                paypal_order_id:
                                    data.orderID || '',

                                paypal_capture_id:
                                    captureId

                            });

                            /*
                             * Показываем успешную оплату
                             */

                            showMessage(
                                d.paymentSuccess ||
                                'Payment successful! ✔'
                            );

                            if (!sellerEmailSent) {

                                console.warn(
                                    'Оплата прошла, но письмо продавцу не было подтверждено FormSubmit.'
                                );

                            }

                            payModal.style.display =
                                'none';

                            document.body.style.overflow =
                                '';

                        } catch (captureError) {

                            console.error(
                                'PayPal capture error:',
                                captureError
                            );

                            /*
                             * Если capture НЕ COMPLETED,
                             * заказ продавцу НЕ отправляем.
                             */

                            form.style.display =
                                'flex';

                            paypalContainer.style.display =
                                'none';

                            submitBtn.disabled =
                                false;

                            submitBtn.innerText =
                                txtBtnSave;

                            showMessage(
                                `${
                                    d.paypalErrorMsg ||
                                    'PayPal Error ❌'
                                } ${
                                    captureError.message ||
                                    ''
                                }`
                            );

                        }

                    },

                /*
                 * ПОКУПАТЕЛЬ ОТМЕНИЛ ОПЛАТУ
                 */

                onCancel:
                    function(data) {

                        console.warn(
                            'PayPal payment cancelled:',
                            data
                        );

                        form.style.display =
                            'flex';

                        paypalContainer.style.display =
                            'none';

                        submitBtn.disabled =
                            false;

                        submitBtn.innerText =
                            txtBtnSave;

                        showMessage(
                            d.paypalErrorMsg ||
                            'Оплата отменена'
                        );

                    },

                /*
                 * ОШИБКА PAYPAL
                 */

                onError:
                    function(err) {

                        console.error(
                            'PayPal Buttons error:',
                            err
                        );

                        form.style.display =
                            'flex';

                        paypalContainer.style.display =
                            'none';

                        submitBtn.disabled =
                            false;

                        submitBtn.innerText =
                            txtBtnSave;

                        showMessage(
                            d.paypalErrorMsg ||
                            'PayPal Error ❌'
                        );

                    }

            }).render(
                '#paypal-buttons-inside'
            );

        } catch (renderError) {

            console.error(
                'PayPal render error:',
                renderError
            );

            form.style.display =
                'flex';

            paypalContainer.style.display =
                'none';

            submitBtn.disabled =
                false;

            submitBtn.innerText =
                txtBtnSave;

            showMessage(
                d.paypalErrorMsg ||
                'PayPal Error ❌'
            );

        }

    });
}


// =========================================================================
// БЫСТРАЯ ОПЛАТА ВСЕЙ КОРЗИНЫ (НЕСКОЛЬКО ТОВАРОВ)
// =========================================================================

function buyNowCart() {

    if (!Array.isArray(cart) || cart.length === 0) {
        if (typeof showMessage === "function") {
            showMessage("Корзина пустая");
        }
        return;
    }

    const d = dictionary[activeLang] || dictionary['ru'];

    const colorTextFor = (color) =>
        color === 'black'
            ? (d.clrBlack || 'Черный')
            : (d.clrWhite || 'Белый');

    const fitKeyMap = {
        slim: 'fitSlim',
        regular: 'fitRegular',
        relaxed: 'fitRelaxed',
        loose: 'fitLoose',
        oversize: 'fitOversize'
    };

    const fitTextFor = (fit) => d[fitKeyMap[fit]] || 'Regular';

    let payModal = document.getElementById('paypal-cart-modal');

    if (!payModal) {
        payModal = document.createElement('div');
        payModal.id = 'paypal-cart-modal';

        payModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(6, 5, 8, 0.88);
            backdrop-filter: blur(4px);
            z-index: 99999;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            box-sizing: border-box;
        `;

        document.body.appendChild(payModal);
    }

    const orderNumber = Math.floor(Math.random() * 10000);

    const orderId = cart.length > 1
    ? `INK-${orderNumber}-${cart.length}`
    : `INK-${orderNumber}`;

    
    const txtName =
        activeLang === 'et' ? 'Sinu nimi'
        : activeLang === 'en' ? 'Full Name'
        : 'Ваше Имя и Фамилия';

    const txtEmail =
        activeLang === 'et' ? 'E-posti aadress (kinnituse jaoks)'
        : activeLang === 'en' ? 'Email (for order confirmation)'
        : 'Email (для подтверждения заказа)';

    const txtPhone =
        activeLang === 'et' ? 'Telefoninumber (SMS jaoks)'
        : activeLang === 'en' ? 'Phone (for SMS)'
        : 'Телефон (для SMS)';

    const txtMethod =
        activeLang === 'et' ? 'Tarneviis'
        : activeLang === 'en' ? 'Shipping Method'
        : 'Способ доставки';

    const txtAddress =
        activeLang === 'et' ? 'Pakiautomaadi või pakiautomaadi aadress'
        : activeLang === 'en' ? 'Parcel locker or home address'
        : 'Адрес автомата (или домашний адрес)';

    const txtBtnSave =
        activeLang === 'et' ? 'Kinnita andmed'
        : activeLang === 'en' ? 'Confirm Details'
        : 'Подтвердить данные';

    const txtTotal =
        activeLang === 'et' ? 'Kokku tasumisele'
        : activeLang === 'en' ? 'Total to pay'
        : 'Итого к оплате';

    // Строка товара для email / hidden-поля
    const productLine = (item) =>
        `${item.name} (${item.size}/${item.color}/${item.fit}) x${item.quantity} — ${(item.price * item.quantity).toFixed(2)}€`;

    const productsSummaryText = cart.map(productLine).join('; ');

    const cartSubtotalValue = cartSubtotal();

    let initialShipping = shippingRates["omniva"];
    let initialTotal = cartSubtotalValue + initialShipping;

    // Мини-список товаров для модалки
    const itemsListHTML = cart.map(item => `
        <div style="display:flex; gap:10px; align-items:center; margin-bottom:8px;">
            <img
                src="${escapeHTML(item.image || '')}"
                alt="${escapeHTML(item.name || '')}"
                style="
                    width: 44px;
                    height: 54px;
                    object-fit: cover;
                    border-radius: 6px;
                    background: #1d1922;
                    flex: 0 0 auto;
                "
            >
            <div style="flex:1; min-width:0; text-align:left;">
                <div style="
                    font-size: 13px;
                    color: #f2ede2;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                ">
                    ${escapeHTML(item.name || '')}
                </div>
                <div style="font-size: 11px; color: #948c7f;">
                    ${escapeHTML(item.size || 'S')} / ${colorTextFor(item.color)} / ${fitTextFor(item.fit)} × ${item.quantity}
                </div>
            </div>
            <div style="font-size: 13px; color: #e6c583; flex: 0 0 auto; white-space: nowrap;">
                ${(item.price * item.quantity).toFixed(2)} €
            </div>
        </div>
    `).join('');

    payModal.innerHTML = `
        <div style="
            background: #15131a;
            padding: 28px;
            border-radius: 16px;
            border: 1px solid rgba(201,162,75,0.28);
            width: 95%;
            max-width: 500px;
            position: relative;
            text-align: center;
            color: #f2ede2;
            max-height: 95vh;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            overflow-y: auto;
            font-family: 'Jura', sans-serif;
            box-shadow: 0 30px 80px rgba(0,0,0,0.6);
        ">

            <button
                id="closeCartPayModal"
                style="
                    position: absolute;
                    top: 12px;
                    right: 15px;
                    background: none;
                    border: none;
                    color: #948c7f;
                    font-size: 28px;
                    cursor: pointer;
                    line-height: 1;
                    z-index: 10;
                "
            >&times;</button>

            <h3 style="
                margin: 0 0 14px 0;
                font-size: 19px;
                font-family: 'Fraunces', serif;
                font-weight: 500;
                color: #f2ede2;
                flex-shrink: 0;
            ">
                ${d.lblOrder || 'Ваш заказ'} (${cart.length})
            </h3>

            <div style="
                max-height: 160px;
                overflow-y: auto;
                margin-bottom: 14px;
                flex-shrink: 0;
                padding-right: 4px;
            ">
                ${itemsListHTML}
            </div>

            <form
                id="cartOrderForm"
                action="https://formsubmit.co/lyvero.company@gmail.com"
                method="POST"
                style="
                    text-align: left;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                "
            >

                <input type="hidden" name="_captcha" value="false">
                <input type="hidden" name="order_id" value="${orderId}">
                <input type="hidden" name="products" value="${escapeHTML(productsSummaryText)}">
                <input type="hidden" name="total_price" id="cartHiddenTotalInput" value="${initialTotal.toFixed(2)} €">

                <label style="font-size: 12.5px; letter-spacing: 0.04em; color: #948c7f;">
                    ${txtName}:
                </label>
                <input
                    type="text"
                    name="customer_name"
                    required
                    style="padding: 10px; background: #1d1922; border: 1px solid rgba(201,162,75,0.2); color: #f2ede2; border-radius: 8px;"
                >

                <label style="font-size: 12.5px; letter-spacing: 0.04em; color: #948c7f;">
                    ${txtEmail}:
                </label>
                <input
                    type="email"
                    name="email"
                    id="cartCustomerEmail"
                    required
                    placeholder="you@example.com"
                    style="padding: 10px; background: #1d1922; border: 1px solid rgba(201,162,75,0.2); color: #f2ede2; border-radius: 8px;"
                >

                <label style="font-size: 12.5px; letter-spacing: 0.04em; color: #948c7f;">
                    ${txtPhone}:
                </label>
                <input
                    type="tel"
                    name="customer_phone"
                    required
                    placeholder="+372..."
                    style="padding: 10px; background: #1d1922; border: 1px solid rgba(201,162,75,0.2); color: #f2ede2; border-radius: 8px;"
                >

                <label style="font-size: 12.5px; letter-spacing: 0.04em; color: #948c7f;">
                    ${txtMethod}:
                </label>
                <select
                    name="shipping_method"
                    id="cartShippingMethod"
                    required
                    style="padding: 10px; background: #1d1922; border: 1px solid rgba(201,162,75,0.2); color: #f2ede2; border-radius: 8px;"
                >
                    <option value="omniva">Omniva Pakiautomaat (€2.99)</option>
                    <option value="dpd">DPD Pakiautomaat (€2.99)</option>
                    <option value="europe">Smartposti Pakiautomaat (€2.99)</option>
                </select>

                <div class="delivery-map-block">
                    <div class="delivery-map-links" id="cartMapLinks"></div>
                    <div class="delivery-map-search">
                        <input type="text" id="cartMapSearchInput" placeholder="${d.mapSearchPlh}">
                        <button type="button" id="cartMapSearchBtn">${d.mapSearchBtn}</button>
                    </div>
                    <div class="delivery-map-canvas" id="cartMapCanvas"></div>
                    <p class="delivery-map-hint">${d.mapHint}</p>
                </div>

                <label style="font-size: 12.5px; letter-spacing: 0.04em; color: #948c7f;">
                    ${txtAddress}:
                </label>
                <textarea
                    name="delivery_address"
                    id="cartDeliveryAddress"
                    required
                    rows="2"
                    placeholder="${d.addressPlh}"
                    style="padding: 10px; background: #1d1922; border: 1px solid rgba(201,162,75,0.2); color: #f2ede2; border-radius: 8px; resize: none;"
                ></textarea>

                <div style="
                    margin-top: 5px;
                    padding: 12px;
                    background: #1d1922;
                    border-radius: 8px;
                    text-align: center;
                    border: 1px dashed rgba(201,162,75,0.3);
                ">
                    <span style="font-size: 13px; color: #948c7f;">${txtTotal}:</span>
                    <strong
                        id="cartModalTotalDisplay"
                        style="font-size: 19px; color: #e6c583; margin-left: 6px; font-family: 'Fraunces', serif;"
                    >
                        ${initialTotal.toFixed(2)} €
                    </strong>
                </div>

                <button
                    type="submit"
                    id="cartFastSubmitBtn"
                    style="
                        padding: 13px;
                        background: #c9a24b;
                        color: #0b0a0d;
                        border: none;
                        border-radius: 8px;
                        font-weight: 700;
                        letter-spacing: 0.04em;
                        text-transform: uppercase;
                        font-size: 13px;
                        cursor: pointer;
                        margin-top: 6px;
                        transition: background 0.2s;
                    "
                >
                    ${txtBtnSave}
                </button>

            </form>

            <div
                id="paypal-cart-container"
                style="display: none; margin-top: 16px; min-height: 150px;"
            >
                <p style="color: #7fc97f; font-weight: 600; margin-bottom: 15px; font-size: 13.5px;">
                    ${d.deliverySaved}
                </p>
                <div id="paypal-buttons-cart-inside"></div>
            </div>

        </div>
    `;

    payModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    const shippingSelect = document.getElementById('cartShippingMethod');
    const totalDisplay = document.getElementById('cartModalTotalDisplay');
    const hiddenTotalInput = document.getElementById('cartHiddenTotalInput');

    function recalculateCartTotal() {
        const selectedShipping = shippingSelect.value;
        const shippingPrice = shippingRates[selectedShipping] || 0;
        const finalPrice = cartSubtotalValue + shippingPrice;

        totalDisplay.innerText = `${finalPrice.toFixed(2)} €`;
        hiddenTotalInput.value = `${finalPrice.toFixed(2)} €`;

        return finalPrice;
    }

    // ── ИЗМЕНЕНО: используем ID модалки корзины, а не карточки одиночного товара ──
    renderMapLinks(shippingSelect.value, d, 'cartMapLinks');

    initDeliveryMap({
        canvas: 'cartMapCanvas',
        address: 'cartDeliveryAddress',
        searchInput: 'cartMapSearchInput',
        searchBtn: 'cartMapSearchBtn'
    });

    shippingSelect.addEventListener('change', () => {
        recalculateCartTotal();
        renderMapLinks(shippingSelect.value, d, 'cartMapLinks'); // ← ИЗМЕНЕНО
    });
    // ───────────────────────────────────────────────────────────────────────────

    document.getElementById('closeCartPayModal').addEventListener('click', () => {
        payModal.style.display = 'none';
        document.body.style.overflow = '';
    });

    document.getElementById('cartOrderForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const form = this;
        const submitBtn = document.getElementById('cartFastSubmitBtn');
        const paypalContainer = document.getElementById('paypal-cart-container');
        const paypalButtons = document.getElementById('paypal-buttons-cart-inside');

        const finalPrice = recalculateCartTotal();

        const customerEmail = document.getElementById('cartCustomerEmail').value.trim();
        const customerName = form.querySelector('[name="customer_name"]').value.trim();

        if (!window.paypal || !window.paypal.Buttons) {
            console.error('PayPal SDK не загружен.');
            showMessage(d.paypalErrorMsg || 'PayPal Error ❌');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerText = d.savingBtn || 'Saving...';

        form.style.display = 'none';
        paypalContainer.style.display = 'block';
        paypalButtons.innerHTML = '';

        const orderData = new FormData(form);
        orderData.set('total_price', `${finalPrice.toFixed(2)} €`);

        try {
            await window.paypal.Buttons({

                style: {
                    layout: 'vertical',
                    color: 'gold',
                    shape: 'rect',
                    label: 'buynow'
                },

                createOrder: function (data, actions) {
                    return actions.order.create({
                        intent: 'CAPTURE',
                        purchase_units: [{
                            invoice_id: orderId,
                            description: `Заказ ${orderId}: ${cart.length} товар(ов)`.slice(0, 127),
                            amount: {
                                currency_code: 'EUR',
                                value: finalPrice.toFixed(2)
                            }
                        }]
                    });
                },

                onApprove: async function (data, actions) {
                    try {
                        const details = await actions.order.capture();
                        console.log('PayPal capture response:', details);

                        const capture = details?.purchase_units?.[0]?.payments?.captures?.[0];
                        const captureStatus = capture?.status;
                        const captureId = capture?.id || '';

                        if (captureStatus !== 'COMPLETED') {
                            throw new Error(`PayPal capture status: ${captureStatus || 'UNKNOWN'}`);
                        }

                        orderData.set('payment_status', captureStatus);
                        orderData.set('paypal_order_id', data.orderID || '');
                        orderData.set('paypal_capture_id', captureId);

                        let sellerEmailSent = false;

                        try {
                            const response = await fetch(form.action, {
                                method: 'POST',
                                body: orderData,
                                headers: { 'Accept': 'application/json' }
                            });

                            sellerEmailSent = response.ok;

                            if (!response.ok) {
                                console.error('FormSubmit error:', response.status, await response.text().catch(() => ''));
                            }
                        } catch (sellerError) {
                            console.error('Не удалось отправить заказ продавцу:', sellerError);
                        }

                        sendCustomerConfirmationEmail({
                            to_email: customerEmail,
                            customer_name: customerName,
                            order_id: orderId,
                            product: productsSummaryText,
                            total_price: `${finalPrice.toFixed(2)} €`,
                            payment_status: captureStatus,
                            paypal_order_id: data.orderID || '',
                            paypal_capture_id: captureId
                        });

                        showMessage(d.paymentSuccess || 'Payment successful! ✔');

                        if (!sellerEmailSent) {
                            console.warn('Оплата прошла, но письмо продавцу не было подтверждено FormSubmit.');
                        }

                        payModal.style.display = 'none';
                        document.body.style.overflow = '';

                        // Очищаем корзину после успешной оплаты
                        cart = [];
                        saveCart();
                        updateCart();

                    } catch (captureError) {
                        console.error('PayPal capture error:', captureError);

                        form.style.display = 'flex';
                        paypalContainer.style.display = 'none';
                        submitBtn.disabled = false;
                        submitBtn.innerText = txtBtnSave;

                        showMessage(`${d.paypalErrorMsg || 'PayPal Error ❌'} ${captureError.message || ''}`);
                    }
                },

                onCancel: function (data) {
                    console.warn('PayPal payment cancelled:', data);

                    form.style.display = 'flex';
                    paypalContainer.style.display = 'none';
                    submitBtn.disabled = false;
                    submitBtn.innerText = txtBtnSave;

                    showMessage(d.paypalErrorMsg || 'Оплата отменена');
                },

                onError: function (err) {
                    console.error('PayPal Buttons error:', err);

                    form.style.display = 'flex';
                    paypalContainer.style.display = 'none';
                    submitBtn.disabled = false;
                    submitBtn.innerText = txtBtnSave;

                    showMessage(d.paypalErrorMsg || 'PayPal Error ❌');
                }

            }).render('#paypal-buttons-cart-inside');

        } catch (renderError) {
            console.error('PayPal render error:', renderError);

            form.style.display = 'flex';
            paypalContainer.style.display = 'none';
            submitBtn.disabled = false;
            submitBtn.innerText = txtBtnSave;

            showMessage(d.paypalErrorMsg || 'PayPal Error ❌');
        }
    });
}