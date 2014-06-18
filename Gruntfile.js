module.exports = function(grunt) {
  grunt.initConfig({
    sources: 'src/*.js',
    tests: 'test/*.test.js',
    files: ['Gruntfile.js', '<%= sources %>' , '<%= tests %>'],

    pkg:  grunt.file.readJSON('package.json'),

    curl: {
      'lib/observe.js': 'https://raw.githubusercontent.com/jdarling/Object.observe/master/Object.observe.poly.js'
    },

    browserify: {
      dist: {
        files: {
          'dist/h.bundle.js': ['<%= sources %>'],
        },
        bundleOptions: {
          standalone: 'ufo'
        }
      }
    },

    uglify: {
      dist: {
        src: 'dist/h.bundle.js',
        dest: 'dist/h.min.js'
      }
    },

    jshint: {
      files: ['<%= files %>']
    },

    mochacli: {
      options: {
        files: ['<%= tests %>']
      },
      unit: {
        options: {
          reporter: 'spec'
        }
      }
    },

    watch: {
      test: {
        files: ['<%= files %>'],
        tasks: 'unit-test'
      }
    },

    clean: {
      all: ['lib/', 'node_modules/', 'dist/'],
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-cli');

  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('unit-test', ['jshint', 'mochacli:unit']);
  grunt.registerTask('test', ['unit-test']);

  grunt.loadNpmTasks('grunt-curl');

  grunt.registerTask('dist', ['curl', 'browserify:dist', 'uglify:dist']);

  grunt.registerTask('default', ['dist']);
};
