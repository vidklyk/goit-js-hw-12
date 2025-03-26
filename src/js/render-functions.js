import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

export const createGalleryCardTemplate = imgInfo => {
  return `
    <li class="gallery-card">
      <a href="${imgInfo.largeImageURL}" target="_blank">
        <img src="${imgInfo.webformatURL}" alt="${imgInfo.tags}" class="gallery-img" />
      </a>
      <div class="info">
        <p><b>Likes</b> ${imgInfo.likes}</p>
        <p><b>Views</b> ${imgInfo.views}</p>
        <p><b>Comments</b> ${imgInfo.comments}</p>
        <p><b>Downloads</b> ${imgInfo.downloads}</p>
      </div>
    </li>`;
};

export const initializeLightbox = () => {
  return new SimpleLightbox('.gallery a', {
    captions: true,
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
    scrollZoom: false,
  });
};
