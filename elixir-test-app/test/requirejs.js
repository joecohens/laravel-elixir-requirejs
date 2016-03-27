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

});

var shouldExist = (file) => {
    return fs.existsSync(file).should.be.true;
};

var runGulp = assertions => {
    gulp.start('default', () => {
        assertions();

        remove.sync('./public/js');
    });
};