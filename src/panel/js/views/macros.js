/* global Backbone, $ */
(function() {
  'use strict';

  var jstIndex = Panel.Util.jst('macros/index');
  var jstEntry = Panel.Util.jst('macros/entry');

  Panel.MacrosView = Backbone.View.extend({
    messages: {
      'macros:entry': 'appendMacroEntry'
    },

    events: {
      'click [data-action="record"]': 'proxyRecord'
    },

    bind: function() {
      for (var event in this.messages) {
        var handler = this[ this.messages[event] ];

        this.listenTo(Panel.Port, event, handler);
      }
    },

    render: function() {
      if (this.$el) {
        this.remove();
      }

      this.setElement( jstIndex({}) );
      this.bind();

      $('#content').html( this.$el );
    },

    appendMacroEntry: function(message) {
      console.log('got a macro event!');

      // $('body').append('<li>' + JSON.stringify(message) + '</li>');
      this.$('#macro_listing').append(jstEntry(message));
    },

    proxyRecord: function() {
      Panel.Port.toCanvi('macros', 'record');
    }
  });

  Panel.MacrosView = new Panel.MacrosView();
})();