import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios';
import { config } from '@/config.js';
import { computed } from "@vue/runtime-core";

axios.defaults.headers['content-type'] = 'application/json';
axios.defaults.headers['x-apikey'] = config.apiKey;

const BASE_URL = config.baseUrl + 'brands';

export const useBrandStore = defineStore('brands', () => {
    const currentBrand = ref('all');
    const brands = ref([]);
    const isLoading = ref(false);
    const message = ref({
        'value': null,
        'type': null,
    });

    const brandList = computed(() => {
        let cat = brands.value.map((item) => ({
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
            this.brands = JSON.parse(localStorage.brands)
        } else {
            try {
                this.brands = [];
                this.isLoading = true;
                const response = await axios.get(BASE_URL + '?sort=_id');
                if (response.status === 200) {
                    this.brands = response.data;
                    // Caching brands using localStorage
                    localStorage.setItem("brands", JSON.stringify(this.brands));
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

    async function createBrand (brand) {
        const response = await axios.post(BASE_URL, JSON.stringify(brand));
        if (response.status === 201) {
            this.brands.push(response.data);
            this.message = {
                'value': 'The brand has been successfully created!',
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

    async function updateBrand (brand) {
        const response = await axios.put(BASE_URL + "/" + brand._id, JSON.stringify(brand));
        if (response.status === 200) {
            this.brands[this.brands.findIndex((item) => item._id === brand._id)] = response.data;
            this.message = {
                'value': 'The brand has been successfully updated!',
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

    async function deleteBrand (brandId) {
        const response = await axios.delete(BASE_URL + "/" + brandId);
        if (response.status === 200) {
            this.brands.splice(this.brands.findIndex((item) => item._id === brandId), 1);
            this.message = {
                'value': 'The brand has been successfully deleted!',
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

    return { currentBrand, brands, brandList, isLoading, message, fetchBrands, createBrand, updateBrand, deleteBrand }
})