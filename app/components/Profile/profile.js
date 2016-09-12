import React, { Component } from 'react'
import { connect } from 'react-redux'
import ZeroFrame from 'zeroframe'
import VideoCard from '../videocard'
import { resolve } from 'react-resolver'

@resolve('videos', ({ params }) => {
  let cmd = 'dbQuery'
  let query = 'SELECT video.*, user.value AS user_name, user_json_content.directory AS user_address ' +
  'FROM video ' +
  'LEFT JOIN json AS user_json_data ON (user_json_data.json_id = video.json_id) ' +
  "LEFT JOIN json AS user_json_content ON (user_json_content.directory = user_json_data.directory AND user_json_content.file_name = 'content.json') " +
  "LEFT JOIN keyvalue AS user ON (user.json_id = user_json_content.json_id AND user.key = 'cert_user_id') " +
  "WHERE user_name = '" + params.zeroID + "' ORDER BY date_added DESC"

  var promise = new Promise((resolve, reject) => {
    ZeroFrame.cmd(cmd, [query], (data) => {
      if (data.length > -1) {
        resolve(data)
      } else {
        reject(Error('Video not found'))
      }
    })
  })

  return promise
})
class Profile extends Component {
  constructor (props) {
    super(props)

    this.state = {
      mine: (this.props.params.zeroID === this.props.site.cert_user_id)
    }
  }

  render () {
    return (
      <div>
        <h1>Profile page</h1>
        <p>{this.props.params.zeroID}</p>
        <br />
        <h2>Channel</h2>
        <div className="card-columns">
          {this.props.videos.map((video, i) => {
            return <VideoCard video={video} mine={this.state.mine} authAddress={this.props.site.auth_address} webtorrent={this.props.webtorrent} />
          })}
        </div>
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
)(Profile)
