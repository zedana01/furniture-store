/**
 * Mobiliar Home Furniture - Core Store Engine
 * Handles Slider, Cart Drawer, Wishlist, WhatsApp Order Routing, and CMS Sync
 */

// Fallback Default Products
var defaultFurnProducts = [
    {
        id: 1,
        title: "كنب زاوية مودرن مخملي عاجي",
        name: "كنب زاوية مودرن مخملي عاجي",
        category: "living",
        categoryName: "غرف المعيشة",
        price: 4250,
        oldPrice: 5200,
        material: "كتان إسكندنافي مع خشب زان طبيعي",
        dimensions: "320سم × 210سم × 85سم",
        rating: 5,
        badge: "الأكثر طلباً",
        image: "images/furn_prod_sofa.jpg",
        specs: ["خشب زان أحمر مجفف", "قماش معالج ضد البقع", "نوابض جيبية منفصلة", "وسائد إضافية مجانية"],
        description: "كنب زاوية فاخر بتصميم نورديك مريح، حشوة فوم عالي الكثافة مع نوابض جيبية منفصلة تعطي أقصى درجات الدعم، وقماش معالج ضد البقع وسهل التنظيف."
    },
    {
        id: 2,
        title: "كرسي قراءة نورديك بقماش البوكليه",
        name: "كرسي قراءة نورديك بقماش البوكليه",
        category: "recliners",
        categoryName: "كراسي الاسترخاء والمفردات",
        price: 1290,
        oldPrice: 1650,
        material: "بوكليه ناعم وأرجل بلوط صلب",
        dimensions: "80سم × 85سم × 90سم",
        rating: 5,
        badge: "جديد",
        image: "images/furn_prod_chair.jpg",
        specs: ["قماش بوكليه تيدي فاخر", "هيكل معدني مدعم", "أرجل خشب بلوط مطفي", "دعم كامل للظهر"],
        description: "كرسي مفرد أنيق يحتضن الجسم بنعومة فائقة بقماش البوكليه العصري وقاعدة خشبية صلبة تمنح زاوية القراءة أو الصالون سحراً لا يقاوم."
    },
    {
        id: 3,
        title: "سرير كينج من خشب البلوط الطبيعي",
        name: "سرير كينج من خشب البلوط الطبيعي",
        category: "bedroom",
        categoryName: "غرف النوم والأسرّة",
        price: 3800,
        oldPrice: 4600,
        material: "خشب بلوط أمريكي صلب",
        dimensions: "200سم × 200سم (مقاس كينج)",
        rating: 5,
        badge: "خصم 20%",
        image: "images/furn_prod_bed.jpg",
        specs: ["خشب بلوط طبيعي 100%", "ألواح خشبية مانعة للصوت", "ظهر مبطن بكتان بيج", "ارتفاع القاعدة 35 سم"],
        description: "سرير ماستر فندقي مصمم ليجمع بين صلابة الخشب الطبيعي والانسيابية الهادئة، مزود بألواح داعمة قوية تمنع الاهتزاز والأصوات."
    },
    {
        id: 4,
        title: "طاولة طعام خشب جوز لـ 8 أشخاص",
        name: "طاولة طعام خشب جوز لـ 8 أشخاص",
        category: "dining",
        categoryName: "طاولات وكراسي السفرة",
        price: 3450,
        oldPrice: 4100,
        material: "خشب جوز طبيعي وقاعدة فولاذ أسود",
        dimensions: "240سم × 100سم × 76سم",
        rating: 5,
        badge: "تصميم حصري",
        image: "images/furn_prod_table.jpg",
        specs: ["خشب جوز طبيعي معالج", "قاعدة ستيل صلب بطلاء كهرستاتيكي", "حواف مشطوفة آمنة", "تتسع لـ 8 إلى 10 كراسي"],
        description: "طاولة سفرة عصرية بأسلوب لوفت راقٍ يبرز عروق الخشب الطبيعية الفاتنة مع متانة استثنائية للاستخدام اليومي والمناسبات العائلية."
    },
    {
        id: 5,
        title: "طاولة قهوة رخامية دائرية بتفاصيل نحاس",
        name: "طاولة قهوة رخامية دائرية بتفاصيل نحاس",
        category: "living",
        categoryName: "غرف المعيشة",
        price: 1450,
        oldPrice: 1800,
        material: "رخام كارارا أبيض وقاعدة ستيل نحاسي",
        dimensions: "قطر 90سم × ارتفاع 45سم",
        rating: 5,
        badge: "الأكثر أناقة",
        image: "images/furn_prod_coffee.jpg",
        specs: ["رخام مصقول ضد السوائل", "قاعدة ستيل مطلي PVD ذهبي", "وزن ثقيل يمنع الانزلاق", "حواف ناعمة"],
        description: "قطعة فنية تزين صالة المعيشة بسطح رخامي فاخر وعروق رمادية طبيعية دقيقة، تضفي إحساساً بالفخامة والرحابة في المساحة."
    },
    {
        id: 6,
        title: "طقم كمودينات سرير مزدوجة خشب زان",
        name: "طقم كمودينات سرير مزدوجة خشب زان",
        category: "bedroom",
        categoryName: "غرف النوم والأسرّة",
        price: 1100,
        oldPrice: 1400,
        material: "خشب زان مع أدراج إغلاق ناعم",
        dimensions: "50سم × 42سم × 52سم",
        rating: 5,
        badge: "طقم قطعتين",
        image: "images/furn_prod_commode.jpg",
        specs: ["طقم يشمل قطعتين", "أدراج بسحب سوفت كلوز", "مقابض نحاسية دقيقة", "تشطيب مطفي"],
        description: "طقم طاولات سرير جانبية بتصميم انسيابي يوفر مساحة تخزين مثالية ومظهراً دافئاً يكمل أناقة غرفة النوم الماستر."
    },
    {
        id: 7,
        title: "طقم 4 كراسي طعام مخملية مريحة",
        name: "طقم 4 كراسي طعام مخملية مريحة",
        category: "dining",
        categoryName: "طاولات وكراسي السفرة",
        price: 1950,
        oldPrice: 2400,
        material: "مخمل ملكي مع أرجل خشب جوز",
        dimensions: "عرض 54سم × عمق 58سم × ارتفاع 82سم",
        rating: 5,
        badge: "عرض طقم 4 قطع",
        image: "images/furn_prod_dining_chairs.jpg",
        specs: ["طقم من 4 كراسي", "قماش مخملي ناعم سهل التنظيف", "أرجل خشب جوز بأطراف نحاسية", "ميموري فوم عالي الكثافة"],
        description: "كراسي سفرة تجمع بين الراحة القصوى والجمالية البصرية، مع مسند ظهر منحني هندسياً ليمنح جلوساً صحياً أثناء الوجبات."
    },
    {
        id: 8,
        title: "مصباح أرضي آرت ديكو ونحاس مطفي",
        name: "مصباح أرضي آرت ديكو ونحاس مطفي",
        category: "decor",
        categoryName: "وحدات الإضاءة والديكور",
        price: 680,
        oldPrice: 850,
        material: "قاعدة رخام ثقيلة وهيكل نحاس مطفي",
        dimensions: "ارتفاع 165سم × قاعدة قطر 32سم",
        rating: 5,
        badge: "إضاءة دافئة",
        image: "images/furn_prod_lamp.jpg",
        specs: ["قاعدة رخام مانعة للانقلاب", "نحاس معالج ضد الأكسدة", "رأس دوار 360 درجة", "دعم لمبات LED دافئة"],
        description: "وحدة إضاءة أرضية أيقونية تعيد إحياء فن الآرت ديكو العصري، توفر إضاءة قراءة مريحة وتضفي عمقاً جمالياً على أي زاوية."
    },
    {
        id: 9,
        title: "كرسي استرخاء شيزلونج جلد طبيعي بني",
        name: "كرسي استرخاء شيزلونج جلد طبيعي بني",
        category: "recliners",
        categoryName: "كراسي الاسترخاء والمفردات",
        price: 2890,
        oldPrice: 3400,
        material: "جلد طبيعي توب جرين مع خشب زان",
        dimensions: "160سم × 70سم × 80سم",
        rating: 5,
        badge: "جلد طبيعي فاخر",
        image: "images/furn_prod_recliner.jpg",
        specs: ["جلد بقري طبيعي 100%", "هيكل مريح للعمود الفقري", "وسادة رأس قابلة للتعديل", "ضمان 5 سنوات على الجلد"],
        description: "تجربة استرخاء لا تُضاهى مع شيزلونج الجلد الإيطالي الفاخر بتصميمه الكلاسيكي المريح الذي يمنحك ملاذاً مثالياً للراحة."
    },
    {
        id: 10,
        title: "دولاب ملابس ماستر خشب زان وأبواب مرايا",
        name: "دولاب ملابس ماستر خشب زان وأبواب مرايا",
        category: "bedroom",
        categoryName: "غرف النوم والأسرّة",
        price: 5600,
        oldPrice: 6800,
        material: "خشب زان وقشرة سنديان طبيعية",
        dimensions: "260سم × 220سم × 65سم",
        rating: 5,
        badge: "سعة تخزين كبرى",
        image: "images/furn_prod_wardrobe.jpg",
        specs: ["تقسيم ذكي مع إضاءة LED داخلية", "أبواب سحاب سوفت كلوز ومرايا بلجيكية", "أدراج مخفية وإكسسوارات سحب", "مقاوم للرطوبة"],
        description: "خزانة ملابس رحبة مصممة بدقة لتنظيم متكامل لكافة الأزياء والإكسسوارات مع لمسات إضاءة ذكية تضيء تلقائياً."
    },
    {
        id: 11,
        title: "بوفيه ووحدة تخزين صالة خشب سنديان مودرن",
        name: "بوفيه ووحدة تخزين صالة خشب سنديان مودرن",
        category: "living",
        categoryName: "غرف المعيشة",
        price: 2650,
        oldPrice: 3200,
        material: "خشب سنديان طبيعي وأرجل معدنية مذهبة",
        dimensions: "180سم × 45سم × 80سم",
        rating: 5,
        badge: "متعدد الاستخدام",
        image: "images/furn_prod_credenza.jpg",
        specs: ["4 أبواب مع أرفف داخلية قابلة للتعديل", "نقوش هندسية ثلاثية الأبعاد", "سطح واسع للتحف والشاشات", "تشطيب حريري غير لامع"],
        description: "وحدة بوفيه أنيقة تجمع بين الكفاءة التخزينية العالية والحضور الديكوري الأخاذ الذي يتوج مدخل المنزل أو صالة الاستقبال."
    },
    {
        id: 12,
        title: "ثريا سقف معلقة نورديك بتصميم حلقي ذهبي",
        name: "ثريا سقف معلقة نورديك بتصميم حلقي ذهبي",
        category: "decor",
        categoryName: "وحدات الإضاءة والديكور",
        price: 890,
        oldPrice: 1150,
        material: "ألمنيوم نحاسي وأكريليك نانو مشتت",
        dimensions: "قطر 80سم (ارتفاع سلك حتى 150سم)",
        rating: 5,
        badge: "إضاءة 3 درجات",
        image: "images/furn_prod_pendant.jpg",
        specs: ["تحكم بريموت كونترول", "إضاءة دافئة وباردة وطبيعية", "شريحة LED موفرة للطاقة", "سلك تعليق فولاذي متين"],
        description: "ثريا سقف نورديك معلقة بحلقات إضاءة متداخلة تسبح في الهواء بانسيابية، تضفي تأثيراً مسرحياً مبهراً فوق طاولة الطعام أو في الصالة."
    }
];

// Active Products Data
var furnProducts = defaultFurnProducts;
var furnCart = [];
var furnWishlist = [];

// Initialize Local Data
function loadFurnStoreData() {
    try {
        var local = localStorage.getItem('mobiliar_store_data');
        if (local) {
            var parsed = JSON.parse(local);
            if (parsed && Array.isArray(parsed.products) && parsed.products.length > 0) {
                furnProducts = parsed.products;
            }
        }
    } catch(e) {}

    // Load Cart
    try {
        var savedCart = localStorage.getItem('mobiliar_cart');
        if (savedCart) {
            furnCart = JSON.parse(savedCart);
        }
    } catch(e) { furnCart = []; }

    // Load Wishlist
    try {
        var savedWish = localStorage.getItem('mobiliar_wishlist');
        if (savedWish) {
            furnWishlist = JSON.parse(savedWish);
        }
    } catch(e) { furnWishlist = []; }
}

// Save Cart
function saveFurnCart() {
    try {
        localStorage.setItem('mobiliar_cart', JSON.stringify(furnCart));
    } catch(e) {}
    updateFurnCartUI();
}

// Save Wishlist
function saveFurnWishlist() {
    try {
        localStorage.setItem('mobiliar_wishlist', JSON.stringify(furnWishlist));
    } catch(e) {}
    updateFurnWishlistUI();
}

// Add Product to Cart
function addFurnToCart(id, name, price, img) {
    var existing = furnCart.find(function(item) { return item.id === id; });
    if (existing) {
        existing.qty += 1;
    } else {
        furnCart.push({
            id: id,
            name: name,
            price: Number(price),
            img: img || 'images/furn_prod_sofa.jpg',
            qty: 1
        });
    }
    saveFurnCart();
    showFurnToast('تمت إضافة "' + name + '" إلى سلة المشتريات بنجاح! 🛍️');
    openFurnCartDrawer();
}

// Change Quantity
function changeFurnQty(id, delta) {
    var item = furnCart.find(function(i) { return i.id === id; });
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        removeFurnFromCart(id);
    } else {
        saveFurnCart();
    }
}

// Remove from Cart
function removeFurnFromCart(id) {
    furnCart = furnCart.filter(function(i) { return i.id !== id; });
    saveFurnCart();
}

// Update Cart UI
function updateFurnCartUI() {
    var totalCount = 0;
    var totalPrice = 0;

    furnCart.forEach(function(item) {
        totalCount += item.qty;
        totalPrice += (item.price * item.qty);
    });

    // Update badges
    var badges = document.querySelectorAll('.cart-count, #cartCountBadge, #furnCartHeaderCount, #mobileCartCount');
    badges.forEach(function(b) {
        b.textContent = totalCount;
    });

    // Update Totals
    var totalEls = document.querySelectorAll('#cartTotalPrice, #furnDrawerTotalPrice');
    totalEls.forEach(function(t) {
        t.textContent = Number(totalPrice).toLocaleString('en-US') + ' ر.س';
    });

    // Render Cart Items
    var container = document.getElementById('cartDrawerItems') || document.getElementById('furnCartItemsList');
    if (container) {
        if (furnCart.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px 20px; color: #8E9893;">
                    <i class="fa-solid fa-couch" style="font-size: 48px; color: #D8CEBE; margin-bottom: 14px;"></i>
                    <h4 style="font-size: 17px; font-weight: 800; color: #2C302E; margin-bottom: 6px;">سلتك لا تزال فارغة</h4>
                    <p style="font-size: 13.5px; margin-bottom: 18px;">تصفح تشكيلة الأثاث وأضف قطعك المفضلة بسهولة</p>
                    <a href="shop.html" class="btn-pc-primary" style="display: inline-block; padding: 10px 20px; background: #B87342; color: #fff; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 13px;">تصفح كافة القطع</a>
                </div>
            `;
        } else {
            container.innerHTML = furnCart.map(function(item) {
                var escapedName = item.name.replace(/'/g, "\\'");
                return `
                    <div style="display: flex; gap: 14px; align-items: center; padding: 14px 0; border-bottom: 1px solid #ECE7DF;">
                        <img src="${item.img}" alt="${item.name}" style="width: 72px; height: 72px; object-fit: cover; border-radius: 10px; border: 1px solid #ECE7DF;">
                        <div style="flex: 1;">
                            <h5 style="font-size: 13.5px; font-weight: 800; color: #1F2421; margin-bottom: 4px; line-height: 1.4;">${item.name}</h5>
                            <div style="font-size: 13px; font-weight: 900; color: #B87342; margin-bottom: 8px;">${Number(item.price).toLocaleString('en-US')} ر.س</div>
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <div style="display: inline-flex; align-items: center; border: 1.5px solid #ECE7DF; border-radius: 8px; overflow: hidden; background: #fff;">
                                    <button onclick="changeFurnQty(${item.id}, -1)" style="padding: 3px 9px; background: #FBF9F6; border: none; cursor: pointer; font-weight: 800; font-size: 13px;">-</button>
                                    <span style="padding: 3px 10px; font-size: 13px; font-weight: 800; color: #1F2421;">${item.qty}</span>
                                    <button onclick="changeFurnQty(${item.id}, 1)" style="padding: 3px 9px; background: #FBF9F6; border: none; cursor: pointer; font-weight: 800; font-size: 13px;">+</button>
                                </div>
                                <button onclick="removeFurnFromCart(${item.id})" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 13px;" title="حذف القطعة">
                                    <i class="fa-regular fa-trash-can"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }
}

// Drawer Toggle
function toggleFurnCartDrawer() {
    var drawer = document.getElementById('cartDrawer') || document.getElementById('furnCartDrawer');
    if (!drawer) return;
    if (drawer.classList.contains('active')) {
        closeFurnCartDrawer();
    } else {
        openFurnCartDrawer();
    }
}

function openFurnCartDrawer() {
    var drawer = document.getElementById('cartDrawer') || document.getElementById('furnCartDrawer');
    var overlay = document.getElementById('cartOverlay') || document.getElementById('furnCartOverlay');
    if (drawer) {
        drawer.classList.add('active');
        drawer.style.setProperty('transform', 'translateX(0)', 'important');
    }
    if (overlay) {
        overlay.classList.add('active');
        overlay.style.setProperty('opacity', '1', 'important');
        overlay.style.setProperty('pointer-events', 'auto', 'important');
        overlay.style.setProperty('visibility', 'visible', 'important');
    }
}

function closeFurnCartDrawer() {
    var drawer = document.getElementById('cartDrawer') || document.getElementById('furnCartDrawer');
    var overlay = document.getElementById('cartOverlay') || document.getElementById('furnCartOverlay');
    if (drawer) {
        drawer.classList.remove('active');
        drawer.style.setProperty('transform', 'translateX(-100%)', 'important');
    }
    if (overlay) {
        overlay.classList.remove('active');
        overlay.style.setProperty('opacity', '0', 'important');
        overlay.style.setProperty('pointer-events', 'none', 'important');
        overlay.style.setProperty('visibility', 'hidden', 'important');
    }
}

// Aliases
function proceedFurnWhatsAppCheckout() {
    proceedFurnCheckout();
}
 catch(e) {}

    var totalSum = 0;
    var text = "مرحباً، أود إتمام طلب الأثاث التالي من متجر *موبيليار هوم للأثاث*:\n\n";

    furnCart.forEach(function(item, idx) {
        var itemTotal = item.price * item.qty;
        totalSum += itemTotal;
        text += (idx + 1) + ". *" + item.name + "*\n";
        text += "   - الكمية: " + item.qty + " قطع\n";
        text += "   - السعر: " + Number(itemTotal).toLocaleString('en-US') + " ر.س\n\n";
    });

    text += "-------------------------\n";
    text += "💰 *الإجمالي المقدر:* " + Number(totalSum).toLocaleString('en-US') + " ر.س\n";
    text += "🚚 *التوصيل والتركيب:* مجاني لكافة مناطق المملكة\n";
    text += "🛡️ *الضمان:* 10 سنوات على الهياكل الخشبية\n\n";
    text += "الرجاء تأكيد توافر القطع وموعد التوصيل.";

    var encoded = encodeURIComponent(text);
    var waUrl = "https://wa.me/" + waPhone + "?text=" + encoded;
    window.open(waUrl, '_blank');
}

// Toast Notification
function showFurnToast(msg) {
    var toast = document.getElementById('furnToast') || document.getElementById('toastNotification');
    var toastMsg = document.getElementById('furnToastMsg') || document.getElementById('toastMessage');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'furnToast';
        toast.className = 'pc-toast';
        toast.style.cssText = 'position:fixed; bottom:25px; left:25px; background:#1F2421; color:#fff; padding:12px 22px; border-radius:12px; font-weight:700; font-size:13.5px; z-index:99999; display:flex; align-items:center; gap:10px; box-shadow:0 8px 24px rgba(0,0,0,0.2); transition:all 0.3s; transform:translateY(100px); opacity:0;';
        toast.innerHTML = '<i class="fa-solid fa-circle-check" style="color:#D4A373;"></i><span id="furnToastMsg"></span>';
        document.body.appendChild(toast);
        toastMsg = document.getElementById('furnToastMsg');
    }
    if (toastMsg) toastMsg.textContent = msg;
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';

    setTimeout(function() {
        toast.style.transform = 'translateY(100px)';
        toast.style.opacity = '0';
    }, 3200);
}

// Hero Slider Functions
var currentFurnSlide = 0;
var totalFurnSlides = 3;
var furnSliderInterval = null;

function showFurnSlide(idx) {
    var slides = document.querySelectorAll('.hero-slide');
    var dots = document.querySelectorAll('.slider-dot, .furn-slider-dot');
    if (slides.length === 0) return;

    if (idx >= slides.length) idx = 0;
    if (idx < 0) idx = slides.length - 1;
    currentFurnSlide = idx;

    for (var i = 0; i < slides.length; i++) {
        var s = slides[i];
        if (i === currentFurnSlide) {
            s.classList.add('active');
            s.style.setProperty('opacity', '1', 'important');
            s.style.setProperty('visibility', 'visible', 'important');
            s.style.setProperty('pointer-events', 'auto', 'important');
            s.style.setProperty('z-index', '2', 'important');
        } else {
            s.classList.remove('active');
            s.style.setProperty('opacity', '0', 'important');
            s.style.setProperty('visibility', 'hidden', 'important');
            s.style.setProperty('pointer-events', 'none', 'important');
            s.style.setProperty('z-index', '1', 'important');
        }
    }

    for (var j = 0; j < dots.length; j++) {
        var d = dots[j];
        if (j === currentFurnSlide) {
            d.classList.add('active');
            d.style.background = '#B87342';
            d.style.width = '24px';
        } else {
            d.classList.remove('active');
            d.style.background = 'rgba(255,255,255,0.5)';
            d.style.width = '8px';
        }
    }
}

function nextFurnSlide() {
    showFurnSlide(currentFurnSlide + 1);
}

function prevFurnSlide() {
    showFurnSlide(currentFurnSlide - 1);
}

function startFurnSlider() {
    stopFurnSlider();
    furnSliderInterval = setInterval(function() {
        nextFurnSlide();
    }, 5500);
}

function stopFurnSlider() {
    if (furnSliderInterval) clearInterval(furnSliderInterval);
}

// Apply Live CMS Updates from LocalStorage
function applyLiveFurnitureData() {
    try {
        var raw = localStorage.getItem('mobiliar_store_data');
        if (!raw) return;
        var data = JSON.parse(raw);

        // Store info
        if (data.storeInfo) {
            var info = data.storeInfo;
            var topText = document.querySelector('.furn-topbar-text span');
            if (topText && info.topbarAnnouncement) topText.textContent = info.topbarAnnouncement;

            var waLink = document.querySelector('.furn-floating-whatsapp');
            if (waLink && info.whatsappFormatted) waLink.href = 'https://wa.me/' + info.whatsappFormatted;
        }

        // Home Page CMS
        if (data.pages && data.pages.home) {
            var h = data.pages.home;
            var heroTitle = document.querySelector('.hero-slide.active .hero-title, .hero-slide:first-child .hero-title');
            if (heroTitle && h.heroTitle) heroTitle.innerHTML = h.heroTitle;

            var heroDesc = document.querySelector('.hero-slide.active .hero-desc, .hero-slide:first-child .hero-desc');
            if (heroDesc && h.heroSubtitle) heroDesc.textContent = h.heroSubtitle;
        }
    } catch(e) {}
}

// Document Ready Initialization
document.addEventListener('DOMContentLoaded', function() {
    loadFurnStoreData();
    updateFurnCartUI();
    updateFurnWishlistUI();
    applyLiveFurnitureData();
    startFurnSlider();
});
