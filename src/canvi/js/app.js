define('app', [
  'store',
  'core/macro_manager',
  'core/messenger'
], function(Store, MacroManager, Messenger) {
  'use strict';

  console.log('[Canvi] hi!');

  /**
   * @class Canvi
   *
   * Canvi namespace.
   */
  window.Canvi = {};

  /**
   * @property {store} Storage
   *
   * A localStorage adapter.
   */
  Canvi.Storage = Store;

  /**
   * @property {Messenger} Messenger
   *
   * A global Messenger instance for communication.
   */
  Canvi.Messenger = new Messenger();

  /**
   * @property {MacroManager} MacroManager
   *
   * A global MacroManager instance for managing macros.
   */
  Canvi.MacroManager = new MacroManager();

  // Export a shortcut for backbone entities to whisper to Panel:
  Backbone.Collection.prototype.toCanvi =
    Backbone.View.prototype.toCanvi =
      Backbone.Model.prototype.toCanvi = _.bind(Canvi.Messenger.toPanel, Canvi.Messenger);

  Canvi.Messenger.connect();
});