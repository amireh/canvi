define('core/macro_manager', [ 'lodash', 'backbone', 'models/macro' ], function(_, Backbone, Macro) {
  'use strict';

  return Backbone.Collection.extend({
    model: Macro,
    urlRoot: '/macros',

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
      this.set(this.fromCache());

      // Persist macro updates
      this.on('add change remove', this.updateCache, this);

      // Pick up where we left off if we're coming from a reload:
      var activeMacros = this.where({ status: 'active' });

      if (activeMacros.length) {
        // this.current = activeMacros[0];
        // this.resume();
        this.start({
          id: activeMacros[0].id
        })
      }

      // Listen to Panel messages
      Canvi.Messenger.bindToNamespace('macros', this);
    },

    /**
     * Start recording a macro.
     */
    start: function(message) {
      if (this.current) {
        this.current.stop();
      }

      console.log('recording a new macro.');

      if (message.id) {
        this.current = this.get(message.id);

        if (!this.current) {
          Canvi.Messenger.toPanel('errors', 'noSuchMacro');
          return false;
        }
      }
      else {
        this.current = this.add({}).last();
      }

      this.current.start();

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

        this.stopListening(this.current.entries);

        this.current.stop();
        this.current = null;

        Canvi.Messenger.toPanel('macros', 'recordingStopped');
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
      if (this.current) {
        var evtName = [ 'on', eventType ].join('_').camelize();

        console.debug('recording into macro:', evtName);

        if (this.current[evtName]) {
          this.current[evtName](event);
        }
      }
    },

    fromCache: function() {
      return Canvi.Storage.get('macros');
    },

    updateCache: function() {
      Canvi.Storage.set('macros', this.toJSON());
    }
  });
});