import React, { useState } from "react"
import { IoMdClose } from "react-icons/io";
import lx from './participant-right-sidebar.module.scss';
import { NavLink } from "react-router-dom";
import { AiOutlineFile, AiOutlineFolder } from "react-icons/ai";
import { Card, Col, Row, Form, Button, Modal, Tab, Nav } from "react-bootstrap";
import { GrAttachment } from "react-icons/gr";

const RightSidebar = (props: any) => {
    const [adshow, setadShow] = useState(false);
    const handleadClose = () => setadShow(false);
    const handleadShow = () => setadShow(true);


    const [adshow2, setadShow2] = useState(false);
    const handleadClose2 = () => setadShow2(false);
    const handleadShow2 = () => setadShow2(true);

    return (
        <>
            <Col lg={3}>

                <div className={`${lx.sideCard}`}>
                    <h5>Global Resources</h5>
                    <ul className="pb-0">
                        {props.btnStatus && <NavLink className={`${lx.newResource}`} to="#">Add New Resource + </NavLink>}
                    </ul>
                    <hr />
                    <h5>Step Resources</h5>
                    <ul>
                        <li>
                             Above the Bar - Our Mission and Values 
                        </li>
                        <li>
                             Above the Bar - Our Mission and Values 
                        </li>
                        {props.btnStatus && <NavLink className={`${lx.newResource}`} to="#" onClick={handleadShow2}>Add New Resource + </NavLink>}
                    </ul>
                </div>

                <div className={`${lx.sideCard}`}>
                    <h5>Advice from your Colleagues</h5>
                    <ul>
                        <li className="pe-0">
                            <div className={`${lx.sideCardProfile}`}>
                                <img src="../images/profile.png" className={`${lx.logoIcon}`} alt="image" />
                                Tom Cruise
                                {props.btnStatus && <IoMdClose className={`${lx.closeAction}`} />}
                            </div>
                            <p>“Email Nina Mehta - she worked on a similar deal 2 years ago and might have a precedent APS for you to use.”</p>
                        </li>
                        <li className="pe-0">
                            <div className={`${lx.sideCardProfile}`}>
                                <img src="../images/profile.png" className={`${lx.logoIcon}`} alt="image" />
                                Tom Cruise
                                {props.btnStatus && <IoMdClose className={`${lx.closeAction}`} />}
                            </div>
                            <p>“Email Nina Mehta - she worked on a similar deal 2 years ago and might have a precedent APS for you to use.”</p>
                        </li>

                        <li className="pe-0">
                            <div className={`${lx.sideCardProfile}`}>
                                <img src="../images/profile.png" className={`${lx.logoIcon}`} alt="image" />
                                Tom Cruise
                                {props.btnStatus && <IoMdClose className={`${lx.closeAction}`} />}
                            </div>
                            <p>“Email Nina Mehta - she worked on a similar deal 2 years ago and might have a precedent APS for you to use.”</p>
                        </li>
                        {props.btnStatus && <NavLink className={`${lx.newResource}`} to="#" onClick={handleadShow}>Add New Advice + </NavLink>}
                    </ul>
                </div>
            </Col>


            {/* Add Advice From Colleague Popup START */}
            <Modal show={adshow} className={`${lx.modalCts}`} size="xl" onHide={handleadClose}>
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

                            <Form.Group className={`col-lg-12 ${lx.formBox}`} controlId="exampleForm.ControlInput1">
                                <Form.Label>Colleague Headshot</Form.Label>
                                <Row className="align-items-center">
                                    <Col lg={3}>
                                        <div className={`mb-3 ${lx.uploadPhotoBox}`}>
                                            <img
                                                src="../images/pr.svg"
                                                className={`${lx.logoIcon}`}
                                                alt="logo"
                                            />
                                            <button type="button" className={`btn ${lx.uploadPhoto}`}>Upload Photo</button>
                                            <button type="button" className={`${lx.reMove}`}>Remove Photo</button>
                                        </div>
                                    </Col>
                                    <Col lg={9}>
                                        <Row>
                                            <Col lg={6} className="mb-3">
                                                <Form.Control type="text" placeholder="First Name" />
                                            </Col>
                                            <Col lg={6} className="mb-3">
                                                <Form.Control type="text" placeholder="Last Name" />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group className={`col-lg-12 ${lx.formBox}`} controlId="exampleForm.ControlInput2">
                                <Form.Label>Advice from Colleague</Form.Label>
                                <Form.Control as="textarea" rows={3} placeholder="Add advice..." />
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button className={`${lx.savBtn}`} onClick={handleadClose}>
                        Save and Exit
                    </Button>
                    <Button className={`${lx.savBtnAnother}`}>
                        Save and Add Another
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Add Advice From Colleague Popup END */}




            {/* Add Resource Popup START */}
            <Modal show={adshow2} className={`${lx.modalCts}`} size="xl" onHide={handleadClose2}>
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

                            <Form.Group className={`col-lg-12 ${lx.formBox}`} controlId="exampleForm.ControlInput1">

                                <Row className="align-items-center">
                                    <Col lg={12}>
                                        <Row>
                                            <Col lg={6} className="mb-3">
                                                <Form.Label>Resource Title</Form.Label>
                                                <Form.Control type="text" placeholder="Resource Title here..." />
                                            </Col>
                                            <Col lg={6} className="mb-3">
                                                <Form.Label>Choose Folder</Form.Label>
                                                <Form.Select>
                                                    <option>None</option>
                                                    <option>Folder 1</option>
                                                    <option>Folder 2</option>
                                                    <option>Folder 3</option>
                                                    <option>Folder 4</option>
                                                    <option>+ New Folder</option>
                                                </Form.Select>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Form.Group>

                            <Form.Group className={`col-lg-12 ${lx.formBox}`} controlId="exampleForm.ControlInput3">
                                <Form.Label>Select Resource to Upload</Form.Label>
                                <div className={`${lx.fileUpload}`}>
                                    <img src="../images/icon-upload.svg" className={`${lx.logoIcon}`} alt="logo" />
                                    <p>Drag and drop files or folders here  </p>
                                    <span>or</span>
                                    <div className={`${lx.uploadFile}`}>
                                        <Form.Control type="file" />
                                        Choose a File or Folder <GrAttachment />
                                    </div>
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button className={`${lx.savBtn}`} onClick={handleadClose2}>
                        Save and Exit
                    </Button>
                    <Button className={`${lx.savBtnAnother}`}>
                        Save and Add Another
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Add Resource Popup END */}

        </>
    );
};

export default RightSidebar;