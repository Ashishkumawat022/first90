import React, { useEffect } from "react";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import Sidebar from "../../../components/sidebar/Sidebar";
import cx from "../../../admin.style.module.scss";
import lx from "./View_simulation.module.scss";
import { useState } from "react";
import { FiPlusSquare } from "react-icons/fi";
import { MdContentCopy } from "react-icons/md";
import { FiEdit2 } from "react-icons/fi";
import { FiRotateCw } from "react-icons/fi";
import { FaRegEdit } from "react-icons/fa";
import { NavLink, useHistory, useParams } from "react-router-dom";
import notFound from "../../../images/notfound.svg";

import { Card, Col, Row, ProgressBar, Modal } from "react-bootstrap";
import useHttp from "../../../hooks/use-https";

const ViewSimulation = (props: any) => {
  const param: any = useParams();
  const history: any = useHistory();

  const { sendRequest: getrequest } = useHttp();
  const { sendRequest } = useHttp();
  const { sendRequest: unarchiveRequest } = useHttp();
  const { sendRequest: archiveRequest } = useHttp();
  const { sendRequest: teamRequest } = useHttp();

  const [status, setStatus] = useState("");
  const [archiveStatus, setArchiveStatus] = useState("");
  const [allData, setAllData] = useState<any>();
  const [teamData, setTeamData] = useState<any[]>([]);
  const [confirmArchive, setConfirmArchive] = useState(false);
  const [duplicate, setDuplicate] = useState(false);

  useEffect(() => {
    getSimulationById(param.id);
    getTeamById();
  }, []);

  const simulationCopy = (responseData: any) => {
    history.replace(`/admin/view-simulation/${responseData.data._id}`);
    setTimeout(() => {
      getSimulationById(responseData.data._id);
    }, 2000);
  };

  const duplicateSimulation = () => {
    let data = JSON.stringify({
      _id: param.id,
    });

    sendRequest(
      {
        url: `${process.env.REACT_APP_BASEURL}/duplicate`,
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
          "content-type": "application/json",
        },
        body: data,
      },
      simulationCopy
    );
  };

  const simulationUnarchive = (responseData: any) => {
    console.log(responseData, "responseData");
  };

  const unarchiveSimulation = () => {
    let data = JSON.stringify({
      _id: param.id,
    });

    unarchiveRequest(
      {
        url: `${process.env.REACT_APP_BASEURL}/UnArchived?id=${param.id}`,
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
          "content-type": "application/json",
        },
        body: data,
      },
      simulationUnarchive
    );
  };

  const simulationByIdResponse = (responseData: any) => {
    setStatus(responseData.data.status);
    setArchiveStatus(responseData.data.Arkivestatus);
    setAllData(responseData.data);
  };

  const getSimulationById = (id: string) => {
    getrequest(
      {
        url: `${process.env.REACT_APP_BASEURL}/GetSimulationData?simunactionsID=${id}`,
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token"),
          "content-type": "application/json",
        },
      },
      simulationByIdResponse
    );
  };

  const teamByIdResponse = (responseData: any) => {
    setTeamData(responseData.data);
  };

  const getTeamById = () => {
    teamRequest(
      {
        url: `${process.env.REACT_APP_BASEURL}/GetSimulationsTeam?id=${param.id}`,
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token"),
          "content-type": "application/json",
        },
      },
      teamByIdResponse
    );
  };

  const simulationArchiveStatus = (responseData: any) => {
    history.push("/admin/simulation");
  };

  const archiveSimulation = () => {
    archiveRequest(
      {
        url: `${process.env.REACT_APP_BASEURL}/Arkivestatus?id=${param.id}`,
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
          "content-type": "application/json",
        },
      },
      simulationArchiveStatus
    );
  };

  return (
    <>
      <Header title="Simulations" />
      <Sidebar />
      <section className={`${cx.pageWrapper}`}>
        {status == "draft" ? (
          <Card className="mb-4">
            <Card.Title>Actions</Card.Title>
            <Row>
              <Col md={6} lg={6} xl={3}>
                <NavLink
                  to="/admin/create-simulation"
                  style={{ color: "white", textDecoration: "none" }}
                >
                  <div
                    className={`${lx.cardBox}`}
                    style={{ backgroundColor: "#009CE0" }}
                  >
                    <h5>Create New Simulation</h5>
                    <FiPlusSquare className={`${lx.cardIcon}`} />
                  </div>
                </NavLink>
              </Col>
              <Col md={6} lg={6} xl={3}>
                <div
                  className={`${lx.cardBox}`}
                  style={{ backgroundColor: "#48BC93", cursor: "pointer" }}
                  onClick={() => setDuplicate(true)}
                >
                  <h5>
                    Duplicate <br /> {allData?.NameOfSimulation}
                  </h5>
                  <MdContentCopy className={`${lx.cardIcon}`} />
                </div>
              </Col>
              <Col md={6} lg={6} xl={3}>
                <NavLink
                  to={`/admin/edit-simulation/${param.id}`}
                  className={`${lx.cardBox}`}
                  style={{ backgroundColor: "#7C7EF3", cursor: "pointer" }}
                >
                  <h5>
                    Edit <br /> {allData?.NameOfSimulation}
                  </h5>
                  <FiEdit2 className={`${lx.cardIcon}`} />
                </NavLink>
              </Col>
              <Col md={6} lg={6} xl={3}>
                <div
                  className={`${lx.cardBox}`}
                  style={{ backgroundColor: "#F4B04A", cursor: "pointer" }}
                >
                  <h5>
                    Archive <br /> {allData?.NameOfSimulation}
                  </h5>
                  <FiRotateCw
                    className={`${lx.cardIcon}`}
                    onClick={() => setConfirmArchive(true)}
                  />
                </div>
              </Col>
            </Row>
          </Card>
        ) : status == "live" ? (
          <Card className="mb-4">
            <Card.Title>Actions</Card.Title>
            <Row>
              <Col md={6} lg={6} xl={3}>
                <NavLink
                  to="/admin/create-simulation"
                  style={{ color: "white", textDecoration: "none" }}
                >
                  <div
                    className={`${lx.cardBox}`}
                    style={{ backgroundColor: "#009CE0" }}
                  >
                    <h5>Create New Simulation</h5>
                    <FiPlusSquare className={`${lx.cardIcon}`} />
                  </div>
                </NavLink>
              </Col>
              <Col md={6} lg={6} xl={3}>
                <div
                  className={`${lx.cardBox}`}
                  style={{ backgroundColor: "#48BC93", cursor: "pointer" }}
                  onClick={() => setDuplicate(true)}
                >
                  <h5>
                    Duplicate <br /> {allData?.NameOfSimulation}
                  </h5>
                  <MdContentCopy className={`${lx.cardIcon}`} />
                </div>
              </Col>
              <Col md={6} lg={6} xl={3}>
                <NavLink
                  to={`/admin/participant-view/${param.id}`}
                  className={`${lx.cardBox}`}
                  style={{ backgroundColor: "#7C7EF3", cursor: "pointer" }}
                >
                  <h5>
                    View <br /> {allData?.NameOfSimulation}
                  </h5>
                  <FiEdit2 className={`${lx.cardIcon}`} />
                </NavLink>
              </Col>
              <Col md={6} lg={6} xl={3}>
                <div
                  className={`${lx.cardBox}`}
                  style={{ backgroundColor: "#F4B04A", cursor: "pointer" }}
                >
                  <h5>
                    Archive <br /> {allData?.NameOfSimulation}
                  </h5>
                  <FiRotateCw
                    className={`${lx.cardIcon}`}
                    onClick={() => setConfirmArchive(true)}
                  />
                </div>
              </Col>
            </Row>
          </Card>
        ) : status == "Archive" ? (
          archiveStatus == "draft" ? (
            <Card className="mb-4">
              <Card.Title>Actions</Card.Title>
              <Row>
                <Col md={6} lg={6} xl={3}>
                  <NavLink
                    to="/admin/create-simulation"
                    style={{ color: "white", textDecoration: "none" }}
                  >
                    <div
                      className={`${lx.cardBox}`}
                      style={{ backgroundColor: "#009CE0" }}
                    >
                      <h5>Create New Simulation</h5>
                      <FiPlusSquare className={`${lx.cardIcon}`} />
                    </div>
                  </NavLink>
                </Col>
                <Col md={6} lg={6} xl={3}>
                  <div
                    className={`${lx.cardBox}`}
                    style={{ backgroundColor: "#48BC93", cursor: "pointer" }}
                    onClick={() => setDuplicate(true)}
                  >
                    <h5>
                      Duplicate <br /> {allData?.NameOfSimulation}
                    </h5>
                    <MdContentCopy className={`${lx.cardIcon}`} />
                  </div>
                </Col>
                <Col md={6} lg={6} xl={3}>
                  <NavLink
                    to="#"
                    className={`${lx.cardBox}`}
                    style={{ backgroundColor: "#7C7EF3", cursor: "pointer" }}
                  >
                    <h5>
                      Edit <br /> {allData?.NameOfSimulation}
                    </h5>
                    <FiEdit2 className={`${lx.cardIcon}`} />
                  </NavLink>
                </Col>
                <Col md={6} lg={6} xl={3}>
                  <div
                    className={`${lx.cardBox}`}
                    style={{ backgroundColor: "#F4B04A", cursor: "pointer" }}
                  >
                    <h5>
                      Unarchive <br /> {allData?.NameOfSimulation}
                    </h5>
                    <FiRotateCw
                      className={`${lx.cardIcon}`}
                      onClick={() => unarchiveSimulation()}
                    />
                  </div>
                </Col>
              </Row>
            </Card>
          ) : (
            <Card className="mb-4">
              <Card.Title>Actions</Card.Title>
              <Row>
                <Col md={6} lg={6} xl={3}>
                  <NavLink
                    to="/admin/create-simulation"
                    style={{ color: "white", textDecoration: "none" }}
                  >
                    <div
                      className={`${lx.cardBox}`}
                      style={{ backgroundColor: "#009CE0" }}
                    >
                      <h5>Create New Simulation</h5>
                      <FiPlusSquare className={`${lx.cardIcon}`} />
                    </div>
                  </NavLink>
                </Col>
                <Col md={6} lg={6} xl={3}>
                  <div
                    className={`${lx.cardBox}`}
                    style={{ backgroundColor: "#48BC93", cursor: "pointer" }}
                    onClick={() => setDuplicate(true)}
                  >
                    <h5>
                      Duplicate <br /> {allData?.NameOfSimulation}
                    </h5>
                    <MdContentCopy className={`${lx.cardIcon}`} />
                  </div>
                </Col>
                <Col md={6} lg={6} xl={3}>
                  <NavLink
                    to="#"
                    className={`${lx.cardBox}`}
                    style={{ backgroundColor: "#7C7EF3" }}
                  >
                    <h5>
                      View <br /> {allData?.NameOfSimulation}
                    </h5>
                    <FiEdit2 className={`${lx.cardIcon}`} />
                  </NavLink>
                </Col>
                <Col md={6} lg={6} xl={3}>
                  <div
                    className={`${lx.cardBox}`}
                    style={{ backgroundColor: "#F4B04A", cursor: "pointer" }}
                  >
                    <h5>
                      Unarchive <br /> {allData?.NameOfSimulation}
                    </h5>
                    <FiRotateCw
                      className={`${lx.cardIcon}`}
                      onClick={() => unarchiveSimulation()}
                    />
                  </div>
                </Col>
              </Row>
            </Card>
          )
        ) : (
          ""
        )}

        <Card className="mb-4">
          <Card.Title>
            Participating Teams
            {status == "live" ? (
              <NavLink
                to={{
                  pathname: "/admin/create-team",
                  state: { detail: allData },
                }}
                className={`${lx.addBtn}`}
              >
                Add New Team +
              </NavLink>
            ) : (
              ""
            )}
          </Card.Title>

          {status == "draft" ? (
            <Row className={`${lx.notFound}`}>
              <Col md={8} lg={6} xl={6} className={`${lx.notFoundLeft}`}>
                <p>
                  Oops! Sorry, teams cannot be added when Simulation is in Draft
                  Status.{" "}
                </p>
              </Col>
              <Col md={4} lg={6} xl={6} className={`${lx.notFoundRight}`}>
                <img src={notFound} className={`${lx.cardImg}`} alt="img" />
              </Col>
            </Row>
          ) : status == "Archive" ? (
            archiveStatus == "draft" ? (
              <Row className={`${lx.notFound}`}>
                <Col md={8} lg={6} xl={6} className={`${lx.notFoundLeft}`}>
                  <p>
                    Oops! Sorry, teams cannot be added when Simulation is in
                    Archived Status.{" "}
                  </p>
                </Col>
                <Col md={4} lg={6} xl={6} className={`${lx.notFoundRight}`}>
                  <img src={notFound} className={`${lx.cardImg}`} alt="img" />
                </Col>
              </Row>
            ) : (
              ""
            )
          ) : (
            ""
          )}

          <Row>
            {status == "live" ? (
              <>
                {teamData.map((item: any, num: number) => {
                  return (
                    <Col md={6} lg={6} xl={3}>
                      <div
                        className={`${lx.teamBox}`}
                        onClick={() => {
                          history.push(
                            `/admin/manage-team/${item.addSimulation}`
                          );
                        }}
                      >
                        <h5>
                          <span>Team Name:</span> {item.teamName}
                        </h5>
                        <h5>
                          <span>Coach:</span> {item?.coach?.coachFirstName}{" "}
                          {item?.coach?.coachLastName}
                        </h5>
                        <div
                          className={`${lx.cardImg} d-flex justify-content-center align-items-center`}
                          style={{
                            cursor: "flex",
                            border: "2px solid #009ce0",
                            borderRadius: "50%",
                            width: "150px",
                            height: "150px",
                            backgroundColor: "#009ce0",
                          }}
                        >
                          <span style={{ fontSize: "40px", color: "white" }}>
                            {item.teamName.slice(0, 1).toUpperCase()}
                          </span>
                        </div>
                        <div className={`${lx.cardFt}`}>
                          <ProgressBar className={`${lx.team1}`} now={34} />
                          <span>34%</span>
                        </div>
                      </div>
                    </Col>
                  );
                })}
              </>
            ) : status == "Archive" ? (
              archiveStatus == "live" ? (
                <>
                  {teamData.map((item: any, num: number) => {
                    return (
                      <Col md={6} lg={6} xl={3}>
                        <div className={`${lx.teamBox}`}>
                          <h5>
                            <span>Team Name :</span> {item.teamName}
                          </h5>
                          <h5>
                            <span>Coach :</span> {item.firstName}{" "}
                            {item.lastName}
                          </h5>
                          <div
                            className={`${lx.cardImg} justify-content-center align-items-center`}
                            style={{
                              cursor: "flex",
                              border: "2px solid #009ce0",
                              borderRadius: "50%",
                              width: "150px",
                              height: "150px",
                              backgroundColor: "#009ce0",
                            }}
                          >
                            <span style={{ fontSize: "40px", color: "white" }}>
                              {item.teamName.slice(0, 1).toUpperCase()}
                            </span>
                          </div>
                          <div className={`${lx.cardFt}`}>
                            <ProgressBar className={`${lx.team1}`} now={34} />
                            <span>34%</span>
                          </div>
                        </div>
                      </Col>
                    );
                  })}
                </>
              ) : (
                ""
              )
            ) : (
              ""
            )}
          </Row>
        </Card>

        <Card>
          <Card.Title>
            Simulation Information
            {status == "draft" ? (
              <NavLink
                to={{
                  pathname: "/admin/create-simulation",
                  state: allData,
                }}
                className={`${lx.addBtn}`}
              >
                Edit Info <FaRegEdit />
              </NavLink>
            ) : status == "live" ? (
              <NavLink
                to={{
                  pathname: "/admin/create-simulation-data",
                  state: allData,
                }}
                className={`${lx.addBtn}`}
              >
                View Info <FaRegEdit />
              </NavLink>
            ) : status == "Archive" ? (
              archiveStatus == "draft" ? (
                <NavLink to="#" className={`${lx.addBtn}`}>
                  Edit Info <FaRegEdit />
                </NavLink>
              ) : (
                <NavLink to="#" className={`${lx.addBtn}`}>
                  View Info <FaRegEdit />
                </NavLink>
              )
            ) : (
              ""
            )}
          </Card.Title>

          <Card.Body>
            <Card.Text>
              <Row className={`${lx.descriptionBox}`}>
                <Col lg={4} className={`${lx.descriptionBoxLeft}`}>
                  <h5>
                    <span>Name:</span> {allData?.NameOfSimulation}
                  </h5>
                  <h5>
                    <span>Category:</span> {allData?.SimulationCategory}
                  </h5>
                  <h5>
                    <span>Additional Resources:</span>{" "}
                    {allData?.additionalResource.length} Resource
                  </h5>
                </Col>
                <Col lg={8} className={`${lx.descriptionBoxRight}`}>
                  <h4>Description</h4>
                  <p>{allData?.DiscreptionOfSimulation}</p>
                </Col>
              </Row>
            </Card.Text>
          </Card.Body>
        </Card>

        <Modal
          className={`${cx.DeletePopup}`}
          show={confirmArchive}
          onHide={() => setConfirmArchive(false)}
          centered
        >
          <Modal.Body>
            <Col lg={12}>
              <p>
                You are about to archive "{allData?.NameOfSimulation}". You will
                not be able to make changes, add new teams, or publish the
                simulation while it is archived, and all data will be hidden
                from the Data and Reporting tab. However, current teams can
                still complete and access the simulation. If you wish to
                unarchive it, simply click “ Show archived simulations” to view
                the list and then click “Unarchive”. Do you wish to continue
                archiving the simulation?
              </p>
              <button
                type="button"
                className={`btn btn-danger ${cx.CancelBtn}`}
                onClick={() => setConfirmArchive(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`btn bg-primary text-white`}
                onClick={() => {
                  archiveSimulation();
                  setConfirmArchive(false);
                }}
              >
                {" "}
                Ok
              </button>
            </Col>
          </Modal.Body>
        </Modal>

        <Modal
          className={`${cx.DeletePopup}`}
          show={duplicate}
          onHide={() => setDuplicate(false)}
          centered
        >
          <Modal.Body>
            <Col lg={12}>
              <p>
                Are you sure, you want to duplicate of "
                {allData?.NameOfSimulation}" ?{" "}
              </p>
              <button
                type="button"
                className={`btn btn-danger ${cx.CancelBtn}`}
                onClick={() => setDuplicate(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`btn bg-primary text-white`}
                onClick={() => {
                  duplicateSimulation();
                  setDuplicate(false);
                }}
              >
                {" "}
                Ok
              </button>
            </Col>
          </Modal.Body>
        </Modal>
      </section>
      <Footer />
    </>
  );
};

export default ViewSimulation;
