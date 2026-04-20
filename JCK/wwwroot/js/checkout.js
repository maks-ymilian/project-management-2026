document.getElementById("checkout-button").addEventListener("click", async () => {
    try {
        const response = await fetch("http://localhost:5130/api/checkout", {
            method: "POST"
        });

        const data = await response.json();

        console.log("Stripe URL:", data.url);

       
        window.location.href = data.url;

    } catch (error) {
        console.error("Checkout failed:", error);
    }
});