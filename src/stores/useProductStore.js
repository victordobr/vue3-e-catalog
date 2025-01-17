import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios';
import { useCategoryStore } from "@/stores/useCategoryStore.js";
import { useBrandStore } from "@/stores/useBrandStore.js";
import { config } from '@/config.js';

axios.defaults.headers['content-type'] = 'application/json';
axios.defaults.headers['x-apikey'] = config.apiKey;

const BASE_URL = config.baseUrl + 'products';

export const useProductStore = defineStore('products', () => {
    const store = reactive({
        products: [],
        isLoading: false,
        message: {
            'value': null,
            'type': null,
        }
    });

    async function fetchProducts () {
        if (localStorage.products && localStorage.expiryTime > (new Date()).getTime()) {
            store.products = JSON.parse(localStorage.products);
        } else {
            try {
                store.products = [];
                store.isLoading = true;
                const response = await axios.get(BASE_URL + '?sort=_id');
                if (response.status === 200) {
                    store.products = response.data;
                    // Setting category id and brand id to the product object
                    store.products.forEach((item) => {
                        item.categoryId = item.category.length ? item.category[0]._id : null;
                        item.brandId = item.brand.length ? item.brand[0]._id : null;
                    });
                    // Caching products using localStorage
                    localStorage.setItem("products", JSON.stringify(store.products));
                    localStorage.setItem("expiryTime", JSON.stringify((new Date()).getTime() + config.cacheTime));
                }
            } catch (error) {
                store.isLoading = false;
                store.message = {
                    'value': error.message,
                    'type': 'danger',
                };
            } finally {
                store.isLoading = false;
            }
        }
    }
    
    function beforeSaveProduct (product) {
        let prod = Object.assign({}, product);

        const categoryStore = useCategoryStore();
        prod.category = categoryStore.store.categories.find((item) => item._id == prod.categoryId);

        const brandStore = useBrandStore();
        prod.brand = (prod.brandId) ? brandStore.store.brands.find((item) => item._id == prod.brandId) : [];

        return prod;
    }

    async function createProduct (product) {
        const response = await axios.post(BASE_URL, JSON.stringify(beforeSaveProduct(product)));
        if (response.status === 201) {
            store.products.push(response.data);
            store.message = {
                'value': 'The product has been successfully created!',
                'type': 'success',
            };
            setTimeout(() => {
                store.message = {
                    'value': null,
                    'type': null,
                };
            }, config.messageTimeout);
        }
    }

    async function updateProduct (product) {
        const response = await axios.put(BASE_URL + "/" + product._id, JSON.stringify(beforeSaveProduct(product)));
        if (response.status === 200) {
            store.products[store.products.findIndex((item) => item._id === product._id)] = response.data;
            store.message = {
                'value': 'The product has been successfully updated!',
                'type': 'success',
            };
            setTimeout(() => {
                store.message = {
                    'value': null,
                    'type': null,
                };
            }, config.messageTimeout);
        }
    }

    async function deleteProduct (productId) {
        const response = await axios.delete(BASE_URL + "/" + productId);
        if (response.status === 200) {
            store.products.splice(store.products.findIndex((item) => item._id === productId), 1);
            store.message = {
                'value': 'The product has been successfully deleted!',
                'type': 'success',
            };
            setTimeout(() => {
                store.message = {
                    'value': null,
                    'type': null,
                };
            }, config.messageTimeout);
        }
    }

    return { store, fetchProducts, createProduct, updateProduct, deleteProduct }
})