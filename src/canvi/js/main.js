requirejs.config({
  // baseUrl: 'src/canvi/js',
  paths: {
    'text': '../../../vendor/js/require/text',
    'jquery': '../../../vendor/js/zepto-1.0',
    'requireLib': '../../../vendor/js/require',
    'backbone': '../../../vendor/js/backbone-1.0.0',
    'lodash': '../../../vendor/js/lodash.custom',
    'store': '../../../vendor/js/store.min'
  },

  shim: {
    'jquery': { exports: 'Zepto' },
    'backbone': {
      deps: [ 'lodash' ],
      exports: 'Backbone'
    },
    'lodash': { exports: '_' },
    'inflection': {},
    'store': { exports: 'store' }
  },

  hbs: {
    templateExtension:  "",
    disableI18n:        true,
    disableHelpers:     true
  }
});

window.Canvi = {};

require([ 'text', 'jquery', 'ext/backbone', 'ext/string', 'app' ], function() {});