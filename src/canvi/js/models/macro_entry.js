define('models/macro_entry', [
  'lodash',
  'backbone',
], function(_, Backbone) {
  'use strict';

  return Backbone.Model.extend({
    urlRoot: '/macro_entries',
    url: '/macro_entries',

    defaults: {
      type: null,
      target: null,
      url: null
    },

    simulate: function(options, callback) {
      var handlerId = [ 'simulate', this.get('type') ].join('-').camelize();
      var handler = this[ handlerId ];

      if (handler) {
        this[handlerId](options, callback);
      }
    },

    simulateClick: function(options, callback) {
      var $target = $( this.get('target') );

      if (!$target.length) {
        return console.error('target not found:', this.get('target'));
      }

      $target.click();

      callback(this);
    }
  });
});