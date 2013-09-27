(function() {
  console.log('[Canvi] hi!');
  document.addEventListener('click', function(e) {
    var $target = $(e.target);

    console.log('[Canvi] something was clicked:', $target);
    console.debug('Button?', $target.is('button'));
  }, true);
})();