import React from "react";
import { Card, Col, Row, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import cx from "../../../../admin.style.module.scss";
import useHttp from "../../../../hooks/use-https";
import { moduleArray } from "../../../../reduxToolkit/reducers/moduleButtonReducer";
import lx from ".././Participant_view.module.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const QandAAction = (props: any) => {
  let isUrl = window.location.pathname.includes("/participant/simulations");
  let userId = JSON.parse(localStorage.getItem("data")!);
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
              <Form.Label>{props?.value?.content?.title}</Form.Label>
            </Form.Group>

            {props?.value?.content?.question.map((item: any) => {
              return (
                <Form.Group
                  className={`col-lg-12 ${cx.formBox}`}
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label style={{ fontSize: "15px" }}>
                    {item.que}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    defaultValue={item?.ans}
                    onChange={(e: any) => (item.ans = e.target.value)}
                  />
                </Form.Group>
              );
            })}

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

export default QandAAction;
