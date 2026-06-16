<script setup lang="ts">
import { LogIn } from 'lucide-vue-next';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { type LoginFormData, loginSchema } from '@/schemas/auth';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const auth = useAuthStore();
const form = reactive<LoginFormData>({ email: '', password: '' });
const errors = reactive<Record<keyof LoginFormData, string | null>>({
  email: null,
  password: null,
});
const actionError = ref<string | null>(null);
const isSubmitting = ref(false);

const clearErrors = () => {
  errors.email = null;
  errors.password = null;
};

const handleSubmit = async () => {
  clearErrors();
  actionError.value = null;
  const parsed = loginSchema.safeParse({ ...form });

  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof LoginFormData;
      errors[field] = issue.message;
    }
    return;
  }

  try {
    isSubmitting.value = true;
    await auth.login(parsed.data.email, parsed.data.password);
    await router.replace('/');
  } catch (error) {
    actionError.value = error instanceof Error ? error.message : 'Nao foi possivel entrar';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <section class="flex min-h-[calc(100vh-65px)] items-center justify-center bg-slate-50 px-4 py-12">
    <article class="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
      <p class="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Invest App</p>
      <h1 class="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">Entrar</h1>

      <form class="mt-8 space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label for="login-email" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Email
          </label>
          <input
            id="login-email"
            v-model="form.email"
            type="email"
            autocomplete="email"
            class="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 focus:outline-none"
            placeholder="voce@email.com"
          />
          <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
        </div>
        <div>
          <label for="login-password" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Senha
          </label>
          <input
            id="login-password"
            v-model="form.password"
            type="password"
            autocomplete="current-password"
            class="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 focus:outline-none"
            placeholder="Sua senha"
          />
          <p v-if="errors.password" class="mt-1 text-xs text-red-500">{{ errors.password }}</p>
        </div>
        <div
          v-if="actionError"
          class="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
        >
          {{ actionError }}
        </div>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-sky-600 px-5 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 disabled:bg-slate-300"
        >
          <LogIn class="h-4 w-4" />
          {{ isSubmitting ? 'Entrando' : 'Entrar' }}
        </button>
      </form>
      <p class="mt-6 text-center text-sm text-slate-600">
        Ainda nao tem conta?
        <RouterLink to="/register" class="font-semibold text-sky-700">Criar cadastro</RouterLink>
      </p>
    </article>
  </section>
</template>
