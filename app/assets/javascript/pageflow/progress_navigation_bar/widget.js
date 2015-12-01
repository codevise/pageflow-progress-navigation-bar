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

      pageflow.slides.on('slideshowchangepage', function() {
        that.element.addClass('show_on_mobile');
        setTimeout(function() {
          that.element.removeClass('show_on_mobile');
        }, 1000);
      });

      that.element.on('mouseenter', function() { that.element.addClass('hover'); });
      that.element.on('mouseleave', function() { that.element.removeClass('hover'); });

      /* keyboard / skiplinks */

      that.element.find('a, *[tabindex]').on('blur', function() {
        that.element.removeClass('focus');
      });

      that.element.find('a, *[tabindex]').on('focus', function() {
        that.element.addClass('focus');
      });

      /* Volume */
      that.element.find('.navigation_volume_box').volumeSlider({
        orientation: 'v'
      });
      that.element.find('.navigation_mute').muteButton();

      /* hide buttons on mobile devices */
      if (pageflow.features.has('mobile platform')) {
        that.element.find('.navigation_butten_area').hide();

      }

      /* header button */
      $('.navigation_main', this.element).click(function() {
        $(this)
          .toggleClass('active')
          .updateTitle();
        $('.header').toggleClass('active');
        that.element.toggleClass('header_active');
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

      var shareBox = $('.navigation_share_box', this.element),
          links = $('> a', shareBox);
        shareBox.shareMenu({
        subMenu: $('.sub_share', shareBox),
        links: links,
        insertAfter: links.last(),
        closeOnMouseLeaving: shareBox
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
          'mouseenter focus': handlerIn,
          'mouseleave blur': hideOverlay,
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

        $('.navigation_dots > li').css('height', Math.round(appliedHeight) + 'px');
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
