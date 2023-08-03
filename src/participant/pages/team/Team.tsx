import React, {useEffect} from "react";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import Sidebar from "../../../components/sidebar/Sidebar";
import cx from "../../../participant.style.module.scss";
import lx from "./Team.module.scss";
import { useState } from "react";
import { Card, Col, Row, Form } from "react-bootstrap";
import useHttp from "../../../hooks/use-https";
import { useParams } from "react-router-dom";
import userImage from "../../../images/user.jpg";
const Team = (props: any) => {
  let Ldata = localStorage.getItem("data")!;
  let localData = JSON.parse(Ldata)!;
  const [coachData, setCoachData] = useState<any>()
  const [studentData, setStudentData] = useState<any>()
  const param:any = useParams();
  const { sendRequest: teamMemberRequest } = useHttp();
  useEffect(()=>{
    getTeamMembarByTeamId(param?.id)
  },[])
  const teamMemberByTeamIdResponse = (responseData: any) => {
    setCoachData(responseData?.data[0].coach)
    setStudentData(responseData?.data[0].students)
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

  return (
    <>
      <Header title="Team" />
      <Sidebar />
      <section className={`${cx.pageWrapper}`}>
        <Card className={`${lx.restPassword}`}>
          <Card.Title>Your Coach</Card.Title>

          <Card.Body>
            <Card.Text>
              <Row className="align-items-center">
                <Col lg={12} className={`${lx.changePassword}`}>
                  <div className={`${lx.nameCoach}`}>
                    <div className={`${lx.coachImg}`}>
                      <img src={coachData?.addimage==="" ? userImage : coachData?.addimage} />
                      <h4>{coachData?.coachFirstName} {coachData?.coachLastName}</h4>
                      <h4 className={`${lx.emailColor}`}>{coachData?.coachEmail}</h4>
                    </div>
                    <p>{coachData?.Biography}</p>
                  </div>
                  <p className={`${lx.meetingPoint}`}>
                    Schedule a 1 on 1 meeting with “Name of Coach”
                  </p>
                </Col>
              </Row>
            </Card.Text>
          </Card.Body>

          <Card.Title>Your Team Members</Card.Title>
          <Card.Body>
            <Card.Text>
              <Row className="align-items-center">
                {
                  studentData?.map((item:any,index:number)=>{
                    return   <Col
                    key={index}
                    lg={6}
                    md={6}
                    sm={12}
                    className={` mt-3 mb-5 ${lx.changePassword}`}
                  >
                    <div className={`${lx.nameCoach}`}>
                      <div className={`${lx.coachImg}`}>
                        <img src={item?.addimage==="" ? userImage : item?.addimage} />
                        <h4>{item?.firstName} {item?.lastName} {item?._id===localData?._id ? "(You)" : ""}</h4>
                        <h4 className={`${lx.emailColor}`}>{item?.email}</h4>
                      </div>
                      <p>{item?.Biography}</p>
                    </div>
                  </Col>
                  })
                }
              </Row>
            </Card.Text>
          </Card.Body>
        </Card>
      </section>
      <Footer />
    </>
  );
};

export default Team;
