import { isSignedIn, mountSignIn } from "./auth.js";

jest.mock("./auth.js", () => ({
  isSignedIn: jest.fn(),
  mountSignIn: jest.fn()
}));

describe("auth page logic", () => {
  let signInDiv;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="sign-in"></div>
    `;

    signInDiv = document.getElementById("sign-in");

    delete window.location;
    window.location = { href: "" };

    jest.resetModules();
  });

  test("redirects to home if user is signed in", async () => {
    isSignedIn.mockReturnValue(true);

    await import("./yourFile.js");

    expect(window.location.href).toBe("/");
    expect(mountSignIn).not.toHaveBeenCalled();
  });

  test("mounts sign in if user is not signed in", async () => {
    isSignedIn.mockReturnValue(false);

    await import("./yourFile.js");

    expect(mountSignIn).toHaveBeenCalledWith(signInDiv, "/");
    expect(window.location.href).toBe("");
  });
});