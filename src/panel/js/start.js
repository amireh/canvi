(function() {
  'use strict';

  Backbone.history.start({
    root: '/',
    pushState: false,
    silent: false
  });

  var lastUrl = Panel.Storage.get('lastUrl');

  if (lastUrl) {
    console.debug('Re-visiting URL from last session:', lastUrl);
    Panel.Router.navigate(lastUrl);
  }
})();