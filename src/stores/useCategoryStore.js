import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios';
import { config } from '@/config.js';
import { computed } from "@vue/runtime-core";

axios.defaults.headers['content-type'] = 'application/json';
axios.defaults.headers['x-apikey'] = config.apiKey;

const BASE_URL = config.baseUrl + 'categories';

export const useCategoryStore = defineStore('categories', () => {
    const currentCategory = ref('all');
    const categories = ref([]);
    const isLoading = ref(false);
    const message = ref({
        'value': null,
        'type': null,
    });

    const categoryList = computed(() => {
        let list = categories.value.map((item) => ({
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
            this.categories = JSON.parse(localStorage.categories)
        } else {
            try {
                this.categories = [];
                this.isLoading = true;
                const response = await axios.get(BASE_URL + '?sort=_id');
                if (response.status === 200) {
                    this.categories = response.data;
                    // Caching categories using localStorage
                    localStorage.setItem("categories", JSON.stringify(this.categories));
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

    async function createCategory (category) {
        const response = await axios.post(BASE_URL, JSON.stringify(category));
        if (response.status === 201) {
            this.categories.push(response.data);
            this.message = {
                'value': 'The category has been successfully created!',
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

    async function updateCategory (category) {
        const response = await axios.put(BASE_URL + "/" + category._id, JSON.stringify(category));
        if (response.status === 200) {
            this.categories[this.categories.findIndex((item) => item._id === category._id)] = response.data;
            this.message = {
                'value': 'The category has been successfully updated!',
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

    async function deleteCategory (categoryId) {
        const response = await axios.delete(BASE_URL + "/" + categoryId);
        if (response.status === 200) {
            this.categories.splice(this.categories.findIndex((item) => item._id === categoryId), 1);
            this.message = {
                'value': 'The category has been successfully deleted!',
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

    return { currentCategory, categories, categoryList, isLoading, message, fetchCategories, createCategory, updateCategory, deleteCategory }
})