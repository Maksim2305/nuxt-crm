<script setup>
import { useDealsStore } from "../../stores/deals";
import { ref, watch } from "vue";

const state = reactive({
  name: "",
  price: "",
  statuses: [],
});
const props = defineProps({
  deal: {
    type: Object,
    required: false,
  },
  statuses: {
    type: Array,
    required: true,
  },
});
const selectedStatus = ref({});
const dealStore = useDealsStore();
const emit = defineEmits(["close", "get-cards"]);
onMounted(() => {
  if (props.deal) {
    state.name = props.deal.name;
    state.price = props.deal.price;
    state.statuses = JSON.parse(JSON.stringify(props.statuses));
    selectedStatus.value = state.statuses.find(
      (status) => status.name === props.deal.status
    );
  }
});

const addNewDeal = async () => {
  try {
    await dealStore.createDeal({
      name: state.name,
      price: state.price,
    });
    emit("close");
  } catch (err) {
    console.log(err);
  }
};
const saveDeal = async () => {
  try {
    await dealStore.updateDeal(props.deal.$id, {
      name: state.name,
      price: state.price,
      status: props.statuses.find(
        (status) => status.label === selectedStatus.value.label
      ).name,
    });
  } catch (err) {
    console.log(err);
  }
  emit("close");
  emit("get-cards");
};

const removeDeal = async () => {
  await dealStore.deleteDeal(props.deal.$id, {...state});
  emit("close");
  emit("get-cards");
};
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div class="font-bold">
          {{ props.deal ? props.deal?.name : "Новая сделка" }}
        </div>
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-x-mark-20-solid"
          class="-my-1"
          @click="$emit('close')"
        />
      </div>
    </template>

    <UFormGroup label="Название" name="name">
      <UInput v-model="state.name" type="text" />
    </UFormGroup>
    <UFormGroup label="Цена" name="price">
      <UInput v-model="state.price" type="text" />
    </UFormGroup>
    <UFormGroup label="Дата создания" name="creationDate" v-if="deal">
      <UInput v-model="deal.$createdAt" type="text" disabled />
    </UFormGroup>
    <UFormGroup label="Статус" name="status" v-if="deal">
      <USelect
        v-model="selectedStatus.label"
        :options="state.statuses"
        option-attribute="label"
      />
    </UFormGroup>

    <template #footer>
      <UButton
        type="button"
        color="black"
        @click="deal ? saveDeal() : addNewDeal()"
      >
        {{ deal ? "Сохранить" : "Добавить" }}
      </UButton>
      <UButton
        type="button"
        color="black"
        @click="removeDeal"
        v-if="deal"
        class="ml-2"
      >
        Удалить
      </UButton>
    </template>
  </UCard>
</template>
