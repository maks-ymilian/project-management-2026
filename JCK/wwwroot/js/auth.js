import { Clerk } from "https://esm.sh/@clerk/clerk-js@5";

const publishableKey = "pk_test_Z3Jvd24td29tYmF0LTkxLmNsZXJrLmFjY291bnRzLmRldiQ";

const clerk = new Clerk(publishableKey);
await clerk.load();

if (clerk.isSignedIn) {
    clerk.mountUserButton(document.getElementById('user-button'))
} else {
    clerk.mountSignIn(document.getElementById('sign-in'))
}
