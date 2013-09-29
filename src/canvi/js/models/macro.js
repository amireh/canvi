define('models/macro', [ 'jquery', 'lodash', 'backbone' ], function($, _, Backbone) {
  'use strict';

  return Backbone.Model.extend({
    initialize: function() {
    },

    /**
     * Uninstall all event interceptors.
     */
    stop: function() {
      _.each(this._intercepted, function(entry) {
        document.removeEventListener(entry.event, entry.callback);
      });

      this._intercepted = [];
    },

    onClick: function(e) {
      var $target = $(e.target);

      console.debug('[Canvi] something was clicked');

      Canvi.Messenger.toPanel('macros', 'entry', {
        type: 'click',
        target: this.identify(e.target)
      });
    },

    identify: function(el) {
      var fragments = [ el.nodeName.toLowerCase() ];

      if (el.id) {
        fragments.push('#' + el.id);
      }

      return fragments.join('');
    }
  });
});