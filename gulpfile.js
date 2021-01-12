const gulp = require('gulp');
const  sass = require('gulp-sass');
const browserSync = require('browser-sync');
const concat = require('gulp-concat');
const uglify = require('gulp-uglifyjs');
const cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');
const image = require('gulp-image');
const del = require('del');

gulp.task('sass', function () {
  return gulp.src('app/sass/*.+(scss|sass)')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('css-libs', ()=>{
  return gulp.src('app/sass/libs.scss')
  .pipe(sass())
  .pipe(cssnano())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('app/css'));
})

gulp.task('script', () => {
  return gulp.src([
      'app/libs/jquery/dist/jquery.min.js'
  ])
      .pipe(concat('libs.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('app/js'))
});
gulp.task('html',  () =>  {
  return gulp.src('app/*.html')
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', () => {
gulp.watch('app/sass/**/*.+(scss|sass)', gulp.parallel('sass'));
gulp.watch(['app/js/*.js', 'app/libs/**/*.js'], gulp.parallel('script'));
gulp.watch('app/*.html', gulp.parallel('html'));
});

gulp.task('browser-sync', () => {
  browserSync({
      server: {
          baseDir: 'app'
      },
      notify: false
  });
});

gulp.task('img', async () => {
  gulp.src('app/img/**/*')
    .pipe(image({
      pngquant: true,
      optipng: false,
      zopflipng: true,
      jpegRecompress: false,
      mozjpeg: true,
      gifsicle: true,
      svgo: true,
      concurrent: 10,
      quiet: true // defaults to false
    }))
    .pipe(gulp.dest('./dist/img'));
});

gulp.task('clean', async () => {
  return del.sync('dist');
});



gulp.task('prebuild', async () => {
  gulp.src(['app/css/style.css', 'app/css/libs.min.css'])
      .pipe(gulp.dest('dist/css'));
  gulp.src('app/js/*')
      .pipe(gulp.dest('dist/js'));
  gulp.src('app/*.html')
      .pipe(gulp.dest('dist'));
});

gulp.task('default', gulp.parallel( 'sass', 'browser-sync', 'watch'));

gulp.task('build', gulp.parallel('prebuild','clean','img', 'sass', 'script'));
