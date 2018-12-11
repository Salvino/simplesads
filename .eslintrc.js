module.exports = {
    "extends": "airbnb-base",
    "rules": {
        "indent": ["error", "tab"],
        "no-tabs": 0,
        "padded-blocks": ["error", "always"],
        "no-useless-concat":"off",
        "no-plusplus":"off",
        "max-len": ["error", { "code": 800 }],
        "prefer-template":"off",
        "prefer-arrow-callback":"off",
        "func-names":"off",
        "no-undef":"off",
        "object-shorthand":"off",
        "no-var":"off",
        "no-unused-expressions":"off",
        "prefer-destructuring":"off"
    },
    "env": {
        "node": true,
    }
}