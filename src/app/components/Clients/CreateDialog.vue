<template>
  <BaseDialog :trigger-class="triggerClass" v-model:open="dialogOpen">
    <template #trigger>
      <div @click="handleTriggerClick">
        <slot />
      </div>
    </template>
    <template #title>
      {{ $t('client.new') }}
    </template>
    <template #description>
      <div class="flex flex-col">
        <!-- Show limit warning if approaching limit -->
        <div 
          v-if="stats?.maxClients > 0 && stats?.remaining <= 3 && stats?.remaining > 0"
          class="mb-4 rounded-md bg-yellow-50 p-3 border border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800"
        >
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                {{ $t('client.limitWarning') }}
              </h3>
              <div class="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                <p>{{ $t('client.remainingClients', { count: stats.remaining }) }}</p>
              </div>
            </div>
          </div>
        </div>

        <FormTextField id="name" v-model="name" :label="$t('client.name')" />
        <FormDateField
          id="expiresAt"
          v-model="expiresAt"
          :label="$t('client.expireDate')"
        />
      </div>
    </template>
    <template #actions>
      <DialogClose as-child>
        <BaseSecondaryButton>{{ $t('dialog.cancel') }}</BaseSecondaryButton>
      </DialogClose>
      <DialogClose as-child>
        <BasePrimaryButton 
          @click="createClient"
          :disabled="!canCreate"
        >
          {{ $t('client.create') }}
        </BasePrimaryButton>
      </DialogClose>
    </template>
  </BaseDialog>
</template>

<script lang="ts" setup>
const name = ref<string>('');
const expiresAt = ref<string | null>(null);
const dialogOpen = ref(false);
const clientsStore = useClientsStore();

const { t } = useI18n();

const props = defineProps<{ 
  triggerClass?: string;
  disabled?: boolean;
}>();

// Fetch client statistics
const { data: stats, refresh: refreshStats } = await useFetch('/api/client/stats', {
  method: 'get',
});

const canCreate = computed(() => {
  return stats.value?.canCreateMore ?? true;
});

function handleTriggerClick(event: Event) {
  // Prevent dialog from opening if disabled
  if (props.disabled || !canCreate.value) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }
}

function createClient() {
  if (!canCreate.value) {
    return;
  }
  return _createClient({ name: name.value, expiresAt: expiresAt.value });
}

const _createClient = useSubmit(
  '/api/client',
  {
    method: 'post',
  },
  {
    revert: async (success) => {
      await clientsStore.refresh();
      await refreshStats();
      if (success) {
        // Reset form
        name.value = '';
        expiresAt.value = null;
        dialogOpen.value = false;
      }
    },
    successMsg: t('client.created'),
  }
);

// Watch dialog open state to refresh stats
watch(dialogOpen, (isOpen) => {
  if (isOpen && canCreate.value) {
    refreshStats();
  }
});

// Prevent dialog from opening when disabled
watch(() => props.disabled, (isDisabled) => {
  if (isDisabled && dialogOpen.value) {
    dialogOpen.value = false;
  }
});

watch(() => stats.value?.canCreateMore, (canCreateMore) => {
  if (canCreateMore === false && dialogOpen.value) {
    dialogOpen.value = false;
  }
});
</script>
