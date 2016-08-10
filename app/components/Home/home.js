import React, { Component } from 'react'
import { connect } from 'react-redux'
import ZeroFrame from 'zeroframe'
import { bindActionCreators } from 'redux'
import * as videosActions from '../../videos/actions'
import VideoCard from './videocard'

class Home extends Component {
  constructor (props) {
    super(props)

    console.log(props)

    this.state = {}
  }

  componentWillMount () {
    ZeroFrame.cmd('dbQuery', ['SELECT * FROM video ORDER BY date_added LIMIT 5'], (data) => {
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
            console.log(video)
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
