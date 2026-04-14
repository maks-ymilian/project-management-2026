import { get_location } from '/js/location.js'
import { shake_element } from '/js/common.js'

const location_text = document.getElementById("location-text");   
const create_button = document.getElementById("create-button");   
const name_input = document.getElementById("name-input");   
const year_input = document.getElementById("year-input");   
const description_input = document.getElementById("description-input");   
const price_input = document.getElementById("price-input");   
const start_date_input = document.getElementById("start-date-input");   
const end_date_input = document.getElementById("end-date-input");   
const images_input = document.getElementById("images-input");   
const title_error_text = document.getElementById("title-error-text");   
const year_error_text = document.getElementById("year-error-text");   
const description_error_text = document.getElementById("description-error-text");   
const price_error_text = document.getElementById("price-error-text");   
const start_date_error_text = document.getElementById("start-date-error-text");   
const end_date_error_text = document.getElementById("end-date-error-text");   
const images_input_error_text = document.getElementById("images-input-error-text");   

get_location((location) => location_text.textContent = "Location: " + location);

function get_title() {
    const value = name_input.value.trim();
    if (value === "")
        return { error: "Name must not be empty" };

    if (value.length > 150)
        return { error: "Name is too long" };

    return { value: value }
}

function get_year() {
    const value = Number(year_input.value.trim());
    if (!value)
        return { error: "Year must not be empty" };

    if (!Number.isInteger(value))
        return { error: "Year must be an integer" };

    return { value: value }
}

function get_description() {
    const value = description_input.value.trim();
    if (value === "")
        return { error: "Description must not be empty" };

    if (value.length > 10000)
        return { error: "Description is too long" };

    return { value: value }
}

function get_price() {
    const value = Number(price_input.value.trim());
    if (!value)
        return { error: "Price must not be empty" };

    if (value < 0)
        return { error: "Price must not be negative" };

    return { value: value }
}

function get_dates() {
    const start_date = start_date_input.value;
    const end_date = end_date_input.value;

    if (start_date.trim() === "")
        return { error: "Start date must have a value" };

    if (end_date.trim() === "")
        return { error: "End date must have a value" };

    if (new Date(start_date) > new Date(end_date))
        return { error: "End date must be after start date" };

    if (new Date(start_date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0))
        return { error: "Dates must be in the future" };

    return { start: start_date, end: end_date}
}

function get_image_files() {
    const value = images_input.files;

    if (value.length < 1)
        return { error: "Must include at least one image" };

    for (const file of value)
        if (!file.type.startsWith("image/"))
            return { error: "Not an image: " + file.name };

    return { value: value }
}

function handle_error(value, error_text, on_error) {
    if ("error" in value) {
        error_text.textContent = value.error;
        shake_element(error_text);
        on_error();
    }
    else
        error_text.textContent = "";

    return value;
}

create_button.addEventListener("click", () => {
    let has_error = false;

    const title = handle_error(get_title(), title_error_text, () => has_error = true);
    const year = handle_error(get_year(), year_error_text, () => has_error = true);
    const description = handle_error(get_description(), description_error_text, () => has_error = true);
    const price = handle_error(get_price(), price_error_text, () => has_error = true);
    const dates = handle_error(get_dates(), start_date_error_text, () => has_error = true);
    const image_files = handle_error(get_image_files(), images_input_error_text, () => has_error = true);

    if (has_error)
        return;

    alert(`todo make it post to db\ntitle: ${title.value}\nyear:${year.value}\ndescription: ${description.value}\nprice: ${price.value}\nstart date: ${dates.start}\nend date: ${dates.end}`);
})

