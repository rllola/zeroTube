/* global XMLHttpRequest */

import ZeroFrame from 'zeroframe'

class Storage {
  constructor (chunkLength, opts = {}) {
    if (!opts.torrent) throw new Error('Hey ! I need the infoHash of the torrent ;)')
    if (!opts.files) throw new Error('Path of the file need to be specified')

    this.chunkLength = Number(chunkLength)
    if (!this.chunkLength) throw new Error('First argument must be a chunk length')

    this.chunks = []
    this.closed = false
    this.length = Number(opts.length) || Infinity

    this.torrent = opts.torrent
    var pathArr = opts.files[0].path.split('/')
    pathArr.splice(5, 1)
    var path = pathArr.join('/')
    this.path = '/' + path + '/' + this.torrent.infoHash + '/'

    if (this.length !== Infinity) {
      this.lastChunkLength = (this.length % this.chunkLength) || this.chunkLength
      this.lastChunkIndex = Math.ceil(this.length / this.chunkLength) - 1
    }
  }

  put (index, buf, cb) {
    console.log('Put')
    if (this.closed) return nextTick(cb, new Error('Storage is closed'))

    var isLastChunk = (index === this.lastChunkIndex)
    if (isLastChunk && buf.length !== this.lastChunkLength) {
      return nextTick(cb, new Error('Last chunk length must be ' + this.lastChunkLength))
    }
    if (!isLastChunk && buf.length !== this.chunkLength) {
      return nextTick(cb, new Error('Chunk length must be ' + this.chunkLength))
    }
    this.chunks[index] = buf
    console.log(buf)
    /* INSERT ZEROFRAME LOGIC HERE */
    ZeroFrame.cmd('fileWrite', [this.path + index + '.dat', buf.toString('base64')], (res) => {
      console.log(res)
      nextTick(cb, null)
    })
  }

  get (index, opts, cb) {
    if (typeof opts === 'function') return this.get(index, null, opts)
    if (this.closed) return nextTick(cb, new Error('Storage is closed'))
    console.log('get index:', index)
    var buf = this.chunks[index]
    if (!buf) {
      requestBinary(this.path + index + '.dat' + '?_r=' + Math.random(), 'arraybuffer',
          (xmlHttp) => {
            console.log(xmlHttp.response)
            if (!xmlHttp.response) return nextTick(cb, new Error('Chunk not found'))
            try {
              buf = new Buffer(xmlHttp.response)
            } catch (e) {
              return nextTick(cb, new Error('Could not create Buffer'))
            }
            this.chunks[index] = buf
            if (!opts) return nextTick(cb, null, buf)
            var offset = opts.offset || 0
            var len = opts.length || (buf.length - offset)
            nextTick(cb, null, buf.slice(offset, len + offset))
          },
          (xmlHttp, reason) => { return nextTick(cb, new Error('Chunk not found')) })
    }
  }

  close (cb) {
    console.log('Close Storage')
    if (this.closed) return nextTick(cb, new Error('Storage is closed'))
    this.closed = true
    nextTick(cb, null)
  }

  destroy (cb) {
    console.log('Destroy Storage')
    this.closed = true
    this.chunks = null
    nextTick(cb, null)
  }

}

function nextTick (cb, err, val) {
  if (err) {
    console.error('Something went wrong :', err)
  }
  process.nextTick(function () {
    if (cb) cb(err, val)
  })
}

function requestBinary (url, responseType, callback, failure) {
  requestAsync(url, null, responseType, callback, failure)
}

function requestAsync (url, minetype, responseType, callback, failure) {
  var xmlHttp = new XMLHttpRequest()

  xmlHttp.onload = () => {
    callback(xmlHttp)
  }

  xmlHttp.onerror = (reason) => {
    failure(xmlHttp, reason)
  }

  xmlHttp.onabort = xmlHttp.onerror
  xmlHttp.ontimeout = xmlHttp.onerror

  xmlHttp.open('GET', url, true)

  xmlHttp.timeout = 20000

  if (minetype != null) {
    xmlHttp.overrideMimeType(minetype)
  }
  if (responseType != null) {
    xmlHttp.responseType = responseType
  }

  try {
    xmlHttp.send(null)
  } catch (exception) {
    failure(xmlHttp, exception)
  }
}

export default Storage
