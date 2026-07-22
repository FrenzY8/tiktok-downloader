export function success(data = {}, message = "success") {
    return {
        success: true,
        message,
        ...data,
    };
}

export function fail(message = "something went wrong") {
    return {
        success: false,
        message,
    };
}