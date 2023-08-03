import React, { useState, useEffect, useRef } from "react";
import { Card, Col, Row, Form, Button, Modal, Tab, Nav } from "react-bootstrap";
import cx from "../../../../admin.style.module.scss";
import lx from ".././Edit_simulation.module.scss";
import prIcon from "../../../../images/pr.svg";
import { GrAttachment, GrDocumentDownload } from "react-icons/gr";
import uploadIcon from "../../../../images/icon-upload.svg";
import { FiMove } from "react-icons/fi";
import { FiCopy } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { CiFileOn } from "react-icons/ci";
import { AiOutlineDelete } from "react-icons/ai";
import {
  actionIncreaser,
  deleteActions,
  deleteImage,
  duplicateActions,
  incrementImage,
} from "../../../../reduxToolkit/reducers/moduleButtonReducer";
import { useDispatch } from "react-redux";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { FileUploader } from "react-drag-drop-files";
import axios from "axios";

const DownloadFileAction = (props: any) => {
  const dispatch = useDispatch();

  const [showc1, setc1Show] = useState(false);

  const handlec1Close = () => setc1Show(false);
  const handlec1Show = () => setc1Show(true);
  const [show, setShow] = useState(false);
  const [data, setData] = useState<object>({});
  const [doc, setDoc] = useState(props.value.content.document);
  const [progress, setProgress] = useState(0);
  const [disable, setDisable] = useState(false);
  let grpImage: any[] = [];
  const cancelFileUpload = useRef<any>(null);
  const [color, setColor] = useState(false);
  const [weblinkUrl, setWeblinkUrl] = useState("");

  useEffect(() => {
    props.value.content.document = doc.flat();
  }, [doc]);

  const handleChange = async (files: any) => {
    let docArray: any[] = [];
    let docSize: any[] = [];
    for (let element of files) {
      docArray.push(element?.name);
      docSize.push(element?.size);
    }

    let total = docSize.reduce((acc: number, ele: number, index: number) => {
      acc += ele;
      return acc;
    }, 0);

    total = total / 1024 / 1024 / 1024;
    if (total >= 1) {
      handlec1Show();
    } else {
      QueueFiles(files, "document");
      props.value.content.documentFile = files.name;
    }
  };

  let url: any[] = [];

  const cancelUpload = () => {
    if (cancelFileUpload.current)
      cancelFileUpload.current("User has canceled the file upload.");
  };

  async function QueueFiles(fileList: any, type: string) {
    for (let element of fileList) {
      setDisable(true);
      setColor(false);
      let formdata = new FormData();
      formdata.append("file", element);
      formdata.append("type", type);

      let config = {
        method: "post",
        url: `${process.env.REACT_APP_BASEURL}/Addfile`,
        headers: {
          Authorization: localStorage.getItem("token")!,
        },
        onUploadProgress: (progressEvent: any) => {
          let progress = 0;
          progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          if (progress === 100) {
            if (grpImage.length > 0) {
              grpImage?.map((e: any, index: number) => {
                if (e?.fileName != element?.name) {
                  grpImage.push({
                    fileName: element?.name,
                    progress: 100,
                    class: true,
                    color: "",
                  });
                  progress = 0;
                } else {
                  return;
                }
              });
            } else {
              grpImage.push({
                fileName: element?.name,
                progress: 100,
                class: true,
                color: "",
              });
              progress = 0;
            }
          } else {
            const filterGrp = grpImage?.filter(
              (v, i, a) =>
                a.findIndex(
                  (v2) => JSON.stringify(v2) === JSON.stringify(v)
                ) === i
            );
            setDoc([
              ...doc,
              filterGrp,
              {
                fileName: element?.name,
                progress: progress,
                class: false,
                color: "",
              },
            ]);
          }

          setProgress(progress);
        },
        cancelToken: new axios.CancelToken(
          (cancel: any) => (cancelFileUpload.current = cancel)
        ),
        data: formdata,
      };
      await axios(config)
        .then(function (response) {
          url.push(response.data.data.file);
          setProgress(0);
          const filterGrpImage = grpImage?.filter(
            (v, i, a) =>
              a.findIndex((v2) => JSON.stringify(v2) === JSON.stringify(v)) ===
              i
          );
          for (let i = 0; i < filterGrpImage.length; i++) {
            filterGrpImage[i].url = url[i];
          }
          dispatch(incrementImage(filterGrpImage.length));
          setDoc([...doc, filterGrpImage]);
        })
        .catch(function (thrown) {
          if (axios.isCancel(thrown)) {
            setColor(true);
          } else {
            // handle error
            setColor(true);
          }
        });
    }
    setDisable(false);
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
                          <Form.Label>Action: Download a File</Form.Label>
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
                            placeholder="File Name"
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
                          controlId="exampleForm.ControlInput1"
                        >
                          <Form.Control
                            type="text"
                            placeholder="Description of File"
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
                          <Form.Label>File for Download</Form.Label>
                          <div className={`${lx.fileUpload}`}>
                            <FileUploader
                              multiple={true}
                              handleChange={handleChange}
                              name="file"
                              // types={fileTypes}
                              classes="demo"
                              fileOrFiles={doc}
                              disabled={disable}
                            >
                              <img
                                src={uploadIcon}
                                className={`${cx.logoIcon}`}
                                width="200px"
                                alt="logo"
                              />
                              <p>Drag and drop files here</p>
                              <span>or</span>
                              <div className={`${lx.uploadFile}`}>
                                <Form.Control type="file" />
                                Choose a File <GrAttachment />
                              </div>
                            </FileUploader>
                          </div>
                        </Form.Group>
                        {doc?.flat().map((item: any, index: number) => {
                          item?.color == "" && color === true
                            ? (item.color = "red")
                            : (item.color = item.color);
                          let value = item?.progress.toString();
                          return (
                            <>
                              <div
                                className={`${lx.uploadProgressBar}`}
                                key={index}
                              >
                                <CiFileOn className={`${lx.iconP}`} />

                                <div className={`${lx.uploadBody}`}>
                                  <span key={index}> {item?.fileName}</span>
                                  <div className="d-flex">
                                    <div
                                      className={
                                        item.color === "red" &&
                                        item.progress < 100
                                          ? "progress danger"
                                          : item?.class === true
                                          ? "progress success"
                                          : "progress"
                                      }
                                      style={{ width: "100%" }}
                                    >
                                      <div
                                        className="progress-bar"
                                        role="progressbar"
                                        style={{
                                          width: `${
                                            item?.progress == ""
                                              ? progress
                                              : item?.progress
                                          }%`,
                                        }}
                                        aria-valuenow={value}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                      >{`${
                                        item?.progress == ""
                                          ? progress
                                          : item?.progress
                                      }%`}</div>
                                    </div>

                                    <MdClose
                                      className="ms-2"
                                      style={{ cursor: "pointer" }}
                                      onClick={() => {
                                        if (item?.class === true) {
                                          let data = {
                                            modId: props.mid,
                                            stepId: props.sid,
                                            actionId: props.value.id,
                                            index: index,
                                          };
                                          dispatch(deleteImage(data));
                                          setDoc(props.value.content.document);
                                        } else {
                                          let data = {
                                            modId: props.mid,
                                            stepId: props.sid,
                                            actionId: props.value.id,
                                            index: index,
                                          };
                                          dispatch(deleteImage(data));
                                          setDoc(props.value.content.document);
                                          cancelUpload();
                                        }
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </>
                          );
                        })}
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

      <Modal
        className={`${lx.modalFeedbacks}`}
        size="lg"
        show={showc1}
        onHide={handlec1Close}
      >
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group
            className={`col-lg-12 mb-0 ${lx.congratulationsFull}`}
            controlId="exampleForm.ControlInput1"
          >
            <Form.Label className={`w-100`}>Bad News!</Form.Label>
            <div className={`${lx.congratulationsBox}`}>
              <Row>
                <Col md={9}>
                  <div className={`${lx.visitBox}`}>
                    <h4>It seems like the file is too large to upload.</h4>
                    <h4>
                      Please upload the file to Google Drive, make it shareable,
                      and insert the link below instead!
                    </h4>
                  </div>
                </Col>
                <Col md={3}>
                  <div className={`text-center`}>
                    <img
                      className={`w-100`}
                      src="../../images/bro.svg"
                      alt=""
                    />
                  </div>
                </Col>
                <Col lg={12} className="">
                  <div className={`${lx.webLink}`}>
                    <h5>Web Link </h5>
                    <input
                      className="form-control"
                      type="text"
                      onChange={(e: any) => {
                        setWeblinkUrl(e.target.value);
                      }}
                      placeholder="drive.google.com/folders/1AB2C3D4"
                    />
                  </div>
                </Col>
                <Col lg={12} className={`${lx.webLinkBtn}`}>
                  <button
                    className={`btn`}
                    onClick={() => {
                      let data = {
                        mId: props.mid,
                        sId: props.sid,
                        tabVal: "Web Link",
                        url: weblinkUrl,
                      };
                      dispatch(actionIncreaser(data));
                      handlec1Close();
                    }}
                  >
                    Create Web Link Action
                  </button>
                </Col>
              </Row>
            </div>
          </Form.Group>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DownloadFileAction;
