const webpackConfig = require('../node_modules/@ionic/app-scripts/config/webpack.config');
const webpack = require('webpack');

const ENV = process.env.IONIC_ENV;
const envConfigFile = require(`./config-${ENV}.json`);
webpackConfig[ENV].plugins.push(
    new webpack.DefinePlugin({
        webpackGlobalVars: {
            nv_config: JSON.stringify(envConfigFile)
        }
    })
);