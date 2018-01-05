import React, { Component } from 'react';
import logo from './images/akira.png';
import Spinner from './images/Spinner.gif';
import BookAppointmentForm from './BookAppointmentForm.js';
import './App.css';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
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
      showBooking: false
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
      this.setState({
        showBooking: !this.state.showBooking
      });
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

  render() {
    const { error, isLoaded } = this.state;
    const system_status = this.state.system_status;

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

      const hours = this.state.system_status.open_hours_today;

      return (

        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <Button className="nav-links" color="success" onClick={this.toggle}>Book an Appointment</Button>
              <Modal isOpen={this.state.showBooking} toggle={this.toggle} className={this.props.className}>
                <ModalHeader toggle={this.toggle}>Book An Appointment</ModalHeader>
                <ModalBody>
                  <BookAppointmentForm close={this.toggle}/>
                </ModalBody>
                <ModalFooter>
                  <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                </ModalFooter>
              </Modal>
          </header>
          <div id="main-card" className="card text-center">
            <div className="card-header">
              <h1>
                {system_status.is_open_for_business?
                  `We're Open!` : `We're Closed`}
              </h1>
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
        </div>
      );
    }
  }
}

export default App;
