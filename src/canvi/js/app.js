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

  Canvi.Messenger.connect();
  // Canvi.MacroManager.start();
});