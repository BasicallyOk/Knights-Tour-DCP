import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'

const InputModal = () => {
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("")

  const onSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Knight's Tour</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="height">
              <Form.Control type="number" placeholder="Chessboard height" onChange={(event) => setHeight(event.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="width">
              <Form.Control type="number" placeholder="Chessboard width" onChange={(event) => setWidth(event.target.value)} />
            </Form.Group>
            <Button variant="primary" type="submit" onClick={onSubmit}>
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default InputModal