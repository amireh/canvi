define('models/macro_entry', [
  'lodash',
  'backbone',
], function(_, Backbone) {
  'use strict';

  /**
   * @class Canvi.MacroEntry
   * @alternateClassName MacroEntry
   *
   * A single captured DOM event that can be simulated.
   */
  return Backbone.Model.extend({
    urlRoot: '/macro_entries',
    url: '/macro_entries',

    defaults: {
      type: null,
      target: null,
      url: null
    },

    /**
     * Simulate the entry, as if the user has done the event.
     */
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
        console.error('target not found:', this.get('target'));
        return callback(this, 'not_found');
      }

      $target.click();

      callback(this, true);
    }
  });
});