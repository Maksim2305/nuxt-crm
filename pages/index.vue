<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';

useSeoMeta({
  title: 'Dashboard',
})
const authStore = useAuthStore()
</script>

<template>
   <div class="py-3 px-3 flex flex-col" v-if="authStore.isAuth">
   <h3>Привет я главная</h3>
  </div>
  <Loader v-else></Loader>
</template>

<style scoped></style>



