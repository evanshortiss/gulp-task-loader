'use strict';

var path = require('path')
  , log = require('fhlog').get('Gulp Task Loader')
  , fs = require('fs');


module.exports = {
  loadTasks: loadTasks
};


function remapLogLevel (lvl) {
  var map = {
    'info': 'INF',
    'debug': 'DBG',
    'warn': 'WRN',
    'error': 'ERR'
  };

  return log.LEVELS[map[lvl]];
}

/**
 * Primary export.
 * This function and sub functions will perform the entire task import.
 * @param  {Object} opts
 */
function loadTasks (opts) {
  var gulp = opts.gulp
    , taskDir = opts.dir;

  if (!gulp) {
    throw new Error('"gulp" option not provided to gulp-task-loader');
  }

  if (!taskDir) {
    throw new Error('"dir" option not provided to gulp-task-loader');
  }

  // Set our logger to warn by default
  log.setLogLevel(
    remapLogLevel(opts.logLevel) || log.LEVELS.WRN
  );


  log.d('Reading tasks in folder %s', taskDir);

  // Get all entires in the gulp tasks dir
  var entries = getTaskEntries(taskDir);

  log.d('Folder %s contained %d tasks', taskDir, entries.length);

  entries.forEach(registerEntry);


  /**
   * Register an file/folder with gulp as a task.
   * @param  {String} e  The entry
   */
  function registerEntry (e) {
    var p  = path.join(taskDir, e)
      , stat = fs.lstatSync(p);

    if (stat.isFile()) {
      log.d('Register task for file at %s', p);
      registerTask(null, e);
    } else {
      log.d('Register tasks in folder at %s', p);
      registerFolder(e);
    }
  }


  /**
   * Register a task correctly with format "parent:child"
   * @param  {String}   parent    The parent folder name (parent task)
   * @return {String}   filename  The filename (sub task)
   */
  function registerTask (parent, filename) {
    var name = path.basename(filename, '.js')
      , p = path.join(taskDir, parent || '', filename);

    // Add the parent name prefix
    if (parent) {
      name = parent.concat(':').concat(name);
    }

    try {
      log.d('Registering task %s', name);

      var task = require(p);

      if (typeof task !== 'function') {
        log.w('Task "%s" (%s) is not a function. Task files should export' +
          ' a function e.g module.exports = function () ...;', name, p);
      }

      gulp.task(name, task);

    } catch (e) {
      log.e('Error registering task %s', name);
      log.e(e.toString());
      log.e(e.stack);
    }
  }


  /**
   * Register all tasks in a folder as subtasks of a the folder name.
   * @param  {String} folder  Name of the folder to register
   */
  function registerFolder (folder) {
    var subtasks = getTaskEntries(
      path.join(taskDir, folder)
    );

    subtasks.forEach(registerTask.bind(null, folder));
  }


  /**
   * Read the tasks in a directory.
   * @param  {String} dir
   * @return {Array}
   */
  function getTaskEntries (dir) {
    try {
      log.d('Read tasks from dir %s', dir);
      return fs.readdirSync(dir);
    } catch (e) {
      log.e('Failed to read tasks dir. Please ensure path is valid.');
      log.e(e.toString());
      log.e(e.stack);

      throw e;
    }
  }
}
