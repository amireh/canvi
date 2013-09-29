requirejs.config({
  baseUrl: '/src/panel/js',
  paths: {
    'text': '../../../vendor/js/require/text',
    'jquery': '../../../vendor/js/jquery-2.0.2',
    'requireLib': '../../../vendor/js/require',
    'backbone': '../../../vendor/js/backbone-1.0.0',
    'lodash': '../../../vendor/js/lodash-2.1.0'
  },

  shim: {
    'jquery': { exports: '$' },
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

Panel = {};

require([ 'core/port', 'core/router', 'panel' ], function(Port, Router) {
  console.debug(chrome.tabs);

  Panel.Port = new Port();
  Panel.Port.connect();

  Panel.Router = new Router();

  Backbone.history.start({
    root: '/',
    pushState: false,
    silent: false
  });
});