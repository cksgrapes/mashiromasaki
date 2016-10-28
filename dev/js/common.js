'use strict';

var local = local || {}, is_mobile;

local.$body = $('body');
local.$window = $(window);

(function(common){
  common.init = function() {
    setWindowWidth();
    setMenuScroll();
    setToggleMenu('.toggleButton','.toggleArea');
    setToggleMenu('.controls_button','.controls');
    setMasonry();
    setAnchor();
  };

  common.resize = function() {
    local.$window.on('load resize', function(){
      setWindowWidth();
      setMenuScroll();
    });
  }

  var setWindowWidth = function() {
    local.width = window.innerWidth;
    is_mobile   = (local.width < 768) ? true : false;
  };

  var setMenuScroll = function() {
    $('.toggleContents').perfectScrollbar();
  };

  var setToggleMenu = function(button,area) {
    var $button = $(button),
        areacls = area,
        activeCls = 'active';
    $button.on('click', function(){
      var $this = $(this),
          $area = $this.parent();
      if($area.hasClass(activeCls)) {
        $area.removeClass(activeCls);
      } else {
        $area.addClass(activeCls);
      }
    });
    $(document).on('click', function(event) {
      if (!$(event.target).closest(areacls).length) {
        if ($(areacls).hasClass(activeCls)) {
          $button.trigger('click');
        }
      }
    });
  };

  var setMasonry = function() {
    if (!($('.masonry').length)) {
      return;
    }
    var $container = $('.masonry');
    $container.masonry({
      itemSelector: '.col',
      columnWidth: '.columnSizer',
      gutter: '.columnGutter',
      percentPosition: true
    });
    $container.infinitescroll({
      navSelector  : '.navigation',
      nextSelector : '.navigation a',
      itemSelector : '.col',
      contentSelector : '.column',
      dataType: 'php',
      loading: {
        msgText: '<div class="loading"><i class="fa fa-spinner" aria-hidden="true"></i></div>',
        finishedMsg: '',
        selector: '.main',
        speed: 1
      }
    },
    function( newElements ) {
      var $newElems = $( newElements );
      $container.masonry( 'appended', $newElems, true );
    });
  };

  var setAnchor = function(offset) {
    var offset = offset || 0;
    var trg,trgpos;
    $('a[href^="#"]').each(function() {
      $(this).on('click',function(e) {
        e.preventDefault();
        trg = $(this).attr('href');
        trgpos = trg != '#pagetop' && $(trg).offset().top;

        if (trg == '#pagetop') { $('html,body').animate({scrollTop: 0}, 500); }
        $('html,body').animate({scrollTop: (trgpos - offset - 113)}, 500);
      });
    });
  };

}(local.common = local.common || {}));

local.common.init();
local.common.resize();
