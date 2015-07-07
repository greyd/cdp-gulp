var gulp = require('gulp');
var bower = require('gulp-bower');
var less = require('gulp-less');
var util = require('gulp-util');
var cached = require('gulp-cached');
var remember = require('gulp-remember');
var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var spritesmith = require('gulp.spritesmith');

var conf = {
    less: 'src/less/*.less',
    images: 'src/images/*.{png,svg}',
    icons: 'src/images/icons/*.png',
    sprite: {
        imgName: 'images/sprite.png',
        cssName: 'css/sprite.css',
        imgPath: '../images/sprite.png'
    },
    build: {
        css: 'build/css',
        images: 'build/images'
    },
    release: {
        css: 'release/css',
        images: 'release/images'
    }

};
var bootstrap = {
    less: 'bower_components/bootstrap/less/bootstrap.less'
};
gulp.task('bower', function () {
    return bower()
        .pipe(gulp.dest('bower_components'));
});
gulp.task('style', function () {
    return gulp.src([conf.less, bootstrap.less])
        .pipe(cached())
        .pipe(less())
        .pipe(autoprefixer(['last 2 version']))
        .pipe(remember())
        .on('error', errorHandler)
        .pipe(gulp.dest(conf.build.css));
});
gulp.task('style-build', ['bower'], function () {
    return gulp.src([conf.less, bootstrap.less])
        .pipe(less())
        .pipe(autoprefixer(['last 2 version']))
        .pipe(concat('cdp.css'))
        .pipe(csso())
        .pipe(gulp.dest(conf.release.css));
});
gulp.task('images', function () {
    return gulp.src(conf.images)
        .pipe(gulp.dest(conf.build.images))
});
gulp.task('images-build', function () {
    return gulp.src(conf.images)
        .pipe(imagemin())
        .pipe(gulp.dest(conf.release.images))
});
gulp.task('sprite', function () {
    var spriteData = gulp.src(conf.icons)
        .pipe(spritesmith(conf.sprite));
    return spriteData.pipe(gulp.dest('build/'));
});
gulp.task('build', ['style', 'images']);
gulp.task('watch', ['build'], function () {
    return gulp.watch(conf.less, ['style']);
});

function errorHandler(err){
    util.log(util.colors.red('Error'), err.message);
    this.end();
}
