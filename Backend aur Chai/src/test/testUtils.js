import { vi } from "vitest";

export const callController = (controller, reqOverrides = {}) => {
    return new Promise((resolve) => {
        const req = {
            params: {},
            body: {},
            user: null,
            ...reqOverrides,
        };

        const res = {
            statusCode: 200,
            status: vi.fn((code) => {
                res.statusCode = code;
                return res;
            }),
            json: vi.fn((body) => {
                resolve({ res, body });
            }),
        };

        const next = vi.fn((error) => {
            resolve({ res, error, next });
        });

        controller(req, res, next);
    });
};