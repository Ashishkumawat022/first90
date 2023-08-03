import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import Sidebar from "../../../components/sidebar/Sidebar";
import cx from "../../../admin.style.module.scss";
import lx from "./Manage_team.module.scss";
import { NavLink, useHistory, useLocation, useParams } from "react-router-dom";
import table from "../../../datatable.module.scss";

import { FiUser } from "react-icons/fi";
import { FiMail } from "react-icons/fi";
import { FiSearch } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import {
  Card,
  Col,
  Row,
  Form,
  InputGroup,
  FormControl,
  Dropdown,
} from "react-bootstrap";
import DataTable, { Alignment } from "react-data-table-component";
import useHttp from "../../../hooks/use-https";

const customStyles = {
  rows: {
    style: {
      minHeight: "55px", // override the row height
    },
  },
  headCells: {
    style: {
      paddingLeft: "8px", // override the cell padding for head cells
      paddingRight: "8px",
    },
  },
  cells: {
    style: {
      paddingLeft: "8px", // override the cell padding for data cells
      paddingRight: "8px",
    },
  },
};

const columns = [
  {
    name: "Simulation Name",
    selector: (row: any) => row.col1,
    sortable: true,
    width: "350px",
  },
  {
    name: "Date Submitted",
    selector: (row: any) => row.col2,
    sortable: true,
    cell: (data: any) => {
      let date = new Date(data.col2).toLocaleString("en-us", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      return <p>{date}</p>;
    },
  },
  {
    name: "Status",
    selector: (row: any) => row.col3,
    sortable: true,
    cell: (data:any) => {
     return <button className="btnStatus active" style={{ background: "#34D399" }}>
       {data?.col3==="Completed" ? "Graded" : "Pending"}
      </button>
    },
  },
];

const ManageTeam = (props: any) => {
  const history: any = useHistory();
  const location: any = useLocation();

  const { sendRequest: teamRequest } = useHttp();
  const { sendRequest: teamMemberRequest } = useHttp();
  const { sendRequest: renameRequest } = useHttp();
  const { sendRequest: deleteRequest } = useHttp();
  const { sendRequest } = useHttp();

  const param: any = useParams();

  const [booleanState, setBooleanState] = useState(false);
  const [filterText, setFilterText] = React.useState("");
  const [options, setOptions] = useState<any>([]);
  const [teamData, setTeamData] = useState<any[]>([]);
  const [simulationData, setSimulationData] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [teamId, setTeamId] = useState("");
  const [change, setChange] = useState(true);
  const [simulationName, setSimulationName] = useState("");
  const [data, setData] = useState<any[]>([])
  useEffect(() => {
    getTeamById();
    getSimulation();
  }, []);

  useEffect(() => {
    getTeamById();
    setBooleanState(false);
  }, [booleanState]);

  const filteredItems = teamData.filter(
    (item) =>
      item.teamName &&
      item.teamName.toLowerCase().includes(filterText.toLowerCase())
  );

  const teamByIdResponse = (responseData: any) => {
    setTeamData(responseData.data);
    setTeamId(responseData.data[0]?._id);
    if (location.state?.data) {
      getTeamMembarByTeamId(location.state.data);
    } else {
      getTeamMembarByTeamId(responseData.data[0]?._id);
    }
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

  const teamMemberByTeamIdResponse = (responseData: any) => {
    let data = responseData?.data;
    setSimulationData(data);
    setSimulationName(data[0]?.addSimulation._id);
    setTitle(data[0]?.teamName);
    let action:any[] = []
    data[0]?.Simulation?.AddallModule?.map((item:any,index:number)=>{
      item?.addNewStepButtons[0]?.steps?.map((e:any,num:number)=>{
        e?.actions?.map((a:any,number:number)=>{
          if(a?.content?.submitTime && a.content.submitTime !== "" ){
          action.push({
            id: a?.id,
            col1: a?.actionValue,
            col2: a?.content?.submitTime,
            col3: a?.content?.completeStatus
          })
        }
        })
      })
    })
    setData(action)
  };

  const getTeamMembarByTeamId = (id: any) => {
    teamMemberRequest(
      {
        url: `${process.env.REACT_APP_BASEURL}/TeamData?id=${id}`,
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token"),
          "content-type": "application/json",
        },
      },
      teamMemberByTeamIdResponse
    );
  };

  const renameTeamData = (responseData: any) => {
    getTeamById();
    getTeamMembarByTeamId(teamId);
  };

  const renameTeamname = () => {
    let data = JSON.stringify({
      id: simulationData[0]?.couchId._id,
      teamName: title,
    });

    renameRequest(
      {
        url: `${process.env.REACT_APP_BASEURL}/RenameteamName`,
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
          "content-type": "application/json",
        },
        body: data,
      },
      renameTeamData
    );
  };

  const deleteTeamMember = (responseData: any) => {
    getTeamMembarByTeamId(teamId);
  };

  const deleteTeamparticipant = (id: any) => {
    deleteRequest(
      {
        url: `${process.env.REACT_APP_BASEURL}/DeleteTeamMember?id=${id}`,
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
          "content-type": "application/json",
        },
      },
      deleteTeamMember
    );
  };

  let simulationOptions: any[] = [];

  const SimulationList = (data: any) => {
    data.data.map((item: any) => {
      simulationOptions.push({ value: item._id, label: item.NameOfSimulation });
    });
    setOptions(simulationOptions);
  };

  // Get api for Select Simulation //

  const getSimulation = () => {
    sendRequest(
      {
        url: `${process.env.REACT_APP_BASEURL}/GetliveSimulations`,
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      },
      SimulationList
    );
  };

  return (
    <>
      <Header title="Teams" />
      <Sidebar />
      <section className={`${cx.pageWrapper}`}>
        <Card>
          <Card.Title>
            Manage Teams - {simulationData[0]?.addSimulation.NameOfSimulation}
          </Card.Title>
          <Row>
            <Col md={12} lg={12} className={`text-end ${lx.dataTablBtns}`}>
              <NavLink to="/manage-team" className={`btn ${lx.btnW}`}>
                Invite Participant <FiUser />
              </NavLink>
              <NavLink to="/admin/create-team" className={`btn ${lx.btnT}`}>
                Create New Team +
              </NavLink>
            </Col>
          </Row>
          <Row className={`${lx.manageRow}`}>
            <Col md={12} lg={3} className={`${lx.sideList}`}>
              <Card>
                <Card.Body>
                  <Card.Text>
                    <Card.Title>Teams</Card.Title>
                    <div className={`${lx.searchBox}`}>
                      <FiSearch className={`${lx.searchIcon}`} />
                      <input
                        className="form-control"
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                      />
                    </div>
                  </Card.Text>
                  <ul>
                    {filteredItems.map((e: any, index: number) => {
                      return (
                        <li
                          key={index}
                          onClick={() => {
                            setTeamId(e._id);
                            getTeamMembarByTeamId(e._id);
                          }}
                        >
                          <h5>{e.teamName}</h5>
                          <p>{e?.students?.length} Participants</p>
                        </li>
                      );
                    })}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
            <Col md={12} lg={9} className={`${lx.sideBody}`}>
              <Card>
                <Card.Body>
                  <Card.Text>
                    <Row>
                      <Form.Group
                        className={`col-lg-12 col-xl-6 mb-2 ${cx.formBox} ${lx.formBox}`}
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>Team Name</Form.Label>
                        <InputGroup>
                          <FormControl
                            placeholder="Team Kaiz"
                            defaultValue={title}
                            disabled={change == true ? true : false}
                            onChange={(e: any) => {
                              setTitle(e.target.value);
                            }}
                            aria-label="Name"
                            aria-describedby="basic-addon1"
                          />
                          <button
                            className="btn"
                            onClick={() => {
                              if (change == true) {
                                setChange(false);
                              } else {
                                renameTeamname();
                                setChange(true);
                              }
                            }}
                          >
                            Rename
                          </button>
                        </InputGroup>
                      </Form.Group>
                      <Form.Group
                        className={`col-lg-12 col-xl-6 mb-2 ${cx.formBox} ${lx.formBox}`}
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>Assigned Simulation</Form.Label>
                        <Form.Select
                          className="form-control"
                          aria-label="Default select example"
                          value={simulationName}
                          onChange={(e) => {
                            setSimulationName(e.target.value);
                            history.push({
                              pathname: `/admin/manage-team/${e.target.value}`,
                            });
                            setBooleanState(true);
                          }}
                        >
                          {options.map((item: any) => {
                            return (
                              <option key={item.value} value={item.value}>
                                {item.label}
                              </option>
                            );
                          })}
                        </Form.Select>
                      </Form.Group>
                    </Row>
                  </Card.Text>
                </Card.Body>
              </Card>

              <Card>
                <Card.Body>
                  <Card.Title>Team Submissions</Card.Title>
                  <Card.Text>
                    <div
                      className={`${table.dataTableBox} ${lx.dataTableBox2}`}
                    >
                      <Box sx={{ width: 1 }}>
                        <DataTable
                          columns={columns}
                          data={data}
                          subHeader
                          subHeaderAlign={Alignment.LEFT}
                          persistTableHead
                          customStyles={customStyles}
                          //   expandableRows
                          //   expandableRowsComponent={ExpandedComponent}
                        />{" "}
                      </Box>
                    </div>
                  </Card.Text>
                </Card.Body>
              </Card>

              <Card>
                <Card.Body>
                  <Card.Text>
                    <div className="table-responsive">
                      <table className={`table ${lx.simpleTable}`}>
                        <thead>
                          <tr>
                            <th style={{ width: "300px" }}>
                              Team Participants
                            </th>
                            <th style={{ width: "200px" }}>Status</th>
                            <th style={{ width: "300px" }}>Email Address</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {simulationData[0]?.students?.map(
                            (item: any, index: number) => {
                              return (
                                <tr>
                                  <td>
                                    {item.firstName} {item.lastName}
                                  </td>
                                  <td>
                                    <button className={`btn ${lx.active}`}>
                                      {" "}
                                      Active{" "}
                                    </button>
                                  </td>
                                  <td>{item.email}</td>
                                  <td>
                                    <div className={`${lx.actionIcon}`}>
                                      <span>
                                        <FiMail />
                                      </span>
                                      <span
                                        onClick={() =>
                                          deleteTeamparticipant(item._id)
                                        }
                                      >
                                        <AiOutlineDelete />
                                      </span>
                                    </div>
                                  </td>
                                </tr>
                              );
                            }
                          )}
                        </tbody>
                      </table>
                    </div>
                  </Card.Text>
                </Card.Body>
              </Card>

              <Card>
                <Card.Body>
                  <Card.Text>
                    <div className="table-responsive">
                      <table className={`table ${lx.simpleTable}`}>
                        <thead>
                          <tr>
                            <th style={{ width: "300px" }}>Coach</th>
                            <th style={{ width: "200px" }}>Status</th>
                            <th style={{ width: "300px" }}>Email Address</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              {simulationData[0]?.coach.coachFirstName}{" "}
                              {simulationData[0]?.coach.coachLastName}
                            </td>
                            <td>
                              <button className={`btn ${lx.active}`}>
                                {" "}
                                Active{" "}
                              </button>
                            </td>
                            <td>{simulationData[0]?.coach.coachEmail}</td>
                            <td>
                              <div className={`${lx.actionIcon}`}>
                                <span>
                                  <FiMail />
                                </span>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card>
      </section>
      <Footer />
    </>
  );
};

export default ManageTeam;
