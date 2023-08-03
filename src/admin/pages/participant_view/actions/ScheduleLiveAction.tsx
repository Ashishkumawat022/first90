import React, { useState, useEffect } from "react";
import { Card, Col, Row, Form } from "react-bootstrap";
import cx from "../../../../admin.style.module.scss";
import lx from ".././Participant_view.module.scss";
import icon from "../../../../images/aa.jpg";
import { useParams } from "react-router-dom";
import useHttp from "../../../../hooks/use-https";
import { moduleArray } from "../../../../reduxToolkit/reducers/moduleButtonReducer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ScheduleLiveAction = (props: any) => {
  const param: any = useParams();
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
  let userId = JSON.parse(localStorage.getItem("data")!);
  const { sendRequest: updateSimulationRequest } = useHttp();
  const { sendRequest: saveActionRequest } = useHttp();
  const updationResponse = (responseData: any) => {
    console.log(responseData.data);
  };

  const updateSimulation = () => {
    let data = JSON.stringify({
      id: param?.id,
      AddallModule: moduleArray,
    });

    updateSimulationRequest(
      {
        url: `${process.env.REACT_APP_STUDENT_BASEURL}/update_team_simulation`,
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: data,
      },
      updationResponse
    );
  };

  const actionResponse = (responseData: any) => {
    if (responseData?.status === false) {
      notify(responseData?.message);
    } else {
      props.sendNotification();
      updateSimulation();
    }
  };

  const saveAction = () => {
    let data = JSON.stringify({
      simulation_id: props?.simulationId,
      action_id: props?.value?.id,
      module: props?.mid,
      stap: props?.sid,
      actionModule: props?.value,
      team_id: param?.id,
    });

    saveActionRequest(
      {
        url: `${process.env.REACT_APP_STUDENT_BASEURL}/studentAction`,
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: data,
      },
      actionResponse
    );
  };
  return (
    <>
      <ToastContainer />
      <Card className={props.value.disable === 0 ? "" : `${lx.disabled}`}>
        <Card.Body>
          <Form className="row">
            <Form.Group
              className={`col-lg-12 mb-0 ${cx.formBox}`}
              controlId="exampleForm.ControlInput1"
            >
              <Form.Label>{props.value.content.title}</Form.Label>
              <p>{props.value.content.description}</p>
            </Form.Group>
            <div className={`${lx.actionDetails}`}>
              <img
                src={
                  props.value.content.image == ""
                    ? icon
                    : props.value.content.image
                }
              />
              <div className={`${lx.actionDetailsBody}`}>
                <p>
                  <b>Action Title:</b> {props.value.content.contactName}
                </p>
                <p>
                  <b>Email:</b> {props.value.content.contactEmail}
                </p>
                <p>
                  <b>Phone:</b> {props.value.content.contactNumber}
                </p>
              </div>
            </div>
            <Col className={`text-end ${cx.submitActionBox}`}>
              <button
                className={`btn ${cx.submitBtnBorder}`}
                onClick={(e: any) => {
                  e.preventDefault();
                  props.value.content.studentName =
                    userId?.firstName + " " + userId?.lastName;
                  props.value.content.submitTime = new Date().getTime();
                  props.value.disable = 1;
                  saveAction();
                }}
              >
                Submit for Feedback
              </button>
            </Col>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};

export default ScheduleLiveAction;
