import { db } from "./firebase.js";
import {
    collection,
    addDoc,
    getDoc,
    getDocs,
    deleteDoc,
    updateDoc,
    doc,
    runTransaction
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";
// ============================================
// ARONEE HOUSEBOAT BOOKING MANAGEMENT SYSTEM
// Version 2.0
// ============================================

// Auto Numbers
let bookingNo = 1;
let customerNo = 1;
let receiptNo = 1;
let currentBookings = [];
// ======================================
// LOCAL STORAGE FUNCTIONS
// ======================================

// Get all bookings
async function getBookings() {

    const querySnapshot = await getDocs(collection(db, "bookings"));

    let bookings = [];

    querySnapshot.forEach((docSnap) => {

        bookings.push({
            firebaseId: docSnap.id,
            ...docSnap.data()
        });

    });

    bookings.sort((a, b) => {

        if (!a.bookingDate) return 1;
        if (!b.bookingDate) return -1;

        return b.bookingDate.localeCompare(a.bookingDate);

    });

    return bookings;

}
// Save all bookings
function saveBookings(bookings) {

    // Firebase version
    // No longer used

}
// Load bookings into table
async function loadBookings() {

currentBookings = await getBookings();

let bookings = currentBookings;
    let tbody = document.querySelector("#bookingTable tbody");

    tbody.innerHTML = "";

    bookings.forEach(function(b){

        let row = tbody.insertRow();

        row.dataset.firebaseId = b.firebaseId || "";

        row.onclick = function(){
            selectRow(this);
        };

        row.insertCell(0).innerHTML = b.bookingId || "";
        row.insertCell(1).innerHTML = b.bookingDate || "";
        row.insertCell(2).innerHTML = b.guestName || "";
        row.insertCell(3).innerHTML = b.mobile || "";
        row.insertCell(4).innerHTML = b.cruiseDate || "";
        row.insertCell(5).innerHTML = b.package || "";
        row.insertCell(6).innerHTML = b.checkInPoint || "";
        row.insertCell(7).innerHTML = b.houseboatName || "";
row.insertCell(8).innerHTML = b.houseboatType || "";
row.insertCell(9).innerHTML = b.checkIn || "";
row.insertCell(10).innerHTML = b.checkOut || "";
row.insertCell(11).innerHTML = b.totalPax || "";
row.insertCell(12).innerHTML = "₹ " + (b.packageAmount || 0);
row.insertCell(13).innerHTML = "₹ " + (b.advanceReceived || 0);
row.insertCell(14).innerHTML = "₹ " + (b.balanceAmount || 0);
row.insertCell(15).innerHTML = b.advanceMode || "";            });

}
// ======================================
// Update Next Auto Numbers
// ======================================

async function updateNextNumbers() {

    // Read the Booking Counter
    const counterRef = doc(db, "counters", "bookingCounter");
    const counterSnap = await getDoc(counterRef);

    let nextNumber = 188;

    if (counterSnap.exists()) {
        nextNumber = counterSnap.data().lastBookingNumber + 1;
    }

    // Show next Customer ID
    document.getElementById("customerId").value =
        "ARN-KBH-" + nextNumber + "-2026";

    // Receipt Number (keep your existing logic)
    let bookings = await getBookings();
    receiptNo = bookings.length + 1;
    generateReceiptNo();

    // Booking ID is generated only on Save
    document.getElementById("bookingId").value =
        "Auto Generated on Save";
}// ======================================
// Convert 12-hour time to minutes
// Example: 5:30 PM -> 1050
// ======================================

// ======================================
// Convert Time into Minutes
// Example:
// 5:30 PM -> 1050
// 10:00 AM -> 600
// ======================================

function timeToMinutes(time){

    if(!time) return -1;

    time = time.trim().toUpperCase();

    // Replace . with :
    time = time.replace(".", ":");

    // Match:
    // 5 PM
    // 5:30 PM
    // 10 AM
    // 10:00 AM

    let match = time.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/);

    if(!match){
    return -1;
}

    let hour = parseInt(match[1]);

    let minute = parseInt(match[2] || "0");

    let period = match[3];

    if(period=="PM" && hour!=12){

        hour += 12;

    }

    if(period=="AM" && hour==12){

        hour = 0;

    }

    return hour*60+minute;

}

// ======================================
// Check Houseboat Availability
// ======================================


    // ======================================
// Houseboat Availability Check
// ======================================

function checkAvailability(){

    let table=document.getElementById("bookingTable");

    let boat=document.getElementById("houseboatName").value;

    let date=document.getElementById("cruiseDate").value;

  let checkInValue = document.getElementById("checkIn").value;
let checkOutValue = document.getElementById("checkOut").value;

console.log("NEW Check In :", checkInValue);
console.log("NEW Check Out:", checkOutValue);

let newIn = timeToMinutes(checkInValue);
let newOut = timeToMinutes(checkOutValue);

    if(newIn==-1 || newOut==-1){

        return false;

    }

    for(let i=1;i<table.rows.length;i++){

        let row=table.rows[i];

        let rowBoat = row.cells[7].innerHTML;

        let rowDate=row.cells[4].innerHTML;

let oldCheckIn = row.cells[7].innerHTML.trim();
let oldCheckOut = row.cells[8].innerHTML.trim();

console.log("Booking ID :", row.cells[0].innerHTML);
console.log("Old Check In :", oldCheckIn);
console.log("Old Check Out:", oldCheckOut);

let oldIn = timeToMinutes(oldCheckIn);
let oldOut = timeToMinutes(oldCheckOut);

        if(rowBoat==boat && rowDate==date){

            if(newIn<oldOut && newOut>oldIn){

                alert(

"❌ HOUSEBOAT ALREADY BOOKED\n\n"+

"Guest : "+row.cells[2].innerHTML+

"\nBooking ID : "+row.cells[0].innerHTML+

"\nHouseboat : "+boat+

"\nDate : "+date+

"\nExisting Time : "+

row.cells[7].innerHTML+

" - "+

row.cells[8].innerHTML+

"\n\nPlease choose another houseboat."

                );

                return false;

            }

        }

    }

    return true;

}
// Selected table row
let selectedRow = null;

// ------------------------
// Initialize
// ------------------------

document.addEventListener("DOMContentLoaded", async function () {

    await loadBookings();
    await updateDashboard();
    await updateNextNumbers();
    setToday();

    // =========================
    // SAFE EVENT LISTENERS
    // =========================

    let adults = document.getElementById("adults");
    let children = document.getElementById("children");
    let kids = document.getElementById("kids");

    if (adults) adults.addEventListener("input", calculateTotalPax);
    if (children) children.addEventListener("input", calculateTotalPax);
    if (kids) kids.addEventListener("input", calculateTotalPax);

    let packageAmount = document.getElementById("packageAmount");
    let advanceReceived = document.getElementById("advanceReceived");

    if (packageAmount) packageAmount.addEventListener("input", calculateBalance);
    if (advanceReceived) advanceReceived.addEventListener("input", calculateBalance);

});
// ------------------------
// Booking ID
// ------------------------

async function generateBookingID() {

    const counterRef = doc(db, "counters", "bookingCounter");

    const bookingNumber = await runTransaction(db, async (transaction) => {

        const counterDoc = await transaction.get(counterRef);

        let lastNumber = 187;      // Start before 188

        if (counterDoc.exists()) {
            lastNumber = counterDoc.data().lastBookingNumber;
        }

        const newNumber = lastNumber + 1;

        transaction.set(counterRef, {
            lastBookingNumber: newNumber
        });

        return newNumber;
    });

    return "BKID/" + bookingNumber + "/26-27";

}

// ------------------------
// Customer ID
// ------------------------

function generateCustomerID(){

    document.getElementById("customerId").value=
    "CUS"+customerNo.toString().padStart(4,"0");

}

// ------------------------
// Receipt Number
// ------------------------

function generateReceiptNo(){

    document.getElementById("receiptNo").value=
    "RC"+receiptNo.toString().padStart(5,"0");

}

// ------------------------
// Today's Date
// ------------------------

function setToday(){

    let today=new Date().toISOString().split("T")[0];

    document.getElementById("bookingDate").value=today;

}

// ------------------------
// Total Pax
// ------------------------

function calculateTotalPax(){

    let adults=parseInt(document.getElementById("adults").value)||0;

    let children=parseInt(document.getElementById("children").value)||0;

    let kids=parseInt(document.getElementById("kids").value)||0;

    document.getElementById("totalPax").value=
    adults+children+kids;

}

// ------------------------
// Balance
// ------------------------

function calculateBalance(){

    let packageAmount=parseFloat(document.getElementById("packageAmount").value)||0;

    let advance=parseFloat(document.getElementById("advanceReceived").value)||0;

    document.getElementById("balanceAmount").value=
    packageAmount-advance;

}
// ======================================
// Mobile Number Validation
// ======================================

function validateMobile(){

    let mobile = document.getElementById("mobile");

    // Keep only numbers
    mobile.value = mobile.value.replace(/\D/g, "");

    if(mobile.value.length > 10){

        alert("Mobile Number should contain only 10 digits.");

        mobile.value = mobile.value.substring(0,10);

        mobile.focus();

    }

}
// ------------------------
// Booking Status
// ------------------------

function bookingStatusChanged(){

    let status=document.getElementById("bookingStatus").value;

    document.getElementById("cancelSection").style.display="none";


    if(status==="Cancelled"){

        document.getElementById("cancelSection").style.display="flex";

    }

    if(status==="Postponed"){

        document.getElementById("postponeSection").style.display="flex";

    }

}
// ============================================
// SAVE BOOKING
// ============================================
window.validateMobile = validateMobile;
async function saveBooking() {
    // Validation
    if(document.getElementById("guestName").value.trim()==""){

        alert("Please enter Guest Name.");
        document.getElementById("guestName").focus();
        return;

    }

    if(document.getElementById("mobile").value.trim()==""){

        alert("Please enter Mobile Number.");
        document.getElementById("mobile").focus();
        return;

    }

    if(document.getElementById("cruiseDate").value==""){

        alert("Please select Cruise Date.");
        document.getElementById("cruiseDate").focus();
        return;

    }

    if(document.getElementById("package").value==""){

        alert("Please select Package.");
        document.getElementById("package").focus();
        return;

    }

    if(document.getElementById("houseboatName").value==""){

        alert("Please select Houseboat.");
        document.getElementById("houseboatName").focus();
        return;

    }
// Check Advance Amount
let packageAmount = parseFloat(document.getElementById("packageAmount").value) || 0;
let advance = parseFloat(document.getElementById("advanceReceived").value) || 0;

if (advance > packageAmount) {

    alert("Advance Received cannot exceed the Package Amount.");

    document.getElementById("advanceReceived").focus();

    return;

}
let checkIn = timeToMinutes(document.getElementById("checkIn").value);
let checkOut = timeToMinutes(document.getElementById("checkOut").value);

if(checkIn === -1 || checkOut === -1){

    alert(
`Please enter time in any of these formats:

10 AM
10AM
10.00 AM
10:00 AM
4:30AM
7 PM
7PM`
    );

    return;
}

if(!checkAvailability()){

    return;

}
  // Generate unique Booking ID from Firebase
const bookingId = await generateBookingID();
document.getElementById("bookingId").value = bookingId;
    // Generate Customer ID from Booking ID number
const bookingNumber = bookingId.split("/")[1];

document.getElementById("customerId").value =
    "ARN-KBH-" + bookingNumber + "-2026";
    console.log("Generated Booking ID:", bookingId);
console.log("Textbox Booking ID:", document.getElementById("bookingId").value);
// Save current booking for Guest Voucher

let bookingObject = {

    bookingId: document.getElementById("bookingId").value,

    customerId: document.getElementById("customerId").value,

    receiptNo: document.getElementById("receiptNo").value,

    bookingDate: document.getElementById("bookingDate").value,

    guestName: document.getElementById("guestName").value,

    mobile: document.getElementById("mobile").value,

    address: document.getElementById("address").value,

    cruiseDate: document.getElementById("cruiseDate").value,

    package: document.getElementById("package").value,
    checkInPoint: document.getElementById("checkInPoint").value,

    houseboatName: document.getElementById("houseboatName").value,

    houseboatType: document.getElementById("houseboatType").value,

    checkIn: document.getElementById("checkIn").value,

    checkOut: document.getElementById("checkOut").value,

    adults: document.getElementById("adults").value,

    children: document.getElementById("children").value,

    kids: document.getElementById("kids").value,

    totalPax: document.getElementById("totalPax").value,

    packageAmount: document.getElementById("packageAmount").value,

    advanceReceived: document.getElementById("advanceReceived").value,

    balanceAmount: document.getElementById("balanceAmount").value,

    advanceMode: document.getElementById("advanceMode").value,

    transactionRef: document.getElementById("transactionRef").value,

    bookingStatus: document.getElementById("bookingStatus").value,

    cancelDate: document.getElementById("cancelDate").value,

    refundAmount: document.getElementById("refundAmount").value,

    cancelReason: document.getElementById("cancelReason").value,

    newCruiseDate: document.getElementById("newCruiseDate").value,

    postponeReason: document.getElementById("postponeReason").value,

    foodMenu: document.getElementById("foodMenu").value,

    specialInstruction: document.getElementById("specialInstruction").value

};
// // Save booking into Firebase
try {
    console.log("Saving...", bookingObject);
    await addDoc(collection(db, "bookings"), bookingObject);
    console.log("Booking Object:", bookingObject);
    console.log("Saved Successfully");
    await loadBookings();
    await updateDashboard();
    await updateNextNumbers();
} catch (error) {

    console.error(error);

    alert(error.message);

    return;

}
// ======================================
// Save for Guest Voucher
// ======================================

localStorage.setItem(
    "selectedBooking",
    JSON.stringify(bookingObject)
);

    alert("Booking Saved Successfully.");

  document.getElementById("bookingForm").reset();

document.getElementById("bookingStatus").value = "Confirmed";

document.getElementById("cancelSection").style.display = "none";
document.getElementById("postponeSection").style.display = "none";

await updateNextNumbers();

setToday();

document.getElementById("totalPax").value = "";
document.getElementById("balanceAmount").value = "";

document.getElementById("guestName").focus();
}
// =====================================
// SELECT ROW
// =====================================

function selectRow(row){

    selectedRow = row;

    let firebaseId = row.dataset.firebaseId;

    let booking = currentBookings.find(b => b.firebaseId === firebaseId);

    if(!booking) return;

    document.getElementById("bookingId").value = booking.bookingId || "";
    document.getElementById("bookingDate").value = booking.bookingDate || "";
    document.getElementById("guestName").value = booking.guestName || "";
    document.getElementById("mobile").value = booking.mobile || "";

    document.getElementById("address").value = booking.address || "";

    document.getElementById("cruiseDate").value = booking.cruiseDate || "";
    document.getElementById("package").value = booking.package || "";
    document.getElementById("checkInPoint").value = booking.checkInPoint || "";

    document.getElementById("houseboatName").value = booking.houseboatName || "";
    document.getElementById("houseboatType").value = booking.houseboatType || "";

    document.getElementById("checkIn").value = booking.checkIn || "";
    document.getElementById("checkOut").value = booking.checkOut || "";
    document.getElementById("foodMenu").value = booking.foodMenu || "";
    document.getElementById("adults").value = booking.adults || "";
    document.getElementById("children").value = booking.children || "";
    document.getElementById("kids").value = booking.kids || "";

    calculateTotalPax();

    document.getElementById("packageAmount").value = booking.packageAmount || "";
    document.getElementById("advanceReceived").value = booking.advanceReceived || "";
    document.getElementById("balanceAmount").value = booking.balanceAmount || "";

    document.getElementById("advanceMode").value = booking.advanceMode || "";

    document.getElementById("transactionRef").value = booking.transactionRef || "";

    document.getElementById("bookingStatus").value = booking.bookingStatus || "";
}
// =====================================
// UPDATE BOOKING
// =====================================

async function updateBooking(){

    if(selectedRow == null){
        alert("Please select a booking first.");
        return;
    }

    // 🔥 GET FIREBASE ID FROM ROW
    let firebaseId = selectedRow.dataset.firebaseId;

    const bookingRef = doc(db, "bookings", firebaseId);

    try {

        await updateDoc(bookingRef, {

            guestName: document.getElementById("guestName").value,
            mobile: document.getElementById("mobile").value,
            address: document.getElementById("address").value,

            cruiseDate: document.getElementById("cruiseDate").value,
            package: document.getElementById("package").value,
            checkInPoint: document.getElementById("checkInPoint").value,

            houseboatName: document.getElementById("houseboatName").value,
            houseboatType: document.getElementById("houseboatType").value,

            checkIn: document.getElementById("checkIn").value,
            checkOut: document.getElementById("checkOut").value,
            foodMenu: document.getElementById("foodMenu").value,

            adults: document.getElementById("adults").value,
            children: document.getElementById("children").value,
            kids: document.getElementById("kids").value,
            totalPax: document.getElementById("totalPax").value,

            packageAmount: document.getElementById("packageAmount").value,
            advanceReceived: document.getElementById("advanceReceived").value,
            balanceAmount: document.getElementById("balanceAmount").value,

            advanceMode: document.getElementById("advanceMode").value,
            bookingStatus: document.getElementById("bookingStatus").value

        });

        await loadBookings();
        await updateDashboard();

        alert("Booking Updated Successfully");

    } catch(error){
        console.error(error);
        alert(error.message);
    }
}
// =====================================
// DELETE BOOKING
// =====================================

async function deleteBooking(){
    if(selectedRow==null){

        alert("Please select a booking.");

        return;

    }

    if(confirm("Delete this booking?")){
let bookings = await getBookings();

let bookingId = selectedRow.cells[0].innerHTML;

let booking = bookings.find(function(b){
    return b.bookingId === bookingId;
});

console.log("Deleting:", booking);

if(booking && booking.firebaseId){

    await deleteDoc(
        doc(db, "bookings", booking.firebaseId)
    );

}
// Firebase delete will be added here
await loadBookings();
await updateDashboard();
await updateNextNumbers();

        selectedRow = null;

        document.getElementById("bookingForm").reset();

        generateBookingID();
        generateCustomerID();
        generateReceiptNo();
        setToday();

        alert("Booking Deleted.");

    }

}
// =====================================
// EXPORT TO CSV
// =====================================

function exportToExcel(){

    let table = document.getElementById("bookingTable");

    let csv = [];

    for(let i=0;i<table.rows.length;i++){

        let row=[];

        for(let j=0;j<table.rows[i].cells.length;j++){

            row.push(table.rows[i].cells[j].innerText);

        }

        csv.push(row.join(","));

    }

    let csvFile = new Blob([csv.join("\n")],{type:"text/csv"});

    let downloadLink = document.createElement("a");

    downloadLink.download = "Houseboat_Bookings.csv";

    downloadLink.href = window.URL.createObjectURL(csvFile);

    downloadLink.click();

}

// ==========================================
// OPEN GUEST VOUCHER
// ==========================================

function openGuestVoucher(){

    if(selectedRow == null){

        alert("Please select a booking.");

        return;

    }

    let firebaseId = selectedRow.dataset.firebaseId;

    let booking = currentBookings.find(
        b => b.firebaseId === firebaseId
    );

    if(!booking){

        alert("Booking not found.");

        return;

    }

    localStorage.setItem(
        "selectedBooking",
        JSON.stringify(booking)
    );

    window.open(
        "guestVoucher.html",
        "_blank"
    );

}// =====================================
// SEARCH BOOKINGS
// =====================================

function searchBookings(){

    let keyword =
    document.getElementById("searchText")
    .value
    .toLowerCase();

    let date =
    document.getElementById("searchDate").value;

    let status =
    document.getElementById("searchStatus").value;

    let boat =
    document.getElementById("searchBoat").value;

    let rows =
    document.getElementById("bookingTable")
    .getElementsByTagName("tbody")[0]
    .rows;

    for(let i=0;i<rows.length;i++){

        let row=rows[i];

        let text=row.innerText.toLowerCase();

        let rowDate=row.cells[4].innerHTML;

        let rowBoat=row.cells[6].innerHTML;

        let rowStatus=row.cells[14].innerHTML;

        let show=true;

        if(keyword!="" && !text.includes(keyword))
            show=false;

        if(date!="" && rowDate!=date)
            show=false;

        if(boat!="" && rowBoat!=boat)
            show=false;

        row.style.display=show?"":"none";

    }

}

// =====================================
// CLEAR SEARCH
// =====================================

function clearSearch(){

    document.getElementById("searchText").value="";
    document.getElementById("searchDate").value="";
    document.getElementById("searchStatus").value="";
    document.getElementById("searchBoat").value="";

    searchBookings();

}
// =====================================
// DASHBOARD
// =====================================

async function updateDashboard(){
   let bookings = await getBookings();

    let today = new Date().toISOString().split("T")[0];

    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate()+1);
    tomorrow = tomorrow.toISOString().split("T")[0];

    let todayCount = 0;
    let tomorrowCount = 0;
    let confirmed = 0;
    let cancelled = 0;
    let postponed = 0;

    bookings.forEach(function(b){

        if(b.cruiseDate === today)
            todayCount++;

        if(b.cruiseDate === tomorrow)
            tomorrowCount++;

        if(b.bookingStatus === "Confirmed")
            confirmed++;

        if(b.bookingStatus === "Cancelled")
            cancelled++;

        if(b.bookingStatus === "Postponed")
            postponed++;

    });

    document.getElementById("todayBookings").innerHTML = todayCount;
    document.getElementById("tomorrowBookings").innerHTML = tomorrowCount;
    document.getElementById("totalBookings").innerHTML = bookings.length;
    document.getElementById("confirmedBookings").innerHTML = confirmed;
    document.getElementById("cancelledBookings").innerHTML = cancelled;
    document.getElementById("postponedBookings").innerHTML = postponed;

}
window.saveBooking = saveBooking;
window.validateMobile = validateMobile;
window.updateBooking = updateBooking;
window.deleteBooking = deleteBooking;
window.openGuestVoucher = openGuestVoucher;
window.searchBookings = searchBookings;
window.clearSearch = clearSearch;
window.bookingStatusChanged = bookingStatusChanged;
window.exportToExcel = exportToExcel;
