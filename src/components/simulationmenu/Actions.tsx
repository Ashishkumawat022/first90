import React, { useEffect, useState } from "react";
import { HashRouter, NavLink } from "react-router-dom";
import adminclasses from "./Simulationmenu.module.scss";
import studentclasses from "../../participant.style.module.scss";
import coachclasses from "../../coach.style.module.scss";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useSelector, useDispatch } from 'react-redux';
import { changeDivUrl, moduleArray, stepButton } from "../../reduxToolkit/reducers/moduleButtonReducer";
import { DragDropContext, Draggable, Droppable, DroppableStateSnapshot } from 'react-beautiful-dnd';
import { Tooltip, OverlayTrigger } from "react-bootstrap";

const Actions = (props: any) => {
  const stepCount = useSelector((state: any) => state.moduleButtonReducer.count)
  const dispatch = useDispatch()

  const [disable, setDisable] = useState(false);

  useEffect(() => {
    if (window.location.pathname.includes("/admin/participant-view")) {
      setDisable(true);
    }
  }, [])

  let cx = adminclasses;
  if (window.location.pathname.includes("/admin")) {
    cx = adminclasses;
  } else if (window.location.pathname.includes("/participant")) {
    cx = studentclasses;
  } else if (window.location.pathname.includes("/coach")) {
    cx = coachclasses;
  }

  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    setItems(props.actions)
  }, [props.counting])



  return (
    <>
      <ul className={`${cx.step2}`}>
        <HashRouter basename={`m${stepCount}`} hashType="noslash">
          <Droppable droppableId={props.type} type={`droppableActItem`}>
            {(provided, snapshot) => (
              <li
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {props.actions.map((item: any, index: number) => (
                  <Draggable key={item.id} draggableId={item.id} index={index} isDragDisabled={disable}>
                    {(provided, snapshot) => (
                       <a href={`#${item.id}`}>
                      <OverlayTrigger
                        overlay={
                          <Tooltip id="tooltip-disabled">
                            {item.content.title}
                          </Tooltip>
                        }
                      >
                        <div
                          className={`${cx.menuName}`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {item.actionValue}
                        </div>
                      </OverlayTrigger>
                     </a>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </li>
            )}
          </Droppable>
        </HashRouter>
      </ul>
    </>
  );
}


export default Actions;