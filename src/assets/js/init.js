$(function(){

  FixedHeader();
  // Tooltip
  $('[data-toggle="tooltip"]').tooltip();

});



$(window).on('load',function(){

  /*var swiper = new Swiper('.home-banner .swiper-container', {
        pagination: '.home-banner .swiper-pagination',
        paginationClickable: true,
        freeMode: false
    });*/



  var swiper = new Swiper('.home-gallery-section .swiper-container', {
        paginationHide:true,
        slidesPerView: 4,
        slidesPerColumn: 2,
        spaceBetween: 10,
        nextButton: '.home-gallery-section .swiper-button-next',
        prevButton: '.home-gallery-section .swiper-button-prev',
          // Responsive breakpoints
        breakpoints: {
          // when window width is <= 480px
          480: {
           slidesPerView: 1
          },

          991: {
           slidesPerView: 2
          },

          1199: {
           slidesPerView: 3
          }
        }

  });

  /*$('#lightgallery').lightGallery({
    autoplay: false,
    mode: 'lg-slide', 
    share:false,
    addClass:'homeGallery',
  });*/
  // WOW
  wow = new WOW({
        boxClass: 'wow',
        animateClass: 'animated',
        offset: 0,
        mobile: false,
        live: true
  })
  wow.init();
	setTimeout(function(){
    //$('.navbar-brand').css('display','block');
    $('.navbar-brand').fadeIn();
    //letterAnimation();
    
    setTimeout(function(){
      $('.navbar-brand').addClass('logo-icon');
    },1000);
  },500);

  if($(window).width() > 1024){
    /*$('.scroll-inner').mCustomScrollbar({
      axis:'x',
      theme:'3d-thick',
      scrollButtons:{
        enable:true,
        scrollType:'stepped'
      },
      keyboard:{
        scrollType:'stepped'
      },
      mouseWheel:{
        scrollAmount:370,
        normalizeDelta:true
      },
      autoExpandScrollbar:true,
      advanced:{
        autoExpandHorizontalScroll:true
      },
      snapAmount:370
      //scrollbarPosition:'outside'
    });*/
  }
  // City list scroll
  /*$('.attr-list').mCustomScrollbar({
    theme:'dark-thin',
    scrollbarPosition:'outside'
  });

  // price blocks scroll
  $('.price-blocks').mCustomScrollbar({
    theme:'dark-thin',
    scrollbarPosition:'outside'
  });*/


});

// Header Fixing
function FixedHeader() {
  $(window).scroll(function () {
        var top_offset = $(window).scrollTop();
        if (top_offset == 0) {
            $('.site-header').removeClass('fixed-top');
            $('body').removeClass('fxd_h');
        } else {
            $('.site-header').addClass('fixed-top');
            $('body').addClass('fxd_h');
        }
    })
}


$(document).ready(function(){
      $('.topSearch-link').on('click', function(e){
        e.stopPropagation();
        $('.topSearch-box').slideToggle();
      });
$('.topSearch-box').on('click', function(e){
  e.stopPropagation();
});

    $(document).on('click', function(){
      $('.topSearch-box').slideUp();
    });





   });

/*home-banner*/


    

     


$(document).ready(function() {

/*    var el = document.getElementById('#lightgallery');
    lightGallery(el, {
        loop: true,
        fourceAutoply: false,
        autoplay: false,
        thumbnail: false,
        pager: $(window).width() >= 768 ? true : false,
        speed: 400,
        scale: 1,
        keypress: true,
        mode: 'lg-slide',
        cssEasing: 'cubic-bezier(0.25, 0, 0.25, 1)'
    });*/

/*    if($(window).width() < 1025){
      $(document).on('click', '.list-filter-fxd h3', function(){
        $('.list-filter-fxd').toggleClass('visible-filter');
      });
      $(document).on('click', '.summery-box .sum-header', function(){
        $('.list-right').toggleClass('visible-summery');
      });
      $(document).on('click', '.listing-block .city-attract h4', function(){
        $(this).toggleClass('exp-txt');
        $(this).closest('.city-attract').toggleClass('expand-attr');
      });
    }*/


  });

$(document).ready(function() {

  $('.video-play-btn').on('click', function(){
     $('.fullWd-video-content').fadeOut(600);
     $('.fullWd-video-wrapper').fadeIn(700);
  })
 $('.fullWd-video-wrapper .video-close').on('click', function(){
     $('.fullWd-video-wrapper').fadeOut(600);
     $('.fullWd-video-content').fadeIn(700);
  })

});


var wWidth = '';
$(document).ready(function () {
  wWidth = $(window).width();
});

  
$(document).ready(function() {
  $('.add-city-drop input').on('focusin', function(event) {
/*  if(navigator.userAgent.indexOf('Android') > -1 && ...){
   var scroll = $(this).offset();
   window.scrollTo(0, scroll);
 }*/
 $('.list-filter-fxd').css('top','-130px;');
});
});



  









