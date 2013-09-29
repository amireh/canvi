requirejs.config({
  baseUrl: '/src/canvi/js',
  paths: {
    'text': '../../../vendor/js/require/text',
    'jquery': '../../../vendor/js/jquery-2.0.2',
    'requireLib': '../../../vendor/js/require'
  },

  shim: {
    'jquery': { exports: 'jQuery' }
  },

  hbs: {
    templateExtension:  "",
    disableI18n:        true,
    disableHelpers:     true
  }
});

require([ 'text', 'jquery', 'app' ], function() {});