import React, { Component } from 'react';
import logo from './images/akira.png';
import Spinner from './images/Spinner.gif';
import BookingModal from './Modal.js';
import './App.css';
import { Alert, Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import AnalogClock, { Themes } from 'react-analog-clock';
import Moment from 'react-moment';
import 'moment-timezone';

Moment.globalLocale = 'en-ca';
Moment.globalElement = 'span';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      system_status: null,
      showBooking: false,
      showAbout: false,
      appAlert: null
    };
  }

  componentDidMount() {
    const getSystemStatus = () => {
      fetch("https://app.akira.md/api/system_status")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            system_status: result
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
    }
    setTimeout(getSystemStatus, 500);
  }

  toggleBooking = () => {
    this.setState({
      showBooking: !this.state.showBooking
    });
  }
  toggleAbout = () => {
    this.setState({
      showAbout: !this.state.showAbout
    })
  }

  Greeting = (props) => {
    const is_open = props.isOpen;
    if (is_open) {
      return <h1>We're Open!</h1>
    }
    return <h1>We're Closed</h1>
  }
  handleAlert = (appAlert) => {
    this.setState({ appAlert })
  }
  ShowAlert = (props) => {
    let appAlert = props.appAlert;
    if (appAlert) {
      return (
        <Alert color="success">
          {appAlert}
        </Alert>
      )
    };
    return null
  };

  render() {
    const { error, isLoaded, system_status } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return (
        <img id="loadingGif"
          src={Spinner}
          alt='loadingSpinner'
          width="128" height="128"
          />
      )
    } else {

      const {Greeting, ShowAlert} = this;
      const hours = system_status.open_hours_today;

      return (

        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <Button className="nav-links"
              color="success"
              onClick={this.toggleBooking}>
              Book an Appointment
            </Button>
            <BookingModal
              showBooking={this.state.showBooking}
              toggle={this.toggleBooking}
              handleAlert={this.handleAlert}
            />
          </header>
          <ShowAlert appAlert={this.state.appAlert} />
          <div id="main-card" className="card text-center">
            <div className="card-header">
              <Greeting isOpen={system_status.is_open_for_business} />
            </div>
            <div className="card-body">
              <div id="clock">
                <AnalogClock width={200} theme={Themes.navy} gmtOffset={'-5'}/>
              </div>
              <h5 className="card-title">
                Today's hours:  &nbsp;
                <Moment format='h a'>{hours.open_at}</Moment>
                &nbsp; to &nbsp;
                <Moment format='h a'>{hours.close_at}</Moment>
              </h5>
               <Button color="success" size='lg' href="https://akira.md/download.html">
                 Get the app
               </Button>
            </div>
            <div className="card-footer text-muted">
              <span>Last updated:&nbsp;</span>
              <span>
                <Moment format='MMMM Do YYYY, h:mm:ss a'>{system_status.system_time}</Moment>
              </span>
            </div>
          </div>
            <Button color="link" onClick={this.toggleAbout} style={{ margin: '10px' }}>About</Button>
            <Modal isOpen={this.state.showAbout}>
              <ModalHeader toggle={this.toggleAbout}>About this page</ModalHeader>
              <ModalBody>
                This page is build with React and Bootstrap. It&#39;s purpose is to retrieve data from the server and display it for clients to see. The booking form uses React-dates to disable days that the doctors are not available. Additional npm packages are reactstrap, react-analog-clock and react-moment.
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" onClick={this.toggleAbout}>Close</Button>
              </ModalFooter>
            </Modal>
        </div>
      );
    }
  }
}

export default App;
