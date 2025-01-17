import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios';
import { config } from '@/config.js';
import { computed } from "@vue/runtime-core";

axios.defaults.headers['content-type'] = 'application/json';
axios.defaults.headers['x-apikey'] = config.apiKey;

const BASE_URL = config.baseUrl + 'brands';

export const useBrandStore = defineStore('brands', () => {
    const store = reactive({
        brands: [],
        isLoading: false,
        message: {
            'value': null,
            'type': null,
        }
    });

    const currentBrand = ref('all');

    const brandList = computed(() => {
        let cat = store.brands.map((item) => ({
            'id': item._id,
            'name': item.name
        }));
        cat.unshift({
            'id': 'all',
            'name': 'All brands'
        });
        return cat;
    });

    async function fetchBrands () {
        if (localStorage.brands && localStorage.expiryTime > (new Date()).getTime()) {
            store.brands = JSON.parse(localStorage.brands)
        } else {
            try {
                store.brands = [];
                store.isLoading = true;
                const response = await axios.get(BASE_URL + '?sort=_id');
                if (response.status === 200) {
                    store.brands = response.data;
                    // Caching brands using localStorage
                    localStorage.setItem("brands", JSON.stringify(store.brands));
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

    async function createBrand (brand) {
        const response = await axios.post(BASE_URL, JSON.stringify(brand));
        if (response.status === 201) {
            store.brands.push(response.data);
            store.message = {
                'value': 'The brand has been successfully created!',
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

    async function updateBrand (brand) {
        const response = await axios.put(BASE_URL + "/" + brand._id, JSON.stringify(brand));
        if (response.status === 200) {
            store.brands[store.brands.findIndex((item) => item._id === brand._id)] = response.data;
            store.message = {
                'value': 'The brand has been successfully updated!',
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

    async function deleteBrand (brandId) {
        const response = await axios.delete(BASE_URL + "/" + brandId);
        if (response.status === 200) {
            store.brands.splice(store.brands.findIndex((item) => item._id === brandId), 1);
            store.message = {
                'value': 'The brand has been successfully deleted!',
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

    return { store, currentBrand, brandList, fetchBrands, createBrand, updateBrand, deleteBrand }
})