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
          'dist/hash.bundle.js': 'src/index.js',
        },
        options: {
          bundleOptions: {
            standalone: 'H'
          }
        }
      }
    },

    uglify: {
      dist: {
        src: 'dist/hash.bundle.js',
        dest: 'dist/hash.min.js'
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

    mocha_phantomjs: {
      integration: ['integration-test/index.html']
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
  grunt.loadNpmTasks('grunt-mocha-phantomjs');

  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('unit-test', ['jshint', 'mochacli:unit']);
  grunt.registerTask('integration-test', ['mocha_phantomjs']);
  grunt.registerTask('test', ['unit-test', 'integration-test']);

  grunt.loadNpmTasks('grunt-curl');

  grunt.registerTask('dist', ['curl', 'browserify:dist', 'uglify:dist']);

  grunt.registerTask('default', ['dist']);
};
