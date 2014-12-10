var gulp = require('gulp'),
    requirejs = require('gulp-requirejs'),
    notify = require('gulp-notify');
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    elixir = require('laravel-elixir'),
     _ = require('underscore'),
    utilities = require('laravel-elixir/ingredients/helpers/utilities');

elixir.extend('requirejs', function (src, outputDir, options) {

    var config = this,
        baseDir = config.assetsDir + 'js',
        defaultOptions;

    src = utilities.buildGulpSrc(src, baseDir, '**/*.js');

    defaultOptions = {
        baseUrl: src,
        out: 'bundle.js'
    };

    options = _.extend(defaultOptions, options);

    gulp.task('requirejs', function () {
        var onError = function(err) {
            notify.onError({
                title:    "Laravel Elixir",
                subtitle: "RequireJS Failed!",
                message:  "Error: <%= error.message %>",
                icon: __dirname + '/../laravel-elixir/icons/fail.png'
            })(err);

            this.emit('end');
        };

        return rjs(options)
            .pipe(requirejs(options)).on('error', onError)
            .pipe(gulpif(config.production, uglify()))
            .pipe(gulp.dest(options.output || config.jsOutput))
            .pipe(plugins.notify({
                title: 'Laravel Elixir',
                message: 'RequireJS Compiled!',
                icon: __dirname + '/../laravel-elixir/icons/laravel.png'
            }));;
    });

    this.registerWatcher('requirejs', baseDir + '/**/*.js');

    return this.queueTask('requirejs');

});