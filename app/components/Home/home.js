import React, { Component } from 'react'
import { connect } from 'react-redux'
import ZeroFrame from 'zeroframe'
import { bindActionCreators } from 'redux'
import * as videosActions from '../../videos/actions'

class Home extends Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  componentWillMount () {
    ZeroFrame.cmd('dbQuery', ['SELECT * FROM video ORDER BY date_added'], (data) => {
      console.log(data)
      this.props.actions.updateVideos(data)
    })
  }

  render () {
    let style = {
      marginTop: '20%'
    }
    return (
      <img style={style} src="public/img/zero_degrade.png" className="img-fluid m-x-auto d-block" ></img>
    )
  }
};

function mapStateToProps (state) {
  return {
    site: state.site,
    videos: state.videos
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
