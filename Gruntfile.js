'use strict';

module.exports = function(grunt) {
  var CI = grunt.option('ci');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    project: {
      lib: 'lib',
      test: 'test',
      dist: 'dist',
      name: 'awesome-angular-swipe'
    },

    uglify: {
      dist: {
        files: [
          {
            dest: '<%= project.dist %>/<%= project.name %>.min.js',
            src: ['<%= project.lib %>/<%= project.name %>.js']
          }
        ]
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: CI && 'checkstyle',
        reporterOutput: CI && 'jshint.xml'
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= project.test %>/**/*.js',
          '<%= project.lib %>/**/*.js'
        ]
      }
    },

    jscs: {
      lint: {
        options: {
          config: '.jscsrc',
          esnext: true
        },
        src: ['<%= jshint.all.src %>']
      },
      fix: {
        options: {
          config: '.jscsrc',
          esnext: true,
          fix: true
        },
        src: ['<%= jshint.all.src %>']
      }
    },

    lint_pattern: {
      options: {
        rules: [
          { pattern: /(describe|it)\.only/, message: 'Must not use .only in tests' }
        ]
      },
      all: {
        src: ['<%= jshint.all.src %>']
      }
    },

    watch: {
      files: ['<%= jshint.all.src %>'],
      tasks: ['test']
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= project.dist %>/*',
            '!<%= project.dist %>/.git*'
          ]
        }]
      }
    },

    karma: {
      unit: {
        configFile: '<%= project.test %>/config/karma.conf.js'
      }
    },

    less: {
      release: {
        files: {
          'dist/awesome-angular-swipe.css': 'less/awesome-angular-swipe.less'
        }
      },
      'release-compress': {
        files: {
          'dist/awesome-angular-swipe.min.css': 'less/awesome-angular-swipe.less'
        },
        options: {
          compress: true,
          ieCompat: false
        }
      }
    },

    release: {
      options: {
        file: 'package.json',
        additionalFiles: ['bower.json'],
        commitMessage: 'Bumped version to <%= version %>',
        tagName: 'v<%= version %>',
        tagMessage: 'Version <%= version %>',
        afterBump: ['exec:gitcheckout_ReleaseBranch', 'test', 'apidoc'],
        beforeRelease: ['exec:gitadd_DistAndAPIDoc', 'exec:gitcommit_DistAndAPIDoc'],
        afterRelease: ['exec:gitcheckout_master']
      }
    }
  });

  require('load-grunt-tasks')(grunt);
  grunt.registerTask('compile', ['clean:dist', 'uglify', 'less:release', 'less:release-compress']);
  grunt.registerTask('dist', ['test']);
  grunt.registerTask('linters', 'Check code for lint', ['jshint:all', 'jscs:lint', 'lint_pattern:all']);
  grunt.registerTask('test', 'Lint, compile and launch test suite', ['linters', 'compile', 'karma']);
  grunt.registerTask('dev', 'Launch tests then for each changes relaunch it', ['test', 'watch']);

  grunt.registerTask('default', ['test']);

};
