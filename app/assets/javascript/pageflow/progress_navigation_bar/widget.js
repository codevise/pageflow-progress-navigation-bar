/*global IScroll*/

(function($) {
  $.widget('pageflow.progressNavigationBar', {
    _create: function() {
      var overlays = this.element.find('.navigation_site_detail'),
          that = this,
          hasHomeButton = !!this.element.find('.navigation_home').length;

      this.element.addClass('js').append(overlays);

      $('a.navigation_top', this.element).topButton();

      $('.navigation_bar_bottom', this.element)
        .append($('.navigation_bar_top > li', this.element).slice(hasHomeButton ? 4 : 3));


      /* open menu magic */
      var checkingForMouseDelta = false,
        lastPosition,
        openBarTimeout,
        closeBarTimeout,
        measuringDistance = 600;

      $('body').on('mousemove', function(e) {
        var recentPosition = e.pageX;
        var measuredDistance = that.element.offset().left - e.pageX;
        if(measuredDistance < measuringDistance && !checkingForMouseDelta) {
          checkingForMouseDelta = true;
          lastPosition = e.pageX;

          closeBarTimeout = setTimeout(function() {
            that.element.removeClass('hover');
            checkingForMouseDelta = false;
          }, 2000);

          openBarTimeout = setTimeout(function() {
              if(recentPosition - lastPosition > 100 * (measuredDistance / measuringDistance) + 10) {
                that.element.addClass('hover');

              }
              else {
                checkingForMouseDelta = false;
                clearTimeout(closeBarTimeout);
              }
          },50);
        }
      });

      that.element.on('mouseenter', function() { that.element.addClass('hover'); clearTimeout(closeBarTimeout);});
      that.element.on('mousemove', function() { clearTimeout(closeBarTimeout); });
      that.element.on('mouseleave', function() { that.element.removeClass('hover'); checkingForMouseDelta = false; });

      /*that.element.on('mousemove', function() {
        clearTimeout(closeBarTimeout);
        closeBarTimeout = setTimeout(function() {
          that.element.removeClass('hover');
        }, 500);
      });*/

      /* Volume */

      var handlingVolume = false;
      var volumeBeforeMute = 1;
      var muteButton = $('.navigation_bg.navigation_mute', that.element);
      var changeVolume = function(event) {
        var volume = 1 - (event.pageY - $('.volume-slider', that.element).offset().top) / $(('.volume-slider')).height();
        if (volume > 1) { volume = 1; }
        if (volume < 0) { volume = 0; }
        setVolume(volume);
      };

      var setVolume = function(volume) {
        $('.volume-level', that.element).css({height: volume * 100 + "%"});
        pageflow.settings.set('volume', volume);

        if (volume === 0) {
          muteButton
            .attr('title', muteButton.attr('data-muted-title'))
            .addClass('muted');
        }
        else {
          muteButton
            .attr('title', muteButton.attr('data-not-muted-title'))
            .removeClass('muted');
        }
      };

      var toggleMute = function () {
        if (pageflow.settings.get('volume') > 0) {
          volumeBeforeMute = pageflow.settings.get('volume');
          setVolume(0);
        }
        else {
          setVolume(volumeBeforeMute);
        }
      };

      muteButton.on("click", function() {
        toggleMute();
      });

      $('.volume-level', this.element).css({
        height: pageflow.settings.get("volume") * 100 + "%"
      });

      $('.navigation_volume_box', this.element).on("mousedown", function(event) {
        handlingVolume = true;
        changeVolume(event);
      });

      $('.navigation_volume_box', this.element).on("mousemove", function(event) {
        if(handlingVolume) {
          changeVolume(event);
        }
      });

      setVolume(pageflow.settings.get('volume'));

      /* hide volume button on mobile devices */
      if (pageflow.features.has('mobile platform')) {
        $('li.mute', this.element).hide();
        $('.navigation_bar_bottom', this.element).css('height', '224px');
        $('.scroller', this.element).css('bottom', '224px');
        $('.scroll_indicator.bottom', this.element).css('bottom', '190px');
      }

      /* header button */
      $('.navigation_main', this.element).click(function() {
        $(this)
          .toggleClass('active')
          .updateTitle();
        $('.header').toggleClass('active');
      });

      /* open header through skiplinks */
      $('a[href="#header"], a[href="#search"]', '#skipLinks').click(function() {
        $('.navigation_main', that.element).addClass('active');
        $('.header').addClass('active');
        $(this.getAttribute('href')).select();
      });

      /* share-button */
      $('.navigation_menu .navigation_menu_box a', this.element).focus(function() {
        $(this).parent().parent().addClass('focused');
      }).blur(function() {
        $(this).parent().parent().removeClass('focused');
      });

      /* pages */
      var pageLinks = $('.navigation_dots a', that.element),
        target;

      function registerHandler() {
        target = $(this);
        target.one('mouseup touchend', goToPage);
      }

      function removeHandler() {
        pageLinks.off('mouseup touchend', goToPage);
      }

      function closeOverview() {
        $('.overview').removeClass("active");
        $('.navigation_index', that.element).removeClass("active");
      }

      function hideOverlay() {
        $(overlays).addClass('hidden').removeClass('visible');
      }

      function goToPage(e) {
        if (target && target[0] != e.currentTarget) {
          return;
        }
        hideOverlay();
        closeOverview();
        $('.page .content, .scroll_indicator').removeClass('hidden');
        pageflow.slides.goToById(this.getAttribute("data-link"));
        e.preventDefault();
      }

      pageLinks.each(function(index) {
        var handlerIn = function() {
          if (!('ontouchstart' in document.documentElement)) {
            var calculatedOffset = $(this).offset().top + $(overlays[index]).outerHeight() > $('.progress_navigation_bar').height() ? $('.progress_navigation_bar').height() - $(overlays[index]).outerHeight() : $(this).offset().top;
            $(overlays[index]).css("top", calculatedOffset).addClass('visible').removeClass('hidden');
          }
        };

        $(this).on({
          'mouseenter': handlerIn,
          'mouseleave': hideOverlay,
          'mousedown touchstart': registerHandler,
          'click': goToPage
        });
      });

      var resizeDots = function() {
        var pageDotsMaxHeight = 20,
        pageDotsMinHeight = 1,
        maxBarHeight = $('#outer_wrapper').height() ? $('#outer_wrapper').height() : $('main').height(),
        wantedHeight = maxBarHeight / pageLinks.length,
        appliedHeight = pageDotsMinHeight;


        if(wantedHeight <= pageDotsMaxHeight && wantedHeight > pageDotsMinHeight) {
          appliedHeight = wantedHeight;
        }
        else if(wantedHeight > pageDotsMinHeight) {
          appliedHeight = pageDotsMaxHeight;
        }

        $('.navigation_dots > li').css('height', appliedHeight + 'px');
      };

      resizeDots();

      $(window).on('resize', function () {
        $(overlays).css("top","0");
        resizeDots();
      });

      $('.scroller', this.element).each(function () {
        var scrollerOptions = {
          mouseWheel: true,
          bounce    : false,
          probeType : 2
        };

        /*
          This is just a quick fix to detect IE10. We should
          refactor this condition if we decide to use Modernizr
          or another more global detection.
         */
        if (window.navigator.msPointerEnabled) {
          scrollerOptions.preventDefault = false;
        }

        var scroller = new IScroll(this, scrollerOptions);

        $('ul.navigation_dots', that.element).pageNavigationList({
          scroller: scroller,
          scrollToActive: true
        });

      });

      /* hide text button */
      var hideText = $('.navigation_hide_text', this.element);

      hideText.click(function() {
        pageflow.hideText.toggle();
      });

      pageflow.hideText.on('activate deactivate', function() {
        hideText.toggleClass('active', pageflow.hideText.isActive()).updateTitle();
      });

      /* fullscreen button */
      if ($.support.fullscreen) {
        var fs = $('.navigation_fullscreen', this.element),
            fullscreenCallback = function(isFullScreen) {
              fs
                .toggleClass('active', !!isFullScreen)
                .updateTitle();
            };

        fs.click(function() {
          fs.toggleClass('fs').updateTitle();
          $('#outer_wrapper').fullScreen({'callback': fullscreenCallback});
        });
      }
      else {
        $('.navigation_bar_bottom .fullscreen a', this.element).css('visibility', 'hidden');
      }

      $('.button, .navigation_mute, .scroll_indicator', this.element).on({
        'touchstart mousedown': function() {
          $(this).parent().addClass('pressed');
        },
        'touchend mouseup': function() {
          $(this).parent().removeClass('pressed');
        }
      });

      $('.navigation_share, .navigation_credits', this.element).on({
        'touchstart': function() {
          var element = $(this).parent().parent();
          element.addClass('open');

          function close(e) {
            if (!element.find(e.target).length) {
              element.removeClass('open');
              $('body').off('touchstart', close);
            }
          }
          $('body').on('touchstart', close);
        }
      });

      $('li', this.element).on('mouseleave', function() {
        $(this).blur();
      });

      $('body').on({
        'mouseup': function() {
          handlingVolume = false;
        }
      });
    }
  });
}(jQuery));
