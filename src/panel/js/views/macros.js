/* global Backbone, $ */
(function() {
  'use strict';

  var jstIndex = Panel.Util.jst('macros/index');
  var jstEntry = Panel.Util.jst('macros/entry');

  Panel.MacrosView = Backbone.View.extend({
    messages: {
      'macros:entry': 'appendMacroEntry',
      'macros:recordingStarted': 'onRecordingStarted',
      'macros:recordingStopped': 'onRecordingStopped'
    },

    events: {
      'click [data-action="start"]': 'proxyStartRecording',
      'click [data-action="pause"]': 'proxyPauseRecording',
      'click [data-action="stop"]': 'proxyStopRecording',
      'click [data-action="reset"]': 'proxyResetMacros',
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

      this.$start = $('[data-action="start"]');
      this.$pause = $('[data-action="pause"]');
      this.$stop = $('[data-action="stop"]');
      this.$reset = $('[data-action="reset"]');

      this.$pause.disable();
      this.$stop.disable();
    },

    appendMacroEntry: function(message) {
      console.log('got a macro event!');

      // $('body').append('<li>' + JSON.stringify(message) + '</li>');
      this.$('#macro_listing').append(jstEntry(message));
    },

    proxyStartRecording: function() {
      Panel.Port.toCanvi('macros', 'start');
    },

    proxyPauseRecording: function() {
      Panel.Port.toCanvi('macros', 'pause');
    },

    proxyStopRecording: function() {
      Panel.Port.toCanvi('macros', 'stop');
    },

    onRecordingStarted: function() {
      this.$start.disable();
      this.$pause.enable();
      this.$stop.enable();
    },

    onRecordingStopped: function() {
      this.$start.enable();
      this.$pause.disable();
      this.$stop.disable();
    },

    proxyResetMacros: function() {
      Panel.Port.toCanvi('macros', 'reset');
    },

    reload: function() {
      window.location.reload(true);
    }
  });

  Panel.MacrosView = new Panel.MacrosView();
})();