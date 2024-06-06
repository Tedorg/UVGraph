const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');


module.exports = (env, argv) => {

    const isDevelopment = argv.mode === 'development';

    return {
        entry: './src/main.js',
        output: {
            filename: isDevelopment ? 'bundle.js' : 'bundle.min.js',
            path: path.resolve(__dirname, 'dist'),
        },
        plugins: [
            new webpack.ProgressPlugin(),
            // Add more plugins as needed
            new CopyPlugin({
                patterns: [
                    { from: 'src/index.html', to: 'index.html' },
                    // Add more patterns for additional HTML files as needed
                ],
            }),
        ],
        devtool: isDevelopment ? 'eval-source-map' : 'source-map',
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: 'babel-loader',
                },
                // Add more loaders as needed
            ],
        },

        // devServer: {
        //     static: {
        //         directory: path.join(__dirname, 'dist'),
        //     },
        //     compress: true,
        //     port: 9000,
        // },
    };

};