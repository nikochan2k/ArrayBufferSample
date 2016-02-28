var gulp = require("gulp");
var newer = require("gulp-newer");


var mainGlob = [
    "src/*main/**/*.ts",
    "src/*main/**/*.tsx"
];

var playgroundGlob = [
    "src/*playground/**/*.ts",
    "src/*playground/**/*.tsx"
];

var testGlob = [
    "src/*test/**/*.ts",
];

var tsGlob = mainGlob.concat(playgroundGlob).concat(testGlob);
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
        main = null;
        test = null;
        return result;
    }
});

var sourcemaps = null;
var babel = null;

function compile(newer) {
    if (tsProject.options.sourceMap) {
        if (sourcemaps == null) {
            sourcemaps = require("gulp-sourcemaps");
            babel = require("gulp-babel");
        }
        return newer
            .pipe(sourcemaps.init())
            .pipe(ts(tsProject))
            .pipe(babel({
                presets: ['es2015']
            }))
            .pipe(sourcemaps.write("."))
            .pipe(gulp.dest("transpiled"));
    } else {
        return newer
            .pipe(ts(tsProject))
            .pipe(babel({
                presets: ['es2015']
            }))
            .pipe(gulp.dest("transpiled"));
    }
}
var mainNewer = null;
gulp.task("compile", ["tsconfig"], function(cb) {
    if (mainNewer == null) {
        var mainSrc = gulp.src(mainGlob);
        mainNewer = mainSrc
            .pipe(newer({
                dest: "transpiled",
                ext: ".js"
            }));
    }
    return compile(mainNewer);
});
var playgroundNewer = null;
gulp.task("compile:playground", ["compile"], function(cb) {
    if (playgroundNewer == null) {
        var playgroundSrc = gulp.src(playgroundGlob);
        playgroundNewer = playgroundSrc
            .pipe(newer({
                dest: "transpiled",
                ext: ".js"
            }));
    }
    return compile(playgroundNewer);
});
var testNewer = null;
gulp.task("compile:test", ["compile"], function(cb) {
    if (testNewer == null) {
        var testSrc = gulp.src(testGlob);
        testNewer = testSrc
            .pipe(newer({
                dest: "transpiled",
                ext: ".js"
            }));
        testJsNewer = null;
    }
    return compile(testNewer);
});

var tslint = null;

function lint(tsNewer) {
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
    return lint(mainNewer);
});
gulp.task("tslint:playground", ["compile:playground"], function() {
    return lint(playgroundNewer);
});
gulp.task("tslint:test", ["compile:test"], function() {
    return lint(testNewer);
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
    if (espoweredJsNewer == null) {
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
            target: "es6",
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

    var mainWatcher = gulp.watch(mainGlob, ["tslint"]);
    mainWatcher.on("change", function(event) {
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

    var testWatcher = gulp.watch(testGlob, ["tslint:test"]);
    testWatcher.on("change", function(event) {
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
