<script>
import { defineComponent, ref } from "vue";
import { VueDraggableNext } from "vue-draggable-next";
import { databases } from "../../utils/appwrite";
import { useDealsStore } from "../../stores/deals";
export default {
  components: {
    draggable: VueDraggableNext,
  },
  setup() {
    const statuses = [
      { name: "todo", label: "Создано" },
      { name: "to-be-agreed", label: "На согласовании" },
      { name: "in-progress", label: "В работе" },
      { name: "produced", label: "Выполнено" },
      { name: "done", label: "Закрыто" },
    ];
    const list = ref([]);
    const isOpenModal = ref(false);
    const dealInfo = ref(null);
    const isEditDeal = ref(false);
    const storeDeals = useDealsStore();
    const dragged = ref(null);

    onMounted(async () => {
      await getCards();
    });
    async function getCards() {
      try {
        await storeDeals.getDeals();
      } catch (err) {
        console.log(err);
      }
    }
    function openCard(deal) {
      dealInfo.value = deal;
      isOpenModal.value = true;
    }
    const onClose = () => {
      isOpenModal.value = false;
      dealInfo.value = null;
    };
    const onDragEnter = (e) => {
      if(e.target.classList.contains("list-group")) {
        e.target.style.background = "#699eaf47";
      }
      // if(e.target.parentNode.classList.contains("list-group")){
      //   e.target.parentNode.style.background = "#699eaf47";
      // }
    }
    const onDragLeave = (e) => {
      e.target.style.background = "";
      e.target.parentNode.style.background = "";
    }
    const onDrop = async(e) => {
      let status = null;
      if(e.target.classList.contains("list-group")) {
        status = e.target.dataset.status;
      } else if(e.target.parentNode.classList.contains("list-group")) {
        status = e.target.parentNode.dataset.status;
      } else {
        throw new Error("Неизвестный статус элемента");
      }
      onDragLeave(e);
      try {
        await storeDeals.updateDeal(dragged.value.$id, {
          name: dragged.value.name,
          price: dragged.value.price,
          status: status
        });
        // await getCards();
      } catch (err) {
        console.log(err);
      }
      dragged.value = null;
    }
    const onDragStart = (val) => {
      dragged.value = val;
    }
    return {
      statuses,
      isOpenModal,
      list,
      storeDeals,
      dealInfo,
      isEditDeal,
      openCard,
      getCards,
      onClose,
      onDragEnter,
      onDragLeave,
      onDrop,
      onDragStart
    };
  },
};
</script>
<template>
  <div style="flex: 1 0 auto;">
    <div class="grid mb-3">
      <div
        v-for="status in statuses"
        :key="status.name"
        class="px-1 py-2 rounded-md text-center bg-white text-slate-900"
      >
        {{ status.label }}
      </div>
    </div>

    <!-- <div class="flex align-center justify-between">
        <TasksCard v-for="item in 2"/>
    </div> -->
    <!-- {{ list }} -->
    <UButton
      icon="i-heroicons-plus-circle"
      size="sm"
      color="emerald"
      variant="solid"
      label="Добавить сделку"
      :trailing="false"
      v-if="statuses[0].name === 'todo'"
      @click="() => (isOpenModal = !isOpenModal)"
    />
    <div class="grid grid-columns">
      <draggable
        class="list-group"
        ref="listRef"
        ghostClass="on-drag"
        animation="200"
        group="list"
        v-for="status in statuses"
        :key="status.name"
        @dragleave="onDragLeave"
        @drop.prevent="onDrop"
        @dragenter="onDragEnter"
        @dragover.prevent=""
        :data-status="status.name"
      >
        <div
          class="list-group-item bg-gray-300 m-1 p-3 rounded-md text-center flex cursor-pointer"
          v-for="deal in storeDeals.dealsList.filter((it) => it.status === status.name)"
          :key="deal.$id"
          @dblclick="openCard(deal)"
          @dragstart="onDragStart(deal)"
        >
        <ULink
          :to="`/deals/${deal.$id}`"
          active-class="text-primary"
          inactive-class="text-gray-500 dark:text-green-400 hover:text-green-700 dark:hover:text-green-200 hover:underline"
        >
          {{ deal.name }}
        </ULink>
        </div>
      </draggable>
    </div>
    <UModal v-model="isOpenModal" :prevent-close="true">
      <TasksCard
        @close="onClose"
        @get-cards="getCards"
        :deal="dealInfo"
        :statuses="statuses"
      ></TasksCard>
    </UModal>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}
.grid-columns{
  height: calc(100vh - 140px);
}
</style>
