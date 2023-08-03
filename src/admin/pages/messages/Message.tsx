import React, { useEffect } from "react";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import cx from "../../../participant.style.module.scss";
import lx from "./Messages.module.scss";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import RightSidebar from "../../../components/participant-right-sidebar/participant-right-sidebar";
import { Card, Col, Row, Form, Button, Modal, Tab, Nav } from "react-bootstrap";
import { FiDownloadCloud, FiLink } from "react-icons/fi";
import { GrAttachment } from "react-icons/gr";
import { EditorState, ContentState } from "draft-js";
import Draft, {
  htmlToDraft,
  draftToHtml,
  EmptyState,
  rawToDraft,
  draftToRaw,
  draftStateToHTML,
} from "react-wysiwyg-typescript";
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Select, { components, DropdownIndicatorProps } from "react-select";

import { FaRegSmile } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { BiEdit } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import { CgImage } from "react-icons/cg";
import { AiOutlineFile } from "react-icons/ai";
import { MdSend } from "react-icons/md";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import Sidebar from "../../../components/sidebar/Sidebar";
import Feedbackleft from "../../../components/Feedbackleft/Feedbackleft";
import useHttp from "../../../hooks/use-https";
import io from "socket.io-client";
import axios from "axios";
import { RxCross2 } from "react-icons/rx";
import parse from "html-react-parser";
import EmojiPicker from "emoji-picker-react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const ENDPOINT = `https://api.appic.tech`; // "https://first90.com"; -> After deployment
var socket: any, selectedChatCompare: any;

const Message = (props: any) => {
  const data = JSON.parse(localStorage.getItem("data")!);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const { isLoading, error, sendRequest } = useHttp();
  const { sendRequest: createChatRequest } = useHttp();
  const { sendRequest: allMessageRequest } = useHttp();
  const { sendRequest: getAllChatRequest } = useHttp();
  const { sendRequest: readByRequest } = useHttp();
  const { sendRequest: createGroupRequest } = useHttp();
  const { sendRequest: urlRequest } = useHttp();

  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [chatId, setChatId] = useState<string>("");
  const [searchUser, setSearchUser] = useState<any[]>([]);
  const [singleChat, setSingleChat] = useState<any>();
  const [showNewMessage, setShowNewMessage] = useState<boolean>(true);
  const [showSearchTab, setShowSearchTab] = useState<boolean>(false);
  const [firstCome, setFirstCome] = useState<boolean>(true);
  const [notification, setNotification] = useState<any[]>([]);
  const [length, setLength] = useState<any[]>([]);
  const [room, setRoom] = useState<string>("");
  const [allCheck, setAllCheck] = useState<any>();
  const [check, setCheck] = useState<any[]>([]);
  const [sendBoolean, setSendBoolean] = useState(false);
  const [emojiShow, setEmojiShow] = useState(false);
  const [editorState, setEditorState] = useState<any>();
  const [isFileConvert, setIsFileConvert] = useState(false);

  const fileConvertingUrl = (responseData: any) => {
    setNewMessage(responseData.data.file);
    setIsFileConvert(true);
  };

  useEffect(() => {
    if (chatId == "" && firstTimeCreate == true && isFileConvert == true) {
      if (check.length === 1) {
        createChat(check[0].value);
        setFirstTimeCreate(false);
        setIsFileConvert(false);
      }
      if (check.length > 1) {
        let allId: any[] = [];
        let allName = "";
        check.map((item: any) => {
          allId.push(item.value);
          allName = allName + " " + item.label;
        });
        createGroup(allId, allName);
        setFirstTimeCreate(false);
        setIsFileConvert(false);
      }
    }
    if (chatId !== "" && isFileConvert === true) {
      sendMessage(chatId);
      setIsFileConvert(false);
    }
  }, [isFileConvert]);

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

  const searchUsersResponse = (responseData: any) => {
    let searchData: any[] = [];
    responseData?.data?.map((item: any) => {
      if (data?._id !== item?._id) {
        let lastName = item?.lastName || item?.coachLastName;
        searchData.push({
          value: item?._id,
          label: item?.firstName || item?.coachFirstName + " " + lastName,
          id: item?._id,
          name: item?.firstName || item?.coachFirstName + " " + lastName,
          image: item?.image,
        });
      }
    });
    setSearchUser(searchData);
  };

  const searchUsers = () => {
    sendRequest(
      {
        url: `${process.env.REACT_APP_STUDENT_BASEURL}/search_student?search=`,
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      },
      searchUsersResponse
    );
  };

  const createChatResponse = (responseData: any) => {
    setFirstCome(false);
    setShowSearchTab(false);
    responseData?.users?.map((e: any) => {
      if (data?._id !== e?._id)
        setSingleChat({
          name: `${e?.firstName || e?.coachFirstName} ${
            e?.lastName || e?.coachLastName
          }`,
          id: responseData?._id,
          image: `${e?.image}`,
        });
    });
    setChatId(responseData?._id);
    allMessage(responseData?._id);
    sendMessage(responseData?._id);
    setTimeout(() => {
      setChatId(responseData?._id);
      getAllChat();
    }, 2000);
  };

  const createChat = (id: string) => {
    let data = JSON.stringify({
      userId: id,
    });
    createChatRequest(
      {
        method: "post",
        url: `${process.env.REACT_APP_STUDENT_BASEURL}/create_chat`,
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: data,
      },
      createChatResponse
    );
  };

  const createGroupResponse = (responseData: any) => {
    setFirstCome(false);
    setShowSearchTab(false);
    setSingleChat({
      name: `${responseData?.chatName}`,
      id: responseData?._id,
    });
    sendMessage(responseData?._id);
    setTimeout(() => {
      setChatId(responseData?._id);
      getAllChat();
    }, 2000);
  };

  const createGroup = (id: any[], name: string) => {
    let data = JSON.stringify({
      name: name,
      users: id,
    });
    createGroupRequest(
      {
        method: "post",
        url: `${process.env.REACT_APP_STUDENT_BASEURL}/group_chat`,
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: data,
      },
      createGroupResponse
    );
  };

  useEffect(() => {
    if (chatId) {
      allMessage(chatId);
      selectedChatCompare = chatId;
    }
  }, [chatId]);

  const allMessageResponse = (responseData: any) => {
    setFirstCome(false);
    setMessages(responseData?.data);
    socket.emit("join chat", chatId);
    // let unreadMsg: any[] = [];
    // responseData?.data?.map((item: any) => {
    //   let check = item?.readBy?.includes(data?._id);
    //   if (!check) {
    //     unreadMsg.push(item?._id);
    //   }
    // });
    // if (unreadMsg?.length > 0) {
    //   readBy(unreadMsg);
    // }
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

  const readByResponse = (data: any) => {
    console.log(data, "sdada");
  };

  const readBy = (msg: any) => {
    let readByData = JSON.stringify({
      user_id: data?._id,
      messageArr: msg,
    });
    readByRequest(
      {
        method: "post",
        url: `${process.env.REACT_APP_STUDENT_BASEURL}/readBy`,
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: readByData,
      },
      readByResponse
    );
  };

  const getAllChatResponse = (responseData: any) => {
    let dataArr: any[] = [];
    responseData?.map((item: any) => {
      dataArr.push({
        obj: { chat: item },
        id: item._id,
        length: item?.latestMessage?.sender?._id===data?._id ? 0 : item?.count,
      });
    });
    setLength(dataArr);
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

  const sendMessage = async (id: any) => {
    if (newMessage) {
      // socket.emit("stop typing", chatId);
      try {
        // const config = {
        //   headers: {
        //     "Content-type": "application/json",
        //     Authorization: localStorage.getItem("token")!,
        //   },
        // };
         setNewMessage("");
         setEditorState(() => EditorState.createEmpty());
        // const { data } = await axios.post(
        //   `${process.env.REACT_APP_STUDENT_BASEURL}/send_message`,
        //   {
        //     content: newMessage,
        //     chatId: id,
        //   },
        //   config
        // );
       socket.emit("new message", {
              id: data?._id,
              content: newMessage,
             chatId: id,
            },(res:any)=>{
              setMessages([...messages, res]);
            })
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
    setLength(length);
  }, [messages]);

  useEffect(() => {
    searchUsers();
    getAllChat();
    socket = io(ENDPOINT);
    socket.emit("setup", JSON.parse(localStorage.getItem("data")!));
    socket.on("connected", () => setSocketConnected(true));
    // socket.on("typing", () => setIsTyping(true));
    // socket.on("stop typing", () => setIsTyping(false));
    // eslint-disable-next-line
  }, []);

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

  // useEffect(() => {
  //   socket.on("typing", (room: any) => {
  //     setRoom(room);
  //   });
  //   socket.on("stop typing", () => {
  //     setRoom("");
  //   });
  // });

  useEffect(() => {
    if (allCheck) {
      let a = 0;
      for (let i = 0; i < length.length; i++) {
        if (length[i]?.obj?.chat?._id === allCheck?.chat?._id) {
          length[i].length += 1;
          length[i].obj.chat.latestMessage.content = allCheck?.content;
          socket.emit("updateData",length[i]?.obj?.chat?._id,length[i].length)
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

  const [countForLength, setCountForLength] = useState(0);
  const [checkLengthData, setCheckLengthData] = useState<any[]>([]);
  const [firstTimeCreate, setFirstTimeCreate] = useState(false);
  useEffect(() => {
    if (countForLength === 0) setCountForLength(1);
  }, [notification]);

  const typingHandler = (e: any) => {
    let htmlData = draftToHtml(e);
    setNewMessage(htmlData);
    setSendBoolean(true);
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      // socket.emit("typing", chatId);
    } else {
      setTyping(false);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", chatId);
        setTyping(false);
      }
    }, timerLength);
  };
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
    if (sendBoolean === true && enterPressed === true && chatId !== "") {
      sendMessage(chatId);
      setSendBoolean(false);
    }
    if (
      enterPressed === true &&
      check.length === 1 &&
      firstTimeCreate === true &&
      chatId == ""
    ) {
      createChat(check[0].value);
      setFirstTimeCreate(false);
    }
    if (
      enterPressed === true &&
      check.length > 1 &&
      firstTimeCreate === true &&
      chatId == ""
    ) {
      let allId: any[] = [];
      let allName = "";
      check.map((item: any) => {
        allId.push(item.value);
        allName = allName + " " + item.label;
      });
      createGroup(allId, allName);
      setFirstTimeCreate(false);
    }
  }, [enterPressed, firstTimeCreate]);

  return (
    <>
      <Header
        title="Above the Bar LLC: Onboarding Simulation"
        btnStatus="view-paricipant"
      />
      <Sidebar />
      <section className={`${cx.pageWrapper}`}>
        <Card.Title className={`mt-2 mb-3 ${lx.titleName}`}>
          {data?.firstName}’s Dashboard
        </Card.Title>
        <Row className={`${lx.massageBack}`}>
          <Col lg={4}>
            <div className={`${lx.disabled}`}>
              <div className={`${lx.messageStart}`}>
                <div className={`${lx.messageLeft}`}>
                  <h3>Messaging</h3>
                  <div className={`${lx.messageEdit}`}>
                    <NavLink to="#" onClick={() => setShowNewMessage(true)}>
                      <BiEdit />
                    </NavLink>
                  </div>
                </div>
                <div className={`${lx.messageSearch}`}>
                  <input
                    type="text"
                    placeholder="Search messages"
                    onChange={(e: any) => {
                      if (checkLengthData.length === 0) {
                        setCheckLengthData([...length]);
                      }
                      let matchedUser: any[] = [];
                      length.map((item: any) =>
                        item?.obj?.chat?.users?.map((a: any) => {
                          if (data?._id !== a?._id) {
                            let name = `${a?.firstName || a?.coachFirstName} ${
                              a?.lastName || a?.coachLastName
                            }`;
                            if (
                              name
                                .toLowerCase()
                                ?.includes(e.target.value?.toLowerCase())
                            ) {
                              matchedUser.push(item);
                            }
                          }
                        })
                      );
                      if (e.target.value === "") {
                        setLength([...checkLengthData]);
                        setCheckLengthData([]);
                      } else {
                        setLength(matchedUser);
                      }
                    }}
                  />
                  <FiSearch />
                </div>

                <div className={`${lx.leftList}`}>
                  <ul>
                    {showNewMessage && (
                      <li
                        className={`${lx.new_message}`}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setShowSearchTab(true);
                          setChatId("");
                        }}
                      >
                        <div className="d-flex align-items-center">
                          <div className={`${lx.menuIcon}`}>
                            <svg
                              width="14"
                              height="12"
                              viewBox="0 0 14 12"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M5.00016 0C3.15921 0 1.66683 1.49238 1.66683 3.33333C1.66683 5.17428 3.15921 6.66667 5.00016 6.66667C6.84111 6.66667 8.3335 5.17428 8.3335 3.33333C8.3335 1.49238 6.84111 0 5.00016 0ZM3.00016 3.33333C3.00016 2.22876 3.89559 1.33333 5.00016 1.33333C6.10473 1.33333 7.00016 2.22876 7.00016 3.33333C7.00016 4.4379 6.10473 5.33333 5.00016 5.33333C3.89559 5.33333 3.00016 4.4379 3.00016 3.33333Z"
                                fill="#A0ABBB"
                              />
                              <path
                                d="M10.2724 3.47885C10.0849 3.38323 9.87736 3.33337 9.66683 3.33337V2.00004C10.0879 2.00004 10.503 2.09971 10.8781 2.29097C10.9194 2.31203 10.9601 2.33414 11.0002 2.35727C11.3238 2.54409 11.605 2.79713 11.825 3.10037C12.0723 3.44115 12.2355 3.83565 12.301 4.25158C12.3665 4.66751 12.3327 5.09305 12.2021 5.49337C12.0716 5.89369 11.8481 6.25741 11.55 6.55475C11.2518 6.8521 10.8875 7.07462 10.4869 7.20411C10.1304 7.31933 9.75405 7.35797 9.38253 7.31814C9.33654 7.3132 9.29063 7.30707 9.24484 7.29973C8.82937 7.23315 8.43555 7.06919 8.09558 6.82126L8.09488 6.82076L8.88086 5.74371C9.05092 5.86781 9.24797 5.94985 9.45584 5.98316C9.66372 6.01648 9.87652 6.00009 10.0768 5.93535C10.2772 5.87061 10.4593 5.75935 10.6084 5.61068C10.7574 5.46201 10.8692 5.28016 10.9344 5.08001C10.9997 4.87985 11.0166 4.66709 10.9839 4.45913C10.9511 4.25117 10.8696 4.05393 10.7459 3.88354C10.6222 3.71316 10.46 3.57448 10.2724 3.47885Z"
                                fill="#A0ABBB"
                              />
                              <path
                                d="M12.3322 12C12.3322 11.65 12.2633 11.3034 12.1293 10.98C11.9954 10.6566 11.7991 10.3628 11.5516 10.1153C11.304 9.86777 11.0102 9.67144 10.6868 9.53749C10.3635 9.40354 10.0169 9.3346 9.66683 9.3346V8C10.1215 8 10.5724 8.07753 11.0002 8.22876C11.0665 8.25223 11.1324 8.27748 11.1976 8.30448C11.6829 8.5055 12.1238 8.80014 12.4953 9.17157C12.8667 9.54301 13.1613 9.98396 13.3623 10.4693C13.3894 10.5345 13.4146 10.6003 13.4381 10.6667C13.5893 11.0944 13.6668 11.5453 13.6668 12H12.3322Z"
                                fill="#A0ABBB"
                              />
                              <path
                                d="M9.66683 12H8.3335C8.3335 10.1591 6.84111 8.66667 5.00016 8.66667C3.15921 8.66667 1.66683 10.1591 1.66683 12H0.333496C0.333496 9.42267 2.42283 7.33333 5.00016 7.33333C7.57749 7.33333 9.66683 9.42267 9.66683 12Z"
                                fill="#A0ABBB"
                              />
                            </svg>
                          </div>
                          <div className={`${lx.inside}`}>
                            <h4>New Message</h4>
                          </div>
                        </div>
                        <div>
                          <RxCross2
                            onClick={() => setShowNewMessage(false)}
                            style={{ cursor: "pointer" }}
                          />
                        </div>
                      </li>
                    )}
                    {length?.map((item: any) => {
                      if (item?.obj?.chat?.isGroupChat === false) {
                        return item?.obj?.chat?.users?.map((e: any) => {
                          if (data?._id !== e?._id) {
                            return (
                              <li
                                onClick={() => {
                                  setChatId(item?.obj?.chat?._id);
                                  setSingleChat({
                                    name: `${
                                      e?.firstName || e?.coachFirstName
                                    } ${e?.lastName || e?.coachLastName}`,
                                    id: e?._id,
                                    image: e?.image,
                                  });
                                  setShowSearchTab(false);
                                  getAllChat();
                                  item.length = 0;
                                  socket.emit("updateData",item?.obj?.chat?._id,0)
                                }}
                              >
                                <img src="../images/chatuser.svg" alt="" />
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
                                      {messages[messages.length - 1]?.chat
                                        ._id === item?.obj?.chat?._id ? (
                                        [".jpg", ".png", ".gif"].some((char) =>
                                          messages[messages.length - 1]?.content
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
                                        )
                                      )}
                                    </p>
                                  )} {item?.length===0 ? "" : item?.length}
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
                              setSingleChat({
                                name: `${item?.obj?.chat?.chatName}`,
                              });
                              setShowSearchTab(false);
                              item.length = 0;
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
                                    style={{ marginBottom: 15, marginLeft: 0 }}
                                  />
                                </div>
                              ) : (
                                <p>
                                  {messages[messages.length - 1]?.chat._id ===
                                  item?.obj?.chat?._id ? (
                                    [".jpg", ".png", ".gif"].some((char) =>
                                      messages[messages.length - 1]?.content
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
                                        messages[messages.length - 1]?.content
                                          .toLowerCase()
                                          .endsWith(char)
                                      ) ? (
                                      <p>File</p>
                                    ) : (
                                      parse(
                                        messages[messages.length - 1]?.content
                                      )
                                    )
                                  ) : [".jpg", ".png", ".gif"].some((char) =>
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
                                      item?.obj?.chat?.latestMessage?.content
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
                </div>
              </div>
            </div>
          </Col>
          <Col lg={8}>
            <div className={`${lx.disabled}`}>
              <div className={`${lx.chatRight}`}>
                {showSearchTab ? (
                  <div className={`${lx.rightBox}`}>
                    <div className={`${lx.chatUser}`}>
                      <div className={`${lx.userName}`}>
                        <h4 className={`${lx.search_Name}`}>To.</h4>
                        
                        <div
                          className={`${lx.messageSearch}`}
                          style={{ width: "100%" }}
                        >
                          <Select
                            isMulti
                            options={searchUser}
                            formatOptionLabel={(item) => (
                              <div className="country-option">
                                <img src={item.image} alt="profile" />
                                <span>{item.label}</span>
                              </div>
                            )}
                            className={`${lx.search_Name_input}`}
                            onChange={(e: any) => {
                              setCheck(e);
                              setFirstTimeCreate(true);
                            }}
                          /> 
                        </div>

                      </div>
                    </div>

                    <div
                      className={`${lx.chatEditor}`}
                    >
                      <div className={`${lx.chatEdit}`}>
                        <Editor
                          editorState={editorState}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          onEditorStateChange={setEditorState}
                          onChange={(e: any) => {
                            typingHandler(e);
                            setEmojiShow(false);
                          }}
                        />

                        <div className={`${lx.chatSend}`}>
                          <div>
                            <span className={`${lx.fileUpload}`}>
                              <AiOutlineFile />
                              <input
                                type="file"
                                accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,text/plain, application/pdf"
                                onChange={(e: any) => {
                                  fileToUrl(e.target.files[0]);
                                  setFirstTimeCreate(true);
                                }}
                              />
                            </span>
                            <span className={`${lx.fileUpload}`}>
                              <CgImage />
                              <input
                                type="file"
                                accept="image/png, image/gif, image/jpeg"
                                onChange={(e: any) => {
                                  fileToUrl(e.target.files[0]);
                                  setFirstTimeCreate(true);
                                }}
                              />
                            </span>
                          </div>
                          <div>
                            <NavLink to="#">
                              <MdSend
                                onClick={() => {
                                  setFirstTimeCreate(true);
                                }}
                              />
                            </NavLink>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : firstCome ? (
                  ""
                ) : (
                  <div className={`${lx.rightBox}`}>
                    <div className={`${lx.chatUser}`}>
                      <div className={`${lx.userName}`}>
                        <img
                          src={
                            singleChat?.image
                              ? singleChat?.image
                              : "../images/chatuser.svg"
                          }
                          alt=""
                        />
                        <h4>{singleChat?.name}</h4>
                      </div>
                      {/* <FiSearch/> */}
                    </div>
                    <div className={`${lx.chatText}`}>
                    {messages?.length > 0
                      ? messages?.map((item: any) => {
                        let date = new Date(item?.createdAt).toLocaleTimeString();
                        const dataCheck = date.split(":")
                          return (
                            <div className={`${lx.chatText}`}>
                              <div className={`${lx.timeZone}`}>
                                <span>{+dataCheck[0]<10 ? `0${dataCheck[0]}` : dataCheck[0]}:{dataCheck[1]} {dataCheck[2].slice(dataCheck[2].length-2)}</span>
                              </div>
                              {item?.sender?._id === data?._id ? (
                                <div
                                  className={`${lx.textStyle}`}
                                  style={{
                                    display: "flex",
                                    flexFlow: "row-reverse",
                                  }}
                                >
                                  <p>
                                    {[".jpg", ".png", ".gif"].some((char) =>
                                      item?.content.toLowerCase().endsWith(char)
                                    ) ? (
                                      <img
                                        src={item?.content}
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
                                        item?.content
                                          .toLowerCase()
                                          .endsWith(char)
                                      ) ? (
                                      <a href={item.content} target="_blank">
                                        {item.content.slice(
                                          item.content.lastIndexOf("/") + 1
                                        )}{" "}
                                      </a>
                                    ) : (
                                      parse(item?.content)
                                    )}
                                  </p>
                                </div>
                              ) : (
                                <div className={`${lx.textStyle}`}>
                                  <p>
                                    {[".jpg", ".png", ".gif"].some((char) =>
                                      item?.content.toLowerCase().endsWith(char)
                                    ) ? (
                                      <img
                                        src={item?.content}
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
                                        item?.content
                                          .toLowerCase()
                                          .endsWith(char)
                                      ) ? (
                                      <a href={item.content} target="_blank">
                                        {item.content.slice(
                                          item.content.lastIndexOf("/") + 1
                                        )}{" "}
                                      </a>
                                    ) : (
                                      parse(item?.content)
                                    )}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })
                      : ""} </div>
                    {room === selectedChatCompare ? (
                      <div>
                        <Lottie
                          options={defaultOptions}
                          // height={50}
                          width={70}
                          style={{ marginBottom: 15, marginLeft: 0 }}
                        />
                      </div>
                    ) : (
                      <></>
                    )}

                    <div className={`${lx.chatEditor}`}>
                      <div className={`${lx.chatEdit}`}>
                        <Editor
                          editorState={editorState}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          onEditorStateChange={setEditorState}
                          onChange={(e: any) => {
                            typingHandler(e);
                            setEmojiShow(false);
                          }}
                        />

                        <div className={`${lx.chatSend}`}>
                          <div>
                            <span className={`${lx.fileUpload}`}>
                              <AiOutlineFile />
                              <input
                                type="file"
                                accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,text/plain, application/pdf"
                                onChange={(e: any) => {
                                  fileToUrl(e.target.files[0]);
                                }}
                              />
                            </span>
                            <span className={`${lx.fileUpload}`}>
                              <CgImage />
                              <input
                                type="file"
                                accept="image/png, image/gif, image/jpeg"
                                onChange={(e: any) => {
                                  fileToUrl(e.target.files[0]);
                                }}
                              />
                            </span>
                          </div>
                          <div>
                            <NavLink to="#">
                              <MdSend
                                onClick={() => {
                                  sendMessage(chatId);
                                  setCountForLength(0);
                                }}
                              />
                            </NavLink>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </section>
      <Footer />
    </>
  );
};

export default Message;
