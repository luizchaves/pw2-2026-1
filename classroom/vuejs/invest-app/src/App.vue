<script setup lang="ts">
import { onMounted } from 'vue';
import Navbar from '@/components/Navbar.vue';
import ToastHost from '@/components/ToastHost.vue';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();

onMounted(() => {
  if (auth.isLoading) {
    void auth.hydrate();
  }
});
</script>

<template>
  <Navbar />
  <main :class="$route.meta.public ? '' : 'mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8'">
    <RouterView />
  </main>
  <ToastHost />
</template>
