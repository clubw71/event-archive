const archive = require('../data/archiv.json')
const fs = require('fs')

const transformPerYear = (array) => {
  const yearItems = array.reduce((acc, item) => {
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
  return yearItems
}

const exportToFile = () => {
  const yearItems = transformPerYear(archive)
  fs.writeFileSync('./year_archiv.json', JSON.stringify(yearItems, null, 2))
}

exportToFile()