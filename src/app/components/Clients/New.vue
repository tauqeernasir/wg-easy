<template>
  <ClientsCreateDialog>
    <BaseSecondaryButton 
      as="span"
      :disabled="disabled"
      :class="{
        'opacity-50 cursor-not-allowed': disabled,
      }"
      :title="disabled ? $t('client.limitReachedTooltip') : undefined"
    >
      <IconsPlus class="w-4 md:mr-2" />
      <span class="text-sm max-md:hidden">{{ $t('client.newShort') }}</span>
    </BaseSecondaryButton>
  </ClientsCreateDialog>
</template>

<script setup lang="ts">
defineProps<{
  disabled?: boolean;
}>();
</script>
