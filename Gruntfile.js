module.exports = function(grunt) {
  'use strict';

  var jsSources = [
    'src/**/*.js'
  ];

  var readPkg = function() {
    return grunt.file.readJSON('package.json');
  };

  grunt.initConfig({
    pkg: readPkg(),

    /**
     * JavaScripts.
     */
    jshint: {
      all: jsSources,
      options: {
        ignores: [ 'src/canvi/js/main.js' ],
        jshintrc: '.jshintrc'
      }
    },

    jsvalidate: {
      files: jsSources
    },

    concat: {
      options: {
        separator: ';',
      },
      canvi: {
        src: 'src/canvi/js/**/*.js',
        dest: 'dist/canvi.js',
      }
    },

    connect: {
      specs: {
        options: {
          keepalive: true,
          port: 8000
        }
      },
      docs: {
        options: {
          keepalive: true,
          port: 8001,
          base: "doc"
        }
      }
    },

    jasmine : {
      src: [
        'src/canvi/js/main.js'
      ],
      options : {
        timeout: 10000,
        outfile: 'specs.html',

        host: 'http://127.0.0.1:<%= grunt.config.get("connect.specs.options.port") %>/',

        template: require('grunt-template-jasmine-requirejs'),
        templateOptions: {
          requireConfigFile: [ 'src/canvi/js/main.js', 'spec/config.js' ]
        },

        keepRunner: true,
        version: '1.3.1',
        styles: 'dist/canvi.css',
        helpers: 'spec/helpers/**/*.js',
        specs : 'spec/{integration,unit}/**/*.js'
      }
    },

    requirejs: {
      compile: {
        options: {
          baseUrl: 'src/canvi/js',
          out: 'dist/canvi.min.js',
          mainConfigFile: 'src/canvi/js/main.js',
          optimize: 'none',

          removeCombined:           false,
          inlineText:               true,
          preserveLicenseComments:  false,
          skipModuleInsertion: false,

          uglify: {
            toplevel:         true,
            ascii_only:       true,
            beautify:         false,
            max_line_length:  1000,
            no_mangle:        false
          },

          pragmasOnSave: {
            excludeHbsParser:   true,
            excludeHbs:         true,
            excludeAfterBuild:  true
          },

          pragmas: {
            production: true
          },
          name: "main",
          include: [ "requireLib" ]
        }
      }
    },

    /**
     * Versioning.
     */
    bumpup: 'package.json',
    tagrelease: {
      file: 'package.json',
      commit: true,
      message: 'Release %version%',
      prefix: 'v',
      annotate: false
    },

    /**
     * CSS compilation.
     */
    less: {
      options: {
        strictImports: true
      },
      canvi: {
        options: {
          paths: [ 'src/canvi/css' ],
          compress: false
        },
        files: {
          'dist/canvi.css': 'src/canvi/css/canvi.less',
          'dist/panel.css': 'src/panel/css/panel.less',
        }
      }
    },

    /**
     * Docs compilation.
     */
    jsduck: {
      main: {
        src: [ 'src' ],
        dest: 'doc/api',
        options: {
          'title': 'Canvi Reference',
          'categories': '.jsduck',
          'builtin-classes': false,
          'color': true,
          'warnings': [],
          'external': [
          ]
        }
      }
    },

    /**
     * Watchers.
     */
    watch: {
      options: {
        nospawn: true
      },
      scripts: {
        files: jsSources,
        tasks: [ 'jshint', 'docs' ]
      },
      css: {
        files: 'src/**/*.less',
        tasks: [ 'less', 'notify:less', 'notify' ]
      },
      docs: {
        files: [ '.jsduck', 'doc/guides/**/*.md', 'doc/*.*' ],
        tasks: [ 'docs', 'notify:docs', 'notify' ]
      }
    },

    'string-replace': {
      version: {
        files: {
          "manifest.json": "manifest.json"
        },
        options: {
          replacements: [{
            pattern: /\d\.\d{1,}\.\d+/,
            replacement: "<%= grunt.config.get('pkg.version') %>"
          }, {
            pattern: /version(\s*)=(\s*)\"\d\.\d{1,}\.\d+/,
            replacement: "version$1=$2\"<%= grunt.config.get('pkg.version') %>"
          }]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-bumpup');
  grunt.loadNpmTasks('grunt-tagrelease');
  grunt.loadNpmTasks('grunt-jsvalidate');
  grunt.loadNpmTasks('grunt-jsduck');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-string-replace');

  grunt.registerTask('updatePkg', function () {
    grunt.config.set('pkg', readPkg());
  });


  grunt.registerTask('test', [ 'jshint', 'jasmine' ]);
  grunt.registerTask('build', [
    'test',
    'requirejs',
    'less'
  ]);
  grunt.registerTask('docs',  [ 'jsduck' ]);
  grunt.registerTask('default', [ 'test' ]);
  grunt.registerTask('version', [ 'string-replace:version' ]);

  grunt.registerTask('notify', function(target) {
    var message;

    switch( target ) {
      case 'less':
        message = 'Canvi LESS finished compiling.';
      break;
      case 'docs':
        message = 'Canvi API docs have been generated.';
      break;

    }

    grunt.config.set('notify.options.message', message);
  });

  // Release alias task
  grunt.registerTask('release', function (type) {
    grunt.task.run('test');
    grunt.task.run('bumpup:' + ( type || 'patch' ));
    grunt.task.run('updatePkg');
    grunt.task.run('version');
    grunt.task.run('build');
    grunt.task.run('tagrelease');
  });

};
