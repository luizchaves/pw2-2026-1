<script setup lang="ts">
import { Eye, EyeOff, LogIn, LogOut, UserCircle, UserPlus } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useVisibilityStore } from '@/stores/visibility';

const auth = useAuthStore();
const visibility = useVisibilityStore();
const router = useRouter();
const accountOpen = ref(false);

const displayName = computed(() => {
  const name = auth.user?.user_metadata?.name;
  return typeof name === 'string' ? name : auth.user?.email;
});

const handleLogout = async () => {
  await auth.logout();
  accountOpen.value = false;
  await router.replace('/login');
};
</script>

<template>
  <header class="border-b border-slate-200 bg-white/95 backdrop-blur">
    <nav class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <RouterLink to="/" class="text-lg font-semibold tracking-tight text-slate-900">
        Invest App
      </RouterLink>

      <div v-if="!auth.user" class="flex items-center gap-2">
        <RouterLink
          to="/login"
          class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        >
          <LogIn class="h-4 w-4" />
          Entrar
        </RouterLink>
        <RouterLink
          to="/register"
          class="inline-flex items-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500"
        >
          <UserPlus class="h-4 w-4" />
          Cadastrar
        </RouterLink>
      </div>

      <template v-else>
        <div class="hidden flex-1 justify-center md:flex">
          <div class="flex items-center gap-2">
            <RouterLink
              to="/dashboard"
              class="rounded-full px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              Dashboard
            </RouterLink>
            <RouterLink
              to="/investments"
              class="rounded-full px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              Investimentos
            </RouterLink>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="rounded-full p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            :aria-label="visibility.showValues ? 'Ocultar valores' : 'Exibir valores'"
            @click="visibility.toggleShowValues"
          >
            <EyeOff v-if="visibility.showValues" class="h-5 w-5" />
            <Eye v-else class="h-5 w-5" />
          </button>

          <div class="relative">
            <button
              type="button"
              class="inline-flex max-w-52 items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              @click="accountOpen = !accountOpen"
            >
              <UserCircle class="h-4 w-4" />
              <span v-if="displayName" class="hidden truncate sm:inline">{{ displayName }}</span>
            </button>
            <div
              v-if="accountOpen"
              class="absolute right-0 mt-2 w-56 rounded-lg border border-slate-200 bg-white p-1 shadow-lg"
            >
              <div class="px-3 py-2">
                <p class="text-xs font-semibold uppercase text-slate-500">Minha conta</p>
                <p v-if="displayName" class="mt-1 truncate text-sm font-semibold text-slate-900">
                  {{ displayName }}
                </p>
              </div>
              <div class="my-1 h-px bg-slate-100" />
              <button
                type="button"
                class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50"
                @click="handleLogout"
              >
                <LogOut class="h-4 w-4" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </template>
    </nav>
  </header>
</template>
