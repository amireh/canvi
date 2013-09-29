define('app', [
  'core/macro_manager',
  'core/messenger'
], function(MacroManager, Messenger) {
  'use strict';

  console.log('[Canvi] hi!');

  Canvi.Messenger = Messenger;
  Canvi.MacroManager = new MacroManager();

  Canvi.MacroManager.start();
});