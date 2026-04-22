import { getUserId } from "./auth.js";

const container = document.getElementById("booking-container");

async function loadBookingHistory() {
    try {
        const userId = await getUserId();
        const response = await fetch(`/api/checkout/history?userId=${userId}`);
        if (!response.ok)
            throw new Error("Couldn't get history: " + response);

        const data = await response.json();

        if (!data || data.length === 0) {
            container.innerHTML = "<p>No bookings found.</p>";
            return;
        }

        container.innerHTML = "";

        data.forEach(booking => {
            const card = document.createElement("a");
            card.style = "margin: 0";
            card.href = `/listing?id=${booking.listingId}`;
            card.innerHTML = `
                <div class="booking-card">
                    <div class="car-name">${booking.carName}</div>

                    <p><strong>Start:</strong> ${new Date(booking.startDate).toLocaleDateString()}</p>
                    <p><strong>End:</strong> ${new Date(booking.endDate).toLocaleDateString()}</p>

                    <div class="price">Price per day: €${booking.price}</div>
                    <div class="price">Amount paid: €${booking.amountPaid}</div>

                    <div class="status">
                        Status: ${booking.confirmed ? "Confirmed" : "Pending"}
                    </div>
                </div>
            `;

            container.appendChild(card);
        });

    } catch (err) {
        console.error(err);
        container.innerHTML = "<p>Failed to load booking history.</p>";
    }
}

loadBookingHistory();