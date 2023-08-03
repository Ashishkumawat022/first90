import React, { useEffect, useState } from "react";
import { HashRouter, NavLink, useHistory, useParams } from "react-router-dom";
import cx from "./Feedbackleft.module.scss";

import { AiOutlinePlusCircle } from "react-icons/ai";
import { useContext } from "react";
import GlobalContext from "../../store/global-context";
import { BsCheck2 } from "react-icons/bs";
import { IoMdTime } from "react-icons/io";

import { Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  changeDivUrl,
  changeModuleArrayValue,
  changeStepValue,
  changeValue,
  counting,
  moduleArray,
  simulationIdGet,
} from "../../reduxToolkit/reducers/moduleButtonReducer";
import useHttp from "../../hooks/use-https";

const Feedbackleft = (props: any) => {
  let loginData = localStorage.getItem("data")!;
  let localLoginData = JSON.parse(loginData)!;
  const moduleCount = counting;
  let stepData = useSelector((state: any) => state.moduleButtonReducer.data);
  let boolVal = useSelector((state: any) => state.moduleButtonReducer.bool);
  const stepCount = useSelector(
    (state: any) => state.moduleButtonReducer.count
  );
  const stepAdd = useSelector(
    (state: any) => state.moduleButtonReducer.stepAdd
  );
  const moduleCheck = useSelector(
    (state: any) => state.moduleButtonReducer.check
  );
  const dispatch = useDispatch();
  const param: any = useParams();
  const { sendRequest } = useHttp();
  const urlChange = useSelector(
    (state: any) => state.moduleButtonReducer.value
  );
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (items.length !== 0) setItems(moduleArray);
  }, [moduleCount, stepData, boolVal, moduleCheck, stepCount]);

  const simulationResponse = (data: any) => {
    dispatch(changeModuleArrayValue(data?.data[0]?.Simulation?.AddallModule));
    setItems(data?.data[0]?.Simulation?.AddallModule);
    if (urlChange.indexOf("a") === -1)
      dispatch(
        changeDivUrl(
          data?.data[0]?.Simulation?.AddallModule[0]?.addNewStepButtons[0]
            ?.steps[0]?.actions[0]?.id
        )
      );
  };

  const getSimulation = () => {
    sendRequest(
      {
        url: `${process.env.REACT_APP_STUDENT_BASEURL}/student_dashboard?students_id=${localLoginData?._id}&team_id=${param?.id}`,
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      },
      simulationResponse
    );
  };

  useEffect(() => {
    getSimulation();
    dispatch(simulationIdGet(param.id));
  }, []);

  return (
    <>
      <Col lg={3}>
        <div className={`${cx.MenuBodyS2}`}>
          <ul className={`${cx.s2menuList}`}>
            {items.map((item: any, index: any) => {
              return (
                <li
                  key={index}
                  className={`${item.value == true ? `${cx.active}` : ""}`}
                >
                  <button
                    className={`btn`}
                    type="button"
                    onClick={() => {
                      dispatch(changeValue(item));
                    }}
                  >
                    <div>{item.title == "" ? item.content : item.title}</div>
                  </button>
                  <ul className={`${cx.first}`}>
                    <HashRouter basename={`m${moduleCount}`} hashType="noslash">
                      {item.addNewStepButtons[0].steps.map(
                        (e: any, num: number) => {
                          return (
                            <li
                              className={`${
                                e.value == true ? `${cx.active}` : ""
                              }`}
                            >
                              <div
                                onClick={() => {
                                  dispatch(changeStepValue(e));
                                }}
                              >
                                <NavLink className="btn" to={`/${e.id}`}>
                                  {e.title == "" ? e.content : e.title}
                                </NavLink>
                              </div>
                              <ul className={`${cx.step2}`}>
                                <HashRouter
                                  basename={`m${stepCount}`}
                                  hashType="noslash"
                                >
                                  <li>
                                    {e.actions.map((z: any, index: number) => {
                                      if (
                                        z.actionValue ==
                                          "Schedule a Live Conversation" ||
                                        z.actionValue == "Upload a File" ||
                                        z.actionValue ==
                                          "Question and Answer" ||
                                        z.actionValue == "Write an Email"
                                      ) {
                                        return (
                                          <NavLink to={`${z.id}`}>
                                            <div
                                              className={`${cx.menuName}`}
                                              onClick={() => {
                                                dispatch(changeDivUrl(z.id));
                                              }}
                                            >
                                              {" "}
                                              {z.actionValue}{" "}
                                            </div>
                                            {z.content.completeStatus ===
                                            "Completed" ? (
                                              <div
                                                className={`${cx.menuIcons}`}
                                              >
                                                <BsCheck2 />
                                                <span>Graded</span>
                                              </div>
                                            ) : (
                                              <div
                                                className={`${cx.menuIcons}`}
                                              >
                                                <IoMdTime />
                                                <span>Pending</span>
                                              </div>
                                            )}
                                          </NavLink>
                                        );
                                      }
                                    })}
                                  </li>
                                </HashRouter>
                              </ul>
                            </li>
                          );
                        }
                      )}
                    </HashRouter>
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>
      </Col>
    </>
  );
};

export default Feedbackleft;
