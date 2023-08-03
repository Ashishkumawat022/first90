import React, { useState, useEffect } from "react";
import { Card, Col, Row, Form, Button, Modal, Tab, Nav } from "react-bootstrap";
import cx from "../../../../admin.style.module.scss";
import lx from ".././Edit_simulation.module.scss";
import { FiMove } from "react-icons/fi";
import { FiCopy } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import uploadIcon from "../../../../images/icon-upload.svg";
import { GrAttachment } from "react-icons/gr";
import {
  deleteActions,
  duplicateActions,
} from "../../../../reduxToolkit/reducers/moduleButtonReducer";
import { useDispatch } from "react-redux";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { FileUploader } from "react-drag-drop-files";
import useHttp from "../../../../hooks/use-https";
import axios from "axios";

const EmbeddedVideoAction = (props: any) => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(props.value.content.document);
  const [show, setShow] = useState(false);
  const [data, setData] = useState<object>({});
  let grpImage: any[] = [];
  const [progress, setProgress] = useState(0);
  const [videoProgress, setVideoProgress] = useState<any>({
    fileName: "",
    progress: "",
    class: false,
    color: "",
  });
  const fileTypes = [
    "MP4",
    "MOV",
    "WMV",
    "AVI",
    "AVCHD",
    "FLV",
    "F4V",
    "SWF",
    "MKV",
    "WEBM",
    "HTML5",
  ];

  const handleChange = (files: any) => {
    setFile("");
    fileToUrl(files, "document");
  };

  async function fileToUrl(fileList: any, type: string) {
    setFile("");
    let formData = new FormData();
    formData.append("file", fileList);
    formData.append("type", type);

    let config = {
      url: `${process.env.REACT_APP_BASEURL}/Addfile`,
      method: "POST",
      headers: {
        Authorization: localStorage.getItem("token")!,
      },
      onUploadProgress: (progressEvent: any) => {
        let progress = 0;
        progress = Math.round(
          (progressEvent.loaded / progressEvent.total) * 100
        );
        if (progress === 100) {
          setVideoProgress({
            fileName: fileList?.name,
            progress: 100,
            class: true,
            color: "",
          });
          progress = 0;
        } else {
          setVideoProgress({
            fileName: fileList?.name,
            progress: progress,
            class: false,
            color: "",
          });
        }

        setProgress(progress);
      },
      data: formData,
    };
    await axios(config)
      .then(function (response) {
        setProgress(0);
        props.value.content.document = response.data.data.file;
        setFile(response.data.data.file);
      })
      .catch(function (thrown) {
        console.log(thrown, "thrown");
      });
  }

  return (
    <>
      <div id={`${props.value.id}`}>
        <Droppable droppableId={props.sid} type={`droppableActionItem`}>
          {(provided, snapshot) => (
            <div ref={provided.innerRef}>
              <Draggable
                key={props.value.id}
                draggableId={props.value.id}
                index={props.index}
              >
                {(provided, snapshot) => (
                  <Card ref={provided.innerRef} {...provided.draggableProps}>
                    <Card.Body>
                      <Row className={`${lx.ActionFormBox}`}>
                        <Col className={`${lx.LeftBox}`}>
                          <Form.Label>Action: Embedded Video</Form.Label>
                        </Col>
                        <Col className={`${lx.RightBox}`}>
                          <ul>
                            <li>
                              <FiCopy
                                onClick={() => {
                                  let data = {
                                    moduleId: props.mid,
                                    stepId: props.sid,
                                    value: props.value,
                                    index: props.index,
                                  };
                                  dispatch(duplicateActions(data));
                                }}
                              />
                            </li>
                            <li {...provided.dragHandleProps}>
                              <FiMove />
                            </li>
                            <li>
                              <AiOutlineDelete
                                onClick={() => {
                                  let data = {
                                    moduleId: props.mid,
                                    stepId: props.sid,
                                    index: props.index,
                                  };
                                  setData(data);
                                  setShow(true);
                                }}
                              />
                            </li>
                          </ul>
                        </Col>
                      </Row>

                      <Form className="row">
                        <Form.Group
                          className={`col-lg-12 ${cx.formBox}`}
                          controlId="exampleForm.ControlInput1"
                        >
                          <Form.Control
                            type="text"
                            placeholder="Welcome from the partner"
                            defaultValue={`${
                              props.value.content.title == ""
                                ? ""
                                : props.value.content.title
                            }`}
                            onChange={(event) => {
                              props.value.content.title = event.target.value;
                            }}
                          />
                        </Form.Group>
                        <Form.Group
                          className={`col-lg-12 ${cx.formBox}`}
                          controlId="exampleForm.ControlInput2"
                        >
                          <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Please see below for a video welcoming you to the firm and introducing you to your first client: Unlimited Bank."
                            defaultValue={`${
                              props.value.content.description == ""
                                ? ""
                                : props.value.content.description
                            }`}
                            onChange={(event) => {
                              props.value.content.description =
                                event.target.value;
                            }}
                          />
                        </Form.Group>
                        <Form.Group
                          className={`col-lg-12 ${cx.formBox}`}
                          controlId="exampleForm.ControlInput3"
                        >
                          <Form.Label>Upload Video to Embed</Form.Label>
                          <div className={`${lx.fileUpload}`}>
                            <FileUploader
                              handleChange={handleChange}
                              name="file"
                              types={fileTypes}
                              classes="demo"
                              fileOrFiles={file}
                              //disabled={isDisabled}
                            >
                              {file == "" ? (
                                `${progress}% ${videoProgress.fileName}`
                              ) : (
                                <video
                                  width="320"
                                  height="240"
                                  className={`${cx.logoIcon}`}
                                  controls
                                >
                                  <source src={file} type="video/mp4" />
                                </video>
                              )}

                              <p>Drag and drop files here</p>
                              <span>or</span>
                              <div className={`${lx.uploadFile}`}>
                                <Form.Control type="file" />
                                Choose a File <GrAttachment />
                              </div>
                            </FileUploader>
                          </div>
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
                dispatch(deleteActions(data));
                setShow(false);
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

export default EmbeddedVideoAction;
