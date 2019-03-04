$(document).ready(function() {
  /* SCROLL */
  var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome/') > -1;
  var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox/') > -1;
  var is_safari = navigator.userAgent.toLowerCase().indexOf('safari/') > -1;
  var is_opera = navigator.userAgent.toLowerCase().indexOf('opera/') > -1;
  var is_ie = navigator.userAgent.toLowerCase().indexOf('msie') > -1;
  var isMobile = {
    Android: function() {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
      return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
      return (
        isMobile.Android() ||
        isMobile.BlackBerry() ||
        isMobile.iOS() ||
        isMobile.Opera() ||
        isMobile.Windows()
      );
    }
  };
  if (isMobile.any()) {
  } else {
    $('html').niceScroll({
      touchbehavior: true,
      cursorcolor: '#b32f2f',
      cursoropacitymax: 16,
      cursorborder: '0px dashed #ffffff',
      cursorwidth: 20,
      cursorborderradius: '8px',
      background: '#ffffff',
      zindex: 9999,
      autohidemode: false
    });
    switch (true) {
      case is_chrome:
        break;
      case is_firefox:
        break;
      case is_safari:
        break;
      case is_opera:
        break;
      default:
        $('body').addClass('iexplorer');
        break;
    }
  }
});
var acc = document.getElementsByClassName('accordion');
var panel = document.getElementsByClassName('panel');
var i;

// for (i = 0; i < acc.length; i++) {
//   acc[i].addEventListener('click', function() {
//     this.classList.toggle('active');
//     var panel = this.nextElementSibling;
//     if (panel.style.display === 'block') {
//       panel.style.display = 'none';
//     } else {
//       panel.style.display = 'block';
//     }

//   });
// }

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener('click', toggleItem, false);
}
activeToggleInit();

function toggleItem() {
  // acc[i].className = 'accordion';
  // this.classList.toggle('active');
  var panelActive = this.nextElementSibling;
  console.log(panelActive);
  if (panelActive.style.maxHeight) {
    // panelActive.style.display = 'none';
    panelActive.style.maxHeight = null;
    this.classList.remove('active');
  } else {
    this.classList.add('active');
    // panelActive.style.display = 'block';
    panelActive.style.maxHeight = panelActive.scrollHeight + 'px';
  }
}

function activeToggleInit() {
  for (i = 0; i < panel.length; i++) {
    active = panel[i];
    if (active.className === 'panel active') {
      active.style.maxHeight = active.scrollHeight + 'px';
    }
  }
}

for (var i = 0; i < document.links.length; i++) {
  if (document.links[i].href == document.URL) {
    document.links[i].className = 'active';
  }
}
