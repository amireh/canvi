/* global Backbone, $ */
(function() {
  'use strict';

  var jstIndex = Panel.Util.jst('macros/index');
  var jstListing = Panel.Util.jst('macros/listing');

  Panel.MacrosView = Backbone.View.extend({
    messages: {
      'macros:list': 'listMacros'
    },

    delegate: 'body',

    events: {
      'click [data-action="new"]': 'proxyNewMacro',
      'click [data-action="reset"]': 'proxyResetMacros'
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
      $('#active_toolbar').html( this.$('.toolbar') );

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

    proxyNewMacro: function() {
      this.toCanvi('macros', 'start');
      Panel.Router.showMacro();
    }
  });

  Panel.MacrosView = new Panel.MacrosView();
})();