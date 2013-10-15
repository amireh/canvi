describe('Macro Manager', function() {
  var mm = Canvi.MacroManager;

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
      $fixture.append('<button id="one" />');
      $fixture.append('<button id="two" />');
      $fixture.append('<button id="three" />');

      toCanvi('macros', 'record', function() {
        $fixture.find('#one').click();
        $fixture.find('#three').click();
        $fixture.find('#two').click();

        toCanvi('macros', 'configureMacro', {
          pauseTimer: 0,
          replays: 0
        });

        var oneClicked = 0, twoClicked = 0, threeClicked = 0;

        $fixture.on('click', '#one', function() {
          ++oneClicked;
        });

        $fixture.on('click', '#two', function() {
          ++twoClicked;
        });

        $fixture.on('click', '#three', function() {
          ++threeClicked;
        });

        toCanvi('macros', 'play', function() {
          chrome.expectMessage('macros', 'entryPlayed', function(m1) {
            expect(m1.data.status).toEqual(true);
            expect(oneClicked).toEqual(1);
          });

          chrome.expectMessage('macros', 'entryPlayed', function(m2) {
            expect(m2.data.status).toEqual(true);
            expect(threeClicked).toEqual(1);
          });

          chrome.expectMessage('macros', 'entryPlayed', function(m3) {
            expect(m3.data.status).toEqual(true);
            expect(twoClicked).toEqual(1);
          });
        });
      });
    });
  });
});