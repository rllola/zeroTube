import React, { Component } from 'react'
import ZeroFrame from 'zeroframe'
import { connect } from 'react-redux'

class Watch extends Component {
  constructor (props) {
    super(props)

    console.log(props)

    this.state = {
      video: {}
    }
  }

  componentDidMount () {
    let cmd = 'dbQuery'
    let query = 'SELECT * FROM video WHERE video_id="' + this.props.params.torrentID + '" AND json_id="' + this.props.params.json + '"'
    ZeroFrame.cmd(cmd, [query], (data) => {
      this.setState({video: data[0]})
      let torrent = this.props.webtorrent.client.get(data[0].video_id)
      if (!torrent) {
        this.props.webtorrent.client.add(data[0].magnet, (torrent) => {
          torrent.on('done', () => {
            console.log('Done !')
          })
          torrent.files[0].appendTo('#video')
        })
      } else {
        console.log('torrent already addded')
        /* torrent.on('download', function (bytes) {
          console.log('just downloaded: ' + bytes)
          console.log('total downloaded: ' + torrent.downloaded)
          console.log('download speed: ' + torrent.downloadSpeed)
          console.log('progress: ' + torrent.progress)
        }) */
        torrent.critical()
        torrent.files[0].appendTo('#video')
      }
    })
  }

  render () {
    return (
      <div>
        <div id="video" className="row"></div>
        <h1>{this.state.video.title}</h1>
        <p>{this.state.video.description}</p>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    webtorrent: state.webtorrent
  }
}

export default connect(
  mapStateToProps
)(Watch)
