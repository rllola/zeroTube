import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as videosActions from '../../videos/actions'
import VideoCard from '../videocard'

class Profile extends Component {
  constructor (props) {
    super(props)

    this.state = {
      mine: (this.props.params.zeroID === this.props.site.cert_user_id)
    }
  }

  componentWillMount () {
    this.props.actions.getVideosByUser(this.props.params.zeroID)
  }

  render () {
    return (
      <div>
        <h1>Profile page</h1>
        <p>{this.props.site.cert_user_id}</p>
        <br />
        <h2>Channel</h2>
        <div className="card-columns">
          {this.props.videos.map((video, i) => {
            return <VideoCard video={video} webtorrent={this.props.webtorrent} />
          })}
        </div>
      </div>
    )
  }
}

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
)(Profile)
