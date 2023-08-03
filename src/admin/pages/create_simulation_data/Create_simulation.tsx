import React, { useState } from "react";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import Sidebar from "../../../components/sidebar/Sidebar";
import cx from "../../../admin.style.module.scss";
// import lx from './Create_simulation.module.scss';
import { AiOutlineInfoCircle } from "react-icons/ai";
import { GrAttachment } from "react-icons/gr";
import { Card, Col, Row, Form, Tooltip, OverlayTrigger } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import useHttp from "../../../hooks/use-https";
import { useHistory, useLocation } from "react-router-dom";
import { moduleArray, moduleFirstArray } from "../../../reduxToolkit/reducers/moduleButtonReducer";

const CreateSimulation = (props: any) => {

  let history = useHistory();
  const location: any = useLocation();

  const { isLoading, error, sendRequest } = useHttp();
  const { sendRequest: request } = useHttp();
  const [simulationName, setSimulationName] = useState("");
  const [simulationDesc, setSimulationDesc] = useState("");
  const [resourceTitle, setResourceTitle] = useState("");
  const [simulationCtg, setSimulationCtg] = useState("");
  const simulationCtgList = [
    "Law",
    "Consulting",
    "Accounting",
    "Sales",
    "Customer Success",
    "Healthcare",
    "Industrial",
    "Technology",
    "Other",
  ];
  const [globalFileName, setGlobalFileName] = useState("");
  const [globalResourceFile, setGlobalResourceFile] = React.useState<File>(); // also tried <string | Blob>
  const image = [];
  const myFiles = [];
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

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setGlobalFileName(file.name);
      fileToUrl(file)
    }
  };

  const fileConvertingUrl = (responseData: any) => {
    let file = responseData.data.file;
    setGlobalResourceFile(file);
  };

  const fileToUrl = (fileList: any) => {
    let formData = new FormData();
    formData.append("file", fileList);

    request(
      {
        url: `${process.env.REACT_APP_BASEURL}/Addfile`,
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        body: formData,
      },
      fileConvertingUrl
    );
  }

  const editSimulation = (data: any) => {
    notify(data.msg);
    setTimeout(() => {
      history.replace("/admin/simulation");
    }, 4000);
  };

  const updateSimulation = () => {
    let data = JSON.stringify({
      _id: location?.state?._id,
      NameOfSimulation: simulationName == "" ? location?.state?.NameOfSimulation : simulationName,
      DiscreptionOfSimulation: simulationDesc == "" ? location?.state?.DiscreptionOfSimulation : simulationDesc,
      ResorceTitle: resourceTitle == "" ? location?.state?.ResorceTitle : resourceTitle,
      SimulationCategory: simulationCtg == "" ? location?.state?.SimulationCategory : simulationCtg,
      AddallModule: moduleFirstArray,
      file: globalResourceFile
    })

    sendRequest(
      {
        url: `${process.env.REACT_APP_BASEURL}/editSimulation`,
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
          "content-type": "application/json"
        },
        body: data,
      },
      editSimulation
    );
  };

  const createSimulation = (data: any) => {
    notify(data.msg);
    setTimeout(() => {
      history.replace("/admin/simulation");
    }, 4000);
  };

  const submitHandler = () => {
    let data = JSON.stringify({
      NameOfSimulation: simulationName,
      DiscreptionOfSimulation: simulationDesc,
      ResorceTitle: resourceTitle,
      SimulationCategory: simulationCtg,
      AddallModule: moduleFirstArray,
      file: globalResourceFile
    })

    sendRequest(
      {
        url: `${process.env.REACT_APP_BASEURL}/createSimulation`,
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
          "content-type": "application/json"
        },
        body: data,
      },
      createSimulation
    );
  };

  const selectSimulation = (e: any) => {
    setSimulationCtg(e.target.value);
  };

  return (
    <>
      <ToastContainer />
      <Header title="Simulations" />
      <Sidebar />
      <section className={`${cx.pageWrapper}`}>
        <Card>
          <Card.Title>{location?.state?._id == "" ? "Create New Simulation" : "Edit Simulation"}</Card.Title>
          <Card.Body>
            <Card.Text>
              <Row>
                <Col lg={9}>
                  <Form className="row">
                    <Form.Group
                      className={`col-lg-12 ${cx.formBox}`}
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Label>Name of Simulation</Form.Label>
                      <Form.Control
                        type="text"
                        defaultValue={location?.state?.NameOfSimulation}
                        onChange={(event) => {
                          setSimulationName(event?.target.value);
                        }}
                        disabled
                      />
                    </Form.Group>
                    <Form.Group
                      className={`col-lg-12  ${cx.formBox}`}
                      controlId="exampleForm.ControlInput2"
                    >
                      <Form.Label>
                        Description of Simulation
                        <OverlayTrigger
                          overlay={
                            <Tooltip id="tooltip-disabled">
                              Description of Simulation
                            </Tooltip>
                          }
                        >
                          <span className={`d-inline-block  ${cx.tooltipCt}`}>
                            <span style={{ pointerEvents: "none" }}>
                              <AiOutlineInfoCircle />
                            </span>
                          </span>
                        </OverlayTrigger>
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        defaultValue={location?.state?.DiscreptionOfSimulation}
                        onChange={(event) => {
                          setSimulationDesc(event?.target.value);
                        }}
                        disabled
                      />
                    </Form.Group>

                    <Form.Group
                      className={`col-lg-12 ${cx.formBox}`}
                      controlId="exampleForm.ControlInput3"
                    >
                      <Form.Label>
                        Global Resources
                        <OverlayTrigger
                          overlay={
                            <Tooltip id="tooltip-disabled">
                              Global Resources
                            </Tooltip>
                          }
                        >
                          <span className={`d-inline-block  ${cx.tooltipCt}`}>
                            <span style={{ pointerEvents: "none" }}>
                              <AiOutlineInfoCircle />
                            </span>
                          </span>
                        </OverlayTrigger>
                      </Form.Label>
                      <Row>
                        {/* <Col lg={3} className={`mb-2`}>
                          <div className={`${cx.uploadFile}`}>
                            <Form.Control type="file" onChange={onFileChange} disabled/>
                            {!globalFileName ? `Choose a File` : globalFileName}
                            {!globalFileName && <GrAttachment />}
                          </div>
                        </Col> */}
                        <Col lg={6} className={`mb-2`}>
                          <Form.Control
                            type="text"
                            placeholder="Resource Title"
                            defaultValue={location?.state?.ResorceTitle}
                            onChange={(event) => {
                              setResourceTitle(event?.target.value);
                            }}
                            disabled
                          />
                        </Col>
                        {/* <Col lg={3} className={`mb-2`}>
                          <button className={`btn ${cx.greyBtn} ${cx.w100}`}>
                            Upload File
                          </button>
                        </Col> */}
                      </Row>
                    </Form.Group>

                    <Form.Group
                      className={`col-lg-8 ${cx.formBox}`}
                      controlId="exampleForm.ControlInput4"
                    >
                      <Form.Label>Simulation Category</Form.Label>
                      <Form.Select
                        className="form-control"
                        aria-label="Default select example"
                        onChange={selectSimulation}
                        defaultValue={simulationCtgList.filter((e: any) =>
                          e === location?.state?.SimulationCategory
                        )[0]}
                        disabled
                      >
                        <option>Select an option..</option>
                        {simulationCtgList.map((item, index) => {
                          return <option key={index}>{item}</option>;
                        })}
                      </Form.Select>
                    </Form.Group>
                  </Form>
                </Col>
              </Row>
            </Card.Text>
          </Card.Body>
        </Card>

        {/* <Col className={`text-end ${cx.submitActionBox}`}>
          <button onClick={() => {
            if (location?.state?._id) {
              updateSimulation()
            } else {
              submitHandler()
            }
          }}
            className={`btn ${cx.submitBtnGrey}`}>
            Continue
          </button>
        </Col> */}
      </section>
      <Footer />
    </>
  );
};

export default CreateSimulation;
