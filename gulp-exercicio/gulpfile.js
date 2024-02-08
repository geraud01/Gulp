// Importando o módulo esm para suportar módulos ES no Node.js
require = require("esm")(module);

// Importando os módulos do Gulp
const { series, parallel } = require('gulp');
const gulp = require('gulp');
const concat = require('gulp-concat');
const cssmin = require('gulp-cssmin');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const stripJs = require('gulp-strip-comments');
const stripCss = require('gulp-strip-css-comments');
const { promisify } = require('util');
const htmlmin = require('gulp-htmlmin');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

// Promisificando o módulo gulpImage (imagemin)
const gulpImage = promisify(imagemin);

// Definindo a tarefa para processar estilos (CSS)
function tarefasCSS() {
  return gulp.src([
    './node_modules/bootstrap/dist/css/bootstrap.css',
    './node_modules/@fortawesome/fontawesome-free/css/fontawesome.css',
    './vendor/owl/css/owl.css',
    './vendor/jquery-ui/jquery-ui.css',
    './src/css/style.css'
  ])
    .pipe(stripCss())                   // remove comentários
    .pipe(concat('styles.css'))         // mescla arquivos
    .pipe(cssmin())                     // minifica css
    .pipe(rename({ suffix: '.min' }))   // styles.min.css
    .pipe(gulp.dest('./dist/css'));     // cria arquivo em novo diretório
}

// Definindo a tarefa para processar scripts (JS)
async function tarefasJS() {
  return gulp.src([
    './node_modules/jquery/dist/jquery.js',
    './node_modules/bootstrap/dist/js/bootstrap.js',
    './vendor/owl/js/owl.js',
    './vendor/jquery-mask/jquery.mask.js',
    './vendor/jquery-ui/jquery-ui.js',
    './src/js/custom.js'
  ])
    .pipe(stripJs())                    // remove comentários
    .pipe(concat('scripts.js'))         // mescla arquivos
    .pipe(uglify())                     // minifica js
    .pipe(rename({ suffix: '.min' }))   // scripts.min.js
    .pipe(gulp.dest('./dist/js'));      // cria arquivo em novo diretório
}

// Definindo a tarefa para processar imagens
async function tarefasImagem() {
  return gulp.src('./src/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('./dist/images'));
}

// POC - Proof of Concept
function tarefasHTML() {
  return gulp.src('./src/**/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('./dist'));
}


// Tarefa 'serve'
gulp.task('serve', function () {
    browserSync.init({
      server: {
        baseDir: "./",
        startPath: "/dist"
      }
    });
  
    gulp.watch('./src/**/*', series(tarefasHTML, tarefasJS, tarefasCSS)).on('change', reload);
  });
  

// Tarefa 'watch'
gulp.task('watch', function () {
    gulp.watch('./src/**/*', series(tarefasHTML, tarefasJS, tarefasCSS));
  });
  
// Tarefa 'end'
function end(cb) {
  console.log("tarefas concluídas");
  return cb();
}

// Tarefa 'default' que engloba todas as outras tarefas
const defaultTask = series(parallel(tarefasHTML, tarefasJS, tarefasCSS, tarefasImagem), end);

// Exportando as tarefas
exports.styles = tarefasCSS;
exports.scripts = tarefasJS;
exports.images = tarefasImagem;
exports.default = defaultTask;
