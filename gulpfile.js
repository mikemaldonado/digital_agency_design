/**
 * 
 */
//run npm install before running gulp


const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const autoprefixer = require('gulp-autoprefixer');
//const browserify = require('gulp-browserify');
const clean =require('gulp-clean');
const concat = require('gulp-concat');
const newer = require('gulp-newer');
const imagemin = require('gulp-imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const webp = require('gulp-webp');
const minify = require('gulp-minify');
const rename = require('gulp-rename');
const cssmin = require('gulp-cssmin');
const htmlmin = require('gulp-htmlmin');


var SOURCEPATHS = {
	sassSource: 'src/sass/*.scss',
	sassApp : 'src/sass/main.scss',
	htmlSource : 'src/*.html',
	jsSource : 'src/js/**',
	imgSource : 'src/img/**'
}
var APPPATH ={
  root: 'app/',
  css : 'app/css',
  js : 'app/js',
  fonts: 'app/fonts',
  img: 'app/img'
}

var BOWERPATH = {
	bowerDir: './bower_components'
}

gulp.task('clean-html', function() {
  return gulp.src(APPPATH.root + '*.html', {read: false, force: true })
      .pipe(clean());
});
gulp.task('clean-scripts', function() {
  return gulp.src(APPPATH.js + '/*.js', {read: false, force: true })
      .pipe(clean());
});

gulp.task('clean-images', function() {
  return gulp.src(APPPATH.img + '/**', {read: false, force: true })
      .pipe(clean());
});

gulp.task('clean-fonts', function() {
	  return gulp.src(APPPATH.fonts + '/*.{eot,svg,ttf,woff,woff2}', {read: false, force: true })
	      .pipe(clean());
	});


gulp.task('sass', function(){
  
  return gulp.src(SOURCEPATHS.sassApp)
      .pipe(sass({outputStyle: 'nested', precision: 3,
    	includePaths: [
    		BOWERPATH.bowerDir + '/bootstrap-sass/assets/stylesheets',
    		BOWERPATH.bowerDir + '/font-awesome/scss'
    		]
		}).on('error', sass.logError))
       .pipe(autoprefixer())
       .pipe(concat('app.css'))
       .pipe(gulp.dest(APPPATH.css));
});

gulp.task('init-images', ['clean-images'], function(done) {
	//TODO-install jpegarchive to help configure quality settings
	gulp.src(SOURCEPATHS.imgSource)
		.pipe(newer(APPPATH.img))
		.pipe(imagemin([imageminMozjpeg({
			quality:85
		})]))
		.pipe(gulp.dest(APPPATH.img))
		 .on("end", function() {
        done();
    });
});

gulp.task('webp', ['clean-images'], (done) => {
	//TODO check lossless for archiving photos
	gulp.src(SOURCEPATHS.imgSource)
	.pipe(newer(APPPATH.img))
	.pipe(webp({
		quality:80,
		preset: 'photo',
		method: 6
	}))
	.pipe(gulp.dest(APPPATH.img))
	.on("end", function() {
		done();
	});
});

gulp.task('images', function() {
    return gulp.src(SOURCEPATHS.imgSource)
      .pipe(newer(APPPATH.img))
      .pipe(imagemin([imageminMozjpeg({
    	  quality:85
      })]))
      .pipe(gulp.dest(APPPATH.img))
      
});

gulp.task('moveFonts', ['clean-fonts'], function() {
  return gulp.src( [BOWERPATH.bowerDir + '/font-awesome/fonts/*.{eot,svg,ttf,woff,woff2}',
	  BOWERPATH.bowerDir + '/bootstrap-sass/assets/fonts/bootstrap/*.{eot,svg,ttf,woff,woff2}'] )
      .pipe(gulp.dest(APPPATH.fonts));
});

gulp.task('scripts', ['clean-scripts'],  function() {
	return  gulp.src([BOWERPATH.bowerDir + '/jquery/dist/jquery.js', BOWERPATH.bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap.js', BOWERPATH.bowerDir + '/jquery.easing/js/jquery.easing.min.js', SOURCEPATHS.jsSource])
      .pipe(concat('main.js'))
      .pipe(gulp.dest(APPPATH.js));
});

/** Production Tasks **/
gulp.task('compress',  function() {
	
	return  gulp.src([BOWERPATH.bowerDir + '/jquery/dist/jquery.js', BOWERPATH.bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap.js', BOWERPATH.bowerDir + 'jquery.easing/js/jquery.easing.min.js', SOURCEPATHS.jsSource])
    .pipe(concat('main.js'))
      .pipe(minify())
      .pipe(gulp.dest(APPPATH.js));
  
});

gulp.task('compresscss', function(){
 
  return gulp.src(SOURCEPATHS.sassApp)
      .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(autoprefixer())
         .pipe(concat('app.css'))
         .pipe(cssmin())
         .pipe(rename({suffix: '.min'}))
         .pipe(gulp.dest(APPPATH.css));

});

gulp.task('minifyHtml', function() {
   return gulp.src(SOURCEPATHS.htmlSource)
        .pipe(htmlmin({collapseWhitespace:true}))
        .pipe(gulp.dest(APPPATH.root))
});

/** End of Production Tasks **/

gulp.task('html', ['clean-html'], function() {
   return gulp.src(SOURCEPATHS.htmlSource)
        .pipe(gulp.dest(APPPATH.root))
});
/*
gulp.task('copy', ['clean-html'], function() {
  gulp.src(SOURCEPATHS.htmlSource)
      .pipe(gulp.dest(APPPATH.root))
});
*/

gulp.task('serve', ['html'], function() {
  browserSync.init([APPPATH.css + '/*.css', APPPATH.root + '/*.html', APPPATH.js + '/*.js'], {
    server: {
      baseDir : APPPATH.root
    }
  })
});

gulp.task('watch', ['sass', 'moveFonts', 'scripts', 'serve'], function() {
    gulp.watch(SOURCEPATHS.sassSource, ['sass']);
    //gulp.watch([SOURCEPATHS.htmlSource], ['copy']);
    gulp.watch(SOURCEPATHS.jsSource, ['scripts']);
    gulp.watch(SOURCEPATHS.imgSource, ['images']);
    gulp.watch(SOURCEPATHS.htmlSource, ['html']);
} );

gulp.task('default', ['webp'], function() {
	gulp.start('watch');
});

gulp.task('production', ['minifyHtml', 'compresscss', 'compress'] );
