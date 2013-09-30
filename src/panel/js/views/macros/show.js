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
      'macros:focused': 'onFocused',
      'macros:stopped': 'onStopped',
      'macros:entry': 'appendMacroEntry',
      'macros:entryRemoved': 'onEntryRemoved',
      'macros:playingEntry': 'onPlayingEntry',
      'macros:entryPlayed': 'onEntryPlayed',
      'macros:statusUpdated': 'onStatusUpdated',
      'macros:removed': 'backToIndex'
    },

    delegate: 'body',

    events: {
      'click [data-action="record"]': 'proxyRecord',
      'click [data-action="pause"]': 'proxyPause',
      'click [data-action="stop"]': 'proxyStop',
      'click [data-action="play"]': 'proxyPlay',
      'click [data-action="remove"]': 'proxyRemove',
      'click [data-action="removeEntry"]': 'proxyRemoveEntry'
    },

    /**
     * Bind message handlers via the Panel.Port.
     */
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

      this.$status = this.$('#macro_status');
      this.$record = this.$('[data-action="record"]');
      this.$play = this.$('[data-action="play"]');
      this.$pause = this.$('[data-action="pause"]');
      this.$stop  = this.$('[data-action="stop"]');
      this.$remove = this.$('[data-action="remove"]');
      this.$controls = this.$('[data-action]');

      this.$listing = this.$('#entries');

      $('#content').html( this.$el );
      $('#active_toolbar').html( this.$('.toolbar') );

      if (macroId) {
        Panel.Port.toCanvi('macros', 'focus', { id: macroId });
      }
      else {
        this.proxyRecord();
      }
    },

    remove: function() {
      this.proxyStop();
      this.macro = null;

      Backbone.View.prototype.remove.apply(this, arguments);
    },

    appendMacroEntry: function(message) {
      this.$listing.append(jstEntry(message));
    },

    proxyRecord: function() {
      Panel.Port.toCanvi('macros', 'record', this.macro);
    },

    proxyPlay: function() {
      Panel.Port.toCanvi('macros', 'play');
      this.resetEntries();
    },

    proxyPause: function() {
      Panel.Port.toCanvi('macros', 'pause');
    },

    proxyStop: function() {
      Panel.Port.toCanvi('macros', 'stop');
      Panel.Port.toCanvi('macros', 'focus', this.macro);
    },

    proxyRemove: function() {
      if (confirm('Are you sure you want to do this?')) {
        Panel.Port.toCanvi('macros', 'remove');
      }
    },

    proxyRemoveEntry: function(e) {
      var $entry = $(e.target).closest('.macro-entry');

      if ($entry && $entry.length) {
        Panel.Port.toCanvi('macros', 'removeEntry', $entry.index());
      }
    },

    onFocused: function(macro) {
      if (!this.macro) {
        this.macro = macro;

        _.each(macro.entries, function(entry) {
          this.appendMacroEntry(entry);
        }, this);

        this.onStatusUpdated(macro.status);
      }
    },

    onStopped: function() {
      this.resetEntries();
    },

    clearEntries: function() {
      this.$listing.empty();
    },

    backToIndex: function() {
      Panel.Router.showMacros();
    },

    /**
     * Remove an entry from the macro entry listing.
     *
     * @param {Number} entryIndex
     */
    onEntryRemoved: function(entryIndex) {
      var $entry = this.findEntry(entryIndex);

      if ($entry.length) {
        $entry.remove();
      }
    },

    /**
     * Highlight the macro entry currently being played.
     *
     * @param {Number} entryIndex
     */
    onPlayingEntry: function(entryIndex) {
      var $entry = this.findEntry(entryIndex);

      if ($entry.length) {
        this.$listing.find('.active').removeClass('active');
        $entry.addClass('active');
      }
    },

    onEntryPlayed: function(data) {
      var $entry = this.findEntry(data.entryIndex);
      var status = data.status;

      switch(data.status) {
        case 'not_found':
          $entry.addClass('failed');
        break;
        case true:
          $entry.addClass('passed');
          status = 'passed';
        break;
      }

      $entry.find('.entry-status').html(status);

    },

    onStatusUpdated: function(status) {
      this.$status.text( status );
      this.$controls.disable();

      switch(status) {
        case 'recording':
          this.$stop.enable();
        break;
        case 'playing':
          this.$pause.enable();
          this.$stop.enable();
        break;
        case 'paused':
          this.$play.enable();
          this.$stop.enable();
        break;
        case 'idle':
          this.$play.enable();
          this.$record.enable();
          this.$remove.enable();
        break;
      }
    },

    findEntry: function(entryIndex) {
      return this.$listing.find('.macro-entry:nth-child(' + (entryIndex+1) + ')');
    },

    resetEntries: function() {
      this.$listing.find('.active, .passed, .failed').removeClass('active passed failed');
    }
  });

  Panel.MacroView = new Panel.MacroView();
})();