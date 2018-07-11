module.exports = function (grunt) {
    
    grunt.initConfig({

        clean: {
            dist: ['./lib/', './dist/']
        },
        ts: {
            dist: {
                tsconfig: './tsconfig.json',
                src: ['./src/**/*.ts'],
                outDir: './lib/',
            }
        },
        uglify: {
            options: {
                compress: {
                    drop_console: true
                }
            },
            dist: {
                files: {
                    'dist/revoltfx.min.js': ['dist/revoltfx.js']
                }
            }
        },
        browserify: {
            dist: {
                files: {
                    'dist/revoltfx.js': ['lib/index.js']
                },
                options: {
                    browserifyOptions: {
                        standalone: 'revolt',
                    },
                    exclude: ['pixi.js']
                }
            }
        },
        copy: {
            dist: {
                src: 'dist/revoltfx.min.js',
                dest:'examples/js/revoltfx.min.js'
            }
        }

    });
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('dist', ['clean:dist', 'ts:dist', 'browserify:dist', 'uglify:dist', 'copy:dist']);
};