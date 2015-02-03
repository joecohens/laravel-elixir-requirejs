var gulp = require('gulp'),
    rjs = require('gulp-requirejs'),
    gulpIf = require('gulp-if'),
    uglify = require('gulp-uglify'),
    _ = require('underscore'),
    elixir = require('laravel-elixir'),
    utilities = require('laravel-elixir/ingredients/commands/Utilities'),
    notification = require('laravel-elixir/ingredients/commands/Notification');

elixir.extend('requirejs', function (src, options) {

    var config = this,
        defaultOptions = {
            debug:  ! config.production,
            srcDir: config.assetsDir + 'js',
            output: config.jsOutput
        };

    options = _.extend(defaultOptions, options);
    src = "./" + utilities.buildGulpSrc(src, options.srcDir);

    gulp.task('requirejs', function () {

        var onError = function(e) {
            new notification().error(e, 'RequireJS Failed!');
            this.emit('end');
        };

        return rjs(options).on('error', onError)
            .pipe(gulpIf(! options.debug, uglify()))
            .pipe(gulp.dest(options.output))
            .pipe(new notification().message('RequireJS Compiled!'));
    });

    this.registerWatcher('requirejs', options.srcDir + '/**/*.js');

    return this.queueTask('requirejs');

});
