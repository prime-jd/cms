class ApiError extends Error{
    constructor(
        status,
        message = "something went wrong",
        errors = [],
        stack = ""
    ){
        super(message);
        this.status = status;
        this.message = message;
        this.errors = errors;
        this.data = null,
        this.success = false;
    }
}

export {ApiError}