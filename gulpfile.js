var gulp = require('gulp');
var less = require('gulp-less');

var conf = {
    less: 'src/less/*.less',
    images: 'src/images/*.{png,svg}',
    build: {
        css: 'build/css',
        images: 'build/images'
    }

};
var bootstrap = {
    less: 'bower_components/bootstrap/less/bootstrap.less'
};

gulp.task('style', function () {
    return gulp.src([conf.less, bootstrap.less])
        .pipe(less())
        .pipe(gulp.dest(conf.build.css))
});
gulp.task('images', function () {
    return gulp.src(conf.images)
        .pipe(gulp.dest(conf.build.images))
});
gulp.task('build', ['style', 'images']);
