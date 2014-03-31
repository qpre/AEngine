module.exports = (grunt) ->
  # Project configuration.
  BANNER =  "/* The A-Engine Core: " + (Date.now()).toString() + " */"

  grunt.initConfig
    pkg: grunt.file.readJSON("package.json")

    toaster:
      debug:
        minify: false
        packaging: true
        # bare: true
        folders: { "src/Core":"AE" }
        release: "build/AEngine-core.js"
      minified:
        minify: true
        packaging: true
        # bare: true
        folders: { "src/Core":"AE" }
        release: "build/AEngine-core.min.js"

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

    connect:
      server:
        options:
          port: 9001,
          base: 'build'

    shell:
      publish:
        command: [
          "rm -rf ../tmp",
          "git clone . ../tmp",
          "cp -R node_modules ../tmp",
          "cd ../tmp",
          "git remote add github git@github.com:qpre/AEngine.git",
          "grunt",
          "git fetch github",
          "git checkout gh-pages",
          "mv build/AEngine-core.js engine/AEngine-core.js",
          "mv build/AEngine-core.min.js engine/AEngine-core.min.js",
          "git add engine",
          "git commit -am '[BLD] automated build'",
          "git push github gh-pages",
          "cd -",
          "rm -rf ../tmp"
        ].join '&&'
        options:
          stdout: true,
          failOnError: true

      createBuild:
        command: "mkdir build"
        options:
          stdout: true,
          failOnError: true

      removeBuild:
        command: "rm -rf build"
        options:
          stdout: true,
          failOnError: true

  # Load plugins
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-codo"

  # Clean
  grunt.registerTask "cleanbuild", [], () ->
    grunt.loadNpmTasks "grunt-contrib-clean"
    grunt.task.run "clean:sources", "clean:products"

  # Build process
  grunt.registerTask "compile" , [], () ->
    grunt.loadNpmTasks 'grunt-shell'
    grunt.loadNpmTasks "grunt-bower-task"
    grunt.loadNpmTasks "grunt-contrib-copy"
    grunt.loadNpmTasks 'grunt-coffee-toaster'
    # grunt.loadNpmTasks "grunt-contrib-uglify"
    # grunt.loadNpmTasks "grunt-contrib-coffee"
    # grunt.loadNpmTasks "grunt-closurecompiler"

    grunt.task.run "shell:createBuild","bower:install", "toaster", "copy"

  grunt.registerTask "build", ["cleanbuild", "compile"]

  # Serve lib to local
  grunt.registerTask "serve", [], (target) ->
    grunt.loadNpmTasks 'grunt-contrib-connect'

    grunt.task.run ['build', 'connect', 'watch']

  # Deploy to distant server
  grunt.registerTask "deploy", [], () ->
    grunt.loadNpmTasks 'grunt-shell'
    grunt.task.run "shell:publish"
  

  grunt.registerTask "default", ["build"]
