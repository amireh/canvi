(function() {
  'use strict';

  var runScript = function(path) {
    var xhr;

    xhr = new XMLHttpRequest();
    xhr.open('GET', chrome.extension.getURL(path), false);
    xhr.send();
    chrome.devtools.inspectedWindow.eval(xhr.responseText);

    // console.debug('got script:', path);
  };

  /**
   * Pull Canvi.js via XHR and inject it into the inspected page JS environment.
   */
  function injectCanvi() {
    runScript('/vendor/js/require.js');

    // We'll do this for development so we won't have to recompile the JS
    // everytime we do a change.
    chrome.devtools.inspectedWindow.eval(
      'window.requirejs.config({' +
        'baseUrl: "' + chrome.extension.getURL('/src/canvi/js') + '"' +
      '});'
    );

    runScript('/src/canvi/js/main.js');
  }

  if (typeof chrome !== 'undefined' && chrome.devtools) {
    chrome.devtools.network.onNavigated.addListener(function() {
      location.reload(true);
    });

    // injectCanvi();
  }

})();