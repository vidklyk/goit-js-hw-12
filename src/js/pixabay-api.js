import axios from 'axios';

const myApiKey = '17309902-7cbadf7b99e6a7450a84508e7';

export function fetchImages(searchedQuery, page = 1) {
  const BASE_URL = 'https://pixabay.com/api/';
  const params = {
    key: myApiKey,
    q: searchedQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page,
    per_page: 15,
  };

  return axios
    .get(BASE_URL, { params })
    .then(response => response.data)
    .catch(error => {
      console.error('Fetch error:', error);
      throw error;
    });
}
