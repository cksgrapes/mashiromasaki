'use strict';

var local = local || {}, is_mobile;

local.$body = $('body');
local.$window = $(window);

(function(common){
  common.init = function() {
    setWindowWidth();
    setMenuScroll();
    setMenuToggle();
    setAnchor();
    setCurrentLocation();
  };

  common.resize = function() {
    local.$window.on('load resize', function(){
      setWindowWidth();
      setMenuScroll();
      setTabChange();
    });
  }

  var setWindowWidth = function() {
    local.width = window.innerWidth;
    is_mobile   = (local.width < 768) ? true : false;
  };

  var setMenuScroll = function() {
    if (is_mobile) {
      $('.js-menuScroll').perfectScrollbar();
    } else {
      $('.js-menuScroll').perfectScrollbar('destroy');
    }
  };

  var setMenuToggle = function() {
    var cls = 'menuOpen';
    $('.js-menuButton').on('click', function(){
        if (local.$body.hasClass(cls)) {
          local.$body.removeClass(cls);
        } else {
          local.$body.addClass(cls);
        }
    });
  };

  var setTabChange = function() {
    var tab = $('.js-tabchange');
    if (tab.length <= 0) { return; }
    tab.each(function(){
      var btn = $(this).find('li'),
        content = $(this).next().find('.js-tabchange-content'),
        index;
      btn.on('click', function(){
          index = btn.index(this);
          content.hide().eq(index).show();
          btn.removeClass('current');
          $(this).addClass('current');
      });
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

  var setCurrentLocation = function () {
    var url  = location.pathname.split('/')[2],
        $nav = $('.headerMenu_toggleContents').find('.globalPages');
    $nav.find('a').each(function(){
      var link = $(this).attr('href');
      if ( link.indexOf(url) > 0 ) {
        $(this).parent().addClass('active');
      }
    });
  };

}(local.common = local.common || {}));

local.common.init();
local.common.resize();
