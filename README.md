gulp-task-loader
================

Auto generate tasks for your gulpfile the modular way, like a boss.

This module will allow you to define your gulp tasks in separate files/folders
and automatically load them into gulp for use in your gulpfile. It supports a
subtask Grunt-like syntax too which is nice when you want to define child tasks
under a single parent name e.g _ng-annotate:add_ and _ng-annotate:remove_.

## Example

You have the following project structure:

```
|---gulpfile.js
|---/www
|---/gulp
	|-----minify.js
	|-----concat.js
	|-----/ng-anotate
		|-----add.js
		|-----remove.js
```

Your gulpfile can look like this:

```javascript
var gulp = require('gulp')
	, gtl = require('gulp-task-loader');

gtl.loadTasks({
	gulp: gulp,
	dir: path.join(__dirname, './gulp')
});

// We can use any task defined in the ./gulp folder
gulp.task('bundle', [
	'ng-annotate:add',
	'concat',
	'minify',
	'ng-annotate:remove' // Tidy up our source files by removing annotations
]);
```

All the tasks have been intelligently loaded for you!

# API
Just a single function is exported by this library.

### loadTasks(opts)
Load tasks into gulp for the provided options object. Options can include the
following keys:

* gulp - Required. The gulp instance to bind tasks to.
* dir - Required. Where we should load tasks from.
* logLevel - Used to enable logging for debugging. Supports 'info', 'error' etc.
