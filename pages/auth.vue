<script setup>
import { useAuthStore } from "~/stores/auth";
import { useVuelidate } from "@vuelidate/core";
import {
  required,
  email,
  minLength,
  helpers,
  requiredIf
} from "@vuelidate/validators";


useSeoMeta({
  title: "Login to System",
});
const router = useRouter();
const authStore = useAuthStore();
const state = reactive({ name: "", password: "", email: "" });
const toast = useToast();
const items = [
  {
    key: "login",
    label: "Login",
    description: "",
  },
  {
    key: "register",
    label: "Register",
    description: "",
  },
];
const selectedTab = ref({});
const rules = {
  email: {
    required: helpers.withMessage("Обязательное поле", required),
    email: helpers.withMessage("Невалидный email", email),
  },
  password: {
    required: helpers.withMessage("Обязательное поле", required),
    minLength: minLength(8),
  },
  name: { required: requiredIf(function(){
        return selectedTab.value?.key === "register";
      })},
};
const v = useVuelidate(rules, state);


onMounted(async()=>{
  await authStore.logoutUser();
})

const changeTab = (tab) => {
  v.value.$reset();
  state.email = "";
  state.password = "";
  state.name = "";
  selectedTab.value = items[tab];
};

const login = async () => {
  const isFormCorrect = await v.value.$validate();
  console.log(isFormCorrect)
  if (isFormCorrect) {
    try {
      await authStore.loginUser(state.email, state.password);
      if (authStore.isAuth) {
        router.push("/");
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.add({ title: `<span style='color:red'>${err.message}</span>` });
      }
    }
  }
};

const register = async () => {
  const isFormCorrect = await v.value.$validate();
  if (isFormCorrect) {
    try {
      await authStore.createUser(state);
      await login();
    } catch (err) {
      if (err instanceof Error) {
        toast.add({ title: `<span style='color:red'>${err.message}</span>` });
      }
    }
  }
};

// const logout = async () => {
//   await account.deleteSession("current");
//   loggedInUser.value = null;
// };
</script>

<template>
  <div class="flex items-center justify-center min-h-screen w-full">
    <UTabs :items="items" class="w-1/4" @change="changeTab">
      <template #item="{ item }">
        <UCard>
          <template #header>
            <p
              class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
            >
              {{ item.label }}
            </p>
          </template>

          <div
            v-if="item.key === 'login'"
            class="space-y-3"
            @keydown.enter="login"
          >
            <UFormGroup
              label="Email"
              name="email"
              :error="v.email.$error && v.email.$errors[0].$message"
            >
              <UInput v-model="state.email" />
            </UFormGroup>
            <UFormGroup
              label="password"
              name="password"
              :error="
                v.password.$error &&
                (v.password.$errors[0].$validator === 'minLength'
                  ? 'Пароль минимум 8 символов'
                  : v.password.$errors[0].$message)
              "
            >
              <UInput v-model="state.password" type="password" />
            </UFormGroup>
          </div>
          <div v-else-if="item.key === 'register'" class="space-y-3">
            <UFormGroup
              label="Email"
              name="email"
              :error="v.email.$error && v.email.$errors[0].$message"
            >
              <UInput v-model="state.email" type="email" />
            </UFormGroup>
            <UFormGroup
              label="Name"
              name="name"
              :error="v.name.$error && 'Обязательное поле'"
            >
              <UInput v-model="state.name" type="text" />
            </UFormGroup>
            <UFormGroup
              label="Password"
              name="password"
              :error="
                v.password.$error &&
                (v.password.$errors[0].$validator === 'minLength'
                  ? 'Пароль минимум 8 символов'
                  : v.password.$errors[0].$message)
              "
            >
              <UInput v-model="state.password" type="password" />
            </UFormGroup>
          </div>

          <template #footer>
            <UButton
              type="button"
              color="black"
              @click="item.key === 'login' ? login() : register()"
            >
              {{ item.key === "login" ? "Login" : "Register" }}
            </UButton>
          </template>
        </UCard>
      </template>
    </UTabs>
  </div>
</template>
