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

    setValue("guestName", booking.guestName);
    setValue("bookingId", booking.bookingId);
    setValue("receiptNo", booking.receiptNo);
    setValue("customerId", booking.customerId);
    setValue("bookingDate", booking.bookingDate);
    setValue("cruiseDate", booking.cruiseDate);
    setValue("mobile", booking.mobile);
    setValue("package", booking.package);
    setValue("houseboat", booking.houseboatName);
    setValue("houseboatType", booking.houseboatType);
    // =============================
// Guest Info
// =============================
setValue("guestNameDisplay", booking.guestName);
setValue("mobileDisplay", booking.mobile);
setValue("cruiseDateDisplay", booking.cruiseDate);
setValue("totalPaxDisplay", booking.totalPax + " Pax");
setValue("houseboatTypeDisplay", booking.houseboatType);
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
