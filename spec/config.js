requirejs.config({
  baseUrl: './src/canvi/js',
  paths: {
    'chrome.devtools.stubs': '../../../spec/helpers/chrome_devtools_stubs'
  },
  callback: function() {
    var root = this;

    // Hide the global "launchTest" that the grunt-contrib-requirejs-template
    // unconditionally calls without respecting our callback. We must initialize
    // the app and wait for the "bootstrapped" event before any of the specs
    // are run.
    var nowLaunchTests = root.launchTest;
    root.launchTest = function() {};

    if (require.onError) {
      require.onError = function(e) {
        throw e;
      }
    }

    require([ 'chrome.devtools.stubs' ], function() {
      require([ 'text', 'jquery', 'ext/string', 'app' ], function() {
        nowLaunchTests();
      });
    });
  }
});