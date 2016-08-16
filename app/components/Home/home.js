import React, { Component } from 'react'
import { connect } from 'react-redux'
import ZeroFrame from 'zeroframe'
import { bindActionCreators } from 'redux'
import * as videosActions from '../../videos/actions'
import VideoCard from '../videocard'

class Home extends Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  componentWillMount () {
    let cmd = 'dbQuery'
    let query = "SELECT video.*, user.value AS user_name, user_json_content.directory AS user_address FROM video LEFT JOIN json AS user_json_data ON (user_json_data.json_id = video.json_id) LEFT JOIN json AS user_json_content ON (user_json_content.directory = user_json_data.directory AND user_json_content.file_name = 'content.json') LEFT JOIN keyvalue AS user ON (user.json_id = user_json_content.json_id AND user.key = 'cert_user_id') ORDER BY date_added DESC LIMIT 5"
    ZeroFrame.cmd(cmd, [query], (data) => {
      console.log(data)
      this.props.actions.updateVideos(data)
    })
  }

  render () {
    let style = {
      marginTop: '100px'
    }
    return (
      <div>
        <img style={style} src="public/img/zero_degrade.png" className="img-fluid m-x-auto d-block" ></img>
        <br />
        <div className="row">
          {this.props.videos.map((video, i) => {
            return <VideoCard video={video} webtorrent={this.props.webtorrent} />
          })}
        </div>
      </div>

    )
  }
};

function mapStateToProps (state) {
  return {
    site: state.site,
    videos: state.videos,
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
)(Home)
