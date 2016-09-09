import React, { Component } from 'react'
import { connect } from 'react-redux'
import ZeroFrame from 'zeroframe'
import { resolve } from 'react-resolver'

@resolve('video', (props) => {
  var cmd = 'dbQuery'
  var query = 'SELECT video.*, user.value AS user_name, user_json_content.directory AS user_address ' +
    'FROM video ' +
    'LEFT JOIN json AS user_json_data ON (user_json_data.json_id = video.json_id) ' +
    "LEFT JOIN json AS user_json_content ON (user_json_content.directory = user_json_data.directory AND user_json_content.file_name = 'content.json') " +
    'LEFT JOIN keyvalue AS user ON (user.json_id = user_json_content.json_id AND user.key = "cert_user_id") ' +
    'WHERE video.video_id="' + props.params.torrentID + '" AND video.json_id="' + props.params.json + '"'

  var promise = new Promise((resolve, reject) => {
    ZeroFrame.cmd(cmd, [query], (data) => {
      if (data.length > 0) {
        resolve(data[0])
      } else {
        reject(Error('Video not found'))
      }
    })
  })

  return promise
})
class Edit extends Component {
  constructor (props) {
    super(props)

    console.log(props)

    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.cancel = this.cancel.bind(this)

    this.state = {
      title: this.props.video.title,
      description: this.props.video.description
    }
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  handleTitleChange (e) {
    this.setState({title: e.target.value})
  }

  handleDescriptionChange (e) {
    this.setState({description: e.target.value})
  }

  handleSubmit (e) {
    e.preventDefault()
    let innerPath = 'data/users/' + this.props.site.auth_address + '/data.json'
    ZeroFrame.cmd('fileGet', {'inner_path': innerPath, 'required': false}, (data) => {
      if (data) {
        data = JSON.parse(data)
      }
      let index = data.video.map((element) => { return element.video_id }).indexOf(this.props.video.video_id)
      if (index > -1) {
        data.video[index].title = this.state.title
        data.video[index].description = this.state.description
      }
      let jsonRaw = unescape(encodeURIComponent(JSON.stringify(data, undefined, '\t')))
      ZeroFrame.cmd('fileWrite', [innerPath, window.btoa(jsonRaw)], (res) => {
        if (res === 'ok') {
          ZeroFrame.cmd('sitePublish', {'inner_path': innerPath}, (res) => {
            this.context.router.push({pathname: '/profile/' + this.props.site.cert_user_id})
          })
        } else {
          ZeroFrame.cmd('wrapperNotification', ['error', 'File write error:' + res])
        }
      })
    })
  }

  handleDelete () {
    let innerPath = 'data/users/' + this.props.site.auth_address + '/data.json'
    this.props.webtorrent.client.remove(this.props.video.video_id)
    ZeroFrame.cmd('fileGet', {'inner_path': innerPath, 'required': false}, (data) => {
      if (data) {
        data = JSON.parse(data)
      } else {
        data = { 'video': [] }
      }
      let index = data.video.map((element) => { return element.video_id }).indexOf(this.props.video.video_id)
      data.video.splice(index, 1)
      let jsonRaw = unescape(encodeURIComponent(JSON.stringify(data, undefined, '\t')))
      ZeroFrame.cmd('fileWrite', [innerPath, window.btoa(jsonRaw)], (res) => {
        if (res === 'ok') {
          ZeroFrame.cmd('sitePublish', {'inner_path': innerPath}, (res) => {
            this.context.router.push({pathname: '/profile/' + this.props.site.cert_user_id})
          })
        } else {
          ZeroFrame.cmd('wrapperNotification', ['error', 'File write error:' + res])
        }
      })
    })
  }

  cancel (e) {
    this.context.router.push({pathname: '/profile/' + this.props.site.cert_user_id})
  }

  render () {
    return (
      <div>
        <form id="editForm" onSubmit={this.handleSubmit}>
          <fieldset className="form-group">
            <label htmlFor="title">Title</label>
            <input className="form-control" type="text" name="title" value={this.state.title} onChange={this.handleTitleChange} required />
          </fieldset>
          <fieldset className="form-group">
            <label htmlFor="description">Description</label>
            <textarea className="form-control" name="description" value={this.state.description} onChange={this.handleDescriptionChange} rows="3" required></textarea>
          </fieldset>
          <div className="clearfix">
            <button className="btn btn-outline-danger" onClick={this.handleDelete} type="button" >Delete</button>
            <div className="pull-right">
              <button className="btn btn-outline-warning" onClick={this.cancel} type="button" >Cancel</button> <button className="btn btn-outline-primary" type="submit" >Save</button>
            </div>
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

export default connect(
  mapStateToProps
)(Edit)
