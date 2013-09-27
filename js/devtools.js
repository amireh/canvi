(function() {
  chrome.devtools.panels.create(
    'Canvi',
    'images/icon-32.png', // No icon path
    'html/panel.html',
    null // no callback needed
  );
})();