define('core/messenger', [ ], function() {
  'use strict';

  return {
    sendToPanel: function(payload) {
      window.postMessage(payload, '*');
    }
  };
});