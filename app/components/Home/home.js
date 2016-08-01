import React, { Component } from 'react';

class Home extends Component {
  render() {
    let style = {
      marginTop : '20%',
    }
    return (
      <img style={style} src="public/img/zero_degrade.png" className="img-fluid m-x-auto d-block" ></img>
    );
  }
};

export default Home;
