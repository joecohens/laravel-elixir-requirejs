var gulp = require('gulp'),
    rjs = require('gulp-requirejs'),
    _ = require('underscore'),
    Elixir = require('laravel-elixir');

var $ = Elixir.Plugins;
var config = Elixir.config;

Elixir.extend('requirejs', function (src, options) {
    options = _.extend({
        debug:     ! config.production,
        srcDir:    config.get('assets.js.folder'),
        outputDir: config.get('public.js.outputFolder'),
    }, options);

    var paths = prepGulpPaths(src, options.srcDir, options.outputDir);

    new Elixir.Task('requirejs', function () {
        this.log(paths.src, paths.output);

        return (
            rjs(options)
                .on('error', function(e) {
                    new Elixir.Notification('RequireJS Compilation Failed!');

                    this.emit('end');
                })
                .pipe($.if(! options.debug, $.uglify()))
                .pipe(gulp.dest(paths.output.baseDir))
                .pipe(new Elixir.Notification('RequireJS Compiled!'))
        );
    })
    .watch(config.get('assets.js.folder') + '/**/*.js');
});

/**
 * Prep the Gulp src and output paths.
 *
 * @param {string|array} src
 * @param {string|null}  baseDir
 * @param {string|null}  output
 */
var prepGulpPaths = function(src, baseDir, output) {
    return new Elixir.GulpPaths()
        .src(src, baseDir)
        .output(output, 'app.js');
};
