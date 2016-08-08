import React, { Component } from 'react'
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

    console.log(this.props.webtorrent)

    this.state = {}
  }

  handleTitleChange (e) {
    this.setState({name: e.target.value})
  }

  handleDescriptionChange (e) {
    this.setState({description: e.target.value})
  }

  handleVideoChange (e) {
    console.log(e.target.files[0])
    this.setState({video: e.target.files[0]})
  }

  handleSubmit (e) {
    e.preventDefault()
    let innerPath = 'data/users/' + this.props.site.auth_address + '/data.json'
    console.log(this.state.video)
    this.props.webtorrent.client.seed(this.state.video, (torrent) => {
      console.log('Client is seeding:', torrent.infoHash)
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
            console.log('ok')
            /*  ZeroFrame.cmd('sitePublish', {'inner_path': innerPath}, (res) => {
              console.log(res)
            })*/
            ZeroFrame.cmd('dbQuery', ['SELECT * FROM video ORDER BY date_added'], (data) => {
              console.log(data)
              //  this.props.actions.updateVideos(data)
            })
          } else {
            ZeroFrame.cmd('wrapperNotification', ['error', 'File write error:' + res])
          }
        })
      })
    })
  }

  render () {
    return (
      <form onSubmit={this.handleSubmit}>
        <fieldset className="form-group">
          <label htmlFor="title">Title</label>
          <input className="form-control" type="text" name="title" value={this.state.title} onChange={this.handleTitleChange} required />
        </fieldset>
        <fieldset className="form-group">
          <label htmlFor="description">Description</label>
          <textarea className="form-control" name="description" value={this.state.description} onChange={this.handleDescriptionChange} rows="3" required></textarea>
        </fieldset>
        <fieldset className="form-group">
          <label htmlFor="file">Video</label>
          <input className="form-control-file" type="file" value={this.state.video} onChange={this.handleVideoChange} accept="video/*" name="file" required /><br /><br />
        </fieldset>
        <div className="clearfix">
          <input className="btn btn-primary-outline pull-right" type="submit" value="Upload" />
        </div>
      </form>
    )
  }
};

function mapStateToProps (state) {
  console.log(state)
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
