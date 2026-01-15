(function ($, Drupal) {
  Drupal.behaviors.threeCardGridCommissie = {
    attach: function (context, settings) {

      const containerSelector = '#block-dxpr-acd-views-block-activiteiten-block-3 .view-content';
      const $container = $(containerSelector, context);
      if (!$container.length) return;

      // --- PART 1: Fix Dates (Kept original logic) ---
      $container.find('time.datetime').parent().not('.js-date-processed').each(function () {
        $(this).addClass('js-date-processed');
        const $times = $(this).find('time.datetime');
        if ($times.length >= 2) {
          const startIso = $times.eq(0).attr('datetime');
          const endIso = $times.eq(1).attr('datetime');
          if (startIso && endIso && startIso.slice(0, 10) === endIso.slice(0, 10)) {
            const timeMatch = $times.eq(1).text().trim().match(/(\d{1,2}:\d{2})$/);
            if (timeMatch) $times.eq(1).text(timeMatch[0]);
          }
        }
      });

      // --- PART 2: Build Responsive Grid ---
      if (!$container.data('original-cards')) {
        // Grab all cards inside the container, even if nested
        const $cards = $container.find('.card').clone();
        $container.data('original-cards', $cards);
      }

      const allCards = $container.data('original-cards');

      function rebuildGrid() {
        $container.empty(); // remove all children

        const windowWidth = $(window).width();
        const isMobile = windowWidth < 768; // Standard Bootstrap breakpoint

        // Define styles based on screen size
        // Mobile: 100% width. Desktop: ~32% width.
        const colWidth = isMobile ? '100%' : '32%';
        
        // Add row with flex-wrap so items wrap to the next line naturally
        const $row = $('<div class="row" style="display:flex; flex-wrap:wrap; justify-content:flex-start;"></div>');

        allCards.each(function () {
          // Add margin-bottom on mobile so stacked cards don't touch
          const marginBottom = isMobile ? '20px' : '0';
          
          const $col = $(`<div class="col" style="flex:0 0 ${colWidth}; max-width:${colWidth}; display:flex; justify-content:center; margin-bottom:${marginBottom};"></div>`);
          
          $col.append($(this).clone());
          $row.append($col);
        });

        // Fill empty columns to make 3 (ONLY ON DESKTOP)
        // We don't need filler columns on mobile since it's a single column layout
        if (!isMobile) {
          const remainder = 3 - allCards.length % 3;
          if (remainder > 0 && remainder < 3) {
            for (let i = 0; i < remainder; i++) {
              const $emptyCol = $('<div class="col" style="flex:0 0 32%; max-width:32%;"></div>');
              $row.append($emptyCol);
            }
          }
        }

        $container.append($row);
      }

      // Initial Build
      rebuildGrid();

      // --- PART 3: Responsive rebuild ---
      let resizeTimer;
      $(window).on('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(rebuildGrid, 250);
      });
    }
  };
})(jQuery, Drupal);