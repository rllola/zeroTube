import React, { Component } from 'react'
import Feedback from './feedback'
import { connect } from 'react-redux'
import ZeroFrame from 'zeroframe'
import { bindActionCreators } from 'redux'
import * as videosActions from '../../videos/actions'

class UploadForm extends Component {
  constructor (props) {
    super(props)

    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this)
    this.handleVideoChange = this.handleVideoChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.startSeeding = this.startSeeding.bind(this)
    this.onSeed = this.onSeed.bind(this)

    this.state = {
      status: 'none'
    }
  }

  handleTitleChange (e) {
    this.setState({title: e.target.value})
  }

  handleDescriptionChange (e) {
    this.setState({description: e.target.value})
  }

  handleVideoChange (e) {
    this.setState({video: e.target.files[0]})
  }

  handleSubmit (e) {
    e.preventDefault()
    this.setState({status: 'is_uploading'})
    this.startSeeding()
  }

  startSeeding () {
    this.props.webtorrent.client.on('error', (err) => {
      if (err.message.search('Cannot add duplicate torrent') !== -1) {
        console.log('Warning this torrent is already in the client')
        let torrentID = err.message.split(' ')[4]
        this.props.webtorrent.client.remove(torrentID, (err) => {
          if (!err) {
            this.startSeeding()
          } else {
            this.setState({status: 'error', message: err})
          }
        })
      } else {
        this.setState({status: 'error', message: err})
      }
    })
/*    let innerPathFile = 'data/users/' + this.props.site.auth_address + '/' + this.state.video.name
    ZeroFrame.cmd('fileWrite', [innerPathFile, window.btoa(this.state.video)], (res) => {
      console.log('File saved !')
    }) */
    let opts = {
      announce: [
        'ws://198.211.121.40:8100/',
        'wss://tracker.webtorrent.io',
        'wss://tracker.openwebtorrent.com'
      ]
    }
    this.props.webtorrent.client.seed(this.state.video, opts, this.onSeed)
  }

  onSeed (torrent) {
    let innerPath = 'data/users/' + this.props.site.auth_address + '/data.json'
    /* Verify if video already uploaded by user */
    let query = 'SELECT video.*, user.value AS user_name, user_json_content.directory AS user_address ' +
    'FROM video ' +
    'LEFT JOIN json AS user_json_data ON (user_json_data.json_id = video.json_id) ' +
    "LEFT JOIN json AS user_json_content ON (user_json_content.directory = user_json_data.directory AND user_json_content.file_name = 'content.json') " +
    'LEFT JOIN keyvalue AS user ON (user.json_id = user_json_content.json_id AND user.key = "cert_user_id") ' +
    'WHERE user_name = "' + this.props.site.cert_user_id + '" AND video.video_id = "' + torrent.infoHash + '"'
    ZeroFrame.cmd('dbQuery', [query], (data) => {
      if (!data.length) {
        /* torrent.files[0].getBlob((err, blob) => {
          console.log(blob)
          let innerPathFile = 'data/users/' + this.props.site.auth_address + '/' + this.state.video.name
          ZeroFrame.cmd('fileWrite', [innerPathFile, window.btoa(blob)], (res) => {
            console.log('File saved !')
          })
        })*/
        ZeroFrame.cmd('fileGet', {'inner_path': innerPath, 'required': false}, (data) => {
          if (data) {
            data = JSON.parse(data)
          } else {
            data = { 'video': [] }
          }
          data.video.push({
            'video_id': torrent.infoHash,
            'title': this.state.title,
            'description': this.state.description,
            'magnet': torrent.magnetURI,
            'date_added': new Date()
          })
          let jsonRaw = unescape(encodeURIComponent(JSON.stringify(data, undefined, '\t')))
          ZeroFrame.cmd('fileWrite', [innerPath, window.btoa(jsonRaw)], (res) => {
            if (res === 'ok') {
              ZeroFrame.cmd('sitePublish', {'inner_path': innerPath}, (res) => {
                this.setState({status: 'is_uploaded', magnetURI: torrent.magnetURI})
              })
            } else {
              ZeroFrame.cmd('wrapperNotification', ['error', 'File write error:' + res])
              this.setState({status: 'error', message: res})
            }
          })
        })
      } else {
        this.setState({status: 'warning'})
      }
    })
  }

  render () {
    return (
      <div>
        <Feedback status={this.state.status} message={this.state.message} magnetURI={this.state.magnetURI} />
        <form id="uploadForm" onSubmit={this.handleSubmit}>
          <fieldset className="form-group">
            <label htmlFor="title">Title</label>
            <input className="form-control" type="text" name="title" value={this.state.title} onChange={this.handleTitleChange} required />
          </fieldset>
          <fieldset className="form-group">
            <label htmlFor="description">Description</label>
            <textarea className="form-control" name="description" value={this.state.description} onChange={this.handleDescriptionChange} rows="3" required></textarea>
          </fieldset>
          <fieldset className="form-group">
            <label htmlFor="file">Video <small className="text-muted">( .mkv extension not supported, prefered .mp4)</small></label>
            <input className="form-control-file" type="file" value={this.state.video} onChange={this.handleVideoChange} accept="video/*" name="file" required /><br /><br />
          </fieldset>
          <div className="clearfix">
            <button className={'btn btn-outline-primary pull-right ' + (this.state.status === 'is_uploading' ? 'disabled' : null)} type="submit" >Upload</button>
          </div>
        </form>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    site: state.site,
    webtorrent: state.webtorrent
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(videosActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadForm)
