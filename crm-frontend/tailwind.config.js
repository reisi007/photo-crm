/** @type {import('tailwindcss').Config} */

function extensions() {
    return ['hover', 'focus', 'disabled', 'visited'];
}

const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    content: ["./src/**/*.{html,ts}",],
    theme: {
        extend: {
            fontWeight: extensions(),
            fontFamily: {
                sans: ['Roboto', ...defaultTheme.fontFamily.sans],
                icons: ["Martina", "material-icons"]
            },
            colors: {
                primary: {
                    DEFAULT: '#2A9D8F',
                    alternative: '#1A6158',
                    accent: '#4ED0C1'
                },
                onPrimary: {
                    DEFAULT: '#FFFFFF',
                    accent: '#E8EDED'
                },
                secondary: {
                    DEFAULT: '#E8EDED',
                    alternative: '#040F0F'
                },
                onSecondary: {
                    DEFAULT: '#1A6158',
                    alternative: '#FFFFFF'
                },
                gold: {
                    DEFAULT: '#EBE357'
                },
                error: {
                    DEFAULT: '#B12A2A'
                }
            },
            spacing: {
                '128': '32rem',
                '160': '40rem',
                '192': '48rem',
                '224': '56rem',
                '256': '64rem',
                '288': '72rem',
                '320': '80rem',
                '384': '96rem',
                '448': '112rem',
                '512': '128rem'
            }
        }
    },
    plugins: [],
};
