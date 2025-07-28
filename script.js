document.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.getElementById('search-btn');
  const searchInput = document.getElementById('search-input');
  const booksContainer = document.getElementById('books-container');
  const loadingSpinner = document.getElementById('loading-spinner');

  fetchPopularBooks();

  searchBtn.addEventListener('click', performSearch);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
  });

  async function fetchPopularBooks() {
    try {
      showLoading(true);
      const response = await fetch('https://openlibrary.org/search.json?q=subject:fiction&limit=12');
      const data = await response.json();
      displayBooks(data.docs || []);
    } catch (error) {
      console.error('Error fetching books:', error);
      showError('Failed to load books. Please try again.');
    } finally {
      showLoading(false);
    }
  }

  async function performSearch() {
    const query = searchInput.value.trim();
    if (!query) return;

    try {
      showLoading(true);
      const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=12`);
      const data = await response.json();
      displayBooks(data.docs || []);
    } catch (error) {
      console.error('Error searching books:', error);
      showError('Failed to search books. Please try again.');
    } finally {
      showLoading(false);
    }
  }

  function displayBooks(books) {
    booksContainer.innerHTML = '';

    if (books.length === 0) {
      booksContainer.innerHTML = `
        <div class="no-results">
          <i class="fas fa-book-open fa-3x"></i>
          <h3>No books found</h3>
          <p>Try a different search term</p>
        </div>
      `;
      return;
    }

    books.forEach(book => {
      const bookCard = document.createElement('div');
      bookCard.className = 'book-card';

      const coverId = book.cover_i;
      const coverUrl = coverId
        ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
        : 'https://via.placeholder.com/120x160?text=No+Cover';

      const authorNames = book.author_name ? book.author_name.join(', ') : 'Unknown Author';
      const publishYear = book.first_publish_year || 'Unknown';
      const pageCount = book.number_of_pages_median || '';

      bookCard.innerHTML = `
        <img src="${coverUrl}" alt="${book.title}" class="book-cover" loading="lazy">
        <div class="book-info">
          <h3 class="book-title">${book.title}</h3>
          <p class="book-author">${authorNames}</p>
          <div class="book-meta">
            <span>${publishYear}</span>
            ${pageCount ? `<span>${pageCount} pages</span>` : ''}
          </div>
          <button class="details-btn">Details</button>
        </div>
      `;

      booksContainer.appendChild(bookCard);
    });
  }

  function showLoading(show) {
    if (show) {
      loadingSpinner.classList.remove('hidden');
    } else {
      loadingSpinner.classList.add('hidden');
    }
  }

  function showError(message) {
    booksContainer.innerHTML = `
      <div class="no-results">
        <i class="fas fa-exclamation-triangle fa-3x"></i>
        <h3>${message}</h3>
      </div>
    `;
  }
});
