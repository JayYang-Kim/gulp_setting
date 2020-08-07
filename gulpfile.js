/**
 * @Gulp : Gulp 및 Package Modules 호출
 */
// Gulp 호출
const { src, dest, task, watch, series, parallel } = require('gulp');
// Gulp Package Modules 호출
const   gulp            = require('gulp'),
        del             = require('del'),
        sourcemaps      = require('gulp-sourcemaps'),
        plumber         = require('gulp-plumber'),
        sass            = require('gulp-sass'),
        livereload      = require('gulp-livereload'),
        autoprefixer    = require('gulp-autoprefixer'),
        minifyCss       = require('gulp-clean-css'),
        babel           = require('gulp-babel'),
        webpack         = require('webpack-stream'),
        uglify          = require('gulp-uglify'),
        rename          = require('gulp-rename'),
        concat          = require('gulp-concat'),
        imagemin        = require('gulp-imagemin'),
        browserSync     = require('browser-sync').create(),
        gulpConnect     = require('gulp-connect'),
        gulpConnectSsi  = require('gulp-connect-ssi'),
        spritesmith     = require('gulp.spritesmith');

// 경로
const asset = 'static/asset';
const di = 'static/di';
const paths = {
    js : asset + '/js/**/*.js',
    scss : asset + '/scss/**/*.scss'
}

/**
 * ========================================
 * @SCSS : SCSS Config(환경설정)
 * ========================================
*/
const scssOptions = {
    outputStyle: "expanded", // CSS의 컴파일 결과 코드 스타일 지정
    indentType: "tab", // 컴파일 된 CSS의 들여쓰기의 타입
    indentWidth: 1, // 컴파일 된 CSS의 들려쓰기의 개수
    precision: 6, // 컴파일 된 CSS의 소수점 자리수
    sourceComments: true // 컴파일 된 CSS에 원본 소스의 위치와 줄 수 주석표시
}

/**
 * ========================================
 * @Task : HTML livereload 반영
 * ========================================
 */
task('html', function(){
    return src('./**/*.html') // HTML 파일을 읽어오기 위해 경로 지정
        .pipe(livereload()); // HTML 파일을 읽어온 후 Livereload 호출하여 브라우저에 반영
});

/**
 * ========================================
 * @Task : Script 병합, 압축, min 파일 생성
 * ========================================
*/
task('js:combine', function(){
    return src(paths.js, {sourcemaps: true})
        .pipe(concat('combined.js'))
        .pipe(dest(di + '/js'))
        .pipe(uglify())
        .pipe(rename('combined.min.js'))
        .pipe(dest(di + '/js'))
        .pipe(livereload()); // 스크립트 Task를 모두 수행한 후 Livereload 호출하여 브라우저에 반영
    // return src('project/src/js/**/*.js', {sourcemaps: true})
    //     .pipe(concat('conbined.js'))
    //     .pipe(dest('project/dist/js', {sourcemaps: true}))
    //     .pipe(uglify({
    //         mangle : true
    //     }))
    //     .pipe(rename('combined.min.js'))
    //     .pipe(dest('project/dist/js', {sourcemaps: true}));
});

/**
 * ========================================
 * @Task : SCSS Compile & Sourcemaps
 * ========================================
 */
task('scss:compile', function(){
    return src(paths.scss) // SCSS 파일 일기
        .pipe(sourcemaps.init()) // Sourcemaps 초기화 및 생성
        .pipe(sass(scssOptions).on('error', sass.logError)) // SCSS 함수에 옵션값을 설정, SCSS 작성 시 Watch 작업이 멈추지 않도록 logError 설정
        .pipe(sourcemaps.write()) // 위에서 생성한 소스맵 사용
        .pipe(dest(di + '/css')) // 파일 생성 위치 설정
        .pipe(livereload());
});

/**
 * ========================================
 * @Task : Livereload 실행
 * ========================================
 */
task('live', series('html', 'js:combine', 'scss:compile'), function(){
    livereload.listen(
        {
            basePath: dist
        }
    )
});

task('connect', function(){
    gulpConnect.server({
        port: 80,
        livereload: true,
        middleware: function(){
            return [gulpConnectSsi({
                baseDir: './',
                ext: '.html',
                method: 'readOnLineIfNotExist'
            })];
        }
    });
});

task('watch', function(){
    watch('./**/*.html', series('html'));
    watch(paths.js, series('js:combine'));
    watch(paths.scss, series('scss:compile'));
    // watch('project/src/js/**/*.js', series('combine-js'));
});

task('default', series('live', parallel('connect', 'watch')));

// gulp.task('default', async function(){
//     console.log('======================================');
//     console.log('==========gulp-default start==========');
//     console.log('======================================');
// });
// gulp.task('default', function(){
//     return new Promise(function(resolve, reject){
//         console.log('======================================');
//         console.log('==========gulp-default start==========');
//         console.log('======================================');
//         resolve();
//     });
// });