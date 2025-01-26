import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
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

    async function fetchCategories () {
        if (localStorage.categories && localStorage.expiryTime > (new Date()).getTime()) {
            store.categories = JSON.parse(localStorage.categories)
        } else {
            try {
                store.categories = [];
                store.isLoading = true;
                const response = await axios.get(BASE_URL + '?sort=_id');
                if (response.status === 200) {
                    store.categories = response.data;
                    // Caching categories using localStorage
                    localStorage.setItem("categories", JSON.stringify(store.categories));
                    localStorage.setItem("expiryTime", JSON.stringify((new Date()).getTime() + Number(import.meta.env.VITE_CACHE_TIME)));
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

    async function createCategory (category) {
        const response = await axios.post(BASE_URL, JSON.stringify(category));
        if (response.status === 201) {
            store.categories.push(response.data);
            store.message = {
                'value': 'The category has been successfully created!',
                'type': 'success',
            };
            setTimeout(() => {
                store.message = {
                    'value': null,
                    'type': null,
                };
            }, import.meta.env.VITE_MESSAGE_TIMEOUT);
        }
    }

    async function updateCategory (category) {
        const response = await axios.put(BASE_URL + "/" + category._id, JSON.stringify(category));
        if (response.status === 200) {
            store.categories[store.categories.findIndex((item) => item._id === category._id)] = response.data;
            store.message = {
                'value': 'The category has been successfully updated!',
                'type': 'success',
            };
            setTimeout(() => {
                store.message = {
                    'value': null,
                    'type': null,
                };
            }, import.meta.env.VITE_MESSAGE_TIMEOUT);
        }
    }

    async function deleteCategory (categoryId) {
        const response = await axios.delete(BASE_URL + "/" + categoryId);
        if (response.status === 200) {
            store.categories.splice(store.categories.findIndex((item) => item._id === categoryId), 1);
            store.message = {
                'value': 'The category has been successfully deleted!',
                'type': 'success',
            };
            setTimeout(() => {
                store.message = {
                    'value': null,
                    'type': null,
                };
            }, import.meta.env.VITE_MESSAGE_TIMEOUT);
        }
    }

    return { store, currentCategory, categoryList, fetchCategories, createCategory, updateCategory, deleteCategory }
})