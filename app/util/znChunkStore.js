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

    console.log(this.chunkLength)

    this.notOnZN = false

    this.test = null

    this.printOnce = {
      put: false,
      get: false
    }

    this.torrent = opts.torrent
    var pathArr = opts.files[0].path.split('/')
    pathArr.splice(4, 1)
    var path = pathArr.join('/')
    this.path = '/' + path + '/' + this.torrent.infoHash + '/'

    if (this.length !== Infinity) {
      this.lastChunkLength = (this.length % this.chunkLength) || this.chunkLength
      this.lastChunkIndex = Math.ceil(this.length / this.chunkLength) - 1
    }
  }

  put (index, buf, cb) {
    console.log('put')
    if (this.closed) return nextTick(cb, new Error('Storage is closed'))

    var isLastChunk = (index === this.lastChunkIndex)
    if (isLastChunk) {
      this.notOnZN = false
    }
    if (isLastChunk && buf.length !== this.lastChunkLength) {
      return nextTick(cb, new Error('Last chunk length must be ' + this.lastChunkLength))
    }
    if (!isLastChunk && buf.length !== this.chunkLength) {
      return nextTick(cb, new Error('Chunk length must be ' + this.chunkLength))
    }
    /* Save memory don't use it */
    // this.chunks[index] = buf
    /* INSERT ZEROFRAME LOGIC HERE */
    if (!this.printOnce.put & index === 1) {
      console.log('index:', index)
      console.log(buf)
      this.test = buf
      this.printOnce.put = true
    }
    ZeroFrame.cmd('fileWrite', [this.path + index + '.dat', buf.toString('base64')], (res) => {
      // console.log(res)
      nextTick(cb, null)
    })
  }

  get (index, opts, cb) {
    console.log('get')
    if (typeof opts === 'function') return this.get(index, null, opts)
    if (this.closed) return nextTick(cb, new Error('Storage is closed'))
    var buf = this.chunks[index]
    if (!buf) {
      if (!this.notOnZN) {
        // YES IT MUST BE DOUBLE QUOTES OR THIS NOT WORK ! I LOST A FULL DAY BECAUSE OF THIS
        requestBinary('/11SBfumiwgGhtLP6R6VvWumGAAVEbDgpU' + this.path + index + '.dat' + '?_r=' + Math.random(), "arraybuffer",
            (xmlHttp) => {
              if (!xmlHttp.response) return nextTick(cb, new Error('Chunk not found'))
              try {
                buf = new Uint8Array(xmlHttp.response)
                // var result = new Uint8Array(buf)
                if (!this.printOnce.get & index === 1) {
                  console.log('index:', index)
                  console.log(xmlHttp)
                  console.log(buf)
                  console.log(this.test === buf)
                  this.printOnce.get = true
                }
              } catch (e) {
                console.log('Fail')
                return nextTick(cb, new Error('Could not create Buffer'))
              }
              this.chunks[index] = buf
              if (!opts) return nextTick(cb, null, buf)
              var offset = opts.offset || 0
              var len = opts.length || (buf.length - offset)
              nextTick(cb, null, buf.slice(offset, len + offset))
            },
            (xmlHttp, reason) => {
              this.notOnZN = true
              return nextTick(cb, new Error('Chunk not found'))
            })
      } else {
        return nextTick(cb, new Error('Chunk not found'))
      }
    } else {
      if (buf && !this.printOnce.get) {
        console.log(buf.length)
        this.printOnce.get = true
      }
      if (!opts) return nextTick(cb, null, buf)
      var offset = opts.offset || 0
      var len = opts.length || (buf.length - offset)
      nextTick(cb, null, buf.slice(offset, len + offset))
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
  process.nextTick(function () {
    if (cb) cb(err, val)
  })
}

function requestBinary (url, responseType, callback, failure) {
  requestAsync(url, null, responseType, callback, failure)
  // requestAsync(url, responseType, null, callback, failure)
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

  // xmlHttp.responseType = "arraybuffer"

  try {
    xmlHttp.send(null)
  } catch (exception) {
    failure(xmlHttp, exception)
  }
}

export default Storage
