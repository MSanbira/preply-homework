import React from "react";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import OnlineStatusMock from "./OnlineStatusMock";
import "./App.css";

/* 
Feel free to edit this all. If you don't need the HoC, go remove it. 
If you wish to save the state somewhere else, go for it. 
Just keep rendering <OnlineStatusMock /> 
*/

const withOnlineStatus = (WrappedComponent) =>
  class WithOnlineStatus extends React.Component {
    constructor(props) {
      super(props);
      this.state = { isOnline: false };
    }
    render() {
      const { isOnline } = this.state;
      return (
        <>
          <OnlineStatusMock
            onIsOnlineChange={(isOnline) => this.setState({ isOnline })}
          />
          <WrappedComponent {...this.props} isOnline={isOnline} />
        </>
      );
    }
  };

class App extends React.Component {
  state = {
    isDisconnected: !this.props.isOnline
  };

  reconnectionTimout;

  componentDidUpdate({ isOnline }, { isDisconnected }) {
    if (isDisconnected !== this.state.isDisconnected) {
      NotificationManager.info(
        this.state.isDisconnected ? "offline" : "Online"
      );
    }

    if (isOnline !== this.props.isOnline) {
      if (this.props.isOnline) {
        this.setState({ isDisconnected: false });
        clearTimeout(this.reconnectionTimout);
      } else {
        this.reconnectionTimout = setTimeout(() => {
          this.setState({ isDisconnected: true });
        }, 2000);
      }
    }
  }

  render() {
    const { isOnline } = this.props;
    return (
      <>
        <div className={isOnline ? "online" : "offline"}>
          {isOnline ? "Online" : "Offline"}
          <NotificationContainer />
        </div>
      </>
    );
  }
}

export default withOnlineStatus(App);
