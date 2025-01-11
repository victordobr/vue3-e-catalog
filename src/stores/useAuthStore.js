import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter();
    const user = ref(JSON.parse(localStorage.getItem('user')));
    const returnUrl = ref(null);

    function login(username, password) {
        if (username == 'test' && password == 'test') {
            this.user = {
                "id": 1,
                "username": "test",
                "firstName": "Test",
                "lastName": "User"
            }
            localStorage.setItem("user", JSON.stringify(this.user));
            router.push(this.returnUrl || '/');
        }
    }

    function logout() {
        this.user = null;
        localStorage.removeItem('user');
        router.push('/login');
    }

    return { user, returnUrl, login, logout };
})