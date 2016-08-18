import React, { Component } from 'react'
import { connect } from 'react-redux'
import VideoCard from '../videocard'

class Result extends Component {
  render () {
    let style = {
      marginTop: '100px'
    }
    return (
      <div style={style} className="card-deck">
        {this.props.videos.map((video, i) => {
          return <VideoCard video={video} webtorrent={this.props.webtorrent} />
        })}
      </div>
    )
  }
};

function mapStateToProps (state) {
  return {
    videos: state.videos,
    webtorrent: state.webtorrent
  }
}

export default connect(
  mapStateToProps
)(Result)
