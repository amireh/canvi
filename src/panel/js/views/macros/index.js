/* global Backbone, $ */
(function() {
  'use strict';

  var jstIndex = Panel.Util.jst('macros/index');
  var jstListing = Panel.Util.jst('macros/listing');

  Panel.MacrosView = Backbone.View.extend({
    messages: {
      'macros:list': 'listMacros'
    },

    events: {
      'click [data-action="new"]': 'newMacro',
      'click [data-action="reload"]': 'reload',
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
      this.$listing = this.$('#macros');

      this.toCanvi('macros', 'list');
    },

    proxyResetMacros: function() {
      if (confirm('Are you sure you want to do this?')) {
        Panel.Port.toCanvi('macros', 'reset');
      }
    },

    listMacros: function(data) {
      data = _.map(data, function(macro) {
        return {
          id: macro.id,
          nrEntries: macro.entries.length
        };
      });

      this.$listing.html(jstListing(data));
    },

    newMacro: function() {
      this.toCanvi('macros', 'start');
      Panel.Router.showMacro();
    },

    reload: function() {
      window.location.reload(true);
    }
  });

  Panel.MacrosView = new Panel.MacrosView();
})();