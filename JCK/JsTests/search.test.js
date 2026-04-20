import { get_location } from './location.js';

jest.mock('./location.js', () => ({
  get_location: jest.fn()
}));

describe('search script', () => {
  let searchBox;

  beforeEach(() => {
    document.body.innerHTML = `
      <input id="searchBox" />
    `;

    searchBox = document.getElementById("searchBox");

    delete window.location;
    window.location = { href: "" };

    jest.resetModules(); // important because script runs on import
  });

  test('sets placeholder using location', async () => {
    get_location.mockImplementation((cb) => cb("Dublin"));

    await import('./yourScriptFile.js');

    expect(searchBox.placeholder).toBe("Search in Dublin");
  });

  test('redirects on Enter key', async () => {
    await import('./yourScriptFile.js');

    searchBox.value = "test query";

    const event = new KeyboardEvent("keyup", { key: "Enter" });
    searchBox.dispatchEvent(event);

    expect(window.location.href).toBe("/?search=test%20query");
  });

  test('does nothing on non-Enter key', async () => {
    await import('./yourScriptFile.js');

    searchBox.value = "test query";

    const event = new KeyboardEvent("keyup", { key: "a" });
    searchBox.dispatchEvent(event);

    expect(window.location.href).toBe("");
  });
});