define('views/macros', [ 'lodash', 'jquery', 'backbone' ], function(_, $, Backbone) {
  'use strict';

  Panel.MacrosView = new Backbone.View.extend({
    render: function() {
      this.$el = $('<table />');

      Panel.Port.on('macroEvent', function(message) {
        $('body').append('<li>' + JSON.stringify(message) + '</li>');
      });
    }
  });
});