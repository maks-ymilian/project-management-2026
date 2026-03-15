import {isSignedIn, mountSignIn} from "./auth.js";

if (isSignedIn()) {
    // redirect to home page
    window.location.href = "/";
}
else {
    mountSignIn(document.getElementById("sign-in"), "/");
}
