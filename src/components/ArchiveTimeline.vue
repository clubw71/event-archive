<template>
  <v-container
    class="fill-height"
    :class="smRmPaddingClasses"
  >
    <v-app-bar flat class="toolbar">
      <v-app-bar-title>
        <v-row no-gutters align="center" class="ml-n9">
          <v-col cols="8" sm="6" md="4" lg="2">
            <v-combobox
              v-model="query"
              :items="searchTerms"
              placeholder="Suche"
              class="filter-row"
              prepend-icon="search"
              variant="outlined"
              clearable
              persistent-clear
              hide-details
              density="compact"
              @click:clear="handleSearchInput"
              @update:search="handleSearchInput"
            />
          </v-col>
          <v-col cols="4" sm="6" md="8" lg="2">
            <span class="text-caption ml-2">
              {{ resultsText }}
            </span>
          </v-col>
        </v-row>
      </v-app-bar-title>
    </v-app-bar>
    <Timeline
      :items="yearItems"
      :colorFct="yearColorFct"
      :titleFct="(name) => name"
      :class="smRmPaddingClasses"
    >
      <template v-slot:item="{ item }">
        <Timeline
          :items="item.items"
          :colorFct="monthColorFct"
          :titleFct="getMonthName"
          :class="smRmPaddingClasses"
        >
          <template v-slot:item="{ item }">
            <v-list lines="one">
              <v-list-item
                v-for="(event, e_idx) of item.items"
                :key="'e' + e_idx"
                class="px-1"
              >
                <v-row justify="start" no-gutters>
                  <v-col cols="12" sm="4" md="3" class="py-1 text-no-wrap">
                    {{ event.day + '.' + event.month + '.' + event.year }}
                  </v-col>
                  <v-col cols="12" sm="4" md="3" class="py-1 d-flex justify-start text-no-wrap">
                    <b>
                      {{ event.type }}
                    </b>
                  </v-col>
                  <v-col cols="12" sm="4" md="6" class="py-1 justify-start">
                    {{ event.title }}
                    <br>
                    <span class="font-italic text-caption">
                    {{ event.description }}
                    </span>
                  </v-col>
                </v-row>
                <v-divider v-if="isSmall" class="mt-2" />
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
  import { useDisplay } from 'vuetify'
  import Timeline from './Timeline'

  const props = defineProps({
    items: Array,
    searchIndex: Object,
    searchTerms: Array,
    searchFilterResults: Array
  })

  const emit = defineEmits(['search'])

  const { smAndDown } = useDisplay()
  const isSmall = ref(smAndDown)
  let query = ref()
  let searchTimeout

  const yearItems = computed(() => props.items)
  const searchTerms = computed(() => props.searchTerms)

  const resultsText = computed(() => {
    const numberSearchFilterResults = props.searchFilterResults?.length
    if (!query.value) return ''
    if (numberSearchFilterResults === 1) return '1 Ergebnis'
    return `${numberSearchFilterResults} Ergebnisse`
  })

  const smRmPaddingClasses = computed(() => {
    return {
      'px-0': isSmall.value
    }
  })

  const maxYearEvents = computed(() => {
    return props.items.reduce((acc, yearData) => {
      const eventsCount = getEventCountForYear(yearData)
      if (acc < eventsCount) {
        return eventsCount
      }
      return acc
    }, 0)
  })
  
  const maxMonthEvents = computed(() => {
    return props.items.reduce((acc, yearData) => {
      for (const monthData of yearData.items) {
        if (acc < monthData.items.length) {
          return monthData.items.length
        }
      }
      return acc
    }, 0)
  })

  function getEventCountForYear (yearData) {
    return yearData.items.reduce((acc, monthData) => {
      return acc + getEventCountForMonth(monthData)
    }, 0)
  }

  function getEventCountForMonth (monthData) {
    return monthData.items.length
  }

  function heatMapColorForValue (value) {
    const sat = value * 100
    const light = (1 - value) * 100
    return `hsl(40, ${sat}%, ${light}%)`
  }

  function yearColorFct (item) {
    const eventsCount = getEventCountForYear(item)
    const ratio = eventsCount / maxYearEvents.value
    const color = heatMapColorForValue(ratio)
    return color
  }

  function monthColorFct (item) {
    const eventsCount = getEventCountForMonth(item)
    const ratio = eventsCount / maxMonthEvents.value
    const color = heatMapColorForValue(ratio)
    return color
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

  .timeline-wrapper {
    width: 100vw
  }
</style>