module.exports = (grunt) ->

  # Project configuration.
  grunt.initConfig
    pkg: grunt.file.readJSON("package.json")
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
          banner: "/* The A-Engine Core */"
          compilation_level: 'ADVANCED_OPTIMIZATIONS'
          summary_detail_level: 3

    uglify:
      all:
        options:
          mangle: true
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

  # Load plugins
  grunt.loadNpmTasks "grunt-contrib-clean"
  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-closurecompiler"
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-contrib-copy"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-bower-task"
  grunt.loadNpmTasks "grunt-codo"

  # Tasks
  grunt.registerTask "build", ["clean:sources", "clean:products", "bower:install", "coffee", "uglify:all","copy"]

  grunt.registerTask "default", ["build"]