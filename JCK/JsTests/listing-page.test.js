import { jest } from '@jest/globals';
import { getUser, getUserId } from "../wwwroot/js/auth.js";
import { shake_element } from "../wwwroot/js/common.js";

global.fetch = jest.fn();

jest.mock("./auth.js", () => ({
  getUser: jest.fn(),
  getUserId: jest.fn()
}));

jest.mock("./common.js", () => ({
  shake_element: jest.fn(),
  format_date: jest.fn(),
  format_date_range: jest.fn()
}));

describe("listing page", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="image-list-container"></div>
      <div id="first-image-container"></div>
      <div id="image-grid-container"></div>
      <div id="image-layer"></div>

      <div id="star-selector">
        <div><svg></svg></div>
        <div><svg></svg></div>
        <div><svg></svg></div>
        <div><svg></svg></div>
        <div><svg></svg></div>
      </div>

      <div id="reviews-container"></div>
      <div id="reviews-title-text"></div>
      <div id="average-rating-text"></div>
      <div id="average-rating-parent"></div>

      <div id="review-input-box"></div>
      <textarea id="review-text-area"></textarea>
      <button id="post-review-button"></button>

      <div id="availability-text"></div>
      <div id="booking-ui"></div>
      <div id="price-text"></div>
      <div id="owner-text"></div>
      <img id="owner-profile-picture" />

      <button id="book-button"></button>

      <input id="from-date" />
      <input id="to-date" />

      <div id="book-error-text"></div>
      <div id="rating-error-text"></div>
      <div id="empty-review-error-text"></div>

      <h1 id="listing-title-text"></h1>
      <p id="description-text"></p>
    `;

    window.history.pushState({}, "", "?id=123");

    delete window.location;
    window.location = { href: "", search: "?id=123" };

    jest.resetModules();
    fetch.mockReset();
  });

  test("loads listing and renders title", async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          userId: 1,
          carName: "Test Car",
          description: "Nice car",
          pricePerDay: 50,
          availableStartDate: "2030-01-01",
          availableEndDate: "2030-12-31",
          images: []
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          averageRating: 4,
          reviews: []
        })
      });

    getUser.mockResolvedValue({
      username: "John",
      imageUrl: ""
    });

    getUserId.mockReturnValue(5);

    await import("./yourFile.js");

    expect(document.getElementById("listing-title-text").textContent)
      .toBe("Test Car");
  });

  test("posts review when valid", async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          userId: 1,
          carName: "Test Car",
          description: "Nice car",
          pricePerDay: 50,
          availableStartDate: "2030-01-01",
          availableEndDate: "2030-12-31",
          images: []
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          averageRating: 4,
          reviews: []
        })
      })
      .mockResolvedValueOnce({
        ok: true
      });

    getUser.mockResolvedValue({
      username: "John",
      imageUrl: ""
    });

    getUserId.mockReturnValue(5);

    await import("./yourFile.js");

    document.getElementById("review-text-area").value = "Great car";

    const stars = document.querySelectorAll("#star-selector div");
    stars[4].click(); // 5 stars

    document.getElementById("post-review-button").click();

    expect(fetch).toHaveBeenCalledWith(
      "/api/Reviews",
      expect.objectContaining({
        method: "POST"
      })
    );
  });

  test("handles booking request", async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          userId: 1,
          carName: "Test Car",
          description: "Nice car",
          pricePerDay: 50,
          availableStartDate: "2030-01-01",
          availableEndDate: "2030-12-31",
          images: []
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          averageRating: 4,
          reviews: []
        })
      })
      .mockResolvedValueOnce({
        status: 200
      });

    getUser.mockResolvedValue({
      username: "John",
      imageUrl: ""
    });

    getUserId.mockReturnValue(5);

    await import("./yourFile.js");

    document.getElementById("from-date").value = "2030-02-01";
    document.getElementById("to-date").value = "2030-02-05";

    document.getElementById("book-button").click();

    expect(fetch).toHaveBeenCalledWith(
      "/api/listing/123/book",
      expect.any(Object)
    );
  });
});