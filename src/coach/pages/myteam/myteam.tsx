import * as React from "react";
import Box from "@mui/material/Box";
import { Card, Row, Col } from "react-bootstrap";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import Sidebar from "../../../components/sidebar/Sidebar";
import cx from "../../../admin.style.module.scss";
import lx from "./Myteam.module.scss";
import table from "../../../datatable.module.scss";
import DataTable, { Alignment } from "react-data-table-component";
import { NavLink, useHistory } from "react-router-dom";
import { BiFilterAlt } from "react-icons/bi";
import { FiSearch, FiUpload } from "react-icons/fi";
import ReactLoading from "react-loading";
import ProgressBar from "react-bootstrap/ProgressBar";
import { useState } from "react";
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
    name: "Sr. No.",
    selector: (row: any) => row.col1,
    sortable: true,
    width: "100px",
  },
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
    selector: (row: any) => row.col4.join(", "),
    sortable: true,
  },
  {
    name: "Progress",
    selector: (row: any) => row.col5,
    sortable: true,
    cell: (row:any) => (
      <div className={`${lx.currentPrecent}`}>
        <div className="d-flex align-items-center">
          <ProgressBar now={row?.col5} /> <span className="ms-2">{row.col5}</span>
        </div>
      </div>
    ),
  },
];

export default function Myteam() {
  const [filterText, setFilterText] = React.useState("");

  const { isLoading, error, sendRequest } = useHttp();
  const [value, setValue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const localData: any = localStorage.getItem("data");
  const parseData: any = JSON.parse(localData);
  const history = useHistory();
  React.useEffect(() => {
    allTeam();
  }, []);

  const filteredItems = value.filter(
    (item) =>
      item.col2 && item.col2.toLowerCase().includes(filterText.toLowerCase())
  );

  const getTeam = (data: any) => {
    const team: any[] = [];
    data?.map((item: any, index: number) => {
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
        col1: `${index + 1}`,
        col2: item?.Simulation?.NameOfSimulation,
        col3: item?.teamName,
        col4: item?.students?.map(
          (party: any) => `${party.firstName} ${party.lastName}`
        ),
        col5: Math.round((completedStep/totalStep)*100),
        col6: item?.addSimulation,
      });
    });
    setValue(team);
    setLoading(false);
  };

  const allTeam = () => {
    sendRequest(
      {
        url: `${process.env.REACT_APP_STUDENT_BASEURL}/get_couch_team?couch=${parseData._id}`,
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      },
      getTeam
    );
  };
  const onRowClicked = (row: any) => {
    history.push(`/coach/manage-team/${row.col6}`);
  };
  const subHeaderComponentMemo = React.useMemo(() => {
    return (
      <>
        <div className={`${table.searchBox}`}>
          <FiSearch className={`${table.searchIcon}`} />
          <input
            className="form-control"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
        <div className={`${table.tableFilterIcons} ${lx.tableFilterIcons2}`}>
          <NavLink to="#">
            <BiFilterAlt />
          </NavLink>
          <NavLink to="#">
            <FiUpload />
          </NavLink>
        </div>
      </>
    );
  }, [filterText]);

  return (
    <>
      <Header title="My Teams" />
      <Sidebar />
      <section className={`${cx.pageWrapper}`}>
        <Card>
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
                    ></Col>
                  </Row>
                </div>
                {loading ? (
                  <div className="d-flex justify-content-center">
                    <ReactLoading type="cylon" color="blue" />{" "}
                  </div>
                ) :
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
                    onRowClicked={onRowClicked}
                    //   expandableRows
                    //   expandableRowsComponent={ExpandedComponent}
                  />{" "}
                </Box>
}
              </div>
            </Card.Text>
          </Card.Body>
        </Card>
      </section>
      <Footer />
    </>
  );
}
