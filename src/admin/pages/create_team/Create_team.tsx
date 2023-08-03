import React, { useEffect, useState } from "react";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import Sidebar from "../../../components/sidebar/Sidebar";
import cx from "../../../admin.style.module.scss";
import useHttp from "../../../hooks/use-https";
import useInput from "../../../hooks/use-input";
import { Card, Col, Row, Form } from "react-bootstrap";
import { useSelector, useDispatch } from 'react-redux';
import { addTeam, firstName, lastName, eMail } from "../../../reduxToolkit/reducers/teamReducers"
import { useHistory, useLocation } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const isEmpty = (value: any) => value.trim() !== "";


const CreateTeam = (props: any) => {

  const location: any = useLocation()

  const showState = useSelector((state: any) => state.teamReducers)
  const dispatch = useDispatch()
  const history = useHistory()

  const [options, setOptions] = useState<any>([]);
  const [email, setEmail] = useState("");
  const [simulationName, setSimulationName] = useState("");
  const [coachEmail, setCoachEmail] = useState("");
  const [showErr, setShowErr] = useState(false);
  const [showDuplicate, setShowDuplicate] = useState({
    boolean:false,
    message: ""
  });

  useEffect(() => {
    if (showErr) {
      toast("please fill simulation name first")
      setTimeout(() => {
        setShowErr(false)
      }, 5000)
    }
  }, [showErr])

  useEffect(() => {
    if (showDuplicate.boolean==true) {
      toast(showDuplicate.message)
      setTimeout(() => {
        setShowDuplicate({
          boolean:false,
          message:""
        })
      }, 5000)
    }
  }, [showDuplicate])

  // function call onload //
  useEffect(() => {
    getSimulation();
  }, [])

  const { sendRequest } = useHttp();
  const { sendRequest:notificationRequest } = useHttp();

  const {
    value: teamNameValue,
    isValid: teamNameIsValid,
    hasError: teamNameHasError,
    valueChangeHandler: teamNameChangeHandler,
    inputBlurHandler: teamNameBlurHandler,
  } = useInput(isEmpty, '');

  const {
    value: firstNameValue,
    isValid: firstNameIsValid,
    hasError: firstNameHasError,
    valueChangeHandler: firstNameChangeHandler,
    inputBlurHandler: firstNameBlurHandler,
  } = useInput(isEmpty, '');

  const {
    value: lastNameValue,
    isValid: lastNameIsValid,
    hasError: lastNameHasError,
    valueChangeHandler: lastNameChangeHandler,
    inputBlurHandler: lastNameBlurHandler,
  } = useInput(isEmpty, '');

  const {
    value: coachFirstNameValue,
    isValid: coachFirstNameIsValid,
    hasError: coachFirstNameHasError,
    valueChangeHandler: coachFirstNameChangeHandler,
    inputBlurHandler: coachFirstNameBlurHandler,
  } = useInput(isEmpty, '');

  const {
    value: coachLastNameValue,
    isValid: coachLastNameIsValid,
    hasError: coachLastNameHasError,
    valueChangeHandler: coachLastNameChangeHandler,
    inputBlurHandler: coachLastNameBlurHandler,
  } = useInput(isEmpty, '');

  const validProfileForm = !teamNameIsValid && !firstNameIsValid && !lastNameIsValid && email && !coachFirstNameIsValid && !coachLastNameIsValid && coachEmail;

  const notificationResponse = (responseData:any) => {
    console.log(responseData,"notificationData")
  }

  const notificationHandler = (teamId:any,simulationName:any) => {
    let data = {
      "message":`You have been assigned a new simulation - “${simulationName}”!`,
      "teamId":teamId,
      "type":"team"
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

  // Post Api for Invite Team Members //

  const InviteTeamMembers = (responseData: any) => {
    notificationHandler(responseData?.data?._id,responseData?.data?.Simulation?.NameOfSimulation)
    setTimeout(() => {
      history.replace("/admin/myteam");
    }, 4000);
  };
  const inviteTeam = () => {
    let arr:any[] = []
    showState.map((item:any)=>{
      arr.push(item.email)
    })
    arr.push(coachEmail)
    const sameData:any = arr.filter((v:any,i:any,a:any)=>a.findIndex((v2:any)=>(v2===v))!==i)
    if(sameData?.length>0){
      let messageErr = "";
    for(let i=0; i<sameData?.length; i++){
      messageErr = [messageErr, sameData[i]].join("\r")
    }
      setShowDuplicate({
        boolean:true,
        message:`Duplicate Emails \r ${messageErr}`
      })
    }else{
    let data = {
      "teamName": teamNameValue,
      "addSimulation": simulationName == "" ? location?.state?.detail?._id : simulationName,
      "coachFirstName": coachFirstNameValue,
      "coachLastName": coachLastNameValue,
      "coachEmail": coachEmail,
      "students": showState,
    };
    sendRequest(
      {
        url: `${process.env.REACT_APP_BASEURL}/CreateTeam`,
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
      },
      InviteTeamMembers
    );
    }
  }

  let simulationOptions: any[] = [];

  const SimulationList = (data: any) => {
    data.data.map((item: any) => {
      simulationOptions.push({ value: item._id, label: item.NameOfSimulation })
    })
    setOptions(simulationOptions);
  }

  // Get api for Select Simulation //

  const getSimulation = () => {
    sendRequest(
      {
        url: `${process.env.REACT_APP_BASEURL}/GetliveSimulations`,
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      },
      SimulationList
    );
  }

  // add field on button click
  let newfield = {
    "first_name": "",
    "last_name": "",
    "email": ""
  };

  return (
    <>
      <Header title="Teams" />
      <ToastContainer />
      <Sidebar />
      <section className={`${cx.pageWrapper}`}>
        <Card>
          <Card.Title>Create New Team</Card.Title>
          <Card.Body>
            <Card.Text>
              <Row>
                <Col lg={12}>
                  <Form className="row">
                    <Form.Group
                      className={`col-lg-5 ${cx.formBox}`}
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Label>Team Name</Form.Label>
                      <Form.Control type="text"
                        value={teamNameValue}
                        onChange={teamNameChangeHandler}
                        onBlur={teamNameBlurHandler} />
                      {teamNameHasError && (
                        <span style={{ color: "red" }}>
                          Please Enter Team Name
                        </span>
                      )}
                    </Form.Group>
                    <Form.Group
                      className={`col-lg-5 ${cx.formBox}`}
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Label>Select a Simulation...</Form.Label>
                      <Form.Select
                        className="form-control"
                        aria-label="Default select example"
                        value={location?.state?.detail?._id}
                        onChange={(e) => {
                          setSimulationName(e.target.value)
                        }}
                      >
                        <option selected disabled> Please Select </option>
                        {
                          options.map((item: any) => {
                            return <option key={item.value} value={item.value}>{item.label}</option>
                          })
                        }

                      </Form.Select>
                    </Form.Group>

                    <Form.Group
                      className={`col-lg-12 ${cx.formBox}`}
                      controlId="exampleForm.ControlInput2"
                    >
                      <Form.Label>Team Participants</Form.Label>

                      {showState.map((input: any, index: number) => {
                        return (
                          <Row>
                            <Col
                              lg={4}
                              className={`mb-2 d-flex align-items-center`}
                            >
                              <div className="me-3">
                                <strong>{index + 1}</strong>
                              </div>
                              <Form.Control
                                type="text"
                                placeholder="First Name"
                                name="first_name"
                                onChange={event => {
                                  if (simulationName == "" && location.state == null) {
                                    setShowErr(true);
                                  }
                                  let data = {
                                    index: index,
                                    event: event.target.name,
                                    value: event.target.value,
                                    simulationName: simulationName == "" ? location?.state?.detail?._id : simulationName
                                  }
                                  dispatch(firstName(data))
                                }}
                              />

                            </Col>
                            <Col lg={4} className={`mb-2`}>
                              <Form.Control
                                type="text"
                                placeholder="Last Name"
                                name="last_name"
                                onChange={event => {
                                  let data = {
                                    index: index,
                                    event: event.target.name,
                                    value: event.target.value
                                  }
                                  dispatch(lastName(data))
                                }}
                              />

                            </Col>
                            <Col lg={4} className={`mb-2`}>
                              <Form.Control
                                type="email"
                                name="email"
                                placeholder="Email"
                                onChange={event => {
                                  let data = {
                                    index: index,
                                    event: event.target.name,
                                    value: event.target.value
                                  }
                                  dispatch(eMail(data))
                                }}
                              />
                            </Col>
                          </Row>
                        );
                      })}

                      <Col className={`text-end mt-2 ${cx.submitActionBox}`}>
                        <button type="button" className={`btn ${cx.submitBtn}`} onClick={() => dispatch(addTeam(newfield))}>
                          Add New Participant +
                        </button>
                      </Col>
                    </Form.Group>

                    <Form.Group
                      className={`col-lg-12 ${cx.formBox}`}
                      controlId="exampleForm.ControlInput2"
                    >
                      <Form.Label>Coach</Form.Label>
                      <Row>
                        <Col
                          lg={4}
                          className={`mb-2 align-items-center`}
                        >
                          <Form.Control
                            type="text"
                            placeholder="First Name"
                            value={coachFirstNameValue}
                            onChange={coachFirstNameChangeHandler}
                            onBlur={coachFirstNameBlurHandler}
                          />
                          {coachFirstNameHasError && (
                            <span style={{ color: "red" }}>
                              Please Enter Coach First Name
                            </span>
                          )}
                        </Col>
                        <Col lg={4} className={`mb-2`}>
                          <Form.Control
                            type="text"
                            placeholder="Last Name"
                            value={coachLastNameValue}
                            onChange={coachLastNameChangeHandler}
                            onBlur={coachLastNameBlurHandler}
                          />
                          {coachLastNameHasError && (
                            <span style={{ color: "red" }}>
                              Please Enter Coach Last Name
                            </span>
                          )}
                        </Col>
                        <Col lg={4} className={`mb-2`}>
                          <Form.Control
                            type="email"
                            placeholder="Email"
                            onChange={(event) => {
                              setCoachEmail(event?.target.value);
                            }}
                          />
                        </Col>
                      </Row>
                    </Form.Group>
                  </Form>
                </Col>
              </Row>
            </Card.Text>
          </Card.Body>
        </Card>

        <Col className={`text-end ${cx.submitActionBox}`} style={{ padding: "0px 25px"}}>
          <button className={`btn ${cx.submitBtnGrey}`} onClick={() => {
            inviteTeam();
          }}>
            Invite Team Members
          </button>
        </Col>
      </section>
      <Footer />
    </>
  );
};

export default CreateTeam;
