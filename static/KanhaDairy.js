/**
 * KANHA DAIRY - FRONTEND INTERACTION & STATE CONTROLLER
 */

// 1. MOTHER DAIRY CATALOGUE DATA
const priceList = [
  { id: "P1", name: "Mother Dairy Gold Milk", size: "6 L", price: 396.0 },
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

let partnerCache = [];
// Current inventory availability for stock assignment
let availableStockMap = {};
// =====================================================================
// Developer       : Kanha Daily Needs
// Task            : Last Stock Entry Enhancement
// Description     : Stores the most recently added stock entry so that
//                   the user can view its product-wise quantity details.
// =====================================================================

let lastStockEntryDetails = [];
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

  loadTotalStock();

  loadPartnerStockSummary();

  loadPartners();
  loadTotalSales();

});


async function loadTotalStock() {

    const response =
    await fetch("/get-total-stock");

    const data =
    await response.json();

    document.getElementById(
        "dispTotalStock"
    ).innerText =
    data.total_stock + " Units";
}


async function loadPartnerStockSummary() {

    const response =
    await fetch(
        "/get-partner-stock-summary"
    );

    const data =
    await response.json();

    const stockCard =
    document.getElementById(
        "dispDriverStock"
    );

    const amountCard =
    document.getElementById(
        "dispDriverStockAmount"
    );

    if(stockCard){

        stockCard.innerText =
        data.total_stock +
        " Units";

    }

    if(amountCard){

        amountCard.innerText =
        "₹" +
        data.total_amount.toFixed(2);

    }

}


// Developer: Gaurav Choudhary
// Date: 23-11-2026
// Task: Counter Sales - Total Sales Integration
// Description: Fetch today's counter sales and update dashboard dynamically.

let totalSalesToday = 0;

async function loadTotalSales() {

    try {

        const response = await fetch("/get-total-sales");

        if (!response.ok) {
            throw new Error("Unable to fetch total sales");
        }

        const data = await response.json();

        if (data.success) {

            totalSalesToday = Number(data.total_sales) || 0;

            const salesCard = document.getElementById("dispTotalSales");

            if (salesCard) {

                salesCard.innerText =
                    "₹" + totalSalesToday.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });

            }

        }

    } catch (error) {

        console.error("Total Sales Error:", error);

    }

}

async function loadPartners() {

    const response =
    await fetch("/get-partners");

    partnerCache =
    await response.json();

}


function setupDefaultDueDate() {
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const dateStr = nextWeek.toISOString().split("T")[0];
  const dateInput = document.getElementById("posDueDate");
  if (dateInput) dateInput.value = dateStr;
}

// MAIN DASHBOARD RENDERER
function renderDashboard() {

  try {
    renderPartnersTable();
  } catch (e) {}

  try {
    renderCustomerTable();
  } catch (e) {}

  try {
    populatePosDropdowns();
  } catch (e) {}

  try {
    renderDriverPills();
  } catch (e) {}

  try {
    renderSelectedDriverDetail();
  } catch (e) {}

  try {
    updateSummaryMetrics();
  } catch (e) {}
  loadPendingAmount();

}

// ============================================================
// Pending Amount - Live API Integration
// Includes Delivery Partner Outstanding + Customer Outstanding
// ============================================================

async function loadPendingAmount() {

    const pendingCard = document.getElementById("dispPendingDues");

    if (!pendingCard) return;

    pendingCard.textContent = "Loading...";

    try {

        const response = await fetch("/get-pending-amount-summary");

        if (!response.ok) {
            throw new Error("Unable to fetch pending amount.");
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || "Pending amount API failed.");
        }

        const totalPending = Number(data.summary.total_pending || 0);

        pendingCard.textContent = `₹${totalPending.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;

    } catch (error) {

        console.error("Pending Amount Error:", error);

        pendingCard.textContent = "Unavailable";

    }
}

function updateSummaryMetrics() {

  const totalAllocated =
    state.drivers.reduce(
      (acc, d) => acc + d.allocated,
      0
    );

 

  const driverStock =
    document.getElementById(
      "dispDriverStock"
    );

  const pending =
    document.getElementById(
      "dispPendingDues"
    );

  if (driverStock) {

    driverStock.textContent =
      `${totalAllocated} Units`;

  }

 

}


// async function openAssignStockModal() {

//     const partners = partnerCache;

//     const partnerOptions = partners
//         .map(
//             (p) => `
//                 <option value="${p[0]}">
//                     ${p[1]}
//                 </option>
//             `
//         )
//         .join("");

//     const html = `

//         <div class="form-group">

//             <label>Select Partner</label>

//             <select
//                 id="assignPartner"
//                 class="form-control"
//             >
//                 ${partnerOptions}
//             </select>

//         </div>

//         <hr>

//         <div
//             style="
//                 max-height:300px;
//                 overflow-y:auto;
//             "
//         >

//             ${priceList.map((item, index) => `

//                 <div class="inward-row">

//                     <span>
//                         <strong>${item.name}</strong>
//                     </span>

//                     <span>
//                         ${item.size}
//                     </span>

//                     <span>
//                         ₹${item.price}
//                     </span>

//                     <div>

//                         <input
//                             type="number"
//                             min="0"
//                             value="0"
//                             id="assignQty_${index}"
//                             onchange="calculateAssignTotal()"
//                         >

//                     </div>

//                 </div>

//             `).join("")}

//         </div>

//         <div
//             style="
//                 background:#EBF5FF;
//                 padding:12px;
//                 margin-top:10px;
//                 border-radius:8px;
//             "
//         >

//             Total Amount :
//             <strong id="assignTotalDisplay">

//                 ₹0.00

//             </strong>

//         </div>

//         <br>
// <div
// style="
// display:flex;
// gap:10px;
// margin-top:15px;
// ">

// <button
// class="btn btn-success"
// onclick="saveAssignedStock('Cash')"
// >
// Cash
// </button>

// <button
// class="btn btn-primary"
// onclick="saveAssignedStock('Online')"
// >
// Online
// </button>

// <button
// class="btn btn-warning"
// onclick="saveAssignedStock('Later')"
// >
// Pay Later
// </button>

// </div>

//     `;

//     openModal(
//         "Assign Stock To Partner",
//         html
//     );

// }


// =====================================================================
// Developer       : Gaurav Choudhary
// Date            : 23-11-2026
// Task            : Task 2 - Assign Stock Enhancement
// Description     : Add Total Quantity summary while retaining the
//                   existing Total Amount calculation.
// =====================================================================

// async function openAssignStockModal() {

//     const partners = partnerCache;

//     const partnerOptions = partners
//         .map((p) => `
//             <option value="${p[0]}">
//                 ${p[1]}
//             </option>
//         `)
//         .join("");

//     const html = `

//         <div class="form-group">
//             <label>Select Partner</label>

//             <select
//                 id="assignPartner"
//                 class="form-control"
//             >
//                 ${partnerOptions}
//             </select>
//         </div>

//         <hr>

//         <div style="max-height:300px; overflow-y:auto;">

//             ${priceList.map((item, index) => `

//                 <div class="inward-row">

//                     <span>
//                         <strong>${item.name}</strong>
//                     </span>

//                     <span>${item.size}</span>

//                     <span>₹${item.price}</span>

//                     <div>
//                         <input
//                             type="number"
//                             min="0"
//                             value="0"
//                             id="assignQty_${index}"
//                             oninput="calculateAssignTotal()"
//                         >
//                     </div>

//                 </div>

//             `).join("")}

//         </div>

//         <!-- Total Quantity and Total Amount Summary -->

//         <div style="
//             background:#EBF5FF;
//             padding:12px;
//             margin-top:10px;
//             border-radius:8px;
//         ">

//             <div style="margin-bottom:8px;">
//                 Total Quantity:
//                 <strong id="assignTotalQuantity">0</strong>
//             </div>

//             <div>
//                 Total Amount:
//                 <strong id="assignTotalDisplay">₹0.00</strong>
//             </div>

//         </div>

//         <br>

//         <div style="display:flex; gap:10px; margin-top:15px;">

//             <button
//                 class="btn btn-success"
//                 onclick="saveAssignedStock('Cash')"
//             >
//                 Cash
//             </button>

//             <button
//                 class="btn btn-primary"
//                 onclick="saveAssignedStock('Online')"
//             >
//                 Online
//             </button>

//             <button
//                 class="btn btn-warning"
//                 onclick="saveAssignedStock('Later')"
//             >
//                 Pay Later
//             </button>

//         </div>

//     `;

//     openModal("Assign Stock To Partner", html);

//     calculateAssignTotal();
// }


async function openAssignStockModal() {

    try {

        // Fetch live available stock from PostgreSQL
        const stockResponse = await fetch("/get-available-stock");
        const stockResult = await stockResponse.json();

        if (!stockResponse.ok || !stockResult.success) {
            throw new Error(stockResult.message || "Unable to load current stock");
        }

        // Store product-wise available quantities
        availableStockMap = {};

        stockResult.products.forEach(product => {
            availableStockMap[product.product_id] =
                Number(product.available_quantity) || 0;
        });

        const partners = partnerCache;

        const partnerOptions = partners.map(p => `
            <option value="${p[0]}">${p[1]}</option>
        `).join("");

        const html = `

            <div class="form-group">
                <label>Select Partner</label>

                <select id="assignPartner" class="form-control">
                    ${partnerOptions}
                </select>
            </div>

            <hr>

            <div style="max-height:350px; overflow-y:auto;">

                ${priceList.map((item, index) => {

                    const available =
                        availableStockMap[item.id] || 0;

                    return `

                        <div class="inward-row"
                             style="padding:10px 0;">

                            <div style="min-width:0;">

                                <strong>${item.name}</strong>

                                <div style="
                                    font-size:12px;
                                    color:#64748b;
                                    margin-top:4px;
                                ">
                                    Current Stock:
                                    <strong style="color:${available > 0 ? '#15803d' : '#dc2626'};">
                                        ${available} Units
                                    </strong>
                                </div>

                            </div>

                            <span>${item.size}</span>

                            <span>₹${item.price}</span>

                            <div style="min-width:90px;">

                                <input
                                    type="number"
                                    min="0"
                                    max="${available}"
                                    step="1"
                                    value="0"
                                    id="assignQty_${index}"
                                    ${available === 0 ? "disabled" : ""}
                                    oninput="validateAssignQuantity(${index})"
                                    style="width:85px;"
                                >

                                <small style="
                                    display:block;
                                    font-size:10px;
                                    color:#64748b;
                                ">
                                    Max: ${available}
                                </small>

                            </div>

                        </div>

                    `;

                }).join("")}

            </div>

            <!-- Clickable Assignment Summary -->

            <div
                style="
                    background:#EBF5FF;
                    padding:12px;
                    margin-top:10px;
                    border-radius:8px;
                    cursor:pointer;
                    border:1px solid #B8D9F5;
                "
                onclick="openLastStockAssignmentDetails()"
            >

                <div>
                    Total Quantity:
                    <strong id="assignTotalQuantity">0</strong>
                </div>

                <small style="color:var(--primary-blue);">
                    Click to view last assigned stock details
                </small>

                <div style="margin-top:8px;">
                    Total Amount:
                    <strong id="assignTotalDisplay">₹0.00</strong>
                </div>

            </div>

            <br>

            <div style="display:flex; gap:10px; flex-wrap:wrap;">

                <button
                    class="btn btn-success"
                    onclick="saveAssignedStock('Cash')"
                >
                    Cash
                </button>

                <button
                    class="btn btn-primary"
                    onclick="saveAssignedStock('Online')"
                >
                    Online
                </button>

                <button
                    class="btn btn-warning"
                    onclick="saveAssignedStock('Later')"
                >
                    Pay Later
                </button>

            </div>

        `;

        openModal("Assign Stock To Partner", html);

        calculateAssignTotal();

    }

    catch (error) {

        console.error("Assign Stock Modal Error:", error);

        alert("Unable to load current stock: " + error.message);

    }

}



function validateAssignQuantity(index) {

    const input = document.getElementById(`assignQty_${index}`);

    const product = priceList[index];

    const available = availableStockMap[product.id] || 0;

    let quantity = parseInt(input.value) || 0;

    if (quantity < 0) {
        quantity = 0;
    }

    if (quantity > available) {

        alert(
            `${product.name} (${product.size}) ke liye ` +
            `sirf ${available} units available hain.`
        );

        quantity = available;

    }

    input.value = quantity;

    calculateAssignTotal();

}

// async function openAssignStockModal() {

//     const partners = partnerCache;

//     const partnerOptions = partners
//         .map((p) => `
//             <option value="${p[0]}">
//                 ${p[1]}
//             </option>
//         `)
//         .join("");

//     const html = `

//         <div class="form-group">
//             <label>Select Partner</label>

//             <select id="assignPartner" class="form-control">
//                 ${partnerOptions}
//             </select>
//         </div>

//         <hr>

//         <div style="max-height:300px; overflow-y:auto;">

//             ${priceList.map((item, index) => `

//                 <div class="inward-row">

//                     <span><strong>${item.name}</strong></span>

//                     <span>${item.size}</span>

//                     <span>₹${item.price}</span>

//                     <div>
//                         <input
//                             type="number"
//                             min="0"
//                             value="0"
//                             id="assignQty_${index}"
//                             oninput="calculateAssignTotal()"
//                         >
//                     </div>

//                 </div>

//             `).join("")}

//         </div>

//         <!-- Clickable Assignment Quantity Summary -->

//         <div style="
//             background:#EBF5FF;
//             padding:12px;
//             margin-top:10px;
//             border-radius:8px;
//             border:1px solid #B8D9F5;
//             cursor:pointer;
//         "
//         onclick="openLastStockAssignmentDetails()"
//         title="Click to view latest vendor assignment">

//             <div style="margin-bottom:8px; color:var(--primary-blue);">

//                 <strong>
//                     Total Quantity
//                     <i class="fa-solid fa-arrow-up-right-from-square"></i>
//                 </strong>

//                 <strong id="assignTotalQuantity">0</strong>

//             </div>

//             <small style="color:var(--primary-blue);">
//                 Click to view assigned quantity details
//             </small>

//             <div style="margin-top:8px;">
//                 Total Amount:
//                 <strong id="assignTotalDisplay">₹0.00</strong>
//             </div>

//         </div>

//         <br>

//         <div style="display:flex; gap:10px; margin-top:15px;">

//             <button
//                 class="btn btn-success"
//                 onclick="saveAssignedStock('Cash')"
//             >
//                 Cash
//             </button>

//             <button
//                 class="btn btn-primary"
//                 onclick="saveAssignedStock('Online')"
//             >
//                 Online
//             </button>

//             <button
//                 class="btn btn-warning"
//                 onclick="saveAssignedStock('Later')"
//             >
//                 Pay Later
//             </button>

//         </div>

//     `;

//     openModal("Assign Stock To Partner", html);

//     calculateAssignTotal();
// }

// =====================================================================
// Task        : Last Stock Assignment Details
// Description : Displays latest vendor and product-wise assigned stock
// API         : GET /get-last-stock-assignment
// =====================================================================

async function openLastStockAssignmentDetails() {

    openModal(
        "Last Stock Assignment Details",
        "<p style='padding:15px;'>Loading assignment details...</p>"
    );

    try {

        const response = await fetch("/get-last-stock-assignment");

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "Unable to fetch assignment details"
            );
        }

        if (!result.items || result.items.length === 0) {

            document.getElementById("modalContent").innerHTML = `
                <div style="padding:20px;">
                    <h3>No Assignment Found</h3>
                    <p>Please assign stock first.</p>
                    <button onclick="closeModal()">Close</button>
                </div>
            `;

            return;
        }

        const rows = result.items.map((item, index) => `

            <tr>
                <td style="padding:10px;">${index + 1}</td>

                <td style="padding:10px;">
                    ${item.product_name || item.product_id}
                </td>

                <td style="padding:10px;">
                    ${item.pack_size || "-"}
                </td>

                <td style="padding:10px; text-align:right;">
                    ${Number(item.quantity || 0)}
                </td>

                <td style="padding:10px; text-align:right;">
                    ₹${Number(item.total_amount || 0).toFixed(2)}
                </td>
            </tr>

        `).join("");

        const html = `

            <div style="padding:10px;">

                <h3>Latest Stock Assignment</h3>

                <p>
                    <strong>Assignment ID:</strong>
                    ${result.assignment_id}
                </p>

                <p>
                    <strong>Vendor Name:</strong>
                    ${result.partner_name || "-"}
                </p>

                <p>
                    <strong>Total Quantity:</strong>
                    ${result.total_quantity}
                </p>

                <p>
                    <strong>Total Amount:</strong>
                    ₹${Number(result.total_amount || 0).toFixed(2)}
                </p>

                <p>
                    <strong>Payment Mode:</strong>
                    ${result.payment_mode || "-"}
                </p>

                <p>
                    <strong>Assigned On:</strong>
                    ${result.created_at
                        ? new Date(result.created_at).toLocaleString()
                        : "-"
                    }
                </p>

                <hr>

                <h3>Assigned Material Details</h3>

                <div style="overflow-x:auto;">

                    <table style="
                        width:100%;
                        border-collapse:collapse;
                    ">

                        <thead>
                            <tr style="background:#EBF5FF;">
                                <th style="padding:10px;">#</th>
                                <th style="padding:10px; text-align:left;">Product</th>
                                <th style="padding:10px; text-align:left;">Pack Size</th>
                                <th style="padding:10px; text-align:right;">Quantity</th>
                                <th style="padding:10px; text-align:right;">Amount</th>
                            </tr>
                        </thead>

                        <tbody>
                            ${rows}
                        </tbody>

                        <tfoot>
                            <tr style="background:#EBF5FF;">
                                <th colspan="3" style="padding:10px; text-align:right;">
                                    Total Quantity
                                </th>

                                <th style="padding:10px; text-align:right;">
                                    ${result.total_quantity}
                                </th>

                                <th style="padding:10px; text-align:right;">
                                    ₹${Number(result.total_amount || 0).toFixed(2)}
                                </th>
                            </tr>
                        </tfoot>

                    </table>

                </div>

                <div style="text-align:right; margin-top:15px;">
                    <button
                        class="btn btn-secondary"
                        onclick="closeModal()"
                    >
                        Close
                    </button>
                </div>

            </div>

        `;

        document.getElementById("modalContent").innerHTML = html;

    }

    catch (error) {

        console.error("Assignment Details Error:", error);

        document.getElementById("modalContent").innerHTML = `
            <div style="padding:15px;">
                <h3>Unable to Load Assignment</h3>
                <p>${error.message}</p>
                <button onclick="closeModal()">Close</button>
            </div>
        `;

    }

}


// function calculateAssignTotal(){

//     let total = 0;

//     priceList.forEach(

//         (item,index)=>{

//             const qty =

//             parseInt(

//                 document.getElementById(
//                     `assignQty_${index}`
//                 ).value

//             ) || 0;

//             total += qty * item.price;

//         }

//     );

//     document.getElementById(
//         "assignTotalDisplay"
//     ).innerText =
//     `₹${total.toFixed(2)}`;

// }


// =====================================================================
// Developer       : Gaurav Choudhary
// Date            : 23-11-2026
// Task            : Task 2 - Assign Stock Enhancement
// Description     : Calculate combined Total Quantity and Total Amount
//                   from all product-wise stock quantities.
// =====================================================================

function calculateAssignTotal() {

    let totalQuantity = 0;
    let totalAmount = 0;

    priceList.forEach((item, index) => {

        const qty = parseInt(
            document.getElementById(`assignQty_${index}`).value
        ) || 0;

        totalQuantity += qty;

        totalAmount += qty * item.price;

    });

    document.getElementById(
        "assignTotalQuantity"
    ).innerText = totalQuantity;

    document.getElementById(
        "assignTotalDisplay"
    ).innerText = `₹${totalAmount.toFixed(2)}`;

}



// async function saveAssignedStock(paymentMode)
// {
//     const partner_id =
//     document.getElementById(
//         "assignPartner"
//     ).value;

//     const items = [];

//     priceList.forEach((product,index)=>{

//         const qty =
//         parseInt(
//             document.getElementById(
//                 `assignQty_${index}`
//             ).value
//         ) || 0;
        

//         if(qty > 0){

//             items.push({

//                 product_id: product.id,

//                 quantity: qty

//             });

//         }

//     });

//     if(items.length === 0){

//         alert("Please enter quantity");

//         return;

//     }

//     const response = await fetch(

//         "/assign-stock",

//         {

//             method:"POST",

//             headers:{

//                 "Content-Type":
//                 "application/json"

//             },

//             body:JSON.stringify({

//                 partner_id,

//                 payment_mode:paymentMode,

//                 items

//             })

//         }

//     );

//     const result =
//     await response.json();

//     if(result.success){

//         await loadTotalStock();

//         await loadPartnerStockSummary();

//         alert(
//             "Stock Assigned Successfully"
//         );

//         closeModal();

//     }

// }

async function saveAssignedStock(paymentMode)
{
    const partner_id =
    document.getElementById(
        "assignPartner"
    ).value;

    const items = [];

    // STEP 1: Validate available stock before assignment
    for (let index = 0; index < priceList.length; index++) {

        const product = priceList[index];

        const qty = parseInt(
            document.getElementById(
                `assignQty_${index}`
            ).value
        ) || 0;

        const available =
            availableStockMap[product.id] || 0;

        if (qty > available) {

            alert(
                `${product.name} (${product.size}) ke liye ` +
                `sirf ${available} units available hain.`
            );

            return;
        }
    }

    // STEP 2: Prepare assignment items
    priceList.forEach((product, index) => {

        const qty =
        parseInt(
            document.getElementById(
                `assignQty_${index}`
            ).value
        ) || 0;

        if (qty > 0) {

            items.push({

                product_id: product.id,

                quantity: qty

            });

        }

    });

    // STEP 3: Check quantity
    if (items.length === 0) {

        alert("Please enter quantity");

        return;

    }

    // STEP 4: Send assignment request
    const response = await fetch(

        "/assign-stock",

        {

            method: "POST",

            headers: {

                "Content-Type":
                "application/json"

            },

            body: JSON.stringify({

                partner_id,

                payment_mode: paymentMode,

                items

            })

        }

    );

    const result =
    await response.json();

    // STEP 5: Handle response
    if (result.success) {

        await loadTotalStock();

        await loadPartnerStockSummary();

        alert(
            "Stock Assigned Successfully"
        );

        closeModal();

    } else {

        alert(
            result.message || "Stock assignment failed"
        );

    }

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

  const tbody =
  document.getElementById(
    "partnerTableBody"
  );

  if (!tbody) {
    return;
  }

  tbody.innerHTML = state.drivers
    .map(
      (d) => `
        <tr>
            <td>${d.name}</td>
        </tr>
      `
    )
    .join("");
}

// RENDER CUSTOMERS DATABASE TABLE
function renderCustomerTable() {

  const tbody =
  document.getElementById(
    "customerTableBody"
  );

  if (!tbody) {
    return;
  }

  tbody.innerHTML = state.customers
    .map(
      (c) => `
        <tr>
          <td>${c.name}</td>
        </tr>
      `
    )
    .join("");
}

// POPULATE POS SELECTION DROPDOWNS
function populatePosDropdowns() {

  const pSelect =
    document.getElementById("posPartnerSelect");

  const cSelect =
    document.getElementById("posCustomerSelect");

  const prodSelect =
    document.getElementById("posProductSelect");

  // Agar page par ye controls nahi hain
  // to function exit kar do

  if (!pSelect || !cSelect || !prodSelect) {
    return;
  }

  pSelect.innerHTML = state.drivers
    .map(
      (d) =>
        `<option value="${d.id}">
          ${d.name}
        </option>`
    )
    .join("");

  cSelect.innerHTML = state.customers
    .map(
      (c) =>
        `<option value="${c.id}">
          ${c.name} (${c.phone})
        </option>`
    )
    .join("");

  prodSelect.innerHTML = priceList
    .map(
      (p) =>
        `<option
            value="${p.price}"
            data-name="${p.name}"
            data-size="${p.size}">
            ${p.name} (${p.size}) - ₹${p.price}
         </option>`
    )
    .join("");

}
// RENDER DRIVER SELECTION PILLS
function renderDriverPills() {

  const container =
    document.getElementById(
      "driverPillsContainer"
    );

  if (!container) {
    return;
  }

  container.innerHTML = state.drivers
    .map(
      (d) => `
        <div
          class="partner-pill ${
            d.id === state.activeSelectedDriverId
              ? "active"
              : ""
          }"
          onclick="selectDriverPill('${d.id}')"
        >
          ${d.name.split(" ")[0]}
        </div>
      `
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

  const container =
    document.getElementById(
      "partnerDetailCard"
    );

  if (!container) {
    return;
  }

  const driver = state.drivers.find(
    (d) => d.id === state.activeSelectedDriverId
  );

  if (!driver) {
    return;
  }

  container.innerHTML =
    `<h3>${driver.name}</h3>`;

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


// =====================================================================
// Task        : Driver Stock Details Modal
// Description : Fetch and display driver-wise assigned stock details
// API         : /get-partner-stock-details
// =====================================================================

async function openDriverStockDetails() {

    try {

        const response = await fetch("/get-partner-stock-details");

        if (!response.ok) {
            throw new Error("Unable to fetch Driver Stock Details");
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || "Unable to load stock details");
        }

        if (!data.partners || data.partners.length === 0) {

            openModal(
                "Driver Stock Details",
                "<p>No assigned stock available.</p>"
            );

            return;
        }

        const driverCards = data.partners.map((driver, index) => {

            const productRows = driver.products.map((item, i) => `
                <tr>
                    <td>${i + 1}</td>
                    <td>
                        <strong>${item.product_name}</strong>
                        <br>
                        <small>${item.pack_size}</small>
                    </td>
                    <td style="text-align:right;">
                        ${item.quantity}
                    </td>
                    <td style="text-align:right;">
                        ₹${Number(item.rate).toFixed(2)}
                    </td>
                    <td style="text-align:right;">
                        ₹${Number(item.total_amount).toFixed(2)}
                    </td>
                </tr>
            `).join("");

            return `
                <div style="
                    border:1px solid #E2E8F0;
                    border-radius:10px;
                    padding:15px;
                    margin-bottom:15px;
                ">

                    <div style="
                        display:flex;
                        justify-content:space-between;
                        flex-wrap:wrap;
                        gap:10px;
                        margin-bottom:12px;
                    ">

                        <div>
                            <h4 style="margin:0;">
                                ${index + 1}. ${driver.partner_name}
                            </h4>

                            <small>
                                Driver ID: ${driver.partner_id}
                            </small>
                        </div>

                        <div style="text-align:right;">
                            <strong>${driver.total_quantity} Units</strong>
                            <br>
                            <strong style="color:var(--primary-blue);">
                                ₹${Number(driver.total_amount).toFixed(2)}
                            </strong>
                        </div>

                    </div>

                    <div style="overflow-x:auto;">

                        <table class="data-table"
                               style="width:100%; min-width:550px;">

                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Product</th>
                                    <th style="text-align:right;">Qty</th>
                                    <th style="text-align:right;">Rate</th>
                                    <th style="text-align:right;">Amount</th>
                                </tr>
                            </thead>

                            <tbody>
                                ${productRows}
                            </tbody>

                        </table>

                    </div>

                </div>
            `;

        }).join("");

        const html = `

            <div style="padding:5px;">

                <div style="
                    display:grid;
                    grid-template-columns:repeat(auto-fit,minmax(130px,1fr));
                    gap:10px;
                    margin-bottom:18px;
                ">

                    <div style="
                        background:#EBF5FF;
                        padding:12px;
                        border-radius:8px;
                    ">
                        <small>Total Drivers</small>
                        <h3>${data.total_partners}</h3>
                    </div>

                    <div style="
                        background:#EAF8EF;
                        padding:12px;
                        border-radius:8px;
                    ">
                        <small>Total Units</small>
                        <h3>${data.grand_total_quantity}</h3>
                    </div>

                    <div style="
                        background:#FFF5E6;
                        padding:12px;
                        border-radius:8px;
                    ">
                        <small>Total Amount</small>
                        <h3>₹${Number(data.grand_total_amount).toFixed(2)}</h3>
                    </div>

                </div>

                <h3 style="margin-bottom:12px;">
                    Driver-wise Assigned Stock
                </h3>

                ${driverCards}

                <div style="text-align:right; margin-top:15px;">
                    <button
                        class="btn btn-secondary"
                        onclick="closeModal()">
                        Close
                    </button>
                </div>

            </div>

        `;

        openModal("Driver Stock Details", html);

    } catch (error) {

        console.error("Driver Stock Details Error:", error);

        alert("Unable to load Driver Stock Details. Please try again.");

    }

}


// =====================================================================
// Task        : Last Stock Entry Details
// Description : Opens product-wise quantity details of the last stock entry
// =====================================================================

// function openLastStockEntryDetails() {

//     if (!lastStockEntryDetails || lastStockEntryDetails.length === 0) {
//         alert("No stock entry details available. Please add stock first.");
//         return;
//     }

//     let totalQty = 0;

//     let rows = lastStockEntryDetails.map((item, index) => {

//         totalQty += Number(item.quantity || 0);

//         return `
//             <tr>
//                 <td>${index + 1}</td>
//                 <td>${item.name || item.product_id}</td>
//                 <td>${item.size || "-"}</td>
//                 <td style="text-align:right;">
//                     ${Number(item.quantity || 0)}
//                 </td>
//             </tr>
//         `;
//     }).join("");

//     const html = `
//         <div style="padding:10px;">
//             <h3>Last Stock Entry Details</h3>

//             <table style="width:100%; border-collapse:collapse;">
//                 <thead>
//                     <tr>
//                         <th style="padding:10px; text-align:left;">#</th>
//                         <th style="padding:10px; text-align:left;">Product</th>
//                         <th style="padding:10px; text-align:left;">Pack Size</th>
//                         <th style="padding:10px; text-align:right;">Quantity</th>
//                     </tr>
//                 </thead>

//                 <tbody>
//                     ${rows}
//                 </tbody>

//                 <tfoot>
//                     <tr>
//                         <th colspan="3" style="padding:10px; text-align:right;">
//                             Total Quantity
//                         </th>
//                         <th style="padding:10px; text-align:right;">
//                             ${totalQty}
//                         </th>
//                     </tr>
//                 </tfoot>
//             </table>

//             <div style="text-align:right; margin-top:15px;">
//                 <button onclick="closeModal()">Close</button>
//             </div>
//         </div>
//     `;

//     openModal("Last Stock Entry Details", html);
// }


// =====================================================================
// Task        : Last Stock Entry Details
// Description : Fetches latest stock entry directly from PostgreSQL
// API         : GET /get-last-stock-entry
// =====================================================================

async function openLastStockEntryDetails() {

    // Open modal with loading message
    openModal(
        "Last Stock Entry Details",
        "<p style='padding:15px;'>Loading stock details...</p>"
    );

    try {

        // Fetch latest stock entry from backend
        const response = await fetch("/get-last-stock-entry");

        const result = await response.json();

        if (!response.ok || !result.success) {

            throw new Error(
                result.message || "Unable to fetch stock details"
            );

        }

        // Check whether stock entry exists
        if (!result.items || result.items.length === 0) {

            document.getElementById("modalContent").innerHTML = `
                <div style="padding:20px; text-align:center;">
                    <h3>No Stock Entry Found</h3>
                    <p>Please add stock first.</p>
                    <button onclick="closeModal()">Close</button>
                </div>
            `;

            return;

        }

        // Calculate total quantity
        const totalQty = result.items.reduce(
            (total, item) => total + Number(item.quantity || 0),
            0
        );

        // Build product-wise table rows
        const rows = result.items.map((item, index) => `

            <tr>

                <td style="padding:10px;">
                    ${index + 1}
                </td>

                <td style="padding:10px;">
                    ${item.product_name || item.product_id}
                </td>

                <td style="padding:10px;">
                    ${item.pack_size || "-"}
                </td>

                <td style="padding:10px; text-align:right;">
                    ${Number(item.quantity || 0)}
                </td>

                <td style="padding:10px; text-align:right;">
                    ₹${Number(item.total_amount || 0).toFixed(2)}
                </td>

            </tr>

        `).join("");

        // Build final details view
        const html = `

            <div style="padding:10px;">

                <h3>Last Stock Entry Details</h3>

                <p>
                    <strong>Entry ID:</strong>
                    ${result.entry_id}
                </p>

                <div style="overflow-x:auto;">

                    <table style="
                        width:100%;
                        border-collapse:collapse;
                        margin-top:12px;
                    ">

                        <thead>

                            <tr style="background:#EBF5FF;">

                                <th style="padding:10px;">#</th>

                                <th style="padding:10px; text-align:left;">
                                    Product
                                </th>

                                <th style="padding:10px; text-align:left;">
                                    Pack Size
                                </th>

                                <th style="padding:10px; text-align:right;">
                                    Quantity
                                </th>

                                <th style="padding:10px; text-align:right;">
                                    Amount
                                </th>

                            </tr>

                        </thead>

                        <tbody>
                            ${rows}
                        </tbody>

                        <tfoot>

                            <tr style="background:#EBF5FF;">

                                <th colspan="3"
                                    style="padding:10px; text-align:right;">
                                    Total Quantity
                                </th>

                                <th style="padding:10px; text-align:right;">
                                    ${totalQty}
                                </th>

                                <th></th>

                            </tr>

                        </tfoot>

                    </table>

                </div>

                <div style="text-align:right; margin-top:15px;">

                    <button
                        class="btn btn-secondary"
                        onclick="closeModal()"
                    >
                        Close
                    </button>

                </div>

            </div>

        `;

        // Display database response
        document.getElementById("modalContent").innerHTML = html;

    }

    catch (error) {

        console.error(
            "Last Stock Entry Details Error:",
            error
        );

        document.getElementById("modalContent").innerHTML = `

            <div style="padding:15px;">

                <h3>Unable to Load Stock Details</h3>

                <p>${error.message}</p>

                <button onclick="closeModal()">
                    Close
                </button>

            </div>

        `;

    }

}


// INWARD MILK ENTRY MODAL WITH AUTOMATED CALCULATION
// 


// =====================================================================
// Developer       : Gaurav Choudhary
// Date            : 23-11-2026
// Task            : Add Stock Enhancement
// Description     : Enhance Inward Milk Entry modal by displaying
//                   Total Quantity along with existing Total Amount.
//                   Both summary values are calculated dynamically.
// =====================================================================

// 


// =====================================================================
// Developer       : Kanha Daily Needs
// Task            : Add Stock - Clickable Total Quantity
// Description     : Displays product-wise quantity details of the
//                   latest stock entry when Total Quantity is clicked.
// =====================================================================

function openInwardMilkModal() {

    const html = `
        <p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:12px;">
            Specify quantities for incoming Mother Dairy stock:
        </p>

        <div class="inward-table-header">
            <span>Product Name</span>
            <span>Pack Size</span>
            <span>Rate (₹)</span>
            <span>Quantity</span>
        </div>

        <div style="max-height:280px; overflow-y:auto; margin-bottom:14px;">

            ${priceList.map((item, idx) => `
                <div class="inward-row">

                    <span><strong>${item.name}</strong></span>
                    <span>${item.size}</span>
                    <span>₹${item.price.toFixed(2)}</span>

                    <div>
                        <input
                            type="number"
                            min="0"
                            step="1"
                            value="0"
                            class="qty-input-table"
                            id="inwardQty_${idx}"
                            oninput="calculateInwardTotal()"
                        >
                    </div>

                </div>
            `).join("")}

        </div>

        <!-- Total Quantity and Total Amount Summary -->
        <div style="
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:10px;
            margin-bottom:14px;
        ">

            <!-- Clickable Total Quantity -->
            <div style="
                background:#EBF5FF;
                padding:12px;
                border-radius:8px;
                cursor:pointer;
                border:1px solid #B8D9F5;
            "
            onclick="openLastStockEntryDetails()"
            title="Click to view latest stock entry details">

                <label style="
                    font-size:0.85rem;
                    font-weight:700;
                    color:var(--primary-blue);
                    cursor:pointer;
                ">
                    Total Quantity
                    <i class="fa-solid fa-arrow-up-right-from-square"
                       style="font-size:0.7rem; margin-left:4px;">
                    </i>
                </label>

                <input
                    type="number"
                    id="inwardTotalQuantity"
                    class="form-control"
                    value="0"
                    readonly
                    tabindex="-1"
                    style="margin-top:6px; font-weight:700; cursor:pointer; pointer-events:none;"
                >

                <small style="color:var(--primary-blue);">
                    Click to view details
                </small>

            </div>

            <!-- Total Amount -->
            <div style="
                background:#EBF5FF;
                padding:12px;
                border-radius:8px;
            ">

                <label style="
                    font-size:0.85rem;
                    font-weight:700;
                    color:var(--primary-blue);
                ">
                    Total Amount (₹)
                </label>

                <input
                    type="text"
                    id="inwardTotalDisplay"
                    class="form-control"
                    value="₹0.00"
                    readonly
                    style="margin-top:6px; font-weight:700;"
                >

            </div>

        </div>

        <div style="display:flex; gap:10px;">

            <button
                class="btn btn-primary btn-block"
                onclick="saveInwardStockEntry()"
            >
                <i class="fa-solid fa-floppy-disk"></i>
                Save Stock Entry
            </button>

            <button
                class="btn btn-secondary"
                onclick="closeModal()"
            >
                Close
            </button>

        </div>
    `;

    openModal("Inward Milk Entry (Stock Arrival)", html);

    // Initialize quantity and amount summary.
    calculateInwardTotal();
}


// =====================================================================
// End of Clickable Total Quantity Modal
// =====================================================================



// =====================================================================
// End of Inward Milk Modal Enhancement
// =====================================================================


// function calculateInwardTotal() {
//   let total = 0;
//   priceList.forEach((item, idx) => {
//     const qtyVal =
//       parseInt(document.getElementById(`inwardQty_${idx}`)?.value) || 0;
//     total += qtyVal * item.price;
//   });
//   document.getElementById("inwardTotalDisplay").textContent =
//     `₹${total.toFixed(2)}`;
// }

// =====================================================================
// Developer       : Gaurav Choudhary
// Date            : 23-11-2026
// Task            : Add Stock Enhancement
// Description     : Calculate aggregate Total Quantity and Total Amount
//                   based on product-wise inward stock quantities.
// =====================================================================

function calculateInwardTotal() {

    let totalQuantity = 0;
    let totalAmount = 0;

    priceList.forEach((item, idx) => {

        // Fetch product-wise entered quantity
        const qtyVal =
            parseInt(
                document.getElementById(`inwardQty_${idx}`)?.value
            ) || 0;

        // Calculate aggregate quantity
        totalQuantity += qtyVal;

        // Calculate product-wise amount
        totalAmount += qtyVal * item.price;

    });

    // Update Total Quantity field
    document.getElementById("inwardTotalQuantity").value =
        totalQuantity;

    // Update existing Total Amount field
    document.getElementById("inwardTotalDisplay").value =
        `₹${totalAmount.toFixed(2)}`;

}


// =====================================================================
// End of Quantity and Amount Calculation
// =====================================================================


// async function saveInwardStockEntry() {

//     console.log("SAVE STOCK CLICKED");

//     const items = [];

//     priceList.forEach((product, index) => {

//         const qty =
//         parseInt(
//             document.getElementById(
//                 `inwardQty_${index}`
//             ).value
//         ) || 0;

//         if (qty > 0) {

//             items.push({

//                 product_id: product.id,

//                 quantity: qty

//             });

//         }

//     });

//     console.log(items);

//     if (items.length === 0) {

//         alert("Please enter stock quantity");

//         return;

//     }

//     const response = await fetch("/add-stock", {

//         method: "POST",

//         headers: {

//             "Content-Type": "application/json"

//         },

//         body: JSON.stringify({

//             items: items

//         })

//     });

//     const result = await response.json();

//     if (result.success) {

//         await loadTotalStock();

//         alert("Stock Added Successfully!");

//         closeModal();

//     }

// }


// =====================================================================
// Developer       : Gaurav Choudhary
// Date            : 23-11-2026
// Task            : Add Stock Enhancement
// Description     : Submit product-wise Total Quantity and Total Amount
//                   to Flask API and save stock addition records.
// API Endpoint    : POST /add-stock
// =====================================================================


async function saveInwardStockEntry() {

    console.log("SAVE STOCK CLICKED");

    const items = [];

    let totalQuantity = 0;
    let totalAmount = 0;

    // ================================================================
    // Collect product-wise stock information
    // ================================================================

    priceList.forEach((product, index) => {

        const qty =
            parseInt(
                document.getElementById(`inwardQty_${index}`).value
            ) || 0;

        if (qty > 0) {

            const productAmount = qty * product.price;

            items.push({

                product_id: product.id,

                quantity: qty,

                total_amount: productAmount

            });

            totalQuantity += qty;

            totalAmount += productAmount;

        }

    });

    // ================================================================
    // Validate stock quantity
    // ================================================================

    if (items.length === 0) {

        alert("Please enter stock quantity");

        return;

    }

    try {

        // ============================================================
        // Send stock details to backend
        // ============================================================

        const response = await fetch("/add-stock", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                items: items

            })

        });

        const result = await response.json();

        // ============================================================
        // Handle successful stock addition
        // ============================================================

        if (response.ok && result.success) {

            // Refresh total inventory stock
            await loadTotalStock();

            // Display successful stock addition details
            alert(
                "Stock Added Successfully!\n\n" +
                "Entry ID: " + result.entry_id + "\n" +
                "Total Quantity: " + totalQuantity + "\n" +
                "Total Amount: ₹" + totalAmount.toFixed(2)
            );

            // Close stock entry modal
            closeModal();

        }

        // ============================================================
        // Handle backend failure
        // ============================================================

        else {

            alert(
                "Stock Addition Failed!\n" +
                (result.message || "Unknown error")
            );

        }

    }

    catch (error) {

        console.error("Add Stock Error:", error);

        alert("Unable to add stock. Please try again.");

    }

}


// async function saveInwardStockEntry() {

//     console.log("SAVE STOCK CLICKED");

//     const items = [];

//     let totalQuantity = 0;
//     let totalAmount = 0;

//     // Collect product-wise stock information
//     priceList.forEach((product, index) => {

//         const qty =
//             parseInt(
//                 document.getElementById(`inwardQty_${index}`).value
//             ) || 0;

//         if (qty > 0) {

//             // Calculate amount for individual product
//             const productAmount = qty * product.price;

//             items.push({

//                 product_id: product.id,

//                 quantity: qty,

//                 total_amount: productAmount

//             });

//             totalQuantity += qty;

//             totalAmount += productAmount;

//         }

//     });

//     // Validate stock quantity
//     if (items.length === 0) {

//         alert("Please enter stock quantity");

//         return;

//     }

//     try {

//         // Send stock details to backend
//         const response = await fetch("/add-stock", {

//             method: "POST",

//             headers: {

//                 "Content-Type": "application/json"

//             },

//             body: JSON.stringify({

//                 items: items

//             })

//         });

//         const result = await response.json();

//         // if (response.ok && result.success) {

//         //     // Refresh total inventory stock
//         //     await loadTotalStock();

//         //     // Display successful stock addition details
//         //     alert(
//         //         "Stock Added Successfully!\n\n" +
//         //         "Total Quantity: " + totalQuantity + "\n" +
//         //         "Total Amount: ₹" + totalAmount.toFixed(2)
//         //     );

//         //     closeModal();

//         // } 
//         if (response.ok && result.success) {

//     // ================================================================
//     // Store Last Stock Entry Product-wise Details
//     // ================================================================

//     lastStockEntryDetails = items.map((item) => {

//         const product = priceList.find(
//             (p) => p.id === item.product_id
//         );

//         return {

//             product_id: item.product_id,

//             name: product ? product.name : item.product_id,

//             size: product ? product.size : "-",

//             quantity: item.quantity,

//             total_amount: item.total_amount,

//             price: product ? product.price : 0

//         };

//     });

//     // Refresh total inventory stock
//     await loadTotalStock();

//     // Display successful stock addition details
//     alert(
//         "Stock Added Successfully!\n\n" +
//         "Total Quantity: " + totalQuantity + "\n" +
//         "Total Amount: ₹" + totalAmount.toFixed(2)
//     );

//     closeModal();

// }
//         else {

//             alert(
//                 "Stock Addition Failed!\n" +
//                 (result.message || "Unknown error")
//             );

//         }

//     } catch (error) {

//         console.error("Add Stock Error:", error);

//         alert("Unable to add stock. Please try again.");

//     }

// }


// =====================================================================
// End of Add Stock Frontend Enhancement
// =====================================================================


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

// // DIRECT COUNTER SHOP SALE MODAL
// function openCounterSaleModal() {
//   const html = `
//         <div class="form-group">
//             <label>Total Shop Cash Collected Today (₹)</label>
//             <input type="number" class="form-control" placeholder="Enter amount..." value="4500">
//         </div>
//         <button class="btn btn-primary btn-block" onclick="saveToReconcileDailySales()"><i class="fa-solid fa-check-circle"></i> Save to Reconcile Daily Sales</button>
//     `;
//   openModal("Direct Shop Counter Sale Entry", html);
// }



// Developer: Gaurav Choudhary
// Date: 23-11-2026
// Task: Counter Sales - Total Sales Integration
// Description: Save daily counter collection through backend API.

function openCounterSaleModal() {

    const html = `
        <div class="form-group">

            <label>Total Shop Cash Collected Today (₹)</label>

            <input
                type="number"
                id="counterSaleAmount"
                class="form-control"
                placeholder="Enter today's total collection..."
                min="0.01"
                step="0.01"
            >

        </div>

        <button
            id="counterSaleSaveBtn"
            class="btn btn-primary btn-block"
            onclick="saveToReconcileDailySales()"
        >
            <i class="fa-solid fa-check-circle"></i>
            Save to Reconcile Daily Sales
        </button>
    `;

    openModal("Direct Shop Counter Sale Entry", html);

}


async function saveToReconcileDailySales() {

    const amountInput =
        document.getElementById("counterSaleAmount");

    const saveButton =
        document.getElementById("counterSaleSaveBtn");

    const totalAmount = Number(amountInput.value);

    if (!Number.isFinite(totalAmount) || totalAmount <= 0) {

        alert("Please enter a valid amount greater than zero.");

        return;

    }

    saveButton.disabled = true;

    saveButton.innerText = "Saving...";

    try {

        const response = await fetch("/save-counter-sale", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                total_amount: totalAmount
            })

        });

        const result = await response.json();

        if (!response.ok || !result.success) {

            throw new Error(
                result.message || "Counter sale could not be saved."
            );

        }

        await loadTotalSales();

        alert("Daily counter sale saved successfully!");

        closeModal();

    } catch (error) {

        alert("Error: " + error.message);

        saveButton.disabled = false;

        saveButton.innerHTML =
            '<i class="fa-solid fa-check-circle"></i> Save to Reconcile Daily Sales';

    }

}

// function saveToReconcileDailySales() {
//   alert("Daily counter sale reconciled & saved successfully!");
//   closeModal();
// }

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

            <label>Partner Name</label>

            <input
                type="text"
                id="partnerName"
                class="form-control"
            >

        </div>

        <div class="form-group">

            <label>Mobile Number</label>

            <input
                type="text"
                id="partnerMobile"
                class="form-control"
            >

        </div>

        <div class="form-group">

            <label>Address</label>

            <textarea
                id="partnerAddress"
                class="form-control"
            ></textarea>

        </div>

        <button
            class="btn btn-primary btn-block"
            onclick="savePartner()"
        >

            Save Partner

        </button>

    `;

    openModal(
        "Add Delivery Partner",
        html
    );
}

async function savePartner() {

    const partner_name =
    document.getElementById(
        "partnerName"
    ).value;

    const mobile_no =
    document.getElementById(
        "partnerMobile"
    ).value;

    const address =
    document.getElementById(
        "partnerAddress"
    ).value;

    const response =
    await fetch("/add-partner", {

        method: "POST",

        headers: {

            "Content-Type":
            "application/json"

        },

        body: JSON.stringify({

            partner_name,

            mobile_no,

            address

        })

    });

    const result =
    await response.json();

    if(result.success){

        alert(
            "Partner Added Successfully"
        );

        closeModal();

    }

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


async function openTotalStockDetails() {

    // Show loading message
    openModal(
        "Total Central Stock",
        `
            <div style="text-align:center;padding:25px;">
                <p>Loading inventory details...</p>
            </div>
        `
    );

    try {

        // Fetch actual inventory data from database
        const response = await fetch("/get-available-stock");

        if (!response.ok) {
            throw new Error("Unable to fetch inventory data");
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(
                result.message || "Inventory data not available"
            );
        }

        const products = result.products || [];

        // Calculate business summary
        const totalQuantity = products.reduce(
            (sum, product) =>
                sum + Number(product.available_quantity || 0),
            0
        );

        const totalValue = products.reduce(
            (sum, product) =>
                sum +
                (
                    Number(product.available_quantity || 0) *
                    Number(product.rate || 0)
                ),
            0
        );

        const totalProducts = products.length;

        const outOfStock = products.filter(
            product =>
                Number(product.available_quantity || 0) === 0
        ).length;

        const activeProducts = totalProducts - outOfStock;

        // Currency formatter
        const formatCurrency = amount =>
            "₹" + Number(amount).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

        // Product-wise inventory table
        const productRows = products.map(product => {

            const quantity =
                Number(product.available_quantity || 0);

            const rate =
                Number(product.rate || 0);

            const stockValue = quantity * rate;

            const stockStatus =
                quantity === 0
                    ? `<span style="color:#dc2626;font-weight:600;">
                        Out of Stock
                       </span>`
                    : `<span style="color:#16a34a;font-weight:600;">
                        Available
                       </span>`;

            return `
                <tr>

                    <td>${product.product_id}</td>

                    <td>${product.product_name}</td>

                    <td>${product.pack_size}</td>

                    <td style="font-weight:600;">
                        ${quantity}
                    </td>

                    <td>
                        ${formatCurrency(rate)}
                    </td>

                    <td style="font-weight:600;">
                        ${formatCurrency(stockValue)}
                    </td>

                    <td>
                        ${stockStatus}
                    </td>

                </tr>
            `;

        }).join("");

        // Complete business report
        const html = `

            <div style="margin-bottom:18px;">

                <h3 style="margin-bottom:5px;">
                    Central Warehouse Inventory
                </h3>

                <p style="color:#64748b;font-size:13px;">
                    Current inventory position and product-wise valuation
                </p>

            </div>

            <div style="
                display:grid;
                grid-template-columns:repeat(auto-fit,minmax(140px,1fr));
                gap:12px;
                margin-bottom:20px;
            ">

                <div style="
                    background:#eff6ff;
                    padding:15px;
                    border-radius:10px;
                ">
                    <div style="font-size:12px;color:#64748b;">
                        Total Stock
                    </div>

                    <div style="
                        font-size:23px;
                        font-weight:700;
                        color:#1d4ed8;
                    ">
                        ${totalQuantity.toLocaleString("en-IN")}
                    </div>
                    <div style="font-size:11px;color:#64748b;">
                        Units
                    </div>
                </div>

                <div style="
                    background:#f0fdf4;
                    padding:15px;
                    border-radius:10px;
                ">
                    <div style="font-size:12px;color:#64748b;">
                        Inventory Value
                    </div>

                    <div style="
                        font-size:21px;
                        font-weight:700;
                        color:#15803d;
                    ">
                        ${formatCurrency(totalValue)}
                    </div>
                </div>

                <div style="
                    background:#f8fafc;
                    padding:15px;
                    border-radius:10px;
                ">
                    <div style="font-size:12px;color:#64748b;">
                        Total Products
                    </div>

                    <div style="
                        font-size:23px;
                        font-weight:700;
                    ">
                        ${totalProducts}
                    </div>
                </div>

                <div style="
                    background:#fef2f2;
                    padding:15px;
                    border-radius:10px;
                ">
                    <div style="font-size:12px;color:#64748b;">
                        Out of Stock
                    </div>

                    <div style="
                        font-size:23px;
                        font-weight:700;
                        color:#dc2626;
                    ">
                        ${outOfStock}
                    </div>
                </div>

            </div>

            <div style="
                display:flex;
                justify-content:space-between;
                gap:10px;
                flex-wrap:wrap;
                margin-bottom:12px;
                font-size:13px;
            ">

                <span>
                    <strong>Available Products:</strong>
                    ${activeProducts}
                </span>

                <span>
                    <strong>Out of Stock:</strong>
                    ${outOfStock}
                </span>

            </div>

            <h4 style="margin-bottom:10px;">
                Product-wise Stock Details
            </h4>

            <div style="overflow-x:auto;">

                <table class="data-table">

                    <thead>
                        <tr>
                            <th>Product ID</th>
                            <th>Product Name</th>
                            <th>Pack Size</th>
                            <th>Available Qty</th>
                            <th>Rate</th>
                            <th>Stock Value</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>

                        ${
                            products.length > 0
                                ? productRows
                                : `
                                    <tr>
                                        <td colspan="7"
                                            style="text-align:center;">
                                            No inventory products found
                                        </td>
                                    </tr>
                                `
                        }

                    </tbody>

                </table>

            </div>

            <p style="
                margin-top:15px;
                font-size:11px;
                color:#64748b;
            ">
                Note: Inventory value is calculated using
                current available quantity × product rate.
            </p>

        `;

        // Display actual database information
        openModal("Total Central Stock", html);

    }
    catch(error) {

        console.error(
            "TOTAL STOCK DETAILS ERROR:",
            error
        );

        openModal(
            "Total Central Stock",
            `
                <div style="
                    padding:20px;
                    color:#dc2626;
                    text-align:center;
                ">
                    Unable to load inventory details.
                    <p style="font-size:12px;margin-top:8px;">
                        ${error.message}
                    </p>
                </div>
            `
        );

    }

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

// function getSalesDetailHtml() {
//   return `<table class="data-table">
//         <tr><th>Date</th><th>Total Revenue</th></tr>
//         <tr><td>Today</td><td>₹14,520</td></tr>
//         <tr><td>Yesterday</td><td>₹18,200</td></tr>
//     </table>`;
// }


// Developer: Gaurav Choudhary
// Date: 23-11-2026
// Task: Counter Sales - Total Sales Integration
// Description: Display database-driven daily sales in detail sheet.

function getSalesDetailHtml() {

    return `
        <table class="data-table">

            <tr>
                <th>Date</th>
                <th>Total Revenue</th>
            </tr>

            <tr>
                <td>Today</td>

                <td>
                    ₹${totalSalesToday.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}
                </td>
            </tr>

        </table>
    `;

}


// ======================================================
// TOTAL SALES - COMPLETE BUSINESS DETAILS
// ======================================================

async function openTotalSalesDetails() {

    try {

        openModal(
            "Today's Total Sales Details",
            `<div style="text-align:center; padding:20px;">
                <i class="fa-solid fa-spinner fa-spin"></i>
                <p>Loading sales details...</p>
            </div>`
        );

        const response = await fetch("/get-total-sales-details");
        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Unable to load sales details");
        }

        const formatAmount = (amount) =>
            Number(amount || 0).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

        const escapeHtml = (value) =>
            String(value ?? "").replace(/[&<>"']/g, char => ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            }[char]));

        const summary = data.summary || {};

        const counterRows = (data.counter_transactions || [])
            .map(item => `
                <tr>
                    <td>#${escapeHtml(item.transaction_id)}</td>
                    <td>${escapeHtml(item.created_at)}</td>
                    <td>${escapeHtml(item.sale_date)}</td>
                    <td style="font-weight:700;">
                        ₹${formatAmount(item.total_amount)}
                    </td>
                </tr>
            `).join("");

        const partnerRows = (data.partner_transactions || [])
            .map(item => `
                <tr>
                    <td>${escapeHtml(item.partner_name)}</td>
                    <td>${escapeHtml(item.product_name)}</td>
                    <td>${escapeHtml(item.quantity)}</td>
                    <td>₹${formatAmount(item.rate)}</td>
                    <td>₹${formatAmount(item.cash_amount)}</td>
                    <td>₹${formatAmount(item.online_amount)}</td>
                    <td>₹${formatAmount(item.credit_amount)}</td>
                    <td>${escapeHtml(item.created_at)}</td>
                </tr>
            `).join("");

        const html = `
            <div style="padding:5px;">

                <div style="
                    background:var(--primary-blue);
                    color:white;
                    padding:18px;
                    border-radius:10px;
                    margin-bottom:18px;
                    text-align:center;
                ">
                    <div style="font-size:13px;">TOTAL SALES - ${escapeHtml(data.date)}</div>
                    <div style="font-size:28px; font-weight:800; margin-top:6px;">
                        ₹${formatAmount(summary.total_sales)}
                    </div>
                </div>

                <h4>Sales Summary</h4>

                <table class="data-table">
                    <tr><th>Category</th><th>Amount</th></tr>
                    <tr>
                        <td>Counter Sales</td>
                        <td>₹${formatAmount(summary.counter_sales)}</td>
                    </tr>
                    <tr>
                        <td>Driver Cash</td>
                        <td>₹${formatAmount(summary.driver_cash)}</td>
                    </tr>
                    <tr>
                        <td>Driver Online</td>
                        <td>₹${formatAmount(summary.driver_online)}</td>
                    </tr>
                    <tr>
                        <td>Driver Credit</td>
                        <td>₹${formatAmount(summary.driver_credit)}</td>
                    </tr>
                    <tr style="font-weight:800;">
                        <td>Total Sales</td>
                        <td>₹${formatAmount(summary.total_sales)}</td>
                    </tr>
                </table>

                <h4 style="margin-top:22px;">Counter Sales Transactions</h4>

                <div style="overflow-x:auto;">
                    <table class="data-table">
                        <tr>
                            <th>Transaction ID</th>
                            <th>Time</th>
                            <th>Date</th>
                            <th>Amount</th>
                        </tr>
                        ${counterRows || `
                            <tr><td colspan="4" style="text-align:center;">
                                No counter sales found today
                            </td></tr>
                        `}
                    </table>
                </div>

                <h4 style="margin-top:22px;">Driver / Partner Sales Details</h4>

                <div style="overflow-x:auto;">
                    <table class="data-table">
                        <tr>
                            <th>Driver</th>
                            <th>Product</th>
                            <th>Qty</th>
                            <th>Rate</th>
                            <th>Cash</th>
                            <th>Online</th>
                            <th>Credit</th>
                            <th>Time</th>
                        </tr>
                        ${partnerRows || `
                            <tr><td colspan="8" style="text-align:center;">
                                No driver transactions found today
                            </td></tr>
                        `}
                    </table>
                </div>

            </div>
        `;

        openModal("Today's Total Sales Details", html);

    } catch (error) {

        console.error("Total Sales Details Error:", error);

        openModal(
            "Total Sales Details",
            `<p style="color:red; padding:15px;">
                Failed to load sales details: ${error.message}
            </p>`
        );

    }
}



// function getPendingDuesDetailHtml() {
//   return `<table class="data-table">
//         <tr><th>Customer</th><th>Due Date</th><th>Amount</th></tr>
//         ${state.customers
//           .filter((c) => c.dues > 0)
//           .map(
//             (c) => `
//             <tr><td>${c.name}</td><td>10 Aug 2026</td><td style="color:red; font-weight:700;">₹${c.dues}</td></tr>
//         `,
//           )
//           .join("")}
//     </table>`;
// }

async function openPendingAmountDetails() {

    // Show loading state first
    openModal(
        "Pending Amount Details",
        `<p style="padding:20px; text-align:center;">
            Loading pending amount details...
        </p>`
    );

    try {

        const response = await fetch("/get-pending-amount-summary");

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Unable to load pending details.");
        }

        const summary = data.summary || {};
        const partners = data.partners || [];

        const formatAmount = (amount) =>
            Number(amount || 0).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

        // Escape database values before inserting them into HTML
        const escapeHtml = (value) =>
            String(value ?? "").replace(/[&<>"']/g, char => ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            })[char]);

        const partnerRows = partners.length
            ? partners.map(partner => `
                <tr>
                    <td>${escapeHtml(partner.partner_name)}</td>
                    <td style="text-align:right;">
                        ₹${formatAmount(partner.total_credit)}
                    </td>
                    <td style="text-align:right;">
                        ₹${formatAmount(partner.total_paid)}
                    </td>
                    <td style="text-align:right; color:#dc2626; font-weight:700;">
                        ₹${formatAmount(partner.outstanding)}
                    </td>
                </tr>
            `).join("")
            : `
                <tr>
                    <td colspan="4" style="text-align:center; padding:15px;">
                        No delivery partner outstanding found.
                    </td>
                </tr>
            `;

        const html = `
            <div style="padding:12px;">

                <div style="
                    background:#EBF5FF;
                    padding:16px;
                    border-radius:10px;
                    margin-bottom:15px;
                ">
                    <div style="color:#475569; font-size:13px;">
                        Total Pending Amount
                    </div>

                    <div style="
                        font-size:26px;
                        font-weight:800;
                        color:#dc2626;
                        margin-top:5px;
                    ">
                        ₹${formatAmount(summary.total_pending)}
                    </div>
                </div>

                <div style="
                    display:grid;
                    grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
                    gap:10px;
                    margin-bottom:20px;
                ">

                    <div style="
                        padding:13px;
                        border:1px solid #e2e8f0;
                        border-radius:8px;
                    ">
                        <small>Partner Outstanding</small>
                        <h3 style="margin-top:6px;">
                            ₹${formatAmount(summary.partner_outstanding)}
                        </h3>
                    </div>

                    <div style="
                        padding:13px;
                        border:1px solid #e2e8f0;
                        border-radius:8px;
                    ">
                        <small>Customer Outstanding</small>
                        <h3 style="margin-top:6px;">
                            ₹${formatAmount(summary.customer_outstanding)}
                        </h3>
                    </div>

                </div>

                <h3 style="margin-bottom:10px;">
                    Delivery Partner Breakdown
                </h3>

                <div style="overflow-x:auto;">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Partner</th>
                                <th>Total Credit</th>
                                <th>Payment Received</th>
                                <th>Outstanding</th>
                            </tr>
                        </thead>

                        <tbody>
                            ${partnerRows}
                        </tbody>
                    </table>
                </div>

                <div style="
                    margin-top:18px;
                    padding:12px;
                    background:#f8fafc;
                    border-radius:8px;
                    color:#64748b;
                    font-size:13px;
                ">
                    <strong>Customer Ledger:</strong>
                    Customer outstanding integration will be enabled
                    when the Customer Tab ledger is implemented.
                </div>

            </div>
        `;

        openModal("Pending Amount Details", html);

    } catch (error) {

        console.error("Pending Amount Details Error:", error);

        openModal(
            "Pending Amount Details",
            `<p style="padding:20px; color:#dc2626;">
                Unable to load details: ${escapeHtml(error.message)}
            </p>`
        );

    }
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



// Modal open karne ka function
function openPartnerStatusModal() {
    document.getElementById("partnerStatusModal").style.display = "flex";
}

// Modal close karne ka function
function closePartnerStatusModal() {
    document.getElementById("partnerStatusModal").style.display = "none";
}

// Agar user modal ke bahaar click kare toh bhi close ho jaye
window.onclick = function(event) {
    var modal = document.getElementById("partnerStatusModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Main Customer Modal Open/Close
function openCustomersModal() {
    document.getElementById("customersModal").style.display = "flex";
}
function closeCustomersModal() {
    document.getElementById("customersModal").style.display = "none";
}

// Open Real Bill Invoice Popup
function openRealBill(invId, date, partner, customer, received, due) {
    document.getElementById("billId").innerText = "#" + invId;
    document.getElementById("billDate").innerText = date;
    document.getElementById("billPartner").innerText = partner;
    document.getElementById("billCustomer").innerText = customer;
    document.getElementById("billRecAmount").innerText = received;
    document.getElementById("billDueAmount").innerText = due;
    
    document.getElementById("realBillModal").style.display = "flex";
}
function closeRealBill() {
    document.getElementById("realBillModal").style.display = "none";
}

// Live Search & Date Filtering Code
function filterCustomerTable() {
    let searchVal = document.getElementById("searchFilter").value.toLowerCase();
    let dateVal = document.getElementById("dateFilter").value;
    let table = document.getElementById("customerTable");
    let trs = table.getElementsByTagName("tbody")[0].getElementsByTagName("tr");

    for (let i = 0; i < trs.length; i++) {
        let textContent = trs[i].textContent.toLowerCase();
        let rowDate = trs[i].getAttribute("data-date"); // YYYY-MM-DD
        
        let matchesSearch = textContent.includes(searchVal);
        let matchesDate = true;
        
        if (dateVal) {
            matchesDate = (rowDate === dateVal);
        }
        
        if (matchesSearch && matchesDate) {
            trs[i].style.display = "";
        } else {
            trs[i].style.display = "none";
        }
    }
}

// Reset Button Clear Trigger
function clearFilters() {
    document.getElementById("searchFilter").value = "";
    document.getElementById("dateFilter").value = "";
    filterCustomerTable();
}

// Close Modals on Outside Click
window.onclick = function(event) {
    let custModal = document.getElementById("customersModal");
    let billModal = document.getElementById("realBillModal");
    if (event.target == custModal) {
        custModal.style.display = "none";
    }
    if (event.target == billModal) {
        billModal.style.display = "none";
    }
}


function filterCustomerTable() {
    let searchVal = document.getElementById("searchFilter").value.toLowerCase();
    let dateVal = document.getElementById("dateFilter").value;
    
    // Rows ki jagah div elements select karega
    let container = document.getElementById("customerTable");
    let cards = container.getElementsByClassName("app-customer-card");

    for (let i = 0; i < cards.length; i++) {
        let textContent = cards[i].textContent.toLowerCase();
        let cardDate = cards[i].getAttribute("data-date"); // YYYY-MM-DD
        
        let matchesSearch = textContent.includes(searchVal);
        let matchesDate = true;
        
        if (dateVal) {
            matchesDate = (cardDate === dateVal);
        }
        
        if (matchesSearch && matchesDate) {
            cards[i].style.display = "flex"; // Mobile layouts standard flex display
        } else {
            cards[i].style.display = "none";
        }
    }
}

