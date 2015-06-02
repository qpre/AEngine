'use strict';

module.exports = function(grunt) {
  var LIVERELOAD_PORT = 35729;
  var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
  var mountFolder = function (connect, dir) {
      connect.static(require('path').resolve(dir));
  };

  var conf = {
    BANNER:     "/* The A-Engine Core: " + (Date.now()).toString() + " */",
    BUILD_DIR:  'build',
    DIST_DIR:   'dist'
  };

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    conf: conf,

    'clean': {
        src: ['dist', 'build']
    },

    'shell': {
      publish: {
        command: ["rm -rf ../tmp", "git clone . ../tmp", "cp -R node_modules ../tmp", "cd ../tmp", "git remote add github git@github.com:qpre/AEngine.git", "grunt", "git fetch github", "git checkout gh-pages", "mv build/AEngine-core.js engine/AEngine-core.js", "mv build/AEngine-core.min.js engine/AEngine-core.min.js", "git add engine", "git commit -am '[BLD] automated build'", "git push github gh-pages", "cd -", "rm -rf ../tmp"].join('&&'),
        options: {
          stdout: true,
          failOnError: true
        }
      },
      createBuild: {
        command: "mkdir -p dist",
        options: {
          stdout: true,
          failOnError: true
        }
      },
      removeBuild: {
        command: "rm -rf dist",
        options: {
          stdout: true,
          failOnError: true
        }
      }
    },

    'watch': {
      js: {
        files: ['src/**/*.js'],
        tasks: ['browserify']
      },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: ['dist/**/*']
      }
    },

    'connect': {
      options: {
        port: 9001,
        hostname: '0.0.0.0'
      },

      livereload: {
        options: {
          open: true,
          base: [
            'dist', 'tests'
          ]
        }
      },
    },

    'open': {
      server: {
        path: 'http://localhost:<%= connect.options.port %>'
      }
    },

    'browserify': {
      'core': {
        options: {
          transform: [["babelify", { "stage": 0 }]]
        },
        files: {
          '<%= conf.DIST_DIR %>/ae.core.js': 'src/Core/Core.js'
        }
      }
    },

    'jscs': {
      src: "src/**/*.js",
      options: {
        config: ".jscsrc",
        esnext: true,
        verbose: true
      }
    }
  });

  grunt.registerTask('dist', function () {
    return grunt.task.run(['jscs', 'shell:createBuild', 'browserify']);
  });

  grunt.registerTask('default', ['dist']);

  grunt.registerTask('server', function (target) {
      if (target === 'dist') {
          return grunt.task.run(['dist', 'open', 'connect:dist:keepalive']);
      }
      grunt.task.run(['dist', 'connect:livereload', 'open', 'watch']);
  });

  grunt.registerTask("deploy", [], function() {
    grunt.loadNpmTasks('grunt-shell');
    return grunt.task.run("shell:publish");
  });
};
