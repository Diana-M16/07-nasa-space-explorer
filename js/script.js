// Find our date picker inputs and button on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const getImagesBtn = document.getElementById('getImagesBtn');
const gallery = document.getElementById('gallery');
const loadingMessage = document.getElementById('loadingMessage');

// Get modal elements
const imageModal = document.getElementById('imageModal');
const modalClose = document.querySelector('.modal-close');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalExplanation = document.getElementById('modalExplanation');

// Array of fun space facts for the "Did You Know?" section
const spaceFacts = [
  'Did you know? A day on Venus is longer than a year on Venus! It takes 243 Earth days to rotate once, but only 225 days to orbit the Sun.',
  'Did you know? There are more stars in the universe than grains of sand on all Earth\'s beaches and deserts combined!',
  'Did you know? A neutron star is so dense that a teaspoon of its material would weigh about 6 billion tons on Earth.',
  'Did you know? The Sun is so large that about 1.3 million Earths could fit inside it.',
  'Did you know? Light from the Sun takes 8 minutes and 20 seconds to reach Earth.',
  'Did you know? Mars has the largest volcano in the solar system—Olympus Mons, which is about 16 miles (25 km) high.',
  'Did you know? Saturn\'s rings are made mostly of ice and rock, ranging from tiny particles to house-sized chunks.',
  'Did you know? Jupiter\'s Great Red Spot is a storm larger than Earth that has been raging for at least 350 years!',
  'Did you know? The Andromeda Galaxy is heading toward our Milky Way and will eventually collide with it in about 4.5 billion years.',
  'Did you know? One AU (Astronomical Unit) is the distance from Earth to the Sun—about 93 million miles.',
  'Did you know? Black holes are regions where gravity is so strong that nothing, not even light, can escape.',
  'Did you know? The International Space Station orbits Earth every 90 minutes, traveling at about 17,500 mph.',
  'Did you know? Mercury is the smallest planet in our solar system and the closest to the Sun.',
  'Did you know? Uranus rotates on its side—its axis is tilted 98 degrees compared to its orbit.',
  'Did you know? The Hubble Space Telescope has captured images of galaxies over 13 billion light-years away.'
];

// Function to display a random space fact
function displayRandomSpaceFact() {
  const spaceFactText = document.getElementById('spaceFactText');
  const randomIndex = Math.floor(Math.random() * spaceFacts.length);
  spaceFactText.textContent = spaceFacts[randomIndex];
}

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// Display a random space fact when the page loads
displayRandomSpaceFact();

// Handle "Get Space Images" button click
getImagesBtn.addEventListener('click', async () => {
  const startDate = startInput.value;
  const endDate = endInput.value;

  // Validate that both dates are selected
  if (!startDate || !endDate) {
    alert('Please select both a start date and an end date.');
    return;
  }

  // Show loading state
  getImagesBtn.disabled = true;
  getImagesBtn.textContent = 'Loading...';
  loadingMessage.style.display = 'flex'; // Show loading message

  try {
    // Call our backend API to fetch APOD data securely
    // The backend uses the NASA API key from the .env file
    const response = await fetch(`/api/apod?startDate=${startDate}&endDate=${endDate}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch images: ${response.statusText}`);
    }

    const apodData = await response.json();

    // Clear the gallery and populate it with the new images
    displayGallery(apodData);
  } catch (error) {
    console.error('Error fetching APOD data:', error);
    loadingMessage.style.display = 'none'; // Hide loading message on error
    gallery.innerHTML = '<div class="placeholder"><p>Error loading images. Please try again.</p></div>';
  } finally {
    // Restore button state
    getImagesBtn.disabled = false;
    getImagesBtn.textContent = 'Get Space Images';
  }
});

// Function to display APOD items in the gallery
function displayGallery(apodData) {
  // Hide the loading message
  loadingMessage.style.display = 'none';

  // Clear the gallery
  gallery.innerHTML = '';

  // Handle single item or array of items from the API
  const items = Array.isArray(apodData) ? apodData : [apodData];

  // Create gallery items for each APOD entry
  items.forEach((item) => {
    // Only display items that have images (skip video-only items without thumbnails)
    if (item.media_type === 'image' || (item.media_type === 'video' && item.thumbnail_url)) {
      const galleryItem = document.createElement('div');
      galleryItem.className = 'gallery-item';

      // Use thumbnail for videos, full image for images
      const imageUrl = item.media_type === 'video' ? item.thumbnail_url : item.url;
      const imageAlt = item.title || 'NASA Space Image';

      // Build the HTML for each gallery item
      galleryItem.innerHTML = `
        <img src="${imageUrl}" alt="${imageAlt}" />
        <div>
          <h3>${item.title || 'Untitled'}</h3>
          <p><strong>Date:</strong> ${item.date}</p>
          <p>${item.explanation ? item.explanation.substring(0, 150) + '...' : 'No description available'}</p>
        </div>
      `;

      // Make the gallery item clickable to open modal
      galleryItem.addEventListener('click', () => {
        openModal(item);
      });

      gallery.appendChild(galleryItem);
    }
  });

  // If no images were found, show a message
  if (gallery.innerHTML === '') {
    gallery.innerHTML = '<div class="placeholder"><p>No images found for this date range.</p></div>';
  }
}

// Function to open the modal with APOD item details
function openModal(apodItem) {
  // Use the full image URL for modal (not thumbnail)
  const fullImageUrl = apodItem.media_type === 'video' ? apodItem.thumbnail_url : apodItem.url;

  // Populate modal with item data
  modalImage.src = fullImageUrl;
  modalImage.alt = apodItem.title || 'NASA Space Image';
  modalTitle.textContent = apodItem.title || 'Untitled';
  modalDate.innerHTML = `<strong>Date:</strong> ${apodItem.date}`;
  modalExplanation.textContent = apodItem.explanation || 'No description available.';

  // Show the modal
  imageModal.classList.add('active');

  // Prevent body scroll when modal is open
  document.body.style.overflow = 'hidden';
}

// Function to close the modal
function closeModal() {
  imageModal.classList.remove('active');

  // Restore body scroll
  document.body.style.overflow = 'auto';
}

// Close modal when close button is clicked
modalClose.addEventListener('click', closeModal);

// Close modal when clicking outside the modal content
imageModal.addEventListener('click', (e) => {
  // Only close if clicking on the modal overlay itself (not the modal-content)
  if (e.target === imageModal) {
    closeModal();
  }
});

// Close modal when Escape key is pressed
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && imageModal.classList.contains('active')) {
    closeModal();
  }
});

