const cfg = window.DARNA_CONFIG;

const $ = (id) => document.getElementById(id);

const formatDA = (n) => `${Number(n).toLocaleString("fr-FR")} دج`;

let currentLang = "ar";

const T = {
  ar: {
    price: "السعر",
    delivery: "التوصيل",
    orderNow: "اطلب الآن",
    qty: "الكمية *",
    color: "اللون (اختياري)",
    fullName: "الاسم الكامل *",
    phone: "رقم الهاتف *",
    wilaya: "الولاية *",
    commune: "البلدية *",
    deliveryType: "نوع التوصيل *",
    door: "للمنزل",
    desk: "للمكتب",
    total: "المجموع",
    totalNote: "سيتم تأكيد الطلب عبر الاتصال",
    submit: "تأكيد الطلب",
    privacy: "بإرسال الطلب أنت توافق على أن يتم الاتصال بك لتأكيد الطلب.",
    successTitle: "تم إرسال طلبك ✅",
    successText: "شكراً لك! سنتصل بك قريباً لتأكيد الطلب.",
    newOrder: "طلب جديد",
    badgeFast: "تأكيد سريع"
  },
  en: {
    price: "Price",
    delivery: "Delivery",
    orderNow: "Order now",
    qty: "Quantity *",
    color: "Color (optional)",
    fullName: "Full name *",
    phone: "Phone number *",
    wilaya: "Wilaya *",
    commune: "Commune *",
    deliveryType: "Delivery type *",
    door: "Home delivery",
    desk: "Desk delivery",
    total: "Total",
    totalNote: "We will call you to confirm your order",
    submit: "Confirm order",
    privacy: "By submitting, you agree to be contacted to confirm your order.",
    successTitle: "Order sent ✅",
    successText: "Thank you! We will contact you soon to confirm.",
    newOrder: "New order",
    badgeFast: "Fast confirmation"
  },
  fr: {
    price: "Prix",
    delivery: "Livraison",
    orderNow: "Commander",
    qty: "Quantité *",
    color: "Couleur (optionnel)",
    fullName: "Nom complet *",
    phone: "Téléphone *",
    wilaya: "Wilaya *",
    commune: "Commune *",
    deliveryType: "Type de livraison *",
    door: "À domicile",
    desk: "Au bureau",
    total: "Total",
    totalNote: "Nous vous appelons pour confirmer",
    submit: "Confirmer la commande",
    privacy: "En envoyant, vous acceptez d'être contacté pour confirmer votre commande.",
    successTitle: "Commande envoyée ✅",
    successText: "Merci ! Nous vous contacterons bientôt.",
    newOrder: "Nouvelle commande",
    badgeFast: "Confirmation rapide"
  }
};

function setLang(lang){
  currentLang = lang;

  document.documentElement.lang = lang;
  document.documentElement.dir = (lang === "ar") ? "rtl" : "ltr";

  // top texts
  $("brandName").textContent = cfg.brandName;
  $("brandSub").textContent = cfg.brandSubtitle[lang];

  // product
  $("productName").textContent = cfg.product.name[lang];
  $("productDesc").textContent = cfg.product.description[lang];
  $("priceLabel").textContent = T[lang].price;
  $("deliveryLabel").textContent = T[lang].delivery;
  $("productPrice").textContent = formatDA(cfg.product.priceDA);

  // form labels
  $("orderTitle").textContent = T[lang].orderNow;
  $("qtyLabel").textContent = T[lang].qty;
  $("colorLabel").textContent = T[lang].color;
  $("nameLabel").textContent = T[lang].fullName;
  $("phoneLabel").textContent = T[lang].phone;
  $("wilayaLabel").textContent = T[lang].wilaya;
  $("communeLabel").textContent = T[lang].commune;
  $("deliveryTypeLabel").textContent = T[lang].deliveryType;
  $("doorLabel").textContent = T[lang].door;
  $("deskLabel").textContent = T[lang].desk;

  $("totalLabel").textContent = T[lang].total;
  $("totalNote").textContent = T[lang].totalNote;
  $("submitBtn").textContent = T[lang].submit;
  $("privacyNote").textContent = T[lang].privacy;

  $("successTitle").textContent = T[lang].successTitle;
  $("successText").textContent = T[lang].successText;
  $("newOrderBtn").textContent = T[lang].newOrder;

  // badges
  $("badgeFast").textContent = T[lang].badgeFast;

  // update lang buttons
  document.querySelectorAll(".langBtn").forEach(btn=>{
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
}

function populateQuantity(){
  const qty = $("qty");
  qty.innerHTML = "";
  for(let i=1;i<=cfg.quantityMax;i++){
    const opt = document.createElement("option");
    opt.value = String(i);
    opt.textContent = String(i);
    qty.appendChild(opt);
  }
}

function populateColors(){
  const wrap = $("colorWrap");
  const color = $("color");
  if(!cfg.enableColor){
    wrap.classList.add("hidden");
    return;
  }
  wrap.classList.remove("hidden");
  color.innerHTML = `<option value="">—</option>`;
  cfg.colors.forEach(c=>{
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    color.appendChild(opt);
  });
}

function populateWilayas(){
  const wilaya = $("wilaya");
  wilaya.innerHTML = "";
  const wilayas = Object.keys(window.DZ || {}).sort((a,b)=>a.localeCompare(b,"ar"));
  wilayas.forEach(w=>{
    const opt = document.createElement("option");
    opt.value = w;
    opt.textContent = w;
    wilaya.appendChild(opt);
  });

  // default
  const def = cfg.delivery.defaultWilaya;
  if(def && wilayas.includes(def)){
    wilaya.value = def;
  }
  populateCommunes();
}

function populateCommunes(){
  const wilaya = $("wilaya").value;
  const commune = $("commune");
  commune.innerHTML = "";
  const communes = (window.DZ && window.DZ[wilaya]) ? window.DZ[wilaya] : [];
  communes.forEach(c=>{
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    commune.appendChild(opt);
  });
}

function getDeliveryType(){
  return document.querySelector('input[name="deliveryType"]:checked').value;
}

function calcTotal(){
  const qty = Number($("qty").value || 1);
  const deliveryType = getDeliveryType();
  const delivery = (deliveryType === "door") ? cfg.delivery.doorDA : cfg.delivery.deskDA;
  const total = (cfg.product.priceDA * qty) + delivery;
  $("totalPrice").textContent = formatDA(total);

  $("doorPriceHint").textContent = `(+${formatDA(cfg.delivery.doorDA)})`;
  $("deskPriceHint").textContent = `(+${formatDA(cfg.delivery.deskDA)})`;
}

async function submitToGoogleForm(payload){
  // Simple submit by opening the Google Form in a new tab with prefilled values is not reliable without entry IDs.
  // So we submit using a hidden form POST to the formResponse endpoint (needs entry IDs).
  // For now: open the form link so you can keep tracking orders (manual submit) if needed.
  // Next step: I will help you map entry IDs to make it 100% automatic.
  window.open(cfg.googleFormUrl, "_blank");
}

function wire(){
  $("year").textContent = new Date().getFullYear();
  $("footerBrand").textContent = cfg.brandName;

  $("productImage").src = cfg.product.imageUrl;

  populateQuantity();
  populateColors();
  populateWilayas();
  calcTotal();

  $("wilaya").addEventListener("change", ()=>{
    populateCommunes();
  });

  ["qty","color","fullName","phone","commune"].forEach(id=>{
    const el = $(id);
    if(el) el.addEventListener("input", calcTotal);
    if(el) el.addEventListener("change", calcTotal);
  });

  document.querySelectorAll('input[name="deliveryType"]').forEach(r=>{
    r.addEventListener("change", calcTotal);
  });

  document.querySelectorAll(".langBtn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      setLang(btn.dataset.lang);
      calcTotal();
    });
  });

  $("newOrderBtn").addEventListener("click", ()=>{
    $("success").classList.add("hidden");
    $("orderForm").classList.remove("hidden");
    $("orderForm").reset();
    populateQuantity();
    populateColors();
    populateWilayas();
    calcTotal();
  });

  $("orderForm").addEventListener("submit", async (e)=>{
    e.preventDefault();

    const payload = {
      qty: $("qty").value,
      color: $("color").value,
      fullName: $("fullName").value,
      phone: $("phone").value,
      wilaya: $("wilaya").value,
      commune: $("commune").value,
      deliveryType: getDeliveryType(),
      total: $("totalPrice").textContent
    };

    await submitToGoogleForm(payload);

    $("orderForm").classList.add("hidden");
    $("success").classList.remove("hidden");
  });

  setLang("ar");
}

wire();
