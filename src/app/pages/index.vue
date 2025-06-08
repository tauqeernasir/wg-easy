<template>
  <main>
    <Panel>
      <PanelHead>
        <PanelHeadTitle :text="$t('pages.clients')" />
        <!-- Client Statistics -->
        <div 
          v-if="stats && stats.maxClients > 0" 
          class="flex items-center text-sm text-gray-600 dark:text-gray-300 mr-4"
        >
          <span class="mr-4">
            {{ $t('client.clientsCount', { 
              current: stats.currentClients, 
              max: stats.maxClients 
            }) }}
          </span>
          <span 
            v-if="stats.remaining > 0"
            class="text-green-600 dark:text-green-400"
          >
            {{ $t('client.remainingClients', { count: stats.remaining }) }}
          </span>
          <span 
            v-else
            class="text-red-600 dark:text-red-400 font-medium"
          >
            {{ $t('client.limitReached') }}
          </span>
        </div>
        <PanelHeadBoat>
          <ClientsSort />
          <ClientsNew :disabled="stats && !stats.canCreateMore" />
        </PanelHeadBoat>
      </PanelHead>

      <div>
        <ClientsList
          v-if="clientsStore.clients && clientsStore.clients.length > 0"
        />
      </div>
      <ClientsEmpty
        v-if="clientsStore.clients && clientsStore.clients.length === 0"
      />
      <div
        v-if="clientsStore.clients === null"
        class="p-5 text-gray-200 dark:text-red-300"
      >
        <IconsLoading class="mx-auto w-5 animate-spin" />
      </div>
    </Panel>
  </main>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
authStore.update();

const globalStore = useGlobalStore();
const clientsStore = useClientsStore();

// Fetch client statistics
const { data: stats, refresh: refreshStats } = await useFetch('/api/client/stats', {
  method: 'get',
});

const intervalId = ref<NodeJS.Timeout | null>(null);

clientsStore.refresh();

onMounted(() => {
  intervalId.value = setInterval(() => {
    clientsStore
      .refresh({
        updateCharts: globalStore.uiShowCharts,
      })
      .catch(console.error);
    
    // Refresh stats less frequently
    refreshStats().catch(console.error);
  }, 1000);
});

onUnmounted(() => {
  if (intervalId.value !== null) {
    clearInterval(intervalId.value);
    intervalId.value = null;
  }
});
</script>
