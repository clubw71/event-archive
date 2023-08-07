<template>
  <v-timeline-item
    :size="size"
  >
    <v-card flat>
      <v-card-title
        class="d-flex row pt-0"
        @click="$emit('select', item, $event)"
      >
        <slot name="title" :text="item.title" />
        <h3 class="font-weight-light title">
          {{ titleFct(item.title) }}
        </h3>
      </v-card-title>
      <v-expand-transition>
        <v-card-text v-if="isActive">
          <slot name="default" />
        </v-card-text>
      </v-expand-transition>
    </v-card>
  </v-timeline-item>
</template>
<script setup>  
import { computed } from 'vue'

const props = defineProps({
  item: Object,
  size: Number,
  activeItem: Object,
  dotColor: String,
  titleClass: String,
  title: String,
  titleFct: Function
})

const isActive = computed(() => {
  return props.activeItem?.title === props.item.title
})

</script>
<style scoped>
  .title {
    color: darkgray;
    cursor: pointer;
  }
  .title:hover {
    color: black;
  }
</style>