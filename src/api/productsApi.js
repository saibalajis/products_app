const PRODUCTS_API_URL = 'https://dummyjson.com/products';

export async function getProducts() {
  const response = await fetch(PRODUCTS_API_URL);

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data.products;
}