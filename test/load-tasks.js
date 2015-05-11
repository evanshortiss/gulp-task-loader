'use strict';

/*jshint -W030 */

var expect = require('chai').expect
  , gulp = require('gulp')
  , path = require('path')
  , gtl = require('../index.js');

// Removes existing tasks
function cleanTasks () {
  gulp.tasks = {};
}

describe('gulp-task-loader', function () {

  afterEach(cleanTasks);

  it('Should load a basic task from a directory', function () {
    gtl.loadTasks({
      gulp: gulp,
      dir: path.join(__dirname, './test-tasks/basic')
    });

    expect(gulp.tasks).to.not.be.empty;
    expect(gulp.tasks).to.have.property('task');
  });

  it('Should try to load an empty task dir', function () {
    gtl.loadTasks({
      gulp: gulp,
      dir: path.join(__dirname, './test-tasks/empty')
    });

    expect(gulp.tasks).to.be.empty;
  });

  it('Should load a basic task from a directory', function () {
    gtl.loadTasks({
      gulp: gulp,
      dir: path.join(__dirname, './test-tasks/folders')
    });

    expect(gulp.tasks).to.not.be.empty;
    expect(Object.keys(gulp.tasks)).to.have.length(4);
    expect(gulp.tasks).to.have.property('file');
    expect(gulp.tasks).to.have.property('parent:c');
    expect(gulp.tasks).to.have.property('next-parent:a');
    expect(gulp.tasks).to.have.property('next-parent:b');
  });

});
