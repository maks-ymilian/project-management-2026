import {
    shake_element,
    format_date,
    format_date_range,
    //BASE_URL
} from "../wwwroot/js/common.js";

describe("common.js", () => {

    test("shake_element adds shake class", () => {
        document.body.innerHTML = `<div id="box"></div>`;
        const el = document.getElementById("box");

        shake_element(el);

        expect(el.classList.contains("shake")).toBe(true);
    });

    test("shake_element removes class after animationend", () => {
        document.body.innerHTML = `<div id="box"></div>`;
        const el = document.getElementById("box");

        shake_element(el);
        el.dispatchEvent(new Event("animationend"));

        expect(el.classList.contains("shake")).toBe(false);
    });

    test("format_date returns string", () => {
        const date = new Date();
        expect(typeof format_date(date)).toBe("string");
    });

    test("format_date_range returns string", () => {
        const start = new Date();
        const end = new Date();
        end.setDate(end.getDate() + 5);

        expect(typeof format_date_range(start, end)).toBe("string");
    });

    //test("BASE_URL exists", () => {
    //    expect(typeof BASE_URL).toBe("string");
    //});

});