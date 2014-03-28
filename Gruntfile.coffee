module.exports = (grunt) ->



  # Project configuration.
  BANNER =  "/* The A-Engine Core: " + (Date.now()).toString() + " */"

  grunt.initConfig
    pkg: grunt.file.readJSON("package.json")

    toaster:
      dist:
        minify: false
        packaging: true
        # bare: true
        folders: { "src/Core":"AE" }
        release: "build/AEngine-core.js"

    coffee:
      app:
        options:
          manageDependencies: true
          join: true

        files:
          "build/AEngine-core.js": ["src/**/*.coffee"]

    closurecompiler:
      all:
        files:
          "build/AEngine-core.min.js": ["build/AEngine-core.js"]
        options:
          banner: BANNER
          compilation_level: 'ADVANCED_OPTIMIZATIONS'
          summary_detail_level: 3

    uglify:
      all:
        options:
          mangle: true
          banner: BANNER
        files: {
          'build/AEngine-core.min.js': 'build/AEngine-core.js'
        }

    bower:
      install: {}

    codo:
      options:
        title: "The A-Engine Documentation"
        output: 'doc'
        inputs: ["src"]

    copy:
      app:
        files: [
          # deploying files into build dir
          expand: true
          cwd: "app/extern/"
          src: "**/*"
          dest: "build/extern/"
          filter: "isFile"
        ,
          expand: true
          flatten: true
          src: ["app/*.html"]
          dest: "build/"
        ]

    clean:
      products:
        src: [
          "build"
        ]

      sources:
        src: [
          "Gruntfile.{js,map}"
          "src/**/*.js",
          "src/**/*.map"
        ]

      doc:
        src: ["doc"]

    # this, is orgasmically neat
    watch:
      bower:
        files: ["src/bower_components/*"]

      coffee:
        files: ["src/**/*.coffee"]
        tasks: ["build"]

    shell:
      publish:
        command: [
          "git clone git@github.com:qpre/AEngine.git ../tmp/",
          "cp -R node_modules ../tmp",
          "cd ../tmp",
          "grunt",
          "git fetch origin",
          "git checkout gh-pages",
          "git rm -rf engine",
          "mv build engine",
          "git add engine",
          "git commit -am '[BLD] automated build'",
          "git push origin gh-pages",
          "cd -",
          "rm -rf ../tmp"
        ].join '&&'
        options: {
          stdout: true,
          failOnError: true
        }
      createBuild:
        command: "mkdir build"
        options: {
          stdout: true,
          failOnError: true
        }
      removeBuild:
        command: "rm -rf build"
        options: {
          stdout: true,
          failOnError: true
        }

  # Load plugins
  grunt.loadNpmTasks "grunt-contrib-clean"
  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks 'grunt-shell'
  grunt.loadNpmTasks "grunt-closurecompiler"
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-contrib-copy"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-bower-task"
  grunt.loadNpmTasks "grunt-codo"
  grunt.loadNpmTasks('grunt-coffee-toaster');

  # Tasks
  grunt.registerTask "cleanbuild", ["clean:sources", "clean:products"]
  grunt.registerTask "compile" ,["shell:createBuild","bower:install", "toaster:dist", "uglify:all", "copy"]
  grunt.registerTask "build", ["cleanbuild", "compile"]
  grunt.registerTask "deploy", ["shell:publish"]
  grunt.registerTask "default", ["build"]