(function ($, Drupal) {
  Drupal.behaviors.responsiveActiviteitenCarousel = {
    attach: function (context, settings) {
      
      const carouselId = '#views-bootstrap-activiteiten-block-2';
      const $carousel = $(carouselId, context);

      if ($carousel.length === 0) return;

      // --- PART 1: FIX DATES (Universal Fix) ---
      $carousel.find('time.datetime').parent().not('.js-date-processed').each(function() {
        
        $(this).addClass('js-date-processed');
        const $times = $(this).find('time.datetime');
        
        if ($times.length >= 2) {
          const $startTime = $times.eq(0);
          const $endTime = $times.eq(1);

          const startIso = $startTime.attr('datetime');
          const endIso = $endTime.attr('datetime');

          if (startIso && endIso && startIso.slice(0, 10) === endIso.slice(0, 10)) {
            const originalText = $endTime.text().trim(); 
            const timeMatch = originalText.match(/(\d{1,2}:\d{2})$/);

            if (timeMatch) {
              $endTime.text(timeMatch[0]); 
            }
          }
        }
      });

      // --- PART 2: RESPONSIVE CHUNKING ---
      if (!$carousel.data('original-items')) {
        const $items = $carousel.find('.carousel-inner .col-md-4').clone();
        $carousel.data('original-items', $items);
      }
      
      const allItems = $carousel.data('original-items');

      function rebuildCarousel() {
        const windowWidth = $(window).width();
        const carouselInner = $carousel.find('.carousel-inner');
        
        const itemsPerSlide = windowWidth < 768 ? 1 : 3;

        carouselInner.empty();

        for (let i = 0; i < allItems.length; i += itemsPerSlide) {
          const chunk = allItems.slice(i, i + itemsPerSlide);
          const isActive = (i === 0) ? 'active' : '';
          
          let slideHtml = `<div class="carousel-item ${isActive}"><div class="row justify-content-start">`;

          chunk.each(function() {
            slideHtml += $(this).prop('outerHTML');
          });

          slideHtml += `</div></div>`;
          carouselInner.append(slideHtml);
        }
      }

      rebuildCarousel();

      let resizeTimer;
      $(window).on('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(rebuildCarousel, 250);
      });
    }
  };
})(jQuery, Drupal);