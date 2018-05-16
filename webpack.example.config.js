const path = require('path');

module.exports = {
    mode:'production',
    entry: './example/src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './example/dist')
    }
};