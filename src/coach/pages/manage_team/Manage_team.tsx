import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import Sidebar from "../../../components/sidebar/Sidebar";
import cx from "../../../admin.style.module.scss";
import lx from "./Manage_team.module.scss";
import { NavLink, useParams } from "react-router-dom";
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
  const [filterText, setFilterText] = React.useState("");
  const [teamData, setTeamData] = useState<any[]>([]);
  const [studentData, setStudentData] = useState<any>();
  const [data, setData] = useState<any[]>([]);
  const { isLoading, error, sendRequest } = useHttp();
  const param:any = useParams();
  const filteredItems = teamData.filter(
    (item) =>
      item?.teamName && item?.teamName.toLowerCase().includes(filterText.toLowerCase())
  );
  const localData: any = localStorage.getItem("data");
  const parseData: any = JSON.parse(localData);
  const getTeam = (data: any) => {
   let allTeams:any[] = []
   data?.map((item:any)=>{
    allTeams.push({
      id: item?._id,
      teamName: item?.teamName,
      studentsLength: item?.students?.length,
      students: item?.students,
      simulation: item?.Simulation?.AddallModule
    })
   })
   setTeamData(allTeams)
   setStudentData({
    students: allTeams[0]?.students,
    teamName: allTeams[0]?.teamName,
    simulation: allTeams[0]?.simulation,
  })
  };

  useEffect(()=>{
    if(studentData?.simulation){
      let action:any[] = []
      studentData?.simulation?.map((item:any,index:number)=>{
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
    }
  },[studentData])

  const getSimulationTeam = () => {
    sendRequest(
      {
        url: `${process.env.REACT_APP_STUDENT_BASEURL}/get_couch_team_detils?couch=${parseData?._id}&addSimulation=${param?.id}`,
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      },
      getTeam
    );
  };
 
  useEffect(()=>{
    getSimulationTeam();
  },[])
  return (
    <>
      <Header title="Teams" />
      <Sidebar />
      <section className={`${cx.pageWrapper}`}>
        <Card>
          <Card.Title>Manage Teams</Card.Title>
          <Row className={`${lx.manageRow}`}>
            <Col md={12} lg={3} className={`${lx.sideList}`}>
              <Card>
                <Card.Body>
                  <Card.Text>
                    <Card.Title>Teams</Card.Title>
                    <div className={`${lx.searchBox}`}>
                      <FiSearch className={`${lx.searchIcon}`} />
                      <input className="form-control"  value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}/>
                    </div>
                  </Card.Text>
                  {
                    filteredItems?.map((item:any,index:number)=>{
                      return <ul key={item?.id}>
                      <li onClick={()=>{
                        setStudentData({
                          students: item?.students,
                          teamName: item?.teamName,
                          simulation: item?.simulation
                        })
                      }}>
                        <h5>{item?.teamName}</h5>
                        <p>{item?.studentsLength} Participant</p>
                      </li>
                    </ul>
                    })
                  }
                  
                </Card.Body>
              </Card>
            </Col>
            <Col md={12} lg={9} className={`${lx.sideBody}`}>
              <Card>
                <Card.Body>
                  <Card.Text>
                    <Row>
                      {
                        studentData?.students?.map((item:any,index:number)=>{
                           return <Form.Group
                           className={`col-lg-4 col-xl-4 mb-2 ${cx.formBox} ${lx.formBox}`}
                           controlId="exampleForm.ControlInput1"
                         >
                           <Form.Label>{item?.firstName} {item?.lastName}</Form.Label>
                           <InputGroup>
                             <p className="mb-0">{studentData?.teamName}</p>
                           </InputGroup>
                         </Form.Group>
                        })
                      }
                      
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
            </Col>
          </Row>
        </Card>
      </section>
      <Footer />
    </>
  );
};

export default ManageTeam;
