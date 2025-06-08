<template>
  <div class="m-10 text-center">
    <p class="text-sm text-gray-400 dark:text-neutral-400">
      {{ $t('client.empty') }}
    </p>
    
    <!-- Show different message based on limit status -->
    <div class="mt-4">
      <div v-if="stats && !stats.canCreateMore" class="mb-4">
        <p class="text-sm text-red-500 dark:text-red-400 mb-2">
          {{ $t('client.limitReached') }}
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          {{ $t('client.limitReachedDesc') }}
        </p>
      </div>
      
      <ClientsCreateDialog v-else :disabled="stats && !stats.canCreateMore">
        <BaseSecondaryButton as="span">
          <IconsPlus class="w-4 md:mr-2" />
          <span class="text-sm">{{ $t('client.new') }}</span>
        </BaseSecondaryButton>
      </ClientsCreateDialog>
    </div>
  </div>
</template>

<script setup lang="ts">
// Fetch client statistics to check if we can create more
const { data: stats } = await useFetch('/api/client/stats', {
  method: 'get',
});
</script>
