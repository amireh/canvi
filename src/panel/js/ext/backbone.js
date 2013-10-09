(function() {
  'use strict';

  console.debug('extending Backbone.View');

  _.extend(Backbone.View.prototype, {
    consume: function(e) {
      e.preventDefault();

      if (e.stopPropagation) { e.stopPropagation(); }
      if (e.stopImmediatePropagation) { e.stopImmediatePropagation(); }

      return false;
    },

    acceptMessages: function() {
      for (var event in this.messages) {
        var handler = this[ this.messages[event] ];

        this.listenTo(Panel.Port, event, handler);
      }
    }
  });

})();