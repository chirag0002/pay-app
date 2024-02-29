const zod = require('zod');

const userSignUpBody = zod.object({
    username: zod.string().min(3).max(64),
    first_name: zod.string().min(3).max(64),
    last_name: zod.string().min(3).max(64),
    email: zod.string().email().max(64),
    password: zod.string().min(6).max(64)
});

const userSignInBody = zod.object({
    email: zod.string().email().max(64),
    password: zod.string().min(6).max(64)
});

function userSignInValidator(email, password) {
    const response = userSignInBody.safeParse({ email, password });
    return response;
};

function userSignUpValidator(username, first_name, last_name, email, password) {
    const response = userSignUpBody.safeParse({ username, first_name, last_name, email, password });
    return response;
};

module.exports = {
    userSignUpValidator,
    userSignInValidator
};
