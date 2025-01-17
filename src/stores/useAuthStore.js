import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(JSON.parse(localStorage.getItem('user')));

    function login(username, password) {
        if (username == 'test' && password == 'test') {
            this.user = {
                "id": 1,
                "username": "test",
                "firstName": "Test",
                "lastName": "User"
            }
            localStorage.setItem("user", JSON.stringify(this.user));
        }
    }

    function logout() {
        this.user = null;
        localStorage.removeItem('user');
    }

    return { user, login, logout };
})