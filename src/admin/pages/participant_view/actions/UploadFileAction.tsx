import React, { useState, useEffect, useRef } from "react";
import { Card, Col, Row, Form, Button, Modal, Tab, Nav } from "react-bootstrap";
import cx from "../../../../admin.style.module.scss";
import lx from ".././Participant_view.module.scss";
import { GrAttachment, GrDocumentDownload } from "react-icons/gr";
import uploadIcon from "../../../../images/icon-upload.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FileUploader } from "react-drag-drop-files";
import useHttp from "../../../../hooks/use-https";
import {
  deleteImage,
  incrementImage,
  moduleArray,
} from "../../../../reduxToolkit/reducers/moduleButtonReducer";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { MdClose } from "react-icons/md";
import { CiFileOn } from "react-icons/ci";

const UploadFileAction = (props: any) => {
  let isUrl = window.location.pathname.includes("/participant/simulations");
  let userId = JSON.parse(localStorage.getItem("data")!);
  const param: any = useParams();
  const dispatch = useDispatch();
  const [showc1, setc1Show] = useState(false);
  const handlec1Show = () => setc1Show(true);
  const { sendRequest: fileRequest } = useHttp();
  const { sendRequest: updateSimulationRequest } = useHttp();
  const { sendRequest: saveActionRequest } = useHttp();
  const [doc, setDoc] = useState<any[]>(props.value.content.document);
  const [disable, setDisable] = useState(false);
  const [file, setFile] = useState(props.value.content.image);
  const [imageUrl, setImageUrl] = useState(props.value.content.image);
  const cancelFileUpload = useRef<any>(null);
  const [color, setColor] = useState(false);
  const [progress, setProgress] = useState(0);
  let grpImage: any[] = [];
  const notify = (text: string) =>
    toast(text, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

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
  const { sendRequest } = useHttp();
  const fileConvertingUrl = (responseData: any) => {
    props.value.content.image = responseData.data.file;
    setImageUrl(responseData.data.file);
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
            (v: any, i: number, a: any) =>
              a.findIndex(
                (v2: any) => JSON.stringify(v2) === JSON.stringify(v)
              ) === i
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
  const updationResponse = (responseData: any) => {
    console.log(responseData.data);
  };

  const updateSimulation = () => {
    let data = JSON.stringify({
      id: param?.id,
      AddallModule: moduleArray,
    });

    updateSimulationRequest(
      {
        url: `${process.env.REACT_APP_STUDENT_BASEURL}/update_team_simulation`,
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: data,
      },
      updationResponse
    );
  };

  const actionResponse = (responseData: any) => {
    if (responseData?.status === false) {
      notify(responseData?.message);
    } else {
      props.sendNotification();
      updateSimulation();
    }
  };

  const saveAction = () => {
    let data = JSON.stringify({
      simulation_id: props?.simulationId,
      action_id: props?.value?.id,
      module: props?.mid,
      stap: props?.sid,
      actionModule: props?.value,
      team_id: param?.id,
    });

    saveActionRequest(
      {
        url: `${process.env.REACT_APP_STUDENT_BASEURL}/studentAction`,
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: data,
      },
      actionResponse
    );
  };
  return (
    <>
      <ToastContainer />
      {/* Action: upload file START */}
      <Card className={props.value.disable === 0 ? "" : `${lx.disabled}`}>
        <Card.Body>
          <Form className="row">
            <Form.Group
              className={`col-lg-12 ${cx.formBox}`}
              controlId="exampleForm.ControlInput1"
            >
              <Form.Label style={{ fontSize: "15px" }}>File Name</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                value={props.value.content.title}
              />
            </Form.Group>

            <Form.Group
              className={`col-lg-12 ${cx.formBox}`}
              controlId="exampleForm.ControlInput1"
            >
              <Form.Label style={{ fontSize: "15px" }}>
                File Description
              </Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                value={props.value.content.description}
              />
            </Form.Group>

            <Form.Group
              className={`col-lg-12 ${cx.formBox}`}
              controlId="exampleForm.ControlInput1"
            >
              <Row>
                <Form.Group
                  className={`col-lg-12 mt-3 ${cx.formBox}`}
                  controlId="exampleForm.ControlInput3"
                >
                  <Form.Label>Upload File (If required)</Form.Label>
                  <div
                    className={`${lx.fileUpload}`}
                    onClick={() => {
                      if (!isUrl)
                        notify(
                          "This action is not available in “View as Participant” mode - please return to “Edit mode”"
                        );
                    }}
                  >
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
                      <p>Drag and drop files here </p>
                      <span>or</span>
                      <div className={`${lx.uploadFile}`}>
                        {props.value.disable === 0 && (
                          <Form.Control
                            type="file"
                            disabled={props.value.disable === 1}
                          />
                        )}
                        Choose a File <GrAttachment />
                      </div>
                    </FileUploader>
                  </div>
                </Form.Group>
                {doc?.flat().map((item: any, index: number) => {
                  item?.color == "" && color === true
                    ? (item.color = "red")
                    : (item.color = item?.color);
                  let value = item?.progress?.toString();
                  return (
                    <>
                      <div className={`${lx.uploadProgressBar}`} key={index}>
                        <CiFileOn className={`${lx.iconP}`} />

                        <div className={`${lx.uploadBody}`}>
                          <span key={index}> {item?.fileName}</span>
                          <div className="d-flex">
                            <div
                              className={
                                item.color === "red" && item.progress < 100
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
                                item?.progress == "" ? progress : item?.progress
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
                <Col className={`text-end ${cx.submitActionBox}`}>
                  <button
                    className={`btn ${cx.submitBtnBorder}`}
                    onClick={(e: any) => {
                      e.preventDefault();
                      props.value.content.studentName =
                        userId?.firstName + " " + userId?.lastName;
                      props.value.content.submitTime = new Date().getTime();
                      props.value.disable = 1;
                      saveAction();
                    }}
                  >
                    Submit for Feedback
                  </button>
                </Col>
              </Row>
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
      {/* Action:  upload file END */}
    </>
  );
};

export default UploadFileAction;
