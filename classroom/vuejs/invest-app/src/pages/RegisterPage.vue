<script setup lang="ts">
import { UserPlus } from 'lucide-vue-next';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { type RegisterFormData, registerSchema } from '@/schemas/auth';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const auth = useAuthStore();
const form = reactive<RegisterFormData>({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
});
const errors = reactive<Record<keyof RegisterFormData, string | null>>({
  name: null,
  email: null,
  password: null,
  confirmPassword: null,
});
const actionError = ref<string | null>(null);
const actionSuccess = ref<string | null>(null);
const isSubmitting = ref(false);

const clearErrors = () => {
  for (const key of Object.keys(errors) as Array<keyof RegisterFormData>) {
    errors[key] = null;
  }
};

const handleSubmit = async () => {
  clearErrors();
  actionError.value = null;
  actionSuccess.value = null;
  const parsed = registerSchema.safeParse({ ...form });

  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof RegisterFormData;
      errors[field] = issue.message;
    }
    return;
  }

  try {
    isSubmitting.value = true;
    const result = await auth.register({
      name: parsed.data.name,
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (!result.signedIn) {
      actionSuccess.value = 'Cadastro criado. Verifique seu email para confirmar a conta.';
      return;
    }

    await router.replace('/');
  } catch (error) {
    actionError.value =
      error instanceof Error ? error.message : 'Nao foi possivel criar o cadastro';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <section class="flex min-h-[calc(100vh-65px)] items-center justify-center bg-slate-50 px-4 py-12">
    <article class="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
      <p class="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Invest App</p>
      <h1 class="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">Criar conta</h1>

      <form class="mt-8 space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label for="register-name" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Nome</label>
          <input id="register-name" v-model="form.name" autocomplete="name" class="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 focus:outline-none" placeholder="Seu nome" />
          <p v-if="errors.name" class="mt-1 text-xs text-red-500">{{ errors.name }}</p>
        </div>
        <div>
          <label for="register-email" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Email</label>
          <input id="register-email" v-model="form.email" type="email" autocomplete="email" class="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 focus:outline-none" placeholder="voce@email.com" />
          <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
        </div>
        <div>
          <label for="register-password" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Senha</label>
          <input id="register-password" v-model="form.password" type="password" autocomplete="new-password" class="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 focus:outline-none" placeholder="Minimo de 6 caracteres" />
          <p v-if="errors.password" class="mt-1 text-xs text-red-500">{{ errors.password }}</p>
        </div>
        <div>
          <label for="register-confirm-password" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Confirmar senha</label>
          <input id="register-confirm-password" v-model="form.confirmPassword" type="password" autocomplete="new-password" class="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 focus:outline-none" placeholder="Repita sua senha" />
          <p v-if="errors.confirmPassword" class="mt-1 text-xs text-red-500">{{ errors.confirmPassword }}</p>
        </div>
        <div v-if="actionError" class="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{{ actionError }}</div>
        <div v-if="actionSuccess" class="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{{ actionSuccess }}</div>
        <button type="submit" :disabled="isSubmitting" class="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-sky-600 px-5 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 disabled:bg-slate-300">
          <UserPlus class="h-4 w-4" />
          {{ isSubmitting ? 'Criando conta' : 'Criar conta' }}
        </button>
      </form>
      <p class="mt-6 text-center text-sm text-slate-600">
        Ja tem conta?
        <RouterLink to="/login" class="font-semibold text-sky-700">Entrar</RouterLink>
      </p>
    </article>
  </section>
</template>
