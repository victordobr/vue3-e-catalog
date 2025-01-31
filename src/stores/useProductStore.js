import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios';
import { useCategoryStore } from "@/stores/useCategoryStore.js";
import { useBrandStore } from "@/stores/useBrandStore.js";

axios.defaults.headers['content-type'] = 'application/json';
axios.defaults.headers['x-apikey'] = import.meta.env.VITE_API_KEY;

const BASE_URL = import.meta.env.VITE_API_URL + 'products';

export const useProductStore = defineStore('products', () => {
    const store = reactive({
        products: [],
        isLoading: false,
        message: {
            'value': null,
            'type': null,
        }
    });

    function setMessage(value, type, timeout = import.meta.env.VITE_MESSAGE_TIMEOUT) {
        store.message = { value, type };
        if (timeout) {
            setTimeout(() => {
                store.message = { value: null, type: null };
            }, timeout);
        }
    }

    async function handleRequest(method, url, data = null) {
        try {
            const config = { method, url };
            if (data !== null) config.data = data; // data = null if we use method delete

            const response = await axios(config);
            return response.data;
        } catch (error) {
            setMessage(error.message, 'danger');
            console.error(error);
            throw error;
        }
    }

    async function fetchProducts() {
        if (localStorage.getItem("products") && Number(localStorage.getItem("expiryTime")) > Date.now()) {
            store.products = JSON.parse(localStorage.getItem("products"));
        } else {
            localStorage.removeItem("products");
            localStorage.removeItem("expiryTime");

            try {
                store.products = [];
                store.isLoading = true;
                const data = await handleRequest('get', BASE_URL + '?sort=_id');
                store.products = data;
                // Setting category id and brand id to the product object
                store.products.forEach((item) => {
                    item.categoryId = item.category.length ? item.category[0]._id : null;
                    item.brandId = item.brand.length ? item.brand[0]._id : null;
                });
                // Caching products using localStorage
                localStorage.setItem("products", JSON.stringify(data));
                localStorage.setItem("expiryTime", Date.now() + Number(import.meta.env.VITE_CACHE_TIME));
            } finally {
                store.isLoading = false;
            }
        }
    }

    function beforeSaveProduct(product) {
        const categoryStore = useCategoryStore();
        const brandStore = useBrandStore();

        return {
            ...product,
            category: categoryStore.store.categories.find(item => item._id === product.categoryId) || null,
            brand: product.brandId ? brandStore.store.brands.find(item => item._id === product.brandId) : []
        };
    }

    async function createProduct(product) {
        const data = await handleRequest('post', BASE_URL, JSON.stringify(beforeSaveProduct(product)));
        store.products.push(data);
        setMessage('The product has been successfully created!', 'success');
    }

    async function updateProduct(product) {
        const data = await handleRequest('put', `${BASE_URL}/${product._id}`, JSON.stringify(beforeSaveProduct(product)));
        const index = store.products.findIndex(item => item._id === product._id);
        if (index !== -1) store.products[index] = data;
        setMessage('The product has been successfully updated!', 'success');
    }

    async function deleteProduct(productId) {
        await handleRequest('delete', `${BASE_URL}/${productId}`);
        const index = store.products.findIndex(item => item._id === productId);
        if (index !== -1) store.products.splice(index, 1);
        setMessage('The product has been successfully deleted!', 'success');
    }

    return {
        store,
        fetchProducts,
        createProduct,
        updateProduct,
        deleteProduct
    }
})