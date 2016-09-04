function Storage (chunkLength, opts) {
  if (!(this instanceof Storage)) return new Storage(chunkLength, opts)
  if (!opts) opts = {}

  this.chunkLength = Number(chunkLength)
  if (!this.chunkLength) throw new Error('First argument must be a chunk length')
  this.prefix = '/lscs/' + (opts.prefix || opts.files ? opts.files[0].path : Math.random().toString(36))

  this.chunks = []
  this.closed = false
  this.length = Number(opts.length) || Infinity
  this.overlap = false

  if (this.length !== Infinity) {
    this.lastChunkLength = (this.length % this.chunkLength) || this.chunkLength
    this.lastChunkIndex = Math.ceil(this.length / this.chunkLength) - 1
  }
}

Storage.prototype.put = function (index, buf, cb) {
  if (this.closed) return nextTick(cb, new Error('Storage is closed'))
  var isLastChunk = (index === this.lastChunkIndex)
  if (isLastChunk && buf.length !== this.lastChunkLength) {
    return nextTick(cb, new Error('Last chunk length must be ' + this.lastChunkLength))
  }
  if (!isLastChunk && buf.length !== this.chunkLength) {
    return nextTick(cb, new Error('Chunk length must be ' + this.chunkLength))
  }

  var toInsert = JSON.stringify(JSON.parse(JSON.stringify({object: buf, length: buf.length, time: Date.now()})))
  var succeed = false
  while (!succeed && !this.overlap) {
    try {
      localStorage.setItem(this.prefix + '_' + index, toInsert)
      succeed = true
    } catch (e) {
      var clearedSpace = 0
      while (clearedSpace < buf.length) {
        var oldestKey = localStorage.key(0)
        var oldestEntry = localStorage.getItem(oldestKey)
        var oldestTime = JSON.parse(oldestEntry).time
        var oldestLength = oldestEntry.length
        for (var key in localStorage) {
          if (!key.startsWith('/lscs/')) continue
          if (key.startsWith(this.prefix)) {
            continue
          }
          var tempEntry = localStorage.getItem(key)
          if (tempEntry == null) continue
          var tempObject = JSON.parse(tempEntry)
          if (tempObject.time < oldestTime) {
            oldestKey = key
            oldestTime = tempObject.time
            oldestLength = tempEntry.length
          }
        }
        if (oldestKey.startsWith(this.prefix)) {
          this.overlap = true
          break
        }
        localStorage.removeItem(oldestKey)
        clearedSpace += oldestLength
      }
    }
  }
  if (this.overlap) {
    this.chunks[index] = buf
  }

  nextTick(cb, null)
}

Storage.prototype.get = function (index, opts, cb) {
  if (typeof opts === 'function') return this.get(index, null, opts)
  if (this.closed) return nextTick(cb, new Error('Storage is closed'))
  var buf = this.chunks[index]
  if (!buf) {
    var lsItem = localStorage.getItem(this.prefix + '_' + index)
    if (lsItem != null) {
      buf = new Buffer(JSON.parse(lsItem).object.data)
      this.chunks[index] = buf
    }
  }

  if (!buf) return nextTick(cb, new Error('Chunk not found'))
  if (!opts) return nextTick(cb, null, buf)
  var offset = opts.offset || 0
  var len = opts.length || (buf.length - offset)
  nextTick(cb, null, buf.slice(offset, len + offset))
}

Storage.prototype.close = function (cb) {
  if (this.closed) return nextTick(cb, new Error('Storage is already closed'))
  this.closed = true
  nextTick(cb, null)
}

Storage.prototype.destroy = function (cb) {
  this.closed = true
  this.chunks = null
  for (var key in localStorage) {
    if (key.startsWith(this.prefix)) {
      localStorage.removeItem(key)
    }
  }
  nextTick(cb, null)
}

function nextTick (cb, err, val) {
  process.nextTick(function () {
    if (cb) cb(err, val)
  })
}

module.exports = Storage
