import { fetchImages } from './js/pixabay-api';
import {
  createGalleryCardTemplate,
  initializeLightbox,
  clearGallery,
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

const onSearchFormSubmit = async event => {
  event.preventDefault();
  showLoader();

  searchQuery = event.currentTarget.elements.search_text.value.trim();

  if (!searchQuery) {
    iziToast.show({
      color: 'red',
      message: 'Please enter a search query!',
    });
    hideLoader();
    return;
  }

  event.currentTarget.elements.search_text.value = '';
  page = 1;
  clearGallery();

  try {
    const response = await fetchImages(searchQuery, page);

    if (!response.hits.length) {
      iziToast.show({
        color: 'red',
        message: 'No images found. Try a different search!',
      });
      hideLoader();
      return;
    }

    galleryEl.innerHTML = response.hits.map(createGalleryCardTemplate).join('');
    moreBtnEl.classList.toggle('is-hidden', response.hits.length < 15);

    if (!lightbox) {
      lightbox = initializeLightbox();
    } else {
      lightbox.refresh();
    }
  } catch (error) {
    iziToast.show({
      color: 'red',
      message: 'Error loading images. Please try again later.',
    });
  } finally {
    hideLoader();
  }
};

const loadMoreBtnClick = async () => {
  try {
    page++;
    const response = await fetchImages(searchQuery, page);

    if (!response.hits.length) {
      iziToast.show({
        color: 'yellow',
        message: 'No more images to load!',
      });
      moreBtnEl.classList.add('is-hidden');
      return;
    }

    galleryEl.insertAdjacentHTML(
      'beforeend',
      response.hits.map(createGalleryCardTemplate).join('')
    );
    lightbox.refresh();

    const firstCard = document.querySelector('.gallery-card');
    if (firstCard) {
      window.scrollBy({
        top: firstCard.getBoundingClientRect().height * 4,
        behavior: 'smooth',
      });
    }
  } catch (error) {
    console.error(error);
  }
};

searchFormEl.addEventListener('submit', onSearchFormSubmit);
moreBtnEl.addEventListener('click', loadMoreBtnClick);
document.addEventListener('DOMContentLoaded', hideLoader);
