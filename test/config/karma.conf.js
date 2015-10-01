'use strict';

module.exports = function(config) {
  config.set({
    basePath: '../../',

    singleRun: true,
    browsers: ['PhantomJS'],
    frameworks: ['mocha'],
    reporters: ['spec'],
    plugins: [
      'karma-phantomjs-launcher',
      'karma-mocha',
      'karma-spec-reporter'
    ],
    colors: true,
    autoWatch: true,
    files: [
      'bower_components/chai/chai.js',
      'node_modules/phantomjs-polyfill/bind-polyfill.js',
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.min.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'lib/awesome-angular-swipe.js',
      // Tests
      'test/*.js',
    ]
  });
};
