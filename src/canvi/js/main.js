requirejs.config({
  baseUrl: 'src/canvi/js',
  paths: {
    'text': '../../../vendor/js/require/text',
    'jquery': '../../../vendor/js/jquery-2.0.2',
    'requireLib': '../../../vendor/js/require',
    'backbone': '../../../vendor/js/backbone-1.0.0',
    'lodash': '../../../vendor/js/lodash-2.1.0'
  },

  shim: {
    'jquery': { exports: 'jQuery' },
    'backbone': {
      deps: [ 'lodash' ],
      exports: 'Backbone'
    },
    'lodash': { exports: '_' }
  },

  hbs: {
    templateExtension:  "",
    disableI18n:        true,
    disableHelpers:     true
  }
});

window.Canvi = {};

require([ 'text', 'jquery', 'app' ], function() {});