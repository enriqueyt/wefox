module.exports = {
    "extends": "standard",
    "rules": {
        "comma-dangle": [
            "error",
            "never"
        ],
        "max-len": [
            "error",
            {
                "code": 120,
                "tabWidth": 2,
                "ignoreStrings": true,
                "ignoreTemplateLiterals": true,
                "ignoreRegExpLiterals": true,
                "ignorePattern": "^\\s*var\\s.+=\\s*require\\s*\\(/"
            }
        ],
        "no-param-reassign": [
            "error", {
                "props": false
            }
        ],
        "no-trailing-spaces": [
            "error", {
                "skipBlankLines": true
            }
        ],
        "no-unused-expressions": [
            "error", {
                "allowTernary": true
            }
        ],
        "no-use-before-define": [
            "error", {
                "functions": false,
                "classes": false
            }
        ],
        "object-curly-spacing": [
            "error",
            "never"
        ],
        "semi": [
            "error",
            "always"
        ],
        "space-before-function-paren": [
            "error",
            "never"
        ],
        "no-extra-semi": [
            "error"
        ]
    }
};
