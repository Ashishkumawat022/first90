import React, { useEffect, useState } from 'react';
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import cx from '../../../participant.style.module.scss';
import lx from './Step1.module.scss';
import { NavLink } from "react-router-dom";
import RightSidebar from '../../../components/participant-right-sidebar/participant-right-sidebar'
import { Card, Col, Row, Form, Button, Modal, Tab, Nav } from "react-bootstrap";
import { FiDownloadCloud, FiLink } from "react-icons/fi";
import { GrAttachment } from "react-icons/gr";

import Sidebar from "../../../components/sidebar/Sidebar";
import Participantsimulation from "../../../components/Participantsimulation/Participantsimulation";
import useHttp from '../../../hooks/use-https';


const Step1 = (props: any) => {
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { sendRequest:resourceNotifyRequest } = useHttp();

  useEffect(()=>{
    let localData = localStorage.getItem("data")!;
    let local = JSON.parse(localData)!;
    if(local?.resource===true){
      resourceNotify()
    }
  },[])
  const resourceNotifyResponse = (responseData: any) => {
    localStorage.setItem("data", JSON.stringify(responseData));
  };

  const resourceNotify = () => {
    resourceNotifyRequest(
      {
        url: `${process.env.REACT_APP_STUDENT_BASEURL}/resource_bank_notifaction`,
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      },
      resourceNotifyResponse
    );
  };


  return (
    <>
      <Header title='Onboarding Simulation' btnStatus="view-paricipant" />
      <Sidebar />
      <section className={`${cx.pageWrapper}`}>

        <Row>
          <Participantsimulation />
          <Col lg={6}>
            <Card className={`${lx.disabled}`}>
              <Card.Body>
                <Card.Text>
                  <Form className="row">
                    <Form.Group className={`col-lg-12 ${cx.formBox}`} controlId="exampleForm.ControlInput1">
                      <h4>Module 1</h4>
                      <p>Description of Module 1</p>
                    </Form.Group>
                    <Form.Group className={`col-lg-12 mb-0 ${cx.formBox}`} controlId="exampleForm.ControlInput1">
                      <h4>Step 1</h4>
                      <p className="m-0">Description of Step 1</p>
                    </Form.Group>
                  </Form>
                </Card.Text>
              </Card.Body>
            </Card>

            {/* Action: upload file START */}
            <Card className={`${lx.disabled}`}>
              <Card.Body>

                <Form className="row">
                  <Form.Group className={`col-lg-12 ${cx.formBox}`} controlId="exampleForm.ControlInput1">
                    <Form.Label style={{ fontSize: '15px' }}>File Name</Form.Label>
                    <Form.Control type="text" placeholder="" />
                  </Form.Group>

                  <Form.Group className={`col-lg-12 ${cx.formBox}`} controlId="exampleForm.ControlInput1">
                    <Form.Label style={{ fontSize: '15px' }}>File Description</Form.Label>
                    <Form.Control type="text" placeholder="" />
                  </Form.Group>

                  <Form.Group className={`col-lg-12 ${cx.formBox}`} controlId="exampleForm.ControlInput1">
                    <Row>
                      <Form.Group className={`col-lg-12 mt-3 ${cx.formBox}`} controlId="exampleForm.ControlInput3">
                        <Form.Label>Upload File (If required)</Form.Label>
                        <div className={`${lx.fileUpload}`}>
                          <img src="../images/participant_img.svg" className={`${cx.logoIcon}`} alt="logo" />
                          <p>Drag and drop files here</p>
                          <span>or</span>
                          <div className={`${lx.uploadFile}`}>
                            <Form.Control type="file" />
                            Choose a File <GrAttachment />
                          </div>
                        </div>
                      </Form.Group>

                      <Col className={`text-end ${cx.submitActionBox}`}>
                        <button className={`btn ${cx.submitBtnBorder}`}>Submit for Feedback</button>
                      </Col>
                    </Row>
                  </Form.Group>

                </Form>
              </Card.Body>
            </Card>
            {/* Action:  upload file END */}

            {/* Action: Read an Email START */}
            <Card className={`${lx.disabled}`}>
              <Card.Body>

                <Form className="row">
                  <Form.Group className={`col-lg-12 ${cx.formBox}`} controlId="exampleForm.ControlInput1">
                    <Form.Label>Instructions</Form.Label>
                    <p>Read the following email from Mark (the lead partner on the transaction), which summarizes the results of the due diligence and summarizes next steps.</p>
                  </Form.Group>

                  <Form.Group className={`col-lg-12 ${cx.formBox}`} controlId="exampleForm.ControlInput1">

                    <Form.Label>Email from partner</Form.Label>
                    <Row>
                      <Col lg={12}>
                        <div className={`${lx.uploadPhotoBox}`}>
                          <img
                            src="../images/pr.svg"
                            className={`${lx.logoIcon}`}
                            alt="logo"
                          />
                          <div className={`${lx.uploadPhotoBoxBody}`}>
                            <h5>Mark Jameson</h5>
                            <p>To: John Smithson</p>
                          </div>
                        </div>
                      </Col>
                      <Col lg={12}>
                        <p className="mt-4 mb-0">Subject: Follow up from client due diligence conversation</p>
                      </Col>
                      <Col lg={12}>
                        <div className={`${lx.emailMessage}`}>
                          <p>Hi team,</p>

                          <p>Thanks for putting together the due diligence report for our client. They called me to discuss the following areas so I want to make sure we consider these high-risk areas in the final APS:</p>

                          <p>- Pending litigitation regarding executive compensation contracts</p>
                          <p>- NYT News article on the client’s Sri Lanka call center operations and potential human rights violations</p>
                          <p>- Third party contract with Avatar Inc. that can’t be assigned to our client in event of sale (meaning we need to consider termination clauses)</p>

                          <p>Can you email me the top potential APS examples we can use as templates and their pros and cons? I want to make sure we find the right one to save ourselves work down the line.</p>

                          <p>Cheers, <br />Mark</p>
                        </div>
                      </Col>
                    </Row>
                  </Form.Group>

                </Form>
              </Card.Body>
            </Card>
            {/* Action: Read an Email END */}



            {/* Action: Add Text START */}
            <Card className={`${lx.disabled}`}>
              <Card.Body>

                <Form className="row">

                  <Form.Group className={`col-lg-12 mb-0 ${cx.formBox}`} controlId="exampleForm.ControlInput1">

                    <Form.Label>Add Text</Form.Label>
                    <p className="mb-0">Add Text</p>
                  </Form.Group>

                </Form>
              </Card.Body>
            </Card>
            {/* Action: Add Text END */}





            {/* Action: APS documents START */}
            <Card className={`${lx.disabled}`}>
              <Card.Body>

                <Form className="row">

                  <Form.Group className={`col-lg-12 mb-0 ${cx.formBox}`} controlId="exampleForm.ControlInput1">

                    <Form.Label>Precedent APS documents</Form.Label>
                    <p className="mb-0">Read the following email from Mark (the lead partner on the transaction), which summarizes the results of the due diligence and summarizes next steps.</p>
                    <p className={`mb-0 mt-3 ${lx.achearLink}`}><NavLink to="#">Precedent APS Contracts - Unlimited Bank <FiDownloadCloud className="ms-3" /></NavLink></p>
                  </Form.Group>

                </Form>
              </Card.Body>
            </Card>
            {/* Action: APS documents END */}


            {/* Action: Email to partner START */}
            <Card className={`${lx.disabled}`}>
              <Card.Body>

                <Form className="row">
                  <Form.Group className={`col-lg-12 ${cx.formBox}`} controlId="exampleForm.ControlInput1">
                    <Form.Label>Email to partner</Form.Label>
                    <p>Write an email to Mark here, outlining your top precedent APS documents and the pros and cons of each.</p>
                  </Form.Group>

                  <Form.Group className={`col-lg-12 ${cx.formBox}`} controlId="exampleForm.ControlInput1">
                    <Row>
                      <Col lg={12}>
                        <div className={`${lx.uploadPhotoBox}`}>
                          <img
                            src="../images/pr.svg"
                            className={`${lx.logoIcon}`}
                            alt="logo"
                          />
                          <div className={`${lx.uploadPhotoBoxBody}`}>
                            <h5>Mark Jameson</h5>
                            <p>To: John Smithson</p>
                          </div>
                        </div>
                      </Col>
                      <Col lg={12}>
                        <p className="mt-4 mb-0 d-flex align-items-center">Subject: <input type="text" className="form-control ms-2" placeholder="Add a subject line to the email here" /></p>
                        <textarea className="form-control mt-3"></textarea>
                      </Col>
                      <Form.Group className={`col-lg-12 mt-3 ${cx.formBox}`} controlId="exampleForm.ControlInput3">
                        <Form.Label>Upload File (If required)</Form.Label>
                        <div className={`${lx.fileUpload}`}>
                          <img src="../images/participant_img.svg" className={`${cx.logoIcon}`} alt="logo" />
                          <p>Drag and drop files here</p>
                          <span>or</span>
                          <div className={`${lx.uploadFile}`}>
                            <Form.Control type="file" />
                            Choose a File <GrAttachment />
                          </div>
                        </div>
                      </Form.Group>

                      <Col className={`text-end ${cx.submitActionBox}`}>
                        <button className={`btn ${cx.submitBtnBorder}`}>Submit for Feedback</button>
                      </Col>
                    </Row>
                  </Form.Group>

                </Form>
              </Card.Body>
            </Card>
            {/* Action: Email to partner END */}



            {/* Action: Welcome from the partner START */}
            <Card className={`${lx.disabled}`}>
              <Card.Body>

                <Form className="row">

                  <Form.Group className={`col-lg-12 mb-0 ${cx.formBox}`} controlId="exampleForm.ControlInput1">

                    <Form.Label>Welcome from the partner</Form.Label>
                    <p>Please see below for a video welcoming you to the firm and introducing you to your first client:
                      Unlimited Bank.</p>
                    <video className={`${lx.uploadedvideo}`} controls>
                      <source src="movie.mp4" type="video/mp4" />
                      <source src="movie.ogg" type="video/ogg" />
                    </video>
                  </Form.Group>

                </Form>
              </Card.Body>
            </Card>
            {/* Action: Welcome from the partner END */}




            {/* Action: Hotshot START */}
            <Card className={`${lx.disabled}`}>
              <Card.Body>

                <Form className="row">

                  <Form.Group className={`col-lg-12 mb-0 ${cx.formBox}`} controlId="exampleForm.ControlInput1">

                    <Form.Label>Hotshot</Form.Label>
                    <p>Please click the link below to view the material. </p>
                    <div className={`${lx.link}`}>
                      <NavLink to="#">https://www.hotshotlegal.com</NavLink> <FiLink className={`${lx.icon}`} />
                    </div>
                  </Form.Group>

                </Form>
              </Card.Body>
            </Card>
            {/* Action: Hotshot END */}




            {/* Action: Organizational Chart START */}
            <Card className={`${lx.disabled}`}>
              <Card.Body>

                <Form className="row">

                  <Form.Group className={`col-lg-12 mb-0 ${cx.formBox}`} controlId="exampleForm.ControlInput1">

                    <Form.Label>Organizational Chart</Form.Label>
                    <p>Please see below for Rocketeer Loan’s organizational chart. You may consider this to be relevant information as you complete the APS.</p>

                    <img src="../images/aa.jpg" className={`${lx.uploadedimg}`} />
                  </Form.Group>

                </Form>
              </Card.Body>
            </Card>
            {/* Action: Organizational Chart END */}



            {/* Action: Interview Guide for Client START */}
            <Card className={`${lx.disabled}`}>
              <Card.Body>

                <Form className="row">

                  <Form.Group className={`col-lg-12 mb-0 ${cx.formBox}`} controlId="exampleForm.ControlInput1">

                    <Form.Label>Interview Guide for Client</Form.Label>

                  </Form.Group>

                  <Form.Group className={`col-lg-12 ${cx.formBox}`} controlId="exampleForm.ControlInput1">
                    <Form.Label style={{ fontSize: '15px' }}>1. What questions are you hoping to ask the client in your conversation?</Form.Label>
                    <Form.Control type="text" placeholder="" />
                  </Form.Group>

                  <Form.Group className={`col-lg-12 ${cx.formBox}`} controlId="exampleForm.ControlInput1">
                    <Form.Label style={{ fontSize: '15px' }}>2. What questions do you expect they will have for you?</Form.Label>
                    <Form.Control type="text" placeholder="" />
                  </Form.Group>

                  <Col className={`text-end ${cx.submitActionBox}`}>
                    <button className={`btn ${cx.submitBtnBorder}`}>Submit for Feedback</button>
                  </Col>
                </Form>
              </Card.Body>
            </Card>
            {/* Action: Interview Guide for Client END */}




            {/* Action: Interview Guide for Client START */}
            <Card className={`${lx.disabled}`}>
              <Card.Body>

                <Form className="row">

                  <Form.Group className={`col-lg-12 mb-0 ${cx.formBox}`} controlId="exampleForm.ControlInput1">

                    <Form.Label>Schedule a discussion with Nadia Bhassi - AtB Senior Associate</Form.Label>
                    <p>Nadia is a Senior Associate at AtB in the Corporate M&A practice. She has been at the firm for 5 years and has represented Unlimited Bank previously.</p>
                    <p>Please email Nadia and cc her assistant Gail Spencer (gail@abovethebar.com) to set up a meeting in the next 24 hours. Be sure to include your revised APS and what you hope to discuss in the meeting. Click the “Submit for Feedback” Button once you have scheduled the meeting. </p>
                  </Form.Group>
                  <div className={`${lx.actionDetails}`}>
                    <img src="../images/aa.jpg" />
                    <div className={`${lx.actionDetailsBody}`}>
                      <p><b>Action Title:</b> Carina Feng</p>
                      <p><b>Email:</b> carina.feng@abovethebar.com</p>
                      <p><b>Phone:</b> 1-820-0204-5729</p>
                    </div>
                  </div>
                  <Col className={`text-end ${cx.submitActionBox}`}>
                    <button className={`btn ${cx.submitBtnBorder}`}>Submit for Feedback</button>
                  </Col>
                </Form>
              </Card.Body>
            </Card>
            {/* Action: Interview Guide for Client END */}

            <Col className={`text-end mb-3 ${cx.submitActionBox}`}>
              <button className={`btn ${cx.submitBtn}`}>Continue to Next Step</button>
            </Col>
          </Col>

          <RightSidebar btnStatus={false} />
        </Row>


      </section>
      <Footer />



      <Modal className={`${lx.modalSteps}`}
        centered
        backdrop="static"
        keyboard={false}
        size="xl" show={show} onHide={handleClose}>
        <Modal.Body>
          <Row className='align-items-center'>
            <Col md={8}>
              <div className={`${lx.contentBox}`}>
                <h6>WELCOME!</h6>
                <h2>Let’s start with a quick tour</h2>
                <p>We’ll have you up and running in no time.</p>
                <div className={`${lx.btnGroups}`}>
                  <NavLink className={`btn ${lx.darkBtn}`} to="/participant/step2">Begin tour</NavLink>
                  <NavLink className={`btn ${lx.borderBtn}`} to="#">Show Me Later</NavLink>
                </div>
              </div>
            </Col>

            <Col md={4}>
              <img src="../images/stepm.svg" style={{ width: '100%' }} />
            </Col>
          </Row>
        </Modal.Body>
      </Modal>

    </>
  );
};

export default Step1;
