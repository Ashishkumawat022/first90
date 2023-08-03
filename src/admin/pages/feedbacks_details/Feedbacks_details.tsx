import React, { useEffect, useState } from "react";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import Sidebar from "../../../components/sidebar/Sidebar";
import cx from "../../../admin.style.module.scss";
import lx from "./Feedbacks_details.module.scss";
// import { useState } from "react";
import { AiOutlineCloudDownload } from "react-icons/ai";
import { IoIosArrowUp } from "react-icons/io";
import { IoMdThumbsUp } from "react-icons/io";
import { AiOutlineStar } from "react-icons/ai";
import { AiFillStar } from "react-icons/ai";
import { BsEmojiSmile, BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";
import { GrAttachment } from "react-icons/gr";
import Dropdown from "react-bootstrap/Dropdown";
import editIcon from "../../../images/icon_editn.svg";
import { Card, Col, Row, Form, Tooltip, OverlayTrigger } from "react-bootstrap";
import {
  changeModuleArrayValue,
  jointFeedbackResourceByCoach,
  moduleArray,
  teamidForFeedback,
  teamNameForFeedback,
} from "../../../reduxToolkit/reducers/moduleButtonReducer";
import { useHistory, useParams } from "react-router-dom";
import useHttp from "../../../hooks/use-https";
import { useDispatch } from "react-redux";
import { FileUploader } from "react-drag-drop-files";
import { MdClose } from "react-icons/md";
const FeedbacksDetails = (props: any) => {
  let emojiPath = "../../images/";
  const localData: any = localStorage.getItem("data");
  const teamId: any = JSON.parse(localStorage.getItem("teamId")!);
  const parseData: any = JSON.parse(localData);
  const history = useHistory();
  const param: any = useParams();
  const dispatch = useDispatch();
  const [actionData, setActionData] = useState<any>();
  const [rating, setRating] = useState(false);
  const [emoji, setEmoji] = useState([
    "emoji _person.svg",
    "emoji _slightly.svg",
    "emoji _thumbs.svg",
    "emoji_rocket_.svg",
    "emoji _clapping.svg",
    "emoji _fire.svg",
  ]);
  useEffect(() => {
    moduleArray?.map((item: any) => {
      item?.addNewStepButtons[0]?.steps?.map((e: any) => {
        e?.actions?.map((a: any) => {
          if (param?.id === a?.id) {
            setActionData(a);
          }
        });
      });
    });
  }, [moduleArray]);
  useEffect(() => {
    if (rating === true) {
      setActionData(actionData);
      setRating(false);
    }
  }, [rating]);
  useEffect(() => {
    getDetails();
  }, []);
  const { sendRequest } = useHttp();
  const { sendRequest: postFeedback } = useHttp();
  const { sendRequest: detailsGet } = useHttp();
  const { sendRequest: notificationRequest } = useHttp();
  const detailsFeedback = (responseData: any) => {
    dispatch(changeModuleArrayValue(responseData?.Simulation?.AddallModule));
  };
  const getDetails = () => {
    detailsGet(
      {
        url: `${process.env.REACT_APP_STUDENT_BASEURL}/feedback_detils?team_id=${teamId}`,
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      },
      detailsFeedback
    );
  };

  const RatingStar = (star: any, num: number) => {
    for (let i = 0; i < actionData.feedbackRatingByCouch.length; i++) {
      if (i < num) {
        actionData.feedbackRatingByCouch[i].point = 1;
      } else if (i == num) {
        actionData.feedbackRatingByCouch[num].point = star;
      } else {
        actionData.feedbackRatingByCouch[i].point = 0;
      }
    }
    setRating(true);
  };
  let postResourceData = {
    id: "",
    title: "",
    url: "",
  };

  const handleImageChange = function (e: any) {
    const fileList = e;
    if (!fileList) return;
    fileToUrl(e);
    postResourceData.id = actionData.id;
    postResourceData.title = e?.name;
  };

  const fileConvertingUrl = (responseData: any) => {
    postResourceData.url = responseData.data?.file;
    dispatch(jointFeedbackResourceByCoach(postResourceData));
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

  const notificationResponse = (responseData: any) => {
    console.log(responseData, "notificationData");
  };

  const notificationHandler = () => {
    let data = {
      message: `You have received feedback on your submission ${actionData?.actionValue}`,
      teamId: teamId,
      type: "team",
    };

    notificationRequest(
      {
        url: `${process.env.REACT_APP_STUDENT_BASEURL}/teamnotifications`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
      notificationResponse
    );
  };

  const feedbackResponse = (responseData: any) => {
    notificationHandler();
    history.push("/admin/feedback");
  };
  const feedbackDoneByCoach = () => {
    let data = JSON.stringify({
      id: teamId,
      AddallModule: moduleArray,
    });

    postFeedback(
      {
        url: `${process.env.REACT_APP_STUDENT_BASEURL}/update_team_simulation`,
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: data,
      },
      feedbackResponse
    );
  };
  return (
    <>
      <Header title="Providing Feedback" />
      <Sidebar />
      <section
        className={
          actionData?.content?.completeStatus === "Completed"
            ? `${cx.pageWrapper} ${lx.disabled}`
            : `${cx.pageWrapper}`
        }
      >
        <Card>
          {/* <Card.Title>Create New Simulation</Card.Title> */}
          <Row>
            <Col lg={8}>
              {actionData?.actionValue === "Upload a File" ? (
                <Col lg={12}>
                  <Card.Body>
                    <Card.Text>
                      <Form className="row">
                        <Form.Group
                          className={`col-lg-12 ${cx.formBox} ${lx.paragraf}`}
                          controlId="exampleForm.ControlInput1"
                        >
                          <Form.Label className={`${lx.teamText}`}>
                            {teamNameForFeedback} Submission - Upload a File{" "}
                            <AiOutlineCloudDownload />{" "}
                          </Form.Label>
                          <div className={`${lx.precedent_contract}`}>
                            <div className={`${lx.precedent_contract_body}`}>
                              <h6 className="mt-0">
                                {actionData?.content?.title}
                              </h6>
                              <ul>
                                <li>{actionData?.content?.description}</li>

                                {actionData?.content?.document?.map(
                                  (item: any) => {
                                    return (
                                      <li>
                                        <a
                                          href={item?.url}
                                          style={{
                                            textDecoration: "none",
                                            color: "black",
                                          }}
                                        >
                                          {item?.fileName}
                                        </a>
                                      </li>
                                    );
                                  }
                                )}
                              </ul>
                            </div>
                          </div>
                        </Form.Group>
                      </Form>
                    </Card.Text>
                  </Card.Body>
                </Col>
              ) : actionData?.actionValue === "Write an Email" ? (
                <Col lg={12}>
                  <Card.Body>
                    <Card.Text>
                      <Form className="row">
                        <Form.Group
                          className={`col-lg-12 ${cx.formBox}`}
                          controlId="exampleForm.ControlInput1"
                        >
                          <Form.Label className={`${lx.teamText}`}>
                            {teamNameForFeedback} Submission - Replying an Email{" "}
                            <AiOutlineCloudDownload />{" "}
                          </Form.Label>
                          <h6>Email to partner</h6>
                        </Form.Group>

                        <Form.Group
                          className={`col-lg-12 ${cx.formBox}`}
                          controlId="exampleForm.ControlInput1"
                        >
                          <Row>
                            <Col lg={12}>
                              <div className={`${lx.uploadPhotoBox}`}>
                                <img
                                  src={actionData?.content?.image}
                                  className={`${lx.logoIcon}`}
                                  alt="logo"
                                  width="30px"
                                  height="30px"
                                />
                                <div className={`${lx.uploadPhotoBoxBody}`}>
                                  <h5>{actionData?.content?.title}</h5>
                                  <p>To: {actionData?.content?.to}</p>
                                </div>
                              </div>
                            </Col>
                            <Col lg={12}>
                              <div className={`${lx.subjectInput}`}>
                                <p>Subject:</p>
                                <Form.Group
                                  className={`col-lg-10 ${cx.formBox}`}
                                  controlId="exampleForm.ControlInput1"
                                >
                                  <Form.Control
                                    type="text"
                                    value={actionData.content.subject}
                                    placeholder="Add a subject line to the email here"
                                  />
                                </Form.Group>
                              </div>
                            </Col>
                            <Col lg={12}>
                              <div className={`${lx.emailMessage}`}>
                                <p>{actionData?.content?.description}</p>

                                <Form.Group
                                  className={`col-lg-12 mb-0 ${cx.formBox}`}
                                  controlId="exampleForm.ControlInput1"
                                >
                                  <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Hi Mark,"
                                    value={actionData.content.text}
                                  />
                                </Form.Group>
                              </div>
                            </Col>
                          </Row>
                        </Form.Group>
                      </Form>
                    </Card.Text>
                  </Card.Body>
                </Col>
              ) : actionData?.actionValue === "Question and Answer" ? (
                <Col lg={12}>
                  <Card.Body>
                    <Card.Text>
                      <Form className="row">
                        <Form.Group
                          className={`col-lg-12 ${cx.formBox}`}
                          controlId="exampleForm.ControlInput1"
                        >
                          <Form.Label className={`${lx.teamText}`}>
                            {teamNameForFeedback} Submission - Interview Guide
                            for Client <AiOutlineCloudDownload />{" "}
                          </Form.Label>
                          <h6>{actionData?.content?.title}</h6>
                        </Form.Group>

                        <Form.Group
                          className={`col-lg-12 ${cx.formBox}`}
                          controlId="exampleForm.ControlInput1"
                        >
                          <Row>
                            {actionData?.content?.question?.map(
                              (item: any, index: number) => {
                                return (
                                  <Col lg={12}>
                                    <div className={`${lx.emailMessage}`}>
                                      <p>
                                        {index + 1}. {item?.que}
                                      </p>
                                      <Form.Group
                                        className={`col-lg-12 ${cx.formBox}`}
                                        controlId="exampleForm.ControlInput1"
                                      >
                                        <Form.Control
                                          type="text"
                                          placeholder=""
                                          value={item?.ans}
                                          disabled
                                        />
                                      </Form.Group>
                                    </div>
                                  </Col>
                                );
                              }
                            )}
                          </Row>
                        </Form.Group>
                      </Form>
                    </Card.Text>
                  </Card.Body>
                </Col>
              ) : (
                <Col lg={12}>
                  <Card.Body>
                    <Card.Text>
                      <Form className="row">
                        <Form.Group
                          className={`col-lg-12 ${cx.formBox} ${lx.paragraf}`}
                          controlId="exampleForm.ControlInput1"
                        >
                          <Form.Label className={`${lx.teamText}`}>
                            {teamNameForFeedback} Submission - Schedule Live
                            Conversation <AiOutlineCloudDownload />{" "}
                          </Form.Label>
                          <h6>{actionData?.content?.title}</h6>
                          <p>{actionData?.content?.description}</p>
                        </Form.Group>

                        <Form.Group
                          className={`col-lg-12 ${cx.formBox}`}
                          controlId="exampleForm.ControlInput1"
                        >
                          <Row>
                            <Col lg={12}>
                              <div
                                className={`${lx.uploadPhotoBox} ${lx.uploadPhotoAction}`}
                              >
                                <img
                                  src={
                                    actionData?.content?.image
                                      ? actionData?.content?.image
                                      : editIcon
                                  }
                                  className={`${lx.logoIcon}`}
                                  alt="logo"
                                />
                                <div className={`${lx.uploadPhotoBoxBody}`}>
                                  <p>
                                    Action Title:{" "}
                                    <span>
                                      {" "}
                                      {actionData?.content?.contactName}
                                    </span>
                                  </p>
                                  <p>
                                    Email:{" "}
                                    <span>
                                      {actionData?.content?.contactEmail}
                                    </span>
                                  </p>
                                  <p>
                                    Phone:{" "}
                                    <span>
                                      {actionData?.content?.contactNumber}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </Form.Group>
                      </Form>
                    </Card.Text>
                  </Card.Body>
                </Col>
              )}

              <Col lg={12}>
                <Card.Body>
                  <Card.Text>
                    <Form className="row">
                      <Form.Group
                        className={`col-lg-12 ${cx.formBox}`}
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label className={`${lx.teamText}`}>
                          Resources for Participants{" "}
                          <span>
                            (Available to participants only when viewing
                            feedback)
                          </span>{" "}
                        </Form.Label>
                      </Form.Group>

                      <Form.Group
                        className={`col-lg-12 ${cx.formBox}`}
                        controlId="exampleForm.ControlInput1"
                      >
                        <Row>
                          <Form.Group
                            className={`col-lg-6 mt-3 ${cx.formBox}`}
                            controlId="exampleForm.ControlInput3"
                          >
                            <Form.Label>
                              Post-Submission Resources <IoIosArrowUp />
                            </Form.Label>
                            <ul className={`${lx.resourceList}`}>
                              {actionData?.feedbackResource?.map(
                                (e: any, index: number) => {
                                  return (
                                    <li key={index}>
                                      {" "}
                                      <a
                                        href={e?.url}
                                        style={{
                                          textDecoration: "none",
                                          color: "black",
                                        }}
                                      >
                                        {" "}
                                        {e?.title}{" "}
                                      </a>
                                    </li>
                                  );
                                }
                              )}
                              {actionData?.feedbackResourceByCoach?.map(
                                (e: any, index: number) => {
                                  return (
                                    <li key={index}>
                                      {" "}
                                      <a
                                        href={e?.url}
                                        style={{
                                          textDecoration: "none",
                                          color: "black",
                                        }}
                                      >
                                        {" "}
                                        {e?.title}{" "}
                                      </a>
                                      <MdClose
                                        className="ms-2"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                          actionData?.feedbackResourceByCoach.splice(
                                            index,
                                            1
                                          );
                                          setRating(true);
                                        }}
                                      />
                                    </li>
                                  );
                                }
                              )}
                            </ul>
                          </Form.Group>
                          <Form.Group
                            className={`col-lg-6 mt-3 ${cx.formBox}`}
                            controlId="exampleForm.ControlInput3"
                          >
                            <Form.Label>
                              Upload File for Team to View
                            </Form.Label>
                            <div className={`${lx.fileUpload}`}>
                              <FileUploader
                                handleChange={handleImageChange}
                                name="file"
                                // types={fileTypes}
                                classes="demo"
                              >
                                <img
                                  src="../images/coach-icon-upload.svg"
                                  className={`${cx.logoIcon}`}
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
                        </Row>
                      </Form.Group>
                    </Form>
                  </Card.Text>
                </Card.Body>
              </Col>
            </Col>
            <Col lg={4}>
              <div className={`${lx.ratingSide}`}>
                <div className={`${lx.ratingRight}`}>
                  <Form.Label>Feedback Rubric</Form.Label>
                  <ul>
                    {actionData?.feedbackRatingByCouch?.map(
                      (item: any, num: number) => {
                        return (
                          <li>
                            {item?.point === 0 ? (
                              <BsStar
                                onClick={() => {
                                  RatingStar(0.5, num);
                                }}
                              />
                            ) : item?.point === 0.5 ? (
                              <BsStarHalf
                                onClick={() => {
                                  RatingStar(1, num);
                                }}
                              />
                            ) : (
                              <BsStarFill
                                onClick={() => {
                                  RatingStar(0, num);
                                }}
                              />
                            )}
                          </li>
                        );
                      }
                    )}

                    {/* <li><BsEmojiSmile /></li> */}
                    <li>
                      <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                          {actionData?.feedbackEmoji === "" ? (
                            <BsEmojiSmile />
                          ) : (
                            <img
                              src={`${emojiPath}${actionData?.feedbackEmoji}`}
                              width="30px"
                              height="30px"
                            />
                          )}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <ul>
                            {emoji.map((item: any, index: number) => {
                              return (
                                <li key={index}>
                                  <img
                                    src={`${emojiPath}${item}`}
                                    alt=""
                                    onClick={() => {
                                      actionData.feedbackEmoji = item;
                                      setRating(true);
                                    }}
                                  />
                                </li>
                              );
                            })}
                          </ul>
                        </Dropdown.Menu>
                      </Dropdown>
                    </li>
                  </ul>
                  <p>
                    Scored by {parseData?.coachFirstName}{" "}
                    {parseData?.coachLastName}
                  </p>
                  <textarea
                    className="form-control"
                    defaultValue={actionData?.feedbackInputByCouch}
                    onChange={(e: any) =>
                      (actionData.feedbackInputByCouch = e.target.value)
                    }
                  ></textarea>
                </div>
                <div className={`${lx.ratingDetails}`}>
                  {actionData?.feedback?.map((item: any, index: number) => {
                    return (
                      <div className={`${lx.ratingPoint}`}>
                        <h5>
                          {index + 1}. {item?.title}
                        </h5>
                        <p>{item?.description}</p>
                        <Form.Group
                          className={`col-lg-12 ${cx.formBox}`}
                          controlId="exampleForm.ControlInput1"
                        >
                          <Form.Control
                            type="text"
                            placeholder="Add feedback..."
                            defaultValue={item?.feedback}
                            onChange={(e: any) => {
                              item.feedback = e.target.value;
                            }}
                          />
                        </Form.Group>
                        <ul>
                          <li
                            className={
                              item?.feedbackRating === 1
                                ? `${lx.ratingNumber}`
                                : ""
                            }
                            onClick={() => {
                              setRating(true);
                              item.feedbackRating = 1;
                            }}
                          >
                            1
                          </li>
                          <li
                            className={
                              item?.feedbackRating === 2
                                ? `${lx.ratingNumber}`
                                : ""
                            }
                            onClick={() => {
                              setRating(true);
                              item.feedbackRating = 2;
                            }}
                          >
                            2
                          </li>
                          <li
                            className={
                              item?.feedbackRating === 3
                                ? `${lx.ratingNumber}`
                                : ""
                            }
                            onClick={() => {
                              setRating(true);
                              item.feedbackRating = 3;
                            }}
                          >
                            3
                          </li>
                          <li
                            className={
                              item?.feedbackRating === 4
                                ? `${lx.ratingNumber}`
                                : ""
                            }
                            onClick={() => {
                              setRating(true);
                              item.feedbackRating = 4;
                            }}
                          >
                            4
                          </li>
                          <li
                            className={
                              item?.feedbackRating === 5
                                ? `${lx.ratingNumber}`
                                : ""
                            }
                            onClick={() => {
                              setRating(true);
                              item.feedbackRating = 5;
                            }}
                          >
                            5
                          </li>
                        </ul>
                        <div className={`${lx.veryPoint}`}>
                          <p>
                            Very <br />
                            poor
                          </p>
                          <p>
                            Very <br />
                            strong
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <Col className={`text-center mt-3 ${lx.submitActionBox}`}>
                    <button
                      className={`btn ${lx.feedbackBtnGrey}`}
                      onClick={() => {
                        actionData.feedbackCoachName =
                          parseData?.coachFirstName +
                          " " +
                          parseData?.coachLastName;
                        actionData.content.completeStatus = "Completed";
                        feedbackDoneByCoach();
                      }}
                    >
                      Submit Feedback
                    </button>
                  </Col>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      </section>
      <Footer />
    </>
  );
};

export default FeedbacksDetails;
