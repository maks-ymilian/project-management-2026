import { shake_element, format_date_range, format_date } from './common.js'
import { getUser, getUserId } from './auth.js'

try {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const checkout_state = params.get("checkout_state");
    if (checkout_state === "success")
        alert("Car successfully booked. You can find it in your booking history");
    else if (checkout_state === "cancel")
        alert("Booking cancelled");

    let listing;
    let reviewData;
    let userBooking = null;

    try {
        const response = await fetch(`/api/Listing/${id}`);
        if (!response.ok)
            throw new Error("Listing not found");

        listing = await response.json();

        const reviewsResponse = await fetch(`/api/Reviews?listingId=${id}`);

        if (!reviewsResponse.ok)
            throw new Error("Could not load reviews");

        reviewData = await reviewsResponse.json();

        const userBookingResponse = await fetch(`/api/checkout?listing_id=${id}&user_id=${getUserId()}`);
        if (userBookingResponse.ok) {
            userBooking = await userBookingResponse.json();
            if (!userBooking.confirmed)
                userBooking = null;
        }
        else if (userBookingResponse.status !== 404)
            throw new Error("Could not load user booking");
    } 
    catch (error) 
    {
        console.error("Error fetching listing:", error);
        alert("Error fetching listing data.");
        document.body.style.visibility = "visible";
    }

    const user = await getUser(listing.userId);
    const car_name = listing.carName;
    const owner_name = user.username;
    const owner_image = user.imageUrl ? user.imageUrl : "/images/user.jpg";
    const description = listing.description;

    const price_per_day = listing.pricePerDay;
    const available_start_date = new Date(listing.availableStartDate);
    const available_end_date = new Date(listing.availableEndDate);

    let reviews = [];
    let has_review_by_current_user = false;
    for (let i = 0; i < reviewData.reviews.length; ++i) {
        if (!has_review_by_current_user && reviewData.reviews[i].userId === getUserId())
            has_review_by_current_user = true;

        const user = await getUser(reviewData.reviews[i].userId);
        reviews[i] = {
            rating: reviewData.reviews[i].rating,
            date: reviewData.reviews[i].createdAt,
            name: user.username,
            profile_image: user.imageUrl ? user.imageUrl : "/images/user.jpg",
            text: reviewData.reviews[i].text,
        };
    }
    const average_rating = reviewData.averageRating;
    const eligible_for_review = !has_review_by_current_user && userBooking !== null;

    const images = listing.images ?? []; //Added to avoid crash if we have no image

    document.title = car_name + " | JCK";

    const image_list_container = document.getElementById("image-list-container");
    const first_image_container = document.getElementById("first-image-container");
    const image_grid_container = document.getElementById("image-grid-container");
    const image_layer = document.getElementById("image-layer");
    const star_selector = document.getElementById("star-selector");
    const reviews_container = document.getElementById("reviews-container");
    const reviews_title_text = document.getElementById("reviews-title-text");
    const average_rating_text = document.getElementById("average-rating-text");
    const average_rating_parent = document.getElementById("average-rating-parent");
    const review_input_box = document.getElementById("review-input-box");
    const availability_text = document.getElementById("availability-text");
    const booking_ui = document.getElementById("booking-ui");
    const price_text = document.getElementById("price-text");
    const owner_text = document.getElementById("owner-text");
    const owner_profile_picture = document.getElementById("owner-profile-picture");
    const book_button = document.getElementById("book-button");
    const post_review_button = document.getElementById("post-review-button");
    const review_text_area = document.getElementById("review-text-area");
    const from_date = document.getElementById("from-date");
    const to_date = document.getElementById("to-date");
    const rating_error_text = document.getElementById("rating-error-text");
    const empty_review_error_text = document.getElementById("empty-review-error-text");
    const book_error_text = document.getElementById("book-error-text");
    const description_text = document.getElementById("description-text");
    const listing_title_text = document.getElementById("listing-title-text");

    listing_title_text.textContent = car_name;
    description_text.textContent = description;
    owner_text.textContent = `Posted by ${owner_name}`;
    owner_profile_picture.src = owner_image;

    price_text.innerHTML = `&euro;`;
    price_text.append(`${price_per_day} / day`);

    if (userBooking !== null) {
        availability_text.textContent = `You booked this car for ${format_date_range(userBooking.startDate, userBooking.endDate)}`;
        booking_ui.style.display = "none";
    }
    else {
        const now = new Date();//Declaring date once over calling it multiple times to cause errors when the date changes while the user has the page open
        if (available_start_date < now && available_end_date < now)
        {
            availability_text.textContent = "This car is not available.";
            booking_ui.style.display = "none";
        }
        else
            availability_text.textContent = `Available ${format_date_range(available_start_date, available_end_date)}`;
    }

    let selected_num_stars = -1; // -1 to indicate not selected yet

    const star_elements = (() => {
        const children = [];
        [...star_selector.children].forEach(child => {
            if (children.length < 5 && child instanceof HTMLDivElement)
                children.push(child);
        });
        return children;
    })();

    function fill_stars(to_index) {
        if (to_index < -1 || to_index >= 5)
            return;

        let add = to_index === -1;
        for (let i = 0; i < star_elements.length; ++i) {
            if (add)
                star_elements[i].firstElementChild.classList.add("missing-star");
            else
                star_elements[i].firstElementChild.classList.remove("missing-star");

            if (i === to_index)
                add = true;
        }
    }

    function get_star_index(element) {
        for (let i = 0; i < star_elements.length; ++i) {
            if (star_elements[i] === element)
                return i;
        }

        return -1;
    }

    star_elements.forEach(star => {
        star.addEventListener("mouseover", e => {
            if (selected_num_stars !== -1)
                return;

            if (!(e.currentTarget.firstElementChild instanceof SVGSVGElement))
                return;

            fill_stars(get_star_index(e.currentTarget));
        });

        star.addEventListener("click", e => {
            const index = get_star_index(e.currentTarget);
            selected_num_stars = index;
            fill_stars(index);
        })
    });

    star_selector.addEventListener("mouseleave", e => {
        if (selected_num_stars !== -1)
            return;

        fill_stars(-1);
    })

    if (images.length <= 1)
        document.getElementById("view-photos-button").style.display = "none";
    else
        document.getElementById("view-photos-button").textContent = "View " + images.length + " photos";

    for (let i = 0; i < images.length; ++i) {
        const img = document.createElement("img")
        img.src = images[i];
        const list_element = image_list_container.appendChild(img);

        if (i < 5) {
            const container = i === 0 ? first_image_container : image_grid_container;
            const preview_element = container.appendChild(img.cloneNode());

            preview_element.addEventListener("click", e => {
                e.stopPropagation(); // do not call the global click event because that closes the overlay

                image_layer.classList.add("visible");
                document.body.style.overflow = "hidden";

                list_element.scrollIntoView({ block: 'center' });
            });
        }
    }

    image_layer.addEventListener("click", () => {
        image_layer.classList.remove("visible");
        document.body.style.overflow = "";
    })

    function escape_html(html)
    {
        return html
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    reviews.forEach(review => {
        reviews_container.insertAdjacentHTML("beforeend", `
            <div class="card">
                <div class="labeled-avatar">
                    <img src="${escape_html(review.profile_image)}">
                    <p>${escape_html(review.name)}</p>
                </div>
                <div class="star-rating-date-combo">
                    <div class="star-rating">
                        <svg class="star ${review.rating >= 1 ? "" : "missing-star"}"><use href="#star"></use></svg>
                        <svg class="star ${review.rating >= 2 ? "" : "missing-star"}"><use href="#star"></use></svg>
                        <svg class="star ${review.rating >= 3 ? "" : "missing-star"}"><use href="#star"></use></svg>
                        <svg class="star ${review.rating >= 4 ? "" : "missing-star"}"><use href="#star"></use></svg>
                        <svg class="star ${review.rating >= 5 ? "" : "missing-star"}"><use href="#star"></use></svg>
                    </div>
                    <p>&middot; ${escape_html(new Date(review.date).toLocaleDateString(undefined, {year: "numeric", month: "long", day: "numeric"}))}</p>
                </div>
                <p>${escape_html(review.text)}</p>
            </div>
        `);
    });

    reviews_title_text.textContent = `${reviews.length} review` + (reviews.length === 1 ? "" : "s");
    average_rating_text.textContent = `${average_rating}`;

    if (reviews.length === 0)
        average_rating_parent.style.display = "none";

    if (eligible_for_review)
        review_input_box.style.display = "block";
    else
        review_input_box.style.display = "none";

    post_review_button.addEventListener("click", () => {
        let error = false;

        if (review_text_area.value.trim() === "") {
            error = true;
            empty_review_error_text.style.display = "block";
            shake_element(empty_review_error_text);
        }
        else
            empty_review_error_text.style.display = "none";

        if (selected_num_stars === -1) {
            rating_error_text.style.display = "block";
            shake_element(rating_error_text);
            error = true;
        }
        else
            rating_error_text.style.display = "none";

        if (!error)
        {
            fetch("/api/Reviews", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    listingId: Number(id),
                    rating: selected_num_stars + 1,
                    text: review_text_area.value.trim(),
                    userId: getUserId(),
                })
            })
            .then(response => {
                if (!response.ok)
                    throw new Error("Failed to post review");

                review_text_area.value = "";
                location.reload();
            })
            .catch(error => {
                alert("Could not post review.");
                console.error(error);
            });
        }
    });

    function update_book_ui(user_action = true, is_final_click = false)
    {
        const now = new Date();
        const error = (() => {
            if (is_final_click)
            {
                if (from_date.value.trim() === "")
                {
                    book_error_text.textContent = "* Must set start date";
                    return true;
                }

                if (to_date.value.trim() === "")
                {
                    book_error_text.textContent = "* Must set end date";
                    return true;
                }
            }

            if (new Date(from_date.value) > new Date(to_date.value))
            {
                book_error_text.textContent = "* End date must be after start date";
                return true;
            }

            
            if (new Date(from_date.value) < now)
            {
                book_error_text.textContent = "* Dates must be in the future";
                return true;
            }

            if (new Date(to_date.value) > available_end_date ||
                new Date(from_date.value) < available_start_date)
            {
                book_error_text.textContent = "* Dates must be within the availability period";
                return true;
            }

            return false;
        })();

        if (!error)
        {
            book_error_text.textContent = "";

            const num_days = Math.round(Math.abs(1 + (new Date(to_date.value) - new Date(from_date.value)) / (24 * 60 * 60 * 1000)));
            if (Number.isFinite(Number(num_days)))
            {
                book_button.innerHTML = `Book for &euro;`;
                book_button.append(`${price_per_day * num_days}`);
            }
        }
        else
        {
            book_button.textContent = "Book";

            if (user_action)
                shake_element(book_error_text);
            else
                book_error_text.textContent = "";
        }

        return !error;
    }

    from_date.addEventListener("change", update_book_ui);
    to_date.addEventListener("change", update_book_ui);

    book_button.addEventListener("click", async () => {
        if (!update_book_ui(true, true))
            return;

        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({listing_id: id, user_id: getUserId(), start_date: from_date.value, end_Date: to_date.value}),
            });
            if (response.status != 200)
                throw new Error(await response.text());

            const data = await response.json();
            window.location.href = data.url;
        } catch (error) {
            console.error("Checkout failed:", error);
            alert("Checkout failed: " + error);
        }
    });

    update_book_ui(false); // update on page refresh
}
finally
{
    // this should be at the end so the page only becomes visible after all setup is done
    document.body.style.visibility = "visible";
}
