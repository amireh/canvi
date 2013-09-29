var root = this;
var LogPrefix = '[Panel]';

/**
 * Catch errors and log them to the console.
 *
 * The faulty script will actually be linked (and openable) in the console.
 *
 * @param  {String} e The exception message.
 * @param  {String} file The file in which the error was raised.
 * @param  {[type]} line The line that raised the error.
 */
window.onerror = function(e, file, line) {
  console.error(e + ' in: ' + file + ':' + line);
};

/**
 * Forwards all console.* messages to the inspected page's environment so the
 * messages can be seen in the console.
 *
 * Objects will be JSON stringifed before logging.
 * All messages will be prefixed by LogPrefix;
 */
var proxyConsole = function() {
  _.each([ 'log', 'debug', 'info', 'warn', 'error' ], function(severity) {
    root.console[severity] = function() {
      var messages = _.flatten(arguments);

      messages = _.map(messages, function(m) {
        var entry = m;

        if (_.isObject(m)) {
          try {
            entry = JSON.stringify(m);
          } catch(e) {
            entry = '{serializing error:' + e.message + '}';
          }
        }

        return entry;
      });

      messages.unshift(LogPrefix);
      messages = messages.join(' ');

      chrome.devtools.inspectedWindow.eval('console.' + severity + '(' + JSON.stringify(messages) + ')');
    }
  });
};

(function() {
  'use strict';

  root.Panel = {};
  root.Panel.Storage = window.store;

  proxyConsole();
})();