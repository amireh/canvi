define('core/macro_manager', [ 'lodash', 'backbone', 'models/macro' ], function(_, Backbone, Macro) {
  'use strict';

  return Backbone.Collection.extend({
    model: Macro,
    _intercepted: [],

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
      this.listenTo(Canvi.Messenger, 'macros:record', this.start);
      this.passProxy = _.bind(this.passToMacro, this);

      // This must be done at this phase so we install our handlers before
      // any of the client code starts doing funky things.
      _.each(this.events, function(event) {
        document.addEventListener(event, _.bind(this.passToMacro, this, event), true /* capture phase */);
      }, this);
    },

    start: function() {
      console.log('recording a new macro.');

      this.current = this.add({}).last();
    },

    stop: function() {
      console.log('stopping the current macro.');

      if (this.current) {
        this.current.stop();
      }
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