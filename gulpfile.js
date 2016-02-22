var gulp = require("gulp");
var newer = require("gulp-newer");


gulp.task("tsd", function(cb) {
    var tsd = require("gulp-tsd");
    return tsd({
        command: "reinstall",
        config: "tsd.json"
    }, cb);
});


var tsMainGlob = [
    "src/*main/**/*.ts",
    "src/*main/**/*.tsx",
    "src/*playground/**/*.ts",
    "src/*playground/**/*.tsx"
];
var tsMain = null;

var tsTestGlob = [
    "src/*test/**/*.ts",
];
var tsTest = null;

var tsGlob = tsMainGlob.concat(tsTestGlob);
var ts = null;
var tsConfig = null;
var tsProject = null;
gulp.task("tsconfig", function() {
    if (ts == null) {
        ts = require("gulp-typescript");
        tsConfig = require("gulp-tsconfig-update");
    }
    if (tsProject == null) {
        var tsSrc = gulp.src(tsGlob);
        var result = tsSrc
            .pipe(tsConfig());
        tsProject = ts.createProject("tsconfig.json", {
            sortOutput: true
        });
        tsMain = null;
        tsTest = null;
        return result;
    }
});

var sourcemaps = null;
function tsCompile(newer) {
    if (tsProject.options.sourceMap) {
        if (sourcemaps == null) {
            sourcemaps = require("gulp-sourcemaps");
        }
        return newer
            .pipe(sourcemaps.init())
            .pipe(ts(tsProject))
            .js
            .pipe(sourcemaps.write("."))
            .pipe(gulp.dest("transpiled"));
    } else {
        return newer
            .pipe(ts(tsProject))
            .js
            .pipe(gulp.dest("transpiled"));
    }
}
var tsMainNewer = null;
gulp.task("compile", ["tsconfig"], function(cb) {
    if (tsMainNewer == null) {
        var tsMainSrc = gulp.src(tsMainGlob);
        tsMainNewer = tsMainSrc
            .pipe(newer({
                dest: "transpiled",
                ext: ".js"
            }));
    }
    return tsCompile(tsMainNewer);
});
var tsTestNewer = null;
gulp.task("compile:test", ["compile"], function(cb) {
    if (tsTestNewer == null) {
        var tsTestSrc = gulp.src(tsTestGlob);
        tsTestNewer = tsTestSrc
            .pipe(newer({
                dest: "transpiled",
                ext: ".js"
            }));
        testJsNewer = null;
    }
    return tsCompile(tsTestNewer);
});

var tslint = null;
function lint(tsNewer){
    if (tslint == null) {
        tslint = require("gulp-tslint");
    }
    return tsNewer
        .pipe(tslint({
            config: "tslint.json"
        }))
        .pipe(tslint.report("verbose", {
            emitError: false
        }));
}
gulp.task("tslint", ["compile"], function() {
    return lint(tsMainNewer);
});
gulp.task("tslint:test", ["compile:test"], function() {
    return lint(tsTestNewer);
});

var staticGlob = [
    "src/**/*",
    "!src/**/*.ts",
    "!src/**/*.tsx"
];
var staticNewer = null;
gulp.task("copy", function(cb) {
    if (staticNewer == null) {
        var staticSrc = gulp.src(staticGlob)
        staticNewer = staticSrc
            .pipe(newer("transpiled"));
    }
    return staticNewer
        .pipe(gulp.dest("transpiled"));
});

gulp.task("build", ["tslint", "copy"]);

var espower = null;
var testJsNewer = null;
gulp.task("espower", ["tslint:test"], function() {
    if (espower == null) {
        espower = require("gulp-espower");
    }
    if (testJsNewer == null) {
        var testJsGlob = ["transpiled/test/**/*.js"];
        var testJsSrc = gulp.src(testJsGlob);
        testJsNewer = testJsSrc.pipe(newer("transpiled/espowered"));
        espoweredJsNewer = null;
    }
    return testJsNewer
        .pipe(espower())
        .pipe(gulp.dest("transpiled/espowered"));
});

var mocha = null;
var espoweredJsSrc = null;
gulp.task("test", ["espower"], function() {
    if (mocha == null) {
        mocha = require("gulp-mocha");
    }
    if(espoweredJsNewer == null){
        var espoweredJsGlob = [
            "transpiled/main/**/*.js",
            "transpiled/espowered/**/*.js"
        ];
        espoweredJsSrc = gulp.src(espoweredJsGlob);
    }
    return espoweredJsSrc
        .pipe(mocha());
});


var typedoc = null;
gulp.task("typedoc", function() {
    if (typedoc == null) {
        typedoc = require("gulp-typedoc");
    }
    return tsNewer
        .pipe(typedoc({
            module: "commonjs",
            target: "es5",
            out: "docs/",
            name: "Sample Project",
            readme: "README.md"
        }));
});


var fs = null,
    path = null;
gulp.task("watch", function() {
    if (fs == null) {
        fs = require('fs');
        path = require("path");
    }

    var tsMainWatcher = gulp.watch(tsMainGlob, ["tslint"]);
    tsMainWatcher.on("change", function(event) {
        console.log('File "' + event.path + '" was ' + event.type + ", running tasks...");
        switch (event.type) {
            case "added":
                tsProject = null;
                break;
            case "changed":
                break;
            case "deleted":
                var delTarget = event.path.substr(__dirname.length)
                    .replace(/.ts$/, ".js");
                var delJs = __dirname + path.sep + "transpiled" + delTarget;
                var delJsMap = delJs + ".map";
                fs.unlink(delJs);
                fs.unlink(delJsMap);
                tsProject = null;
                break;
        }
    });

    var staticWatcher = gulp.watch(staticGlob, ["copy"]);
    staticWatcher.on("change", function(event) {
        console.log('File "' + event.path + '" was ' + event.type + ", running tasks...");
        switch (event.type) {
            case "added":
                break;
            case "changed":
                break;
            case "deleted":
                var delTarget = event.path.substr(__dirname.length)
                var delFile = __dirname + path.sep + "transpiled" + delTarget;
                fs.unlink(delFile);
                break;
        }
    });

    var tsTestWatcher = gulp.watch(tsTestGlob, ["tslint:test"]);
    tsTestWatcher.on("change", function(event) {
        console.log('File "' + event.path + '" was ' + event.type + ", running tasks...");
        switch (event.type) {
            case "added":
                tsProject = null;
                break;
            case "changed":
                break;
            case "deleted":
                var delTarget = event.path.substr(__dirname.length)
                    .replace(/.ts$/, ".js");
                var delJs = __dirname + path.sep + "transpiled" + delTarget;
                var delJsMap = delJs + ".map";
                fs.unlink(delJs);
                fs.unlink(delJsMap);
                tsProject = null;
                break;
        }
    });
});

gulp.task("clean", function(cb) {
    var del = require("del");
    del(["transpiled", "dest", "docs"], cb);
});
gulp.task("rebuild", ["clean", "build"]);
gulp.task("retest", ["clean", "test"]);
