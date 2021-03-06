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
var del = require('del');
var htmlreplace = require('gulp-html-replace');
var uglify = require('gulp-uglify');
var mainBowerFiles = require('main-bower-files');
var filter = require('gulp-filter');

var conf = {
    less: 'src/less/*.less',
    images: ['src/images/**/*.{png,svg}', '!src/images/icons/**'],
    icons: 'src/images/icons/*.png',
    sprite: {
        imgName: 'images/build/sprite.png',
        cssName: 'less/build/sprite.less',
        imgPath: '../images/build/sprite.png'
    },
    build: {
        folder: 'build',
        css: 'build/css',
        images: 'build/images'
    },
    release: {
        folder: 'release',
        css: 'release/build/css',
        js: 'release/build/js',
        images: 'release/build/images'
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
gulp.task('style-build', ['bower', 'sprite'], function () {
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
gulp.task('images-build', ['bower', 'sprite'], function () {
    return gulp.src(conf.images)
        .pipe(imagemin())
        .pipe(gulp.dest(conf.release.images))
});
gulp.task('sprite', function () {
    var spriteData = gulp.src(conf.icons)
        .pipe(spritesmith(conf.sprite));
    return spriteData.pipe(gulp.dest('src/'));
});
gulp.task('prepare', ['style', 'images']);
gulp.task('build', ['style-build', 'images-build', 'html-build', 'script-build']);
gulp.task('watch', ['prepare'], function () {
    return gulp.watch(conf.less, ['style']);
});
gulp.task('clean', function (cb) {
    del([conf.release.folder, conf.build.folder], cb);
});
gulp.task('html-build', function () {
    return gulp.src('src/*.html')
        .pipe(htmlreplace({
            'css': '../build/css/cdp.css',
            'js': '../build/js/cdp.js'
        }))
        .pipe(gulp.dest('release/tpl'));
});
gulp.task('script-build', ['bower'], function () {
    return gulp.src(mainBowerFiles({includeDev: true}))
        .pipe(filter('*.js'))
        .pipe(concat('cdp.js'))
        .pipe(uglify())
        .pipe(gulp.dest(conf.release.js));
});

function errorHandler(err){
    util.log(util.colors.red('Error'), err.message);
    this.end();
}
