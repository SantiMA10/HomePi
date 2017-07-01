var gulp = require("gulp"),
	del = require("del"),
	ts = require("gulp-typescript"),
	tsProject = ts.createProject("tsconfig.json")
	typedoc = require("gulp-typedoc");

var compileTS = function () {
	return tsProject.src()
		.pipe(tsProject())
		.js.pipe(gulp.dest("app"));
};

gulp.task("doc", function() {
	return gulp
		.src(["src/**/*.ts"])
		.pipe(typedoc({
			module: "commonjs",
			target: "es5",
			out: "docs/",
			name: "My project title"
		}))
		;
});

gulp.task("ts", compileTS);

gulp.task("cleanup", function() {
	return del([__dirname + "/app"]);
});

gulp.task("default", ["cleanup", "ts"], function () {
	compileTS();
	gulp.watch("src/**/*.ts", ["ts"]);
});