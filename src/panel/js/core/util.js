(function() {
  Panel.Util = {};

  /**
   * Fetches a Handlebars template using an XHR request and compiles it.
   *
   * @param {String} path
   * Path to the HBS file relative to /src/panel/js/templates, without the .hbs
   * extension/suffix.
   *
   * @return {Function} The compiled Handlebars template.
   */
  Panel.Util.jst = function(path) {
    var jstUrl = chrome.extension.getURL('/src/panel/js/templates/' + path + '.hbs');
    var xhr;

    xhr = new XMLHttpRequest();
    xhr.open('GET', jstUrl, false);
    xhr.send();

    return Handlebars.compile(xhr.responseText.trim());
  };
})();