import React, { Fragment } from "react";
import { NavLink, Prompt, useHistory } from "react-router-dom";
import { Card, Col, Row, Form, Button, Modal, Tab, Nav } from "react-bootstrap";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import cx from "../../../admin.style.module.scss";
import lx from "./Edit_simulation.module.scss";
import { useState, useEffect } from "react";
import { HiOutlineMailOpen } from "react-icons/hi";
import { HiOutlineMail } from "react-icons/hi";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdCall } from "react-icons/md";
import { AiOutlineCloudDownload } from "react-icons/ai";
import { BiHelpCircle } from "react-icons/bi";
import { BiText } from "react-icons/bi";
import { BiImageAlt } from "react-icons/bi";
import { BsLink } from "react-icons/bs";
import { ImEmbed2 } from "react-icons/im";
import action1 from "../../../images/action-1.svg";
import buttonImg from "../../../images/btn_img.svg";
import buttonImg2 from "../../../images/btn_img2.svg";
import buttonImg3 from "../../../images/btn_img3.svg";
import buttonImg4 from "../../../images/btn_img4.svg";
import buttonImg5 from "../../../images/btn_img5.svg";
import action2 from "../../../images/action-2.svg";
import action3 from "../../../images/action-3.svg";
import action4 from "../../../images/action-4.svg";
import action5 from "../../../images/action-5.svg";
import action6 from "../../../images/action-6.svg";
import action7 from "../../../images/action-7.svg";
import action8 from "../../../images/action-8.svg";
import action9 from "../../../images/action-9.svg";
import action10 from "../../../images/action-10.svg";
import WebLink from "./actions/WebLink";
import ReadEmailAction from "./actions/ReadEmailAction";
import AddText from "./actions/AddText";
import DownloadFileAction from "./actions/DownloadFileAction";
import WriteFileAction from "./actions/WriteEmailAction";
import UploadFileAction from "./actions/UploadFileAction";
import EmbeddedVideoAction from "./actions/EmbeddedVideoAction";
import QandAAction from "./actions/QandAAction";
import EmbeddedImage from "./actions/EmbeddedImage";
import ScheduleLiveAction from "./actions/ScheduleLiveAction";
import { FiDownloadCloud } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "../../../components/sidebar/Sidebar";
import Simulationmenu from "../../../components/simulationmenu/Simulationmenu";
import RightSidebar from "../../../components/right-sidebar/right-sidebar";
import {
  moduleArray,
  actionIncreaser,
  globalResourceCounting,
  changeStepdata,
  changeModuledata,
  changeModuleArrayValue,
  jointFeedback,
  changeDivUrl,
  counting,
  changeModuleCount,
  globalResource,
  changeGlobalResourceValue,
  jointFeedbackResource,
} from "../../../reduxToolkit/reducers/moduleButtonReducer";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import useHttp from "../../../hooks/use-https";
import { useParams } from "react-router-dom";
import ReactLoading from "react-loading";

const reorder = (list: any, startIndex: any, endIndex: any) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const EditSimulation = (props: any) => {
  const publishState = useSelector((state: any) => state.moduleButtonReducer);
  let param: any = useParams();
  const history = useHistory();
  useEffect(() => {
    getData();
    getSimulationById();
    getGlobalResource();
    getCriteria();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      let date = new Date();
      let time = date.getTime();
      let id = param.id;
      let data = {
        cachetime: time,
        cacheid: id,
        count: moduleCount,
        globalResourceCounting: globalResourceCounting,
        globalResource: globalResource,
      };
      addDataIntoCache("MyCache", moduleArray);
      addTimeIntoCache("cacheTime", data);
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const hitApi = setInterval(() => {
      editSimulation();
    }, 20000);

    return () => {
      clearInterval(hitApi);
    };
  });

  useEffect(() => {
    if (publishState.publish > 0) {
      editSimulation();
    }
  }, [publishState.publish]);

  const [criteriaArr, setCriteriaArr] = useState<any[]>([]);

  const urlChange = useSelector(
    (state: any) => state.moduleButtonReducer.value
  );
  const actionState = useSelector(
    (state: any) => state.moduleButtonReducer.actionCount
  );
  const moduleCount = counting;
  const moduleCheck = useSelector(
    (state: any) => state.moduleButtonReducer.check
  );
  const moduleChange = useSelector(
    (state: any) => state.moduleButtonReducer.moduleChange
  );
  const feedCount = useSelector(
    (state: any) => state.moduleButtonReducer.feedCount
  );
  const feedResourceCount = useSelector(
    (state: any) => state.moduleButtonReducer.feedResourceCount
  );
  const queCount = useSelector(
    (state: any) => state.moduleButtonReducer.queCount
  );
  const [show, setShow] = useState(false);

  const handlefrShow = () => setShow(true);

  const dispatch = useDispatch();

  const [acshow, setacShow] = useState(false);
  const [hideActiontext, sethideActiontext] = useState(true);
  const [tabActionShow, settabActionShow] = useState("tab0");
  const [tabActionShowSubmit, settabActionShowSubmit] = useState("tab0");
  const [tabValue, setTabValue] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [allData, setAllData] = useState<any>();
  const [cacheGetTime, setCacheGetTime] = useState("");
  const [cacheGetId, setCacheGetId] = useState("");
  const [loading, setLoading] = useState(true);
  const [globalList, setGlobalList] = useState<any[]>([]);
  const [criteriaData, setCriteriaData] = useState<any>();
  const [action, setAction] = useState({
    id: "",
    name: "",
  });

  const { sendRequest } = useHttp();
  const { sendRequest: getrequest } = useHttp();
  const { sendRequest: getGlobalList } = useHttp();
  const { sendRequest: criteriaRequest } = useHttp();
  const { sendRequest: criteriaGetReq } = useHttp();

  useEffect(() => {
    setItems(moduleArray);
  }, [
    actionState,
    moduleCount,
    moduleCheck,
    moduleChange,
    feedCount,
    feedResourceCount,
    queCount,
  ]);

  window.onbeforeunload = function () {
    return "Data will be lost if you leave the page, are you sure?";
  };

  const handleacClose = () => {
    setTimeout(() => {
      sethideActiontext(false);
    }, 1500);
  };
  const handleacShow = () => {
    setacShow(true);
  };

  const tabSelected = (event: any) => {
    settabActionShow(event);
  };

  const simulationResponse = (responseData: any) => {
    console.log(responseData, "responseData");
  };

  const editSimulation = () => {
    let date = new Date();
    let time = date.getTime();

    let data = JSON.stringify({
      _id: allData?._id,
      NameOfSimulation: allData?.NameOfSimulation,
      DiscreptionOfSimulation: allData?.DiscreptionOfSimulation,
      ResorceTitle: allData?.ResorceTitle,
      file: allData?.file,
      SimulationCategory: allData?.SimulationCategory,
      SimulationModule: moduleCount,
      AddallModule: moduleArray,
      time: time,
      globalResourceCount: globalResourceCounting,
      globalResourceArray: globalResource,
    });

    sendRequest(
      {
        url: `${process.env.REACT_APP_BASEURL}/editSimulation`,
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
          "content-type": "application/json",
        },
        body: data,
      },
      simulationResponse
    );
  };

  const simulationByIdResponse = (responseData: any) => {
    let simulationArray = responseData.data.AddallModule;
    let countModule = responseData.data.SimulationModule;
    let data = {
      global: responseData.data.globalResourceArray,
      gbCount: responseData.data.globalResourceCount,
    };
    if (cacheGetTime != "" && cacheGetId != "") {
      if (responseData.data._id == cacheGetId) {
        if (responseData.data.time >= cacheGetTime) {
          dispatch(changeGlobalResourceValue(data));
          dispatch(changeModuleCount(countModule));
          dispatch(changeModuleArrayValue(simulationArray));
          dispatch(
            changeDivUrl(
              `${simulationArray[0].addNewStepButtons[0].steps[0].id}`
            )
          );
        }
      }
    } else {
      dispatch(changeModuleCount(countModule));
      dispatch(changeModuleArrayValue(simulationArray));
      dispatch(
        changeDivUrl(`${simulationArray[0].addNewStepButtons[0].steps[0].id}`)
      );
      dispatch(changeGlobalResourceValue(data));
    }
    setAllData(responseData.data);
    setLoading(false);
    setGlobalList(data.global);
  };

  const getSimulationById = () => {
    getrequest(
      {
        url: `${process.env.REACT_APP_BASEURL}/GetSimulationData?simunactionsID=${param.id}`,
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token"),
          "content-type": "application/json",
        },
      },
      simulationByIdResponse
    );
  };

  const getGlobalResourceResponse = (responseData: any) => {
    // setGlobalList(responseData.data);
  };

  const getGlobalResource = () => {
    getGlobalList(
      {
        url: `${process.env.REACT_APP_BASEURL}/getResourse?id=${param.id}`,
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token"),
          "content-type": "application/json",
        },
      },
      getGlobalResourceResponse
    );
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    let check: any[] = [];

    const itemSubItemMap = items?.map((item: any) => {
      for (let i = 0; i < item.addNewStepButtons[0].steps.length; i++) {
        check.push(item.addNewStepButtons[0].steps[i]);
      }
    }, {});

    const checkSubItemMap = check?.reduce((acc: any, item: any) => {
      acc[item.id] = item.actions;
      return acc;
    }, {});

    const sourceParentId = result.source.droppableId;
    const sourceSubItems = checkSubItemMap[sourceParentId];
    let newItems = [...items];

    const reorderedItems = reorder(
      sourceSubItems,
      result.source.index,
      result.destination.index
    );
    newItems = newItems?.map((item: any) => {
      item.addNewStepButtons[0].steps?.map((e: any) => {
        if (e.id == result.source.droppableId) {
          e.actions = reorderedItems;
        }
      });
      return item;
    });

    setItems(newItems);
  };

  const addDataIntoCache = (cacheName: any, response: any) => {
    // Converting our response into Actual Response form
    const data = new Response(JSON.stringify(response));

    if ("caches" in window) {
      // Opening given cache and putting our data into it
      caches.open(cacheName).then((cache) => {
        cache.put("http://appicsoftwares.in/", data);
      });
    }
  };

  const addTimeIntoCache = (cacheName: any, response: any) => {
    // Converting our response into Actual Response form
    const data = new Response(JSON.stringify(response));

    if ("caches" in window) {
      // Opening given cache and putting our data into it
      caches.open(cacheName).then((cache: any) => {
        cache.put("http://appicsoftwares.in/", data);
      });
    }
  };

  // Function to get all cache data
  async function getData() {
    const cacheVersion = 1;
    const cacheName = `MyCache`;
    const cacheTime = `cacheTime`;
    const url = "http://appicsoftwares.in/";
    let cachedData = await getCachedData(cacheName, url);
    let cachedTime: any = await getCachedData(cacheTime, url);

    setTimeout(() => {
      if (cachedTime) {
        if (cachedData) {
          if (cachedTime.cacheid == allData?._id) {
            if (cachedTime.cachetime > allData?.time) {
              let data = {
                global: cachedTime.globalResource,
                gbCount: cachedTime.globalResourceCounting,
              };
              dispatch(changeModuleCount(cachedTime.count));
              dispatch(changeModuleArrayValue(cachedData));
              dispatch(
                changeDivUrl(
                  `${cachedData[0]?.addNewStepButtons[0]?.steps[0]?.id}`
                )
              );
              dispatch(changeGlobalResourceValue(data));
            }
          }
          setCacheGetTime(cachedTime.cachetime);
          setCacheGetId(cachedTime.cacheid);
          return cachedData;
        }
        return cachedData;
      }
    }, 1000);
  }

  // Get data from the cache.
  async function getCachedData(cacheName: any, url: any) {
    const cacheStorage = await caches.open(cacheName);
    const cachedResponse = await cacheStorage.match(url);

    if (!cachedResponse || !cachedResponse.ok) {
      return false;
    }
    return await cachedResponse.json();
  }

  let modId = "";
  let stId = "";

  const addFields = () => {
    addCriteria();
    dispatch(jointFeedback(action.id));
  };

  const handlefrClose = () => {
    addCriteria();
    setShow(false);
  };

  const criteriaResponse = (responseData: any) => {
    setCriteriaArr([]);
    getCriteria();
  };

  const addCriteria = () => {
    let data = JSON.stringify({
      criteria: criteriaArr,
    });

    criteriaRequest(
      {
        url: `${process.env.REACT_APP_BASEURL}/addCriteria`,
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
          "content-type": "application/json",
        },
        body: data,
      },
      criteriaResponse
    );
  };

  const getCriteriaResponse = (responseData: any) => {
    setCriteriaData(responseData.data);
  };

  const getCriteria = () => {
    criteriaGetReq(
      {
        url: `${process.env.REACT_APP_BASEURL}/getCriteriaDetils`,
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token"),
          "content-type": "application/json",
        },
      },
      getCriteriaResponse
    );
  };

  let actionDes = {
    id: "",
    name: "",
  };

  const actionId = (e: any, name: any) => {
    actionDes = {
      id: e,
      name: name,
    };
    setAction(actionDes);
  };

  const [image, setImage] = useState<any>();
  let postResourceData = {
    id: "",
    title: "",
    url: "",
  };
  const handleImageChange = function (e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files;
    if (!fileList) return;
    fileToUrl(fileList[0]);
    postResourceData.id = action.id;
    postResourceData.title = fileList[0].name;
  };

  const fileConvertingUrl = (responseData: any) => {
    setImage(responseData.data?.file);
    postResourceData.url = responseData.data?.file;
    dispatch(jointFeedbackResource(postResourceData));
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
  };
  const [stopPropmt, setStopPrompt] = useState(false);
  function promptStop(bool: boolean) {
    setStopPrompt(bool);
  }
  return (
    <>
      <Prompt
        when={stopPropmt}
        message={(location, action): any => {
          if (action === "POP") {
            console.log("Backing up...");
          }
          return location.pathname.startsWith("/app")
            ? true
            : `Are you sure you want to go to ${location.pathname}?`;
        }}
      />
      <Header title="Onboarding Simulation" func={editSimulation} />
      <Sidebar
        onClick={() => {
          promptStop(true);
        }}
      />
      <div
        onMouseEnter={() => {
          promptStop(false);
        }}
      >
        <section className={`${cx.pageWrapper}`}>
          {loading ? (
            <div className="d-flex justify-content-center">
              <ReactLoading type="cylon" color="blue" />{" "}
            </div>
          ) : (
            <Row>
              <Simulationmenu />
              <Col lg="6">
                {items?.map((val: any) => {
                  return val.addNewStepButtons[0].steps?.map((e: any) => {
                    if (e.id == urlChange) {
                      return (
                        (modId = val.id),
                        (stId = e.id),
                        (
                          <Card>
                            <Card.Body>
                              <Card.Text>
                                <Form className="row">
                                  <Form.Group
                                    className={`col-lg-12 ${cx.formBox}`}
                                    controlId="exampleForm.ControlInput1"
                                  >
                                    <Form.Control
                                      type="text"
                                      placeholder={`${val.content}`}
                                      defaultValue={`${val.title}`}
                                      onChange={(event) => {
                                        val.title = event.target.value;
                                        dispatch(
                                          changeModuledata(event.target.value)
                                        );
                                      }}
                                    />
                                  </Form.Group>
                                  <Form.Group
                                    className={`col-lg-12 ${cx.formBox}`}
                                    controlId="exampleForm.ControlInput1"
                                  >
                                    <Form.Control
                                      type="text"
                                      placeholder="Add Description..."
                                      defaultValue={`${val.description}`}
                                      onChange={(event: any) => {
                                        val.description = event.target.value;
                                      }}
                                    />
                                  </Form.Group>
                                  <Form.Group
                                    className={`col-lg-12 ${cx.formBox}`}
                                    controlId="exampleForm.ControlInput1"
                                  >
                                    <Form.Control
                                      type="text"
                                      placeholder={`${e.content}`}
                                      defaultValue={`${e.title}`}
                                      onChange={(event: any) => {
                                        e.title = event.target.value;
                                        dispatch(
                                          changeStepdata(event.target.value)
                                        );
                                      }}
                                    />
                                  </Form.Group>
                                  <Form.Group
                                    className={`col-lg-12 mb-0 ${cx.formBox}`}
                                    controlId="exampleForm.ControlInput1"
                                  >
                                    <Form.Control
                                      type="text"
                                      placeholder="Add Description..."
                                      defaultValue={`${e.description}`}
                                      onChange={(event) => {
                                        e.description = event.target.value;
                                      }}
                                    />
                                  </Form.Group>
                                </Form>
                              </Card.Text>
                            </Card.Body>
                          </Card>
                        )
                      );
                    }
                  });
                })}

                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="droppable" type="droppableItems">
                    {(provided, snapshot) => (
                      <div ref={provided.innerRef}>
                        {items?.map((val: any) => {
                          return val.addNewStepButtons[0].steps?.map(
                            (e: any) => {
                              if (e.id == urlChange) {
                                return e.actions?.map(
                                  (value: any, index: number) => {
                                    if (value.actionValue == "Web Link") {
                                      return (
                                        <WebLink
                                          value={value}
                                          mid={modId}
                                          sid={stId}
                                          index={index}
                                          feedbackShow={handlefrShow}
                                          actionId={actionId}
                                        />
                                      );
                                    } else if (
                                      value.actionValue == "Read an Email"
                                    ) {
                                      return (
                                        <ReadEmailAction
                                          value={value}
                                          mid={modId}
                                          sid={stId}
                                          index={index}
                                        />
                                      );
                                    } else if (
                                      value.actionValue == "Add Text"
                                    ) {
                                      return (
                                        <AddText
                                          value={value}
                                          mid={modId}
                                          sid={stId}
                                          index={index}
                                        />
                                      );
                                    } else if (
                                      value.actionValue == "Download a File"
                                    ) {
                                      return (
                                        <DownloadFileAction
                                          value={value}
                                          mid={modId}
                                          sid={stId}
                                          index={index}
                                        />
                                      );
                                    } else if (
                                      value.actionValue == "Write an Email"
                                    ) {
                                      return (
                                        <WriteFileAction
                                          value={value}
                                          mid={modId}
                                          sid={stId}
                                          index={index}
                                          feedbackShow={handlefrShow}
                                          actionId={actionId}
                                        />
                                      );
                                    } else if (
                                      value.actionValue == "Upload a File"
                                    ) {
                                      return (
                                        <UploadFileAction
                                          value={value}
                                          mid={modId}
                                          sid={stId}
                                          index={index}
                                          feedbackShow={handlefrShow}
                                          actionId={actionId}
                                        />
                                      );
                                    } else if (
                                      value.actionValue == "Embeded Video"
                                    ) {
                                      return (
                                        <EmbeddedVideoAction
                                          value={value}
                                          mid={modId}
                                          sid={stId}
                                          index={index}
                                        />
                                      );
                                    } else if (
                                      value.actionValue == "Question and Answer"
                                    ) {
                                      return (
                                        <QandAAction
                                          value={value}
                                          mid={modId}
                                          sid={stId}
                                          index={index}
                                          feedbackShow={handlefrShow}
                                          actionId={actionId}
                                        />
                                      );
                                    } else if (
                                      value.actionValue == "Embeded Image"
                                    ) {
                                      return (
                                        <EmbeddedImage
                                          value={value}
                                          mid={modId}
                                          sid={stId}
                                          index={index}
                                        />
                                      );
                                    } else if (
                                      value.actionValue ==
                                      "Schedule a Live Conversation"
                                    ) {
                                      return (
                                        <ScheduleLiveAction
                                          value={value}
                                          mid={modId}
                                          sid={stId}
                                          index={index}
                                          feedbackShow={handlefrShow}
                                          actionId={actionId}
                                        />
                                      );
                                    }
                                  }
                                );
                              }
                            }
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>

                <Col className={`text-end mb-3 ${cx.submitActionBox}`}>
                  <button
                    className={`btn ${cx.submitBtnBorder}`}
                    onClick={handleacShow}
                  >
                    Add New Action
                  </button>
                </Col>
              </Col>

              <RightSidebar
                id={param.id}
                mid={modId}
                sid={stId}
                globalList={globalList}
                getGlobal={getGlobalResource}
              />
            </Row>
          )}
        </section>
        <Footer />

        {/* Feedback Rubric Popup START */}
        <Modal
          show={show}
          className={`${lx.modalCts}`}
          size="xl"
          onHide={() => setShow(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className={`align-items-center ${lx.modalTitle}`}>
              <Col lg={8}>
                <h5>Feedback Rubric ({action.name})</h5>
              </Col>
              <Col lg={4} className="text-end">
                <button className={`btn ${lx.previewBtn}`}>
                  Preview Feedback Screen
                </button>
              </Col>
            </Row>

            <Row className={`${lx.formBoxRow}`}>
              <Col lg={12}>
                <Row>
                  <Col lg={12} className="mb-3">
                    <h5>Define your feedback criteria for this submission</h5>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col lg={6}>
                    <h6>Criteria Name</h6>
                  </Col>
                  <Col lg={6}>
                    <h6>Criteria question for coach to evaluate on</h6>
                  </Col>
                </Row>

                <Row>
                  <Col lg={6}>
                    <Form.Group
                      className={`col-lg-12 mb-3 d-flex align-items-center ${lx.formBox}`}
                      controlId="exampleForm.ControlInput1"
                    >
                      <span className="me-3">Example</span>
                      <Form.Select id="formn">
                        <option>Attention to Detail</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col lg={6}>
                    <Form.Group
                      className={`col-lg-12 mb-3 d-flex align-items-center ${lx.formBox}`}
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Control
                        type="text"
                        disabled
                        placeholder="Does the participant sufficiently investigate the details of the transaction?"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                {moduleArray?.map((a: any, num: number) => {
                  return a.addNewStepButtons[0].steps?.map(
                    (b: any, number: number) => {
                      return b.actions?.map((c: any, count: number) => {
                        if (c.id == action.id) {
                          return c?.feedback?.map((d: any, index: number) => {
                            return (
                              <Row>
                                <Col lg={6}>
                                  <Form.Group
                                    className={`col-lg-12 mb-3 d-flex align-items-center ${lx.formBox}`}
                                    controlId="exampleForm.ControlInput1"
                                  >
                                    <span className="me-3">{index + 1}</span>
                                    <Form.Control
                                      type="text"
                                      list="optionsList"
                                      placeholder="Criteria Name"
                                      defaultValue={d.title}
                                      onChange={(e: any) => {
                                        d.title = e.target.value;
                                      }}
                                      onBlur={(e: any) => {
                                        setCriteriaArr((prev: any) => {
                                          return [
                                            ...prev,
                                            {
                                              criteriaName: e.target.value,
                                              SimuncationsID: param.id,
                                            },
                                          ];
                                        });
                                      }}
                                    />
                                    <datalist id="optionsList">
                                      {criteriaData?.map(
                                        (e: any, index: number) => {
                                          return (
                                            <option key={e?._id}>
                                              {e?.criteriaName}
                                            </option>
                                          );
                                        }
                                      )}
                                    </datalist>
                                  </Form.Group>
                                </Col>
                                <Col lg={6}>
                                  <Form.Group
                                    className={`col-lg-12 mb-3 d-flex align-items-center ${lx.formBox}`}
                                    controlId="exampleForm.ControlInput1"
                                  >
                                    <Form.Control
                                      type="text"
                                      placeholder="Type Criteria question here..."
                                      defaultValue={d.description}
                                      onChange={(e: any) => {
                                        d.description = e.target.value;
                                      }}
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>
                            );
                          });
                        }
                      });
                    }
                  );
                })}
                <Col lg={12} className="text-end">
                  <button
                    className={`btn ${lx.previewBtn}`}
                    onClick={addFields}
                  >
                    Add New Criteria +
                  </button>
                </Col>
              </Col>
            </Row>

            <Row className={`${lx.formBoxRow}`}>
              <Col lg={12}>
                <Row>
                  <Col lg={6} className="mb-3">
                    <div className={`${lx.addPostSubmission}`}>
                      <h5 style={{ color: "#4338CA" }}>
                        Add New Post-Submission Resource +
                      </h5>
                      <input type="file" onChange={handleImageChange} />
                    </div>
                  </Col>
                </Row>
                <Row>
                  {items?.map((a: any, num: number) => {
                    return a.addNewStepButtons[0].steps?.map(
                      (b: any, number: number) => {
                        return b.actions?.map((c: any, count: number) => {
                          if (c.id == action.id) {
                            return c?.feedbackResource?.map(
                              (d: any, index: number) => {
                                return (
                                  <Col lg={12}>
                                    <p>
                                      <NavLink to="#">
                                        {" "}
                                        {d?.title}{" "}
                                        <FiDownloadCloud className="ms-3" />
                                      </NavLink>
                                    </p>
                                  </Col>
                                );
                              }
                            );
                          }
                        });
                      }
                    );
                  })}
                  <Col lg={12}>
                    <h6 style={{ color: "#A0ABBB" }}>
                      (Available to participants only when viewing feedback -
                      e.g., submission answer key)
                    </h6>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button className={`${lx.savBtn}`} onClick={handlefrClose}>
              Save and Exit
            </Button>
          </Modal.Footer>
        </Modal>
        {/* Feedback Rubric Popup END */}

        {/* Add New Action Popup START */}
        <Modal
          show={acshow}
          className={`${lx.modalCts} ${lx.modalCtsAction}`}
          size="lg"
          onHide={handleacClose}
        >
          <Modal.Header closeButton onClick={() => setacShow(false)}>
            <Modal.Title></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tab.Container
              id="left-tabs-example"
              defaultActiveKey="tab0"
              onSelect={tabSelected}
            >
              <Row>
                <Col lg={12}>
                  <h5 className={`${lx.titleN}`}>
                    Lets start by selecting an Action Type
                  </h5>
                </Col>
                <Col lg={6}>
                  <Nav variant="pills" className="">
                    <Nav.Item className="d-none">
                      <Nav.Link eventKey="tab0"></Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        eventKey="tab1"
                        className={`${lx.t1}`}
                        onClick={() => setTabValue("Read an Email")}
                      >
                        <HiOutlineMailOpen className={`${lx.iconM}`} />{" "}
                        <span>Read an Email</span>
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        eventKey="tab2"
                        className={`${lx.t2}`}
                        onClick={() => setTabValue("Write an Email")}
                      >
                        <HiOutlineMail className={`${lx.iconM}`} /> Write an
                        Email
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        eventKey="tab3"
                        className={`${lx.t3}`}
                        onClick={() => setTabValue("Upload a File")}
                      >
                        <AiOutlineCloudUpload className={`${lx.iconM}`} />{" "}
                        Upload a File
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        eventKey="tab4"
                        className={`${lx.t4}`}
                        onClick={() => setTabValue("Download a File")}
                      >
                        <AiOutlineCloudDownload className={`${lx.iconM}`} />{" "}
                        Download a File
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        eventKey="tab5"
                        className={`${lx.t5}`}
                        onClick={() => setTabValue("Question and Answer")}
                      >
                        <BiHelpCircle className={`${lx.iconM}`} /> Question &
                        Answer
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        eventKey="tab6"
                        className={`${lx.t6}`}
                        onClick={() =>
                          setTabValue("Schedule a Live Conversation")
                        }
                      >
                        <MdCall className={`${lx.iconM}`} /> Schedule a Live
                        Conversation
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        eventKey="tab7"
                        className={`${lx.t7}`}
                        onClick={() => setTabValue("Web Link")}
                      >
                        <BsLink className={`${lx.iconM}`} /> Web Link
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        eventKey="tab8"
                        className={`${lx.t8}`}
                        onClick={() => setTabValue("Add Text")}
                      >
                        <BiText className={`${lx.iconM}`} /> Add Text
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        eventKey="tab9"
                        className={`${lx.t9}`}
                        onClick={() => setTabValue("Embeded Image")}
                      >
                        <BiImageAlt className={`${lx.iconM}`} /> Embedded Image
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        eventKey="tab10"
                        className={`${lx.t10}`}
                        onClick={() => setTabValue("Embeded Video")}
                      >
                        <ImEmbed2 className={`${lx.iconM}`} /> Embedded Video
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Col>
                <Col lg={6}>
                  <Tab.Content>
                    <Tab.Pane eventKey="tab0">
                      <div className={`${lx.actionMain}`}>
                        <h5>Action Examples and Tips</h5>
                        <p>
                          Select an <b>Action Type</b> and we’ll show you some
                          examples/tips on how to build this
                        </p>
                      </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="tab1">
                      <div className={`${lx.actionMainInSide}`}>
                        <h5>Read an Email</h5>
                        <p>
                          Use the <b>Read An Email</b> action when you want
                          participiants to read an email from someone with
                          information (and/or an attachment).
                        </p>

                        <h5 className={`${lx.expArrow}`}>
                          Example
                          <img
                            src={action1}
                            className={`${lx.actionArrow}`}
                            alt="logo"
                          />
                        </h5>
                        <h5>
                          Subject: Follow up from client due diligence
                          conversation
                        </h5>

                        <p>Hi John,</p>
                        <p className="mb-2">
                          Thanks for putting together the due diligence report
                          for our client. They called me to discuss the
                          following areas so I want to make sure we consider
                          these high-risk areas in the final version of...
                        </p>
                        <img
                          src={buttonImg}
                          className={`${lx.btnImg}`}
                          alt="logo"
                        />
                      </div>
                    </Tab.Pane>

                    <Tab.Pane eventKey="tab2">
                      <div className={`${lx.actionMainInSide}`}>
                        <h5>Write an Email</h5>
                        <p>
                          Use the <b>Write An Email</b> action when you want
                          participiants to write an email to someone with
                          information (and/or an attachment).
                        </p>

                        <h5 className={`${lx.expArrow}`}>
                          Example
                          <img
                            src={action2}
                            className={`${lx.actionArrow}`}
                            alt="logo"
                          />
                        </h5>
                        <h5>
                          Subject: Follow up from client due diligence
                          conversation
                        </h5>

                        <p>Hi John,</p>
                        <p className="mb-2">
                          Thanks for putting together the due diligence report
                          for our client. They called me to discuss the
                          following areas so I want to make sure we consider
                          these high-risk areas in the final version of...
                        </p>
                        <img
                          src={buttonImg}
                          className={`${lx.btnImg}`}
                          alt="logo"
                        />
                      </div>
                    </Tab.Pane>

                    <Tab.Pane eventKey="tab3">
                      <div className={`${lx.actionMainInSide}`}>
                        <h5>Upload a File</h5>
                        <p>
                          Use the <b>Upload a File</b> action when you want to
                          collect a file from the participants.
                        </p>
                        <p>
                          You’ll be able to select if you want to be able to
                          provide feedback to participants on this file (and
                          then outline the criteria for feedback).
                        </p>

                        <h5 className={`${lx.expArrow}`}>
                          Example
                          <img
                            src={action3}
                            className={`${lx.actionArrow}`}
                            alt="logo"
                          />
                        </h5>
                        <h5>Upload Your Bio</h5>
                        <p className="mb-2">
                          Please upload your bio that you created when
                          onboarding so your teammates and coach can learn more
                          about you.
                        </p>
                        <img
                          src={buttonImg}
                          className={`${lx.btnImg}`}
                          alt="logo"
                        />
                      </div>
                    </Tab.Pane>

                    <Tab.Pane eventKey="tab4">
                      <div className={`${lx.actionMainInSide}`}>
                        <h5>Download a File</h5>
                        <p>
                          Use the <b>Download a File</b> action when you want to
                          provide a file to participants to download and use.
                        </p>
                        <p>
                          This can be followed by an upload a file action if you
                          want them to download a template, fill it out, and
                          submit it for feedback.
                        </p>

                        <h5 className={`${lx.expArrow}`}>
                          Example
                          <img
                            src={action4}
                            className={`${lx.actionArrow}`}
                            alt="logo"
                          />
                        </h5>
                        <h5>Precedent APS Documents</h5>

                        <p>Hi John,</p>
                        <p className="mb-2">
                          In this file are some examples of APS Contracts from
                          previous transactions. Download them and identity the
                          top three.
                        </p>
                        <img
                          src={buttonImg}
                          className={`${lx.btnImg}`}
                          alt="logo"
                        />
                      </div>
                    </Tab.Pane>

                    <Tab.Pane eventKey="tab5">
                      <div className={`${lx.actionMainInSide}`}>
                        <h5>Question & Answer</h5>
                        <p>
                          Use the <b>Question & Answer</b> action when you want
                          to ask specific questions and get text responses from
                          the participant.
                        </p>
                        <p>
                          You can choose to provide feedback on these
                          submissions if you’d like
                        </p>

                        <h5 className={`${lx.expArrow}`}>
                          Example
                          <img
                            src={action5}
                            className={`${lx.actionArrow}`}
                            alt="logo"
                          />
                        </h5>
                        <img
                          src={buttonImg2}
                          className={`${lx.btnImg}`}
                          alt="logo"
                        />
                      </div>
                    </Tab.Pane>

                    <Tab.Pane eventKey="tab6">
                      <div className={`${lx.actionMainInSide}`}>
                        <h5>Schedule a Live Conversation</h5>
                        <p>
                          Use the <b>Schedule a Live Conversation</b> action
                          when you want participants to schedule a synchronous
                          (real-time) conversation with someone (e.g., have
                          participants do a role play with a colleague who act
                          as a mock “client” or “partner”).
                        </p>

                        <h5 className={`${lx.expArrow}`}>
                          Example
                          <img
                            src={action6}
                            className={`${lx.actionArrow}`}
                            alt="logo"
                          />
                        </h5>
                        <h5>Schedule a call with the client</h5>

                        <p>Hi John,</p>
                        <p className="mb-2">
                          Anderson is the VP of Finance at Unlimited Bank (our
                          client).
                        </p>
                        <p className="mb-2">
                          Please email Anderson to schedule a conversation in
                          the next two days. You will discuss Anderson's
                          reservations with the transaction to inform your due
                          dilgence process.
                        </p>
                      </div>
                    </Tab.Pane>

                    <Tab.Pane eventKey="tab7">
                      <div className={`${lx.actionMainInSide}`}>
                        <h5>Web Link</h5>
                        <p>
                          Use the <b>Web Link</b> action when you want
                          participants to visit an external website for any
                          reason.
                        </p>
                        <p>
                          This could include: watching a video on Youtube,
                          filling out a survey, or reading an external article.{" "}
                        </p>

                        <h5 className={`${lx.expArrow}`}>
                          Example
                          <img
                            src={action7}
                            className={`${lx.actionArrow}`}
                            alt="logo"
                          />
                        </h5>
                        <h5>Read the history of AtB LLC</h5>

                        <p className="mb-2">
                          Before you begin serving your first client, it is
                          critical to understand Above the Bar's founding story.
                          Please visit the link below to read more.
                        </p>
                        <img
                          src={buttonImg3}
                          className={`${lx.btnImg}`}
                          alt="logo"
                        />
                      </div>
                    </Tab.Pane>

                    <Tab.Pane eventKey="tab8">
                      <div className={`${lx.actionMainInSide}`}>
                        <h5>Text</h5>
                        <p>
                          Use the <b>Add Text</b> action to communicate short
                          pieces of information that you want to draw attention
                          to.
                        </p>
                        <p>
                          Remember that people have short attention spans -
                          about 8 seconds (25 words). Keep your message short
                          and brief.
                        </p>
                        <p>
                          To deliver more content, consider using other action
                          types!
                        </p>

                        <h5 className={`${lx.expArrow}`}>
                          Example
                          <img
                            src={action8}
                            className={`${lx.actionArrow}`}
                            alt="logo"
                          />
                        </h5>

                        <p className="mb-2">
                          Welcome to the Onboarding Simulation for Above the Bar
                          LLC. This will be a fun exercise over the next two
                          days where you will use the resources and practice the
                          skills you will need every day at ATB LLC.
                        </p>
                      </div>
                    </Tab.Pane>

                    <Tab.Pane eventKey="tab9">
                      <div className={`${lx.actionMainInSide}`}>
                        <h5>Embedded Image</h5>
                        <p>
                          Use the <b>Embedded Image</b> action whenyou want to
                          feature a specific image as part of the simulation
                          without requiring the participant to download a file.{" "}
                        </p>

                        <h5 className={`${lx.expArrow}`}>
                          Example
                          <img
                            src={action9}
                            className={`${lx.actionArrow}`}
                            alt="logo"
                          />
                        </h5>
                        <h5>Welcome from the partner</h5>

                        <p className="mb-2">
                          Please see below for Unlimited Bank's organizational
                          chart- this will help you determine the right point of
                          contact for your due diligence report.
                        </p>
                        <img
                          src={buttonImg4}
                          className={`${lx.btnImg}`}
                          alt="logo"
                        />
                      </div>
                    </Tab.Pane>

                    <Tab.Pane eventKey="tab10">
                      <div className={`${lx.actionMainInSide}`}>
                        <h5>Embedded Video</h5>
                        <p>
                          Use the <b>Embedded Video</b> action when you want to
                          feature a specific video as part of the simulation
                          without requiring the participant to download a file
                          or visit an external website.
                        </p>

                        <h5 className={`${lx.expArrow}`}>
                          Example
                          <img
                            src={action10}
                            className={`${lx.actionArrow}`}
                            alt="logo"
                          />
                        </h5>
                        <h5>Welcome from the partner</h5>

                        <p className="mb-2">
                          Please see below for a video welcoming you to the firm
                          and introducing you to your first client: Unlimited
                          Bank.
                        </p>
                        <img
                          src={buttonImg5}
                          className={`${lx.btnImg}`}
                          alt="logo"
                        />
                      </div>
                    </Tab.Pane>
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
          </Modal.Body>
          <Modal.Footer>
            {tabActionShow !== "tab0" && (
              <Button
                className={`${lx.savBtn}`}
                onClick={() => {
                  handleacClose();
                  sethideActiontext(true);
                  settabActionShowSubmit(tabActionShow);
                  let data = {
                    mId: modId,
                    sId: stId,
                    tabVal: tabValue,
                  };
                  dispatch(actionIncreaser(data));
                }}
              >
                Add Another Action
              </Button>
            )}
            {tabActionShow !== "tab0" && (
              <Button
                className={`${lx.savBtnAnother}`}
                onClick={() => {
                  handleacClose();
                  sethideActiontext(true);
                  setacShow(false);
                  settabActionShowSubmit(tabActionShow);
                  let data = {
                    mId: modId,
                    sId: stId,
                    tabVal: tabValue,
                  };
                  dispatch(actionIncreaser(data));
                }}
              >
                Add and Edit
              </Button>
            )}
          </Modal.Footer>
        </Modal>
        {/* Add New Action Popup END */}

        {tabActionShowSubmit === "tab1" && (
          <div
            className={`${lx.actionAddedStatus} ${
              tabActionShowSubmit === "tab1"
                ? `${hideActiontext && lx.show}`
                : ""
            }`}
          >
            <div className={`${lx.statusBg}`}></div>
            <div
              className={`${lx.statusBody}`}
              style={{ backgroundColor: "#3751FF" }}
            >
              <HiOutlineMailOpen className={`${lx.iconM}`} />{" "}
              <span>A Read an Email Action Type has been added</span>
            </div>
          </div>
        )}

        {tabActionShowSubmit === "tab2" && (
          <div
            className={`${lx.actionAddedStatus} ${
              tabActionShowSubmit === "tab2"
                ? `${hideActiontext && lx.show}`
                : ""
            }`}
          >
            <div className={`${lx.statusBg}`}></div>
            <div
              className={`${lx.statusBody}`}
              style={{ backgroundColor: "#068DD8" }}
            >
              <HiOutlineMail className={`${lx.iconM}`} />{" "}
              <span>A Write an Email Action Type has been added</span>
            </div>
          </div>
        )}

        {tabActionShowSubmit === "tab3" && (
          <div
            className={`${lx.actionAddedStatus} ${
              tabActionShowSubmit === "tab3"
                ? `${hideActiontext && lx.show}`
                : ""
            }`}
          >
            <div className={`${lx.statusBg}`}></div>
            <div
              className={`${lx.statusBody}`}
              style={{ backgroundColor: "#04A772" }}
            >
              <AiOutlineCloudUpload className={`${lx.iconM}`} />{" "}
              <span>An Upload a File Action Type has been added</span>
            </div>
          </div>
        )}

        {tabActionShowSubmit === "tab4" && (
          <div
            className={`${lx.actionAddedStatus} ${
              tabActionShowSubmit === "tab4"
                ? `${hideActiontext && lx.show}`
                : ""
            }`}
          >
            <div className={`${lx.statusBg}`}></div>
            <div
              className={`${lx.statusBody}`}
              style={{ backgroundColor: "#A110E5" }}
            >
              <AiOutlineCloudDownload className={`${lx.iconM}`} />{" "}
              <span>A Download a File Action Type has been added</span>
            </div>
          </div>
        )}

        {tabActionShowSubmit === "tab5" && (
          <div
            className={`${lx.actionAddedStatus} ${
              tabActionShowSubmit === "tab5"
                ? `${hideActiontext && lx.show}`
                : ""
            }`}
          >
            <div className={`${lx.statusBg}`}></div>
            <div
              className={`${lx.statusBody}`}
              style={{ backgroundColor: "#FF7703" }}
            >
              <BiHelpCircle className={`${lx.iconM}`} />{" "}
              <span>A Question & Answer Action Type has been added</span>
            </div>
          </div>
        )}

        {tabActionShowSubmit === "tab6" && (
          <div
            className={`${lx.actionAddedStatus} ${
              tabActionShowSubmit === "tab6"
                ? `${hideActiontext && lx.show}`
                : ""
            }`}
          >
            <div className={`${lx.statusBg}`}></div>
            <div
              className={`${lx.statusBody}`}
              style={{ backgroundColor: "#FF4086" }}
            >
              <MdCall className={`${lx.iconM}`} />{" "}
              <span>
                A Schedule a LIve Conversation Action Type has been added
              </span>
            </div>
          </div>
        )}

        {tabActionShowSubmit === "tab7" && (
          <div
            className={`${lx.actionAddedStatus} ${
              tabActionShowSubmit === "tab7"
                ? `${hideActiontext && lx.show}`
                : ""
            }`}
          >
            <div className={`${lx.statusBg}`}></div>
            <div
              className={`${lx.statusBody}`}
              style={{ backgroundColor: "#FF0000" }}
            >
              <BsLink className={`${lx.iconM}`} />{" "}
              <span>A Web Link Action Type has been added</span>
            </div>
          </div>
        )}

        {tabActionShowSubmit === "tab8" && (
          <div
            className={`${lx.actionAddedStatus} ${
              tabActionShowSubmit === "tab8"
                ? `${hideActiontext && lx.show}`
                : ""
            }`}
          >
            <div className={`${lx.statusBg}`}></div>
            <div
              className={`${lx.statusBody}`}
              style={{ backgroundColor: "#191D23" }}
            >
              <BiText className={`${lx.iconM}`} />{" "}
              <span>An Add Text Action Type has been added</span>
            </div>
          </div>
        )}

        {tabActionShowSubmit === "tab9" && (
          <div
            className={`${lx.actionAddedStatus} ${
              tabActionShowSubmit === "tab9"
                ? `${hideActiontext && lx.show}`
                : ""
            }`}
          >
            <div className={`${lx.statusBg}`}></div>
            <div
              className={`${lx.statusBody}`}
              style={{ backgroundColor: "#7F15B0" }}
            >
              <BiImageAlt className={`${lx.iconM}`} />{" "}
              <span>An Embedded Image Action Type has been added</span>
            </div>
          </div>
        )}

        {tabActionShowSubmit === "tab10" && (
          <div
            className={`${lx.actionAddedStatus} ${
              tabActionShowSubmit === "tab10"
                ? `${hideActiontext && lx.show}`
                : ""
            }`}
          >
            <div className={`${lx.statusBg}`}></div>
            <div
              className={`${lx.statusBody}`}
              style={{ backgroundColor: "#07812A" }}
            >
              <ImEmbed2 className={`${lx.iconM}`} />{" "}
              <span>An Embedded Video Action Type has been added</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default EditSimulation;
