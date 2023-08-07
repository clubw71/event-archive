<template>
  <v-container class="fill-height">
    <v-app-bar flat class="toolbar">
      <v-app-bar-title>
        <v-row no-gutters align="center" class="ml-n9">
          <v-col cols="2">
            <v-text-field
              v-model="query"
              placeholder="Suche"
              class="filter-row"
              prepend-icon="search"
              variant="outlined"
              clearable
              persistent-clear
              hide-details
              density="compact"
              @click:clear="handleSearchInput"
              @input="handleSearchInput"
            />
          </v-col>
          <v-col cols="2">
            <span class="text-caption ml-2">
              {{ resultsText }}
            </span>
          </v-col>
        </v-row>
      </v-app-bar-title>
    </v-app-bar>
    <Timeline
      :items="yearItems"
      :sizeFct="yearSizeFct"
      :titleFct="(name) => name"
    >
      <template v-slot:item="{ item }">
        <Timeline
          :items="item.items"
          :sizeFct="monthSizeFct"
          :titleFct="getMonthName"
        >
          <template v-slot:item="{ item }">
            <v-list lines="one">
              <v-list-item
                v-for="(event, e_idx) of item.items"
                :key="'e' + e_idx"
              >
                <v-row justify="start">
                  <v-col cols="3">
                    {{ event.day + '.' + event.month + '.' + event.year }}
                  </v-col>
                  <v-col cols="3" class="d-flex justify-start">
                    <b>
                      {{ event.type }}
                    </b>
                  </v-col>
                  <v-col class="justify-start">
                    {{ event.title }}
                    <br>
                    <span class="font-italic text-caption">
                    {{ event.description }}
                    </span>
                  </v-col>
                </v-row>
              </v-list-item>
            </v-list>
          </template>
        </Timeline>
      </template>
    </Timeline>
  </v-container>
</template>

<script setup>
  import { ref, computed, watch } from 'vue'
  import Timeline from './Timeline'

  const props = defineProps({
    items: Array,
    searchFilterResults: Array
  })

  const emit = defineEmits(['search'])

  const query = ref()
  let searchTimeout

  const yearItems = computed(() => props.items)
  const resultsText = computed(() => {
    const numberSearchFilterResults = props.searchFilterResults?.length
    if (!query.value) return ''
    if (numberSearchFilterResults === 1) return '1 Ergebnis'
    return `${numberSearchFilterResults} Ergebnisse`
  })


  function yearSizeFct (item) {
    return item.items.reduce((acc, m_item) => acc += m_item.items.length, 0)
  }

  function monthSizeFct (item) {
    return item.items?.length * 5
  }

  function getMonthName (month) {
    const locale = 'de-DE'
    const d = new Date()
    d.setDate(1)
    d.setMonth(parseInt(month) - 1)
    return d.toLocaleString(locale, { month: 'long' })
  }

  function handleSearchInput () {
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }
    searchTimeout = setTimeout(() => {
      emit('search', query.value ?? '')
    }, 300)
  }

</script>
<style lang="css" scoped>
  .toolbar {
    border-bottom: 1px #efefef solid 
  }
</style>