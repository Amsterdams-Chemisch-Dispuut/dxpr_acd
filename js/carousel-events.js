(function ($, Drupal) {
  Drupal.behaviors.responsiveActiviteitenCarousel = {
    attach: function (context, settings) {
      
      const carouselId = '#views-bootstrap-activiteiten-block-2';
      const $carousel = $(carouselId, context);

      if ($carousel.length === 0) return;

      // --- PART 1: FIX DATES (Universal Fix) ---
      // Instead of .once(), we filter elements that don't have our custom class yet.
      $carousel.find('time.datetime').parent().not('.js-date-processed').each(function() {
        
        // Mark this element as processed so we don't do it again
        $(this).addClass('js-date-processed');

        const $times = $(this).find('time.datetime');
        
        // Check if we have Start AND End time
        if ($times.length >= 2) {
          const $startTime = $times.eq(0);
          const $endTime = $times.eq(1);

          const startIso = $startTime.attr('datetime'); // e.g., 2026-01-05T12:00:00Z
          const endIso = $endTime.attr('datetime');     // e.g., 2026-01-05T13:00:00Z

          // 1. Check if both attributes exist
          // 2. Check if they are on the same day (first 10 chars: YYYY-MM-DD)
          if (startIso && endIso && startIso.slice(0, 10) === endIso.slice(0, 10)) {
            
            const originalText = $endTime.text().trim(); 
            // Regex: Find the time (HH:MM) at the end of the string
            const timeMatch = originalText.match(/(\d{1,2}:\d{2})$/);

            if (timeMatch) {
              // Replace the whole text (e.g. "ma 5 jan 2026 13:00") with just "13:00"
              $endTime.text(timeMatch[0]); 
            }
          }
        }
      });

      // --- PART 2: RESPONSIVE CHUNKING ---
      
      // We only want to capture the "original items" ONCE.
      // We check if data exists; if not, we create it.
      if (!$carousel.data('original-items')) {
        // Clone the col-md-4 items. Now they include the fixed dates from Part 1.
        const $items = $carousel.find('.carousel-inner .col-md-4').clone();
        $carousel.data('original-items', $items);
      }
      
      const allItems = $carousel.data('original-items');

      function rebuildCarousel() {
        const windowWidth = $(window).width();
        const carouselInner = $carousel.find('.carousel-inner');
        
        // Logic: 1 item on mobile (<768px), 3 items on desktop
        const itemsPerSlide = windowWidth < 768 ? 1 : 3;

        // Clear current HTML
        carouselInner.empty();

        // Loop through our stored items and chunk them
        for (let i = 0; i < allItems.length; i += itemsPerSlide) {
          const chunk = allItems.slice(i, i + itemsPerSlide);
          const isActive = (i === 0) ? 'active' : '';
          
          let slideHtml = `<div class="carousel-item ${isActive}"><div class="row justify-content-center">`;

          chunk.each(function() {
            // Append the item (which includes the fixed date)
            slideHtml += $(this).prop('outerHTML');
          });

          slideHtml += `</div></div>`;
          carouselInner.append(slideHtml);
        }
      }

      // Initial Build
      rebuildCarousel();

      // Debounce Resize Event (prevents browser lag)
      let resizeTimer;
      $(window).on('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(rebuildCarousel, 250);
      });
    }
  };
})(jQuery, Drupal);