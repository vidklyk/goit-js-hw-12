import { fetchImages } from './js/pixabay-api';
import {
  createGalleryCardTemplate,
  initializeLightbox,
} from './js/render-functions';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const searchFormEl = document.querySelector('.form');
const galleryEl = document.querySelector('.gallery');
const loaderEl = document.querySelector('.loader');
const moreBtnEl = document.querySelector('.more-btn');

let lightbox = null;
let searchQuery = '';
let page = 1;

function showLoader() {
  loaderEl.classList.remove('is-hidden');
}

function hideLoader() {
  loaderEl.classList.add('is-hidden');
}

function showMoreButton() {
  moreBtnEl.classList.remove('is-hidden');
}

function hideMoreButton() {
  moreBtnEl.classList.add('is-hidden');
}

function clearGallery() {
  galleryEl.innerHTML = '';
}

const onSearchFormSubmit = async event => {
  event.preventDefault();
  showLoader();
  hideMoreButton();

  searchQuery = event.currentTarget.elements.search_text.value.trim();
  event.currentTarget.elements.search_text.value = '';
  page = 1;

  if (!searchQuery) {
    hideLoader();
    iziToast.show({
      color: 'red',
      message: 'Please enter a search query.',
    });
    return;
  }

  try {
    const response = await fetchImages(searchQuery, page);

    if (!response.hits.length) {
      iziToast.show({
        color: 'red',
        message: 'Sorry, no images found. Try another search!',
      });
      hideLoader();
      return;
    }

    clearGallery();
    galleryEl.innerHTML = response.hits.map(createGalleryCardTemplate).join('');

    if (!lightbox) {
      lightbox = initializeLightbox();
    } else {
      lightbox.refresh();
    }

    hideLoader();

    if (response.hits.length < 15) {
      hideMoreButton();
    } else {
      showMoreButton();
    }
  } catch (error) {
    iziToast.show({
      color: 'red',
      message: 'Error loading images. Please try again later.',
    });
    console.error(error);
    hideLoader();
  }
};

const loadMoreBtnClick = async () => {
  page++;
  showLoader();
  hideMoreButton();

  try {
    const response = await fetchImages(searchQuery, page);

    if (!response.hits.length) {
      iziToast.show({
        color: 'red',
        message: 'You have reached the end of the collection.',
      });
      hideLoader();
      return;
    }

    galleryEl.insertAdjacentHTML(
      'beforeend',
      response.hits.map(createGalleryCardTemplate).join('')
    );

    if (lightbox) {
      lightbox.refresh();
    }

    const galleryCards = document.querySelectorAll('.gallery-card');
    if (galleryCards.length > 0) {
      const cardHeight = galleryCards[0].getBoundingClientRect().height;
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }

    hideLoader();

    if (response.hits.length < 15) {
      hideMoreButton();
    } else {
      showMoreButton();
    }
  } catch (error) {
    console.error(error);
    hideLoader();
  }
};

searchFormEl.addEventListener('submit', onSearchFormSubmit);
moreBtnEl.addEventListener('click', loadMoreBtnClick);
document.addEventListener('DOMContentLoaded', hideLoader);
