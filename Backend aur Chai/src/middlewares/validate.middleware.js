import { ApiError } from "../utils/ApiError.js";

export const validate = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse({
            body: req.body,
            params: req.params,
            query: req.query,
        });

        if (!result.success) {
            const errors = result.error.issues.map((issue) => ({
                path: issue.path.join("."),
                message: issue.message,
            }));

            throw new ApiError(400, "Validation failed", errors);
        }

        if (result.data.body) {
            req.body = result.data.body;
        }

        if (result.data.params) {
            req.params = result.data.params;
        }

        // Do not assign req.query directly in Express 5.
        req.validatedQuery = result.data.query || req.query;

        next();
    };
};