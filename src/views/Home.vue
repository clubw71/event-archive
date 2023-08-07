<template>
  <ArchiveTimeline
    :items="filteredItems"
    :searchIndex="searchIndex"
    :searchFilterResults="searchFilter.result"
    @search="handleSearchInput"
  />
</template>

<script setup>
  import ArchiveTimeline from '@/components/ArchiveTimeline.vue'
  import year_archiv from '@/data/year_archiv.json'
  import indexData from '@/data/index.json'
  
  const items = year_archiv

  import flexsearch from 'flexsearch'
  import readline from 'readline'
  import { onMounted, ref, reactive, computed, watch } from 'vue'

  let searchIndex = ref()
  let searchFilter = reactive({ result: [] })

  const filteredItems = computed(() => {
    searchFilter.result
    if (!searchFilter.result?.length) {
      return items
    }
    const filtered = []
    for (const filter of searchFilter.result) {
      const [year, month, index] = filter.split('-')
      const targetItem = items.find(i1 => i1.year === year).items.find(i2 => i2.month === month).items[parseInt(index)]
      filtered.push(targetItem)
    }
    const output = filtered.reduce((acc, item) => {
      const idx = acc.findIndex(i => i.year === item.year)
      if (~idx) {
        const yearItems = acc[idx].items
        const m_idx = yearItems.findIndex(i => i.month === item.month)
        if (~m_idx) {
          acc[idx].items[m_idx].items.push(item)
        } else {
          acc[idx].items.push({
            month: item.month,
            title: item.month,
            items: [item]
          })
        }
      } else {
        acc.push({
          year: item.year,
          title: item.year,
          items: [
            {
              month: item.month,
              title: item.month,
              items: [item]
            }
          ]
        })
      }
      return acc
    }, [])
    output.sort((a, b) => {
      if (a.year !== b.year) return parseInt(a.year) - parseInt(b.year)
      if (a.month !== b.month) return parseInt(a.month) - parseInt(b.month)
      return parseInt(a.day) - parseInt(b.day)
    })
    return output
  })

  async function importIndex (options={}) {
    const index = new flexsearch(options)
    for (const [key, data] of Object.entries(indexData)) {
      index.import(key, data)
    }
    return index
  }

  onMounted(async () => {
    searchIndex = await importIndex()
  })

  function handleSearchInput (query) {
    searchFilter.result = searchIndex.search(query)
  }
</script>
