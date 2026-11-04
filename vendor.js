import { db } from "./firebase.js";
import { collection, doc, onSnapshot, setDoc } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const bookings = new Map();
const vendorData = new Map();
const tbody = document.getElementById("vendorTableBody");
const status = document.getElementById("statusMessage");
const search = document.getElementById("vendorSearch");
const dateFilter = document.getElementById("dateFilter");

const num = v => Number.isFinite(Number(v)) ? Number(v) : 0;
const money = v => num(v).toFixed(2);
const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const defaults = d => ({customerAdditionalRate:0,balanceMode:"",hbAmount:0,vendorAmount:0,tacAmount:null,tacManual:false,vendorAdditionalRate:0,advancePaid:0,vendorAdvanceModeDate:"",paidCustomerToBoat:0,...(d||{})});

function calc(d){
  const base = num(d.vendorAmount), extra = num(d.vendorAdditionalRate);
  // TAC is 10% of the final Vendor Total, not 10% of Vendor Amount.
  const tac = d.tacManual ? num(d.tacAmount) : (base + extra) / 11;
  const total = base - tac + extra;
  const balance = total - num(d.advancePaid) - num(d.paidCustomerToBoat);
  return {tac,total,balance};
}
function input(field,value,type="number"){
  const step = type==="number" ? 'step="0.01" min="0"' : "";
  return `<input data-field="${field}" type="${type}" ${step} value="${esc(value ?? "")}" aria-label="${field}">`;
}
function textCell(value){return `<td class="customer-cell">${esc(value ?? "")}</td>`;}
function renderRow(b){
  const id=b.firebaseId, d=defaults(vendorData.get(id)), c=calc(d);
  const pax=`A: ${b.adults||0} / C: ${b.children||0} / K: ${b.kids||0}`;
  const extras=[b.specialNote,b.specialInstruction].filter(Boolean).join(" | ");
  const customerTotal=num(b.totalAmount)+num(d.customerAdditionalRate);
  const customerBalance=num(b.totalBalance || b.balanceAmount)+num(d.customerAdditionalRate);
  return `<tr data-id="${esc(id)}">
    ${textCell(b.customerId)}${textCell(b.cruiseDate)}${textCell(b.guestName)}${textCell(b.checkInPoint)}${textCell(b.mobile)}
    ${textCell(pax)}${textCell(b.package)}${textCell(b.foodMenu)}${textCell(extras)}${textCell(b.packageAmount)}
    <td>${input("customerAdditionalRate",d.customerAdditionalRate)}</td>${textCell(money(customerTotal))}
    ${textCell(b.advanceReceived)}${textCell(b.advanceMode)}${textCell(money(customerBalance))}
    <td>${input("balanceMode",d.balanceMode,"text")}</td>
    ${textCell(b.houseboatName)}
    <td>${input("hbAmount",d.hbAmount)}</td><td>${input("vendorAmount",d.vendorAmount)}</td>
    <td class="tac-wrap">${input("tacAmount",c.tac)}<button type="button" data-action="auto-tac">Auto 10%</button></td>
    <td class="calc-vendor-balance">${money(c.balance)}</td>
    <td>${input("vendorAdditionalRate",d.vendorAdditionalRate)}</td><td class="calc-vendor-total">${money(c.total)}</td>
    <td>${input("advancePaid",d.advancePaid)}</td><td>${input("vendorAdvanceModeDate",d.vendorAdvanceModeDate,"text")}</td>
    <td>${input("paidCustomerToBoat",d.paidCustomerToBoat)}</td><td class="calc-balance-payable">${money(c.balance)}</td>
    <td class="calc-aronee">${money(customerTotal-c.total)}</td>
  </tr>`;
}
function render(){
  const q=search.value.trim().toLowerCase(), date=dateFilter.value;
  const rows=[...bookings.values()].filter(b=>{
    if(date && b.cruiseDate!==date)return false;
    if(!q)return true;
    return [b.customerId,b.bookingId,b.guestName,b.mobile,b.houseboatName,b.checkInPoint,b.package].join(" ").toLowerCase().includes(q);
  }).sort((a,b)=>String(b.cruiseDate||"").localeCompare(String(a.cruiseDate||"")));
  tbody.innerHTML=rows.length?rows.map(renderRow).join(""):'<tr><td colspan="28" class="text-center py-4">No matching bookings found.</td></tr>';
  status.textContent=`${rows.length} booking(s) displayed.`;
}
function readRow(tr){
  const d={};
  tr.querySelectorAll("[data-field]").forEach(el=>d[el.dataset.field]=el.type==="number"?num(el.value):el.value.trim());
  return d;
}
function refreshCalculations(tr){
  const old=defaults(vendorData.get(tr.dataset.id)), values=readRow(tr);
  const tac=tr.querySelector('[data-field="tacAmount"]');
  const d={...old,...values,tacManual:old.tacManual || tac.dataset.userEdited==="true"};
  d.tacAmount=num(tac.value);
  const c=calc(d), b=bookings.get(tr.dataset.id);
  tr.querySelector(".calc-vendor-balance").textContent=money(c.balance);
  tr.querySelector(".calc-vendor-total").textContent=money(c.total);
  tr.querySelector(".calc-balance-payable").textContent=money(c.balance);
  tr.querySelector(".calc-aronee").textContent=money(num(b.totalAmount)+num(d.customerAdditionalRate)-c.total);
}
async function saveRow(tr){
  const id=tr.dataset.id, old=defaults(vendorData.get(id)), values=readRow(tr);
  const tac=tr.querySelector('[data-field="tacAmount"]');
  const d={...old,...values,tacManual:old.tacManual || tac.dataset.userEdited==="true"};
  const c=calc(d);
  Object.assign(d,{tacAmount:c.tac,vendorTotalAmount:c.total,vendorBalance:c.balance,balancePayable:c.balance,updatedAt:new Date().toISOString()});
  try{
    await setDoc(doc(db,"vendorDetails",id),d,{merge:true});
    vendorData.set(id,d);
    tac.value=money(c.tac); tac.dataset.userEdited="false";
    refreshCalculations(tr);
    status.textContent=`Saved vendor details for ${bookings.get(id)?.customerId || id}.`;
  }catch(e){
    console.error(e); status.textContent=`Save failed: ${e.message}`;
    alert("Vendor details could not be saved. Check Firebase connection and Firestore rules.\\n\\n"+e.message);
  }
}
tbody.addEventListener("input",e=>{
  const el=e.target.closest("[data-field]"); if(!el)return;
  if(el.dataset.field==="tacAmount")el.dataset.userEdited="true";
  refreshCalculations(el.closest("tr"));
});
tbody.addEventListener("change",e=>{
  const el=e.target.closest("[data-field]"); if(el)saveRow(el.closest("tr"));
});
tbody.addEventListener("click",async e=>{
  const btn=e.target.closest('[data-action="auto-tac"]'); if(!btn)return;
  const tr=btn.closest("tr"), id=tr.dataset.id, old=defaults(vendorData.get(id)), values=readRow(tr);
  const d={...old,...values,tacManual:false}, c=calc(d);
  d.tacAmount=c.tac; d.vendorTotalAmount=c.total; d.vendorBalance=c.balance; d.balancePayable=c.balance;
  d.updatedAt=new Date().toISOString();
  try{
    await setDoc(doc(db,"vendorDetails",id),d,{merge:true});
    vendorData.set(id,d);
    const tac=tr.querySelector('[data-field="tacAmount"]'); tac.value=money(c.tac); tac.dataset.userEdited="false";
    refreshCalculations(tr); status.textContent="TAC reset to automatic 10%.";
  }catch(err){alert("Could not reset TAC: "+err.message);}
});

search.addEventListener("input",render); dateFilter.addEventListener("change",render);
document.getElementById("clearFilters").addEventListener("click",()=>{search.value="";dateFilter.value="";render();});
document.getElementById("refreshData").addEventListener("click",render);
document.getElementById("exportCsv").addEventListener("click",()=>{
  const lines=[...document.querySelectorAll("#vendorTable tr")].map(tr=>[...tr.children].map(td=>{
    const el=td.querySelector("input"); return '"'+String(el?el.value:td.innerText).replace(/"/g,'""')+'"';
  }).join(","));
  const blob=new Blob(["\\uFEFF"+lines.join("\\r\\n")],{type:"text/csv;charset=utf-8;"});
  const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="Aronee-Vendor-Details.csv";a.click();URL.revokeObjectURL(url);
});

onSnapshot(collection(db,"bookings"),snap=>{
  bookings.clear();snap.forEach(d=>bookings.set(d.id,{firebaseId:d.id,...d.data()}));render();
},err=>{status.textContent="Unable to load bookings: "+err.message;});
onSnapshot(collection(db,"vendorDetails"),snap=>{
  vendorData.clear();snap.forEach(d=>vendorData.set(d.id,d.data()));render();
},err=>{status.textContent="Unable to load vendor entries: "+err.message;});
