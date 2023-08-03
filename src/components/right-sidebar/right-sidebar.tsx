import React, { useState, useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import lx from "./right-sidebar.module.scss";
import { AiOutlineFile, AiOutlineFolder } from "react-icons/ai";
import { Col, Row, Form, Button, Modal } from "react-bootstrap";
import { GrAttachment, GrDocumentDownload } from "react-icons/gr";
import profile from "../../images/user.jpg";
import uploadImg from "../../images/pr.svg";
import uploadImg2 from "../../images/icon-upload.svg";
import useHttp from "../../hooks/use-https";
import { FileUploader } from "react-drag-drop-files";
import { useSelector, useDispatch } from "react-redux";
import {
  moduleArray,
  globalResourceIncreaser,
  globalResource,
  stepResourceIncreaser,
  adviceIncreaser,
  adviceUpdator,
  deleteStepFolder,
  deleteStepFile,
  deleteAdvice,
  deleteGlobalFolder,
  deleteGlobalFile,
} from "../../reduxToolkit/reducers/moduleButtonReducer";
import userImage from "../../images/user.jpg";
const RightSidebar = (props: any) => {
  let isUrl = window.location.pathname.includes("/participant/simulations");
  const inputRef = useRef<any>();
  const ResourceCount = useSelector(
    (state: any) => state.moduleButtonReducer.ResourceCount
  );
  const adviceCount = useSelector(
    (state: any) => state.moduleButtonReducer.adviceCount
  );

  const dispatch = useDispatch();

  const [adshow, setadShow] = useState(false);
  const handleadClose = () => setadShow(false);
  const handleadShow = () => setadShow(true);

  const [showFolder, setshowFolder] = useState(false);
  const [folderName, setFolderName] = useState("");

  const [adshow2, setadShow2] = useState(false);
  const [adshow3, setadShow3] = useState(false);
  const handleadClose2 = () => setadShow2(false);
  const handleadShow2 = () => setadShow2(true);
  const handleadShow3 = () => setadShow3(true);
  const handleadClose3 = () => setadShow3(false);
  const handleShowFolder = () => setshowFolder(false);
  const [moduleArrayList, setModuleArrayList] = useState<any>();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [advice, setAdvice] = useState("");
  const [file, setFile] = useState("");
  const [showName, setShowName] = useState("");
  const [addResourceData, setAddResourceData] = useState({
    resourceTitle: "",
    folderName: "",
  });
  const [deleteGlobFile, setDeleteGlobFile] = useState({
    id: "",
    folderId: "",
  });
  const [folder, setFolder] = useState<any[]>([]);
  const [stepFolder, setStepFolder] = useState<any[]>([]);
  const [folderId, setFolderId] = useState("");
  const [editResource, setEditResource] = useState(false);
  const [doc, setDoc] = useState("");
  const [editGlobalResource, setEditGlobalResource] = useState({
    resouId: "",
    fileName: "",
    boolean: false,
  });
  const [resourceId, setResourceId] = useState({
    moduleId: "",
    stepId: "",
    folderId: "",
    fileId: "",
  });
  const [adviceData, setAdviceData] = useState({
    moduleId: "",
    stepId: "",
    id: "",
    editAdvice: false,
  });

  useEffect(() => {
    getFolder();
    getStepFolder();
  }, [ResourceCount, adviceCount]);

  const handleChange = (files: any) => {
    setDoc(files.name);
    let docFile = files.name.split(".");
    setShowName(docFile[0]);
    fileToUrl(files, "document");
  };

  // const fileTypes = ["JPEG", "PNG", "GIF"];
  const { sendRequest: fileRequest } = useHttp();
  const { sendRequest: getGlobalFolderList } = useHttp();
  const { sendRequest: sendStepRequest } = useHttp();
  const { sendRequest: getStepList } = useHttp();
  const { sendRequest } = useHttp();

  const fileConvertingUrl = (responseData: any) => {
    setFile(responseData.data.file);
  };

  const fileToUrl = (fileList: any, type: string) => {
    let formData = new FormData();
    formData.append("file", fileList);
    formData.append("type", type);

    fileRequest(
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

  const addResourceResponse = (responseData: any) => {
    getFolder();
    props.getGlobal();
    GlobalResourceClear();
  };

  const addResource = () => {
    if (
      addResourceData.folderName == "" ||
      addResourceData.folderName == "None"
    ) {
      let data = JSON.stringify({
        actions: props.id,
        ResourceTitle: [
          {
            fileName: addResourceData.resourceTitle,
            image: file,
          },
        ],
        folderName:
          addResourceData.folderName == "None" ||
          addResourceData.folderName == ""
            ? "None"
            : addResourceData.folderName,
      });

      sendRequest(
        {
          url: `${process.env.REACT_APP_BASEURL}/AddResourse`,
          method: "POST",
          headers: {
            Authorization: localStorage.getItem("token"),
            "content-type": "application/json",
          },
          body: data,
        },
        addResourceResponse
      );
    } else {
      if (
        globalResource.find(
          (listitem: any) =>
            listitem.Choosefolder === addResourceData.folderName
        )
      ) {
        const list = globalResource.find(
          (listitem: any) => listitem.Choosefolder == addResourceData.folderName
        );
        let data = JSON.stringify({
          id: folderId,
          actions: props.id,
          ResourceTitle: [
            ...list.ResourceTitle,
            {
              fileName: addResourceData.resourceTitle,
              image: file,
            },
          ],
          Choosefolder:
            addResourceData.folderName == "None" ||
            addResourceData.folderName == ""
              ? "None"
              : addResourceData.folderName,
        });

        sendRequest(
          {
            url: `${process.env.REACT_APP_BASEURL}/AddResourse`,
            method: "POST",
            headers: {
              Authorization: localStorage.getItem("token"),
              "content-type": "application/json",
            },
            body: data,
          },
          addResourceResponse
        );
      } else {
        let data = JSON.stringify({
          actions: props.id,
          ResourceTitle: [
            {
              fileName: addResourceData.resourceTitle,
              image: file,
            },
          ],
          Choosefolder:
            addResourceData.folderName == "None" ||
            addResourceData.folderName == ""
              ? "None"
              : addResourceData.folderName,
        });

        sendRequest(
          {
            url: `${process.env.REACT_APP_BASEURL}/AddResourse`,
            method: "POST",
            headers: {
              Authorization: localStorage.getItem("token"),
              "content-type": "application/json",
            },
            body: data,
          },
          addResourceResponse
        );
      }
    }
  };

  const addStepResourceResponse = (responseData: any) => {
    getStepFolder();
    setFile("");
    setFolderName("");
    setAddResourceData(() => {
      return { resourceTitle: "", folderName: "" };
    });
  };

  const addStepResource = () => {
    let data = JSON.stringify({
      SimuncationsID: props.id,
      folderName: addResourceData.folderName,
    });

    sendStepRequest(
      {
        url: `${process.env.REACT_APP_BASEURL}/createFolder`,
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
          "content-type": "application/json",
        },
        body: data,
      },
      addStepResourceResponse
    );
  };

  const getFolderResponse = (responseData: any) => {
    let folder = responseData.data;
    setFolder(folder);
  };

  const getFolder = () => {
    getGlobalFolderList(
      {
        url: `${process.env.REACT_APP_BASEURL}/Getfolder?id=${props.id}`,
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token"),
          "content-type": "application/json",
        },
      },
      getFolderResponse
    );
  };

  const getStepFolderResponse = (responseData: any) => {
    let folder = responseData.data;
    setStepFolder(folder);
  };

  const getStepFolder = () => {
    getStepList(
      {
        url: `${process.env.REACT_APP_BASEURL}/getFolderData?SimuncationId=${props.id}`,
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token"),
          "content-type": "application/json",
        },
      },
      getStepFolderResponse
    );
  };

  const GlobalResourceClear = () => {
    setAddResourceData({
      resourceTitle: "",
      folderName: "",
    });
    setFile("");
    setShowName("");
  };

  const handleImageChange = function (e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files;
    if (!fileList) return;
    fileToUrl(fileList[0], "image");
  };

  const handleImageRemove = function (e: React.ChangeEvent<HTMLInputElement>) {
    setFile("");
  };

  useEffect(() => {
    setModuleArrayList(moduleArray);
  }, [moduleArray]);

  return (
    <>
      <Col lg={3}>
        <div className={`${lx.sideCard}`}>
          <h5>Global Resources</h5>
          <ul>
            {globalResource?.map((item: any, index: any) => {
              if (item?.folderName == "None" || item?.folderName == "") {
                return item?.files.map((e: any, num: number) => {
                  return (
                    <li>
                      {isUrl ? (
                        <a
                          href={e?.file}
                          style={{ textDecoration: "none", color: "black",  }}
                        >
                          <AiOutlineFile className={`${lx.icon}`} />
                          {e.resourceTitle}{" "}
                        </a>
                      ) : (
                        <p
                      
                          onClick={() => {
                            if (
                              window.location.pathname.includes(
                                "/admin/edit-simulation"
                              )
                            ) {
                              setEditGlobalResource({
                                resouId: item.id,
                                fileName: e.resourceTitle,
                                boolean: true,
                              });
                              setDeleteGlobFile({
                                id: e.id,
                                folderId: item.id,
                              });
                              handleadShow2();
                              addResourceData.resourceTitle = e.resourceTitle;
                            }
                          }}
                        >
                         
                          <AiOutlineFile className={`${lx.icon}`} />
                          {e.resourceTitle}{" "}
                        </p>
                      )}

                      {window.location.pathname.includes(
                        "/admin/edit-simulation"
                      ) && (
                        <IoMdClose
                          className={`${lx.closeAction}`}
                          onClick={() => {
                            let data = {
                              id: e.id,
                              folderId: item.id,
                            };
                            dispatch(deleteGlobalFile(data));
                          }}
                        />
                      )}
                    </li>
                  );
                });
              }
              if (item?.folderName != "None" || item?.folderName != "") {
                return (
                  <li>
                    <a
                      href={`${process.env.REACT_APP_STUDENT_BASEURL}/get_student_resources?id=${props.id}&globid=${item?.id}`}
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      <AiOutlineFolder
                        className={`${lx.icon}`}
                        style={{ fontSize: "17px" }}
                      />{" "}
                      {item?.folderName}{" "}
                    </a>
                    {window.location.pathname.includes(
                      "/admin/edit-simulation"
                    ) && (
                      <IoMdClose
                        className={`${lx.closeAction}`}
                        onClick={() => {
                          dispatch(deleteGlobalFolder(item.id));
                        }}
                      />
                    )}
                    <ul className={`${lx.childUl}`}>
                      {item?.files?.map((e: any, num: number) => {
                        return (
                          <li>
                            {isUrl ? (
                              <a
                                href={e?.file}
                                style={{
                                  textDecoration: "none",
                                  color: "black",
                                }}
                              >
                                <AiOutlineFile className={`${lx.icon}`} />
                                {e.resourceTitle}{" "}
                              </a>
                            ) : (
                              <p
                                onClick={() => {
                                  if (
                                    window.location.pathname.includes(
                                      "/admin/edit-simulation"
                                    )
                                  ) {
                                    setEditGlobalResource({
                                      resouId: item.id,
                                      fileName: e.resourceTitle,
                                      boolean: true,
                                    });
                                    setDeleteGlobFile({
                                      id: e.id,
                                      folderId: item.id,
                                    });
                                    addResourceData.folderName =
                                      item?.folderName;
                                    handleadShow2();
                                    addResourceData.resourceTitle =
                                      e?.resourceTitle;
                                  }
                                }}
                              >
                               
                                <AiOutlineFile className={`${lx.icon}`} />{" "}
                                {e.resourceTitle}{" "}
                              </p>
                            )}
                            {window.location.pathname.includes(
                              "/admin/edit-simulation"
                            ) && (
                              <IoMdClose
                                className={`${lx.closeAction}`}
                                onClick={() => {
                                  let data = {
                                    id: e.id,
                                    folderId: item.id,
                                  };
                                  dispatch(deleteGlobalFile(data));
                                }}
                              />
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                );
              }
            })}
          </ul>

          {window.location.pathname.includes("/admin/edit-simulation") && (
            <ul className="pb-0">
              <span
                className={`${lx.newResource}`}
                onClick={() => {
                  handleadShow2();
                  setEditResource(false);
                  setEditGlobalResource({
                    resouId: "",
                    fileName: "",
                    boolean: false,
                  });
                }}
                style={{ cursor: "pointer" }}
              >
                Add New Resource +{" "}
              </span>
            </ul>
          )}

          <hr />

          <h5>Step Resources</h5>
          <ul>
            {moduleArrayList?.map((item: any, index: number) => {
              if (item.id == props.mid) {
                return item.addNewStepButtons[0].steps.map(
                  (e: any, num: number) => {
                    if (e.id == props.sid) {
                      return e.stepResources?.map(
                        (value: any, number: number) => {
                          return (
                            <>
                              {value.folderName == "" &&
                                value.files?.map((file: any, count: number) => {
                                  return (
                                    <li>
                                      {isUrl ? (
                                        <a
                                          href={file?.file}
                                          style={{
                                            textDecoration: "none",
                                            color: "black",
                                          }}
                                        >
                                          <AiOutlineFile
                                            className={`${lx.icon}`}
                                          />
                                          {file?.resourceTitle}{" "}
                                        </a>
                                      ) : (
                                        <p
                                        
                                          onClick={() => {
                                            if (
                                              window.location.pathname.includes(
                                                "/admin/edit-simulation"
                                              )
                                            ) {
                                              setResourceId({
                                                moduleId: item.id,
                                                stepId: e.id,
                                                folderId: value.id,
                                                fileId: file.id,
                                              });
                                              setAddResourceData({
                                                resourceTitle:
                                                  file?.resourceTitle,
                                                folderName: "",
                                              });
                                              setFile(file?.file);
                                              setDoc(file?.file);
                                              setEditResource(true);
                                              handleadShow3();
                                            }
                                          }}
                                        >
                                         
                                          <AiOutlineFile
                                            className={`${lx.icon}`}
                                          />
                                          {file.resourceTitle}{" "}
                                        </p>
                                      )}
                                      {window.location.pathname.includes(
                                        "/admin/edit-simulation"
                                      ) && (
                                        <IoMdClose
                                          className={`${lx.closeAction}`}
                                          onClick={() => {
                                            let data = {
                                              moduleId: item.id,
                                              stepId: e.id,
                                              folderId: value.id,
                                              fileId: file.id,
                                            };
                                            dispatch(deleteStepFile(data));
                                          }}
                                        />
                                      )}
                                    </li>
                                  );
                                })}
                              {value.folderName &&
                                value.folderName != "None" && (
                                  <div>
                                    <li>
                                      <AiOutlineFolder
                                        className={`${lx.icon}`}
                                        style={{ fontSize: "17px" }}
                                      />{" "}
                                      {value.folderName}
                                      {window.location.pathname.includes(
                                        "/admin/edit-simulation"
                                      ) && (
                                        <IoMdClose
                                          className={`${lx.closeAction}`}
                                          onClick={() => {
                                            let data = {
                                              moduleId: item.id,
                                              stepId: e.id,
                                              id: value.id,
                                            };
                                            dispatch(deleteStepFolder(data));
                                          }}
                                        />
                                      )}
                                    </li>

                                    <ul className={`${lx.childUl}`}>
                                      {value.files?.map(
                                        (file: any, count: number) => {
                                          return (
                                            <li>
                                              {isUrl ? (
                                                <a
                                                  href={file?.file}
                                                  style={{
                                                    textDecoration: "none",
                                                    color: "black",
                                                  }}
                                                >
                                                  <AiOutlineFile
                                                    className={`${lx.icon}`}
                                                  />
                                                  {file.resourceTitle}{" "}
                                                </a>
                                              ) : (
                                                <p
                                                  onClick={() => {
                                                    if (
                                                      window.location.pathname.includes(
                                                        "/admin/edit-simulation"
                                                      )
                                                    ) {
                                                      setResourceId({
                                                        moduleId: item.id,
                                                        stepId: e.id,
                                                        folderId: value.id,
                                                        fileId: file.id,
                                                      });
                                                      setAddResourceData({
                                                        resourceTitle:
                                                          file?.resourceTitle,
                                                        folderName:
                                                          value?.folderName,
                                                      });
                                                      setFile(file?.file);
                                                      setDoc(file?.file);
                                                      setEditResource(true);
                                                      handleadShow3();
                                                    }
                                                  }}
                                                >
                                                 
                                                  <AiOutlineFile
                                                    className={`${lx.icon}`}
                                                  />{" "}
                                                  {file.resourceTitle}{" "}
                                                </p>
                                              )}
                                              {window.location.pathname.includes(
                                                "/admin/edit-simulation"
                                              ) && (
                                                <IoMdClose
                                                  className={`${lx.closeAction}`}
                                                  onClick={() => {
                                                    let data = {
                                                      moduleId: item.id,
                                                      stepId: e.id,
                                                      folderId: value.id,
                                                      id: file.id,
                                                    };
                                                    dispatch(
                                                      deleteStepFile(data)
                                                    );
                                                  }}
                                                />
                                              )}
                                            </li>
                                          );
                                        }
                                      )}
                                    </ul>
                                  </div>
                                )}
                            </>
                          );
                        }
                      );
                    }
                  }
                );
              }
            })}
            {window.location.pathname.includes("/admin/edit-simulation") && (
              <span
                className={`${lx.newResource}`}
                onClick={() => {
                  setEditResource(false);
                  handleadShow3();
                }}
                style={{ cursor: "pointer" }}
              >
                Add New Resource +{" "}
              </span>
            )}
          </ul>
        </div>

        <div className={`${lx.sideCard}`}>
          <h5>Advice from your Colleagues</h5>
          <ul>
            {moduleArrayList?.map((item: any, index: number) => {
              if (item.id == props.mid) {
                return item.addNewStepButtons[0].steps.map(
                  (e: any, num: number) => {
                    if (e.id == props.sid) {
                      return e.adviceCollegues?.map(
                        (value: any, number: number) => {
                          return (
                            <li className="pe-0">
                              <div
                                title="Edit"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  if (
                                    window.location.pathname.includes(
                                      "/admin/edit-simulation"
                                    )
                                  ) {
                                    setAdviceData({
                                      moduleId: item.id,
                                      stepId: e.id,
                                      id: value.id,
                                      editAdvice: true,
                                    });
                                    setFirstName(value?.firstName);
                                    setLastName(value?.lastName);
                                    setAdvice(value?.advice);
                                    setFile(value?.file);
                                    handleadShow();
                                  }
                                }}
                              >
                                <div className={`${lx.sideCardProfile}`}>
                                  <img
                                    src={
                                      value?.file == "" ? profile : value?.file
                                    }
                                    className={`${lx.logoIcon}`}
                                    alt="image"
                                  />
                                  {value?.firstName} {value?.lastName}
                                </div>
                                <p>{value?.advice}</p>
                              </div>
                              {window.location.pathname.includes(
                                "/admin/edit-simulation"
                              ) && (
                                <IoMdClose
                                  className={`${lx.closeAction}`}
                                  onClick={() => {
                                    let data = {
                                      moduleId: item.id,
                                      stepId: e.id,
                                      id: value.id,
                                    };
                                    dispatch(deleteAdvice(data));
                                  }}
                                />
                              )}
                            </li>
                          );
                        }
                      );
                    }
                  }
                );
              }
            })}
            {window.location.pathname.includes("/admin/edit-simulation") && (
              <span
                className={`${lx.newResource}`}
                onClick={handleadShow}
                style={{ cursor: "pointer" }}
              >
                Add New Advice +{" "}
              </span>
            )}
          </ul>
        </div>
      </Col>

      {/* Add Advice From Colleague Popup START */}
      <Modal
        show={adshow}
        className={`${lx.modalCts}`}
        size="xl"
        onHide={() => {
          handleadClose();
          setFile("");
          setFirstName("");
          setLastName("");
          setAdvice("");
          setAdviceData({
            moduleId: "",
            stepId: "",
            id: "",
            editAdvice: false,
          });
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className={`mt-0 ${lx.formBoxRow}`}>
            <Col lg={12}>
              <Row>
                <Col lg={12} className="mb-3">
                  <h5>Add Advice From Colleague</h5>
                </Col>
              </Row>

              <Form.Group
                className={`col-lg-12 ${lx.formBox}`}
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Colleague Headshot</Form.Label>
                <Row className="align-items-center">
                  <Col lg={3}>
                    <div className={`mb-3 ${lx.uploadPhotoBox}`}>
                      <img
                        src={file == "" ? userImage : file}
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
                          accept="image/png, image/jpg, image/jpeg"
                        />
                      </button>
                      <button
                        type="button"
                        className={`${lx.reMove}`}
                        onClick={(event: any) => {
                          handleImageRemove(event);
                        }}
                      >
                        Remove Photo
                      </button>
                    </div>
                  </Col>
                  <Col lg={9}>
                    <Row>
                      <Col lg={6} className="mb-3">
                        <Form.Control
                          type="text"
                          placeholder="First Name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </Col>
                      <Col lg={6} className="mb-3">
                        <Form.Control
                          type="text"
                          placeholder="Last Name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group
                className={`col-lg-12 ${lx.formBox}`}
                controlId="exampleForm.ControlInput2"
              >
                <Form.Label>Advice from Colleague</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Add advice..."
                  value={advice}
                  onChange={(e) => setAdvice(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          {adviceData.editAdvice == false ? (
            <>
              <Button
                className={`${lx.savBtn}`}
                onClick={() => {
                  let data = {
                    mId: props.mid,
                    sId: props.sid,
                    file: file,
                    firstName: firstName,
                    lastName: lastName,
                    advice: advice,
                  };
                  dispatch(adviceIncreaser(data));
                  handleadClose();
                  setFirstName("");
                  setLastName("");
                  setAdvice("");
                  setFile("");
                }}
              >
                Save and Exit
              </Button>
              <Button
                className={`${lx.savBtnAnother}`}
                onClick={() => {
                  let data = {
                    mId: props.mid,
                    sId: props.sid,
                    file: file,
                    firstName: firstName,
                    lastName: lastName,
                    advice: advice,
                  };
                  dispatch(adviceIncreaser(data));
                  setFirstName("");
                  setLastName("");
                  setAdvice("");
                  setFile("");
                }}
              >
                Save and Add Another
              </Button>
            </>
          ) : (
            <Button
              className={`${lx.savBtnAnother}`}
              onClick={() => {
                let data = {
                  mId: adviceData.moduleId,
                  sId: adviceData.stepId,
                  id: adviceData.id,
                  file: file,
                  firstName: firstName,
                  lastName: lastName,
                  advice: advice,
                };
                dispatch(adviceUpdator(data));
                handleadClose();
                setFirstName("");
                setLastName("");
                setAdvice("");
                setFile("");
                setAdviceData({
                  moduleId: "",
                  stepId: "",
                  id: "",
                  editAdvice: false,
                });
              }}
            >
              Update and Exit
            </Button>
          )}
        </Modal.Footer>
      </Modal>
      {/* Add Advice From Colleague Popup END */}

      {/* Add Resource Popup START */}
      <Modal
        show={adshow2}
        className={`${lx.modalCts}`}
        size="xl"
        onHide={() => {
          GlobalResourceClear();
          handleadClose2();
          setFolderName("");
          setDoc("");
          setShowName("");
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className={`mt-0 ${lx.formBoxRow}`}>
            <Col lg={12}>
              <Row>
                <Col lg={12} className="mb-3">
                  <h5>Add Resource</h5>
                </Col>
              </Row>

              <Form.Group
                className={`col-lg-12 ${lx.formBox}`}
                controlId="exampleForm.ControlInput1"
              >
                <Row className="align-items-center">
                  <Col lg={12}>
                    <Row>
                      <Col lg={6} className="mb-3">
                        <Form.Label>Resource Title</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Resource Title here..."
                          ref={inputRef}
                          defaultValue={
                            addResourceData.resourceTitle == ""
                              ? showName
                              : addResourceData.resourceTitle
                          }
                          onChange={(e) => {
                            addResourceData.resourceTitle = e.target.value;
                          }}
                        />
                      </Col>
                      <Col lg={6} className="mb-3">
                        <Form.Label>Choose Folder</Form.Label>
                        <Form.Select
                          onChange={(e) => {
                            if (e.target.value == "None") {
                              setFolderName("None");
                              setshowFolder(false);
                              setAddResourceData((prev: any) => {
                                return {
                                  resourceTitle: prev.resourceTitle,
                                  folderName: "None",
                                };
                              });
                            } else if (e.target.value == "+ New Folder") {
                              setshowFolder(true);
                            } else {
                              addResourceData.folderName = e.target.value;
                              let item: any = stepFolder.filter((val) => {
                                return val.folderName === e.target.value;
                              });
                              setFolderName(e.target.value);
                              setAddResourceData((prev: any) => {
                                return {
                                  resourceTitle: prev.resourceTitle,
                                  folderName: e.target.value,
                                };
                              });
                            }
                          }}
                          value={
                            folderName == ""
                              ? addResourceData.folderName
                              : folderName
                          }
                        >
                          <option>None</option>
                          {folder?.map((e: any, index: number) => {
                            return (
                              <option key={index}>{e.Choosefolder}</option>
                            );
                          })}
                          {folderName != "" ? (
                            <option>{folderName}</option>
                          ) : (
                            ""
                          )}
                          <option>+ New Folder</option>
                        </Form.Select>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Form.Group>

              <Form.Group
                className={`col-lg-12 ${lx.formBox}`}
                controlId="exampleForm.ControlInput3"
              >
                <Form.Label>Select Resource to Upload</Form.Label>
                <div className={`${lx.fileUpload}`}>
                  <FileUploader
                    handleChange={handleChange}
                    name="file"
                    // types={fileTypes}
                    classes="demo"
                    fileOrFiles={file}
                    //disabled={isDisabled}
                  >
                    {file == "" ? (
                      <img
                        src={uploadImg2}
                        className={`${lx.logoIcon}`}
                        width="200px"
                        alt="logo"
                      />
                    ) : file?.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                      <img
                        src={file}
                        className={`${lx.logoIcon}`}
                        width="200px"
                        alt="logo"
                      />
                    ) : (
                      <p>
                       
                        <GrDocumentDownload width={50} /> {doc}
                      </p>
                    )}
                    <p>Drag and drop files here </p>
                    <span>or</span>
                    <div className={`${lx.uploadFile}`}>
                      <Form.Control type="file" />
                      Choose a File or Folder <GrAttachment />
                    </div>
                  </FileUploader>
                </div>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          {editGlobalResource.boolean == false ? (
            <>
              <Button
                className={`${lx.savBtn}`}
                onClick={() => {
                  let data = {
                    resourceTitle:
                      addResourceData.resourceTitle == ""
                        ? showName
                        : addResourceData.resourceTitle,
                    file: file,
                    folderName: addResourceData.folderName,
                  };
                  dispatch(globalResourceIncreaser(data));
                  addResource();
                  setadShow2(false);
                  setFolderName("");
                  setDoc("");
                  setShowName("");
                  GlobalResourceClear();
                }}
              >
                Save and Exit
              </Button>
              <Button
                className={`${lx.savBtnAnother}`}
                onClick={() => {
                  let data = {
                    resourceTitle:
                      addResourceData.resourceTitle == ""
                        ? showName
                        : addResourceData.resourceTitle,
                    file: file,
                    folderName: addResourceData.folderName,
                  };
                  dispatch(globalResourceIncreaser(data));
                  addResource();
                  setFolderName("");
                  setDoc("");
                  setShowName("");
                  GlobalResourceClear();
                  addResourceData.resourceTitle = "";
                  inputRef.current.value = "";
                }}
              >
                Save and Add Another
              </Button>
            </>
          ) : (
            <Button
              className={`${lx.savBtn}`}
              onClick={() => {
                let data = {
                  id: deleteGlobFile.id,
                  folderId: deleteGlobFile.folderId,
                };
                dispatch(deleteGlobalFile(data));
                let gbData = {
                  resourceTitle:
                    addResourceData.resourceTitle == ""
                      ? showName
                      : addResourceData.resourceTitle,
                  file: file,
                  folderName: addResourceData.folderName,
                };
                dispatch(globalResourceIncreaser(gbData));
                addResource();
                setadShow2(false);
                setFolderName("");
                setDoc("");
                setShowName("");
                setEditGlobalResource({
                  resouId: "",
                  fileName: "",
                  boolean: false,
                });
                setDeleteGlobFile({
                  id: "",
                  folderId: "",
                });
                GlobalResourceClear();
                addResourceData.folderName = "";
              }}
            >
              Update and Exit
            </Button>
          )}
        </Modal.Footer>
      </Modal>
      {/* Add Resource Popup END */}

      {/* Add Step Resource Popup START */}
      <Modal
        show={adshow3}
        className={`${lx.modalCts}`}
        size="xl"
        onHide={() => {
          GlobalResourceClear();
          handleadClose3();
          setDoc("");
          setFolderName("");
          setShowName("");
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className={`mt-0 ${lx.formBoxRow}`}>
            <Col lg={12}>
              <Row>
                <Col lg={12} className="mb-3">
                  <h5>Add Resource</h5>
                </Col>
              </Row>

              <Form.Group
                className={`col-lg-12 ${lx.formBox}`}
                controlId="exampleForm.ControlInput1"
              >
                <Row className="align-items-center">
                  <Col lg={12}>
                    <Row>
                      <Col lg={6} className="mb-3">
                        <Form.Label>Resource Title</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Resource Title here..."
                          ref={inputRef}
                          defaultValue={
                            addResourceData.resourceTitle == ""
                              ? showName
                              : addResourceData.resourceTitle
                          }
                          onChange={(e) => {
                            setAddResourceData((prev: any) => {
                              return {
                                resourceTitle: e.target.value,
                                folderName: prev.folderName,
                              };
                            });
                          }}
                        />
                      </Col>
                      <Col lg={6} className="mb-3">
                        <Form.Label>Choose Folder</Form.Label>
                        <Form.Select
                          onChange={(e) => {
                            if (e.target.value == "None") {
                              setFolderName("None");
                              setshowFolder(false);
                              setAddResourceData((prev: any) => {
                                return {
                                  resourceTitle: prev.resourceTitle,
                                  folderName: "",
                                };
                              });
                            } else if (e.target.value == "+ New Folder") {
                              setshowFolder(true);
                            } else {
                              addResourceData.folderName = e.target.value;
                              let item: any = stepFolder.filter((val) => {
                                return val.folderName === e.target.value;
                              });
                              setFolderName(e.target.value);
                              setAddResourceData((prev: any) => {
                                return {
                                  resourceTitle: prev.resourceTitle,
                                  folderName: e.target.value,
                                };
                              });
                            }
                          }}
                          value={
                            folderName == ""
                              ? addResourceData.folderName
                              : folderName
                          }
                        >
                          <option>None</option>
                          {stepFolder?.map((e: any, index: number) => {
                            if (e.folderName !== "") {
                              return (
                                <option key={index}>{e.folderName}</option>
                              );
                            }
                          })}
                          {folderName != "" ? (
                            <option>{folderName}</option>
                          ) : (
                            ""
                          )}
                          <option>+ New Folder</option>
                        </Form.Select>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Form.Group>

              <Form.Group
                className={`col-lg-12 ${lx.formBox}`}
                controlId="exampleForm.ControlInput3"
              >
                <Form.Label>Select Resource to Upload</Form.Label>
                <div className={`${lx.fileUpload}`}>
                  <FileUploader
                    handleChange={handleChange}
                    name="file"
                    // types={fileTypes}
                    classes="demo"
                    fileOrFiles={file}
                    //disabled={isDisabled}
                  >
                    {file == "" ? (
                      <img
                        src={uploadImg2}
                        className={`${lx.logoIcon}`}
                        width="200px"
                        alt="logo"
                      />
                    ) : file?.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                      <img
                        src={file}
                        className={`${lx.logoIcon}`}
                        width="200px"
                        alt="logo"
                      />
                    ) : (
                      <p>
                       
                        <GrDocumentDownload width={50} /> {doc}
                      </p>
                    )}

                    <p>Drag and drop files here </p>
                    <span>or</span>
                    <div className={`${lx.uploadFile}`}>
                      <Form.Control type="file" />
                      Choose a File or Folder <GrAttachment />
                    </div>
                  </FileUploader>
                </div>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          {editResource == true ? (
            <Button
              className={`${lx.savBtn}`}
              onClick={() => {
                let dataDelete = {
                  moduleId: resourceId?.moduleId,
                  stepId: resourceId?.stepId,
                  folderId: resourceId?.folderId,
                  id: resourceId?.fileId,
                };
                dispatch(deleteStepFile(dataDelete));
                let data = {
                  mId: resourceId?.moduleId,
                  sId: resourceId?.stepId,
                  resourceTitle:
                    addResourceData.resourceTitle == ""
                      ? showName
                      : addResourceData.resourceTitle,
                  file: file,
                  folderName: addResourceData?.folderName,
                };
                addStepResource();
                dispatch(stepResourceIncreaser(data));
                handleadClose3();
                setEditResource(false);
                setFolderName("");
                setDoc("");
                setShowName("");
              }}
            >
              Update and Exit
            </Button>
          ) : (
            <>
              <Button
                className={`${lx.savBtn}`}
                onClick={() => {
                  let data = {
                    mId: props.mid,
                    sId: props.sid,
                    resourceTitle:
                      addResourceData.resourceTitle == ""
                        ? showName
                        : addResourceData.resourceTitle,
                    file: file,
                    folderName: addResourceData.folderName,
                  };
                  addStepResource();
                  dispatch(stepResourceIncreaser(data));
                  handleadClose3();
                  setFolderName("");
                  setDoc("");
                  setShowName("");
                }}
              >
                Save and Exit
              </Button>
              <Button
                className={`${lx.savBtnAnother}`}
                onClick={() => {
                  let data = {
                    mId: props.mid,
                    sId: props.sid,
                    resourceTitle:
                      addResourceData.resourceTitle == ""
                        ? showName
                        : addResourceData.resourceTitle,
                    file: file,
                    folderName: addResourceData.folderName,
                  };
                  addStepResource();
                  dispatch(stepResourceIncreaser(data));
                  setFile("");
                  setDoc("");
                  setShowName("");
                  setFolderName("");
                  GlobalResourceClear();
                  addResourceData.resourceTitle = "";
                  inputRef.current.value = "";
                }}
              >
                Save and Add Another
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
      {/* Add Step Resource Popup END */}

      {/* Add New Folder Name Popup START */}
      <Modal
        show={showFolder}
        className={`${lx.modalCts}`}
        onHide={handleShowFolder}
      >
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className={`mt-0 ${lx.formBoxRow}`}>
            <Col lg={12}>
              <Row>
                <Col lg={12} className="mb-3">
                  <h5>Add Folder Name</h5>
                </Col>
              </Row>

              <Form.Group
                className={`col-lg-12 ${lx.formBox}`}
                controlId="exampleForm.ControlInput1"
              >
                <Row className="align-items-center">
                  <Col lg={12}>
                    <Row>
                      <Col lg={12} className="mb-3">
                        <Form.Label>Folder Title</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Folder Name here..."
                          onChange={(e) => {
                            addResourceData.folderName = e.target.value;
                            setFolderName(e.target.value);
                          }}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button className={`${lx.savBtn}`} onClick={handleShowFolder}>
            Add Folder Name
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Add New Folder Name Popup END */}
    </>
  );
};

export default RightSidebar;
