import * as React from "react";
import Box from "@mui/material/Box";
import { Card, Row, Col } from "react-bootstrap";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import Sidebar from "../../../components/sidebar/Sidebar";
import cx from "../../../admin.style.module.scss";
import table from "../../../datatable.module.scss";
import DataTable, { Alignment } from "react-data-table-component";
import { FiSearch } from "react-icons/fi";
import { NavLink, useHistory } from "react-router-dom";
import useHttp from "../../../hooks/use-https";
import { useState } from "react";
import ReactLoading from "react-loading";
import ProgressBar from "react-bootstrap/ProgressBar";
import lx from "./Myteam.module.scss";

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
    selector: (row: any) => row.col2,
    sortable: true,
  },
  {
    name: "Team Name",
    selector: (row: any) => row.col3,
    sortable: true,
  },
  {
    name: "Team Members",
    sortable: true,
    cell: (row: any) => (
      <div>
        <span title={`${row.col4}`}>{row.col4.slice(0, 20)}...</span>
      </div>
    ),
  },
  {
    name: "Team Coach",
    selector: (row: any) => row.col5,
    sortable: true,
  },
  {
    name: "Progress",
    selector: (row: any) => row.col6,
    sortable: true,
    cell: (row:any) => (
      <div className={`${lx.currentPrecent}`}>
        <div className="d-flex align-items-center">
          <ProgressBar now={row.col6} /> <span className="ms-2">{row.col6}%</span>
        </div>
      </div>
    ),
  },
];

export default function Myteam() {
  const [filterText, setFilterText] = React.useState("");
  const [value, setValue] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  let history = useHistory();

  const filteredItems = value.filter(
    (item) =>
      item.col2 && item.col2.toLowerCase().includes(filterText.toLowerCase())
  );

  const subHeaderComponentMemo = React.useMemo(() => {
    return (
      <div className={`${table.searchBox}`}>
        <FiSearch className={`${table.searchIcon}`} />
        <input
          className="form-control"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>
    );
  }, [filterText]);

  const { isLoading, error, sendRequest } = useHttp();

  React.useEffect(() => {
    allTeam();
  }, []);

  const onRowClicked = (id: any, teamId: string) => {
    history.push({
      pathname: `/admin/manage-team/${id}`,
      state: {
        data: teamId,
      },
    });
  };

  const getTeam = (data: any) => {
    const team: any[] = [];
    data.data.map((item: any, index: number) => {
      let completedStep = 0;
      let totalStep = 0;
      item?.Simulation?.AddallModule?.map((e:any)=>{
        e?.addNewStepButtons[0]?.steps?.map((a:any)=>{
          if(a?.apiButton===1){
            completedStep += 1
            totalStep += 1
          }else{
            totalStep += 1
          }
        })
      })
      team.push({
        id: index,
        col1: `${index}`,
        col2: item?.addSimulation?.NameOfSimulation,
        col3: item?.teamName,
        col4: item?.students?.map(
          (party: any) => `${party?.firstName} ${party?.lastName}`
        ),
        col5: `${item?.coach?.coachFirstName} ${item?.coach?.coachLastName}`,
        col6: Math.round((completedStep/totalStep)*100),
        col7: item?.addSimulation?._id,
        col8: item._id,
      });
    });
    setValue(team);
    setLoading(false);
  };

  const allTeam = () => {
    sendRequest(
      {
        url: `${process.env.REACT_APP_BASEURL}/getTeam`,
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      },
      getTeam
    );
  };

  return (
    <>
      <Header title="Teams" />
      <Sidebar />
      <section className={`${cx.pageWrapper}`}>
        <Card>
          <Card.Title>Teams</Card.Title>
          <Card.Body>
            <Card.Text>
              <div className={`${table.dataTableBox}`}>
                <div className={`${table.dataTablBtns}`}>
                  <Row>
                    <Col
                      md={6}
                      lg={6}
                      className={`${table.dataTablBtnsLeft}`}
                    ></Col>
                    <Col
                      md={6}
                      lg={6}
                      className={`text-end ${table.dataTablBtnsRight}`}
                    >
                      <NavLink
                        to="/admin/create-team"
                        className={`btn ${table.btnT}`}
                      >
                        Create New Team +
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
                      data={filteredItems}
                      subHeader
                      subHeaderAlign={Alignment.LEFT}
                      persistTableHead
                      subHeaderComponent={subHeaderComponentMemo}
                      pagination
                      customStyles={customStyles}
                      onRowClicked={(e) => {
                        onRowClicked(e.col7, e.col8);
                      }}
                      //   expandableRows
                      //   expandableRowsComponent={ExpandedComponent}
                    />{" "}
                  </Box>
                )}
              </div>
            </Card.Text>
          </Card.Body>
        </Card>
      </section>
      <Footer />
    </>
  );
}
