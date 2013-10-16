define('models/macro_entry', [
  'lodash',
  'backbone',
  'core/util'
], function(_, Backbone, Util) {
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
    simulate: function(callback, thisArg) {
      var handlerId = [ 'simulate', this.get('type') ].join('-').camelize();
      var handler = this[ handlerId ];

      if (handler) {
        this[handlerId](callback, thisArg);
      }
    },

    simulateClick: function(callback, thisArg) {
      var $target = $( this.get('target') );

      if (!$target.length) {
        console.error('target not found:', this.get('target'));
        return Util.invoke(callback, thisArg, this, 'not_found');
      }

      $target.click();

      Util.invoke(callback, thisArg, this, true);
    },

    getOption: function(key) {
      return this.collection.macro.get(key);
    }
  });
});