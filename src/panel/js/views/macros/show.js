/* global Backbone, $ */
(function() {
  'use strict';

  var jstIndex = Panel.Util.jst('macros/show');
  var jstEntry = Panel.Util.jst('macros/entry');

  Panel.MacroView = Backbone.View.extend({
    /**
     * @property {Macro}
     * The macro that Canvi is currently managing.
     */
    macro: null,

    messages: {
      'macros:entry': 'appendMacroEntry',
      'macros:recordingStarted': 'onRecordingStarted',
      'macros:recordingStopped': 'onRecordingStopped',
      'macros:entryRemoved': 'onEntryRemoved',
      'macros:playingEntry': 'onPlayingEntry',
      'macros:removed': 'goToIndex'
    },

    delegate: 'body',
    events: {
      'click [data-action="start"]': 'proxyStartRecording',
      'click [data-action="pause"]': 'proxyPauseRecording',
      'click [data-action="stop"]': 'proxyStopRecording',
      'click [data-action="play"]': 'proxyPlay',
      'click [data-action="remove"]': 'proxyRemoveMacro',
      'click [data-action="removeEntry"]': 'proxyRemoveEntry',
      'click [data-action="reload"]': 'reload',
    },

    bind: function() {
      for (var event in this.messages) {
        var handler = this[ this.messages[event] ];

        this.listenTo(Panel.Port, event, handler);
      }
    },


    render: function(macroId) {
      if (this.$el) {
        this.remove();
      }

      this.setElement( jstIndex({}) );
      this.bind();

      $('#content').html( this.$el );
      $('#toolbar').html( this.$('.toolbar') );

      this.$start = this.$('[data-action="start"]');
      this.$pause = this.$('[data-action="pause"]');
      this.$stop  = this.$('[data-action="stop"]');
      this.$remove = this.$('[data-action="remove"]');

      this.$listing = this.$('#entries');

      this.$pause.disable();
      this.$stop.disable();

      console.debug('launching macro:', macroId);

      Panel.Port.toCanvi('macros', 'start', {
        id: macroId
      });
    },

    remove: function() {
      Panel.Port.toCanvi('macros', 'stop');
      this.macro = null;

      Backbone.View.prototype.remove.apply(this, arguments);
    },

    appendMacroEntry: function(message) {
      this.$listing.append(jstEntry(message));
    },

    proxyStartRecording: function() {
      Panel.Port.toCanvi('macros', 'start', this.macro || {});
    },

    proxyPauseRecording: function() {
      Panel.Port.toCanvi('macros', 'pause');
    },

    proxyStopRecording: function() {
      Panel.Port.toCanvi('macros', 'stop');
    },

    proxyRemoveMacro: function() {
      if (confirm('Are you sure you want to do this?')) {
        Panel.Port.toCanvi('macros', 'remove');
      }
    },

    onRecordingStarted: function(macro) {
      this.$start.disable();
      this.$pause.enable();
      this.$stop.enable();

      this.macro = macro;

      _.each(macro.entries, function(entry) {
        this.appendMacroEntry(entry);
      }, this);
    },

    onRecordingStopped: function() {
      this.$start.enable();
      this.$pause.disable();
      this.$stop.disable();
    },

    clearEntries: function() {
      this.$listing.empty();
    },

    reload: function() {
      window.location.reload(true);
    },

    goToIndex: function() {
      Panel.Router.showMacros();
    },

    proxyRemoveEntry: function(e) {
      var $entry = $(e.target).closest('.macro-entry');

      if ($entry && $entry.length) {
        Panel.Port.toCanvi('macros', 'removeEntry', $entry.index());
      }
    },
    onEntryRemoved: function(entryIndex) {
      this.$listing.find('.macro-entry:nth-child(' + (entryIndex+1) + ')').remove();
    },

    proxyPlay: function() {
      Panel.Port.toCanvi('macros', 'play', {});
    },

    onPlayingEntry: function(entryIndex) {
      var $entry = this.__$entry(entryIndex);

      if ($entry.length) {
        this.$listing.find('.active').removeClass('active');
        $entry.addClass('active')
      }
    },

    __$entry: function(entryIndex) {
      return this.$listing.find('.macro-entry:nth-child(' + (entryIndex+1) + ')');
    }
  });

  Panel.MacroView = new Panel.MacroView();
})();