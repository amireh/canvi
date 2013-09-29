(function() {
  'use strict';

  /**
   * Pull Canvi.js via XHR and inject it into the inspected page JS environment.
   */
  function injectCanvi() {
    var canvi;
    var xhr = new XMLHttpRequest();
    // xhr.open('GET', chrome.extension.getURL('/src/canvi/js/app.js'), false);
    xhr.open('GET', chrome.extension.getURL('/dist/canvi.min.js'), false);
    xhr.send();

    canvi = '(function() { ' + xhr.responseText + ' }());';

    chrome.devtools.inspectedWindow.eval('console.log(' + JSON.stringify(xhr) + ');');

    chrome.devtools.inspectedWindow.eval(xhr.responseText);
  }

  if (typeof chrome !== 'undefined' && chrome.devtools) {
    chrome.devtools.network.onNavigated.addListener(function() {
      location.reload(true);
    });

    injectCanvi();
  }

})();