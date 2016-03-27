var gulp = require('gulp');
var print = require('gulp-print');
var uglify = require('gulp-uglify')
var useref = require('gulp-useref')
var gulpif = require('gulp-if')

gulp.task('build', function(){

	//javascript
	gulp
		.src('index.html')
		.pipe(useref())
		.pipe(gulpif('*.js', uglify()))
		.pipe(gulp.dest('./dist/'));

	//css
	gulp
		.src([ '*.css' ])
		.pipe(print())
		.pipe(gulp.dest('./dist/'));

	//data
	return gulp
		.src([ 'data/*.{json,geojson}' ])
		.pipe(print())
		.pipe(gulp.dest('./dist/data/'));


});
