define('app', [
  'core/macro_manager',
  'core/messenger'
], function(MacroManager, Messenger) {
  'use strict';

  console.log('[Canvi] hi!');

  Canvi.Messenger = new Messenger();
  Canvi.MacroManager = new MacroManager();

  Canvi.Messenger.connect();
  // Canvi.MacroManager.start();
});