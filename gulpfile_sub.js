/**
 * A simple Gulp 4 Starter Kit for modern web development.
 *
 * @package @jr-cologne/create-gulp-starter-kit
 * @author JR Cologne <kontakt@jr-cologne.de>
 * @copyright 2019 JR Cologne
 * @license https://github.com/jr-cologne/gulp-starter-kit/blob/master/LICENSE MIT
 * @version v0.10.7-beta
 * @link https://github.com/jr-cologne/gulp-starter-kit GitHub Repository
 * @link https://www.npmjs.com/package/@jr-cologne/create-gulp-starter-kit npm package site
 *
 * ________________________________________________________________________________
 *
 * gulpfile.js
 *
 * The gulp configuration file.
 *
 */

const gulp                      = require('gulp'),
      del                       = require('del'),
      sourcemaps                = require('gulp-sourcemaps'),
      plumber                   = require('gulp-plumber'),
      sass                      = require('gulp-sass'),
      autoprefixer              = require('gulp-autoprefixer'),
      minifyCss                 = require('gulp-clean-css'),
      babel                     = require('gulp-babel'),
      webpack                   = require('webpack-stream'),
      uglify                    = require('gulp-uglify'),
      concat                    = require('gulp-concat'),
      imagemin                  = require('gulp-imagemin'),
      browserSync               = require('browser-sync').create(),
      gulpConnect               = require('gulp-connect'),
      gulpConnectSsi            = require('gulp-connect-ssi'),
      spritesmith               = require('gulp.spritesmith'),
      //sassPartialsImported = require('gulp-sass-partials-imported'),


      
      
      src_folder                    = './static/asset/',
      dist_folder                   = './static/di/',
      src_common_scss_folder        = src_folder + 'common_scss/',
      src_image_folder              = src_folder + '/images',
      src_scss_folder               = src_folder + 'scss/',
      src_js_folder                 = src_folder + 'js/',
      src_kendojs_folder                 = src_folder + 'kendo/js/',
      src_kendo_scss_folder                 = src_folder + 'kendo/scss/',
      dist_image_folder             = dist_folder + '/images',
      dist_scss_folder        = dist_folder + 'css/',
      dist_js_folder        = dist_folder + 'js/',
      dist_kendo_js_folder        = dist_folder + '/kendo/js/',
      dist_kendo_scss_folder        = dist_folder + '/kendo/css/',
      node_modules_folder       = './node_modules/',
      targetBrowsers = ['> 1%', 'last 2 versions', 'firefox >= 4', 'safari 7', 'safari 8', 'IE 10', 'IE 11'],

      node_dependencies         = Object.keys(require('./package.json').dependencies || {});
let scssFiles = [
  {
    name : "sass",
    src : src_scss_folder,
    dest : dist_scss_folder,
    sourceMap: dist_scss_folder
  }
]



gulp.task('clear', () => del([ dist_folder+"css/", dist_folder+"js/" ]));



gulp.task("sass", () => {
  return gulp.src([
    src_scss_folder + '**/!(_)*.scss'
  ], { since: gulp.lastRun('sass') })
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer({overrideBrowserslist : targetBrowsers}))
    .pipe(minifyCss())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dist_scss_folder))
    .pipe(gulpConnect.reload());
});

gulp.task("sass_allbuild", () => {
  return gulp.src([
    src_scss_folder + '**/!(_)*.scss'
  ])
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer({overrideBrowserslist : targetBrowsers}))
    .pipe(minifyCss())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dist_scss_folder))
    .pipe(gulpConnect.reload());
});

gulp.task("sass_build_contents", () => {
  return gulp.src([
    src_scss_folder + 'contents.scss'
  ])
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer({overrideBrowserslist : targetBrowsers}))
    .pipe(minifyCss())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dist_scss_folder))
    .pipe(gulpConnect.reload());
});

gulp.task('images', () => {
  return gulp.src([ src_image_folder + '/**/*.+(png|jpg|jpeg|gif|svg|ico)' ], { since: gulp.lastRun('images') })
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest(dist_image_folder))
    .pipe(browserSync.stream());
});







gulp.task('js-build', () => {
  return gulp.src([ src_js_folder + '**/*.js' ]/*, { since: gulp.lastRun('js') }*/)
    .pipe(plumber())
    .pipe(webpack({
      mode: 'none',  //development, production, none
      externals: {
        jquery: 'jQuery'
      }
    }))
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: [ '@babel/env' ]
    }))
    .pipe(concat('common.js'))
    // .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dist_js_folder))
    .pipe(gulpConnect.reload());
});




gulp.task('js', () => {
  return gulp.src([ src_js_folder + '**/*.js' ]/*, { since: gulp.lastRun('js') }*/)
    .pipe(plumber())
    .pipe(webpack({
      mode: 'development',  //development, production, none
      externals: {
        jquery: 'jQuery'
      }
    }))
    .pipe(sourcemaps.init())
    .pipe(babel({
      "presets": [
        [ "@babel/preset-env", {
          "targets": {
            "browsers": [ "last 1 version", "ie >= 11" ]
          }
        }]
      ]
    }))
    .pipe(concat('common.js'))
    // .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dist_js_folder))
    .pipe(gulpConnect.reload());
});



gulp.task('kendojs', () => {
  return gulp.src([ src_kendojs_folder + '**/*.js' ]/*, { since: gulp.lastRun('js') }*/)
    .pipe(plumber())
    // .pipe(webpack({
    //   mode: 'development',  //development, production, none
    //   externals: {
    //     jquery: 'jQuery'
    //   }
    // }))
    .pipe(sourcemaps.init())
    // .pipe(babel({
    //   "presets": [
    //     [ "@babel/preset-env", {
    //       "targets": {
    //         "browsers": [ "last 1 version", "ie >= 11" ]
    //       }
    //     }]
    //   ]
    // }))
    .pipe(concat('kendo.all.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dist_kendo_js_folder))
    .pipe(gulpConnect.reload());
});

gulp.task('sprite', function () {
  const spriteData = gulp.src('/images/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.css'
  }));
  return spriteData.pipe(gulp.dest('/path/'));
});

// gulp.task('sprite', function(){
//   var spriteData = gulp.src(['/etc.clientlibs/yonsei/clientlibs/common/clientlib-site/resources/image/*.png']).pipe(spritesmith({
//     imgName: 'sprite.png',
//     cssName: 'sprite.scss'
//   }));
//   return spriteData.pipe(gulp.dest('/etc.clientlibs/yonsei/clientlibs/common/clientlib-site/resources/image/icon/'));
// });

// gulp.task('sprite', function () {
//   var spriteData = gulp.src([ src_assets_folder + 'images/icon/*.png'], { since: gulp.lastRun('sprite') }).pipe(spritesmith({
//     imgName: 'sprite.png',
//     cssName: 'sprite.scss'
//   }));
//   return spriteData.pipe(gulp.dest(dist_assets_folder + 'images/icon/'));
// });


gulp.task('build', gulp.series('clear', 'sass', 'js', 'sprite'));
gulp.task('js-build', gulp.series('js-build'));


gulp.task('allbuild', 
  gulp.parallel(
    scssFiles.map(function(lib) { 
      return lib.name+"_allbuild"; 
    })
  )
);
gulp.task('dev', 
  gulp.parallel(
    scssFiles.map(function(lib) { 
      return lib.name; 
    })
  )
);

gulp.task('connect', function () {
  gulpConnect.server({
      // root: _.app,
      port: 80,
      livereload: true,
      middleware: function(){
          return [gulpConnectSsi({
              baseDir: './',
              ext: '.html',
              // domain: 'http://example.com/',
              method: 'readOnLineIfNotExist'
          })];
      }
  });
});




gulp.task('watch', () => {
  const watchVendor = [];

  node_dependencies.forEach(dependency => {
    watchVendor.push(node_modules_folder + dependency + '/**/*.*');
  });

  const watch = [
    src_scss_folder + '**/*.scss'
  ];

  const watch2 = [
    src_scss_folder + 'contents_han.scss',
    src_scss_folder + 'contents_kim.scss',
    src_scss_folder + 'contents_jin.scss'
  ];

  const allbuildLists = [
    src_common_scss_folder+"**/*.scss",
    src_folder+"kendo/scss/"
  ];
  
  
     
  gulp.watch(watch, gulp.series('dev')).on('change', browserSync.reload);

  watch2.forEach(dependency => {
    gulp.watch(dependency).on('change', function(done){
      browserSync.reload();
      gulp.series('sass_build_contents')(done);
    });
  });

  allbuildLists.forEach(dependency => {
    gulp.watch(dependency).on('change', function(done){
      gulp.series('allbuild')(done);
      browserSync.reload();
    });
  });

  gulp.watch(src_js_folder + '**/*.js').on('change', function(done){
    browserSync.reload();
    gulp.series('js')(done);
  });
  
});

gulp.task('default', gulp.series('build', gulp.parallel('connect', 'watch')));
