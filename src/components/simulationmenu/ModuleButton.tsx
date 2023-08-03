import React, { useEffect, useState } from "react";
import adminclasses from "./Simulationmenu.module.scss";
import studentclasses from "../../participant.style.module.scss";
import coachclasses from "../../coach.style.module.scss";
import { useSelector, useDispatch } from "react-redux";
import {
  incrementModule,
  changeDivUrl,
  changeValue,
  changeCheck,
  changeStepValue,
  deleteModule,
  deleteSteps,
  counting,
  moduleToPush,
  moduleFromIndex,
  changeStepAdd,
  changeValueForD,
  changeValueForStep,
} from "../../reduxToolkit/reducers/moduleButtonReducer";
import Steps from "./Steps";
import { moduleArray } from "../../reduxToolkit/reducers/moduleButtonReducer";
import { useHistory } from "react-router-dom";
import { AiOutlineDelete } from "react-icons/ai";
import { Modal } from "react-bootstrap";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import { Col } from "react-bootstrap";

// a little function to help us with reordering the result
const reorder = (list: any, startIndex: any, endIndex: any) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return resetDisplayPositions(result);
};

const resetDisplayPositions = (list: any) => {
  const resetList = list.map((c: any, index: any) => {
    const slide = c;
    slide.displayPosition = index + 1;
    return slide;
  });
  return resetList;
};

const ModuleButton = (props: any) => {
  const moduleCount = counting;
  let stepData = useSelector((state: any) => state.moduleButtonReducer.data);
  let boolVal = useSelector((state: any) => state.moduleButtonReducer.bool);
  const stepAdd = useSelector((state:any)=> state.moduleButtonReducer.stepAdd);
  const moduleCheck = useSelector(
    (state: any) => state.moduleButtonReducer.check
  );

  const [disable, setDisable] = useState(false);

  const dispatch = useDispatch();

  let cx = adminclasses;
  if (window.location.pathname.includes("/admin")) {
    cx = adminclasses;
  } else if (window.location.pathname.includes("/participant")) {
    cx = studentclasses;
  } else if (window.location.pathname.includes("/coach")) {
    cx = coachclasses;
  }

  useEffect(() => {
    if (window.location.pathname.includes("/admin/participant-view")) {
      setDisable(true);
    }
  }, []);

  const [items, setItems] = useState<any[]>([]);
  const [deletedData, setDeletedData] = useState<any>({
    id: "",
    index: "",
    title: "",
  });
  const [stepDeletedData, setStepDeletedData] = useState<any>({});
  const [show, setShow] = useState(false);
  const [moduleShow, setModuleShow] = useState(false);
  const [moduleIdToPush,setModuleIdToPush] = useState<string>("")
  const showDelete = () => {
    setModuleShow(true);
  };

  const stepDeletion = (
    id: any,
    sid: any,
    index: number,
    title: any,
    moduleTitle: any,
    item:any,
  ) => {
    setStepDeletedData({
      id: id,
      sid: sid,
      index: index,
      title: title,
      moduleTitle: moduleTitle,
      item:item
    });
    setModuleIdToPush(id)
    setDeletedData({
      id: "",
      index: "",
      title: "",
    });
  };
  useEffect(() => {
    setItems(moduleArray);
  }, [moduleCount, stepData, boolVal, moduleCheck]);
  
  const onDragEnd = (result: any) => {
    setValuesAll({
      id: "",
    });
    setModuleShow(false);
    if (!result.destination) {
      return;
    }

    dispatch(changeCheck());

    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;
    if (result.type === "droppableItem") {
      const piece = reorder(items, sourceIndex, destIndex);
      if (moduleArray != null) {
        moduleArray.splice(0, moduleArray.length, ...piece);
      }
      setItems(piece);
    } else if (result.type === "droppableSubItem") {
      const itemSubItemMap = items.reduce((acc: any, item: any) => {
        acc[item.id] = item.addNewStepButtons[0].steps;
        return acc;
      }, {});

      const sourceParentId = result.source.droppableId;
      const destParentId = result.destination.droppableId;
      const sourceSubItems = itemSubItemMap[sourceParentId];
      const destSubItems = itemSubItemMap[destParentId];
      let newItems = [...items];

      /** In this case subItems are reOrdered inside same Parent */
      if (sourceParentId === destParentId) {
        const reorderedSubItems = reorder(
          sourceSubItems,
          sourceIndex,
          destIndex
        );
        newItems = newItems.map((item) => {
          if (item.id === sourceParentId) {
            item.addNewStepButtons[0].steps = reorderedSubItems;
          }
          return item;
        });
        setItems(newItems);
      } else {
        let date = new Date();
        let time = date.getTime();
        let newSourceSubItems = [...sourceSubItems];
        const [draggedItem] = newSourceSubItems.splice(sourceIndex, 1);
        draggedItem.id = `${destParentId}sb1s${time}`;
        draggedItem.content = `Step${destSubItems.length + 1}`;
        let newDestSubItems = [...destSubItems];
        newDestSubItems.splice(destIndex, 0, draggedItem);
        newItems = newItems.map((item) => {
          if (item.id === sourceParentId) {
            item.addNewStepButtons[0].steps = newSourceSubItems;
          } else if (item.id === destParentId) {
            item.addNewStepButtons[0].steps = newDestSubItems;
            item.addNewStepButtons[0].stepCount += 1;
            let active = item.addNewStepButtons[0].steps.filter(
              (e: any) => e.id == `${destParentId}sb1s${time}`
            );
            dispatch(changeStepValue(active[0]));
            dispatch(changeDivUrl(`${destParentId}sb1s${time}`));
          }
          return item;
        });
        setItems(newItems);
      }
    } else if (result.type === "droppableActItem") {
      let array: any[] = [];
      items.map((item: any) => {
        array = [...array, item.addNewStepButtons[0].steps];
      });

      let mapMethod = array.flat();

      const itemSubItemMap = mapMethod.reduce((acc: any, item: any) => {
        acc[item.id] = item.actions;
        return acc;
      }, {});

      const sourceParentId = result.source.droppableId;
      const destParentId = result.destination.droppableId;
      const sourceSubItems = itemSubItemMap[sourceParentId];
      const destSubItems = itemSubItemMap[destParentId];
      let newItems = [...items];

      /** In this case subItems are reOrdered inside same Parent */
      if (sourceParentId === destParentId) {
        const reorderedSubItems = reorder(
          sourceSubItems,
          sourceIndex,
          destIndex
        );
        newItems = newItems.map((e) => {
          e.addNewStepButtons[0].steps.map((item: any) => {
            if (item.id === sourceParentId) {
              item.actions = reorderedSubItems;
            }
            return item;
          });
          setItems(newItems);
        });
      } else {
        let date = new Date();
        let time = date.getTime();
        let newSourceSubItems = [...sourceSubItems];
        const [draggedItem] = newSourceSubItems.splice(sourceIndex, 1);
        draggedItem.id = `${destParentId}a${time}`;
        let newDestSubItems = [...destSubItems];
        newDestSubItems.splice(destIndex, 0, draggedItem);
        newItems = newItems.map((e) => {
          e.addNewStepButtons[0].steps.map((item: any) => {
            if (item.id === sourceParentId) {
              item.actions = newSourceSubItems;
            } else if (item.id === destParentId) {
              item.actions = newDestSubItems;
              item.actionCount += 1;
            }
            return item;
          });
          return e;
        });
        setItems(newItems);
      }
    }
  };

  const [valuesAll, setValuesAll] = useState({
    id: "",
  });
  const [indexNumber,setIndexNumber] = useState<number>(0)
  const onBeforeDragStart = (e: any) => {
    setValuesAll({
      id: e.draggableId,
    });
  };
  const getIndexOfSteps = (num:number) => {
    setIndexNumber(num)
  }
  useEffect(()=>{
    if(stepAdd>0){
      setModuleIdToPush("");
      dispatch(changeStepAdd());
      setStepDeletedData({});
    }
  },[stepAdd])
  
  const blankAllStates = () => {
    setValuesAll({
      id: ""
    });
    setStepDeletedData({});
     setModuleIdToPush("");
    setIndexNumber(0);
  }

  return (
    <>
      <ul className={`${cx.s2menuList}`}>
        <DragDropContext onDragEnd={onDragEnd} onBeforeDragStart={onBeforeDragStart}>
          <Droppable droppableId="droppable" type="droppableItem">
            {(provided, snapshot) => (
              <div ref={provided.innerRef}>
                {items.map((item: any, index: any) => (
                  <li
                    key={index}
                    className={`${item.value == true ? `${cx.active}` : ""}`}
                  >
                    <button
                      className={`btn ${cx.btnAfter}`}
                      type="button"
                      onMouseDown={() => {
                        setDeletedData({
                          id: item.id,
                          index: index,
                          title: item.title == "" ? item.content : item.title,
                        });
                        showDelete();
                      }}
                      onClick={() => {
                        dispatch(changeValue(item));
                        dispatch(
                          changeDivUrl(
                            `${item.addNewStepButtons[0].steps[0].id}`
                          )
                        );
                      }}
                     
                      onMouseEnter={() => {
                        if(stepDeletedData?.id!==undefined && stepDeletedData?.id!==""){
                          if (
                            valuesAll.id !== "" &&
                            valuesAll.id !== item.addNewStepButtons[0].steps[0].id
                          ) {
                            let data = {
                              id:stepDeletedData?.id,
                              item:item
                            }
                            dispatch(changeValueForD(data));
                          }
                        setModuleIdToPush(item.id)
                        }
                      }}
                      onMouseUp={()=>{
                        blankAllStates()
                        if(moduleIdToPush !== stepDeletedData?.id){
                          dispatch(changeValueForStep({id:moduleIdToPush}))
                          }
                      }}
                    >
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                        isDragDisabled={disable}
                      >
                        {(provided, snapshot) => (
                          <div>
                            <div
                              className={`${cx.moduleName}`}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              {item.title == "" ? item.content : item.title}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    </button>
                    <Steps
                      id={item.id}
                      type={item.id}
                      moduleTitle={item.title == "" ? item.content : item.title}
                      steps={item.addNewStepButtons[0].steps}
                      counting={item.addNewStepButtons[0].stepCount}
                      stepDeletedData={stepDeletion}
                      stepDeleted={stepDeletedData}
                      showDelete={showDelete}
                      getIndexOfSteps={getIndexOfSteps}
                      indexNumber={indexNumber}
                      moduleIdToPush={moduleIdToPush}
                      blankAllStates={blankAllStates}
                    />
                  </li>
                ))}
                {provided.placeholder}
                {window.location.pathname.includes(
                  "/admin/edit-simulation"
                ) && (
                  <Col lg={12} className="text-center">
                    <button
                      className={`btn ${cx.addNewModule}`}
                      onClick={() => {
                        dispatch(incrementModule(moduleCount));
                      }}
                    >
                      Add New Module
                    </button>

                    <Col
                      lg={12}
                      className={`${cx.deleteNew} text-center`}
                      onMouseUp={(e) => {
                        if (moduleShow == true) {
                          setShow(true);
                        }
                      }}
                    >
                      <span className={`${cx.modlueDelete}`}>
                        <AiOutlineDelete className={`${cx.icon}`} />
                      </span>
                      <strong>Drop to Delete</strong>
                    </Col>
                  </Col>
                )}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </ul>

      <Modal
        className={`${cx.DeletePopup}`}
        show={show}
        onHide={() => setShow(false)}
        centered
      >
        <Modal.Body>
          <Col lg={12}>
            {deletedData?.title != ""
              ? `Are you sure you want to delete this ${deletedData?.title} and it's Step?`
              : `Are you sure you want to delete this ${stepDeletedData?.title}?`}
            <br />
            <button
              type="button"
              className={`btn btn-danger ${cx.CancelBtn}`}
              onClick={() => {
                setShow(false);
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className={`btn bg-primary text-white`}
              onClick={() => {
                dispatch(deleteModule(deletedData));
                dispatch(deleteSteps(stepDeletedData));
                setDeletedData({
                  id: "",
                  index: "",
                  title: "",
                });
                setStepDeletedData({});
                setShow(false);
              }}
            >
              {" "}
              Delete
            </button>
          </Col>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ModuleButton;
