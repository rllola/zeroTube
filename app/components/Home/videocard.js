import React, { Component } from 'react'

class VideoCard extends Component {
  constructor (props) {
    super(props)

    this.state = {
      poster: 'public/img/hex-loader2.gif'
    }
  }

  componentWillMount () {
    let torrent = this.props.webtorrent.client.get(this.props.video.video_id)
    if (!torrent) {
      this.props.webtorrent.client.add(this.props.video.magnet, (torrent) => {
        console.log(torrent.numPeers)
        torrent.on('done', () => {
          console.log('Done !')
          this.createPosterVideo('#' + torrent.infoHash + ' > video')
        })
        torrent.files[0].appendTo('#' + torrent.infoHash)
      })
    } else {
      console.log('Get image')
    }
  }

  createPosterVideo (video, format) {

    if (typeof video === 'string') {
      video = document.querySelector(video)
    }

    video.volume = 0

    if (video == null || video.nodeName !== 'VIDEO') {
      throw new Error('First argument must be a <video> element or selector')
    }

    if (format == null) {
      format = 'png'
    }

    if (format !== 'png' && format !== 'jpg' && format !== 'webp') {
      throw new Error('Second argument must be one of "png", "jpg", or "webp"')
    }

    let canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    canvas.getContext('2d').drawImage(video, 0, 0)

    let dataUri = canvas.toDataURL('image/' + format)
    let data = dataUri.split(',')[1]

    // unload video element
    video.pause()
    video.src = ''
    video.load()

    this.setState({poster: 'data:image/png;base64,' + data})
  }

  render () {
    let style = {
      maxWidth: '20rem'
    }
    let none = {
      display: 'none'
    }
    return (
      <div className="col-md-4">
        <div style={style} className="card">
          <img className="card-img-top img-fluid" width='318' height='180' src={this.state.poster} alt="Card image cap" />
          <div className="card-block">
            <h4 className="card-title">{this.props.video.title}</h4>
            <p className="card-text">{this.props.video.description}</p>
            <a href="#" className="btn btn-primary">Watch it</a>
          </div>
          <div style={none} id={this.props.video.video_id}></div>
        </div>
      </div>
    )
  }
};

export default VideoCard
