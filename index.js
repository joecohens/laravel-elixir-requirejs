var gulp = require('gulp');
var rjs = require('gulp-requirejs');
var _ = require('underscore');
var Elixir = require('laravel-elixir');

var $ = Elixir.Plugins;
var config = Elixir.config;

Elixir.extend('requirejs', function (src, options, output) {
    var paths = prepGulpPaths(src, output);

    options = _.extend({
        name: paths.src.name.replace(paths.src.extension, ''),
        baseUrl: paths.src.baseDir,
        out: paths.output.name,
        findNestedDependencies: true,
        skipPragmas: true,
        create: true
    }, options);

    new Elixir.Task('requirejs', function () {
        this.log(paths.src, paths.output);

        return (
            rjs(options)
                .on('error', function(e) {
                    new Elixir.Notification('RequireJS Compilation Failed!');

                    this.emit('end');
                })
                .pipe($.if(! config.production, $.uglify()))
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
 * @param {string|null}  output
 * @return {object}
 */
var prepGulpPaths = function(src, output) {
    return new Elixir.GulpPaths()
        .src(src, config.get('assets.js.folder'))
        .output(output || config.get('public.js.outputFolder'), 'app.js');
};

