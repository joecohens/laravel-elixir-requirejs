define('lib1',[], function() {

});
define('main', ['./lib1'], function(lib) {
    var foo = 'bar';
});
