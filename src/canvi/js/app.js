(function() {
  console.log('[Canvi] hi!');

  document.addEventListener('click', function(e) {
    var $target = $(e.target);
    var payload;

    console.log('[Canvi] something was clicked:', $target);
    console.debug('Button?', $target.is('button'));

    payload = {
      type: 'event',
      data: {
        type: 'click',
        target: e.toString()
      }
    };

    window.postMessage(payload, '*');
    // chrome.runtime.sendMessage(payload, function(response) {
    //   console.debug('[Canvi] got response from extension:', response);
    // });
    // window.postMessage({ type: "FROM_PAGE", text: "Hello from the webpage!" }, "*");
  }, true);
})();