import axios from "axios";
export default defineNuxtPlugin((nuxtApp) => {
  const baseURL = axios.create();
  baseURL.defaults.baseURL = 'https://0f567336891def55.mokky.dev'
return {
    provide: {
        baseURL,
    },
  };
});