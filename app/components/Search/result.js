import React, { Component } from 'react'
import { connect } from 'react-redux'
import ZeroFrame from 'zeroframe'
import { bindActionCreators } from 'redux'
import * as videosActions from '../../videos/actions'
import VideoCard from '../videocard'

class Result extends Component {
  constructor (props) {
    super(props)

    console.log(this.props.location.query.search)

    this.state = {
      videos: []
    }
  }

  componentDidMount () {
    let cmd = 'dbQuery'
    let query = "SELECT * FROM video WHERE title LIKE '%" + this.props.location.query.search + "%'"
    ZeroFrame.cmd(cmd, [query], (data) => {
      console.log(data)
      this.setState({
        videos: data
      })
    })
  }

  render () {
    let style = {
      marginTop: '100px'
    }
    return (
      <div style={style} className="row">
        {this.state.videos.map((video, i) => {
          return <VideoCard video={video} webtorrent={this.props.webtorrent} />
        })}
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
)(Result)
