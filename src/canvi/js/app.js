define('app', [
  'store',
  'core/macro_manager',
  'core/messenger'
], function(Store, MacroManager, Messenger) {
  'use strict';

  console.log('[Canvi] hi!');

  Canvi.Storage = Store;
  Canvi.Messenger = new Messenger();
  Canvi.MacroManager = new MacroManager();

  // Export a shortcut for backbone entities to whisper to Panel:
  Backbone.Collection.prototype.toCanvi =
    Backbone.View.prototype.toCanvi =
      Backbone.Model.prototype.toCanvi = _.bind(Canvi.Messenger.toPanel, Canvi.Messenger);

  Canvi.Messenger.connect();
});