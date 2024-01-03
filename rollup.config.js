import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve';

const babelConfig = {
    babelrc: false,
    runtimeHelpers: true,
    presets: [
        '@babel/preset-env'
    ],
    plugins: [
        ["@babel/plugin-transform-runtime", {
            "regenerator": true
        }]
    ]
}

export default {
    input: './lib/index.js',
    output: {
        file: '../revolt-fx-examples/src/pixi-7.3.x/UMD/revoltfx.min.js',
        format: 'iife',
        name: 'revolt',
        globals: {
            'pixi.js': 'PIXI'
        },
    },
    moduleContext: () => 'window',
    external: [
        'pixi.js'
    ],
    plugins: [
        nodeResolve(),
        commonjs(),
        babel(babelConfig),
        terser(),
    ]
};
