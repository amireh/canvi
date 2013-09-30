define('models/macro', [
  'jquery',
  'lodash',
  'backbone',
  'models/macro_entry'
], function($, _, Backbone, MacroEntry) {
  'use strict';

  var MacroEntrySet = Backbone.Collection.extend({
    model: MacroEntry
  });

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
       * @type {String}
       */
      status: 'idle'
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

    play: function(options, entry) {
      var that = this;
      var entryIndex;

      this.options = _.extend({}, this.options, {
        pauseTimer: 500
      }, options);

      this.entry = entry || this.entries.first();
      entryIndex = this.entries.indexOf(this.entry);

      if (!this.entry) {
        return this.stop();
      }

      this.set('status', 'playing');

      console.info('playing entry:', entryIndex);

      Canvi.Messenger.toPanel('macros', 'playingEntry', entryIndex);

      this.entry.simulate(options, function(entry, status) {

        Canvi.Messenger.toPanel('macros', 'entryPlayed', {
          entryIndex: entryIndex,
          status: status
        });

        that.playNext();
      });
    },

    playNext: function() {
      if (!this.isPlaying()) {
        return;
      }

      var that = this;
      var entryIndex = this.entries.indexOf(this.entry);
      var nextEntry = this.entries.at(entryIndex + 1);
      var options = this.options;

      if (nextEntry) {
        setTimeout(function() {
          if (!that.isPlaying()) {
            return;
          }

          that.play(options, nextEntry);
        }, options.pauseTimer);
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

      // this.start();
      // this.entries.each(function(entry) {
      //   entry.collection.trigger('add', entry);
      // });
    },

    /**
     * Stop recording or playing.
     */
    stop: function() {
      this.set('status', 'idle');
      this.entry = null;
    },

    onClick: function(e) {
      console.debug('[Canvi] something was clicked');
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
        if ( scope = this.locateScope(node) ) {
          fragments.push('#' + scope);
        }

        // A position constraint
        fragments.push([
          node.nodeName.toLowerCase(),
          'nth-child(' + this.nodeIndex(node) + ')'
        ].join(':'));
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
          scope = currentNode;
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
      this.trigger('change', this);
    },

    parse: function(data) {
      console.log('macro raw data:', data);

      if (data.entries) {
        this.ensureEntries();
        console.debug('macro cached entries:', data.entries);
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
        this.entries = new MacroEntrySet(null);
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