import React, { useEffect, useState } from "react";
import { HashRouter, NavLink } from "react-router-dom";
import adminclasses from "./Simulationmenu.module.scss";
import studentclasses from "../../participant.style.module.scss";
import coachclasses from "../../coach.style.module.scss";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useSelector, useDispatch } from 'react-redux';
import { changeDivUrl, moduleArray, stepButton, changeStepValue, counting, moduleFromIndex, deleteSteps, changeStepAdd, changeValue, changeValueForStep } from "../../reduxToolkit/reducers/moduleButtonReducer";
import { Draggable, Droppable } from 'react-beautiful-dnd';
import Actions from "./Actions";

const Steps = (props: any) => {
  const moduleCount = counting;
  const stepAdd = useSelector((state:any)=> state.moduleButtonReducer.stepAdd)
  const dispatch = useDispatch()
  const [disable, setDisable] = useState(false);
  const [dataSteps,setDataSteps] = useState("")

  useEffect(() => {
    if (window.location.pathname.includes("/admin/participant-view")) {
      setDisable(true);
    }
  }, [])
  useEffect(()=>{
    if(stepAdd>0){
      setDataSteps("")
      dispatch(changeStepAdd());
    }
  },[stepAdd])
  let cx = adminclasses;
  if (window.location.pathname.includes("/admin")) {
    cx = adminclasses;
  } else if (window.location.pathname.includes("/participant")) {
    cx = studentclasses;
  } else if (window.location.pathname.includes("/coach")) {
    cx = coachclasses;
  }

  const handleClickScroll = (e:any) => {
    const element = e
    if (element) {
      // 👇 Will scroll smoothly to the top of the next section
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    setItems(props.steps)
  }, [props.counting])

  return (
    <>
      <ul className={`${cx.first}`}>
        <HashRouter basename={`m${moduleCount}`} hashType="noslash">
          <Droppable droppableId={props.type} type={`droppableSubItem`} isDropDisabled={true}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  overflowX:"hidden",
                  overflowY:"auto"
                }}
              >
                {props.steps.map((item: any, index: number) => (
                  <li className={`${(item.value == true) ? `${cx.active}` : ''}`} style={props.moduleIdToPush!==""&&dataSteps===item?.id ? {paddingTop:"20px"} : {}}>
                   
                      <Draggable key={item.id} draggableId={item.id} index={index} isDragDisabled={disable}>
                        {(provided, snapshot) => (
                           <div  
                           onClick={() => {
                            props.stepDeletedData("", "", "", "")
                            dispatch(changeStepValue(item))
                            dispatch(changeDivUrl(item.id))
                          }}
                          onMouseEnter={()=>{
                            props.getIndexOfSteps(index)
                            setDataSteps(item?.id)
                          }}
                            onMouseUp={() => {
                              if(props?.stepDeleted?.item && props.moduleIdToPush!==""){
                                let data = {
                                  id : props.moduleIdToPush,
                                  index : props.indexNumber,
                                  item:props?.stepDeleted?.item
                               }
                               dispatch(deleteSteps(props?.stepDeleted));
                               dispatch(moduleFromIndex(data))
                               if(props.moduleIdToPush !== props?.stepDeleted?.id){
                               dispatch(changeValueForStep({id:props?.stepDeleted?.id}))
                               }
                               handleClickScroll(props?.stepDeleted?.id)
                              }
                              if(props.moduleIdToPush !== props?.stepDeleted?.id){
                                dispatch(changeValueForStep({id:props?.stepDeleted?.id}))
                                }
                              props.blankAllStates()
                              props.stepDeletedData("", "", "", "")
                              setDataSteps("")
                            }}
                            onMouseDown={() => {
                              props.stepDeletedData(props.id, item.id, index, item.title == "" ? item.content : item.title, props.moduleTitle, item, false)
                              props.showDelete()
                            }}>
                          <div
                          className={`${cx.menuName}`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          
                          <NavLink className="btn" to={`/${item.id}`}
                            >
                            
                              {item.title == "" ? item.content : item.title}
                         
                          </NavLink>
                          </div>
                          <Actions id={item.id} type={item.id} actions={item.actions} counting={item.actionCount} />
                          </div>
                        )}
                      </Draggable>
                  </li>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <li>
            <NavLink to={`/${props.id}sb1`} className={`${cx.addStepBtn}`} onClick={() => {
              let stepsundefinedId = props.steps.length == 0 ? `m${props.id}sb1s1` : props.steps[props.steps.length - 1].id
              let idData = {
                moduleId: props.id,
                stepsId: stepsundefinedId
              }
              dispatch(stepButton(idData))
            }}>

              {window.location.pathname.includes("/admin/edit-simulation") && (
                <div className={`${cx.menuName}`}>Add New Step <AiOutlinePlusCircle className={`${cx.icon}`} /></div>
              )}

            </NavLink>
          </li>
        </HashRouter>
      </ul>
    </>
  );
}


export default Steps;