import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import Moment from 'react-moment';
import moment from 'moment';
import 'moment-timezone';

Moment.globalLocale = 'en-ca';
Moment.globalElement = 'span';
// Mock data
const doctorAvailability = {
  "Dr. Pamala An": {
    "workingDays": ["Monday", "Tuesday", "Wednesday", "Thursday"],
    "timeSlots": ['8am', '9am', '10am', '11am', '12pm']
  },
  "Dr. Ingrid Lam": {
    "workingDays": ["Thursday", "Friday", "Saturday", "Sunday"],
    "timeSlots": ['1pm', '2pm', '3pm', '4pm', '5pm']
  },
  "Dr. Smeeta Khoosal": {
    "workingDays": ["Thursday", "Friday", "Saturday", "Sunday"],
    "timeSlots": ['6pm', '7pm', '8pm', '9pm', '10pm']
  }
};

const today = moment().format('MMMM Do YYYY');

class BookAppointmentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: null,
      doctor: null,
      focused: true,
      timeSlot: null
    };
  };

  handleChange = (key, value) => {
    this.setState({
      [key]: value
    });
  };
  isDayBlocked = (d) => {
    d = moment(d._d).format("dddd");
    let doc = this.state.doctor;
    let workingDays = doctorAvailability[doc].workingDays;
    if (workingDays.find(x => x === d)) {
      return false;
    }
    return true;
  };
  highlightToday = (d) => {
    d = moment(d._d).format("MMMM Do YYYY")
    if (d === today) {
      return true;
    }
    return false;
  };
  handleSubmit = (e) => {
    e.preventDefault();
    let { date, doctor, timeSlot } = this.state;
    date = moment(date).format("MMMM Do YYYY")
    const appAlert = `Your Appointment with ${doctor} on ${date} at
    ${timeSlot} has been recieved`
    this.props.handleAlert(appAlert);
    this.props.close();
  };

  render() {

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormGroup>
          <Label for="exampleSelect">Select Your Medical Professional</Label>
          <Input type="select"
            name="select"
            id="selectDoctor"
            onChange={(e) => this.handleChange("doctor", e.target.value)} required>
            <option></option>
              {Object.keys(doctorAvailability).map((d, i) =>
                <option key={i}>{d}</option>
              )}
          </Input>
          <FormText color="danger">
            *Required
          </FormText>
        </FormGroup>
        {this.state.doctor ?
        <div>
          <FormGroup>
            <Label for="exampleDate">Date of Appointment</Label>
            <div id="datePicker">
              <SingleDatePicker
                date={this.state.date}
                onDateChange={date => {
                  this.setState({ date })
                }}
                numberOfMonths={1}
                hideKeyboardShortcutsPanel={true}
                focused={this.state.focused}
                isDayBlocked={this.isDayBlocked}
                isDayHighlighted={this.highlightToday}
                onFocusChange={({ focused }) => this.setState({ focused })}
              required/>
            </div>
          </FormGroup>
          <FormGroup>
            <Label for="exampleSelect">Select Your Time Slot</Label>
            <Input type="select"
              name="select"
              id="selectTime"
              onChange={(e) => this.handleChange("timeSlot", e.target.value)}
            required>
              <option></option>
              {doctorAvailability[this.state.doctor].timeSlots.map( (t,i) =>
                <option key={i}>{t}</option>
              )}
            </Input>
          </FormGroup>
        </div>
        : null
        }
        <FormGroup>
          <Label for="exampleText">Comments for your Medical professional</Label>
          <Input type="textarea" name="text" id="exampleText" placeholder="Optional"/>
        </FormGroup>
        <FormGroup>
          <Label for="exampleFile">Include image or file (Optional)</Label>
          <Input type="file" name="file" id="exampleFile" />
          <FormText color="muted">
            It maybe helpful for your medical professional to have images or files to refer to.
          </FormText>
        </FormGroup>
        <Button color='success' size='lg' type="submit" block>Submit</Button>
      </Form>
    );
  }
};

export default BookAppointmentForm;
