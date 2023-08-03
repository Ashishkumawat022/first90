import React, { useState, useEffect } from "react";
import { Card, Col, Row, Form, Button, Modal, Tab, Nav } from "react-bootstrap";
import cx from "../../../../admin.style.module.scss";
import lx from '.././Participant_view.module.scss';
import icon from "../../../../images/aa.jpg";

const EmbeddedImage = (props: any) => {

  return (
    <>
      <Card className={`${lx.disabled}`}>
        <Card.Body>

          <Form className="row">

            <Form.Group className={`col-lg-12 mb-0 ${cx.formBox}`} controlId="exampleForm.ControlInput1">

              <Form.Label>{props.value.content.title}</Form.Label>
              <p>{props.value.content.description}</p>

              <img src={props.value.content.document == "" ? icon : props.value.content.document} className={`${lx.uploadedimg}`} />
            </Form.Group>

          </Form>
        </Card.Body>
      </Card>
    </>
  );
};

export default EmbeddedImage;
