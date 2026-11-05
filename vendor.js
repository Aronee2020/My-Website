
import { db } from "./firebase.js";

import {
  collection,
  doc,
  onSnapshot,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const bookings = new Map();
const vendorData = new Map();

const tbody = document.getElementById("vendorTableBody");
const status = document.getElementById("statusMessage");
const search = document.getElementById("vendorSearch");
const fromDate = document.getElementById("fromDate");
const toDate = document.getElementById("toDate");
const num = v =>
  Number.isFinite(Number(v)) ? Number(v) : 0;

const money = v => num(v).toFixed(2);

const esc = v =>
  String(v ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));

const defaults = d => ({
  customerAdditionalRate: 0,
  balanceMode: "",
  hbAmount: 0,
  tacAmount: null,
  tacManual: false,
  vendorAdditionalRate: 0,
  advancePaid: 0,
  vendorAdvanceModeDate: "",
  paidCustomerToBoat: 0,
  ...(d || {})
});


// ============================================
// VENDOR CALCULATIONS
// ============================================

function calc(d) {

  const hbAmount = num(d.hbAmount);
  const extra = num(d.vendorAdditionalRate);

  // TAC = 10% of HB Amount unless manually changed.
  const tac = d.tacManual
    ? num(d.tacAmount)
    : hbAmount * 0.10;

  // HB Balance does not include Additional Rate.
  const hbBalance = hbAmount - tac;

  // Additional Rate is added only to Vendor Total.
  const total = hbBalance + extra;

  // Final amount payable to the vendor.
  const balancePayable =
    total -
    num(d.advancePaid) -
    num(d.paidCustomerToBoat);

  return {
    tac,
    hbBalance,
    total,
    balancePayable
  };
}// ============================================
// INPUT FIELD
// ============================================

function input(field, value, type = "number") {

  const step = type === "number"
    ? 'step="0.01" min="0"'
    : "";

  return `
    <input
      data-field="${field}"
      type="${type}"
      ${step}
      value="${esc(value ?? "")}"
      aria-label="${field}">
  `;
}


function textCell(value) {
  return `<td class="customer-cell">${esc(value ?? "")}</td>`;
}


// ============================================
// DISPLAY BOOKING ROW
// ============================================

function renderRow(b) {

  const id = b.firebaseId;

  const d = defaults(vendorData.get(id));

  const c = calc(d);

  const pax =
    `A: ${b.adults || 0} / C: ${b.children || 0} / K: ${b.kids || 0}`;

  const extras = [
    b.specialNote,
    b.specialInstruction
  ].filter(Boolean).join(" | ");

  // Customer Total Amount is separate from HB Amount.
  const customerTotal =
    num(b.totalAmount) +
    num(d.customerAdditionalRate);

  const customerBalance =
    num(b.totalBalance || b.balanceAmount) +
    num(d.customerAdditionalRate);

  return `
    <tr data-id="${esc(id)}">

      ${textCell(b.customerId)}
      ${textCell(b.cruiseDate)}
      ${textCell(b.guestName)}
      ${textCell(b.checkInPoint)}
      ${textCell(b.mobile)}

      ${textCell(pax)}
      ${textCell(b.package)}
      ${textCell(b.foodMenu)}
      ${textCell(extras)}
      ${textCell(b.packageAmount)}

      <td>
        ${input("customerAdditionalRate", d.customerAdditionalRate)}
      </td>

      ${textCell(money(customerTotal))}
      ${textCell(b.advanceReceived)}
      ${textCell(b.advanceMode)}
      ${textCell(money(customerBalance))}

      <td>
        ${input("balanceMode", d.balanceMode, "text")}
      </td>

      ${textCell(b.houseboatName)}

      <!-- 18. HB Amount -->
      <td>
        ${input("hbAmount", d.hbAmount)}
      </td>

      <!-- 19. TAC -->
      <td class="tac-wrap">
        ${input("tacAmount", c.tac)}
        <button type="button" data-action="auto-tac">
          Auto 10%
        </button>
      </td>

      <!-- 20. Vendor Balance -->
<td class="calc-hb-balance">
  ${money(c.hbBalance)}
</td>

      <!-- 21. Additional Rate -->
      <td>
        ${input("vendorAdditionalRate", d.vendorAdditionalRate)}
      </td>

      <!-- 22. Vendor Total Amount -->
      <td class="calc-vendor-total">
        ${money(c.total)}
      </td>

      <!-- 23. Advance Paid -->
      <td>
        ${input("advancePaid", d.advancePaid)}
      </td>

      <!-- 24. Advance Mode & Date -->
      <td>
        ${input("vendorAdvanceModeDate", d.vendorAdvanceModeDate, "text")}
      </td>

      <!-- 25. Paid Customer to Boat -->
      <td>
        ${input("paidCustomerToBoat", d.paidCustomerToBoat)}
      </td>

      <!-- 26. Balance Payable -->
      <td class="calc-balance-payable">
        ${money(c.balance)}
      </td>

      <!-- 27. Aronee -->
      <td class="calc-aronee">
        ${money(customerTotal - c.total)}
      </td>

    </tr>
  `;
}
// ============================================
// HOUSEBOAT PROFIT AND MONTHLY REPORT
// ============================================

function formatRupees(amount) {

  return "₹" + num(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

}


function renderSummary(rows) {

  let customerTotal = 0;
  let vendorTotal = 0;
  let profitTotal = 0;

  const monthly = {};

  rows.forEach(b => {

    const d = defaults(vendorData.get(b.firebaseId));

    const c = calc(d);

    const customerAmount =
      num(b.totalAmount) +
      num(d.customerAdditionalRate);

    const vendorAmount = c.total;

    const profit = customerAmount - vendorAmount;

    customerTotal += customerAmount;
    vendorTotal += vendorAmount;
    profitTotal += profit;

    const date = b.cruiseDate || "";

    const monthKey = date.length >= 7
      ? date.substring(0, 7)
      : "No Date";

    if (!monthly[monthKey]) {

      monthly[monthKey] = {
        bookings: 0,
        customer: 0,
        vendor: 0,
        profit: 0
      };

    }

    monthly[monthKey].bookings++;

    monthly[monthKey].customer += customerAmount;

    monthly[monthKey].vendor += vendorAmount;

    monthly[monthKey].profit += profit;

  });


  document.getElementById("totalCustomerCollection")
    .textContent = formatRupees(customerTotal);

  document.getElementById("totalVendorPayment")
    .textContent = formatRupees(vendorTotal);

  document.getElementById("totalAroneeProfit")
    .textContent = formatRupees(profitTotal);


  const monthlyBody =
    document.getElementById("monthlyProfitBody");

  const monthKeys = Object.keys(monthly).sort();

  monthlyBody.innerHTML = monthKeys.length
    ? monthKeys.map(key => {

        const m = monthly[key];

        const monthName = key === "No Date"
          ? "Date Not Available"
          : new Date(key + "-01T00:00:00")
              .toLocaleDateString("en-IN", {
                month: "long",
                year: "numeric"
              });

        return `
          <tr>
            <td>${esc(monthName)}</td>
            <td>${m.bookings}</td>
            <td>${formatRupees(m.customer)}</td>
            <td>${formatRupees(m.vendor)}</td>
            <td>${formatRupees(m.profit)}</td>
          </tr>
        `;

      }).join("")
    : `
      <tr>
        <td colspan="5" class="text-center">
          No records available
        </td>
      </tr>
    `;

}

// ============================================
// RENDER BOOKINGS
// ============================================

function render() {

  const q = search.value.trim().toLowerCase();

  const from = fromDate.value;
  const to = toDate.value;

  const rows = [...bookings.values()]
    .filter(b => {

      const date = b.cruiseDate || "";

      // FROM DATE FILTER
      if (from && (!date || date < from)) {
        return false;
      }

      // TO DATE FILTER
      if (to && (!date || date > to)) {
        return false;
      }

      // SEARCH FILTER
      if (!q) {
        return true;
      }

      return [
        b.customerId,
        b.bookingId,
        b.guestName,
        b.mobile,
        b.houseboatName,
        b.checkInPoint,
        b.package
      ].join(" ").toLowerCase().includes(q);

    })
    .sort((a, b) =>
      String(b.cruiseDate || "")
        .localeCompare(String(a.cruiseDate || ""))
    );

  // DISPLAY BOOKINGS
  tbody.innerHTML = rows.length
    ? rows.map(renderRow).join("")
    : `
      <tr>
        <td colspan="27" class="text-center py-4">
          No matching bookings found.
        </td>
      </tr>
    `;

  // UPDATE FINANCIAL REPORT
  renderSummary(rows);

  status.textContent =
    `${rows.length} booking(s) displayed.`;

}
// ============================================
// READ INPUT VALUES
// ============================================

function readRow(tr) {

  const d = {};

  tr.querySelectorAll("[data-field]").forEach(el => {

    d[el.dataset.field] =
      el.type === "number"
        ? num(el.value)
        : el.value.trim();

  });

  return d;
}


// ============================================
// REFRESH CALCULATIONS
// ============================================

function refreshCalculations(tr) {

  const old = defaults(vendorData.get(tr.dataset.id));
  const values = readRow(tr);

  const tac = tr.querySelector('[data-field="tacAmount"]');

  const d = {
    ...old,
    ...values,
    tacManual:
      old.tacManual ||
      tac.dataset.userEdited === "true"
  };

  d.tacAmount = num(tac.value);

  const c = calc(d);
  const b = bookings.get(tr.dataset.id);

  const customerTotal =
    num(b.totalAmount) +
    num(d.customerAdditionalRate);

  tr.querySelector(".calc-hb-balance").textContent =
    money(c.hbBalance);

  tr.querySelector(".calc-vendor-total").textContent =
    money(c.total);

  tr.querySelector(".calc-balance-payable").textContent =
    money(c.balancePayable);

  tr.querySelector(".calc-aronee").textContent =
    money(customerTotal - c.total);
  
}
// ============================================
// SAVE VENDOR DETAILS
// ============================================

async function saveRow(tr) {

  const id = tr.dataset.id;

  const old = defaults(vendorData.get(id));

  const values = readRow(tr);

  const tac = tr.querySelector('[data-field="tacAmount"]');

  const d = {
    ...old,
    ...values,
    tacManual:
      old.tacManual ||
      tac.dataset.userEdited === "true"
  };

  const c = calc(d);

Object.assign(d, {
  tacAmount: c.tac,
  hbBalance: c.hbBalance,
  vendorTotalAmount: c.total,
  balancePayable: c.balancePayable,
  updatedAt: new Date().toISOString()
});

  try {

    await setDoc(
      doc(db, "vendorDetails", id),
      d,
      { merge: true }
    );

 vendorData.set(id, d);

tac.value = money(c.tac);
tac.dataset.userEdited = "false";

refreshCalculations(tr);

// Refresh profit and monthly report after saving.
render();

status.textContent =
  `Saved vendor details for ${
    bookings.get(id)?.customerId || id
  }.`;

  } catch (e) {

    console.error(e);

    status.textContent =
      `Save failed: ${e.message}`;

    alert(
      "Vendor details could not be saved. " +
      "Check Firebase connection and Firestore rules.\n\n" +
      e.message
    );
  }
}


// ============================================
// INPUT EVENT
// ============================================

tbody.addEventListener("input", e => {

  const el = e.target.closest("[data-field]");

  if (!el) return;

  if (el.dataset.field === "tacAmount") {
    el.dataset.userEdited = "true";
  }

  refreshCalculations(el.closest("tr"));
});


// ============================================
// SAVE WHEN FIELD CHANGES
// ============================================

tbody.addEventListener("change", e => {

  const el = e.target.closest("[data-field]");

  if (el) {
    saveRow(el.closest("tr"));
  }
});


// ============================================
// AUTO TAC BUTTON
// ============================================

tbody.addEventListener("click", async e => {

  const btn = e.target.closest('[data-action="auto-tac"]');

  if (!btn) return;

  const tr = btn.closest("tr");

  const id = tr.dataset.id;

  const old = defaults(vendorData.get(id));

  const values = readRow(tr);

  const d = {
    ...old,
    ...values,
    tacManual: false
  };

  const c = calc(d);

d.tacAmount = c.tac;
d.hbBalance = c.hbBalance;
d.vendorTotalAmount = c.total;
d.balancePayable = c.balancePayable;
  d.updatedAt = new Date().toISOString();

  try {

    await setDoc(
      doc(db, "vendorDetails", id),
      d,
      { merge: true }
    );

    vendorData.set(id, d);

    const tac = tr.querySelector('[data-field="tacAmount"]');

    tac.value = money(c.tac);
    tac.dataset.userEdited = "false";

    refreshCalculations(tr);

    status.textContent =
      "TAC reset to automatic 10%.";

  } catch (err) {

    alert("Could not reset TAC: " + err.message);

  }
});


// ============================================
// FILTERS
// ============================================

search.addEventListener("input", render);

fromDate.addEventListener("change", render);

toDate.addEventListener("change", render);

document.getElementById("clearFilters").addEventListener("click", () => {

  search.value = "";
  dateFilter.value = "";

  render();

});

document.getElementById("refreshData").addEventListener("click", render);


// ============================================
// EXPORT CSV
// ============================================

document.getElementById("exportCsv").addEventListener("click", () => {

  const lines = [
    ...document.querySelectorAll("#vendorTable tr")
  ].map(tr => {

    return [...tr.children].map(td => {

      const el = td.querySelector("input");

      const value = el ? el.value : td.innerText;

      return '"' + String(value).replace(/"/g, '""') + '"';

    }).join(",");

  });

  const blob = new Blob(
    ["\uFEFF" + lines.join("\r\n")],
    { type: "text/csv;charset=utf-8;" }
  );

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;
  a.download = "Aronee-Vendor-Details.csv";

  a.click();

  URL.revokeObjectURL(url);

});


// ============================================
// FIREBASE - BOOKINGS
// ============================================

onSnapshot(
  collection(db, "bookings"),

  snap => {

    bookings.clear();

    snap.forEach(d => {

      bookings.set(d.id, {
        firebaseId: d.id,
        ...d.data()
      });

    });

    render();

  },

  err => {

    status.textContent =
      "Unable to load bookings: " + err.message;

  }
);


// ============================================
// FIREBASE - VENDOR DETAILS
// ============================================

onSnapshot(
  collection(db, "vendorDetails"),

  snap => {

    vendorData.clear();

    snap.forEach(d => {

      vendorData.set(d.id, d.data());

    });

    render();

  },

  err => {

    status.textContent =
      "Unable to load vendor entries: " + err.message;

  }
);
