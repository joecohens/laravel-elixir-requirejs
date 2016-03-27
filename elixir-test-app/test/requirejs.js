var fs     = require('fs');
var gulp   = require('gulp');
var remove = require('rimraf');
var should = require('chai').should();
var Elixir = require('laravel-elixir');
var ElixirRequireJs = require('../../');

describe('RequireJS Task', function() {

    beforeEach(() => {
        Elixir.tasks = Elixir.config.tasks = [];
    });

    it('compiles RequireJS files to the public/js directory', done => {
        Elixir(mix => mix.requirejs('main.js'));

        runGulp(() => {
            shouldExist('./public/js/main.js');

            done();
        });
    });

    it('should not break stream and process the next mix steps', done => {
        Elixir(mix => {
            mix.requirejs('main.js');
            mix.copy('resources/assets/css/style.css', 'public/css/style.css');
        });

        runGulp(() => {
            shouldExist('./public/js/main.js');
            shouldExist('./public/css/style.css');

            done();
        });
    });

});

var shouldExist = (file) => {
    return fs.existsSync(file).should.be.true;
};

var runGulp = assertions => {
    gulp.start('default', () => {
        assertions();

        remove.sync('./public/js');
        remove.sync('./public/css');
    });
};