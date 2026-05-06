document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workCards = document.querySelectorAll('.work-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      // Filter cards
      workCards.forEach(card => {
        if (filter === 'all' || card.dataset.pillar === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  const viewBtns = document.querySelectorAll('.view-btn');
  const workGridInner = document.querySelector('.work-grid-inner');

  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      viewBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (btn.dataset.view === 'grid') {
        workGridInner.classList.add('is-grid');
      } else {
        workGridInner.classList.remove('is-grid');
      }
    });
  });
});
