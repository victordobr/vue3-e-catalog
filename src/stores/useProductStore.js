import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios';
import { useCategoryStore } from "@/stores/useCategoryStore.js";
import { useBrandStore } from "@/stores/useBrandStore.js";
import { config } from '@/config.js';

axios.defaults.headers['content-type'] = 'application/json';
axios.defaults.headers['x-apikey'] = config.apiKey;

const BASE_URL = config.baseUrl + 'products';

export const useProductStore = defineStore('products', () => {
    const products = ref([]);
    const isLoading = ref(false);
    const message = ref({
        'value': null,
        'type': null,
    });

    async function fetchProducts () {
        if (localStorage.products && localStorage.expiryTime > (new Date()).getTime()) {
            this.products = JSON.parse(localStorage.products);
        } else {
            try {
                this.products = [];
                this.isLoading = true;
                const response = await axios.get(BASE_URL + '?sort=_id');
                if (response.status === 200) {
                    this.products = response.data;
                    // Setting category id and brand id to the product object
                    this.products.forEach((item) => {
                        item.categoryId = item.category.length ? item.category[0]._id : null;
                        item.brandId = item.brand.length ? item.brand[0]._id : null;
                    });
                    // Caching products using localStorage
                    localStorage.setItem("products", JSON.stringify(this.products));
                    localStorage.setItem("expiryTime", JSON.stringify((new Date()).getTime() + config.cacheTime));
                }
            } catch (error) {
                this.isLoading = false;
                this.message = {
                    'value': error.message,
                    'type': 'danger',
                };
            } finally {
                this.isLoading = false;
            }
        }
    }
    
    function beforeSaveProduct (product) {
        let prod = Object.assign({}, product);

        const categoryStore = useCategoryStore();
        prod.category = categoryStore.categories.find((item) => item._id == prod.categoryId);

        const brandStore = useBrandStore();
        prod.brand = (prod.brandId) ? brandStore.brands.find((item) => item._id == prod.brandId) : [];

        return prod;
    }

    async function createProduct (product) {
        const response = await axios.post(BASE_URL, JSON.stringify(beforeSaveProduct(product)));
        if (response.status === 201) {
            this.products.push(response.data);
            this.message = {
                'value': 'The product has been successfully created!',
                'type': 'success',
            };
            setTimeout(() => {
                this.message = {
                    'value': null,
                    'type': null,
                };
            }, config.messageTimeout);
        }
    }

    async function updateProduct (product) {
        const response = await axios.put(BASE_URL + "/" + product._id, JSON.stringify(beforeSaveProduct(product)));
        if (response.status === 200) {
            this.products[this.products.findIndex((item) => item._id === product._id)] = response.data;
            this.message = {
                'value': 'The product has been successfully updated!',
                'type': 'success',
            };
            setTimeout(() => {
                this.message = {
                    'value': null,
                    'type': null,
                };
            }, config.messageTimeout);
        }
    }

    async function deleteProduct (productId) {
        const response = await axios.delete(BASE_URL + "/" + productId);
        if (response.status === 200) {
            this.products.splice(this.products.findIndex((item) => item._id === productId), 1);
            this.message = {
                'value': 'The product has been successfully deleted!',
                'type': 'success',
            };
            setTimeout(() => {
                this.message = {
                    'value': null,
                    'type': null,
                };
            }, config.messageTimeout);
        }
    }

    return { products, isLoading, message, fetchProducts, createProduct, updateProduct, deleteProduct }
})