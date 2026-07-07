// ==========================================
// ARONEE TOURS & TRAVELS
// Guest Voucher
// guestVoucher.js
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // Get booking data from localStorage
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
setValue("checkInTime", booking.checkIn);
setValue("checkOutTime", booking.checkOut);

setValue(
    "totalPaxDetails",
    booking.adults + " Adults, " +
    booking.children + " Children, " +
    booking.kids + " Kids"
);

setValue("checkInPoint", booking.checkInPoint);
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
    setValue("specialInstruction",booking.specialInstruction || "");
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

    window.print();

}

// ==========================================
// Close Window
// ==========================================

function closeVoucher() {

    window.close();

}
