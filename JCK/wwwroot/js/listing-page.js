import { shake_element } from '/js/common.js'

const car_name = "Car name";
const owner_name = "name";
const owner_image = "/images/user.jpg";
const description = "LongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLong                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

const average_rating = 3.5;
const eligible_for_review = true;

const price_per_day = 100;
const available_start_date = new Date(2025, 2, 1);
const available_end_date = new Date(2026, 6, 5);

const reviews = [
    {rating: 3, date: new Date(2025, 11, 10), name: "reviewer", profile_image:"/images/car4.webp", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},
    {rating: 1, date: new Date(2025, 11, 10), name: "guy", profile_image:"/images/user.jpg", text: "he scammed me"},
    {rating: 5, date: new Date(2025, 11, 10), name: "guy", profile_image:"/images/user.jpg", text: "amazing car"},
    {rating: 3, date: new Date(2025, 11, 10), name: "guy", profile_image:"/images/user.jpg", text: "llongwordlongwordlongwordlongwordlongwordlongwordlongwordongword"},
    {rating: 1, date: new Date(2025, 11, 10), name: "guy", profile_image:"/images/user.jpg", text: "he scammed me"},
    {rating: 3, date: new Date(2025, 11, 10), name: "guy", profile_image:"/images/user.jpg", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},
    {rating: 1, date: new Date(2025, 11, 10), name: "guy", profile_image:"/images/user.jpg", text: "he scammed me"},
    {rating: 5, date: new Date(2025, 11, 10), name: "guy", profile_image:"/images/user.jpg", text: "i would never create an alt account to boost my rating"},
];

const images = [
    "/images/car4.webp",
    "/images/car5.jpg",
    "/images/car1.webp",
    "/images/car2.jpg",
    "/images/car3.webp",
    "/images/car7.webp",
    "/images/car6.jpg",
];

// ^ todo all of the above variables should be pulled in from the database ^

try {
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

    function format_date(date)
    {
        if (date.getFullYear() === new Date().getFullYear()) // if the year in the date is this year
            return date.toLocaleDateString(undefined, { month: "long", day: "numeric" });
        else
            return date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
    }

    if (available_start_date < new Date())
    {
        if (available_end_date > new Date())
            availability_text.textContent = `Available until ${format_date(available_end_date)}`;
        else
        {
            availability_text.textContent = "This car is not available.";
            booking_ui.style.display = "none";
        }
    }
    else
    {
        availability_text.textContent = `Available from ${format_date(available_start_date)}`;
        availability_text.insertAdjacentHTML("beforeend", "<br>");
        availability_text.append(`to ${format_date(available_end_date)}`);
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

    document.addEventListener("click", (e) => {
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
                    <p>&middot; ${escape_html(review.date.toLocaleDateString(undefined, {year: "numeric", month: "long", day: "numeric"}))}</p>
                </div>
                <p>${escape_html(review.text)}</p>
            </div>
        `);
    });

    reviews_title_text.textContent = `${reviews.length} reviews`;
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
            review_text_area.value = "";
            location.reload(); // refresh the page
        }
    });

    function update_book_ui(user_action = true, is_final_click = false)
    {
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

            if (new Date(from_date.value) < new Date())
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

    book_button.addEventListener("click", () => {
        if (update_book_ui(true, true))
        {
            alert("succesbs");
        }
    });

    update_book_ui(false); // update on page refresh
}
finally
{
    // this should be at the end so the page only becomes visible after all setup is done
    document.body.style.visibility = "visible";
}
