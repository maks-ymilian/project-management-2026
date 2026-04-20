import { jest } from '@jest/globals';

jest.unstable_mockModule('../wwwroot/js/location.js', () => ({
  get_location: jest.fn()
}));

const { get_location } = await import('../wwwroot/js/location.js');
const { default: searchScript } = await import('../wwwroot/js/search.js');

describe('search script', () => {
  let searchBox;

  beforeEach(() => {
    document.body.innerHTML = `
      <input id="searchBox" />
    `;

    searchBox = document.getElementById("searchBox");

    delete window.location;
    window.location = { href: "" };
  });

  test('sets placeholder using location', () => {
    get_location.mockImplementation((cb) => cb("Dublin"));

    searchScript(); // <-- IMPORTANT: run manually

    expect(searchBox.placeholder).toBe("Search in Dublin");
  });

  test('redirects on Enter key', () => {
    searchScript();

    searchBox.value = "test query";

    const event = new KeyboardEvent("keyup", { key: "Enter" });
    searchBox.dispatchEvent(event);

    expect(window.location.href).toBe("/?search=test%20query");
  });

  test('does nothing on non-Enter key', () => {
    searchScript();

    searchBox.value = "test query";

    const event = new KeyboardEvent("keyup", { key: "a" });
    searchBox.dispatchEvent(event);

    expect(window.location.href).toBe("");
  });
});