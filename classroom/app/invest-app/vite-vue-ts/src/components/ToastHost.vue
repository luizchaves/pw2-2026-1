<script setup lang="ts">
import { X } from 'lucide-vue-next';
import { useToastStore } from '@/stores/toast';

const toastStore = useToastStore();
</script>

<template>
  <div class="fixed right-4 bottom-4 z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3">
    <div
      v-for="toast in toastStore.messages"
      :key="toast.id"
      :class="[
        'flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm font-medium shadow-lg',
        toast.type === 'success'
          ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
          : 'border-rose-200 bg-rose-50 text-rose-800',
      ]"
    >
      <span>{{ toast.message }}</span>
      <button type="button" class="rounded p-0.5 opacity-70 hover:opacity-100" @click="toastStore.dismiss(toast.id)">
        <X class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>
