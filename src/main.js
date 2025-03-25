import { fetchImages } from './js/pixabay-api';
import {
  createGalleryCardTemplate,
  initializeLightbox,
} from './js/render-functions';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const searchFormEl = document.querySelector('.form');
const galleryEl = document.querySelector('.gallery');
const loaderEl = document.querySelector('.loader.is-hidden');
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
  event.currentTarget.elements.search_text.value = '';
  page = 1;

  if (!searchQuery) {
    hideLoader();
    return;
  }

  try {
    const response = await fetchImages(searchQuery, page);
    console.log(response.hits);

    if (!response.hits.length) {
      iziToast.show({
        color: 'red',
        message: `Sorry, there are no images matching your search query. Please try again!`,
      });
      hideLoader();
      return;
    }

    galleryEl.innerHTML = response.hits.map(createGalleryCardTemplate).join('');

    if (response.hits.length < 15) {
      moreBtnEl.classList.add('is-hidden');
    } else {
      moreBtnEl.classList.remove('is-hidden');
    }

    if (!lightbox) {
      lightbox = initializeLightbox();
    } else {
      lightbox.refresh();
    }

    hideLoader();
  } catch (error) {
    iziToast.show({
      color: 'red',
      message: `Error loading images. Please try again later.`,
    });
    console.error(error);
    hideLoader();
  }
};

const loadMoreBtnClick = async () => {
  try {
    page++;

    const response = await fetchImages(searchQuery, page);

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
        top: cardHeight * 4,
        behavior: 'smooth',
      });
    }

    if (response.hits.length < 15) {
      moreBtnEl.classList.add('is-hidden');
    }
  } catch (error) {
    console.error(error);
  }
};

searchFormEl.addEventListener('submit', onSearchFormSubmit);
moreBtnEl.addEventListener('click', loadMoreBtnClick);
document.addEventListener('DOMContentLoaded', hideLoader);
