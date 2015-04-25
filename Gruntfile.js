module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['public/client/app.js', 'public/client/createLinkView.js', 'public/client/link.js', 'public/client/links.js', 'public/client/linksView.js', 'public/client/linkView.js', 'public/client/router.js'],
        dest: 'public/dist/built.js',
      },
      lib: {
        src: ['public/lib/underscore.js', 'public/lib/jquery.js', 'public/lib/handlebars.js', 'public/lib/backbone.js'],
        dest: 'public/dist/lib.js',
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      //options banner saying we uglified/minified our files
      //dist something like 'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
      //
      dist:{
        files:{
          'public/dist/app.min.js':['public/dist/built.js'],
          'public/dist/lib.min.js':['public/dist/lib.js']
        }
      }
    },

    jshint: {
        // Add filespec list here
        files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js', 'app/**/*.js'],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
        ]
      }
    },

    cssmin: {
      minify: {
        files: [{
          expand: true,
          cwd: 'public/',
          src: ['style.css'],
          dest: 'public/dist/',
          ext: '.css'
        }]
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', [
    'jshint',
    'mochaTest',
    'concat:dist',
    'concat:lib',
    'cssmin',
    'uglify',
    'nodemon'
  ]);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      // add your production server task here
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
    // add your deploy tasks here
    'jshint',
    'mocha',
    'concat',
    'uglify',
    'cssmin',
    'nodemon',
    'watch'
  ]);


};
