import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';



const babelConfig = {
    babelrc: false,
    babelHelpers: 'runtime',
    presets: [
        ['@babel/preset-env']
    ],
    plugins: [
        ['@babel/plugin-transform-runtime', {
            "regenerator": true
        }]
    ]
}

export default {
    input: './lib/index.js',
    output: {
        file: './dist/revoltfx.min.js',
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
