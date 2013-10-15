define('models/macro', [
  'jquery',
  'lodash',
  'backbone',
  'models/macro_entry',
  'core/util'
], function($, _, Backbone, MacroEntry, Util) {
  'use strict';

  var MacroEntrySet = Backbone.Collection.extend({
    model: MacroEntry
  });


  /**
   * @class Canvi.Macro
   * @alternateClassName Macro
   *
   * A recording of captured DOM events that can be played back.
   */
  return Backbone.Model.extend({
    urlRoot: '/macros',
    url: '/macros',

    defaults: {
      /**
       * @property {String} [status="idle"]
       * The Macro state. Can be one of:
       *   1. idle
       *   2. recording
       *   3. playing
       *   4. paused
       */
      status: 'idle',

      /**
       * @cfg {Number} [repeat=1]
       *
       * The number of times the playback should be repeated.
       */
      repeat: 1,

      /**
       * @cfg {Number} [repeatEvery=1000]
       *
       * Milliseconds to pause between replays.
       */
      repeatEvery: 1000,

      /**
       * @cfg {Number} pauseTimer
       *
       * Milliseconds to pause between entries during playback.
       */
      pauseTimer: 500
    },

    initialize: function() {
      this.ensureId();
      this.ensureEntries();
    },

    /**
     * Transition to the recording state where entries will be added.
     */
    record: function() {
      this.set('status', 'recording');
    },

    /**
     * Playback the macro, and optionally replay based on Macro#repeat.
     */
    play: function(entry) {
      var that = this;
      var entryIndex;

      this.entry = entry || this.entries.first();
      entryIndex = this.entries.indexOf(this.entry);

      if (!this.entry) {
        return this.stop();
      }

      this.set('status', 'playing');

      console.info('playing entry:', entryIndex);

      Canvi.Messenger.toPanel('macros', 'playingEntry', entryIndex);

      this.entry.simulate(function(entry, status) {
        Canvi.Messenger.toPanel('macros', 'entryPlayed', {
          entryIndex: entryIndex,
          status: status
        });

        this.playNext();
      }, this);
    },

    /**
     * @private
     */
    playNext: function() {
      if (!this.isPlaying()) {
        return;
      }

      var that = this;
      var entryIndex = this.entries.indexOf(this.entry);
      var nextEntry = this.entries.at(entryIndex + 1);

      if (nextEntry) {
        setTimeout(function() {
          if (!that.isPlaying()) {
            return;
          }

          that.play(nextEntry);
        }, this.get('pauseTimer'));
      } else {
        this.stop();
      }
    },

    /**
     * Pause playing.
     */
    pause: function() {
      if (this.isPlaying()) {
        this.set('status', 'paused');
      }
    },

    /**
     * Resume playing.
     */
    resume: function() {
      if (this.entry) {
        return this.play({}, this.entry);
      }
    },

    /**
     * Stop recording or playing.
     */
    stop: function(callback, thisArg) {
      this.set('status', 'idle');
      this.entry = null;

      if (callback) {
        Util.invoke(callback, thisArg, this);
      }
    },

    onClick: function(e) {
      this.addEntry('click', e.target, window.location.href);
    },

    /**
     * @private
     */
    locate: function(node) {
      var fragments = [ ];
      var scope;

      if (node.id) {
        fragments.push('#' + node.id);
      }
      else {
        // Any identifiable enclosing scope?
        scope = this.locateScope(node);

        if (scope) {
          fragments.push('#' + scope);
        }

        var nodeName = node.nodeName.toLowerCase();

        // A position constraint
        if (!_.contains( ['html', 'body' ], nodeName)) {
          nodeName += ':nth-child(' + (this.nodeIndex(node) + 1) + ')';
        }

        fragments.push(nodeName);
      }

      return fragments.join(' ');
    },

    /**
     * Find the nearest parent of a node with an ID.
     */
    locateScope: function(node) {
      var scope;
      var currentNode = node;

      while (!scope && (currentNode = currentNode.parentNode)) {
        if (currentNode.id) {
          scope = currentNode.id;
        }
      }

      return scope;
    },

    /**
     * Find a node's index relative to its siblings.
     */
    nodeIndex: function(node) {
      return $(node).index();
    },

    /**
     * @private
     */
    addEntry: function(event, element, url) {
      var entry = {
        type: event,
        target: this.locate(element),
        url: url
      };

      this.entries.add(entry);
    },

    parse: function(data) {
      // console.log('macro raw data:', data);

      if (data.entries) {
        this.ensureEntries();
        this.entries.set(data.entries, { parse: true, remove: false });

        delete data.entries;
      }

      if (!data.id) {
        data.id = 'macro_' + this.cid;
      }

      return data;
    },

    toJSON: function() {
      var data = Backbone.Model.prototype.toJSON.apply(this, arguments);

      data.entries = this.entries.toJSON();

      return data;
    },

    ensureId: function() {
      if (!this.get('id')) {
        this.set({
          id: 'macro_' + this.cid
        });
      }
    },

    ensureEntries: function() {
      if (!this.entries) {
        this.entries = new MacroEntrySet(null, { macro: this });
        this.listenTo(this.entries, 'add change remove', function() {
          this.trigger('change', this);
        });
      }
    },

    isIdle: function() {
      return this.get('status') === 'idle';
    },
    isRecording: function() {
      return this.get('status') === 'recording';
    },
    isPlaying: function() {
      return this.get('status') === 'playing';
    },
    isPaused: function() {
      return this.get('status') === 'paused';
    }
  });
});