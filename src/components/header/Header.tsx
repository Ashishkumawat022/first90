import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { FiMessageSquare } from "react-icons/fi";
import { IoMdNotifications } from "react-icons/io";
import adminclasses from "../../admin.style.module.scss";
import studentclasses from "../../participant.style.module.scss";
import coachclasses from "../../coach.style.module.scss";
import { GiHamburgerMenu } from "react-icons/gi";
import { GrFormUpload } from "react-icons/gr";
import { FiMoreHorizontal } from "react-icons/fi";
import { AiFillEye } from "react-icons/ai";
import { NavLink, useHistory, useLocation, useParams } from "react-router-dom";
import { useContext } from "react";
import GlobalContext from "../../store/global-context";
import {
  Col,
  Row,
  InputGroup,
  FormControl,
  Dropdown,
  Modal,
} from "react-bootstrap";
import logo from "../../images/logo.svg";
import logotext from "../../images/logo-text.svg";
import ProfilePng from "../../images/profile.png";
import useHttp from "../../hooks/use-https";
import { FiMinus } from "react-icons/fi";
import { TiDeleteOutline } from "react-icons/ti";
import { FiEdit } from "react-icons/fi";
import { BiSmile } from "react-icons/bi";
import { AiOutlineFile } from "react-icons/ai";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { CgImage } from "react-icons/cg";
import { MdOutlineCancel } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";

import { MdZoomOutMap } from "react-icons/md";
import {
  changeDivUrl,
  changeModuleArrayValue,
  feedbackTeamName,
  moduleArray,
  publishStatus,
} from "../../reduxToolkit/reducers/moduleButtonReducer";
import { useDispatch } from "react-redux";
import io from "socket.io-client";
import Lottie from "react-lottie";
import parse from "html-react-parser";
import animationData from "../../admin/pages/animations/typing.json";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";

const ENDPOINT = `https://api.appic.tech`; // "https://first90.com"; -> After deployment
var socket: any, selectedChatCompare: any;

const Header = (props: any) => {
  const data = JSON.parse(localStorage.getItem("data")!);
  const owner = data?.role === "student" ? "participant" : data?.role;
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const param = useLocation();
  const history = useHistory();
  const location: any = useParams();
  const dispatch = useDispatch();
  const [status, setStatus] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [newMessage, setNewMessage] = useState<any>({
    id: "",
    msg: "",
  });
  const [messages, setMessages] = useState<any[]>([]);
  const [length, setLength] = useState<any[]>([]);
  const [singleChat, setSingleChat] = useState<any[]>([]);
  const [room, setRoom] = useState<string>("");
  const [typing, setTyping] = useState(false);
  const [confirmPublish, setConfirmPublish] = useState(false);
  const [chatId, setChatId] = useState<string>("");
  const [allCheck, setAllCheck] = useState<any>();
  const [notification, setNotification] = useState<any[]>([]);
  const [notificationList, setNotificationList] = useState<any[]>([]);
  const [sendBoolean, setSendBoolean] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [isFileConvert, setIsFileConvert] = useState(false);
  const [totalMessages, setTotalMessages] = useState<number>();
  const [notificationCount, setNotificationCount] = useState<number>(0);

  let showEditsimulationHeader = false;
  let btnStatus = false;
  if (param.pathname.includes("/admin/edit-simulation/")) {
    showEditsimulationHeader = true;
  } else if (param.pathname.includes("/admin/participant-view")) {
    showEditsimulationHeader = true;
    btnStatus = true;
  }

  const globalCtx = useContext(GlobalContext);
  let cx = adminclasses;
  if (window.location.pathname.includes("/admin")) {
    cx = adminclasses;
  } else if (window.location.pathname.includes("/participant")) {
    cx = studentclasses;
  } else if (window.location.pathname.includes("/coach")) {
    cx = coachclasses;
  }

  useEffect(() => {
    if (window.location.pathname.includes("/admin")) {
      getSimulationById();
      allSimulation();
      allTeam();
    }
    if (window.location.pathname.includes("/coach")) {
      allCoachTeam();
    }
    if (window.location.pathname.includes("/participant")) {
      getparticipantData();
    }
  }, []);

  const { sendRequest } = useHttp();
  const { sendRequest: getrequest } = useHttp();
  const { sendRequest: allMessageRequest } = useHttp();
  const { sendRequest: getAllChatRequest } = useHttp();
  const { sendRequest: urlRequest } = useHttp();
  const { sendRequest: searchRequest } = useHttp();
  const { sendRequest: teamRequest } = useHttp();
  const { sendRequest: coachRequest } = useHttp();
  const { sendRequest: participantRequest } = useHttp();
  const { sendRequest: notificationRequest } = useHttp();
  const { sendRequest: readNotificationRequest } = useHttp();

  useEffect(() => {
    getAllChat();
    socket = io(ENDPOINT);
    socket.emit("setup", JSON.parse(localStorage.getItem("data")!));
    socket.on("connected", () => setSocketConnected(true));
    // socket.on("typing", () => setIsTyping(true));
    // socket.on("stop typing", () => setIsTyping(false));
    // eslint-disable-next-line
  }, []);

  const simulationStatus = (responseData: any) => {
    history.push("/admin/simulation");
  };

  const liveSimulation = () => {
    sendRequest(
      {
        url: `${process.env.REACT_APP_BASEURL}/simulationModelStatus?id=${location.id}`,
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
          "content-type": "application/json",
        },
      },
      simulationStatus
    );
  };

  const simulationByIdResponse = (responseData: any) => {
    setStatus(responseData.data.status);
  };

  const getSimulationById = () => {
    getrequest(
      {
        url: `${process.env.REACT_APP_BASEURL}/GetSimulationData?simunactionsID=${location.id}`,
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token"),
          "content-type": "application/json",
        },
      },
      simulationByIdResponse
    );
  };

  const getAllChatResponse = (responseData: any) => {
    let dataArr: any[] = [];
    responseData?.map((item: any) => {
      dataArr.push({
        obj: { chat: item },
        id: item._id,
        length: item?.count,
      });
    });
    setLength(dataArr);
    let total = responseData?.reduce((acc: any, e: any) => {
      if (e?.count > 0) {
        acc += 1;
      }
      return acc;
    }, 0);
    setTotalMessages(total);
  };

  const getAllChat = () => {
    getAllChatRequest(
      {
        method: "get",
        url: `${process.env.REACT_APP_STUDENT_BASEURL}/get_chat`,
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      },
      getAllChatResponse
    );
  };

  const allMessageResponse = (responseData: any) => {
    socket.emit("join chat", chatId);
    setMessages(responseData?.data);
  };

  const allMessage = (chatId: any) => {
    allMessageRequest(
      {
        method: "get",
        url: `${process.env.REACT_APP_STUDENT_BASEURL}/get_allmessage?chatId=${chatId}`,
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      },
      allMessageResponse
    );
  };

  const sendMessage = async () => {
    if (newMessage) {
      // socket.emit("stop typing", chatId);
      try {
        //   const config = {
        //     headers: {
        //       "Content-type": "application/json",
        //       Authorization: localStorage.getItem("token")!,
        //     },
        //   };
        setNewMessage({
          id: "",
          msg: "",
        });
        // const { data } = await axios.post(
        //   `${process.env.REACT_APP_STUDENT_BASEURL}/send_message`,
        //   {
        //     content: newMessage.msg,
        //     chatId: newMessage.id,
        //   },
        //   config
        // );
        socket.emit(
          "new message",
          {
            id: data?._id,
            content: newMessage.msg,
            chatId: newMessage.id,
          },
          (res: any) => {
            setMessages([...messages, res]);
          }
        );
        setSendBoolean(!sendBoolean);
        let index = length.findIndex((x: any) => x.id === chatId);
        if (index > 0) {
          let item = { ...length[index] };
          length.splice(index, 1);
          length.splice(0, 0, item);
          setLength(length);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved: any) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          newMessageRecieved?.chat?.users?.map((item: any) => {
            if (item._id === data?._id) {
              setNotification([newMessageRecieved, ...notification]);
              setAllCheck(newMessageRecieved);
              let index = length.findIndex(
                (x: any) => x.id === newMessageRecieved.chat._id
              );
              if (index > 0) {
                let item = { ...length[index] };
                length.splice(index, 1);
                length.splice(0, 0, item);
                setLength(length);
              }
            }
          });
          return () => {
            socket.off("message recieved");
          };
        }
      }
      if (
        selectedChatCompare &&
        selectedChatCompare === newMessageRecieved.chat._id
      ) {
        setMessages([...messages, newMessageRecieved]);
        setSendBoolean(!sendBoolean);
        let index = length.findIndex(
          (x: any) => x.id === newMessageRecieved.chat._id
        );
        if (index > 0) {
          let item = { ...length[index] };
          length.splice(index, 1);
          length.splice(0, 0, item);
          setLength(length);
        }
        return () => {
          socket.off("message recieved");
        };
      }
    });
    return () => {
      socket.off("message recieved");
    };
  });

  useEffect(() => {
    singleChat?.map((item: any) => {
      if (item?.chatId === chatId) {
        item.message = [...messages];
        item.boolean = true;
      }
    });
  }, [messages]);

  useEffect(() => {
    if (allCheck) {
      let a = 0;
      for (let i = 0; i < length.length; i++) {
        if (length[i]?.obj?.chat?._id === allCheck?.chat?._id) {
          length[i].length += 1;
          length[i].obj.content = allCheck?.content;
          socket.emit(
            "updateData",
            length[i]?.obj?.chat?._id,
            length[i].length
          );
          a = 1;
          break;
        }
      }
      if (a === 0) {
        setLength((prev: any) => {
          return [
            {
              obj: allCheck,
              id: allCheck?.chat?._id,
              length: 1,
            },
            ...prev,
          ];
        });
      }
    }
  }, [allCheck]);

  const useKeyPress = (targetKey: any) => {
    const [keyPressed, setKeyPressed] = React.useState(false);

    const downHandler = (e: any) => {
      if (e.key === targetKey && e.shiftKey) {
        return;
      } else {
        if (e.key === targetKey) setKeyPressed(true);
      }
    };

    const upHandler = ({ key }: any) => {
      if (key === targetKey) setKeyPressed(false);
    };

    React.useEffect(() => {
      window.addEventListener("keydown", downHandler);
      window.addEventListener("keyup", upHandler);
    }, []);
    return keyPressed;
  };
  const enterPressed = useKeyPress("Enter");

  useEffect(() => {
    if (enterPressed === true && chatId !== "") {
      sendMessage();
    }
  }, [enterPressed]);

  useEffect(() => {
    selectedChatCompare = chatId;
  }, [chatId]);

  useEffect(() => {
    if (isFileConvert === true) {
      sendMessage();
      setIsFileConvert(false);
    }
  }, [isFileConvert]);

  const fileConvertingUrl = (responseData: any) => {
    setNewMessage({
      id: chatId,
      msg: responseData.data.file,
    });
    setIsFileConvert(true);
  };

  const fileToUrl = (fileList: any) => {
    let formData = new FormData();
    formData.append("file", fileList);

    urlRequest(
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

  const [search, setSearch] = useState<any>({
    resource: [],
    action: [],
    module: [],
    simulation: [],
    team: [],
    globalResorce: [],
  });
  const [filterValue, setFilterValue] = useState<any[]>([]);

  const searchFunc = (data: any) => {
    let simulation: any[] = [];
    let module: any[] = [];
    let action: any[] = [];
    let resource: any[] = [];
    let globalResorce: any[] = [];

    data?.map((item: any) => {
      item?.AddallModule?.map((e: any) => {
        e?.addNewStepButtons[0]?.steps?.map((a: any) => {
          a?.actions?.map((act: any) => {
            action.push({
              id: item?._id,
              name: item.NameOfSimulation,
              status: item.status,
              moduleId: e?.id,
              moduleName: e?.title || e?.content,
              stepId: a?.id,
              stepName: a?.title || a?.content,
              actionId: act?.id,
              actionName: act?.actionValue,
              allModule: item?.AddallModule,
              teamName: item?.teamName,
              unique: "action",
            });
          });
          a?.stepResources?.map((z: any) => {
            z?.files?.map((f: any) => {
              resource.push({
                id: item?._id,
                name: item.NameOfSimulation,
                status: item.status,
                moduleId: e?.id,
                moduleName: e?.title || e?.content,
                stepId: a?.id,
                stepName: a?.title || a?.content,
                resourceName: f?.resourceTitle,
                folderId: z?.id,
                fileId: f?.id,
                unique: "resource",
              });
            });
          });
        });
        module.push({
          moduleId: e?.id,
          moduleName: e?.title || e?.content,
          id: item?._id,
          name: item?.NameOfSimulation,
          status: item?.status,
          unique: "module",
        });
      });
      simulation.push({
        id: item?._id,
        name: item?.NameOfSimulation,
        status: item?.status,
        update: item?.updatedAt,
        unique: "simulation",
      });
      item?.globalResourceArray?.map((g: any) => {
        g?.files?.map((f: any) => {
          globalResorce.push({
            id: item?._id,
            name: item.NameOfSimulation,
            status: item.status,
            resourceName: f?.resourceTitle,
            folderId: g?.id,
            fileId: f?.id,
            unique: "globalResource",
          });
        });
      });
    });
    setSearch((prev: any) => {
      return { ...prev, resource, simulation, module, action, globalResorce };
    });
  };
  const getSimulation = (data: any) => {
    searchFunc(data?.data);
  };

  const allSimulation = () => {
    searchRequest(
      {
        url: `${process.env.REACT_APP_BASEURL}/getSimulation`,
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      },
      getSimulation
    );
  };

  const teamSearch = (data: any) => {
    let team: any[] = [];

    data?.map((item: any) => {
      team.push({
        name: item?.Simulation?.NameOfSimulation,
        id: item?.addSimulation?._id || item?.addSimulation,
        teamName: item?.teamName,
        teamId: item?._id,
        students: item?.students,
        unique: "team",
      });
    });
    setSearch((prev: any) => {
      return { ...prev, team };
    });
  };
  const getTeam = (data: any) => {
    teamSearch(data?.data);
  };
  const allTeam = () => {
    teamRequest(
      {
        url: `${process.env.REACT_APP_BASEURL}/getTeam`,
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      },
      getTeam
    );
  };

  const checkSearch = (value: any) => {
    let allfilterValues: any[] = [];
    if (value === "") {
      allfilterValues = [];
      setFilterValue([]);
      return;
    }
    search?.resource?.map((e: any) => {
      if (e?.resourceName?.toLowerCase()?.includes(value?.toLowerCase())) {
        allfilterValues.push(e);
      }
    });
    search?.action?.map((e: any) => {
      if (e?.actionName?.toLowerCase()?.includes(value?.toLowerCase())) {
        allfilterValues.push(e);
      }
    });
    search?.module?.map((e: any) => {
      if (e?.moduleName?.toLowerCase()?.includes(value?.toLowerCase())) {
        allfilterValues.push(e);
      }
    });
    search?.simulation?.map((e: any) => {
      if (e?.name?.toLowerCase()?.includes(value?.toLowerCase())) {
        allfilterValues.push(e);
      }
    });
    search?.globalResorce?.map((e: any) => {
      if (e?.resourceName?.toLowerCase()?.includes(value?.toLowerCase())) {
        allfilterValues.push(e);
      }
    });
    search?.team?.map((e: any) => {
      e?.students?.map((a: any) => {
        if (
          e?.teamName?.toLowerCase()?.includes(value?.toLowerCase()) ||
          a?.firstName?.toLowerCase()?.includes(value?.toLowerCase()) ||
          a?.lastName?.toLowerCase()?.includes(value?.toLowerCase())
        ) {
          allfilterValues.push(e);
        }
      });
    });
    setFilterValue(allfilterValues);
  };

  const getCoachTeam = (responseData: any) => {
    let data: any = [];
    responseData?.map((e: any) => {
      data.push({
        ...e?.Simulation,
        _id: e?.addSimulation,
      });
    });
    searchFunc(data);
    teamSearch(responseData);
  };
  const allCoachTeam = () => {
    coachRequest(
      {
        url: `${process.env.REACT_APP_STUDENT_BASEURL}/get_couch_team?couch=${data._id}`,
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      },
      getCoachTeam
    );
  };

  const getSimulationDataResponse = (responseData: any) => {
    searchFunc([responseData?.data?.addSimulation]);
  };

  const getparticipantData = () => {
    participantRequest(
      {
        url: `${process.env.REACT_APP_STUDENT_BASEURL}/student_simulation?team_id=${location?.id}&student_id=${data?._id}`,
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token"),
          "content-type": "application/json",
        },
      },
      getSimulationDataResponse
    );
  };

  const notificationResponse = (responseData: any) => {
    setNotificationList(responseData);
  };

  const notificationFunc = () => {
    notificationRequest(
      {
        method: "get",
        url: `${process.env.REACT_APP_STUDENT_BASEURL}/getNotifaction?type=${data?.role}&user_id=${data?._id}`,
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      },
      notificationResponse
    );
  };

  const readNotificationResponse = (responseData: any) => {
    console.log(responseData);
  };

  const readNotificationFunc = (type: String, id: String) => {
    let dataAll = JSON.stringify({
      type: type,
      userId: "64353b2a9e6e7f45afdc7405",
      id: id,
      type1: data?.role,
    });
    readNotificationRequest(
      {
        method: "post",
        url: `${process.env.REACT_APP_STUDENT_BASEURL}/readNotifaction`,
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        body: dataAll,
      },
      readNotificationResponse
    );
  };

  useEffect(() => {
    socket.emit("countNotifaction", data?._id, (res: any) => {
      setNotificationCount(res);
    });
  });
  return (
    <>
      {!showEditsimulationHeader && (
        <header className={`${cx.mainHeader}`}>
          <Row className={`${cx.mobileHeader}`}>
            <Col className="col-3">
              <GiHamburgerMenu onClick={globalCtx.displayMenu} />
            </Col>
            <Col className="col-6 text-center">
              <NavLink className={`${cx.navlogo}`} to="/">
                <img src={logo} className={`${cx.logoIcon}`} alt="logo" />
                <img src={logotext} className={`${cx.logoText}`} alt="logo" />
              </NavLink>
            </Col>
            <Col className={`col-3 ${cx.moreMenu}`}>
              <FiMoreHorizontal
                className={`${cx.moreIcon}`}
                onClick={globalCtx.displayMore}
              />
            </Col>
          </Row>

          <Row className={`align-items-center ${cx.headerRow}`}>
            <Col md={12} lg={2} xl={2} className={`${cx.headerTitle}`}>
              <h3 className={`${cx.pageTitle}`}>{props.title}</h3>
            </Col>
            <Col
              md={12}
              lg={10}
              xl={10}
              className={`col-12 ${cx.headerMobile} ${
                globalCtx.showMore ? cx.show : ""
              }`}
            >
              <Row className="align-items-center">
                <Col
                  md={6}
                  lg={5}
                  xl={7}
                  className={`col-7 ${cx.headerSearch}`}
                >
                  <InputGroup className="">
                    <FormControl
                      placeholder="Search"
                      aria-label="Search"
                      aria-describedby="basic-addon2"
                      onChange={(e: any) => {
                        checkSearch(e.target.value);
                      }}
                    />
                    <div className={`${cx.searchIcon}`}>
                      <FiSearch />
                    </div>
                    {filterValue?.length > 0 ? (
                      <div className={`${cx.searchListView}`}>
                        <ul>
                          {filterValue?.map((item: any) => {
                            if (
                              data.role !== "coach" &&
                              item?.unique === "resource"
                            ) {
                              return (
                                <>
                                  <li
                                    onClick={() => {
                                      dispatch(changeDivUrl(item?.stepId));
                                      if (data.role === "student") {
                                        history.push(
                                          `/participant/simulations/${location.id}`
                                        );
                                      } else {
                                        if (item.status === "live") {
                                          history.push(
                                            `/admin/participant-view/${item?.id}`
                                          );
                                        } else {
                                          history.push(
                                            `/admin/edit-simulation/${item?.id}`
                                          );
                                        }
                                      }
                                    }}
                                  >
                                    <h5>{item?.name}</h5>
                                    <p>
                                      {" "}
                                      {item?.moduleName} / {item?.stepName} /{" "}
                                      {item?.resourceName}
                                    </p>
                                  </li>
                                </>
                              );
                            }
                            if (item?.unique === "action") {
                              return (
                                <>
                                  <li
                                    onClick={() => {
                                      dispatch(changeDivUrl(item?.stepId));
                                      if (data.role === "coach") {
                                        history.push(
                                          `/coach/feedback-details/${item.actionId}`
                                        );
                                        dispatch(
                                          changeModuleArrayValue(item.allModule)
                                        );
                                        dispatch(
                                          feedbackTeamName([
                                            item.teamName,
                                            item.id,
                                          ])
                                        );
                                        localStorage.setItem(
                                          "teamId",
                                          JSON.stringify(item.id)
                                        );
                                      } else if (data.role === "admin") {
                                        if (item.status === "live") {
                                          history.push(
                                            `/admin/participant-view/${item?.id}`
                                          );
                                        } else {
                                          history.push(
                                            `/admin/edit-simulation/${item?.id}`
                                          );
                                        }
                                      } else {
                                        history.push(
                                          `/participant/simulations/${location.id}`
                                        );
                                      }
                                    }}
                                  >
                                    <h5>{item?.name}</h5>
                                    <p>
                                      {" "}
                                      {item?.moduleName} / {item?.stepName} /{" "}
                                      {item?.actionName}
                                    </p>
                                  </li>
                                </>
                              );
                            }
                            if (
                              data.role === "admin" &&
                              item?.unique === "simulation"
                            ) {
                              let date = new Date(item.update).toLocaleString(
                                "en-us",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              );
                              return (
                                <>
                                  <li>
                                    <NavLink
                                      to={
                                        item.status === "live"
                                          ? `/admin/participant-view/${item?.id}`
                                          : `/admin/edit-simulation/${item?.id}`
                                      }
                                    >
                                      <h5>{item?.name}</h5>
                                      <p>
                                        {" "}
                                        {item?.status} / Last Modified - {date}{" "}
                                      </p>
                                    </NavLink>
                                  </li>
                                </>
                              );
                            }
                            if (
                              data.role !== "coach" &&
                              item?.unique === "module"
                            ) {
                              return (
                                <>
                                  <li
                                    onClick={() => {
                                      dispatch(changeDivUrl(item?.stepId));
                                      if (data.role === "student") {
                                        history.push(
                                          `/participant/simulations/${location.id}`
                                        );
                                      } else {
                                        if (item.status === "live") {
                                          history.push(
                                            `/admin/participant-view/${item?.id}`
                                          );
                                        } else {
                                          history.push(
                                            `/admin/edit-simulation/${item?.id}`
                                          );
                                        }
                                      }
                                    }}
                                  >
                                    <h5>{item?.name}</h5>
                                    <p> {item?.moduleName}</p>
                                  </li>
                                </>
                              );
                            }
                            if (
                              data.role === "admin" &&
                              item?.unique === "globalResource"
                            ) {
                              return (
                                <>
                                  <li>
                                    <NavLink
                                      to={
                                        item.status === "live"
                                          ? `/admin/participant-view/${item?.id}`
                                          : `/admin/edit-simulation/${item?.id}`
                                      }
                                    >
                                      <h5>{item?.name}</h5>
                                      <p>
                                        {" "}
                                        {item?.resourceName}-Global Resource
                                      </p>
                                    </NavLink>
                                  </li>
                                </>
                              );
                            }
                            if (
                              data.role !== "student" &&
                              item?.unique === "team"
                            ) {
                              return (
                                <>
                                  <li
                                    onClick={() =>
                                      history.push({
                                        pathname: `/${
                                          data?.role === "admin"
                                            ? "admin"
                                            : "coach"
                                        }/manage-team/${item?.id}`,
                                        state: {
                                          data: item?.teamId,
                                        },
                                      })
                                    }
                                  >
                                    <h5>{item?.name}</h5>
                                    <p>
                                      {" "}
                                      {item?.teamName} -{" "}
                                      {item?.students
                                        ?.map((e: any) => {
                                          return (
                                            e?.firstName + " " + e?.lastName
                                          );
                                        })
                                        .join(",")}
                                    </p>
                                  </li>
                                </>
                              );
                            }
                          })}
                        </ul>
                      </div>
                    ) : (
                      ""
                    )}
                  </InputGroup>
                </Col>
                <Col md={6} lg={7} xl={5} className={`col-5 ${cx.headerRight}`}>
                  <ul>
                    <li className={`${cx.message}`}>
                      <Dropdown>
                        <Dropdown.Toggle variant="a" id="dropdown-basic">
                          <FiMessageSquare className={`${cx.icon}`} />
                          <div className={`${cx.menuTT}`}>Messaging</div>
                          {totalMessages !== undefined && totalMessages > 0
                            ? totalMessages
                            : ""}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <div className={`${cx.chatMassage}`}>
                            <h3>Messaging</h3>
                            <div className={`${cx.editIcon}`}>
                              {/* <NavLink to="#">
                                <MdZoomOutMap />
                              </NavLink> */}
                              <NavLink to={`/${owner}/message`}>
                                <FiEdit />
                              </NavLink>
                              {/* <NavLink to="#">
                                <MdOutlineCancel />
                              </NavLink> */}
                              <NavLink to="#">
                                <IoIosArrowDown />
                              </NavLink>
                            </div>
                          </div>
                          <ul>
                            {length?.map((item: any) => {
                              if (item?.obj?.chat?.isGroupChat === false) {
                                return item?.obj?.chat?.users?.map((e: any) => {
                                  if (data?._id !== e?._id) {
                                    return (
                                      <li
                                        onClick={() => {
                                          setChatId(item?.obj?.chat?._id);
                                          if (singleChat.length === 2) {
                                            singleChat.splice(0, 1);
                                            singleChat[0].length = 1;
                                            setSingleChat((prev: any) => {
                                              if (
                                                prev.chatId ===
                                                item?.obj?.chat?._id
                                              ) {
                                                return prev;
                                              } else {
                                                return [
                                                  ...prev,
                                                  {
                                                    name: `${
                                                      e?.firstName ||
                                                      e?.coachFirstName
                                                    } ${
                                                      e?.lastName ||
                                                      e?.coachLastName
                                                    }`,
                                                    id: e?._id,
                                                    image: e?.image,
                                                    chatId:
                                                      item?.obj?.chat?._id,
                                                    message: [],
                                                    boolean: false,
                                                    length:
                                                      singleChat.length + 1,
                                                    minimize: false,
                                                  },
                                                ];
                                              }
                                            });
                                          } else {
                                            setSingleChat((prev: any) => {
                                              if (
                                                prev.chatId ===
                                                item?.obj?.chat?._id
                                              ) {
                                                return prev;
                                              } else {
                                                return [
                                                  ...prev,
                                                  {
                                                    name: `${
                                                      e?.firstName ||
                                                      e?.coachFirstName
                                                    } ${
                                                      e?.lastName ||
                                                      e?.coachLastName
                                                    }`,
                                                    id: e?._id,
                                                    image: e?.image,
                                                    chatId:
                                                      item?.obj?.chat?._id,
                                                    message: [],
                                                    boolean: false,
                                                    length:
                                                      singleChat.length + 1,
                                                    minimize: false,
                                                  },
                                                ];
                                              }
                                            });
                                          }
                                          allMessage(item?.obj?.chat?._id);
                                          getAllChat();
                                          item.length = 0;
                                          socket.emit(
                                            "updateData",
                                            item?.obj?.chat?._id,
                                            0
                                          );
                                        }}
                                      >
                                        <img
                                          src="../images/chatuser.svg"
                                          alt=""
                                        />
                                        <div>
                                          <h4>
                                            {e?.firstName || e?.coachFirstName}{" "}
                                            {e?.lastName || e?.coachLastName}
                                          </h4>
                                          {room === item?.obj?.chat?._id ? (
                                            <div>
                                              <Lottie
                                                options={defaultOptions}
                                                // height={50}
                                                width={70}
                                                style={{
                                                  marginBottom: 15,
                                                  marginLeft: 0,
                                                }}
                                              />
                                            </div>
                                          ) : (
                                            <p>
                                              {messages[messages.length - 1]
                                                ?.chat._id ===
                                              item?.obj?.chat?._id ? (
                                                [".jpg", ".png", ".gif"].some(
                                                  (char) =>
                                                    messages[
                                                      messages.length - 1
                                                    ]?.content
                                                      .toLowerCase()
                                                      .endsWith(char)
                                                ) ? (
                                                  <p>image</p>
                                                ) : [
                                                    ".doc",
                                                    ".docx",
                                                    ".html",
                                                    ".htm",
                                                    ".pdf",
                                                    ".odt",
                                                    ".xls",
                                                    ".xlsx",
                                                    ".ods",
                                                    ".ppt",
                                                    ".pptx",
                                                    ".txt",
                                                  ].some((char) =>
                                                    messages[
                                                      messages.length - 1
                                                    ]?.content
                                                      .toLowerCase()
                                                      .endsWith(char)
                                                  ) ? (
                                                  <p>File</p>
                                                ) : (
                                                  parse(
                                                    messages[
                                                      messages.length - 1
                                                    ]?.content
                                                  )
                                                )
                                              ) : [".jpg", ".png", ".gif"].some(
                                                  (char) =>
                                                    item?.obj?.chat?.latestMessage?.content
                                                      ?.toLowerCase()
                                                      .endsWith(char)
                                                ) ? (
                                                <p>image</p>
                                              ) : [
                                                  ".doc",
                                                  ".docx",
                                                  ".html",
                                                  ".htm",
                                                  ".pdf",
                                                  ".odt",
                                                  ".xls",
                                                  ".xlsx",
                                                  ".ods",
                                                  ".ppt",
                                                  ".pptx",
                                                  ".txt",
                                                ].some((char) =>
                                                  item?.obj?.chat?.latestMessage?.content
                                                    .toLowerCase()
                                                    .endsWith(char)
                                                ) ? (
                                                <p>File</p>
                                              ) : (
                                                parse(
                                                  item?.obj?.chat?.latestMessage
                                                    ?.content
                                                )
                                              )}
                                            </p>
                                          )}
                                          {item?.length === 0
                                            ? ""
                                            : item?.length}
                                        </div>
                                      </li>
                                    );
                                  }
                                });
                              } else {
                                return (
                                  <li
                                    onClick={() => {
                                      setChatId(item?.obj?.chat?._id);
                                      if (singleChat.length === 2) {
                                        singleChat.splice(0, 1);
                                        singleChat[0].length = 1;
                                        setSingleChat((prev: any) => {
                                          if (
                                            prev.chatId === item?.obj?.chat?._id
                                          ) {
                                            return prev;
                                          } else {
                                            return [
                                              ...prev,
                                              {
                                                name: `${item?.obj?.chat?.chatName}`,
                                                chatId: item?.obj?.chat?._id,
                                                message: [],
                                                length: singleChat.length + 1,
                                                minimize: false,
                                              },
                                            ];
                                          }
                                        });
                                      } else {
                                        setSingleChat((prev: any) => {
                                          if (
                                            prev.chatId === item?.obj?.chat?._id
                                          ) {
                                            return prev;
                                          } else {
                                            return [
                                              ...prev,
                                              {
                                                name: `${item?.obj?.chat?.chatName}`,
                                                chatId: item?.obj?.chat?._id,
                                                message: [],
                                                length: singleChat.length + 1,
                                                minimize: false,
                                              },
                                            ];
                                          }
                                        });
                                      }
                                      item.length = 0;
                                      allMessage(item?.obj?.chat?._id);
                                    }}
                                  >
                                    <img src="../images/chatuser.svg" alt="" />
                                    <div>
                                      <h4>{item?.obj?.chat?.chatName}</h4>
                                      {room === item?.obj?.chat?._id &&
                                      typing === false ? (
                                        <div>
                                          <Lottie
                                            options={defaultOptions}
                                            // height={50}
                                            width={70}
                                            style={{
                                              marginBottom: 15,
                                              marginLeft: 0,
                                            }}
                                          />
                                        </div>
                                      ) : (
                                        <p>
                                          {messages[messages.length - 1]?.chat
                                            ._id === item?.obj?.chat?._id ? (
                                            [".jpg", ".png", ".gif"].some(
                                              (char) =>
                                                messages[
                                                  messages.length - 1
                                                ]?.content
                                                  .toLowerCase()
                                                  .endsWith(char)
                                            ) ? (
                                              <p>image</p>
                                            ) : [
                                                ".doc",
                                                ".docx",
                                                ".html",
                                                ".htm",
                                                ".pdf",
                                                ".odt",
                                                ".xls",
                                                ".xlsx",
                                                ".ods",
                                                ".ppt",
                                                ".pptx",
                                                ".txt",
                                              ].some((char) =>
                                                messages[
                                                  messages.length - 1
                                                ]?.content
                                                  .toLowerCase()
                                                  .endsWith(char)
                                              ) ? (
                                              <p>File</p>
                                            ) : (
                                              parse(
                                                messages[messages.length - 1]
                                                  ?.content
                                              )
                                            )
                                          ) : [".jpg", ".png", ".gif"].some(
                                              (char) =>
                                                item?.obj?.chat?.latestMessage?.content
                                                  ?.toLowerCase()
                                                  .endsWith(char)
                                            ) ? (
                                            <p>image</p>
                                          ) : [
                                              ".doc",
                                              ".docx",
                                              ".html",
                                              ".htm",
                                              ".pdf",
                                              ".odt",
                                              ".xls",
                                              ".xlsx",
                                              ".ods",
                                              ".ppt",
                                              ".pptx",
                                              ".txt",
                                            ].some((char) =>
                                              item?.obj?.chat?.latestMessage?.content
                                                .toLowerCase()
                                                .endsWith(char)
                                            ) ? (
                                            <p>File</p>
                                          ) : (
                                            parse(
                                              item?.obj?.chat?.latestMessage
                                                ?.content
                                                ? item?.obj?.chat?.latestMessage
                                                    ?.content
                                                : ""
                                            )
                                          )}
                                        </p>
                                      )}
                                    </div>
                                  </li>
                                );
                              }
                            })}
                          </ul>
                        </Dropdown.Menu>
                      </Dropdown>
                    </li>
                    <li className={`${cx.notification}`}>
                      <Dropdown>
                        <Dropdown.Toggle variant="a" id="dropdown-basic">
                          <IoMdNotifications
                            className={`${cx.icon}`}
                            onClick={notificationFunc}
                          />
                          <div className={`${cx.menuTT}`}>Notifications</div>
                          {notificationCount > 0 ? notificationCount : ""}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <h3 onClick={() => readNotificationFunc("all", "")}>
                            Mark All as Read
                          </h3>
                          <ul>
                            {notificationList?.map((item: any) => {
                              let time =
                                +new Date() - +new Date(item.createdAt);
                              let checkTime: any = new Date(item.createdAt);
                              let splitCheckTime = item?.createdAt.split("T");
                              let check = new Date(time).toISOString();
                              let dateAndTime = check.split("T");
                              let dateSeprated = dateAndTime[0].split("-");
                              let timeSeprated = dateAndTime[1].split(":");
                              return (
                                <>
                                  <li
                                    onClick={() =>
                                      readNotificationFunc("single", item?._id)
                                    }
                                  >
                                    <img src="../images/coolicon.svg" alt="" />
                                    <div>
                                      <h4>{item?.message}</h4>
                                      <p>
                                        {+dateSeprated[2] - 1 > 1 &&
                                        +dateSeprated[2] - 1 < 6
                                          ? `${checkTime.slice(0, 4)}`
                                          : `${splitCheckTime[0]}`}{" "}
                                        {+dateSeprated[2] - 1 === 0 &&
                                        timeSeprated[0] != "00"
                                          ? `${timeSeprated[0]} Hours ago`
                                          : ""}{" "}
                                        {+dateSeprated[2] - 1 === 0 &&
                                        timeSeprated[1] != "00"
                                          ? `${timeSeprated[1]} Minutes ago`
                                          : ""}
                                      </p>
                                    </div>
                                  </li>
                                </>
                              );
                            })}

                            {/* <li>
                              <img src="../images/massage.svg" alt="" />
                              <div>
                                <h4>
                                  Team 1 has just completed “Onboarding
                                  Simulation”!
                                </h4>
                                <p>5 minutes ago </p>
                              </div>
                            </li>
                            <li>
                              <img src="../images/coolicon.svg" alt="" />
                              <div>
                                <h4>
                                  Team 1 has just completed “Onboarding
                                  Simulation”!
                                </h4>
                                <p>5 minutes ago </p>
                              </div>
                            </li>
                            <li>
                              <img src="../images/lightbulb.svg" alt="" />
                              <div>
                                <h4>
                                  Team 1 has just completed “Onboarding
                                  Simulation”!
                                </h4>
                                <p>5 minutes ago </p>
                              </div>
                            </li>
                            <li>
                              <img src="../images/coolicon.svg" alt="" />
                              <div>
                                <h4>
                                  Team 1 has just completed “Onboarding
                                  Simulation”!
                                </h4>
                                <p>5 minutes ago </p>
                              </div>
                            </li> */}
                          </ul>
                          <div className={`${cx.seeAllBtn}`}>
                            <NavLink to="#">See All Notifications</NavLink>
                          </div>
                        </Dropdown.Menu>
                      </Dropdown>
                    </li>
                    <li className={`${cx.profileBox}`}>
                      <Dropdown>
                        <Dropdown.Toggle variant="a" id="dropdown-basic">
                          <img
                            src={ProfilePng}
                            className={`${cx.profileImg}`}
                            alt="profile"
                          />
                          <div className={`${cx.menuTT}`}>Me</div>
                        </Dropdown.Toggle>

                        {/* <Dropdown.Menu>
                                            <Dropdown.Item href="#/action-1">Account</Dropdown.Item>
                                        </Dropdown.Menu> */}
                      </Dropdown>

                      {/* <NavLink variant="a" className={`dropdown-toggle`} id="dropdown-basic" to="/">
                                        <img src="images/profile.png" className={`${cx.profileImg}`} alt="profile" />
                                        <div className={`${cx.menuTT}`}>Me</div>
                                    </NavLink> */}
                    </li>
                  </ul>
                </Col>
              </Row>
            </Col>
          </Row>
        </header>
      )}

      {showEditsimulationHeader && (
        <header className={`${cx.mainHeader}`}>
          <Row className={`${cx.mobileHeader}`}>
            <Col className="col-3">
              <GiHamburgerMenu onClick={globalCtx.displayMenu} />
            </Col>
            <Col className="col-6 text-center">
              <NavLink className={`${cx.navlogo}`} to="/">
                <img src={logo} className={`${cx.logoIcon}`} alt="logo" />
                <img src={logotext} className={`${cx.logoText}`} alt="logo" />
              </NavLink>
            </Col>
            <Col className={`col-3 ${cx.moreMenu}`}>
              <FiMoreHorizontal
                className={`${cx.moreIcon}`}
                onClick={globalCtx.displayMore}
              />
            </Col>
          </Row>

          <Row className={`align-items-center ${cx.headerRow}`}>
            <Col md={12} lg={3} xl={3} className={`${cx.headerTitle}`}>
              <h3 className={`${cx.pageTitle}`}>{props.title}</h3>
            </Col>
            <Col
              md={12}
              lg={9}
              xl={9}
              className={`col-12 ${cx.headerMobile} ${
                globalCtx.showMore ? cx.show : ""
              }`}
            >
              <Row>
                <Col className={`${cx.headerRight}`}>
                  <ul>
                    {status == "draft" ? (
                      <>
                        {/* View as Participant START */}
                        {btnStatus && (
                          <NavLink
                            to={`/admin/edit-simulation/${location.id}`}
                            className={`btn ${cx.btnPublish}`}
                          >
                            Edit Mode <GrFormUpload />
                          </NavLink>
                        )}
                        {/* View as Participant END */}
                      </>
                    ) : (
                      ""
                    )}

                    {!btnStatus && (
                      <>
                        <NavLink
                          to={`/admin/participant-view/${location.id}`}
                          onClick={props.func}
                          className={`btn ${cx.viewParticipant}`}
                        >
                          View as Participant <AiFillEye />
                        </NavLink>
                        <button
                          className={`btn ${cx.btnPublish}`}
                          onClick={() => setConfirmPublish(true)}
                        >
                          Publish <GrFormUpload />
                        </button>{" "}
                      </>
                    )}

                    <li className={`${cx.message}`}>
                      <Dropdown>
                        <Dropdown.Toggle variant="a" id="dropdown-basic">
                          <FiMessageSquare className={`${cx.icon}`} />
                          <div className={`${cx.menuTT}`}>Messaging</div>
                        </Dropdown.Toggle>
                      </Dropdown>
                    </li>
                    <li className={`${cx.notification}`}>
                      <Dropdown>
                        <Dropdown.Toggle variant="a" id="dropdown-basic">
                          <IoMdNotifications className={`${cx.icon}`} />
                          <div className={`${cx.menuTT}`}>Notifications</div>
                        </Dropdown.Toggle>

                        {/* <Dropdown.Menu>
                                            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                        </Dropdown.Menu> */}
                      </Dropdown>
                    </li>
                    <li className={`${cx.profileBox}`}>
                      <Dropdown>
                        <Dropdown.Toggle variant="a" id="dropdown-basic">
                          <img
                            src={ProfilePng}
                            className={`${cx.profileImg}`}
                            alt="profile"
                          />
                          <div className={`${cx.menuTT}`}>Me</div>
                        </Dropdown.Toggle>

                        {/* <Dropdown.Menu>
                                            <Dropdown.Item href="#/action-1">Account</Dropdown.Item>
                                        </Dropdown.Menu> */}
                      </Dropdown>

                      {/* <NavLink variant="a" className={`dropdown-toggle`} id="dropdown-basic" to="/">
                                        <img src="images/profile.png" className={`${cx.profileImg}`} alt="profile" />
                                        <div className={`${cx.menuTT}`}>Me</div>
                                    </NavLink> */}
                    </li>
                  </ul>
                </Col>
              </Row>
            </Col>
          </Row>
        </header>
      )}

      {singleChat?.map((item: any, index: number) => {
        if (item.boolean === true) {
          if (item.minimize === false) {
            return (
              <div
                className={`${cx.nameChat}`}
                style={
                  item.length == 1
                    ? { right: "250px" }
                    : { right: `${250 * item.length + 60}px` }
                }
              >
                <div className={`${cx.nameUser}`}>
                  <div className={`${cx.chatHead}`}>
                    <img src="../images/chatuser.svg" alt="" />
                    <h5>{item?.name}</h5>
                  </div>
                  <div className={`${cx.chatHead}`}>
                    <NavLink
                      to="#"
                      onClick={() => {
                        item.minimize = true;
                        setSingleChat(singleChat);
                      }}
                    >
                      <FiMinus />
                    </NavLink>
                    <NavLink
                      to="#"
                      onClick={() => {
                        singleChat.splice(index, 1);
                      }}
                    >
                      <MdOutlineCancel />
                    </NavLink>
                  </div>
                </div>
                <div className={`${cx.chatScroll}`}>
                  {item?.message?.map((e: any) => {
                     let date = new Date(e?.createdAt).toLocaleTimeString();
                     const dataCheck = date.split(":")
                    return (
                      <div className={`${cx.chatMassage}`}>
                       <span>{+dataCheck[0]<10 ? `0${dataCheck[0]}` : dataCheck[0]}:{dataCheck[1]} {dataCheck[2].slice(dataCheck[2].length-2)}</span>

                        {e?.sender?._id === data?._id ? (
                          <div
                            className={`${cx.massageBox}`}
                            style={{
                              flexFlow: "row-reverse",
                            }}
                          >
                            <img src="../images/chatuser.svg" alt="" />
                            <div className={`${cx.chatText}`}>
                              <p>
                                {[".jpg", ".png", ".gif"].some((char) =>
                                  e?.content.toLowerCase().endsWith(char)
                                ) ? (
                                  <img
                                    src={e?.content}
                                    width="150px"
                                    height="130px"
                                  />
                                ) : [
                                    ".doc",
                                    ".docx",
                                    ".html",
                                    ".htm",
                                    ".pdf",
                                    ".odt",
                                    ".xls",
                                    ".xlsx",
                                    ".ods",
                                    ".ppt",
                                    ".pptx",
                                    ".txt",
                                  ].some((char) =>
                                    e?.content.toLowerCase().endsWith(char)
                                  ) ? (
                                  <a href={e.content} target="_blank">
                                    {e.content.slice(
                                      e.content.lastIndexOf("/") + 1
                                    )}{" "}
                                  </a>
                                ) : (
                                  parse(e?.content)
                                )}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className={`${cx.massageBox}`}>
                            <img src="../images/chatuser.svg" alt="" />
                            <div className={`${cx.chatText}`}>
                              <p>
                                {[".jpg", ".png", ".gif"].some((char) =>
                                  e?.content.toLowerCase().endsWith(char)
                                ) ? (
                                  <img
                                    src={e?.content}
                                    width="150px"
                                    height="130px"
                                  />
                                ) : [
                                    ".doc",
                                    ".docx",
                                    ".html",
                                    ".htm",
                                    ".pdf",
                                    ".odt",
                                    ".xls",
                                    ".xlsx",
                                    ".ods",
                                    ".ppt",
                                    ".pptx",
                                    ".txt",
                                  ].some((char) =>
                                    e?.content.toLowerCase().endsWith(char)
                                  ) ? (
                                  <a href={e.content} target="_blank">
                                    {e.content.slice(
                                      e.content.lastIndexOf("/") + 1
                                    )}{" "}
                                  </a>
                                ) : (
                                  parse(e?.content)
                                )}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className={`${cx.chatFooter}`}>
                  <div className={`${cx.chatIcon}`}>
                    <span className={`${cx.fileUpload}`}>
                      <AiOutlinePlusCircle />
                    </span>
                    <span className={`${cx.fileUpload}`}>
                      <AiOutlineFile />
                      <input
                        type="file"
                        accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,text/plain, application/pdf"
                        onChange={(e: any) => {
                          setChatId(item.chatId);
                          fileToUrl(e.target.files[0]);
                        }}
                      />
                    </span>
                    <span className={`${cx.fileUpload}`}>
                      <CgImage />
                      <input
                        type="file"
                        accept="image/png, image/gif, image/jpeg"
                        onChange={(e: any) => {
                          setChatId(item.chatId);
                          fileToUrl(e.target.files[0]);
                        }}
                      />
                    </span>
                  </div>
                  <div className={`${cx.chatInput}`}>
                    <input
                      type="text"
                      placeholder="Aa"
                      value={
                        item.chatId === newMessage.id ? newMessage.msg : ""
                      }
                      onChange={(e: any) => {
                        socket.emit("join chat", item.chatId);
                        setMessages(item.message);
                        setChatId(item.chatId);
                        setSendBoolean(!sendBoolean);
                        setNewMessage({
                          id: item.chatId,
                          msg: e.target.value,
                        });
                      }}
                    />
                    {showEmoji && (
                      <EmojiPicker
                        onEmojiClick={(e: any) => {
                          setNewMessage((prev: any) => {
                            return { id: item.chatId, msg: prev.msg + e.emoji };
                          });
                          setShowEmoji(false);
                        }}
                      />
                    )}
                    <NavLink
                      to="#"
                      className={`${cx.emojiIcon}`}
                      onClick={() => setShowEmoji(true)}
                    >
                      <BiSmile />
                    </NavLink>
                  </div>
                </div>
              </div>
            );
          } else {
            return (
              <NavLink
                to="#"
                onClick={() => {
                  item.minimize = false;
                  setSingleChat(singleChat);
                }}
              >
                <div
                  className={`${cx.miniChat}`}
                  style={
                    item.length == 1
                      ? { right: "250px" }
                      : { right: `${250 * item.length + 60}px` }
                  }
                >
                  <div className={`${cx.imgName}`}>
                    <img src="../images/chatuser.svg" alt="" />
                    <h5>{item?.name}</h5>
                  </div>
                  <TiDeleteOutline
                    onClick={() => {
                      singleChat.splice(index, 1);
                    }}
                  />
                </div>
              </NavLink>
            );
          }
        }
      })}

      <Modal
        className={`${cx.DeletePopup}`}
        show={confirmPublish}
        onHide={() => setConfirmPublish(false)}
        centered
      >
        <Modal.Body>
          <Col lg={12}>
            You are about to publish Simulation. Once you publish this
            simulation, you will only be able to view (not edit) it. To make
            edits to the master version, make a copy of the simulation and edit
            that instead
            <button
              type="button"
              className={`btn btn-danger ${cx.CancelBtn}`}
              onClick={() => setConfirmPublish(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className={`btn bg-primary text-white`}
              onClick={() => {
                dispatch(publishStatus());
                liveSimulation();
                setConfirmPublish(false);
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

export default Header;
