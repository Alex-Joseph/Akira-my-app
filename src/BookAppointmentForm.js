import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import Moment from 'react-moment';
import moment from 'moment';
import 'moment-timezone';

Moment.globalLocale = 'en-ca';
Moment.globalElement = 'span';

const blocked = []
blocked.push(moment().add(3, "days").format("MMMM Do YYYY"))
blocked.push(moment().add(7, "days").format("MMMM Do YYYY"))
blocked.push(moment().add(9, "days").format("MMMM Do YYYY"))

const doctorAvailability = {
  "Dr. Pamala An": ['8am', '9am', '10am', '11am', '12pm'],
  "Dr. Ingrid Lam": ['1pm', '2pm', '3pm', '4pm', '5pm'],
  "Dr. Smeeta Khoosal": ['6pm', '7pm', '8pm', '9pm', '10pm']
}

class BookAppointmentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: null,
      doctor: null,
      focused: true,
      timeSlot: null
    };
  }
  // listItem = (props) => {
  //   return <li>{props.value}</li>
  // }
  // GetTimeSlots = (props) => {
  //   const doc = this.props.doc
  //   if (doc) {
  //     return (
  //       <ul>
  //         {doctorAvailability[doc].map( (t,i) =>
  //           <listItem key={i} value={t} />
  //         )}
  //       </ul>
  //     )
  //   }
  // }
  handleChangeDate = (event) => {
    this.setState({date: event.target.value});
  }
  handleChangeDoctor = (event) => {
    this.setState({doctor: event.target.value});
  }
  handleChangeTimeSlot = (event) => {
    this.setState({timeSlot: event.target.value});
  }
  handleSubmit = (event) => {
    alert(`fetch call to server (POST) for ${this.state.doctor} on
      ${moment(this.state.date).format("MMMM Do YYYY")} at ${this.state.timeSlot}`)
    event.preventDefault();
    this.props.close();
  }
  isDayBlocked = (d) => {
    d = moment(d._d).format("MMMM Do YYYY")
    if (blocked.find(x => x === d)) { return true }
    return false;
  }

  render() {
    const doctors = ["Dr. Pamala An", "Dr. Ingrid Lam", "Dr. Smeeta Khoosal"]
    return (
      <Form onSubmit={this.handleSubmit}>
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
              onFocusChange={({ focused }) => this.setState({ focused })}
              required/>
          </div>
        </FormGroup>
        <FormGroup>
          <Label for="exampleSelect">Select Your Medical Professional</Label>
          <Input type="select"
            name="select"
            id="selectDoctor"
            onChange={this.handleChangeDoctor} required>
            <option></option>
            {doctors.map((d, i) =>
              <option key={i}>{d}</option>
            )}
          </Input>
        </FormGroup>
        {this.state.doctor ?
        <FormGroup>
          <Label for="exampleSelect">Select Your Time Slot</Label>
          <Input type="select"
            name="select"
            id="selectTime"
            onChange={this.handleChangeTimeSlot} required>
            <option></option>
            {doctorAvailability[this.state.doctor].map( (t,i) =>
              <option key={i}>{t}</option>
            )}
          </Input>
        </FormGroup>
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
