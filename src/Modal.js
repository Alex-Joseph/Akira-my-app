import React, { Component } from 'react';
import BookAppointmentForm from './BookAppointmentForm.js';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class BookingModal extends Component {

  render() {
    return (
      <Modal isOpen={this.props.showBooking} toggle={this.props.toggle}>
        <ModalHeader toggle={this.props.toggle}>Book An Appointment</ModalHeader>
        <ModalBody>
          <BookAppointmentForm
            handleAlert={this.props.handleAlert}
            close={this.props.toggle}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={this.props.toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    )
  };
};

export default BookingModal;
