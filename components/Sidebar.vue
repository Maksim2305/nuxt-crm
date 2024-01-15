<script setup>
const links = [{
  label: 'Profile',
  avatar: {
    src: 'https://avatars.githubusercontent.com/u/739984?v=4'
  },
  badge: 100
}, {
  label: 'Home',
  icon: 'i-heroicons-home',
  to: '/'
}, {
  label: 'Deals',
  icon: 'i-heroicons-table-cells',
  to: '/deals'
}, {
  label: 'Settings',
  icon: 'i-heroicons-cog-8-tooth',
  to: '/settings'
}, {
  label: 'Customers',
  icon: 'i-heroicons-users',
  to: '/customers'
}, {
  label: 'Logout',
  icon: 'i-heroicons-arrow-right-end-on-rectangle',
  to: '/auth'
}]
</script>

<template>
  <div class="border-r-4 border-white py-3 px-2">
    <UVerticalNavigation :links="links" />
  </div>
</template>