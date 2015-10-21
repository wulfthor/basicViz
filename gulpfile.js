var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    gulpMocha = require('gulp-mocha');

gulp.task('default', function() {
    nodemon({
        script: 'bin/www',
        ext: 'js',
        env: {
            PORT: 8010
        },
        ignore: ['./node_modules/**']
    })
    .on('restart', function(){
        console.log('we have restarted');
    });

});

