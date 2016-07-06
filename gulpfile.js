var gulp = require("gulp");
var runSequence = require("run-sequence");
var newer = require("gulp-newer");

var srcStaticNewer;
gulp.task("src2transpiled", function(cb) {
  if (srcStaticNewer == null) {
    srcStaticNewer = gulp.src([
        "src/**/*",
        "!src/**/*.ts",
        "!src/**/*.tsx"
      ], {
        base: "src"
      })
      .pipe(newer("transpiled"));
  }
  return srcStaticNewer
    .pipe(gulp.dest("transpiled"));
});

var tsGlob = [
  "src/**/*.ts",
  "src/**/*.tsx"
];

var ts, tsConfigUpdate, sourcemaps;
var tsConfig, tsProject;
gulp.task("tsc", function(cb) {
  if (ts == null) {
    ts = require("gulp-typescript");
    tsConfigUpdate = require("gulp-tsconfig-update");
    sourcemaps = require("gulp-sourcemaps");
  }
  if (tsConfig == null) {
    tsConfig = gulp.src(tsGlob).pipe(tsConfigUpdate());
    tsProject = ts.createProject("tsconfig.json", {
      sortOutput: true
    });
  }
  return gulp.src(tsGlob, {
      base: "src"
    })
    .pipe(sourcemaps.init())
    .pipe(ts(tsProject))
    .js
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("transpiled"));
});

gulp.task("transpile", ["tsc"]);

var transpiledStaticNewer;
gulp.task("transpiled2dist", ["src2transpiled"], function(cb) {
  if (transpiledStaticNewer == null) {
    transpiledStaticNewer = gulp.src([
        "transpiled/main/client/**/*",
        "!transpiled/main/client/**/*.js",
        "!transpiled/main/client/**/*.map"
      ], {
        base: "transpiled"
      })
      .pipe(newer("dist"));
  }
  return transpiledStaticNewer
    .pipe(gulp.dest("dist"));
});

var browserify, uglify, source, rename, glob, es;
gulp.task("build", ["transpile", "transpiled2dist"], function(cb) {
  if (browserify == null) {
    browserify = require("browserify");
    // uglify = require("gulp-uglify")
    source = require("vinyl-source-stream");
    rename = require("gulp-rename");
    glob = require("glob");
    es = require("event-stream");
  }

  glob("transpiled/main/client/**/index.js", function(err, files) {
    if (err) cb(err);
    if (!files.length) cb();

    var tasks = files.map(function(entry) {
      return browserify(entry)
        .bundle()
        .pipe(source(entry))
        .pipe(rename(function(path) {
          path.dirname = path.dirname.replace(/^transpiled[\/\\]/, "");
          path.extname = ".bundle.js";
        }))
        .pipe(gulp.dest("dist"));
    });
    es.merge(tasks).on("end", cb);
  });
});

var espower, testNewer;
gulp.task("espower", ["transpile"], function() {
  if (espower == null) {
    espower = require("gulp-espower");
  }
  if (testNewer == null) {
    testNewer = gulp.src(["transpiled/test/**/*.js"], {
        base: "transpiled"
      })
      .pipe(newer("transpiled/espowered"));
  }
  return testNewer
    .pipe(espower())
    .pipe(gulp.dest("transpiled/espowered"));
});

var mocha, espoweredSrc;
gulp.task("test", ["espower"], function() {
  if (mocha == null) {
    mocha = require("gulp-mocha");
  }
  return gulp.src([
    "transpiled/main/**/*.js",
    "transpiled/espowered/**/*.js"
  ], {
    base: "transpiled"
  }).pipe(mocha());
});

gulp.task("typedoc", function() {
  var typedoc = require("gulp-typedoc");
  return gulp.src(tsGlob)
    .pipe(typedoc({
      module: "commonjs",
      target: "es5",
      out: "docs/",
      name: "Sample Project",
      readme: "README.md"
    }));
});

function watch(glob, tasks, action) {
  var watcher = gulp.watch(glob, tasks);
  if (!action) {
    return;
  }
  watcher.on("change", function(event) {
    console.log("File \"" + event.path + "\" was " + event.type +
      ", running tasks...");
    switch (event.type) {
      case "added":
        action.onAdded && action.onAdded(event);
        break;
      case "changed":
        action.onChanged && action.onChanged(event);
        break;
      case "deleted":
        action.onDeleted && action.onDelete(event);
        break;
    }
  });
}

var fs, path;

function doWatch(pretasks) {
  if (fs == null) {
    fs = require("fs");
    path = require("path");
  }

  watch(["src/**/*"], pretasks, {
    onAdded: function(event) {
      if (event.path.match(/\.tsx?$/)) {
        tsConfig = null;
        if (event.path.match(/[\/\\]src[\/\\]test[\/\\]/)) {
          testNewer = null;
        }
      } else {
        srcStaticNewer = null;
      }
    },
    onDeleted: function(event) {
      var deleted = event.path.substr(__dirname.length);
      if (deleted.match(/\.tsx?$/)) {
        var delTarget = deleted.replace(/.tsx?$/, ".js");
        var delJs = __dirname + path.sep + "transpiled" + delTarget;
        var delJsMap = delJs + ".map";
        fs.unlink(delJs);
        console.log("File \"" + delJs + "\" was also deleted.");
        fs.unlink(delJsMap);
        console.log("File \"" + delJsMap + "\" was also deleted.");
        tsConfig = null;
        if (event.path.match(/[\/\\]src[\/\\]test[\/\\]/)) {
          testNewer = null;
        }
      } else {
        var delFile = __dirname + path.sep + "transpiled" + deleted;
        fs.unlink(delFile);
        console.log("File \"" + delFile + "\" was also deleted.");
        srcStaticNewer = null;
      }
    }
  });
}

gulp.task("watch-transpile", ["transpile"], function() {
  doWatch(["transpile"]);
});
gulp.task("watch-test", ["test"], function() {
  doWatch(["test"]);
});
gulp.task("watch-build", ["build"], function() {
  doWatch(["build"]);
});

gulp.task("clean", function(cb) {
  var del = require("del");
  del(["transpiled", "dist", "docs"]).then(function(result) {
    cb();
  });
});

gulp.task("retranspile", function(cb) {
  runSequence("clean", "transpile", cb);
});
gulp.task("rebuild", function(cb) {
  runSequence("clean", "build", cb);
});
gulp.task("retest", function(cb) {
  runSequence("clean", "test", cb);
});
