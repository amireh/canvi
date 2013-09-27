(function(Canvi) {
  var htmlTag = document.documentElement;

  var baseUrl = htmlTag.getAttribute('canvi-path');
  htmlTag.removeAttribute('canvi-path');

  // a simple security check
  if (!/^chrome-extension:\/\/\w+\/js\/inject\/$/.test(baseUrl)) {
    console.error('[Canvi] Incorrect extension URL');
    return;
  }

  var injectScript = function(url, callback) {
    // don't use $.ajax to avoid any prefilters adding headers
    var request = new XMLHttpRequest();
    request.open('GET', baseUrl + url, false);
    request.send();
    eval(request.responseText);
    if (callback) callback();
  };

  var timer;
  var dependencies = [ 'jQuery' ];

  var inject = function() {
    console.debug('[Canvi] resolving dependencies:', dependencies);

    // Resolve vendor dependencies
    var timeout;
    var i;
    for (i = 0; i < dependencies.length; ++i) {
      var dependency = dependencies[i];

      if (!window[dependency]) {
        timeout = parseInt(window.sessionStorage['__canvi_injection_timeout'], 10) || 500;
        document.addEventListener('DOMNodeInserted', tryInject);

        timer = setTimeout(function () {
          document.removeEventListener('DOMNodeInserted', tryInject);
          console.error('[Canvi] Couldn\'t find dependency:', dependency);
        }, timeout);

        return;
      }
    }

    injectScript("canvi.js", function() {
      console.log('[Canvi] Injected.');
    });
  };

  var tryInject = function () {
    if (window.Backbone) {
      clearTimeout(timer);
      document.removeEventListener('DOMNodeInserted', tryInject);
      inject();
    }
  };

  // if (window.sessionStorage['_backbone_debug_injection'] === 'enabled') {
    // document.addEventListener('DOMContentLoaded', inject);
    inject();
  // }

  console.log('[Canvi] injector invoked.');
})(window.Canvi);
