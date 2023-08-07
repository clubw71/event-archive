const { Index } = require('flexsearch')
const archiv = require('../data/archiv.json')
const fs = require('fs')
const readline = require('readline')

const buildIndex = async () => {
  const options = {}
  const index = new Index(options)

  const yearMonthCounter = {}

  for (const item of archiv) {
    const counterKey = `${item.year}-${item.month}`
    if (yearMonthCounter[counterKey] !== undefined) {
      yearMonthCounter[counterKey] += 1
    } else {
      yearMonthCounter[counterKey] = 0
    }
    const itemIndex = yearMonthCounter[counterKey]
    const id = `${counterKey}-${itemIndex}`
    const content = `${item.title} ${item.description}`
    index.add(id, content)
  }

  const idxFile = fs.createWriteStream('./search.idx')
  index.export((key, data) => {
    const line = `${key}\t${data}\n`
    idxFile.write(line)
  })

  // check import

  const importedIndex = new Index(options)
  const importFile = fs.createReadStream('./search.idx')
  const lineReader = readline.createInterface(importFile)
  const importData = {}
  for await (const line of lineReader) {
    const [key, data] = line.split('\t')
    importedIndex.import(key, data)
    importData[key] = data
  }
  const s = index.search('reise')
  console.log(s)
  fs.writeFileSync('index.json', JSON.stringify(importData, null, 2))
  
}

buildIndex().then(() => console.log('done'))