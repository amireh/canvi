define('core/macro_manager', [ 'lodash', 'backbone', 'models/macro' ], function(_, Backbone, Macro) {
  'use strict';

  return Backbone.Collection.extend({
    model: Macro,

    start: function() {
      this.current = this.add({}).last();
    },
    stop: function() {
      if (this.current) {
        this.current.stop();
      }
    }
  });
});