import React, { useEffect, useState } from "react";
import { HashRouter, NavLink, useHistory, useParams } from "react-router-dom";
import cx from "./Simulationmenu.module.scss";

import { AiOutlinePlusCircle } from "react-icons/ai";
import { useContext } from "react";
import GlobalContext from "../../store/global-context";
import { AiOutlineDelete } from "react-icons/ai";


import { Col } from "react-bootstrap";
import { changeDivUrl, changeSidebar, changeStepValue, changeValue, counting, sendToNextStep } from "../../reduxToolkit/reducers/moduleButtonReducer";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

const Simulationmenu = (props: any) => {
  const moduleCount = counting;
  let boolVal = useSelector((state: any) => state.moduleButtonReducer)
  const dispatch = useDispatch();
  const [state, setState] = useState<any>();
  const [showSidebar, setShowSidebar] = useState({
    isShow: false,
    id:""
  })

  useEffect(()=>{
    setState(props.simulationData)
  },[props.simulationData])

  return (
    <>
      <Col lg={3} className="mb-4">

        <div className={`${cx.MenuBodyS2}`}>

          <h5><span>«  </span>  Simulation</h5>

          <h6>Participant Mode</h6>
          <p>Hello, you’re viewing the participant mode!</p>

          <ul className={`${cx.s2menuList}`}>
          {
            state?.map((item:any, index:number)=>{
              return  <li className={`${(item.value == true) ? `${cx.active}` : ''}`}>
              <button className="btn" type="button" onClick={() => {
                 setShowSidebar({
                  id:item?.id,
                  isShow: true ? false : true
                })
                item.value = !item.value
                if(item?.disabled===false){
                        dispatch(changeDivUrl(`${item.addNewStepButtons[0].steps[0].id}`))
                      }}
                    }>
                <div className={`${cx.menuName}`}>{item?.title || item?.content}</div>
              </button>
              <ul className={`${cx.first}`}>
                <HashRouter basename={`m${moduleCount}`} hashType="noslash">
                  {
                    item?.addNewStepButtons[0]?.steps?.map((e:any,num:number)=>{
                     return <li>
                      <NavLink to={e?.disabled===false ? `/${e.id}` : "#"} onClick={() => {
                        dispatch(sendToNextStep({
                          mid:index,
                          sid:num
                        }))
                        if(e?.disabled===false){
                            dispatch(changeStepValue(e))
                            dispatch(changeDivUrl(e.id))
                        }
                          }}>
                        <div className={`${cx.menuName}`}>{e?.title || e?.content}</div>
                      </NavLink>
                    </li>
                    })
                  }
                </HashRouter>
              </ul>
            </li>
            })
          }
          </ul>
        </div>
      </Col>
    </>
  );
};

export default Simulationmenu;
