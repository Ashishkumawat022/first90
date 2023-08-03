import React from "react";
import { Card, Col, Row, Form } from "react-bootstrap";
import cx from "../../../../admin.style.module.scss";
import lx from '.././Participant_view.module.scss';
import image from "../../../../images/pr.svg";
import { NavLink } from "react-router-dom";
import { FiDownloadCloud } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GrDocumentDownload } from "react-icons/gr";

const ReadEmailAction = (props: any) => {
  let isUrl = window.location.pathname.includes("/participant/simulations");
  const notify = (text: string) =>
    toast(text, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  return (
    <>
    <ToastContainer />
      <Card className={isUrl ? "" : `${lx.disabled}`}>
        <Card.Body>

          <Form className="row">
            <Form.Group className={`col-lg-12 ${cx.formBox}`} controlId="exampleForm.ControlInput1">
              <Form.Label>{props.value.content.title}</Form.Label>
              <p>{props.value.content.description}</p>
            </Form.Group>

            <Form.Group className={`col-lg-12 ${cx.formBox}`} controlId="exampleForm.ControlInput1">

              <Form.Label>Email from partner</Form.Label>
              <Row>
                <Col lg={12}>
                  <div className={`${lx.uploadPhotoBox}`}>
                    <img
                      src={props.value.content.image == "" ? image : props.value.content.image}
                      className={`${lx.logoIcon}`}
                      alt="logo"
                    />
                    <div className={`${lx.uploadPhotoBoxBody}`}>
                      <h5>{props.value.content.from}</h5>
                    </div>
                  </div>
                </Col>
                <Col lg={12}>
                  <p className="mt-4 mb-0">Subject: {props.value.content.subject}</p>
                </Col>
                <Col lg={12}>
                  <div className={`${lx.emailMessage}`}>
                    <p>{props.value.content.text}</p>
                  </div>
                </Col>
              </Row>
            </Form.Group>
            {
              props.value.content.document?.flat().length > 0 ? 
              props.value.content.document?.flat().map((e:any, index:number)=>{
                return <p className="mb-0 mt-3" key={index} onClick={()=>{
                  if(!isUrl)
                  notify("This action is not available in “View as Participant” mode - please return to “Edit mode”")}}>
                  <a href={isUrl ? e?.url : "#"}> {e?.fileName} <FiDownloadCloud className="ms-3" /></a></p>
              }) : ""
            }

          </Form>
        </Card.Body>
      </Card>
    </>
  );
};

export default ReadEmailAction;
