import React, { Component } from 'react'
import { connect } from 'react-redux'
import VideoCard from '../videocard'

class Result extends Component {
  render () {
    let style = {
      marginTop: '100px'
    }
    if (this.props.videos.length === 0) {
      return (
        <h1 className="text-center text-muted">
          No result found, sorry.
        </h1>
      )
    }
    return (
      <div>
        <div style={style} className="card-columns">
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
    videos: state.videos,
    webtorrent: state.webtorrent
  }
}

export default connect(
  mapStateToProps
)(Result)
