<script setup lang="ts">
import { X } from 'lucide-vue-next';

defineProps<{
  title: string;
}>();

const emit = defineEmits<{
  close: [];
}>();
</script>

<template>
  <div class="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/55 px-4 py-8">
    <section class="w-full max-w-2xl rounded-lg bg-white p-6 shadow-2xl" role="dialog" aria-modal="true">
      <header class="mb-5 flex items-start justify-between gap-4">
        <h2 class="text-xl font-bold text-slate-950">{{ title }}</h2>
        <button
          type="button"
          class="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          aria-label="Fechar"
          @click="emit('close')"
        >
          <X class="h-5 w-5" />
        </button>
      </header>
      <slot />
    </section>
  </div>
</template>
