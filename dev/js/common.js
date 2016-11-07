'use strict';

var ETHER = ETHER || {
    d       : document,
    w       : window,
    $window : $(window),
    $body   : $('body')
  };

(function(common){
  common.init = function() {
    setMasonry();
    // setAnchor();
    setToggleMenu();
    setChangeFontSize();
    setTypesetting();
  };

  common.resize = function() {
    ETHER.$window.on('load resize', function(){
      setIsMobile();
      setMenuScroll();
    });
  };

  common.scroll = function() {
    ETHER.$window.on('scroll', function(){
      ETHER.scroll = ETHER.$window.scrollTop();
    });
  };

  var setIsMobile = function() {
    var width = ETHER.w.innerWidth;
    ETHER.isMobile = (width < 768) ? true : false;
  };


  var setMenuScroll = function() {
    $('.toggleContents').perfectScrollbar();
  };

  var setToggleMenu = function() {
    var button = ETHER.d.getElementsByClassName('js-toggleMenu'),
        activeCls = 'active',
        area,
        $area;
    button.len = button.length;

    var init = function() {
      for (var i = 0; i < button.len; i++) {
        button[i].addEventListener('click', toggleClass, false);
      }
      ETHER.d.addEventListener('click', toggleOpenClose, false);
    };

    var toggleClass = function() {
      area       = this.parentNode;
      $area      = $(area);
      area.class = area.classList;
      if (area.class.contains(activeCls)) {
        $(area).removeClass(activeCls);
      } else {
        $(area).addClass(activeCls);
      }
    };

    var toggleOpenClose = function() {
      if ($(event.target).closest(area).length < 1) {
        for (var i = 0; i < button.len; i++) {
          if (button[i].parentNode.classList.contains('active')) {
            $(button[i]).trigger('click');
          }
        }
      }
    };

    init();
  };

  var setChangeFontSize = function() {
    var button  = ETHER.d.getElementsByClassName('js-changeFontSize'),
        panelID = button[0].getAttribute('href'),
        panel   = ETHER.d.getElementById(panelID.substr(1)),
        $panel = $(panel);
    button[0].addEventListener('click', function(e){
      e.preventDefault();
      if (panel.classList.contains('active')) {
        $panel.removeClass('active');
      } else {
        $panel.addClass('active');
      }
    }, false);

    ETHER.d.addEventListener('click', function(){
      if ($(event.target).closest(panel).length < 1) {
        $(button[0]).trigger('click');
      }
    }, false)
  };

  var setTypesetting = function() {
    var work  = ETHER.d.getElementsByClassName('work'),
        $p    = $(work[0]).find('.work_content>p'),
        len   = $p.length,
        match;
    if (work.length < 1) {
      return;
    }
    for (var i = 0; i < len; i++) {
      match = $p[i].innerHTML.match(/[「（]/);
      if (match !== null && match.index === 0) {
        $($p[i]).addClass('noIndent');
      }
    }
  };

  var setMasonry = function() {
    var container = ETHER.d.getElementsByClassName('masonry');
    if (container.length < 1) {
      return;
    }
    var $container = $(container);
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
    var offset = offset || 0,
        trg,
        trgpos;
    $('a[href^="#"]').each(function() {
      $(this).on('click',function(e) {
        e.preventDefault();
        trg = $(this).attr('href');
        console.log($(trg).offset().top);
        trgpos = trg != '#pagetop' && $(trg).offset().top;

        if (trg == '#pagetop') { $('html,body').animate({scrollTop: 0}, 500); }
        $('html,body').animate({scrollTop: (trgpos - offset - 113)}, 500);
      });
    });
  };

})(ETHER.common = ETHER.common || {});

ETHER.common.init();
ETHER.common.resize();
ETHER.common.scroll();


