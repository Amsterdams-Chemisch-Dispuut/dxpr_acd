(function ($, Drupal) {
  Drupal.behaviors.responsiveSponsorsCarousel = {
    attach: function (context, settings) {

      // 1. Target the Sponsors Block ID
      const carouselId = '#views-bootstrap-sponsors-block-1';
      const $carousel = $(carouselId, context);

      // Safety check: exit if block doesn't exist
      if ($carousel.length === 0) return;

      // 2. Capture original logo items (looking for col-md-3)
      if (!$carousel.data('original-sponsors')) {
        const $items = $carousel.find('.carousel-inner .col-md-3').clone();
        $carousel.data('original-sponsors', $items);
      }
      
      const allSponsors = $carousel.data('original-sponsors');

      function rebuildSponsors() {
        const windowWidth = $(window).width();
        const carouselInner = $carousel.find('.carousel-inner');
        
        // 3. Logic:
        // < 768px (Mobile)  = 1 logo per slide
        // >= 768px (Tablet) = 2 logos per slide (Optional, smoother transition)
        // >= 992px (Desktop)= 4 logos per slide (Matches your col-md-3)
        let itemsPerSlide = 4;
        
        if (windowWidth < 768) {
          itemsPerSlide = 1;
        } else if (windowWidth < 992) {
          itemsPerSlide = 2; 
        }

        carouselInner.empty();

        // 4. Chunk and Rebuild HTML
        for (let i = 0; i < allSponsors.length; i += itemsPerSlide) {
          const chunk = allSponsors.slice(i, i + itemsPerSlide);
          
          const isActive = (i === 0) ? 'active' : '';
          
          // Added 'align-items-center' to vertically center logos of different heights
          let slideHtml = `<div class="carousel-item ${isActive}"><div class="row align-items-center justify-content-center">`;

          chunk.each(function() {
            // We clone the item
            let item = $(this).clone();
            
            // Optional: Ensure logos are centered inside their grid column
            item.addClass('d-flex justify-content-center text-center'); 
            
            slideHtml += item.prop('outerHTML');
          });

          slideHtml += `</div></div>`;
          carouselInner.append(slideHtml);
        }
      }

      // 5. Run on load and resize
      rebuildSponsors();

      let resizeTimer;
      $(window).on('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(rebuildSponsors, 250);
      });
    }
  };
})(jQuery, Drupal);