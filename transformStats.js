const fs = require('fs')
const stats = require('./stats.json')

const newStats = {}

Object.keys(stats).forEach(key => {
  const newKey = JSON.stringify(key.split('\uffff'))
  newStats[newKey] = stats[key]
})

fs.writeFileSync('./newStats.json', JSON.stringify(newStats, null, 2))
