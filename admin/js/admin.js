/**
 * Mobiliar Home Furniture - Comprehensive CMS Admin Engine
 * Version 3.0
 */

let storeData = null;

// File Upload to Base64 Helper
function handleFileToInput(fileInput, targetInputId, previewImgId) {
  if (!fileInput.files || !fileInput.files[0]) return;
  const file = fileInput.files[0];
  
  if (file.size > 2 * 1024 * 1024) {
    alert('تنبيه: حجم الصورة كبير نسبياً (أكثر من 2 ميجابايت). يُفضل اختيار صورة محسنة للويب.');
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const base64 = e.target.result;
    document.getElementById(targetInputId).value = base64;
    if (previewImgId) {
      document.getElementById(previewImgId).src = base64;
    }
  };
  reader.readAsDataURL(file);
}

// 1. DATA INITIALIZATION & LOADING
async function loadStoreData() {
  const local = localStorage.getItem('mobiliar_store_data');
  if (local) {
    try {
      storeData = JSON.parse(local);
    } catch (e) {
      console.error('Error parsing local storage:', e);
    }
  }

  if (!storeData) {
    try {
      const res = await fetch('../data/products.json?v=' + Date.now());
      storeData = await res.json();
    } catch (e) {
      console.error('Error fetching products.json:', e);
    }
  }

  if (!storeData) {
    storeData = { storeInfo: {}, categories: [], products: [], pages: {} };
  }
}

// 2. AUTHENTICATION CONTROLLER
function checkAuth() {
  const authed = sessionStorage.getItem('mobiliar_admin_authed');
  const authScreen = document.getElementById('authScreen');
  if (authed === 'true') {
    authScreen.style.display = 'none';
    initAdminUI();
  } else {
    authScreen.style.display = 'flex';
  }
}

function handleAuth(e) {
  e.preventDefault();
  const pin = document.getElementById('pinInput').value.trim();
  const validPin = (storeData && storeData.storeInfo && storeData.storeInfo.adminPin) ? storeData.storeInfo.adminPin : '1234';
  
  if (pin === validPin) {
    sessionStorage.setItem('mobiliar_admin_authed', 'true');
    document.getElementById('authScreen').style.display = 'none';
    initAdminUI();
  } else {
    const err = document.getElementById('authError');
    err.style.display = 'block';
    document.getElementById('pinInput').value = '';
    setTimeout(() => { err.style.display = 'none'; }, 4000);
  }
}

function logoutAdmin() {
  sessionStorage.removeItem('mobiliar_admin_authed');
  window.location.reload();
}

// 3. UI INITIALIZATION & TAB SWITCHING
function initAdminUI() {
  populateProductsCategoryFilter();
  renderProductsTable();
  renderCategoriesGrid();
  populateAllCMSForms();
  populateSettingsForm();
  renderOrdersTable();
}

function switchMainTab(tabId, btn) {
  document.querySelectorAll('.tab-pane').forEach(p => p.style.display = 'none');
  const target = document.getElementById(tabId);
  if (target) target.style.display = 'block';

  document.querySelectorAll('.admin-sidebar .menu-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const titles = {
    productsTab: 'إدارة قطع الأثاث والمنتجات',
    categoriesTab: 'الأقسام والبانرات العريضة',
    cmsTab: 'إدارة محتوى كافة الصفحات',
    ordersTab: 'سجل طلبات الواتساب',
    settingsTab: 'إعدادات المتجر العامة',
    backupTab: 'النسخ الاحتياطي والبيانات'
  };
  document.getElementById('currentSectionTitle').textContent = titles[tabId] || 'لوحة التحكم';
}

function switchCmsSubTab(subPaneId, btn) {
  document.querySelectorAll('.cms-sub-pane').forEach(p => p.style.display = 'none');
  const target = document.getElementById(subPaneId);
  if (target) target.style.display = 'block';

  document.querySelectorAll('.cms-tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
}

// 4. PRODUCTS MANAGEMENT
function populateProductsCategoryFilter() {
  const select = document.getElementById('adminProdCatFilter');
  const modalSelect = document.getElementById('modalProdCat');
  
  const cats = storeData.categories || [];
  
  select.innerHTML = '<option value="all">كافة الأقسام</option>' + cats.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  modalSelect.innerHTML = cats.filter(c => c.id !== 'all').map(c => `<option value="${c.id}">${c.name}</option>`).join('');
}

function renderProductsTable(filterCat = 'all', searchQuery = '') {
  const tbody = document.getElementById('adminProductsTableBody');
  let products = storeData.products || [];

  if (filterCat !== 'all') {
    products = products.filter(p => p.category === filterCat);
  }
  if (searchQuery) {
    const q = searchQuery.toLowerCase().trim();
    products = products.filter(p => (p.name && p.name.toLowerCase().includes(q)) || (p.material && p.material.toLowerCase().includes(q)));
  }

  if (products.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:30px; color:#94a3b8;">لا توجد قطع أثاث مطابقة لخيارات البحث.</td></tr>`;
    return;
  }

  tbody.innerHTML = products.map(p => {
    return `
      <tr>
        <td>
          <img src="${p.image}" alt="${p.name}" style="width:52px; height:52px; object-fit:cover; border-radius:10px; border:1px solid #ECE7DF;">
        </td>
        <td>
          <div style="font-weight:800; color:#1F2421;">${p.name}</div>
          <span style="font-size:12px; color:#B87342; font-weight:700;">${p.badge || 'متوفر'}</span>
        </td>
        <td><span style="background:#FBF9F6; border:1px solid #ECE7DF; padding:4px 10px; border-radius:30px; font-size:13px; font-weight:700;">${p.categoryName || p.category}</span></td>
        <td style="font-weight:900; color:#B87342;">${p.price.toLocaleString()} ر.س</td>
        <td style="color:#8E9893; text-decoration:line-through;">${p.oldPrice ? (p.oldPrice.toLocaleString() + ' ر.س') : '-'}</td>
        <td style="font-size:13px; color:#575F5B;">${p.material || 'خشب طبيعي'}</td>
        <td>
          <span style="background:#ECFDF5; color:#065F46; border:1px solid #A7F3D0; padding:4px 10px; border-radius:20px; font-size:12px; font-weight:800;">
            متوفر
          </span>
        </td>
        <td>
          <div style="display:flex; gap:8px; justify-content:center;">
            <button onclick="openEditProductModal(${p.id})" class="btn btn-secondary" style="padding:6px 12px; font-size:13px;" title="تعديل">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button onclick="deleteProduct(${p.id})" class="btn btn-danger" style="padding:6px 12px; font-size:13px;" title="حذف">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function filterAdminProducts() {
  const cat = document.getElementById('adminProdCatFilter').value;
  const q = document.getElementById('adminProdSearch').value;
  renderProductsTable(cat, q);
}

function openAddProductModal() {
  document.getElementById('productModalTitle').innerHTML = '<i class="fa-solid fa-plus-circle" style="color:var(--primary);"></i> إضافة قطعة أثاث جديدة';
  document.getElementById('modalProdId').value = '';
  document.getElementById('modalProdName').value = '';
  document.getElementById('modalProdBadge').value = 'جديد';
  document.getElementById('modalProdPrice').value = '';
  document.getElementById('modalProdOldPrice').value = '';
  document.getElementById('modalProdMaterial').value = '';
  document.getElementById('modalProdDimensions').value = '';
  document.getElementById('modalProdImg').value = 'images/furn_prod_sofa.jpg';
  document.getElementById('modalProdImgPreview').src = '../images/furn_prod_sofa.jpg';
  document.getElementById('modalProdSpecs').value = '';
  document.getElementById('modalProdDesc').value = '';
  document.getElementById('productModal').classList.add('active');
}

function openEditProductModal(id) {
  const p = storeData.products.find(x => x.id === id);
  if (!p) return;

  document.getElementById('productModalTitle').innerHTML = '<i class="fa-solid fa-pen-to-square" style="color:var(--primary);"></i> تعديل قطعة الأثاث';
  document.getElementById('modalProdId').value = p.id;
  document.getElementById('modalProdName').value = p.name;
  document.getElementById('modalProdCat').value = p.category;
  document.getElementById('modalProdBadge').value = p.badge || '';
  document.getElementById('modalProdPrice').value = p.price;
  document.getElementById('modalProdOldPrice').value = p.oldPrice || '';
  document.getElementById('modalProdMaterial').value = p.material || '';
  document.getElementById('modalProdDimensions').value = p.dimensions || '';
  document.getElementById('modalProdImg').value = p.image;
  document.getElementById('modalProdImgPreview').src = p.image.startsWith('data:') ? p.image : ('../' + p.image);
  document.getElementById('modalProdSpecs').value = Array.isArray(p.specs) ? p.specs.join(', ') : (p.specs || '');
  document.getElementById('modalProdDesc').value = p.description || '';

  document.getElementById('productModal').classList.add('active');
}

function closeProductModal() {
  document.getElementById('productModal').classList.remove('active');
}

function handleSaveProduct(e) {
  e.preventDefault();
  const id = document.getElementById('modalProdId').value;
  const name = document.getElementById('modalProdName').value.trim();
  const category = document.getElementById('modalProdCat').value;
  const catObj = storeData.categories.find(c => c.id === category);
  const categoryName = catObj ? catObj.name : 'أثاث منزلي';
  const badge = document.getElementById('modalProdBadge').value.trim();
  const price = parseFloat(document.getElementById('modalProdPrice').value);
  const oldPrice = parseFloat(document.getElementById('modalProdOldPrice').value) || null;
  const material = document.getElementById('modalProdMaterial').value.trim();
  const dimensions = document.getElementById('modalProdDimensions').value.trim();
  const image = document.getElementById('modalProdImg').value.trim();
  const specsRaw = document.getElementById('modalProdSpecs').value.trim();
  const specs = specsRaw ? specsRaw.split(',').map(s => s.trim()) : [];
  const description = document.getElementById('modalProdDesc').value.trim();

  if (id) {
    // Edit existing
    const idx = storeData.products.findIndex(p => p.id == id);
    if (idx !== -1) {
      storeData.products[idx] = {
        ...storeData.products[idx],
        name, title: name, category, categoryName, badge, price, oldPrice, material, dimensions, image, specs, description
      };
    }
  } else {
    // Add new
    const newId = storeData.products.length ? Math.max(...storeData.products.map(p => p.id)) + 1 : 1;
    storeData.products.unshift({
      id: newId,
      name, title: name, category, categoryName, badge, price, oldPrice, material, dimensions, image, specs, description,
      rating: 5, inStock: true
    });
  }

  saveDataToStorage();
  renderProductsTable();
  closeProductModal();
  showAdminToast('تم حفظ قطعة الأثاث بنجاح وتحديث الكتالوج!');
}

function deleteProduct(id) {
  if (!confirm('هل أنت متأكد من رغبتك في حذف هذه القطعة من المتجر نهائياً؟')) return;
  storeData.products = storeData.products.filter(p => p.id !== id);
  saveDataToStorage();
  renderProductsTable();
  showAdminToast('تم حذف القطعة بنجاح.');
}

// 5. CATEGORIES & WIDE BANNERS
function renderCategoriesGrid() {
  const container = document.getElementById('adminCategoriesList');
  const cats = storeData.categories || [];

  container.innerHTML = cats.map(c => `
    <div style="background:#ffffff; border:1px solid var(--border); border-radius:20px; padding:24px; box-shadow:0 4px 18px rgba(0,0,0,0.03);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
        <div style="display:flex; align-items:center; gap:10px;">
          <div style="width:40px; height:40px; background:#B87342; border-radius:10px; display:flex; align-items:center; justify-content:center; color:#fff;">
            <i class="fa-solid ${c.icon || 'fa-couch'}"></i>
          </div>
          <div>
            <h4 style="font-weight:900; color:#1F2421; font-size:16px;">${c.name}</h4>
            <span style="font-size:12px; color:#8E9893;">المعرف: ${c.id}</span>
          </div>
        </div>
        <button onclick="openEditCategoryModal('${c.id}')" class="btn btn-secondary" style="padding:6px 14px; font-size:13px;">
          <i class="fa-solid fa-pen"></i> تعديل البانر
        </button>
      </div>

      <div class="cat-banner-preview-box">
        <img src="${c.banner.startsWith('data:') ? c.banner : ('../' + c.banner)}" alt="${c.name}">
      </div>

      <div style="margin-top:14px;">
        <strong style="font-size:14px; color:#1F2421; display:block; margin-bottom:4px;">${c.title || c.name}</strong>
        <p style="font-size:13px; color:#6C7570; line-height:1.6; margin:0;">${c.description || ''}</p>
      </div>
    </div>
  `).join('');
}

function openEditCategoryModal(catId) {
  const c = storeData.categories.find(x => x.id === catId);
  if (!c) return;

  document.getElementById('modalCatId').value = c.id;
  document.getElementById('modalCatName').value = c.name;
  document.getElementById('modalCatTitle').value = c.title || '';
  document.getElementById('modalCatDesc').value = c.description || '';
  document.getElementById('modalCatBanner').value = c.banner;
  document.getElementById('modalCatBannerPreview').src = c.banner.startsWith('data:') ? c.banner : ('../' + c.banner);

  document.getElementById('categoryModal').classList.add('active');
}

function closeCategoryModal() {
  document.getElementById('categoryModal').classList.remove('active');
}

function handleSaveCategory(e) {
  e.preventDefault();
  const id = document.getElementById('modalCatId').value;
  const name = document.getElementById('modalCatName').value.trim();
  const title = document.getElementById('modalCatTitle').value.trim();
  const description = document.getElementById('modalCatDesc').value.trim();
  const banner = document.getElementById('modalCatBanner').value.trim();

  const idx = storeData.categories.findIndex(c => c.id === id);
  if (idx !== -1) {
    storeData.categories[idx] = { ...storeData.categories[idx], name, title, description, banner };
  }

  saveDataToStorage();
  renderCategoriesGrid();
  closeCategoryModal();
  showAdminToast('تم تحديث بانر القسم العريض بنجاح!');
}

// 6. CMS CONTENT FORMS POPULATION & SAVING
function populateAllCMSForms() {
  const info = storeData.storeInfo || {};
  const pages = storeData.pages || {};
  const home = pages.home || {};
  const about = pages.about || {};
  const contact = pages.contact || {};

  // Topbar
  document.getElementById('cmsTopbarAnnouncement').value = info.topbarAnnouncement || 'عروض موبيليار الكبرى للأثاث المنزلي: شحن وتركيب مجاني لكافة مدن المملكة + ضمان 10 سنوات على الهياكل الخشبية!';
  document.getElementById('cmsTopbarPhone').value = info.phone || '01027093535';

  // Slider Slides
  document.getElementById('cmsSlide1Title').value = home.heroTitle || 'أناقة البساطة الإسكندنافية لغرفة معيشة تنبض بالحياة';
  document.getElementById('cmsSlide1Desc').value = home.heroSubtitle || 'قطع أثاث حصرية صممت لتجمع بين فخامة الخشب الطبيعي وراحة الأقمشة العصرية.';
  document.getElementById('cmsSlide1Img').value = home.heroImage || 'images/furn_hero_slide1.jpg';
  document.getElementById('cmsSlide1Preview').src = (home.heroImage && home.heroImage.startsWith('data:')) ? home.heroImage : ('../' + (home.heroImage || 'images/furn_hero_slide1.jpg'));

  document.getElementById('cmsSlide2Title').value = home.heroTitle2 || 'أجنحة غرف النوم الفندقية بتفاصيل هادئة ومريحة';
  document.getElementById('cmsSlide2Desc').value = home.heroSubtitle2 || 'أسرّة كينج من خشب البلوط الأمريكي الصلب مع نوابض داعمة ومراتب سحابية.';
  document.getElementById('cmsSlide2Img').value = home.heroImage2 || 'images/furn_hero_slide2.jpg';
  document.getElementById('cmsSlide2Preview').src = (home.heroImage2 && home.heroImage2.startsWith('data:')) ? home.heroImage2 : ('../' + (home.heroImage2 || 'images/furn_hero_slide2.jpg'));

  document.getElementById('cmsSlide3Title').value = home.heroTitle3 || 'طاولات طعام فاخرة تجمع العائلة بأرقى تفاصيل الضيافة';
  document.getElementById('cmsSlide3Desc').value = home.heroSubtitle3 || 'أسطح رخامية مقاومة للحرارة وقواعد خشب جوز إيطالي تمنح صالة الطعام سحراً خاصاً.';
  document.getElementById('cmsSlide3Img').value = home.heroImage3 || 'images/furn_hero_slide3.jpg';
  document.getElementById('cmsSlide3Preview').src = (home.heroImage3 && home.heroImage3.startsWith('data:')) ? home.heroImage3 : ('../' + (home.heroImage3 || 'images/furn_hero_slide3.jpg'));

  // Strip Parallax
  document.getElementById('cmsStripTitle').value = home.stripTitle || 'تأثيث متكامل للفلل والمنازل الجديدة مع استشارة مجانية';
  document.getElementById('cmsStripDesc').value = home.stripDesc || 'احصل على باقة الخصم الخاصة بتأثيث المنزل بالكامل مع توصيل وتركيب فندقي بضمان 10 سنوات.';
  document.getElementById('cmsStripImg').value = home.stripImage || 'images/furn_parallax_strip.jpg';
  document.getElementById('cmsStripPreview').src = (home.stripImage && home.stripImage.startsWith('data:')) ? home.stripImage : ('../' + (home.stripImage || 'images/furn_parallax_strip.jpg'));

  // Product page defaults
  document.getElementById('cmsProdWarrantyDesc').value = pages.productWarranty || 'تلتزم شركة موبيليار هوم بضمان استثنائي يمتد لـ 10 سنوات يشمل الهياكل الخشبية، الوصلات المعدنية، ونوابض الجيب ضد أي عيوب تصنيع أو هبوط غير طبيعي.';
  document.getElementById('cmsProdDeliveryDesc').value = pages.productDelivery || 'يصلكم فريقنا الفني المتكامل أينما كنتم في الرياض، جدة، الدمام، وكافة مدن المملكة. نقوم بحمل الأثاث، فكه وتركيبه باحترافية، وإزالة كافة مخلفات التغليف.';

  // About page
  document.getElementById('cmsAboutTitle').value = about.title || 'البساطة الإسكندنافية بحرفية الأخشاب الفاخرة';
  document.getElementById('cmsAboutSub').value = about.subtitle || 'نحن لا نصنع مجرد أثاث، بل نخلق بيئة مفعمة بالسكينة والدفء تمنح منزلك طابعاً معمارياً استثنائياً.';
  document.getElementById('cmsAboutStory').value = about.content || 'في موبيليار هوم، نؤمن بأن الأثاث ليس مجرد قطع خشبية تزين الغرف، بل هو روح المنزل والمسرح اليومي لذكريات العائلة.';

  // Contact page
  document.getElementById('cmsContactAddressRiyadh').value = contact.address || 'طريق الملك فهد، حي العليا - الرياض';
  document.getElementById('cmsContactPhone').value = contact.phone || '01027093535';
  document.getElementById('cmsContactWA').value = contact.whatsapp || '+201027093535';
  document.getElementById('cmsContactHours').value = contact.hours || 'يومياً من 9:00 صباحاً حتى 11:00 مساءً';
}

function saveHomePageCMS() {
  if (!storeData.storeInfo) storeData.storeInfo = {};
  if (!storeData.pages) storeData.pages = {};
  if (!storeData.pages.home) storeData.pages.home = {};

  storeData.storeInfo.topbarAnnouncement = document.getElementById('cmsTopbarAnnouncement').value.trim();
  storeData.storeInfo.phone = document.getElementById('cmsTopbarPhone').value.trim();

  storeData.pages.home.heroTitle = document.getElementById('cmsSlide1Title').value.trim();
  storeData.pages.home.heroSubtitle = document.getElementById('cmsSlide1Desc').value.trim();
  storeData.pages.home.heroImage = document.getElementById('cmsSlide1Img').value.trim();

  storeData.pages.home.heroTitle2 = document.getElementById('cmsSlide2Title').value.trim();
  storeData.pages.home.heroSubtitle2 = document.getElementById('cmsSlide2Desc').value.trim();
  storeData.pages.home.heroImage2 = document.getElementById('cmsSlide2Img').value.trim();

  storeData.pages.home.heroTitle3 = document.getElementById('cmsSlide3Title').value.trim();
  storeData.pages.home.heroSubtitle3 = document.getElementById('cmsSlide3Desc').value.trim();
  storeData.pages.home.heroImage3 = document.getElementById('cmsSlide3Img').value.trim();

  storeData.pages.home.stripTitle = document.getElementById('cmsStripTitle').value.trim();
  storeData.pages.home.stripDesc = document.getElementById('cmsStripDesc').value.trim();
  storeData.pages.home.stripImage = document.getElementById('cmsStripImg').value.trim();

  saveDataToStorage();
  showAdminToast('تم حفظ تعديلات الصفحة الرئيسية بنجاح!');
}

function saveProductPageCMS() {
  if (!storeData.pages) storeData.pages = {};
  storeData.pages.productWarranty = document.getElementById('cmsProdWarrantyDesc').value.trim();
  storeData.pages.productDelivery = document.getElementById('cmsProdDeliveryDesc').value.trim();
  saveDataToStorage();
  showAdminToast('تم حفظ إعدادات وثيقة الضمان والشحن لصفحة المنتج!');
}

function saveAboutPageCMS() {
  if (!storeData.pages) storeData.pages = {};
  if (!storeData.pages.about) storeData.pages.about = {};
  storeData.pages.about.title = document.getElementById('cmsAboutTitle').value.trim();
  storeData.pages.about.subtitle = document.getElementById('cmsAboutSub').value.trim();
  storeData.pages.about.content = document.getElementById('cmsAboutStory').value.trim();
  saveDataToStorage();
  showAdminToast('تم حفظ تعديلات صفحة من نحن!');
}

function saveContactPageCMS() {
  if (!storeData.pages) storeData.pages = {};
  if (!storeData.pages.contact) storeData.pages.contact = {};
  storeData.pages.contact.address = document.getElementById('cmsContactAddressRiyadh').value.trim();
  storeData.pages.contact.phone = document.getElementById('cmsContactPhone').value.trim();
  storeData.pages.contact.whatsapp = document.getElementById('cmsContactWA').value.trim();
  storeData.pages.contact.hours = document.getElementById('cmsContactHours').value.trim();
  saveDataToStorage();
  showAdminToast('تم حفظ بيانات التواصل والفروع!');
}

// 7. STORE SETTINGS
function populateSettingsForm() {
  const info = storeData.storeInfo || {};
  document.getElementById('settingStoreName').value = info.name || 'موبيليار هوم للأثاث';
  document.getElementById('settingStoreNameEn').value = info.nameEn || 'MOBILIAR HOME FURNITURE';
  document.getElementById('settingStoreWA').value = info.whatsappFormatted || '201027093535';
  document.getElementById('settingAdminPin').value = info.adminPin || '1234';
}

function saveStoreSettings() {
  if (!storeData.storeInfo) storeData.storeInfo = {};
  storeData.storeInfo.name = document.getElementById('settingStoreName').value.trim();
  storeData.storeInfo.nameEn = document.getElementById('settingStoreNameEn').value.trim();
  storeData.storeInfo.whatsappFormatted = document.getElementById('settingStoreWA').value.trim();
  storeData.storeInfo.adminPin = document.getElementById('settingAdminPin').value.trim() || '1234';
  saveDataToStorage();
  showAdminToast('تم حفظ إعدادات المتجر العامة بنجاح!');
}

// 8. ORDERS LOG
function renderOrdersTable() {
  const tbody = document.getElementById('adminOrdersTableBody');
  const orders = JSON.parse(localStorage.getItem('mobiliar_orders_log') || '[]');

  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:30px; color:#94a3b8;">لا توجد طلبات مسجلة حتى الآن. عند قيام العميل بالطلب عبر واتساب، سيتم تسجيله هنا تلقائياً.</td></tr>`;
    return;
  }

  tbody.innerHTML = orders.map(o => `
    <tr>
      <td>${o.date || new Date().toLocaleDateString('ar-SA')}</td>
      <td><strong>${o.itemsSummary || o.itemsCount + ' قطع أثاث'}</strong></td>
      <td style="font-weight:900; color:var(--primary);">${(o.total || 0).toLocaleString()} ر.س</td>
      <td><span style="background:#ECFDF5; color:#065F46; border:1px solid #A7F3D0; padding:4px 10px; border-radius:20px; font-size:12px; font-weight:800;">تم التوجيه للواتساب</span></td>
    </tr>
  `).join('');
}

function clearOrdersLog() {
  if (!confirm('هل أنت متأكد من مسح سجل طلبات الواتساب بالكامل؟')) return;
  localStorage.removeItem('mobiliar_orders_log');
  renderOrdersTable();
  showAdminToast('تم مسح سجل الطلبات.');
}

// 9. BACKUP & RESTORE
function exportStoreBackup() {
  const jsonStr = JSON.stringify(storeData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mobiliar_furniture_backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showAdminToast('تم تحميل ملف النسخة الاحتياطية بنجاح!');
}

function importStoreBackup(input) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (data.products && data.categories) {
        storeData = data;
        saveDataToStorage();
        initAdminUI();
        showAdminToast('تم استيراد النسخة الاحتياطية وتحديث بيانات المتجر بنجاح!');
      } else {
        alert('الملف المحدد غير صالح أو لا يحتوي على بنية بيانات المتجر المطلوبة.');
      }
    } catch (err) {
      alert('حدث خطأ أثناء قراءة ملف JSON: ' + err.message);
    }
  };
  reader.readAsText(file);
}

function resetStoreToDefault() {
  if (!confirm('تحذير: سيتم حذف كافة التعديلات المخصصة والعودة لبيانات المصنع الافتراضية. هل تود الاستمرار؟')) return;
  localStorage.removeItem('mobiliar_store_data');
  window.location.reload();
}

// 10. HELPERS
function saveDataToStorage() {
  localStorage.setItem('mobiliar_store_data', JSON.stringify(storeData));
}

function showAdminToast(msg) {
  const toast = document.getElementById('adminToast');
  const msgEl = document.getElementById('adminToastMsg');
  msgEl.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => { toast.classList.remove('show'); }, 3500);
}

// Initialize on Load
document.addEventListener('DOMContentLoaded', async () => {
  await loadStoreData();
  checkAuth();
});
