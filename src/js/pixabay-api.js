import axios from 'axios';

const myApiKey = '17309902-7cbadf7b99e6a7450a84508e7';

export async function fetchImages(searchedQuery, page = 1) {
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

  try {
    const response = await axios.get(BASE_URL, { params });
    return response.data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}
