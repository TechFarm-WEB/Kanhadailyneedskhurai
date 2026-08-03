/**
 * KANHA DAIRY - FRONTEND INTERACTION & STATE CONTROLLER
 */

// 1. MOTHER DAIRY CATALOGUE DATA
const priceList = [
  { id: "P1", name: "Mother Dairy Gold Milk", size: "6 L", price: 66.0 },
  { id: "P2", name: "Mother Dairy Gold Milk", size: "1 L", price: 68.0 },
  { id: "P3", name: "Mother Dairy Gold Milk", size: "500 ml", price: 34.0 },
  { id: "P4", name: "Mother Dairy Super T Milk", size: "1 L", price: 59.0 },
  { id: "P5", name: "Mother Dairy Super T Milk", size: "1 L", price: 56.0 },
  { id: "P6", name: "Mother Dairy TM Milk", size: "500 ml", price: 27.5 },
  { id: "P7", name: "Mother Dairy Milk", size: "320 ml", price: 18.0 },
  { id: "P8", name: "Mother Dairy Bacha Doodh", size: "170 ml", price: 7.5 },
  { id: "P9", name: "Mother Dairy Saada Mattha", size: "500 ml", price: 13.5 },
  { id: "P10", name: "Mother Dairy Masala Mattha", size: "500 ml", price: 9.0 },
  { id: "P11", name: "Mother Dairy Dahi Cup", size: "80 g", price: 8.5 },
  { id: "P12", name: "Mother Dairy Dahi Cup", size: "200 g", price: 22.0 },
  { id: "P13", name: "Mother Dairy Dahi Matki", size: "5 kg", price: 370.0 },
];

// 2. APPLICATION CENTRAL STATE
const state = {
  drivers: [
    {
      id: "D1",
      name: "Ramesh Kumar (Route 4)",
      allocated: 150,
      sold: 45,
      remaining: 105,
      dues: 1200,
      location: "28.6139° N, 77.2090° E",
    },
    {
      id: "D2",
      name: "Suresh Singh (Route 2)",
      allocated: 200,
      sold: 110,
      remaining: 90,
      dues: 0,
      location: "28.5355° N, 77.3910° E",
    },
    {
      id: "D3",
      name: "Vikram Sharma (Route 1)",
      allocated: 120,
      sold: 80,
      remaining: 40,
      dues: 450,
      location: "28.7041° N, 77.1025° E",
    },
    {
      id: "D4",
      name: "Amit Patel (Route 5)",
      allocated: 180,
      sold: 150,
      remaining: 30,
      dues: 800,
      location: "28.4595° N, 77.0266° E",
    },
    {
      id: "D5",
      name: "Rajesh Verma (Route 3)",
      allocated: 100,
      sold: 60,
      remaining: 40,
      dues: 1750,
      location: "28.4089° N, 77.3178° E",
    },
  ],
  customers: [
    {
      id: "C1",
      name: "Anil Verma (A-101)",
      phone: "9876543210",
      partner: "Ramesh Kumar (Route 4)",
      purchases: "₹3,400",
      dues: 1200,
    },
    {
      id: "C2",
      name: "Sunita Gupta (B-205)",
      phone: "9811223344",
      partner: "Suresh Singh (Route 2)",
      purchases: "₹5,100",
      dues: 0,
    },
    {
      id: "C3",
      name: "Rajesh Sharma (C-402)",
      phone: "9900112233",
      partner: "Vikram Sharma (Route 1)",
      purchases: "₹1,800",
      dues: 450,
    },
    {
      id: "C4",
      name: "Pooja Mehta (D-304)",
      phone: "9711445566",
      partner: "Amit Patel (Route 5)",
      purchases: "₹4,200",
      dues: 800,
    },
    {
      id: "C5",
      name: "Karan Johar (E-102)",
      phone: "9655443322",
      partner: "Rajesh Verma (Route 3)",
      purchases: "₹2,900",
      dues: 1750,
    },
  ],
  activeSelectedDriverId: "D1",
  currentPaymentType: "QR",
};

// 3. INITIALIZATION ON DOM LOAD
document.addEventListener("DOMContentLoaded", () => {
  renderDashboard();
  setupRefreshButton();
  setupDefaultDueDate();
});

function setupDefaultDueDate() {
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const dateStr = nextWeek.toISOString().split("T")[0];
  const dateInput = document.getElementById("posDueDate");
  if (dateInput) dateInput.value = dateStr;
}

// MAIN DASHBOARD RENDERER
function renderDashboard() {
  renderPartnersTable();
  renderCustomerTable();
  populatePosDropdowns();
  renderDriverPills();
  renderSelectedDriverDetail();
  updateSummaryMetrics();
}

function updateSummaryMetrics() {
  const totalAllocated = state.drivers.reduce((acc, d) => acc + d.allocated, 0);
  const totalDues = state.customers.reduce((acc, c) => acc + c.dues, 0);

  document.getElementById("dispDriverStock").textContent =
    `${totalAllocated} Units`;
  document.getElementById("dispPendingDues").textContent =
    `₹${totalDues.toLocaleString()}`;
}

// TAB NAVIGATION SWITCHER
function switchTab(tabId) {
  document
    .querySelectorAll(".tab-content")
    .forEach((el) => el.classList.remove("active"));
  document
    .querySelectorAll(".nav-btn")
    .forEach((el) => el.classList.remove("active"));

  document.getElementById(`view-${tabId}`).classList.add("active");
  if (tabId === "main-office")
    document.getElementById("tabMainOffice").classList.add("active");
  if (tabId === "delivery-partner")
    document.getElementById("tabDeliveryPartner").classList.add("active");
  if (tabId === "customers-panel")
    document.getElementById("tabCustomers").classList.add("active");
}

// RENDER DRIVERS TABLE IN MAIN OFFICE
function renderPartnersTable() {
  const tbody = document.getElementById("partnerTableBody");
  tbody.innerHTML = state.drivers
    .map(
      (d) => `
        <tr>
            <td><strong>${d.name}</strong></td>
            <td>${d.allocated} Pkts</td>
            <td>${d.sold} Pkts</td>
            <td>${d.remaining} Pkts</td>
            <td>
                <span class="${d.dues > 0 ? "badge-due" : "badge-zero"}">
                    ₹${d.dues}
                </span>
            </td>
            <td>
                <button class="btn btn-primary" onclick="trackLocation('${d.name}', '${d.location}')">
                    <i class="fa-solid fa-location-crosshairs"></i> Track GPS
                </button>
            </td>
        </tr>
    `,
    )
    .join("");
}

// RENDER CUSTOMERS DATABASE TABLE
function renderCustomerTable() {
  const tbody = document.getElementById("customerTableBody");
  tbody.innerHTML = state.customers
    .map(
      (c) => `
        <tr>
            <td><strong>${c.name}</strong></td>
            <td>${c.phone}</td>
            <td>${c.partner}</td>
            <td>${c.purchases}</td>
            <td><span class="${c.dues > 0 ? "badge-due" : "badge-zero"}">₹${c.dues}</span></td>
            <td>
                <button class="btn btn-secondary" onclick="openViewModal('Customer Order History', 'Fetching record details for ${c.name}...')">
                    <i class="fa-solid fa-eye"></i> History
                </button>
            </td>
        </tr>
    `,
    )
    .join("");
}

// POPULATE POS SELECTION DROPDOWNS
function populatePosDropdowns() {
  const pSelect = document.getElementById("posPartnerSelect");
  pSelect.innerHTML = state.drivers
    .map((d) => `<option value="${d.id}">${d.name}</option>`)
    .join("");

  const cSelect = document.getElementById("posCustomerSelect");
  cSelect.innerHTML = state.customers
    .map((c) => `<option value="${c.id}">${c.name} (${c.phone})</option>`)
    .join("");

  const prodSelect = document.getElementById("posProductSelect");
  prodSelect.innerHTML = priceList
    .map(
      (p) =>
        `<option value="${p.price}" data-name="${p.name}" data-size="${p.size}">${p.name} (${p.size}) - ₹${p.price}</option>`,
    )
    .join("");
}

// RENDER DRIVER SELECTION PILLS
function renderDriverPills() {
  const container = document.getElementById("driverPillsContainer");
  container.innerHTML = state.drivers
    .map(
      (d) => `
        <div class="partner-pill ${d.id === state.activeSelectedDriverId ? "active" : ""}" onclick="selectDriverPill('${d.id}')">
            ${d.name.split(" ")[0]}
        </div>
    `,
    )
    .join("");
}

function selectDriverPill(driverId) {
  state.activeSelectedDriverId = driverId;
  renderDriverPills();
  renderSelectedDriverDetail();
}

// RENDER DETAILED BREAKDOWN OF SELECTED DRIVER
function renderSelectedDriverDetail() {
  const driver = state.drivers.find(
    (d) => d.id === state.activeSelectedDriverId,
  );
  const driverCustomers = state.customers.filter((c) =>
    c.partner.includes(driver.name.split(" ")[0]),
  );
  const container = document.getElementById("partnerDetailCard");

  container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 12px;">
            <div>
                <h3 style="color: var(--primary-blue); font-size: 1.1rem;">${driver.name}</h3>
                <span style="font-size: 0.78rem; color: var(--success-green); font-weight: 700;"><i class="fa-solid fa-signal"></i> GPS Live Active</span>
            </div>
            <button class="btn btn-primary" onclick="openChooseProductModal('${driver.id}')">
                <i class="fa-solid fa-cart-plus"></i> Choose Product & Allocate
            </button>
        </div>
        
        <div style="display: flex; gap: 14px; background: white; padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); margin-bottom: 14px;">
            <div><span style="font-size: 0.75rem; color: var(--text-muted);">Allocated:</span> <strong>${driver.allocated} Units</strong></div>
            <div><span style="font-size: 0.75rem; color: var(--text-muted);">Sold Milk:</span> <strong>${driver.sold} Units</strong></div>
            <div><span style="font-size: 0.75rem; color: var(--text-muted);">Remained Milk:</span> <strong>${driver.remaining} Units</strong></div>
        </div>

        <h4 style="font-size: 0.88rem; font-weight: 700; margin-bottom: 8px; color: var(--text-muted);">Customers Under This Partner (${driverCustomers.length})</h4>
        <div class="table-responsive">
            <table class="data-table" style="background: white;">
                <thead>
                    <tr>
                        <th>Customer</th>
                        <th>Phone</th>
                        <th>Due Balance</th>
                    </tr>
                </thead>
                <tbody>
                    ${
                      driverCustomers.length > 0
                        ? driverCustomers
                            .map(
                              (c) => `
                        <tr>
                            <td>${c.name}</td>
                            <td>${c.phone}</td>
                            <td><span class="${c.dues > 0 ? "badge-due" : "badge-zero"}">₹${c.dues}</span></td>
                        </tr>
                    `,
                            )
                            .join("")
                        : '<tr><td colspan="3">No assigned customers found.</td></tr>'
                    }
                </tbody>
            </table>
        </div>
    `;
}

// SELECT PAYMENT METHOD & TOGGLE UDHAAR CALENDAR PICKER
function selectPayType(el, type) {
  document
    .querySelectorAll(".pay-option")
    .forEach((opt) => opt.classList.remove("selected"));
  el.classList.add("selected");
  state.currentPaymentType = type;

  const dueDateContainer = document.getElementById("dueDateContainer");
  if (type === "Udhaar") {
    dueDateContainer.classList.remove("hidden");
  } else {
    dueDateContainer.classList.add("hidden");
  }
}

// PROCESS SALE & GENERATE DIRECT WHATSAPP INVOICE
function processQuickSale() {
  const partnerId = document.getElementById("posPartnerSelect").value;
  const customerId = document.getElementById("posCustomerSelect").value;
  const prodSelect = document.getElementById("posProductSelect");
  const qty = parseInt(document.getElementById("posQty").value) || 1;
  const payType = state.currentPaymentType;
  const dueDate = document.getElementById("posDueDate").value;

  const partner = state.drivers.find((d) => d.id === partnerId);
  const customer = state.customers.find((c) => c.id === customerId);

  const selectedOption = prodSelect.options[prodSelect.selectedIndex];
  const prodName = selectedOption.getAttribute("data-name");
  const prodSize = selectedOption.getAttribute("data-size");
  const unitPrice = parseFloat(prodSelect.value);
  const totalAmount = unitPrice * qty;

  if (payType === "Udhaar" && !dueDate) {
    alert("Please select a valid Udhaar Due Date!");
    return;
  }

  // Update Partner and Customer State
  if (partner) {
    partner.sold += qty;
    if (partner.remaining >= qty) partner.remaining -= qty;
  }

  if (payType === "Udhaar" && customer) {
    customer.dues += totalAmount;
  }

  // 1. DYNAMICALLY BUILD ITEMIZATION INVOICE TEXT FOR WHATSAPP
  let message = `*🥛 KANHA DAIRY - OFFICIAL INVOICE 🥛*\n`;
  message += `-----------------------------------\n`;
  message += `👤 *Customer:* ${customer ? customer.name : "Valued Customer"}\n`;
  message += `📦 *Product:* ${prodName} (${prodSize})\n`;
  message += `🔢 *Quantity:* ${qty}\n`;
  message += `💵 *Rate:* ₹${unitPrice.toFixed(2)} / unit\n`;
  message += `💰 *Total Amount:* ₹${totalAmount.toFixed(2)}\n`;
  message += `💳 *Payment Mode:* ${payType}\n`;

  if (payType === "Udhaar") {
    message += `📅 *Udhaar Due Date:* ${dueDate}\n`;
    message += `⚠️ *Note:* Please clear your pending bill before ${dueDate}.\n`;
  }

  message += `-----------------------------------\n`;
  message += `🚚 *Delivery Agent:* ${partner ? partner.name : "Kanha Agent"}\n`;
  message += `🙏 *Thank you for your business!*`;

  // 2. TRIGGER REAL WHATSAPP LINK INTENT
  const encodedMsg = encodeURIComponent(message);
  const rawPhone = customer ? customer.phone.replace(/[^0-9]/g, "") : "";

  // Default to +91 prefix for Indian mobile numbers
  const waUrl =
    rawPhone.length >= 10
      ? `https://wa.me/91${rawPhone}?text=${encodedMsg}`
      : `https://wa.me/?text=${encodedMsg}`;

  // Open WhatsApp Web/App in a new window
  window.open(waUrl, "_blank");

  renderDashboard();
  alert(
    `Quick Sale Processed!\n\nInvoice sent to WhatsApp for ${customer ? customer.name : "Customer"}.`,
  );
}

// ================= MODAL CONTROLLER & INTERACTIONS =================

function openModal(title, contentHtml) {
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalContent").innerHTML = contentHtml;
  document.getElementById("modalOverlay").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modalOverlay").classList.add("hidden");
}

// INWARD MILK ENTRY MODAL WITH AUTOMATED CALCULATION
function openInwardMilkModal() {
  const html = `
        <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 12px;">Specify quantities for incoming Mother Dairy stock:</p>
        <div class="inward-table-header">
            <span>Product Name</span>
            <span>Pack Size</span>
            <span>Rate (₹)</span>
            <span>Qty & Amount</span>
        </div>
        <div style="max-height: 280px; overflow-y: auto; margin-bottom: 14px;">
            ${priceList
              .map(
                (item, idx) => `
                <div class="inward-row">
                    <span><strong>${item.name}</strong></span>
                    <span>${item.size}</span>
                    <span>₹${item.price.toFixed(2)}</span>
                    <div>
                        <input type="number" min="0" value="0" class="qty-input-table" id="inwardQty_${idx}" onchange="calculateInwardTotal()">
                    </div>
                </div>
            `,
              )
              .join("")}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; background: #EBF5FF; padding: 12px; border-radius: 8px; margin-bottom: 14px;">
            <span style="font-size: 0.9rem; font-weight: 700; color: var(--primary-blue);">Calculated Total Amount:</span>
            <strong id="inwardTotalDisplay" style="font-size: 1.2rem; color: var(--primary-blue);">₹0.00</strong>
        </div>

        <div style="display: flex; gap: 10px;">
            <button class="btn btn-primary btn-block" onclick="saveInwardStockEntry()"><i class="fa-solid fa-floppy-disk"></i> Save Stock Entry</button>
            <button class="btn btn-secondary" onclick="closeModal()">Close</button>
        </div>
    `;
  openModal("Inward Milk Entry (Stock Arrival)", html);
}

function calculateInwardTotal() {
  let total = 0;
  priceList.forEach((item, idx) => {
    const qtyVal =
      parseInt(document.getElementById(`inwardQty_${idx}`)?.value) || 0;
    total += qtyVal * item.price;
  });
  document.getElementById("inwardTotalDisplay").textContent =
    `₹${total.toFixed(2)}`;
}

function saveInwardStockEntry() {
  alert("Inward Stock Entry Saved Successfully! Central Stock Updated.");
  closeModal();
}

// CHOOSE PRODUCT FOR PARTNER MODAL
function openChooseProductModal(driverId) {
  const driver = state.drivers.find((d) => d.id === driverId);
  const html = `
        <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 10px;">Select stock items to allocate for: <strong>${driver.name}</strong></p>
        <div class="form-group">
            <label>Select Product from Price List</label>
            <select class="form-control" id="allocProdSelect" onchange="updateAllocPrice()">
                ${priceList.map((p) => `<option value="${p.price}">${p.name} (${p.size}) - ₹${p.price}</option>`).join("")}
            </select>
        </div>
        <div class="form-group">
            <label>Quantity to Transfer</label>
            <input type="number" id="allocQty" class="form-control" value="10" min="1" oninput="updateAllocPrice()">
        </div>
        <div style="margin-bottom: 14px; font-size: 0.9rem; font-weight: 700;">
            Calculated Amount: <span id="allocAmountDisp" style="color: var(--primary-blue);">₹660.00</span>
        </div>
        <button class="btn btn-primary btn-block" onclick="transferStockToDriver('${driver.id}')">
            <i class="fa-solid fa-share"></i> Transfer Stock to Partner
        </button>
    `;
  openModal("Choose Product to Allocate", html);
}

function updateAllocPrice() {
  const price =
    parseFloat(document.getElementById("allocProdSelect").value) || 0;
  const qty = parseInt(document.getElementById("allocQty").value) || 0;
  document.getElementById("allocAmountDisp").textContent =
    `₹${(price * qty).toFixed(2)}`;
}

function transferStockToDriver(driverId) {
  const qty = parseInt(document.getElementById("allocQty").value) || 0;
  const driver = state.drivers.find((d) => d.id === driverId);
  if (driver) {
    driver.allocated += qty;
    driver.remaining += qty;
    renderDashboard();
    closeModal();
    alert(`Successfully allocated ${qty} units to ${driver.name}`);
  }
}

// DIRECT COUNTER SHOP SALE MODAL
function openCounterSaleModal() {
  const html = `
        <div class="form-group">
            <label>Total Shop Cash Collected Today (₹)</label>
            <input type="number" class="form-control" placeholder="Enter amount..." value="4500">
        </div>
        <button class="btn btn-primary btn-block" onclick="saveToReconcileDailySales()"><i class="fa-solid fa-check-circle"></i> Save to Reconcile Daily Sales</button>
    `;
  openModal("Direct Shop Counter Sale Entry", html);
}

function saveToReconcileDailySales() {
  alert("Daily counter sale reconciled & saved successfully!");
  closeModal();
}

// ADD NEW CUSTOMER MODAL
function openAddCustomerModal() {
  const html = `
        <div class="form-group">
            <label>Customer Full Name</label>
            <input type="text" id="newCustName" class="form-control" placeholder="e.g. Rahul Sharma">
        </div>
        <div class="form-group">
            <label>Mobile Number</label>
            <input type="text" id="newCustPhone" class="form-control" placeholder="e.g. 9876543210">
        </div>
        <div class="form-group">
            <label>Assign Partner Route</label>
            <select id="newCustPartner" class="form-control">
                ${state.drivers.map((d) => `<option value="${d.name}">${d.name}</option>`).join("")}
            </select>
        </div>
        <button class="btn btn-primary btn-block" onclick="saveNewCustomer()"><i class="fa-solid fa-user-check"></i> Create Customer Record</button>
    `;
  openModal("Add New Customer Record", html);
}

function saveNewCustomer() {
  const name = document.getElementById("newCustName").value;
  const phone = document.getElementById("newCustPhone").value;
  const partner = document.getElementById("newCustPartner").value;

  if (!name || !phone) {
    alert("Please fill name and phone number!");
    return;
  }

  state.customers.push({
    id: `C${state.customers.length + 1}`,
    name: name,
    phone: phone,
    partner: partner,
    purchases: "₹0",
    dues: 0,
  });

  renderDashboard();
  closeModal();
  alert("Customer record successfully added!");
}

// ADD NEW PARTNER MODAL
function openAddPartnerModal() {
  const html = `
        <div class="form-group">
            <label>Partner Name & Route</label>
            <input type="text" id="newPartnerName" class="form-control" placeholder="e.g. Sunil Dutt (Route 6)">
        </div>
        <button class="btn btn-primary btn-block" onclick="saveNewPartner()"><i class="fa-solid fa-plus"></i> Add Partner</button>
    `;
  openModal("Add New Delivery Partner", html);
}

function saveNewPartner() {
  const name = document.getElementById("newPartnerName").value;
  if (!name) return alert("Enter partner name!");

  state.drivers.push({
    id: `D${state.drivers.length + 1}`,
    name: name,
    allocated: 0,
    sold: 0,
    remaining: 0,
    dues: 0,
    location: "28.6100° N, 77.2000° E",
  });

  renderDashboard();
  closeModal();
  alert("New Delivery Partner Added!");
}

// DYNAMIC CONTENT GENERATORS FOR METRICS VIEW MODALS
function getStockDetailHtml() {
  return `<p>Central Warehouse Stock History</p>
            <table class="data-table" style="margin-top:10px;">
                <tr><th>Date</th><th>Stock Available</th></tr>
                <tr><td>04 Aug 2026</td><td>1,750 Liters</td></tr>
                <tr><td>03 Aug 2026</td><td>1,400 Liters</td></tr>
            </table>`;
}

function getDriverStockDetailHtml() {
  return state.drivers
    .map(
      (d) => `<div style="padding: 8px 0; border-bottom: 1px solid #E2E8F0;">
        <strong>${d.name}</strong>: ${d.allocated} Units Allocated
    </div>`,
    )
    .join("");
}

function getSalesDetailHtml() {
  return `<table class="data-table">
        <tr><th>Date</th><th>Total Revenue</th></tr>
        <tr><td>Today</td><td>₹14,520</td></tr>
        <tr><td>Yesterday</td><td>₹18,200</td></tr>
    </table>`;
}

function getPendingDuesDetailHtml() {
  return `<table class="data-table">
        <tr><th>Customer</th><th>Due Date</th><th>Amount</th></tr>
        ${state.customers
          .filter((c) => c.dues > 0)
          .map(
            (c) => `
            <tr><td>${c.name}</td><td>10 Aug 2026</td><td style="color:red; font-weight:700;">₹${c.dues}</td></tr>
        `,
          )
          .join("")}
    </table>`;
}

function openViewModal(title, htmlContent) {
  openModal(title, htmlContent);
}

function trackLocation(driverName, coords) {
  openModal(
    `Live GPS Tracking - ${driverName}`,
    `
        <div style="text-align: center; padding: 20px;">
            <i class="fa-solid fa-map-location-dot" style="font-size: 3rem; color: var(--primary-blue); margin-bottom: 12px;"></i>
            <h4>Current Location Coordinates</h4>
            <p style="font-size: 1.1rem; font-weight:700; color: var(--accent-blue); margin-top: 6px;">${coords}</p>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 10px;">Live updates connected via GPS tracking module.</p>
        </div>
    `,
  );
}

function setupRefreshButton() {
  document.getElementById("refreshAppBtn").addEventListener("click", () => {
    renderDashboard();
    alert("Kanha Dairy Dashboard Refreshed!");
  });
}
