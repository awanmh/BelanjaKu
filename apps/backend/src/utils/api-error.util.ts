/**
 * Custom Error class for API exceptions.
 * Renamed from ApiError to resolve persistent compilation issues.
 */
export default class ApiError extends Error {
    public status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;

        // Ensure the prototype is set correctly
        Object.setPrototypeOf(this, ApiError.prototype);

        // Maintain proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiError);
        }
    }
}
