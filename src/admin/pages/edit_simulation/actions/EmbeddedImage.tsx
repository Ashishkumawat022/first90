import React, { useState, useEffect } from "react";
import { Card, Col, Row, Form, Button, Modal, Tab, Nav } from "react-bootstrap";
import cx from "../../../../admin.style.module.scss";
import lx from ".././Edit_simulation.module.scss";
import { FiMove } from "react-icons/fi";
import { FiCopy } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { GrAttachment, GrDocumentDownload } from "react-icons/gr";
import uploadIcon from "../../../../images/icon-upload.svg";
import { deleteActions, duplicateActions } from "../../../../reduxToolkit/reducers/moduleButtonReducer";
import { useDispatch } from 'react-redux';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { FileUploader } from "react-drag-drop-files";
import useHttp from "../../../../hooks/use-https";

const EmbeddedImage = (props: any) => {

  const dispatch = useDispatch();


  const [file, setFile] = useState(props.value.content.document);
  const [show, setShow] = useState(false);
  const [data, setData] = useState<object>({})
  const [doc, setDoc] = useState("");

  const fileTypes = ["JPEG", "PNG", "GIF", "JPG"];

  useEffect(()=>{
    let slashRemove = props.value.content.document.lastIndexOf("/")
    let Item = props.value.content.document.slice(slashRemove+15, props.value.content.document.length)
    setDoc(Item)
  },[])

  const handleChange = (files: any) => {
    setDoc(files.name);
    fileToUrl(files, "document");
  };

  const { sendRequest } = useHttp();

  const fileConvertingUrl = (responseData: any) => {
    if (responseData.data.type == "image") {
      props.value.content.image = responseData.data.file;
    } else {
      props.value.content.document = responseData.data.file;
      setFile(responseData.data.file);
      let slashRemove = responseData.data.file.lastIndexOf("/")
    let Item = responseData.data.file.slice(slashRemove+15, responseData.data.file.length)
      setDoc(Item)
    }

  };

  const fileToUrl = (fileList: any, type: string) => {
    let formData = new FormData();
    formData.append("file", fileList);
    formData.append("type", type);

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
                        <Form.Label>Action: Embedded Image</Form.Label>
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
                              setShow(true);
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
                        <Form.Control
                          type="text"
                          placeholder="Organizational Chart - Rocketeer Loans"
                          defaultValue={`${props.value.content.title == "" ? "" : props.value.content.title}`}
                          onChange={(event) => {
                            props.value.content.title = event.target.value
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
                          placeholder="Please see below for Rocketeer Loan’s organizational chart. You may consider this to be relevant information as you complete the APS."
                          defaultValue={`${props.value.content.description == "" ? "" : props.value.content.description}`}
                          onChange={(event) => {
                            props.value.content.description = event.target.value
                          }}
                        />
                      </Form.Group>
                      <Form.Group
                        className={`col-lg-12 ${cx.formBox}`}
                        controlId="exampleForm.ControlInput3"
                      >
                        <Form.Label>Upload Image to Embed</Form.Label>
                        <div className={`${lx.fileUpload}`}>
                          <FileUploader
                            handleChange={handleChange}
                            name="file"
                            types={fileTypes}
                            classes="demo"
                            fileOrFiles={file}
                          //disabled={isDisabled}
                          >
                            {
                              file == "" ? 
                              <img
                              src={uploadIcon}
                              className={`${cx.logoIcon}`}
                              width="200px"
                              alt="logo"
                            /> : 
                              (file?.match(/\.(jpg|jpeg|png|gif)$/i)) ?
                              <img
                              src={file}
                              className={`${cx.logoIcon}`}
                              width="200px"
                              alt="logo"
                            /> :
                             <p> <GrDocumentDownload width={50}/> {doc}</p> 
                            }
                            <p>Drag and drop files here</p>
                            <span>or</span>
                            <div className={`${lx.uploadFile}`}>
                              <Form.Control type="file"/>
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

export default EmbeddedImage;
