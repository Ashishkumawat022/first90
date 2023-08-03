import * as React from "react";
import Box from "@mui/material/Box";
import { Card, Dropdown, Row, Col, Modal } from "react-bootstrap";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import Sidebar from "../../../components/sidebar/Sidebar";
import tx from "./simulation.module.scss";
import cx from "../../../admin.style.module.scss";
import table from "../../../datatable.module.scss";
import DataTable, { Alignment } from "react-data-table-component";
import { FiMoreHorizontal } from "react-icons/fi";
import { FiSearch } from "react-icons/fi";
import { NavLink, useHistory } from "react-router-dom";
import useHttp from "../../../hooks/use-https";
import { useEffect, useState } from "react";
import { FiHome, FiEdit, FiUpload } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import ReactLoading from "react-loading";

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

export default function Simulation() {
  let history = useHistory();

  const { sendRequest: request } = useHttp();
  const { sendRequest: archiveRequest } = useHttp();

  const [loading, setLoading] = useState(true);
  const [confirmArchive, setConfirmArchive] = useState(false);
  const [confirmPublish, setConfirmPublish] = useState(false);
  const [rowData, setRowData] = useState<any>();

  const simulationStatus = (responseData: any) => {
    allSimulation();
  };

  const liveSimulation = (id: any) => {
    request(
      {
        url: `${process.env.REACT_APP_BASEURL}/simulationModelStatus?id=${id}`,
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
          "content-type": "application/json",
        },
      },
      simulationStatus
    );
  };

  const simulationArchiveStatus = (responseData: any) => {
    allSimulation();
  };

  const archiveSimulation = (id: any) => {
    archiveRequest(
      {
        url: `${process.env.REACT_APP_BASEURL}/Arkivestatus?id=${id}`,
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
          "content-type": "application/json",
        },
      },
      simulationArchiveStatus
    );
  };

  const simulationUnarchiveStatus = (responseData: any) => {
    allSimulation();
    setCheck(false);
  };

  const unarchiveSimulation = (id: any) => {
    request(
      {
        url: `${process.env.REACT_APP_BASEURL}/UnArchived?id=${id}`,
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
          "content-type": "application/json",
        },
      },
      simulationUnarchiveStatus
    );
  };

  const columns = [
    {
      name: "Simulation Name",
      selector: (row: any) => row.NameOfSimulation,
      sortable: true,
    },
    {
      name: "Date Created",
      selector: (row: any) => row.createdAt,
      sortable: true,
      cell: (data: any) => {
        let date = new Date(data.createdAt).toLocaleString("en-us", {
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
      name: "Date Modified",
      selector: (row: any) => row.updatedAt,
      sortable: true,
      cell: (data: any) => {
        let date = new Date(data.updatedAt).toLocaleString("en-us", {
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
      selector: (row: any) => row.status,
      sortable: true,
      cell: (data: any) => {
        const status = data.status;
        const capitalizeStatus =
          status.charAt(0).toUpperCase() + status.slice(1);
        return data.status == "draft" || data.status == "Archive" ? (
          data.status == "draft" ? (
            <button className="btnStatus draft">{capitalizeStatus}</button>
          ) : (
            <button className="btnStatus draft">{capitalizeStatus}d</button>
          )
        ) : (
          <button
            className="btnStatus draft"
            style={{ backgroundColor: "green" }}
          >
            {capitalizeStatus}
          </button>
        );
      },
      width: "100px",
    },
    {
      name: "",
      sortable: true,
      cell: (row: any) => (
        <div className={`${table.action}`}>
          <Dropdown className={`${tx.dropdownAction}`}>
            <Dropdown.Toggle id="dropdown-basic">
              <FiMoreHorizontal className={`${table.more}`} />
            </Dropdown.Toggle>

            {row.status == "live" ? (
              <Dropdown.Menu>
                <NavLink to={`/admin/view-simulation/${row._id}`}>
                  <FiHome /> Open Home
                </NavLink>
                <NavLink
                  to="#"
                  onClick={() => {
                    setConfirmArchive(true);
                    setRowData(row);
                  }}
                >
                  <AiOutlineDelete /> Archive Simulation
                </NavLink>
                <NavLink to={`/admin/participant-view/${row._id}`}>
                  <FiEdit /> View Master
                </NavLink>
              </Dropdown.Menu>
            ) : row.status == "draft" ? (
              <Dropdown.Menu>
                <NavLink to={`/admin/view-simulation/${row._id}`}>
                  <FiHome /> Open Home
                </NavLink>
                <NavLink to={`/admin/edit-simulation/${row._id}`}>
                  <FiEdit /> Edit Master
                </NavLink>
                <NavLink
                  to="#"
                  onClick={() => {
                    setConfirmArchive(true);
                    setRowData(row);
                  }}
                >
                  <AiOutlineDelete /> Archive Simulation
                </NavLink>
                <NavLink
                  to="#"
                  onClick={() => {
                    setConfirmPublish(true);
                    setRowData(row);
                  }}
                >
                  <FiUpload /> Publish Draft
                </NavLink>
              </Dropdown.Menu>
            ) : row.status == "Archive" ? (
              <Dropdown.Menu>
                <NavLink to={`/admin/view-simulation/${row._id}`}>
                  <FiHome /> Open Home
                </NavLink>
                <NavLink
                  to="#"
                  onClick={() => {
                    unarchiveSimulation(row._id);
                  }}
                >
                  <AiOutlineDelete /> Unarchive Simulation
                </NavLink>
                <NavLink to={`/admin/participant-view/${row._id}`}>
                  <FiEdit /> View Master
                </NavLink>
              </Dropdown.Menu>
            ) : (
              ""
            )}
          </Dropdown>
        </div>
      ),
      width: "100px",
    },
  ];

  const onRowClicked = (row: any) => {
    history.push(`/admin/view-simulation/${row._id}`);
  };

  const { isLoading, error, sendRequest } = useHttp();
  const [data, setData] = useState<any[]>([]);
  const [status, setStatus] = useState<any[]>([]);
  const [arch, setArch] = useState<any[]>([]);
  const [filterText, setFilterText] = useState("");
  const [check, setCheck] = useState(false);
  const [all, setAll] = useState<any[]>([]);

  const getSimulation = (data: any) => {
    let value: any[] = [];
    let archive: any[] = [];
    data.data.map((item: any) => {
      if (item.status == "draft" || item.status == "live") {
        value.push(item);
      }
      if (item.status == "Archive") {
        archive.push(item);
      }
    });
    setArch(archive);
    setStatus(value);
    setData(value);
    setAll(data.data);
    setLoading(false);
  };

  const allSimulation = () => {
    sendRequest(
      {
        url: `${process.env.REACT_APP_BASEURL}/getSimulation`,
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      },
      getSimulation
    );
  };

  useEffect(() => {
    allSimulation();
  }, []);

  const subHeaderComponentMemo = React.useMemo(() => {
    return (
      <div className={`${table.searchBox}`}>
        <FiSearch className={`${table.searchIcon}`} />
        <input
          className="form-control"
          value={filterText}
          onChange={(e) => {
            setFilterText(e.target.value);
            let searchData: any = all.filter(
              (a: any) => a.NameOfSimulation == e.target.value
            );
            if (searchData.length > 0) {
              setData(searchData);
            } else if (e.target.value == "") {
              allSimulation();
            } else {
              return;
            }
          }}
        />
      </div>
    );
  }, [filterText]);

  const showArchived = (e: any) => {
    setCheck(e.target.checked);
    if (e.target.checked == true) {
      setData(arch);
    } else {
      setData(status);
    }
  };

  return (
    <>
      <Header title="Simulations" />
      <Sidebar />
      <section className={`${cx.pageWrapper}`}>
        <Card>
          <Card.Title>Simulations</Card.Title>
          <Card.Body>
            <Card.Text>
              <div className={`${table.dataTableBox}`}>
                <div className={`${table.dataTablBtns}`}>
                  <Row>
                    <Col md={6} lg={6} className={`${table.dataTablBtnsLeft}`}>
                      <label className={`${cx.checkbox}`}>
                        <input
                          type="checkbox"
                          checked={check}
                          onClick={(e) => showArchived(e)}
                          id="box"
                        />
                        <span className={`${cx.checkmark}`}></span>
                        Show Archived Simulations
                      </label>
                    </Col>
                    <Col
                      md={6}
                      lg={6}
                      className={`text-end ${table.dataTablBtnsRight}`}
                    >
                      <NavLink
                        to="/admin/create-simulation"
                        className={`btn ${table.btnT}`}
                      >
                        Create New Simulation +
                      </NavLink>
                    </Col>
                  </Row>
                </div>
                {loading ? (
                  <div className="d-flex justify-content-center">
                    <ReactLoading type="cylon" color="blue" />{" "}
                  </div>
                ) : (
                  <Box sx={{ width: 1 }}>
                    <DataTable
                      columns={columns}
                      data={data}
                      subHeader
                      subHeaderAlign={Alignment.LEFT}
                      persistTableHead
                      subHeaderComponent={subHeaderComponentMemo}
                      pagination
                      customStyles={customStyles}
                      onRowClicked={onRowClicked}
                      //   expandableRows
                      //   expandableRowsComponent={ExpandedComponent}
                    />{" "}
                  </Box>
                )}
              </div>
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
                You are about to archive "{rowData?.NameOfSimulation}". You will
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
                  archiveSimulation(rowData._id);
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
          show={confirmPublish}
          onHide={() => setConfirmPublish(false)}
          centered
        >
          <Modal.Body>
            <Col lg={12}>
              You are about to publish "{rowData?.NameOfSimulation}". Once you
              publish this simulation, you will only be able to view (not edit)
              it. To make edits to the master version, make a copy of the
              simulation and edit that instead
              <button
                type="button"
                className={`btn btn-danger ${cx.CancelBtn}`}
                onClick={() => setConfirmPublish(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`btn bg-primary text-white`}
                onClick={() => {
                  liveSimulation(rowData._id);
                  setConfirmPublish(false);
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
}
