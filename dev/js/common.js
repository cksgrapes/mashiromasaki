'use strict';

var local = local || {}, is_mobile;

local.$body = $('body');
local.$window = $(window);

(function(common){
  common.init = function() {
    setWindowWidth();
    setMenuScroll();
    setToggleMenu();
    // setMasonry();
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

  var setToggleMenu = function() {
    var $button = $('.toggleButton');
    $button.on('click', function(){
      var $this = $(this),
          $area = $this.parent();
      if($area.hasClass('active')) {
        $area.removeClass('active');
      } else {
        $area.addClass('active');
      }
    });
    $(document).on('click', function(event) {
      if (!$(event.target).closest('.toggleArea').length) {
        if ($('.toggleArea').hasClass('active')) {
          $button.trigger('click');
        }
      }
    });
  };

  var setMasonry = function() {
    $('.column').masonry({
      // set itemSelector so .grid-sizer is not used in layout
      itemSelector: '.col',
      // use element for option
      columnWidth: '.columnSizer',
      gutter: '.columnGutter',
      percentPosition: true
    })
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
