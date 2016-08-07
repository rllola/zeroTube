import React, { Component } from 'react'
import { connect } from 'react-redux'
import ZeroFrame from 'zeroframe'
import { bindActionCreators } from 'redux'
import * as videosActions from '../../videos/actions'

class Upload extends Component {
  constructor (props) {
    super(props)

    this.handleTextChange = this.handleTextChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    this.state = {}
  }

  handleNameChange (e) {
    this.setState({name: e.target.value})
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
      } else {
        data = { 'message': [] }
      }
      data.message.push({
        'body': this.state.text,
        'date_added': new Date()
      })
      var jsonRaw = unescape(encodeURIComponent(JSON.stringify(data, undefined, '\t')))
      ZeroFrame.cmd('fileWrite', [innerPath, btoa(jsonRaw)], (res) => {
        if (res === 'ok') {
          console.log('ok')
          ZeroFrame.cmd('sitePublish', {'inner_path': innerPath}, (res) => {
            console.log(res)
          })
          ZeroFrame.cmd('dbQuery', ['SELECT * FROM message ORDER BY date_added'], (data) => {
            this.props.actions.updateVideos(data)
          })
        } else {
          ZeroFrame.cmd('wrapperNotification', ['error', 'File write error:' + res])
        }
      })
    })
  }

  render () {
    return (
      <form onSubmit={this.handleSubmit}>
        <fieldset className="form-group">
          <label for="title">Name</label>
          <input className="form-control" type="text" name="title" value={this.state.name} onChange={this.handleNameChange} required />
        </fieldset>
        <fieldset className="form-group">
          <label for="description">Description</label>
          <textarea className="form-control" name="description" rows="3" required></textarea>
        </fieldset>
        <fieldset className="form-group">
          <label for="file">Video</label>
          <input className="form-control-file" type="file" accept="video/*" name="file" required /><br /><br />
        </fieldset>
        <div className="clearfix">
          <input className="btn btn-primary-outline pull-right" type="submit" value="Upload" />
        </div>
      </form>
    )
  }
};

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(videosActions, dispatch)
  }
}

export default connect(
  mapDispatchToProps
)(Upload)
