const preset = require("./vendor/filament/filament/tailwind.config.preset");

module.exports = {
    presets: [preset],
    content: [
        "./app/Filament/**/*.php",
        "./resources/views/filament/**/*.blade.php",
        "./vendor/filament/**/*.blade.php",
    ],
    theme: {
        extend: {
            spacing: {
                sidebar: "200px",
                "sidebar-collapsed": "4rem",
            },
        },
    },
};
