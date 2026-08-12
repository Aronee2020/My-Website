// ==========================================
// ARONEE TOURS & TRAVELS
// Guest Voucher
// guestVoucher.js
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // GET SAVED BOOKING
    // ==========================================

    const bookingData = localStorage.getItem("selectedBooking");

    if (!bookingData) {
        alert("No booking data found.");
        return;
    }

    const booking = JSON.parse(bookingData);

    console.log("Guest Voucher Booking:", booking);


    // ==========================================
    // FORMAT MONEY
    // ==========================================

    function money(value) {

        const amount = parseFloat(value) || 0;

        return "₹ " + amount.toLocaleString("en-IN");
    }


    // ==========================================
    // FORMAT DATE
    // ==========================================

    function formatDate(dateString) {

        if (!dateString) return "";

        const months = [
            "January", "February", "March", "April",
            "May", "June", "July", "August",
            "September", "October", "November", "December"
        ];

        const date = new Date(dateString);

        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    }


    // ==========================================
    // GUEST INFORMATION
    // ==========================================

    setValue(
        "guestNameDisplay",
        "Mr./Ms " + (booking.guestName || "")
    );

    setValue(
        "mobileDisplay",
        booking.mobile || ""
    );

    setValue(
        "cruiseDateDisplay",
        formatDate(booking.cruiseDate)
    );


    // ==========================================
    // TOTAL PAX
    // ==========================================

    let paxText = [];

    const adults = parseInt(booking.adults) || 0;
    const children = parseInt(booking.children) || 0;
    const kids = parseInt(booking.kids) || 0;

    if (adults > 0) {
        paxText.push(
            `${adults} Adult${adults > 1 ? "s" : ""}`
        );
    }

    if (children > 0) {
        paxText.push(
            `${children} Child${children > 1 ? "ren" : ""}`
        );
    }

    if (kids > 0) {
        paxText.push(
            `${kids} Kid${kids > 1 ? "s" : ""}`
        );
    }

    setValue(
        "totalPaxDisplay",
        paxText.join(" and ")
    );


    // ==========================================
    // HOUSEBOAT TYPE
    // ==========================================

    setValue(
        "houseboatTypeDisplay",
        booking.houseboatType || ""
    );


    // ==========================================
    // PACKAGE DETAILS
    // ==========================================

    setValue(
        "package",
        booking.package || ""
    );

    setValue(
        "checkInPoint",
        booking.checkInPoint || ""
    );

    setValue(
        "checkInTime",
        booking.checkIn || ""
    );

    setValue(
        "checkOutTime",
        booking.checkOut || ""
    );


    // ==========================================
    // FOOD MENU
    // ==========================================

    const foodMenuElement =
        document.getElementById("foodMenu");

    if (foodMenuElement) {

        foodMenuElement.innerHTML =
            (booking.foodMenu || "").replace(/\n/g, "<br>");

    }


    // ==========================================
    // TAXI DETAILS
    // ==========================================

    const taxiSection =
        document.getElementById("taxiVoucherSection");

    if (
        taxiSection &&
        booking.taxiRequired === "Yes"
    ) {

        taxiSection.style.display = "block";

        setValue(
            "voucherTaxiVehicleType",
            booking.taxiVehicleType || ""
        );

        setValue(
            "voucherTaxiPackageDetails",
            booking.taxiItinerary || ""
        );

        setValue(
            "voucherTaxiAmount",
            money(booking.taxiAmount)
        );

    } else if (taxiSection) {

        taxiSection.style.display = "none";

    }


    // ==========================================
    // PAYMENT DETAILS
    // ==========================================

    const packageAmount =
        parseFloat(booking.packageAmount) || 0;

    const taxiAmount =
        booking.taxiRequired === "Yes"
            ? parseFloat(booking.taxiAmount) || 0
            : 0;

    const houseboatAdvance =
        parseFloat(booking.advanceReceived) || 0;

    const taxiAdvance =
        booking.taxiRequired === "Yes"
            ? parseFloat(booking.taxiAdvance) || 0
            : 0;


    // Total
    const totalAmount =
        packageAmount + taxiAmount;


    // Total advance
    const totalAdvance =
        houseboatAdvance + taxiAdvance;


    // Final balance
    const finalBalance =
        totalAmount - totalAdvance;


    // Package Amount
    setValue(
        "packageAmount",
        money(packageAmount)
    );


    // Transportation Charges
    const taxiChargesLine =
        document.getElementById("taxiChargesLine");

    if (
        taxiChargesLine &&
        booking.taxiRequired === "Yes" &&
        taxiAmount > 0
    ) {

        taxiChargesLine.style.display = "block";

        setValue(
            "taxiCharges",
            money(taxiAmount)
        );

    } else if (taxiChargesLine) {

        taxiChargesLine.style.display = "none";

    }


    // Total Amount
    setValue(
        "totalAmount",
        money(totalAmount)
    );


    // Advance Received
    setValue(
        "advance",
        money(totalAdvance)
    );


    // Payment Mode
    let paymentModes = [];

    if (
        houseboatAdvance > 0 &&
        booking.advanceMode
    ) {
        paymentModes.push(
            booking.advanceMode
        );
    }

    if (
        taxiAdvance > 0 &&
        booking.taxiPaymentMode
    ) {
        paymentModes.push(
            booking.taxiPaymentMode
        );
    }

    setValue(
        "advanceMode",
        paymentModes.join(" / ")
    );


    // Balance Amount
    setValue(
        "balance",
        money(finalBalance)
    );


    // ==========================================
    // PACKAGE INSTRUCTIONS & TERMS
    // ==========================================

    loadPackageDetails(booking.package);

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

                "Music system with mic is available. Kindly keep the volume low after 9:30 PM.",

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
