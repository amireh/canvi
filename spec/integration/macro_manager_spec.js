describe('Macro Manager', function() {
  var mm = Canvi.MacroManager;
  var oneClicked, twoClicked, threeClicked;
  var $one, $two, $three;

  var buttonFixture = function() {
    oneClicked = twoClicked = threeClicked = 0;

    $one = $('<button id="one" />').appendTo($fixture);
    $two = $('<button id="two" />').appendTo($fixture);
    $three = $('<button id="three" />').appendTo($fixture);

    return function() {
      $fixture.on('click', '#one',    function() { ++oneClicked; });
      $fixture.on('click', '#two',    function() { ++twoClicked; });
      $fixture.on('click', '#three',  function() { ++threeClicked; });
    };
  };

  describe('Recording', function() {
    it('should record a new macro', function() {
      toCanvi('macros', 'record', {}, function(response) {
        expect(response.label).toEqual('recordingStarted');
      });
    });

    it('should stop recording a macro', function() {
      toCanvi('macros', 'record', {}, function(response) {
        expect(response.label).toEqual('recordingStarted');
      });

      toCanvi('macros', 'stop', {}, function(response) {
        expect(response.label).toEqual('stopped');
      });
    });

    it('should record a click', function() {
      toCanvi('macros', 'record', {}, function(response) {
        expect(response.label).toEqual('recordingStarted');

        $(document.body).click();

        var message = chrome.lastMessage();

        expect( message.label ).toEqual('entry');
        expect( message.data.type ).toEqual('click');
        expect( message.data.target ).toEqual('body');
      });
    });

    it('should record many clicks', function() {
      toCanvi('macros', 'record', {}, function() {
        simulateClick();
        expectClick();
        simulateClick();
        expectClick();
        simulateClick();
        expectClick();
      });
    });

    it('should pause and resume recording', function() {
      toCanvi('macros', 'record', {}, function(response) {
        expect(response.label).toEqual('recordingStarted');

        toCanvi('macros', 'stop', {}, function(response) {
          expect(response.label).toEqual('stopped');

          chrome.flush();
          simulateClick();

          // Click shouldn't go through
          expect(chrome.buffer.length).toEqual(0);

          toCanvi('macros', 'record', {}, function(response) {
            chrome.flush();

            expect(response.label).toEqual('recordingStarted');

            // But now it should
            simulateClick();
            expectClick();
          });

        });
      });
    });

    it('should persist', function() {
      expect(cachedMacros()).toBeFalsy();

      toCanvi('macros', 'record', {}, function(response) {
        expect(cachedMacros().length).toEqual(1);

        simulateClick();
        expect(cachedMacros()[0].entries.length).toEqual(1);

        simulateClick();
        expect(cachedMacros()[0].entries.length).toEqual(2);
      });
    });
  });

  describe('Playback', function() {
    it('should playback', function() {
      var bindButtons = buttonFixture();

      toCanvi('macros', 'record', function() {
        $one.click();
        $three.click();
        $two.click();

        bindButtons();

        toCanvi('macros', 'configureMacro', {
          pauseTimer: 500,
          replays: 0
        });

        toCanvi('macros', 'play');

        chrome.expectMessage('macros', 'entryPlayed', function(m) {
          expect(m.data.status).toEqual(true);
          expect(oneClicked).toEqual(1);
        });

        chrome.expectMessage('macros', 'entryPlayed', function(m) {
          expect(m.data.status).toEqual(true);
          expect(threeClicked).toEqual(1);
        });

        chrome.expectMessage('macros', 'entryPlayed', function(m) {
          expect(m.data.status).toEqual(true);
          expect(twoClicked).toEqual(1);
        });
      });
    });

    it('should replay', function() {
      var bindButtons = buttonFixture();

      toCanvi('macros', 'record', function() {
        $one.click();
        $three.click();
        $two.click();

        bindButtons();

        toCanvi('macros', 'configureMacro', {
          pauseTimer: 250,
          replayTimer: 250,
          replays: 1
        });

        toCanvi('macros', 'play');

        chrome.expectMessage('macros', 'entryPlayed', function(m) {
          expect(m.data.status).toEqual(true);
          expect(oneClicked).toEqual(1);
        });

        chrome.expectMessage('macros', 'entryPlayed', function(m) {
          expect(m.data.status).toEqual(true);
          expect(threeClicked).toEqual(1);
        });

        chrome.expectMessage('macros', 'entryPlayed', function(m) {
          expect(m.data.status).toEqual(true);
          expect(twoClicked).toEqual(1);
        });

        chrome.expectMessage('macros', 'entryPlayed', function(m) {
          expect(m.data.status).toEqual(true);
          expect(oneClicked).toEqual(2);
        });

        chrome.expectMessage('macros', 'entryPlayed', function(m) {
          expect(m.data.status).toEqual(true);
          expect(threeClicked).toEqual(2);
        });

        chrome.expectMessage('macros', 'entryPlayed', function(m) {
          expect(m.data.status).toEqual(true);
          expect(twoClicked).toEqual(2);
        });
      });
    });

    it('should playback really quickly', function() {
      var bindButtons = buttonFixture();

      toCanvi('macros', 'record', function() {
        $one.click();
        $two.click();
        $three.click();
        $one.click();
        $two.click();
        $three.click();
        $one.click();
        $two.click();
        $three.click();

        bindButtons();

        toCanvi('macros', 'configureMacro', {
          pauseTimer: 0,
          replays: 0
        });

        toCanvi('macros', 'play');

        chrome.expectMessage('macros', 'entryPlayed', function(m) {
          expect(m.data.status).toEqual(true);
          expect(oneClicked).toEqual(1);
        });

        chrome.expectMessage('macros', 'entryPlayed', function(m) {
          expect(m.data.status).toEqual(true);
          expect(twoClicked).toEqual(1);
        });

        chrome.expectMessage('macros', 'entryPlayed', function(m) {
          expect(m.data.status).toEqual(true);
          expect(threeClicked).toEqual(1);
        });

        chrome.expectMessage('macros', 'entryPlayed', function(m) {
          expect(m.data.status).toEqual(true);
          expect(oneClicked).toEqual(2);
        });

        chrome.expectMessage('macros', 'entryPlayed', function(m) {
          expect(m.data.status).toEqual(true);
          expect(twoClicked).toEqual(2);
        });

        chrome.expectMessage('macros', 'entryPlayed', function(m) {
          expect(m.data.status).toEqual(true);
          expect(threeClicked).toEqual(2);
        });

        chrome.expectMessage('macros', 'entryPlayed', function(m) {
          expect(m.data.status).toEqual(true);
          expect(oneClicked).toEqual(3);
        });

        chrome.expectMessage('macros', 'entryPlayed', function(m) {
          expect(m.data.status).toEqual(true);
          expect(twoClicked).toEqual(3);
        });

        chrome.expectMessage('macros', 'entryPlayed', function(m) {
          expect(m.data.status).toEqual(true);
          expect(threeClicked).toEqual(3);
        });

      });
    });
  });
});