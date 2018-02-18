import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import camelCase from 'lodash.camelcase';
import json from 'rollup-plugin-json';

const async = require('rollup-plugin-async');
const pkg = require('./package.json');

const libraryName = 'netvote-core';

export default {
  input: `compiled/${libraryName}.js`,
  output: [
    {file: pkg.main, name: camelCase(libraryName), format: 'umd'},
    {file: pkg.module, format: 'es'}
  ],
  sourcemap: true,
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: ['ipfs-mini', 'ethjs'],
  globals: {
    'ipfs-mini': 'IPFS',
    'ethjs': 'Eth'
  },
  watch: {
    include: 'compiled/**'
  },
  plugins: [
    async(),
    json(),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve({
      preferBuiltins: true
    }),

    // Resolve source maps to the original source
    sourceMaps()

  ],
  onwarn: function (warning) {
    if (warning.code === 'THIS_IS_UNDEFINED') {return; }
    console.warn(warning.message);
  }
};
