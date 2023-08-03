import React, { useState, useEffect } from "react";
import { Card, Col, Row, Form, Modal } from "react-bootstrap";
import cx from "../../../../admin.style.module.scss";
import lx from ".././Edit_simulation.module.scss";
import { FiMove } from "react-icons/fi";
import { FiCopy } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import editIcon from "../../../../images/icon_editn.svg";
import prIcon from "../../../../images/pr.svg";
import { deleteActions, duplicateActions } from "../../../../reduxToolkit/reducers/moduleButtonReducer";
import { useDispatch } from 'react-redux';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import useHttp from "../../../../hooks/use-https";

const ScheduleLiveAction = (props: any) => {

  const dispatch = useDispatch()

  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [data, setData] = useState<object>({})

  const handlefrShow = () => setShow(true);

  const [imageUrl, setImageUrl] = useState(props.value.content.image);

  const { sendRequest } = useHttp();

  const fileConvertingUrl = (responseData: any) => {
    props.value.content.image = responseData.data.file;
    setImageUrl(responseData.data.file)
  };

  const fileToUrl = (fileList: any) => {
    let formData = new FormData();
    formData.append("file", fileList);

    sendRequest(
      {
        url: `${process.env.REACT_APP_BASEURL}/Addfile`,
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        body: formData,
      },
      fileConvertingUrl
    );
  }

  const handleImageChange = function (e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files;
    if (!fileList) return;
    fileToUrl(fileList[0])
  };

  const handleImageRemove = function (e: React.ChangeEvent<HTMLInputElement>) {
    props.value.content.image = "";
    setImageUrl(props.value.content.image)
  };

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
                        <Form.Label>Action: Schedule Live Conversation</Form.Label>
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
                      <Form.Group
                        className={`col-lg-12 ${cx.formBox}`}
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>Contact Headshot</Form.Label>
                        <Row className="align-items-center">
                          <Col lg={4}>
                            <div className={`${lx.uploadPhotoBox}`}>
                              <img
                                src={props.value.content.image == "" ? prIcon : props.value.content.image}
                                className={`${lx.logoIcon}`}
                                alt="logo"
                              />
                              <button className={`${lx.uploadPhoto}`}>
                                Upload Photo
                                <input
                                  type="file"
                                  onChange={(event: any) => {
                                    handleImageChange(event);
                                  }}
                                />
                              </button>
                              <button type="button" className={`${lx.reMove}`} onClick={(event: any) => {
                                handleImageRemove(event);
                              }}>
                                Remove Photo
                              </button>
                            </div>
                          </Col>
                          <Col lg={8}>
                            <Row>
                              <Col lg={12} className="mb-2">
                                <Form.Control
                                  type="text"
                                  placeholder="Contact Name"
                                  defaultValue={`${props.value.content.contactName == "" ? "" : props.value.content.contactName}`}
                                  onChange={(event) => {
                                    props.value.content.contactName = event.target.value
                                  }}
                                />
                              </Col>
                              <Col lg={12} className="mb-2">
                                <Form.Control
                                  type="text"
                                  placeholder="Contact Email"
                                  defaultValue={`${props.value.content.contactEmail == "" ? "" : props.value.content.contactEmail}`}
                                  onChange={(event) => {
                                    props.value.content.contactEmail = event.target.value
                                  }}
                                />
                              </Col>
                              <Col lg={12}>
                                <Form.Control
                                  type="text"
                                  placeholder="Contact Phone Number"
                                  defaultValue={`${props.value.content.contactNumber == "" ? "" : props.value.content.contactNumber}`}
                                  onChange={(event) => {
                                    props.value.content.contactNumber = event.target.value
                                  }}
                                />
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Form.Group>
                      <Form.Group
                        className={`col-lg-12 ${cx.formBox}`}
                        controlId="exampleForm.ControlInput2"
                      >
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="Email Text..."
                          defaultValue={`${props.value.content.description == "" ? "" : props.value.content.description}`}
                          onChange={(event) => {
                            props.value.content.description = event.target.value
                          }}
                        />
                      </Form.Group>

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

export default ScheduleLiveAction;
