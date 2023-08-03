import React from "react";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import cx from '../../../participant.style.module.scss';
import lx from './Messages.module.scss';
import { useState } from "react";
import { NavLink } from "react-router-dom";
import RightSidebar from '../../../components/participant-right-sidebar/participant-right-sidebar'
import { Card, Col, Row, Form, Button, Modal, Tab, Nav } from "react-bootstrap";
import { FiDownloadCloud, FiLink } from "react-icons/fi";
import { GrAttachment } from "react-icons/gr";

import Draft, { htmlToDraft, draftToHtml, EmptyState, rawToDraft, draftToRaw , draftStateToHTML} from 'react-wysiwyg-typescript'
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Select, { components, DropdownIndicatorProps } from 'react-select';

import { FaRegSmile } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { BiEdit } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import { CgImage } from "react-icons/cg";
import { AiOutlineFile } from "react-icons/ai";
import { MdSend } from "react-icons/md";

import Sidebar from "../../../components/sidebar/Sidebar";
import Feedbackleft from "../../../components/Feedbackleft/Feedbackleft";


const Messages = (props: any) => {

  const data=[
    {
      value:"test",
      label:"test"
    },
    {
      value:"testone",
      label:"testone"
    },
    {
      value:"testtwo",
      label:"testtwo"
    },
    {
      value:"testonethree",
      label:"testonethree"
    }
  ]


  return (
    <>
      <Header title='Above the Bar LLC: Onboarding Simulation' btnStatus="view-paricipant" />
      <Sidebar />
      <section className={`${cx.pageWrapper}`}>
        
      <Card.Title className={`mt-2 mb-3 ${lx.titleName}`} >John’s Dashboard</Card.Title>
        <Row className={`${lx.massageBack}`}>
        <Col lg={4}>
            <div className={`${lx.disabled}`}>
              <div className={`${lx.messageStart}`}>
                  <div className={`${lx.messageLeft}`}>
                    <h3>Messaging</h3>
                    <div className={`${lx.messageEdit}`}>
                      <NavLink to="#"><BiEdit /></NavLink>
                      <NavLink to="#"><IoIosArrowDown /></NavLink>
                    </div>
                  </div>
                  <div className={`${lx.messageSearch}`}>
                    <input type="text" placeholder="Search messages" />
                    <FiSearch/>
                  </div>

                  <div className={`${lx.leftList}`}>
                      <ul>
                        <li>
                            <img src="../images/chatuser.svg" alt="" />
                            <div>
                                <h4>Elon</h4>
                                <p>You: Can I talk to you?  <span> . 1h</span> </p>
                            </div>
                        </li>
                        <li>
                            <img src="../images/chatuser.svg" alt="" />
                            <div>
                                <h4>Elon</h4>
                                <p>You: Can I talk to you?  <span> . 1h</span> </p>
                            </div>
                        </li>
                        <li>
                            <img src="../images/chatuser.svg" alt="" />
                            <div>
                                <h4>Elon</h4>
                                <p>You: Can I talk to you?  <span> . 1h</span> </p>
                            </div>
                        </li>
                        <li>
                            <img src="../images/chatuser.svg" alt="" />
                            <div>
                                <h4>Elon</h4>
                                <p>You: Can I talk to you?  <span> . 1h</span> </p>
                            </div>
                        </li>
                        <li>
                            <img src="../images/chatuser.svg" alt="" />
                            <div>
                                <h4>Elon</h4>
                                <p>You: Can I talk to you?  <span> . 1h</span> </p>
                            </div>
                        </li>
                        <li>
                            <img src="../images/chatuser.svg" alt="" />
                            <div>
                                <h4>Elon</h4>
                                <p>You: Can I talk to you?  <span> . 1h</span> </p>
                            </div>
                        </li>
                      </ul>
                  </div>
              </div>
            </div>
        </Col>
          <Col lg={8}>
            <div className={`${lx.disabled}`}>
              <div className={`${lx.chatRight}`}>
                  <div className={`${lx.rightBox}`}>
                      <div className={`${lx.chatUser}`}>
                          <div className={`${lx.userName}`}>
                            <img src="../images/chatuser.svg" alt="" />
                            <h4>Elon</h4>
                          </div>
                          <FiSearch/>
                      </div>
                      
                      <div className={`${lx.chatText}`}>
                        <div className={`${lx.timeZone}`}>
                          <span>3:28 PM</span>
                        </div>
                          <div className={`${lx.textStyle}`}>
                            <p>O</p>
                          </div>
                          <div className={`${lx.textStyle}`}>
                            <p>but still</p>
                          </div>
                          <div className={`${lx.textStyle}`}>
                            <p>I think we should aim for tmr</p>
                          </div>
                          <div className={`${lx.textStyle}`}>
                            <p>but still</p>
                          </div>
                          <div className={`${lx.textStyle}`}>
                            <p>I think we should aim for tmr</p>
                          </div>
                      </div>

                      <div className={`${lx.chatEditor}`}>
                          <div className={`${lx.chatEdit}`}>
                            <Draft />

                            <div className={`${lx.chatSend}`}>
                                <div>
                                  <NavLink to="#"><AiOutlineFile/></NavLink>
                                  <NavLink to="#"><CgImage/></NavLink>
                                  <NavLink to="#"><FaRegSmile/></NavLink>
                                </div>
                                <div>
                                  <NavLink to="#"><MdSend/></NavLink>
                                </div>
                            </div>
                          </div>
                      </div>
                  </div>

                  {/* <div className={`${lx.rightBox} ${lx.rightHeight}`}>
                      <div className={`${lx.chatUser}`}>
                          <div className={`${lx.userName}`}>
                            <h6>To:</h6>
                            <Select
                              closeMenuOnSelect={false}
                              isMulti
                              options={data}
                            />
                          </div>
                      </div>
                  </div> */}
              </div>
            </div>
          </Col>
        </Row>
        
      </section>
      <Footer />


    </>
  );
};

export default Messages;
