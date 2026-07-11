// ==========================================
// ARONEE TOURS & TRAVELS
// Guest Voucher
// guestVoucher.js
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // Get booking data from localNothing happens (no print dialog opens)Storage
    const booking = JSON.parse(localStorage.getItem("selectedBooking"));
console.log(booking);
    if (!booking) {
        alert("No booking data found.");
        return;
    }

    // -----------------------------
    // Booking Details
    // -----------------------------
// ==========================================
// ==========================================
// Format Date (YYYY-MM-DD → 11 July 2026)
// ==========================================
function formatDate(dateString) {

    if (!dateString) return "";

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const date = new Date(dateString);

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
}
    
    setValue("guestName", booking.guestName);
    setValue("bookingId", booking.bookingId);
    setValue("receiptNo", booking.receiptNo);
    setValue("customerId", booking.customerId);
    setValue("bookingDate", booking.bookingDate);
    setValue("cruiseDate", booking.cruiseDate);
    setValue("mobile", booking.mobile);
    setValue("package", booking.package);
    loadPackageDetails(booking.package);
    setValue("houseboat", booking.houseboatName);
    setValue("houseboatType", booking.houseboatType);
    // =============================
// Guest Info
// =============================
setValue("guestNameDisplay", "Mr./Ms " + booking.guestName);
setValue("mobileDisplay", booking.mobile);
setValue("cruiseDateDisplay", formatDate(booking.cruiseDate));
let paxText = [];

if (booking.adults > 0) {
    paxText.push(`${booking.adults} Adult${booking.adults > 1 ? "s" : ""}`);
}

if (booking.children > 0) {
    paxText.push(`${booking.children} Child${booking.children > 1 ? "ren" : ""}`);
}

if (booking.kids > 0) {
    paxText.push(`${booking.kids} Kid${booking.kids > 1 ? "s" : ""}`);
}

setValue("totalPaxDisplay", paxText.join(" and "));setValue("houseboatTypeDisplay", booking.houseboatType);
setValue("checkInTime", booking.checkIn);
setValue("checkOutTime", booking.checkOut);

setValue(
    "totalPaxDetails",
    booking.adults + " Adults, " +
    booking.children + " Children, " +
    booking.kids + " Kids"
);

setValue("checkInPoint", booking.checkInPoint);
    setValue("packageAmount", money(booking.packageAmount));
setValue("advance", money(booking.advanceReceived));
setValue("balance", money(booking.balanceAmount));
setValue("advanceMode", booking.advanceMode);
    // -----------------------------
    // Payment
    // -----------------------------

   function money(value){
    return "₹ " + Number(value).toLocaleString("en-IN");
}

setValue("packageAmount", money(booking.packageAmount));
setValue("advance", money(booking.advanceReceived));
setValue("balance", money(booking.balanceAmount));
    setValue("advanceMode", booking.advanceMode);

    // -----------------------------
    // Food Menu
    // -----------------------------

document.getElementById("foodMenu").innerHTML =
    (booking.foodMenu || "").replace(/\n/g, "<br>");
    });

// ==========================================
// Set HTML
// ==========================================

function setValue(id, value) {

    let element = document.getElementById(id);

    if (element) {

        element.textContent = value;

    }

}
// ==========================================
// Load Package Instructions
// ==========================================

function loadPackageDetails(packageName){

    let instructions = [];
    let terms = [];

    switch(packageName){

        // ===============================
        // DAY & NIGHT CRUISE
        // ===============================

        case "Day Night Cruise":

            instructions = [

                "Cruising is available from 11:00 AM to 6:30 PM.",

                "Morning cruise is available from 7:15 AM to 8:15 AM.",

                "Air conditioning is available from 9:00 PM to 6:00 AM.",

                "Food menu and cooking oil preferences will be confirmed after advance payment.",

                "Any extra food items or arrangements should be informed before departure.",

                "Television is not available on the houseboat.",

                "Music system with microphone is available. Kindly keep the volume low after 9:30 PM.",

                "Smoking is strictly prohibited inside the houseboat."

            ];

            terms = [

                "Late check-in may reduce cruising time.",

                "Cruising after 6:30 PM is restricted as per local regulations.",

                "After cruising hours, the houseboat will remain anchored.",

                "Cruise operation is subject to weather conditions.",

                "100% refund will be provided if the cruise is cancelled due to bad weather."

            ];

        break;

        // ===============================
        // OVERNIGHT CRUISE
        // ===============================

        case "Overnight Cruise":

    instructions = [

        "Balance payment must be completed at check-in.",

        "Evening Cruise: 5:00 PM – 6:30 PM.",

        "Morning Cruise: 7:00 AM – 8:00 AM.",

        "Air conditioning is available from 9:00 PM to 6:00 AM.",

        "Special dishes can be arranged if informed at least 2 days in advance (extra charges apply).",

        "Television is not available on the houseboat.",

        "Music system with microphone is available.",

        "Smoking is strictly prohibited."

    ];

           terms = [

    "Cruise will start as per schedule.",

    "Management is not responsible for delays caused by late arrival.",

    "After cruising hours, the houseboat will remain anchored at the designated jetty.",

    "Houseboats have limited facilities. Please do not compare them with hotels.",

    "Cruise operation depends on weather conditions.",

    "Weather-related cancellations are refundable."

];

        break;

        // ===============================
        // DINNER CRUISE
        // ===============================

        case "Dinner Cruise":

            instructions = [

                "Cruise starts at 5:00 PM.",

                "AC is not included. Extra charges apply if required.",

                "Food menu and cooking oil preferences will be confirmed after advance payment.",

                "Music system with microphone is available.",

                "Smoking is strictly prohibited."

            ];

            terms = [

                "Late check-in may reduce cruising time.",

                "Cruising is permitted only until 6:30 PM.",

                "After cruising, the houseboat will remain anchored.",

                "Cruise operation depends on weather conditions.",

                "Weather-related cancellations are 100% refundable."

            ];

        break;

        // ===============================
        // LUNCH CRUISE
        // ===============================

        case "Lunch Cruise":

            instructions = [

                "One-hour lunch break will be provided.",

                "Route: Tejaswini River → Mavilakadappuram → Return.",

                "Special dishes can be arranged with 2 days' prior notice.",

                "AC is not available during cruising."

            ];

            terms = [

                "Balance payment must be completed at check-in.",

                "Houseboats have limited facilities.",

                "Cruise operation depends on weather.",

                "Weather cancellations are refundable.",

                "Smoking is prohibited."

            ];

        break;

        // ===============================
        // DAY CRUISE
        // ===============================

        case "Day Cruise":

            instructions = [

                "A 1–2 hour lunch break will be provided.",

                "Special dishes can be arranged with 2 days' prior notice.",

                "AC is not available during cruising."

            ];

            terms = [

                "Houseboats have limited facilities.",

                "Cruise operation depends on weather conditions.",

                "Weather-related cancellations are refundable.",

                "Television is not available.",

                "Music system with microphone is available.",

                "Smoking is prohibited."

            ];

        break;

        // ===============================
        // SUNSET / 1 HR / 2 HR
        // ===============================

        case "Sunset Cruise":
        case "1 Hour Cruise":
        case "2 Hour Cruise":

            instructions = [

                "Balance payment must be completed before boarding.",

                "Special dishes require 2 days' prior notice.",

                "Please inspect the houseboat before departure.",

                "Music system with microphone is available."

            ];

            terms = [

                "Late arrival may reduce cruising time.",

                "Cruise operation depends on weather conditions.",

                "Weather-related cancellations are 100% refundable.",

                "No refund will be provided after completion of the cruise.",

                "Smoking is prohibited."

            ];

        break;

    }

    let instructionHTML = "";

    instructions.forEach(function(item){

        instructionHTML += `<li>${item}</li>`;

    });

    document.getElementById("instructionList").innerHTML = instructionHTML;

    let termsHTML = "";

    terms.forEach(function(item){

        termsHTML += `<li>${item}</li>`;

    });

    document.getElementById("termsList").innerHTML = termsHTML;

}
// ==========================================
// Print Voucher
// ==========================================

function printVoucher() {

    const booking = JSON.parse(localStorage.getItem("selectedBooking"));

    if (!booking) {
        alert("Booking data not found.");
        return;
    }

    const bookingId = booking.bookingId || "Voucher";
    const guestName = (booking.guestName || "Guest")
        .replace(/[\\/:*?"<>|]/g, "_");

    const fileName = `${bookingId}-${guestName}.pdf`;

    const element = document.querySelector(".voucher");

    // Save original styles
    const oldMargin = element.style.margin;
    const oldWidth = element.style.width;
    const oldMinHeight = element.style.minHeight;
    const oldBoxShadow = element.style.boxShadow;

    // Apply PDF styles
    element.style.margin = "0";
    element.style.width = "210mm";
    element.style.minHeight = "297mm";
    element.style.boxShadow = "none";

    const opt = {
        margin: [0, 0, 0, 0],
        filename: fileName,
        image: {
            type: "jpeg",
            quality: 1
        },
        html2canvas: {
            scale: 2,
            useCORS: true,
            scrollY: 0
        },
        jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait"
        }
    };

    html2pdf()
        .set(opt)
        .from(element)
        .save()
        .then(() => {

            // Restore original styles
            element.style.margin = oldMargin;
            element.style.width = oldWidth;
            element.style.minHeight = oldMinHeight;
            element.style.boxShadow = oldBoxShadow;

        });

}
function closeVoucher() {
    window.close();
}

// Make functions available to HTML buttons
window.printVoucher = printVoucher;
window.closeVoucher = closeVoucher;
