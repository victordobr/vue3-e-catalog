import { reactive, ref } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';
import { computed } from "@vue/runtime-core";

axios.defaults.headers['content-type'] = 'application/json';
axios.defaults.headers['x-apikey'] = import.meta.env.VITE_API_KEY;

const BASE_URL = import.meta.env.VITE_API_URL + 'categories';

export const useCategoryStore = defineStore('categories', () => {
    const store = reactive({
        categories: [],
        isLoading: false,
        message: {
            'value': null,
            'type': null,
        }
    });

    const currentCategory = ref('all');

    const categoryList = computed(() => {
        let list = store.categories.map((item) => ({
            'id': item._id,
            'name': item.name
        }));
        list.unshift({
            'id': 'all',
            'name': 'All categories'
        });
        return list;
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

    async function fetchCategories() {
        if (localStorage.getItem("categories") && Number(localStorage.getItem("expiryTime")) > Date.now()) {
            store.categories = JSON.parse(localStorage.getItem("categories"));
        } else {
            localStorage.removeItem("categories");
            localStorage.removeItem("expiryTime");

            try {
                store.categories = [];
                store.isLoading = true;
                const data = await handleRequest('get', BASE_URL + '?sort=_id');
                store.categories = data;
                localStorage.setItem("categories", JSON.stringify(data));
                localStorage.setItem("expiryTime", Date.now() + Number(import.meta.env.VITE_CACHE_TIME));
            } finally {
                store.isLoading = false;
            }
        }
    }

    async function createCategory(category) {
        const data = await handleRequest('post', BASE_URL, JSON.stringify(category));
        store.categories.push(data);
        setMessage('The category has been successfully created!', 'success');
    }

    async function updateCategory(category) {
        const data = await handleRequest('put', `${BASE_URL}/${category._id}`, JSON.stringify(category));
        const index = store.categories.findIndex(item => item._id === category._id);
        if (index !== -1) store.categories[index] = data;
        setMessage('The category has been successfully updated!', 'success');
    }

    async function deleteCategory(categoryId) {
        await handleRequest('delete', `${BASE_URL}/${categoryId}`);
        const index = store.categories.findIndex(item => item._id === categoryId);
        if (index !== -1) store.categories.splice(index, 1);
        setMessage('The category has been successfully deleted!', 'success');
    }

    return {
        store,
        currentCategory,
        categoryList,
        fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory
    };
});
