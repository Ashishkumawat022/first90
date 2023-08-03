import React, { useEffect, useState } from "react";
import { Card, Form } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import cx from "../../../../admin.style.module.scss";
import lx from '.././Participant_view.module.scss';
import { FiDownloadCloud } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DownloadFileAction = (props: any) => {
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

            <Form.Group className={`col-lg-12 mb-0 ${cx.formBox}`} controlId="exampleForm.ControlInput1">

              <Form.Label>{props.value.content.title}</Form.Label>
              <p className="mb-0">{props.value.content.description}</p>
              {
              props.value.content.document?.flat().length > 0 ? 
              props.value.content.document?.flat().map((e:any, index:number)=>{
                return <p className="mb-0 mt-3" key={index} onClick={()=>{
                  if(!isUrl)
                  notify("This action is not available in “View as Participant” mode - please return to “Edit mode”")}}>
                  <a href={isUrl ? e?.url : "#"}> {e?.fileName} <FiDownloadCloud className="ms-3" /></a></p>
              }) : ""
            }
            </Form.Group>

          </Form>
        </Card.Body>
      </Card>
    </>
  );
};

export default DownloadFileAction;
