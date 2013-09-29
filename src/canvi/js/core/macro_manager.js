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
      this.listenTo(Canvi.Messenger, 'macros:start', this.start);
      this.listenTo(Canvi.Messenger, 'macros:pause', this.pause);
      this.listenTo(Canvi.Messenger, 'macros:stop', this.stop);
      this.listenTo(Canvi.Messenger, 'macros:reset', this.reset);

      // This must be done at this phase so we install our handlers before
      // any of the client code starts doing funky things.
      _.each(this.events, function(event) {
        document.addEventListener(event, _.bind(this.passToMacro, this, event), true /* capture phase */);
      }, this);

      this.on('add change remove', function() {
        Canvi.Storage.set('macros', this.toJSON());
        console.debug('updated macro set in storage');
      }, this);

      // Update from storage
      this.set(Canvi.Storage.get('macros') || []);
      console.debug('MM from storage:', Canvi.Storage.get('macros'));

      var activeMacros = this.where({ status: 'active' });
      console.debug(activeMacros.length, 'active macros:', activeMacros);

      if (activeMacros.length) {
        this.current = activeMacros[0];
        this.resume();
      }
    },

    start: function() {
      if (this.current) {
        this.current.stop();
      }

      console.log('recording a new macro.');

      this.current = this.add({}).last();
      this.current.start();
    },

    pause: function() {
      if (this.current) {
        console.debug('pausing macro');
        this.current.pause();
      }
    },

    resume: function() {
      if (this.current) {
        console.debug('resuming macro with', this.current.entries.length, 'entries');
        this.current.resume();
      }
    },

    stop: function() {
      if (this.current) {
        console.log('stopping macro');
        this.current.stop();
        this.current = null;
      }
    },

    reset: function() {
      this.stop();

      Backbone.Collection.prototype.reset.apply(this, arguments);
      Canvi.Storage.remove('macros');

      console.debug('all macros have been removed.');
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
    }
  });
});