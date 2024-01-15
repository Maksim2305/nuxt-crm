<template>
  <!-- <div> -->
    <NuxtLayout>
    <NuxtPage />
    <UNotifications>
      <template #title="{ title }">
        <span v-html="title" />
      </template>
    </UNotifications>
    </NuxtLayout>
   
  <!-- </div> -->

</template>
