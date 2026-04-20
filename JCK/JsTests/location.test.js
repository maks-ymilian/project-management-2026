import { jest } from '@jest/globals';
import { get_location } from "../wwwroot/js/location.js";

describe("location.js", () => {

    beforeEach(() => {
        sessionStorage.clear();
        global.fetch = jest.fn();
    });

    test("uses cached sessionStorage location", () => {
        sessionStorage.setItem("location", "Dublin");

        const callback = jest.fn();

        get_location(callback);

        expect(callback).toHaveBeenCalledWith("Dublin");
    });

    test("does nothing if geolocation unavailable", () => {
        const callback = jest.fn();

        navigator.geolocation = undefined;

        get_location(callback);

        expect(callback).not.toHaveBeenCalled();
    });

    test("fetches and stores location", async () => {
        const callback = jest.fn();

        navigator.geolocation = {
            getCurrentPosition: (success) =>
                success({
                    coords: { latitude: 53, longitude: -6 }
                })
        };

        fetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                addresses: [
                    {
                        address: {
                            municipality: "Dublin"
                        }
                    }
                ]
            })
        });

        await new Promise(resolve => {
            get_location((value) => {
                callback(value);
                resolve();
            });
        });

        expect(callback).toHaveBeenCalledWith("Dublin");
        expect(sessionStorage.getItem("location")).toBe("Dublin");
    });

});