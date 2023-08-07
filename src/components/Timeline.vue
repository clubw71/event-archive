<template>
  <v-container class="fill-height">
    <v-timeline
      side="end"
      align="start"
    >
      <TimelineItem
        v-for="(item, index) of items"
        :key="index"
        :item="item"
        :activeItem="refActiveItem"
        :size="sizeFct(item)"
        :titleFct="titleFct"
        @select="handleSelect"
      >
        <slot name="item" :item="item" :index="index" />
      </TimelineItem>
    </v-timeline>
  </v-container>
</template>

<script setup>
  import { ref, computed, watch } from 'vue'
  import TimelineItem from './TimelineItem'
  const props = defineProps({
    items: Array,
    sizeFct: Function,
    titleFct: Function
  })

  let activeItem = ref()

  function handleSelect (item, evt) {
    const isUnselect = activeItem.value?.title === item.title
    if (isUnselect) {
      activeItem.value = null
    } else {
      activeItem.value = { ...item }
    }
  }

  const itemsLength = computed(() => props.items?.length)

  const refActiveItem = computed(() => {
    if (props.items?.length === 1) {
      return props.items[0]
    }
    return activeItem.value
  })

  watch(itemsLength, (newVal, oldVal) => {
    if (newVal > oldVal) {
      activeItem.value = null
    }
  })
</script>
<style lang="css" scoped>
</style>