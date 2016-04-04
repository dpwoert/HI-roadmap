var gulp = require('gulp');
var print = require('gulp-print');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var ghPages = require('gulp-gh-pages');

gulp.task('build', function(){

	//javascript
	gulp
		.src('index.html')
		.pipe(useref())
		.pipe(gulpif('*.js', uglify()))
		.pipe(gulp.dest('./dist/'));

	//css, svg, CNAME (needed for github)
	gulp
		.src([ '*.css', '*.svg', 'CNAME' ])
		.pipe(print())
		.pipe(gulp.dest('./dist/'));

	//image folder
	gulp
		.src([ 'images/*.{svg,jpg}' ])
		.pipe(print())
		.pipe(gulp.dest('./dist/images/'));

	//data
	return gulp
		.src([ 'data/*.{json,geojson}' ])
		.pipe(print())
		.pipe(gulp.dest('./dist/data/'));


});

gulp.task('gh-pages', function(){

	return gulp
		.src('./dist/**/*')
		.pipe(ghPages());

});

gulp.task('deploy', ['build','gh-pages']);
