var gulp = require("gulp"),
	del = require("del"),
	ts = require("gulp-typescript"),
	tsProject = ts.createProject("tsconfig.json");

var compileTS = function () {
	return tsProject.src()
		.pipe(tsProject())
		.js.pipe(gulp.dest("app"));
};

gulp.task("ts", compileTS);

gulp.task("cleanup", function() {
	return del([__dirname + "/app"]);
});

gulp.task("default", ["cleanup", "ts"], function () {
	gulp.watch("src/**/*.ts", ["ts"]);
});