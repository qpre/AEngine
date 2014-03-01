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
          "build/iluvatar-core.js": ["src/**/*.coffee"]

    closurecompiler:
      all:
        files:
          "build/iluvatar-core.min.js": ["build/iluvatar-core.js"]

        options:
          compilation_level: "ADVANCED_OPTIMIZATIONS"
          max_processes: 5
          banner: "/* Iluvatar Core */"

    bower:
      install: {}

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
      app:
        src: ["build"]


  # this, is orgasmically neat
    watch:
      bower:
        files: ["src/bower_components/*"]

      coffee:
        files: ["src/**/*.coffee"]
        tasks: ["coffee:app"]

  # Load plugins
  grunt.loadNpmTasks "grunt-contrib-clean"
  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-closurecompiler"
  grunt.loadNpmTasks "grunt-contrib-copy"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-bower-task"

  # Tasks
  grunt.registerTask "build", ["clean", "bower:install", "coffee", "closurecompiler","copy"]

  grunt.registerTask "default", ["build"]