var gulp = require("gulp");

gulp.task("tsd", function(cb) {
    var tsd = require("gulp-tsd");
    return tsd({
        command: "reinstall",
        config: "tsd.json"
    }, cb);
});

var sources = [
    "src/**/*.ts",
    "src/**/*.tsx",
    "test/**/*.ts"
];

var tsConfig = require("gulp-tsconfig-update");
gulp.task("tsconfig", function() {
    return gulp.src(sources)
        .pipe(tsConfig());
});

var ts = require("gulp-typescript");
var sourcemaps = require("gulp-sourcemaps");
var tsProject = ts.createProject("tsconfig.json", {
    sortOutput: true
});
gulp.task("compile", function(cb) {
    if (tsProject.options.sourceMap) {
        return tsProject.src(sources)
            .pipe(sourcemaps.init())
            .pipe(ts(tsProject))
            .js
            .pipe(sourcemaps.write("."))
            .pipe(gulp.dest("transpiled"));
    } else {
        return tsProject.src(sources)
            .pipe(ts(tsProject))
            .js
            .pipe(gulp.dest("transpiled"));
    }
});

var tslint = require("gulp-tslint");
gulp.task("tslint", function() {
    return gulp.src(sources)
        .pipe(tslint({
            config: "tslint.json"
        }))
        .pipe(tslint.report("verbose", {
            emitError: false
        }));
});

var espower = require("gulp-espower");
gulp.task("espower", ["compile"], function() {
    return gulp
        .src([
            "transpiled/test/**/*.js"
        ])
        .pipe(espower())
        .pipe(gulp.dest("transpiled/espowered"));
});

var mocha = require("gulp-mocha");
gulp.task("test", ["espower"], function() {
    return gulp
        .src([
            "transpiled/src/**/*.js",
            "transpiled/espowered/**/*.js"
        ])
        .pipe(mocha());
});

var typedoc = require("gulp-typedoc");
gulp.task("typedoc", function() {
    return gulp
        .src(sources)
        .pipe(typedoc({
            module: "commonjs",
            target: "es5",
            out: "docs/",
            name: "Sample Project",
            readme: "README.md"
        }));
});

gulp.task("watch", function() {
    var watcher = gulp.watch("src/**/*.ts");
    watcher.on("change", function(event) {
        switch (event.type) {
            case "added":
                gulp.start("tsconfig", "compile", "tslint");
                break;
            case "changed":
                gulp.start("compile", "tslint");
                break;
            case "deleted":
                gulp.start("tsconfig", "compile");
                break;
        }
        console.log("File \"" + event.path + "\" was " + event.type + ", running tasks...");
    });
});

gulp.task("clean", function(cb) {
    var del = require("del");

    del(["transpiled", "dest", "docs"], cb);
});
