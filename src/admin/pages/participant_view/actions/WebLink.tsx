import React, { useState, useEffect } from "react";
import { Card, Col, Row, Form, Button, Modal, Tab, Nav } from "react-bootstrap";
import cx from "../../../../admin.style.module.scss";
import lx from '.././Participant_view.module.scss';
import { NavLink } from "react-router-dom";
import { FiLink } from "react-icons/fi";

const WebLink = (props: any) => {
  let isUrl = window.location.pathname.includes("/participant/simulations");
  return (
    <>
      <Card className={isUrl ? "" : `${lx.disabled}`}>
        <Card.Body>

          <Form className="row">

            <Form.Group className={`col-lg-12 mb-0 ${cx.formBox}`} controlId="exampleForm.ControlInput1">

              <Form.Label>{props.value.content.title}</Form.Label>
              <p>{props.value.content.description} </p>
              <div className={`${lx.link}`}>
                <a href={isUrl ? props.value.content.weblinkUrl : "#"} target="_blank">{props.value.content.weblinkUrl} <FiLink className={`${lx.icon}`} /></a> 
              </div>
            </Form.Group>

          </Form>
        </Card.Body>
      </Card>
    </>
  );
};

export default WebLink;
