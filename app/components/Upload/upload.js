import React, { Component } from 'react'
import { connect } from 'react-redux'
import NotLogged from './notLogged'
import UploadForm from './uploadForm'

class Upload extends Component {
  render () {
    let component

    if (this.props.site.cert_user_id) {
      component = <UploadForm />
    } else {
      component = <NotLogged />
    }

    return (
      <div>
        {component}
      </div>
    )
  }
};

function mapStateToProps (state) {
  return {
    site: state.site
  }
}

export default connect(
  mapStateToProps
)(Upload)
