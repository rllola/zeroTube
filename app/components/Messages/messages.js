import React, { Component } from 'react';
import { connect } from 'react-redux';
import ZeroFrame from 'zeroframe';
import { bindActionCreators } from 'redux';
import * as messagesActions from '../../messages/actions';

class Messages extends Component {
  constructor(props) {
    super(props);

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = {};
  }

  componentWillMount() {
    ZeroFrame.cmd("dbQuery", ["SELECT * FROM message ORDER BY date_added"], (data) => {
      this.props.actions.updateMessages(data);
    });
  }

  handleClick() {
    ZeroFrame.cmd("certSelect", [["zeroid.bit"]], null);
  }

  handleTextChange(e) {
    this.setState({text: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    var inner_path = "data/users/"+ this.props.site.auth_address +"/data.json";
    ZeroFrame.cmd("fileGet", {"inner_path": inner_path, "required": false}, (data) => {
      if (data) {
        data = JSON.parse(data);
      } else {
        data = { "message": [] }
      }
      data.message.push({
          "body": this.state.text,
          "date_added": new Date()
      });
      var json_raw = unescape(encodeURIComponent(JSON.stringify(data, undefined, '\t')))
      ZeroFrame.cmd("fileWrite", [inner_path, btoa(json_raw)], (res) => {
        if (res == "ok") {
          console.log('ok');
          ZeroFrame.cmd("sitePublish", {"inner_path": inner_path}, (res) => {
            console.log(res);
          });
          ZeroFrame.cmd("dbQuery", ["SELECT * FROM message ORDER BY date_added"], (data) => {
            this.props.actions.updateMessages(data);
          });
        } else {
          ZeroFrame.cmd("wrapperNotification", ["error", "File write error:" + res]);
        }
      });
    });
  }

  render() {
    let form;
    if (this.props.site.cert_user_id) {
      form =  <form onSubmit={this.handleSubmit}>
                <h4>Glad to meet you {this.props.site.cert_user_id}</h4>
                <fieldset className="form-group">
                  <label htmlFor="message">Your message</label>
                  <textarea
                    id="message"
                    type="text"
                    className="form-control"
                    value={this.state.text}
                    onChange={this.handleTextChange} >
                  </textarea>
                </fieldset>
                <button type="submit" className="btn btn-primary">Submit</button>
              </form>
    } else {
      form =  <p>Too bad you need to be auth to post a message.<br/>
                <button type="button" className="btn btn-primary" onClick={this.handleClick}>Select user</button>
              </p>
    }

    return (
      <article>
        <h1>Leave me a message</h1>
        <p>
          Tell me what you think of it !
        </p>
        { form }
        <ul>
        { this.props.messages.map(function(message) {
            return <li>{message.body}</li>;
        }) }
        </ul>
      </article>
    );
  }
};


function mapStateToProps(state) {
  return {
    site: state.site,
    messages: state.messages
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(messagesActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Messages);
