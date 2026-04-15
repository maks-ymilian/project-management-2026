import { jest } from '@jest/globals';

const mockMountUserButton = jest.fn();
const mockMountSignIn = jest.fn();

const mockClerkInstance = {
    load: jest.fn().mockResolvedValue(),
    isSignedIn: true,
    mountUserButton: mockMountUserButton,
    mountSignIn: mockMountSignIn
};

await jest.unstable_mockModule('@clerk/clerk-js', () => ({
    Clerk: jest.fn(() => mockClerkInstance)
}));

const auth = await import('../wwwroot/js/auth.js');

describe('auth.js', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('isSignedIn returns true', () => {
        mockClerkInstance.isSignedIn = true;
        expect(auth.isSignedIn()).toBe(true);
    });

    test('isSignedIn returns false', () => {
        mockClerkInstance.isSignedIn = false;
        expect(auth.isSignedIn()).toBe(false);
    });

    test('mountUserButton calls Clerk', () => {
        const el = {};
        auth.mountUserButton(el);
        expect(mockMountUserButton).toHaveBeenCalledWith(el);
    });

    test('mountSignIn calls Clerk with url', () => {
        const el = {};
        auth.mountSignIn(el, '/home');

        expect(mockMountSignIn).toHaveBeenCalledWith(el, {
            afterSignInUrl: '/home'
        });
    });
});