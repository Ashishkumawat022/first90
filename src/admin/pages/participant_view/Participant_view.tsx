import React from "react";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import cx from "../../../admin.style.module.scss";
import lx from "./Participant_view.module.scss";
import { useState, useEffect } from "react";
import RightSidebar from "../../../components/right-sidebar/right-sidebar";
import { Card, Col, Row, Form } from "react-bootstrap";
import Sidebar from "../../../components/sidebar/Sidebar";
import Simulationmenu from "../../../components/simulationmenu/Simulationmenu";
import useHttp from "../../../hooks/use-https";
import { changeGlobalResourceValue, changeModuleArrayValue } from "../../../reduxToolkit/reducers/moduleButtonReducer";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import AddText from "./actions/AddText";
import DownloadFileAction from "./actions/DownloadFileAction";
import EmbeddedImage from "./actions/EmbeddedImage";
import EmbeddedVideoAction from "./actions/EmbeddedVideoAction";
import QandAAction from "./actions/QandAAction";
import ReadEmailAction from "./actions/ReadEmailAction";
import ScheduleLiveAction from "./actions/ScheduleLiveAction";
import WebLink from "./actions/WebLink";
import WriteEmailAction from "./actions/WriteEmailAction";
import UploadFileAction from "./actions/UploadFileAction";
import ReactLoading from "react-loading";

const ParticipantView = (props: any) => {
  const urlChange = useSelector(
    (state: any) => state.moduleButtonReducer.value
  );

  useEffect(() => {
    getData();
    getSimulationById();
    getGlobalResource();
  }, []);

  const { sendRequest: getrequest } = useHttp();
  const { sendRequest: getGlobalList } = useHttp();

  let param: any = useParams();
  const dispatch = useDispatch();
  const [allData, setAllData] = useState<any>();
  const [items, setItems] = useState<any[]>([]);
  const [cacheGetTime, setCacheGetTime] = useState<any>();
  const [cacheGetId, setCacheGetId] = useState<any>();
  const [globalList, setGlobalList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const simulationByIdResponse = (responseData: any) => {
    let simulationArray = responseData.data.AddallModule;
    if (cacheGetTime != null) {
      if (responseData.data._id == cacheGetId) {
        if (responseData.data.time >= cacheGetTime) {
          dispatch(changeModuleArrayValue(simulationArray));
          dispatch(changeGlobalResourceValue({global:responseData.data?.globalResourceArray}))
        }
      }
    } else {
      dispatch(changeModuleArrayValue(simulationArray));
      dispatch(changeGlobalResourceValue({global:responseData.data?.globalResourceArray}))
    }
    setAllData(responseData.data);
    setItems(responseData.data.AddallModule);
    setLoading(false);
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

  // Function to get all cache data
  async function getData() {
    const cacheVersion = 1;
    const cacheName = `MyCache`;
    const cacheTime = `cacheTime`;
    // const url = "http://localhost:3000";
    const url = "http://appicsoftwares.in/";
    let cachedData: any[] = await getCachedData(cacheName, url);
    let cachedTime: any = await getCachedData(cacheTime, url);

    if (cachedTime) {
      if (cachedData) {
        if (cachedTime.cacheid == allData?._id) {
          if (cachedTime.cachetime > allData?.time) {
            dispatch(changeModuleArrayValue(cachedData));
          }
        }
        setCacheGetTime(cachedTime.cachetime);
        setCacheGetId(cachedTime.cacheid);
        return cachedData;
      }
      return cachedData;
    }
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

  const getGlobalResourceResponse = (responseData: any) => {
    setGlobalList(responseData.data);
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

  return (
    <>
      <Header title="Onboarding Simulation" btnStatus="view-paricipant" />
      <Sidebar />
      <section className={`${cx.pageWrapper}`}>
        {loading ? (
          <div className="d-flex justify-content-center">
           
            <ReactLoading type="cylon" color="blue" />
          </div>
        ) : (
          <Row>
            <Simulationmenu />
            <Col lg={6}>
              {items.map((val: any) => {
                return val.addNewStepButtons[0].steps.map((e: any) => {
                  if (e.id == urlChange) {
                    return (
                      (modId = val.id),
                      (stId = e.id),
                      (
                        <>
                          <Card className={`${lx.disabled}`}>
                            <Card.Body>
                              <Card.Text>
                                <Form className="row">
                                  <Form.Group
                                    className={`col-lg-12 ${cx.formBox}`}
                                    controlId="exampleForm.ControlInput1"
                                  >
                                    <h4>{val?.title ? val?.title : val?.content}</h4>
                                    <p>{val?.description}</p>
                                  </Form.Group>
                                  <Form.Group
                                    className={`col-lg-12 mb-0 ${cx.formBox}`}
                                    controlId="exampleForm.ControlInput1"
                                  >
                                    <h4>{e?.title ? e?.title : e?.content}</h4>
                                    <p className="m-0">{e?.description}</p>
                                  </Form.Group>
                                </Form>
                              </Card.Text>
                            </Card.Body>
                          </Card>

                          {e.actions.map((value: any, index: number) => {
                            if (value.actionValue == "Web Link") {
                              return (
                                <WebLink
                                  value={value}
                                  mid={modId}
                                  sid={stId}
                                  index={index}
                                />
                              );
                            } else if (value.actionValue == "Read an Email") {
                              return (
                                <ReadEmailAction
                                  value={value}
                                  mid={modId}
                                  sid={stId}
                                  index={index}
                                />
                              );
                            } else if (value.actionValue == "Add Text") {
                              return (
                                <AddText
                                  value={value}
                                  mid={modId}
                                  sid={stId}
                                  index={index}
                                />
                              );
                            } else if (value.actionValue == "Download a File") {
                              return (
                                <DownloadFileAction
                                  value={value}
                                  mid={modId}
                                  sid={stId}
                                  index={index}
                                />
                              );
                            } else if (value.actionValue == "Write an Email") {
                              return (
                                <WriteEmailAction
                                  value={value}
                                  mid={modId}
                                  sid={stId}
                                  index={index}
                                />
                              );
                            } else if (value.actionValue == "Embeded Video") {
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
                                />
                              );
                            } else if (value.actionValue == "Embeded Image") {
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
                                />
                              );
                            } else if (value.actionValue == "Upload a File") {
                              return (
                                <UploadFileAction
                                  value={value}
                                  mid={modId}
                                  sid={stId}
                                  index={index}
                                />
                              );
                            }
                          })}
                        </>
                      )
                    );
                  }
                  {
                    /* <Col className={`text-end mb-3 ${cx.submitActionBox}`}>
              <button className={`btn ${cx.submitBtn}`}>Continue to Next Step</button>
            </Col> */
                  }
                });
              })}
            </Col>

            <RightSidebar
              id={param.id}
              mid={modId}
              sid={stId}
              globalList={globalList}
              getGlobal={getGlobalResource}
              btnStatus={false}
            />
          </Row>
        )}
      </section>
      <Footer />
    </>
  );
};

export default ParticipantView;
