<script setup>
import { useAuthStore, useLoadingStore } from "~/stores/auth";
import { jwtDecode } from "jwt-decode";
import { account, databases } from "~/utils/appwrite";

const authStore = useAuthStore();
const loadingStore = useLoadingStore();
const router = useRouter();
let current = ref();
onMounted(async () => {
  loadingStore.setLoading(true);
  try {
    const user = await account.get();
    if (user) {
      authStore.setCurrentUser({name: user.name, email: user.email, status: user.status});
    }
  } catch (e) {
    router.push("/auth");
  } finally {
    loadingStore.setLoading(false);
  }
  // current = localStorage.getItem("currentUser");
  // if (current !== null) {
  //   current = JSON.parse(current);
  //   authStore.updateUser(current);
  // } else {
  //   router.push("/auth");
  // }
});
</script>

<template>
  <Loader v-if="loadingStore.isLoading" />
  <!-- <div v-if="loadingStore.isLoading"> LOADING...</div> -->
  <div
    class="h-screen bg-gray-dark text-white"
    :class="{ grid: authStore.isAuth }"
    v-else
  >
    <Sidebar v-if="authStore.isAuth" />
    <slot />
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 1fr 6fr;
}
</style>
