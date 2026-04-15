//For browser
import { Clerk } from "https://esm.sh/@clerk/clerk-js@5";

//For testing
//import { Clerk } from "@clerk/clerk-js";

const publishableKey = "pk_test_Z3Jvd24td29tYmF0LTkxLmNsZXJrLmFjY291bnRzLmRldiQ";

const clerk = new Clerk(publishableKey);
await clerk.load();

export function isSignedIn() {
    return clerk.isSignedIn;
}

export function mountUserButton(element) {
    clerk.mountUserButton(element);
}

export function mountSignIn(element, afterSignInUrl) {
    clerk.mountSignIn(element, {afterSignInUrl: afterSignInUrl});
}
