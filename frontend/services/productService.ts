import { api } from './api';
import type { Product } from './types';

/**
 * Fetch a list of products from the backend.  An optional search
 * parameter may be provided to filter results server-side.
 *
 * @param params Optional search query used by the API (e.g. { search: 'veg' }).
 */
export async function getProducts(params?: { search?: string }): Promise<Product[]> {
  const { data } = await api.get<Product[]>('/products', { params });
  return data;
}

/**
 * Fetch a single product by its identifier.  Returns the product if
 * found or throws if not found.  Use try/catch in the caller to
 * gracefully handle 404 responses.
 */
export async function getProductById(id: string): Promise<Product> {
  const { data } = await api.get<Product>(`/products/${id}`);
  return data;
}

/**
 * Create a new product using JSON payload.  Only available to
 * administrators or vendors.  Returns the created product.
 */
export async function createProductJson(payload: Partial<Product>): Promise<Product> {
  const { data } = await api.post<Product>('/products', payload);
  return data;
}

/**
 * Create a new product using multipart form data (e.g. when uploading
 * images).  Only available to administrators or vendors.  Returns
 * the created product.
 */
export async function createProductForm(form: FormData): Promise<Product> {
  const { data } = await api.post<Product>('/products', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

/**
 * Update an existing product with a JSON payload.  Only available
 * to administrators or vendors.  Returns the updated product.
 */
export async function updateProductJson(id: string, payload: Partial<Product>): Promise<Product> {
  const { data } = await api.put<Product>(`/products/${id}`, payload);
  return data;
}

/**
 * Update an existing product via multipart form data (e.g. for
 * replacing images).  Returns the updated product.
 */
export async function updateProductForm(id: string, form: FormData): Promise<Product> {
  const { data } = await api.put<Product>(`/products/${id}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

/**
 * Delete a product by its identifier.  Returns a success flag.
 */
export async function deleteProduct(id: string): Promise<{ success: boolean }> {
  const { data } = await api.delete<{ success: boolean }>(`/products/${id}`);
  return data;
}