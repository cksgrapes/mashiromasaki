/**
 * パッケージ読込
 */
var gulp         = require('gulp'), //gulp
    ejs          = require('gulp-ejs'), //ejs
    sass         = require('gulp-sass'), //sass
    autoprefixer = require('gulp-autoprefixer'),
    csscomb      = require('gulp-csscomb'),
    cleanCss     = require('gulp-clean-css'),
    cmq          = require('gulp-combine-media-queries'),
    imagemin     = require('gulp-imagemin'), //image
    sprite       = require('gulp.spritesmith'),
    uglify       = require('gulp-uglify'), //js,
    styleguide   = require('sc5-styleguide'), //styleguide
    browserSync  = require('browser-sync'), //browser sync
    sequence     = require('run-sequence'), //utility
    concat       = require('gulp-concat'),
    changed      = require('gulp-changed'),
    cached       = require('gulp-cached'),
    rename       = require('gulp-rename'),
    sourcemaps   = require('gulp-sourcemaps'),
    plumber      = require('gulp-plumber'),
    notify       = require('gulp-notify'),
    buffer       = require('vinyl-buffer'),
    merge        = require('merge-stream'),
    rimraf       = require('rimraf'),
    fs           = require('fs');

/**
 * パス定義・他
 */
var develop = { //開発用パス
    'root' : 'dev/',
    'ejs'  : ['dev/ejs/**/*.ejs', '!dev/ejs/**/_*.ejs'],
    'ejsw' : ['dev/ejs/**/*.ejs'],
    'data' : 'dev/data/',
    'sass' : 'dev/css/**/*.scss',
    'minifyCss': 'dev/css/*.scss',
    'js': ['dev/js/**/*.js', '!' + 'dev/js/lib/**/*.js'],
    'libJs': 'dev/js/lib/**/*.js',
    // 'libJsSp': 'dev/sp/js/lib/**/*.js',
    'image': ['dev/img/**/*.{png,jpg,gif,svg}'],
    'sprite': 'dev/sprite/*.png',
    'spritesvg': 'dev/sprite/*.svg'
  },
  release = { //リリース用パス
    'root' : 'release/',
    'html' : 'release/',
    'sass' : 'release/assets/css/',
    'js'   : 'release/assets/js/',
    'libJs': 'release/assets/js/',
    // 'libJsSp': 'release/sp/js/',
    'image': 'release/assets/img/',
    'minifyCss': 'release/assets/css/'
  },
  AUTOPREFIXER_BROWSERS = [
    // @see https://github.com/ai/browserslist#browsers
    'last 2 versions',
    'ie >= 11',
    'iOS >= 8',
    'Android >= 4.2'
  ];

/**
 * ejsコンパイル
 */
gulp.task('ejs', function() {
  return gulp.src(develop.ejs)
  // .pipe(changed(release.html, {extension: '.html'}))
  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
  .pipe(ejs({
      site  : JSON.parse(fs.readFileSync(develop.data + 'site.json')),
      sample: JSON.parse(fs.readFileSync(develop.data + 'sample.json'))
    },
    {ext: '.html'}
  ))
  .pipe(gulp.dest(release.html))
  .pipe(browserSync.reload({stream: true}));
});

/**
 * sassコンパイル
 */
gulp.task('sass', function(){
  return gulp.src(develop.sass)
  // .pipe(cached('sass'))
  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer({
    browsers: AUTOPREFIXER_BROWSERS,
  }))
  .pipe(csscomb())
  .pipe(cmq())
  // .pipe(cleanCss())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(release.sass))
  .pipe(browserSync.reload({stream: true}));
});

/**
 * デフォルトjsファイルとjQueryをリリースディレクトリに出力します。
 */
gulp.task('js', function() {
  return gulp.src(develop.js)
  .pipe(sourcemaps.init())
  .pipe(uglify({preserveComments: 'license'}))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(release.js))
  .pipe(browserSync.reload({stream: true}));
});

/**
 * デベロップディレクトリにあるjQueryプラグインなどのファイルを連結してリリースディレクトリに出力します。
 */
 var libJs = function(src,dest) {
  return gulp.src(src)
  .pipe(sourcemaps.init())
  .pipe(concat('lib.js'))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(dest))
  .pipe(browserSync.reload({stream: true}));
};
gulp.task('libJs', function() {
  libJs(develop.libJs,release.libJs);
});
// gulp.task('libJsSp', function() {
//   libJs(develop.libJsSp,release.libJsSp);
// });

/**
 * デベロップディレクトリの画像を圧縮、
 * 階層構造を維持したまま、リリースディレクトリに出力します。
 */
gulp.task('image', function() {
  return gulp.src(develop.image)
  .pipe(changed(release.root))
  .pipe(imagemin({
    // jpgをロスレス圧縮（画質を落とさず、メタデータを削除）。
    progressive: true,
    // gifをインターレースgifにします。
    interlaced: true,
    // PNGファイルの圧縮率（7が最高）を指定します。
    optimizationLevel: 7
  }))
  .pipe(gulp.dest(release.image))
  .pipe(browserSync.reload({stream: true}));
});

/**
 * スプライト画像を作成
 */
gulp.task('sprite', function(){
  var spriteData = gulp.src(develop.sprite)
    .pipe(sprite({
      imgName: 'sprite.png',
      cssName: '_sprite.scss',
      imgPath: '../img/sprite.png',
      padding: 15
    }));
  var imgStream = spriteData.img
    .pipe(buffer())
    .pipe(imagemin({
      optimizationLevel: 7
    }))
    .pipe(gulp.dest('dev/img/'));
  var cssStream = spriteData.css
    .pipe(gulp.dest('dev/css/'));
  return merge(imgStream, cssStream);
});

/**
 * リリースディレクトリの削除
 */
gulp.task('clean', function (cb) {
  rimraf(release.root, cb);
});

/**
 * ビルド
 */
gulp.task('build', function(){
  sequence(
    'sprite',
    ['ejs','image','sass','js','libJs']
  )
});

/**
 * 監視
 */
gulp.task('watch', ['build'],function() {
  gulp.watch(develop.ejsw, ['ejs']);
  gulp.watch(develop.data + '**/*.json', ['ejs']);
  gulp.watch(develop.sass, ['sass']);
  gulp.watch(develop.js, ['js']);
  gulp.watch(develop.libJs, ['libJs']);
  // gulp.watch(develop.libJsSp, ['libJsSp']);
  gulp.watch(develop.image, ['image']);
  gulp.watch(develop.sprite, ['sprite']);
});

/**
 * ローカルサーバーの起動
 */
gulp.task('browser-sync', function() {
  browserSync({
    port: 3000,
    server: {
      baseDir: release.root,
      index: "index.html"
    }
  });
});


/**
 * 開発用タスク
 */
gulp.task('default', ['clean'], function() {
  sequence(
    'watch',
    'browser-sync'
  )
});

/**
 * リリースに使用するタスクです。
 * リリースディレクトリを最新の状態にしてから、ファイルの圧縮をします。
 */
gulp.task('release', ['clean'], function() {
  sequence(
    'sprite',
    ['ejs','image','sass','js','libJs']
  )
});





