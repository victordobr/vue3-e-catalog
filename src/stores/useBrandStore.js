import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios';
import { computed } from "@vue/runtime-core";

axios.defaults.headers['content-type'] = 'application/json';
axios.defaults.headers['x-apikey'] = import.meta.env.VITE_API_KEY;

const BASE_URL = import.meta.env.VITE_API_URL + 'brands';

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

    async function fetchBrands() {
        if (localStorage.getItem("brands") && Number(localStorage.getItem("expiryTime")) > Date.now()) {
            store.brands = JSON.parse(localStorage.getItem("brands"));
        } else {
            localStorage.removeItem("brands");
            localStorage.removeItem("expiryTime");

            try {
                store.brands = [];
                store.isLoading = true;
                const data = await handleRequest('get', BASE_URL + '?sort=_id');
                store.brands = data;
                localStorage.setItem("brands", JSON.stringify(data));
                localStorage.setItem("expiryTime", Date.now() + Number(import.meta.env.VITE_CACHE_TIME));
            } finally {
                store.isLoading = false;
            }
        }
    }

    async function createBrand(brand) {
        const data = await handleRequest('post', BASE_URL, JSON.stringify(brand));
        store.brands.push(data);
        setMessage('The brand has been successfully created!', 'success');
    }

    async function updateBrand(brand) {
        const data = await handleRequest('put', `${BASE_URL}/${brand._id}`, JSON.stringify(brand));
        const index = store.brands.findIndex(item => item._id === brand._id);
        if (index !== -1) store.brands[index] = data;
        setMessage('The brand has been successfully updated!', 'success');
    }

    async function deleteBrand(brandId) {
        await handleRequest('delete', `${BASE_URL}/${brandId}`);
        const index = store.brands.findIndex(item => item._id === brandId);
        if (index !== -1) store.brands.splice(index, 1);
        setMessage('The brand has been successfully deleted!', 'success');
    }

    return {
        store,
        currentBrand,
        brandList,
        fetchBrands,
        createBrand,
        updateBrand,
        deleteBrand
    }
})