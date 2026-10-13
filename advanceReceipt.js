```javascript
// ==========================================
// ARONEE TOURS & TRAVELS
// Advance Payment Receipt
// advanceReceipt.js
// ==========================================

const receiptBrands = {
    Aronee: {
        companyName: "ARONEE TOURS & TRAVELS PVT. LTD",
        logo: "logo.png",
        address: `
            Ansariya Complex<br>
            Main Bazar, Nileshwar<br>
            Kasaragod, Kerala - 671314<br>
            +91 9072219555<br>
            info@aronee.com
        `
    },

    KBH: {
        companyName: "KERALA BEKAL HOUSEBOAT",
        logo: "kbh-logo.png",
        address: `
            MALABAR INNOVATION ENTREPRENEURSHIP<br>
            ZONE, MANGATTUPARAMBA, NEAR KANNUR<br>
            UNIVERSITY CAMPUS, KALLIASSERI<br>
            Kannur, Kerala - 670567
        `
    },

    Nileshwar: {
        companyName: "NILESHWAR HOUSEBOAT",
        logo: "nileshwar-logo.png",
        address: `
            Houseboat Terminal<br>
            Kottapuram, Nileshwar<br>
            Kerala - 671314
        `
    }
};

document.addEventListener("DOMContentLoaded", function () {

    const savedBooking = localStorage.getItem("selectedBooking");

    if (!savedBooking) {
        alert("No booking selected. Please return to the booking system and select a booking.");
        return;
    }

    let booking;

    try {
        booking = JSON.parse(savedBooking);
    } catch (error) {
        alert("Unable to read the selected booking.");
        return;
    }

    if (!booking || typeof booking !== "object") {
        alert("Booking details are not available.");
        return;
    }

    // Company brand
    const brand =
        receiptBrands[booking.voucherBrand] ||
        receiptBrands.Aronee;

    document.getElementById("receiptLogo").src = brand.logo;
    document.getElementById("receiptCompanyName").textContent =
        brand.companyName;
    document.getElementById("receiptAddress").innerHTML = brand.address;
    document.getElementById("footerCompanyName").textContent =
        brand.companyName;

    // Formatting helpers
    function setText(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent =
                value === null || value === undefined ? "" : String(value);
        }
    }

    function money(value) {
        const amount = Number.parseFloat(value) || 0;
        return "₹ " + amount.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function formatDate(value) {
        if (!value) return "";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return String(value);
        }

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
    }

    // Guest details
    const guestName = [
        booking.guestPrefix || "",
        booking.guestName || ""
    ].filter(Boolean).join(" ");

    setText("guestName", guestName);
    setText("customerId", booking.customerId || "");
    setText("mobile", booking.mobile || "");
    setText("bookingId", booking.bookingId || "");

    // Booking details
    setText("cruiseDate", formatDate(booking.cruiseDate));
    setText("houseboat", booking.houseboatName || booking.houseboatType || "");
    setText("packageName", booking.package || "");
    setText("boardingPoint", booking.checkInPoint || "");

    const pax = [];

    const adults = Number.parseInt(booking.adults, 10) || 0;
    const children = Number.parseInt(booking.children, 10) || 0;
    const kids = Number.parseInt(booking.kids, 10) || 0;

    if (adults > 0) pax.push(adults + (adults === 1 ? " Adult" : " Adults"));
    if (children > 0) pax.push(children + (children === 1 ? " Child" : " Children"));
    if (kids > 0) pax.push(kids + (kids === 1 ? " Kid" : " Kids"));

    setText("guestCount", pax.join(", "));

    // Payment calculations
    const packageAmount = Number.parseFloat(booking.packageAmount) || 0;

    const taxiAmount =
        booking.taxiRequired === "Yes"
            ? Number.parseFloat(booking.taxiAmount) || 0
            : 0;

    const houseboatAdvance =
        Number.parseFloat(booking.advanceReceived) || 0;

    const taxiAdvance =
        booking.taxiRequired === "Yes"
            ? Number.parseFloat(booking.taxiAdvance) || 0
            : 0;

    const totalAmount = packageAmount + taxiAmount;
    const totalAdvance = houseboatAdvance + taxiAdvance;
    const balance = totalAmount - totalAdvance;

    setText("packageAmount", money(packageAmount));
    setText("taxiAmount", money(taxiAmount));
    setText("totalAmount", money(totalAmount));
    setText("advanceAmount", money(totalAdvance));
    setText("balanceAmount", money(balance));

    // Hide taxi row when taxi was not booked
    if (booking.taxiRequired !== "Yes") {
        document.getElementById("taxiRow").style.display = "none";
    }

    // Payment mode and transaction reference
    const paymentModes = [];

    if (houseboatAdvance > 0 && booking.advanceMode) {
        paymentModes.push(booking.advanceMode);
    }

    if (taxiAdvance > 0 && booking.taxiPaymentMode) {
        paymentModes.push(booking.taxiPaymentMode);
    }

    setText("paymentMode", paymentModes.join(" / "));

    const transactionReference = [
        booking.transactionRef || "",
        booking.taxiTransactionRef || ""
    ].filter(Boolean).join(" / ");

    setText("transactionReference", transactionReference);

    if (!transactionReference) {
        document.getElementById("transactionRow").style.display = "none";
    }

    // Use the saved receipt number; do not create a new number while printing
    setText("receiptNumber", booking.receiptNo || "Not recorded");

    // Receipt date is the date this receipt is opened
    setText("receiptDate", formatDate(new Date()));

    // Avoid printing an image if the selected logo cannot be loaded
    document.getElementById("receiptLogo").addEventListener("error", function () {
        this.style.display = "none";
    });
});

// Print or save as PDF
function printReceipt() {
    window.print();
}

// Close receipt tab
function closeReceipt() {
    window.close();
}

window.printReceipt = printReceipt;
window.closeReceipt = closeReceipt;
```
