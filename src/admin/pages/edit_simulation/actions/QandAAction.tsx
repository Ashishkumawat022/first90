import React, { useState, useEffect } from "react";
import { Card, Col, Row, Form, Button, Modal, Tab, Nav } from "react-bootstrap";
import cx from "../../../../admin.style.module.scss";
import lx from ".././Edit_simulation.module.scss";
import { FiMove } from "react-icons/fi";
import { FiCopy } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import editIcon from "../../../../images/icon_editn.svg";
import { IoMdClose } from "react-icons/io";
import { deleteActions, duplicateActions, addQuestion, deleteQuestion } from "../../../../reduxToolkit/reducers/moduleButtonReducer";
import { useDispatch } from 'react-redux';
import { Draggable, Droppable } from 'react-beautiful-dnd';

const QandAAction = (props: any) => {

  const dispatch = useDispatch()

  const [showDelete, setShowDelete] = useState(false);
  const [show, setShow] = useState(false);
  const [data, setData] = useState<object>({})
  const handlefrShow = () => setShow(true);

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
                        <Form.Label>Action: Question & Answer</Form.Label>
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
                              setData(data);
                              setShowDelete(true);
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
                      {
                        props.value?.content?.question.map((item: any, index: any) => {
                          return (
                            <Form.Group
                              className={`col-lg-12 ${cx.formBox}`}
                              controlId="exampleForm.ControlInput1"
                            >
                              <div className="position-relative">
                                <Form.Control type="text" placeholder="Add question" defaultValue={`${item.que == "" ? "" : item.que}`}
                                  onChange={(event) => {
                                    item.que = event.target.value
                                  }} />
                                <IoMdClose className={`${lx.closeAction}`} onClick={() => {
                                  let data = {
                                    id: props.value.id,
                                    index: index
                                  }
                                  dispatch(deleteQuestion(data))
                                }} />
                              </div>
                            </Form.Group>
                          )
                        })
                      }

                      <Col lg={12} className="text-end">
                        <button type="button" className={`${lx.addQuestion}`} onClick={() => dispatch(addQuestion(props.value.id))}>
                          Add New Question +
                        </button>
                      </Col>

                      <div className={`${lx.addFeedback}`} onClick={handlefrShow}>
                        <img
                          src={editIcon}
                          className={`${lx.logoIcon}`}
                          onClick={() => {
                            props.feedbackShow()
                            props.actionId(props.value.id, props.value.actionValue);
                          }}
                          alt="logo"
                        />
                        <span onClick={() => {
                          props.feedbackShow()
                          props.actionId(props.value.id, props.value.actionValue);
                        }}>Add Feedback Rubric</span>
                      </div>
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
        show={showDelete}
        onHide={() => setShowDelete(false)}
        centered
      >
        <Modal.Body>
          <Col lg={12}>
            Are you sure you want to delete this action? <br />
            <button
              type="button"
              className={`btn btn-danger ${cx.CancelBtn}`}
              onClick={() => setShowDelete(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className={`btn bg-primary text-white`}
              onClick={() => {
                dispatch(deleteActions(data))
                setShowDelete(false)
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

export default QandAAction;
