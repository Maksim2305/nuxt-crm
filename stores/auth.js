import { defineStore } from "pinia";
import { account, databases } from "../utils/appwrite";
import { v4 as uuidv4 } from 'uuid';

const defaultState = {
    user:{
        name: '',
        email: '',
        status: false
    }
}

export const useAuthStore = defineStore('auth', {
    state: () => defaultState,
    getters: {
        isAuth: (state) => state.user.status,
    },
    actions: {
        clear(){
            this.$patch(defaultState);
        },
        async createUser(user){
            await account.create(uuidv4(), user.email, user.password, user.name);
            this.loginUser(user.email, user.password);
        },
        async loginUser(email, password){
            await account.createEmailSession(email, password);
            const user = await account.get();
            if(user){
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.setCurrentUser({name: user.name, email: user.email, status: user.status});
            }
        },
        async logoutUser(){
            await account.deleteSession('current');
            localStorage.removeItem('currentUser');
            this.clear();
        },
        setCurrentUser(newUser){
            this.user = newUser;
        },
    },
});

export const useLoadingStore = defineStore('loading', {
    state: ()=>({
        isLoading: true
    }),
    actions: {
        setLoading(loading){
            console.log(loading)
            this.isLoading = loading;
        }
    }
    
});