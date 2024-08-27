const DEBOUNCE_TIME = 1000;
const routes = {
    cart_add: "/cart/add",
    cart_update: "/cart/update",
    discount_apply: "/discount/apply",
    discount_remove: "/discount/remove",
    product_review: "/review/add",
    newsletter_signup: "/newsletter-signup",
    auth_login: "/account/login",
    auth_register: "/account/register",
    auth_forgot_password: "/account/forgot-password",
    // auth_reset_password: "/account/reset-password/:id/:token"
}

function fetchConfig(type = 'json') {
    return {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: `application/${type}` },
    };
}


function parseFormToJson(formData) {
    var object = {};
    formData.forEach(function (value, key) {
        object[key] = value;
    });
    var json = JSON.stringify(object);

    return json;
}


function renderComponents(selector, component) {
    const targets = document.querySelectorAll(selector);
    if (!targets.length) return;

    targets.forEach(element => {
        element.innerHTML = component;
    })
}