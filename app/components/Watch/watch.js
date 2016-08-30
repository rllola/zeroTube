import React, { Component } from 'react'
import ZeroFrame from 'zeroframe'
import { connect } from 'react-redux'
import moment from 'moment'
import { Link } from 'react-router'

class Watch extends Component {
  constructor (props) {
    super(props)

    this.state = {
      video: {}
    }
  }

  componentDidMount () {
    let cmd = 'dbQuery'
    let query = 'SELECT video.*, user.value AS user_name, user_json_content.directory AS user_address ' +
    'FROM video ' +
    'LEFT JOIN json AS user_json_data ON (user_json_data.json_id = video.json_id) ' +
    "LEFT JOIN json AS user_json_content ON (user_json_content.directory = user_json_data.directory AND user_json_content.file_name = 'content.json') " +
    'LEFT JOIN keyvalue AS user ON (user.json_id = user_json_content.json_id AND user.key = "cert_user_id") ' +
    'WHERE video.video_id="' + this.props.params.torrentID + '" AND video.json_id="' + this.props.params.json + '"'
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
        torrent.on('download', (bytes) => {
          this.setState({downloaded: torrent.downloaded, speed: torrent.downloadSpeed, progress: torrent.progress})
        })
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
        <small className="text-muted">
          Added {moment(this.state.video.date_added).fromNow()} by <Link to={'/profile/' + this.state.video.user_name}>{this.state.video.user_name}</Link>
        </small>
        <div className="alert alert-info" role="alert">
          <a className="nav-link" target="_blank" href={this.state.video.magnet}>Magnet URI</a> <br />
          <strong>Progress</strong>: {this.state.progress} <strong>Downloaded</strong>: {this.state.downloaded} <strong>Speed</strong>: {this.state.speed}
        </div>
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
