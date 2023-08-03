import React, { useState, useEffect } from "react";
import { Card, Col, Row, Form, Button, Modal, Tab, Nav } from "react-bootstrap";
import cx from "../../../../admin.style.module.scss";
import lx from ".././Edit_simulation.module.scss";
import { FiMove } from "react-icons/fi";
import { FiCopy } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { deleteActions, duplicateActions } from "../../../../reduxToolkit/reducers/moduleButtonReducer";
import { useDispatch } from 'react-redux';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { setDatasets } from "react-chartjs-2/dist/utils";

const AddText = (props: any) => {

  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const [data, setData] = useState<object>({})

  return (
    <>
     <div id={`${props.value.id}`}>
      <Droppable droppableId={props.sid} type={`droppableActionItem`}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
          >

            <Draggable key={props.value.id} draggableId={props.value.id} index={props.index}>
              {(provided, snapshot) => (
                <Card
                  ref={provided.innerRef}
                  {...provided.draggableProps}

                >
                  <Card.Body>
                    <Row className={`${lx.ActionFormBox}`}>
                      <Col className={`${lx.LeftBox}`}>
                        <Form.Label>Action: Add Text</Form.Label>
                      </Col>
                      <Col className={`${lx.RightBox}`}>
                        <ul>
                          <li>
                            <FiCopy onClick={() => {
                              let data = {
                                moduleId: (props.mid),
                                stepId: (props.sid),
                                value: (props.value),
                                index: (props.index),
                              }
                              dispatch(duplicateActions(data))
                            }} />
                          </li>

                          <li {...provided.dragHandleProps}>
                            <FiMove />
                          </li>

                          <li>
                            <AiOutlineDelete onClick={() => {
                              let data = {
                                moduleId: (props.mid),
                                stepId: (props.sid),
                                index: (props.index),
                              }
                              setShow(true)
                              setData(data)
                            }} />
                          </li>
                        </ul>
                      </Col>
                    </Row>

                    <Form className="row">
                      <Form.Group
                        className={`col-lg-12 ${cx.formBox}`}
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Control type="text" placeholder="Action Title" defaultValue={`${props.value.content.title == "" ? "" : props.value.content.title}`}
                          onChange={(event) => {
                            props.value.content.title = event.target.value
                          }} />
                      </Form.Group>
                      <Form.Group
                        className={`col-lg-12 ${cx.formBox}`}
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Control
                          type="text"
                          placeholder="Add Description..."
                          defaultValue={`${props.value.content.description == "" ? "" : props.value.content.description}`}
                          onChange={(event) => {
                            props.value.content.description = event.target.value
                          }}
                        />
                      </Form.Group>
                    </Form>
                  </Card.Body>
                </Card>
              )}
            </Draggable>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      </div>

      <Modal
        className={`${cx.DeletePopup}`}
        show={show}
        onHide={() => setShow(false)}
        centered
      >
        <Modal.Body>
          <Col lg={12}>
            Are you sure you want to delete this action? <br />
            <button
              type="button"
              className={`btn btn-danger ${cx.CancelBtn}`}
              onClick={() => setShow(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className={`btn bg-primary text-white`}
              onClick={() => {
                dispatch(deleteActions(data))
                setShow(false)
              }}
            >
              {" "}
              Ok
            </button>
          </Col>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddText;
