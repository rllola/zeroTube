import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as videosActions from '../videos/actions'
import ZeroFrame from 'zeroframe'

class LoadMore extends Component {
  constructor (props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    console.log('Load More')
    let cmd = 'dbQuery'
    let query = "SELECT video.*, user.value AS user_name, user_json_content.directory AS user_address FROM video LEFT JOIN json AS user_json_data ON (user_json_data.json_id = video.json_id) LEFT JOIN json AS user_json_content ON (user_json_content.directory = user_json_data.directory AND user_json_content.file_name = 'content.json') LEFT JOIN keyvalue AS user ON (user.json_id = user_json_content.json_id AND user.key = 'cert_user_id') ORDER BY date_added DESC LIMIT 5 OFFSET " + this.props.length
    ZeroFrame.cmd(cmd, [query], (data) => {
      this.props.actions.loadMore(data)
    })
  }

  render () {
    let style = {
      marginBottom: '20px',
      marginTop: '20px'
    }
    return (
      <button style={style} type="button" className="btn btn-outline-info btn-lg btn-block" onClick={this.handleClick}>Load More</button>
    )
  }
}

function mapStateToProps (state) {
  return {
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
)(LoadMore)
