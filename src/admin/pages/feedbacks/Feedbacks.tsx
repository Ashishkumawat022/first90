import React,{useEffect, useState} from "react";
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
import lx from "./Feedbacks.module.scss";
import useHttp from "../../../hooks/use-https";
import ReactLoading from "react-loading";
import { changeModuleArrayValue, feedbackTeamName } from "../../../reduxToolkit/reducers/moduleButtonReducer";
import { useDispatch } from "react-redux";

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


export default function Feedbacks() {
  const [filterText, setFilterText] = React.useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const history = useHistory();
  const dispatch = useDispatch();
  const columns = [
    {
      name: "Sr. No.",
      selector: (row: any) => row.col1,
      sortable: true,
      cell: (row:any,index:number) => (
        <p>
          {((pageNumber-1)*10) + (index + 1)}
        </p>
      ),
      width: "100px",
    },
    {
      name: "Simulation Name",
      selector: (row: any) => row.col2,
      sortable: true,
    },
    {
      name: "Task Name",
      selector: (row: any) => row.col3,
      sortable: true,
    },
    {
      name: "Team",
      selector: (row: any) => row.col4,
      sortable: true,
    },
    {
      name: "Date Submitted",
      selector: (row: any) => row.col5,
      sortable: true,
      cell: (data: any) => {
        let date = new Date(data.col5).toLocaleString("en-us", {
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
      selector: (row: any) => row.col6,
      sortable: true,
      cell: (row:any) => (
        <button className="btnStatus active" style={{ background: "#34D399" }}>
          {row.col6}
        </button>
      ),
    },
  ];
  const { isLoading, error, sendRequest } = useHttp();
  const [value, setValue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const localData: any = localStorage.getItem("data");
  const filteredItems = value.filter(
    (item:any) =>
      item.col2 && item.col2.toLowerCase().includes(filterText.toLowerCase())
  );
  const getTeam = (data: any) => {
    const perActionData:any[] = []
    data?.data?.map((item: any) => {
      item?.Simulation?.AddallModule?.map((e:any)=>{
        if(e?.addNewStepButtons){
        e?.addNewStepButtons[0]?.steps?.map((a:any)=>{
          a?.actions?.map((z:any, index: number) => {
            if(z?.content?.submitTime && z.content.submitTime !== "" ){
            perActionData.push({
              col1: `${index + 1}`,
        col2: item?.Simulation?.NameOfSimulation,
        col3: z?.actionValue,
        col4: item?.teamName,
        col5: z.content.submitTime,
        col6: z.content.completeStatus,
        col7: z.id,
        col8: item?.Simulation?.AddallModule,
        col9: item?._id
            })
          }
          })
        })}
      })
   });
   let ascending = perActionData.sort((a, b) => Number(a.col5) - Number(b.col5));
    setValue(ascending);
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
  useEffect(()=>{
    allTeam();
  },[])
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

  const onRowClicked = (row: any) => {
    history.push(`/admin/feedback-details/${row.col7}`);
    dispatch(changeModuleArrayValue(row.col8));
    dispatch(feedbackTeamName([row.col4, row.col9]))
    localStorage.setItem("teamId", JSON.stringify(row.col9));
  };

  const onChangePage = (page:number) => {
     setPageNumber(page)
  }

  return (
    <>
      <Header title="Feedback" />
      <Sidebar />
      <section className={`${cx.pageWrapper}`}>
        <Card>
          <Card.Title>All Submissions</Card.Title>
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
                    onChangePage = {onChangePage}
                    //   expandableRows
                    //   expandableRowsComponent={ExpandedComponent}
                  />{" "}
                </Box>
}
              </div>
            </Card.Text>
          </Card.Body>

          <Col className={`text-end mb-3 ${cx.submitActionBox}`}>
            <button className={`btn ${cx.submitBtn}`} onClick={()=>{
              const val = value.find((e:any)=>e.col6==="Pending")
               history.push(`/admin/feedback-details/${val.col7}`);
               dispatch(changeModuleArrayValue(val.col8));
               dispatch(feedbackTeamName([val.col4, val.col9]))
               localStorage.setItem("teamId", JSON.stringify(val.col9));
            }}>Begin Review</button>
          </Col>
        </Card>
      </section>
      <Footer />
    </>
  );
}
