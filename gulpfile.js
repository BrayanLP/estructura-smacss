var notify = require('gulp-notify');
var jadeInheritance = require('gulp-jade-inheritance');
var changed = require('gulp-changed');
var cached = require('gulp-cached');
var gulpif = require('gulp-if');
var filter = require('gulp-filter');

var gulp = require('gulp');
var jade = require('gulp-jade');
var connect = require('gulp-connect');
var open = require('gulp-open');
var compression = require('compression');
var fs = require('fs');

var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var ngAnnotate = require('gulp-ng-annotate');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');

var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var gutil = require('gulp-util');
var modernizr = require('modernizr');

var browserSync = require('browser-sync');
var runMode = require('gulp-sync')(gulp);

gulp.task('refresh', function() {
  browserSync.reload();
});

// Limpiar la carpeta DIST
// gulp.task('clean', function() {
//   return gulp.src('./html/trammina/js')
//       .pipe(clean());
// });

// For use create file my.json
var my = (function() {
  var filePath = __dirname + '/.my.json';
  try {
    fs.statSync(filePath);
  } catch (err) {
    if (err.code == 'ENOENT') return {};
  }
  return require(filePath);
})();

require('es6-promise').polyfill(); // for autoprefixer

var path = {
  jade: {
    watch: ['source/jade/**/*.jade'],
    from: 'source/jade/*.jade'
  },
  sass: {
    watch: ['source/sass/**/*.sass'],
    from: 'source/sass/*.sass'
  },
  js: {
    watch: ['source/js/**/*.js'],
    from: 'source/js/**/*.js'
  }
};

var config = {
  port: my.MY_SERVER_PORT
};

gulp.task('build:sass', function() {
  return gulp
    .src(path.sass.from)
    .pipe(sourcemaps.init())
    .pipe(
      sass().on('error', function(err) {
        var displayErr = gutil.colors.red(err);
        gutil.log(displayErr);
        gutil.beep();
        this.emit('end');
      })
    )
    .pipe(
      autoprefixer({
        browsers: ['last 3 versions'],
        cascade: false
      })
    )
    .pipe(
      sass({
        outputStyle: 'compressed'
      }).on('error', sass.logError)
    )
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./css'))
    .pipe(gulp.dest('../dashboard-cloud-surquillo/src/'))
    .pipe(gulp.dest('../framework-rcp/example/src/'));
});

gulp.task('build:jade', function() {
  return gulp
    .src(path.jade.from)
    .pipe(
      jade({
        pretty: true
      }).on('error', function(err) {
        var displayErr = gutil.colors.red(err);
        gutil.log(displayErr);
        gutil.beep();
        this.emit('end');
      })
    )
    .pipe(gulp.dest('./'));
});

// Procesamos todos los scripts y los agregamos en un solo archivo, ademas los verificamos para ver si hay incompatibilidades
gulp.task('build:js', function() {
  gulp
    .src(path.js.from)
    //Verificamos que no tengan problemas en la escritura/semantica
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    //Los actualizamos para ser compatibles con la minificacion
    .pipe(ngAnnotate())
    //Los comprimimos
    // .pipe(uglify())
    //Concatenamos en un solo archivo todos los JS
    .pipe(concat('app.min.js'))
    //ruta donde guardaremos el archivo
    .pipe(gulp.dest('./js'));
  // .pipe(gulp.dest('./wp/trammina/wp-content/themes/trammina/js'))
});

function compileJade(file) {
  return gulp
    .src(file)
    .pipe(
      changed('./', {
        extension: '.html'
      })
    )
    .pipe(gulpif(true, cached('jade')))
    .pipe(
      jadeInheritance({
        basedir: 'jade'
      })
    )
    .pipe(
      filter(function(file) {
        return !/\/_/.test(file.path) && !/^_/.test(file.relative);
      })
    )
    .pipe(
      jade({
        pretty: true
      }).on('error', function(err) {
        var displayErr = gutil.colors.red(err);
        gutil.log(displayErr);
        gutil.beep();
        this.emit('end');
      })
    )
    .pipe(gulp.dest('./'))
    .pipe(
      notify({
        message: 'File <%= file.relative %> builded!'
      })
    );
}

// gulp.task('connect', function() {
//   connect.server({
//     port: config.port,
//     root: './html/trammina',
//     middleware: function() {
//       return [compression()];
//     }
//   });
// });

// gulp.task('open', function() {
//   gulp.src('')
//     .pipe(open({
//       uri: 'http://localhost:' + config.port + (my.MY_BROWSER_HTML || "/html/trammina")
//     }));
// });

// gulp.task('watch', function() {
//   //jade
//   gulp.watch(path.jade.watch, function(event) {
//     return compileJade(event.path);
//   });

//   gulp.watch(path.sass.watch, ['build:sass']);
// });

/* AGREGADO PARA SINCRONIZAR */
gulp.task('go-jade', function() {
  return gulp
    .src('source/jade/**.jade')
    .pipe(jade({ pretty: true }))
    .pipe(gulp.dest('./'));
});

// Esto ejecuta solo una vez SASS Y JADE
// gulp.task('go-sass-jade', ['build:sass','go-jade']);

gulp.task('watch', function() {
  browserSync.init({
    server: {
      baseDir: './'
    },
    index: 'index.html',
    notify: true
  });

  gulp.watch('source/js/**/*.js', runMode.sync(['build:js', 'refresh']));
  gulp.watch('source/sass/**/*.sass', runMode.sync(['build:sass', 'refresh']));
  gulp.watch('source/jade/**/*.jade', runMode.sync(['go-jade', 'refresh']));
});

gulp.task('default', ['watch']);
// gulp.task('default', ['build:sass', 'watch', 'connect', 'open','build:jade']);
