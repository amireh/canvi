define('core/macro_manager', [ 'lodash', 'backbone', 'models/macro' ], function(_, Backbone, Macro) {
  'use strict';

  /**
   * @class Canvi.MacroManager
   * @alternateClassName MacroManager
   *
   * Interface for recording and playing macros.
   */
  return Backbone.Collection.extend({
    model: Macro,
    urlRoot: '/macros',

    playCursor: 0,

    /**
     * @property {String[]} events
     * Events that will be intercepted by Macros and recorded regardless of
     * bubble/capture status.
     */
    events: [
      'click',
      'change',
      'submit'
    ],

    initialize: function() {
      // Intercept events!
      //
      // This must be done at this phase so we install our handlers before
      // any of the client code starts doing funky things.
      _.each(this.events, function(event) {
        document.addEventListener(event, _.bind(this.passToMacro, this, event), true /* capture phase */);
      }, this);

      // Pull from storage
      // console.log('macros: updating from cache:', this.fromCache());
      this.set(this.fromCache(), { parse: true });

      // Persist macro updates
      this.on('add change remove', this.updateCache, this);

      // Pick up where we left off if we're coming from a reload:
      var activeMacros = this.where({ status: 'recording' });

      if (activeMacros.length) {
        this.record({
          id: activeMacros[0].id
        });
      }

      // Listen to Panel messages
      Canvi.Messenger.bindToNamespace('macros', this);
    },

    focus: function(macro) {
      macro = macro || {};

      if (macro.id) {

        // Stop the focused one, if any
        if (this.current) {
          this.stop();
        }

        this.current = this.get(macro.id);

        if (this.current) {
          // Broadcast status updates
          this.listenTo(this.current, 'change:status', this.broadcastStatus);
          this.listenTo(this.current, 'change:status', this.replayIfApplicable);

          Canvi.Messenger.toPanel('macros', 'focused', this.current.toJSON());

          return true;
        }
        else {
          Canvi.Messenger.toPanel('errors', 'noSuchMacro');
          return false;
        }
      }
    },

    /**
     * Start recording a macro.
     *
     * @param {Macro} [macro=null]
     * Macro to focus. If none is specified, a new macro is created.
     */
    record: function(macro) {
      if (this.current) {
        this.current.stop();
      }

      console.log('recording a new macro.');

      // Start a new macro if none is focused.
      if (!macro || !macro.id) {
        macro = this.add({}).last();
      }

      if (!this.focus(macro)) {
        return false;
      }

      this.current.record();

      // Listen to the macro entry additions so we can tell the Panel to update
      this.listenTo(this.current.entries, 'add', function(entry) {
        Canvi.Messenger.toPanel('macros', 'entry', entry.toJSON());
      });

      Canvi.Messenger.toPanel('macros', 'recordingStarted', this.current.toJSON());
    },

    /**
     * Pause the recording, but don't deactivate the macro.
     */
    pause: function() {
      if (this.current) {
        console.debug('pausing macro');

        this.stopListening(this.current.entries);

        this.current.pause();

        Canvi.Messenger.toPanel('macros', 'recordingPaused');
      }
    },

    /**
     * Resume recording.
     */
    resume: function() {
      if (this.current) {
        console.debug('resuming macro with', this.current.entries.length, 'entries');
        this.current.resume();
      }
    },

    /**
     * Stop recording, deactivate the macro. Recording can be started again later.
     */
    stop: function() {
      if (this.current) {
        console.log('stopping macro');

        this.current.stop();

        this.stopListening(this.current.entries);
        this.stopListening(this.current);

        Canvi.Messenger.toPanel('macros', 'stopped');

        this.current = null;
      }
    },

    /**
     * Purge the entire macro-set.
     */
    reset: function() {
      this.stop();

      Backbone.Collection.prototype.reset.apply(this, arguments);
      Canvi.Storage.remove('macros');

      console.debug('all macros have been removed.');

      Canvi.Messenger.toPanel('macros', 'reset');
    },

    /**
     * Discard the current macro.
     */
    remove: function() {
      if (this.current) {
        this.current.stop();
        Backbone.Collection.prototype.remove.apply(this, [ this.current ]);
        this.current = null;

        Canvi.Messenger.toPanel('macros', 'removed');
      }
    },

    /**
     * Remove a Macro entry at the specified index.
     * @param  {Number} entryIndex Entry index.
     */
    removeEntry: function(entryIndex) {
      if (this.current) {
        var entry = this.current.entries.at(entryIndex);

        if (entry) {
          this.current.entries.remove(entry);
          this.updateCache();

          Canvi.Messenger.toPanel('macros', 'entryRemoved', entryIndex);
        }
      }
    },

    /**
     * Macro playback.
     */
    play: function(options) {
      if (!this.current) {
        return;
      }

      if (this.current.isPaused()) {
        this.current.resume();
      }
      else if (!this.current.isPlaying()) {
        ++this.playCursor;
        this.current.play(options);
      }
    },

    /**
     * List all macros.
     */
    list: function() {
      Canvi.Messenger.toPanel('macros', 'list', this.toJSON());
    },

    /**
     * Pass the intercepted event to the current macro (if any) to handle it.
     * @private
     */
    passToMacro: function(eventType, event) {
      if (this.current && this.current.isRecording()) {
        var evtName = [ 'on', eventType ].join('_').camelize();

        console.debug('recording into macro:', evtName);

        if (this.current[evtName]) {
          this.current[evtName](event);
        }
      }
    },

    /**
     * Pull the cached version of the MM.
     *
     * @private
     * @return {Object} The cached macro manager.
     */
    fromCache: function() {
      return Canvi.Storage.get('macros');
    },

    /**
     * Save the MM to persistent storage.
     * @private
     */
    updateCache: function() {
      console.debug('saving macros');

      Canvi.Storage.set('macros', this.toJSON());
    },

    /**
     * Notify the panel whenever the macro's status changes.
     * @protected
     *
     * @param  {Macro} macro The current macro.
     * @param  {String} status Its status.
     */
    broadcastStatus: function(macro, status) {
      Canvi.Messenger.toPanel('macros', 'statusUpdated', status);
    },

    /**
     * Check if we should re-play the macro once it's become idle based on Macro#repeat.
     *
     * @param  {Macro} macro The current macro.
     * @param  {String} status Its status, must be 'idle'.
     */
    replayIfApplicable: function(macro, status) {
      var that = this;

      if (status === 'idle' && macro.previous('status') === 'playing') {
        if (this.playCursor < macro.get('repeat')) {
          setTimeout(function() {
            that.play();
          }, macro.get('repeatEvery'));
        }
        else {
          this.playCursor = 0;
        }
      }
    },

    configureMacro: function(options) {
      this.current.set(options);
      Canvi.Messenger.toPanel('macros', 'configured', this.current.toJSON());
    }
  });
});