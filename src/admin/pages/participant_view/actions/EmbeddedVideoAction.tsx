import React from "react";
import { Card, Form } from "react-bootstrap";
import cx from "../../../../admin.style.module.scss";
import lx from '.././Participant_view.module.scss';

const EmbeddedVideoAction = (props: any) => {

  return (
    <>
      <Card className={`${lx.disabled}`}>
        <Card.Body>

          <Form className="row">

            <Form.Group className={`col-lg-12 mb-0 ${cx.formBox}`} controlId="exampleForm.ControlInput1">

              <Form.Label>{props.value.content.title}</Form.Label>
              <p>{props.value.content.description}</p>
              <video className={`${lx.uploadedvideo}`} controls>
                <source src={props.value.content.document == "" ? "" : props.value.content.document} type="video/mp4" />
              </video>
            </Form.Group>

          </Form>
        </Card.Body>
      </Card>
    </>
  );
};

export default EmbeddedVideoAction;
