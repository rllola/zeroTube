import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as videosActions from '../../videos/actions'
import VideoCard from '../videocard'
import LoadMore from '../loadMore'
import Constants from '../../util/constants'

class Home extends Component {
  constructor () {
    super()

    this.peersFound = this.peersFound.bind(this)

    this.state = {
      loading: true
    }
  }

  componentWillMount () {
    this.props.actions.latestVideos()
  }

  peersFound () {
    this.setState({loading: false})
  }

  render () {
    let style = {
      marginTop: '100px'
    }

    return (
      <div>
        <img style={style} src={'/' + Constants.APP_ID + '/public/img/zero_degrade.png'} className="img-fluid m-x-auto d-block" ></img>
        <br />
        {this.state.loading ? <div className="row"><h2>We are looking for peers...</h2></div> : null}
        <div className="row">
          {this.props.videos.map((video, i) => {
            return <VideoCard video={video} webtorrent={this.props.webtorrent} homepage={true} callback={this.peersFound} />
          })}
        </div>
        {(this.props.site.total_video > this.props.videos.length) ? <LoadMore length={this.props.videos.length} /> : null}
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
)(Home)
