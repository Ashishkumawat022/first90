import { createSlice } from "@reduxjs/toolkit";

export let initialState = {
  count: 1,
  stepCount: 1,
  feedCount: 1,
  feedResourceCount: 0,
  queCount: 1,
  value: "m1sb1s1",
  actionValue: "",
  actionCount: 0,
  mid: "",
  sid: "",
  actionId: "m1sb1s1a1",
  resourceId: "m1sb1s1r1",
  adviceId: "m1sb1s1ad1",
  data: "",
  bool: false,
  check: true,
  moduleChange: false,
  stepResourceValue: "",
  ResourceCount: 0,
  adviceCount: 0,
  stepAdd: 0,
  publish: 0,
  runSidebar: 0,
};

export const moduleState: any = [
  {
    id: "m1",
    content: "Module1",
    title: "",
    description: "",
    value: false,
    halfAction: true,
    completedStatus: 0,
    addNewStepButtons: [
      {
        id: "m1sb1",
        content: "StepButton1",
        value: false,
        disabled: false,
        stepCount: 1,
        steps: [
          {
            id: "m1sb1s1",
            content: "Step1",
            title: "",
            description: "",
            value: false,
            disabled: false,
            apiButton: 0,
            resourceNotify: true,
            displayPosition: 1,
            actionCount: 0,
            ResourceCount: 0,
            defaultAction: {
              id: `m1sb1s1a0`,
              content: "action1",
              value: false,
              actionValue: "",
            },
            adviceId: "m1sb1s1ad1",
            adviceCount: 0,
            actions: [],
            stepResources: [],
            adviceCollegues: [],
          },
        ],
      },
    ],
  },
];

export let moduleArray: any[] = moduleState;
export let moduleFirstArray: any[] = moduleState;
export let stepButtonArray: any[] = [];
export let counting: number = 1;
export let globalResource: any[] = [];
export let globalResourceCounting: number = 0;
export let imageCounting: number = 0;
export let simulationId: string = "";
export let teamNameForFeedback: string = "";
export let teamidForFeedback: string = "";
export let teamName: string = "";

const counterSlice = createSlice({
  name: "IncreseButtons",
  initialState: initialState,
  reducers: {
    incrementModule(state = initialState, action) {
      counting += 1;
      for (let i = counting; i <= counting; i++) {
        moduleArray.push({
          id: `m${i}`,
          content: `Module${i}`,
          title: `Module${i}`,
          description: "",
          value: false,
          disabled: true,
          halfAction: true,
          addNewStepButtons: [
            {
              id: `m${i}sb1`,
              content: "StepButton1",
              value: false,
              stepCount: 1,
              steps: [
                {
                  id: `m${i}sb1s1`,
                  content: "Step1",
                  title: "Step1",
                  description: "",
                  value: false,
                  disabled: true,
                  apiButton: 0,
                  resourceNotify: true,
                  displayPosition: 1,
                  actionCount: 0,
                  ResourceCount: 0,
                  defaultAction: {
                    id: `m${i}sb1s1a0`,
                    content: "action1",
                    value: false,
                    actionValue: "",
                  },
                  adviceCount: 0,
                  actions: [],
                  stepResources: [],
                  adviceCollegues: [],
                },
              ],
            },
          ],
        });
        state.value = `m${i}sb1s1`;
      }
    },
    stepButton(state = initialState, action) {
      state.stepCount += 1;
      moduleArray.map((item: any) => {
        if (item.id == action.payload.moduleId) {
          item.addNewStepButtons[0].stepCount += 1;
          for (
            let i = item.addNewStepButtons[0].stepCount;
            i <= item.addNewStepButtons[0].stepCount;
            i++
          ) {
            item.addNewStepButtons[0].steps.push({
              id: `${action.payload.moduleId}sb1s${i}`,
              content: `Step${i}`,
              title: `Step${i}`,
              description: "",
              value: false,
              disabled: true,
              apiButton: 0,
              actionCount: 0,
              resourceNotify: true,
              displayPosition: item.addNewStepButtons[0].stepCount,
              defaultAction: {
                id: `${action.payload.moduleId}sb1s${i}a0`,
                content: "action1",
                value: false,
                actionValue: "",
              },
              adviceCount: 0,
              ResourceCount: 0,
              actions: [],
              stepResources: [],
              adviceCollegues: [],
            });
            state.value = `${action.payload.moduleId}sb1s${i}`;
          }
        }
      });
    },
    actionIncreaser(state = initialState, action) {
      let value = 1;
      if (
        action.payload.tabVal === "Write an Email" ||
        action.payload.tabVal === "Upload a File" ||
        action.payload.tabVal === "Schedule a Live Conversation" ||
        action.payload.tabVal === "Question and Answer"
      ) {
        value = 0;
      }
      state.actionValue = action.payload.tabVal;
      state.actionCount += 1;
      moduleArray.map((item: any) => {
        if (item.id == action.payload.mId) {
          item.addNewStepButtons[0].steps.map((e: any) => {
            if (e.id == action.payload.sId) {
              e.actionCount += 1;
              for (let i = e.actionCount; i <= e.actionCount; i++) {
                e.actions.push({
                  id: `${action.payload.sId}a${i}`,
                  disable: value,
                  feedCount: 3,
                  feedResourceCount: 0,
                  feedResourceByCoachCount: 0,
                  queCount: 2,
                  content: {
                    title: "",
                    description: "",
                    image: "",
                    from: "",
                    to: "",
                    subject: "",
                    text: "",
                    document: [],
                    documentFile: "",
                    question: [
                      {
                        id: `${action.payload.sId}a${i}q1`,
                        que: "",
                        ans: "",
                      },
                      {
                        id: `${action.payload.sId}a${i}q2`,
                        que: "",
                        ans: "",
                      },
                    ],
                    contactName: "",
                    contactEmail: "",
                    contactNumber: "",
                    weblinkUrl: action.payload?.url ? action.payload?.url : "",
                    submitTime: "",
                    completeStatus: "Pending",
                    studentName: "",
                  },
                  value: false,
                  actionValue: state.actionValue,
                  feedback: [
                    {
                      id: `${action.payload.sId}a${i}f1`,
                      title: "",
                      description: "",
                      feedback: "",
                      feedbackRating: 0,
                    },
                    {
                      id: `${action.payload.sId}a${i}f2`,
                      title: "",
                      description: "",
                      feedback: "",
                      feedbackRating: 0,
                    },
                    {
                      id: `${action.payload.sId}a${i}f3`,
                      title: "",
                      description: "",
                      feedback: "",
                      feedbackRating: 0,
                    },
                  ],
                  feedbackResource: [],
                  feedbackResourceByCoach: [],
                  feedbackCoachName: "",
                  feedbackRatingByCouch: [
                    {
                      point: 0,
                    },
                    {
                      point: 0,
                    },
                    {
                      point: 0,
                    },
                    {
                      point: 0,
                    },
                    {
                      point: 0,
                    },
                  ],
                  feedbackInputByCouch: "",
                  feedbackEmoji: "",
                });
                state.actionId = `${action.payload.sId}a${i}`;
              }
            }
          });
        }
      });
    },
    addQuestion(state = initialState, action) {
      state.queCount += 1;
      moduleArray.map((item: any) => {
        item.addNewStepButtons[0].steps.map((e: any) => {
          e.actions.map((feed: any) => {
            if (feed.id == action.payload) {
              feed.queCount += 1;
              for (let i = feed.queCount; i <= feed.queCount; i++) {
                feed.content.question.push({
                  id: `${action.payload}q${i}`,
                  que: "",
                  ans: "",
                });
              }
            }
          });
        });
      });
    },
    deleteQuestion(state = initialState, action) {
      state.queCount += 1;
      moduleArray.map((item: any) => {
        item.addNewStepButtons[0].steps.map((e: any) => {
          e.actions.map((feed: any) => {
            if (feed.id == action.payload.id) {
              feed.queCount -= 1;
              feed.content.question.splice(action.payload.index, 1);
            }
          });
        });
      });
    },
    globalResourceIncreaser(state = initialState, action) {
      globalResourceCounting += 1;
      let date = new Date();
      let time = date.getTime();
      let index = globalResource?.findIndex(
        (g: any) => g.folderName === action.payload.folderName
      );
      if (index > -1) {
        if (action.payload.resourceTitle != "") {
          let index = globalResource.findIndex(
            (g: any) => g.folderName === action.payload.folderName
          );
          globalResource[index].files.push({
            id: `globalResource${time}`,
            resourceTitle: action.payload.resourceTitle,
            file: action.payload.file,
          });
        } else {
          return;
        }
      } else {
        globalResourceCounting += 1;
        for (let i = globalResourceCounting; i <= globalResourceCounting; i++) {
          if (action.payload.resourceTitle != "") {
            globalResource.push({
              id: `globalResource${i}`,
              folderName: action.payload.folderName,
              files: [
                {
                  id: `globalResource${time}`,
                  resourceTitle: action.payload.resourceTitle,
                  file: action.payload.file,
                },
              ],
              value: false,
            });
          } else {
            globalResource.push({
              id: `globalResource${i}`,
              folderName: action.payload.folderName,
              files: [],
              value: false,
            });
          }
          state.resourceId = `globalResource${i}`;
        }
      }
    },
    deleteGlobalFolder(state = initialState, action) {
      state.ResourceCount += 1;
      let index = globalResource.findIndex(
        (g: any) => g.id === action.payload.id
      );
      globalResource.splice(index, 1);
    },
    deleteGlobalFile(state = initialState, action) {
      state.ResourceCount += 1;
      globalResource.map((file: any, count: number) => {
        if (file.id == action.payload.folderId) {
          let index = file.files.findIndex(
            (g: any) => g.id === action.payload.id
          );
          file.files.splice(index, 1);
        }
      });
    },
    stepResourceIncreaser(state = initialState, action) {
      state.ResourceCount += 1;
      moduleArray.map((item: any) => {
        if (item.id == action.payload.mId) {
          item.addNewStepButtons[0].steps.map((e: any) => {
            if (e.id == action.payload.sId) {
              let date = new Date();
              let time = date.getTime();
              let index = e?.stepResources?.findIndex(
                (g: any) => g.folderName === action.payload.folderName
              );
              if (index > -1) {
                if (action.payload.resourceTitle != "") {
                  let index = e.stepResources.findIndex(
                    (g: any) => g.folderName === action.payload.folderName
                  );
                  e.stepResources[index].files.push({
                    id: `${action.payload.sId}f${time}`,
                    resourceTitle: action.payload.resourceTitle,
                    file: action.payload.file,
                  });
                } else {
                  return;
                }
              } else {
                e.ResourceCount += 1;
                for (let i = e.ResourceCount; i <= e.ResourceCount; i++) {
                  if (action.payload.resourceTitle != "") {
                    e.stepResources.push({
                      id: `${action.payload.sId}r${i}`,
                      folderName: action.payload.folderName,
                      files: [
                        {
                          id: `${action.payload.sId}f${time}`,
                          resourceTitle: action.payload.resourceTitle,
                          file: action.payload.file,
                        },
                      ],
                      value: false,
                    });
                  } else {
                    e.stepResources.push({
                      id: `${action.payload.sId}r${i}`,
                      folderName: action.payload.folderName,
                      files: [],
                      value: false,
                    });
                  }
                  state.resourceId = `${action.payload.sId}r${i}`;
                }
              }
            }
          });
        }
      });
    },
    deleteStepFolder(state = initialState, action) {
      state.ResourceCount -= 1;
      moduleArray.map((item: any) => {
        if (item.id == action.payload.moduleId) {
          item.addNewStepButtons[0].steps.map((e: any) => {
            if (e.id == action.payload.stepId) {
              let index = e.stepResources.findIndex(
                (g: any) => g.id === action.payload.id
              );
              e.stepResources.splice(index, 1);
            }
          });
        }
      });
    },
    deleteStepFile(state = initialState, action) {
      state.ResourceCount -= 1;
      moduleArray.map((item: any) => {
        if (item.id == action.payload.moduleId) {
          item.addNewStepButtons[0].steps.map((e: any) => {
            if (e.id == action.payload.stepId) {
              e.stepResources.map((file: any, count: number) => {
                if (file.id == action.payload.folderId) {
                  let index = file.files.findIndex(
                    (g: any) => g.id === action.payload.id
                  );
                  file.files.splice(index, 1);
                }
              });
            }
          });
        }
      });
    },
    adviceIncreaser(state = initialState, action) {
      state.adviceCount += 1;
      moduleArray.map((item: any) => {
        if (item.id == action.payload.mId) {
          item.addNewStepButtons[0].steps.map((e: any) => {
            if (e.id == action.payload.sId) {
              e.adviceCount += 1;
              for (let i = e.adviceCount; i <= e.adviceCount; i++) {
                e.adviceCollegues.push({
                  id: `${action.payload.sId}ad${i}`,
                  firstName: action.payload.firstName,
                  lastName: action.payload.lastName,
                  advice: action.payload.advice,
                  file: action.payload.file,
                  value: false,
                });
                state.adviceId = `${action.payload.sId}ad${i}`;
              }
            }
          });
        }
      });
    },
    adviceUpdator(state = initialState, action) {
      moduleArray.map((item: any) => {
        if (item.id == action.payload.mId) {
          item.addNewStepButtons[0].steps.map((e: any) => {
            if (e.id == action.payload.sId) {
              e.adviceCollegues.map((a: any) => {
                if (a.id == action.payload.id) {
                  a.firstName = action.payload.firstName;
                  a.lastName = action.payload.lastName;
                  a.advice = action.payload.advice;
                  a.file = action.payload.file;
                }
              });
            }
          });
        }
      });
    },
    deleteAdvice(state = initialState, action) {
      state.adviceCount -= 1;
      moduleArray.map((item: any) => {
        if (item.id == action.payload.moduleId) {
          item.addNewStepButtons[0].steps.map((e: any) => {
            if (e.id == action.payload.stepId) {
              let index = e.adviceCollegues.findIndex(
                (g: any) => g.id === action.payload.id
              );
              e.adviceCollegues.splice(index, 1);
            }
          });
        }
      });
    },
    changeStepValue(state = initialState, action) {
      state.bool = !state.bool;
      moduleArray.map((item: any) => {
        item.addNewStepButtons[0].steps.map((e: any) => {
          if (e.id == action.payload.id) {
            e.value = !e.value;
          }
        });
      });
    },
    changeValue(state = initialState, action) {
      state.bool = !state.bool;
      moduleArray.map((item: any) => {
        if (item.id == action.payload.id) {
          item.value = !item.value;
        } else {
          item.value = false;
        }
      });
    },
    changeValueForD(state = initialState, action) {
      state.bool = !state.bool;
      moduleArray.map((item: any) => {
        if (
          item.id !== action.payload.id &&
          item.id !== action.payload.item?.id
        ) {
          item.value = false;
        } else {
          item.value = true;
        }
      });
    },
    changeValueForStep(state = initialState, action) {
      state.bool = !state.bool;
      moduleArray.map((item: any) => {
        if (item.id === action.payload.id) {
          item.value = false;
        }
      });
    },
    changeDivUrl(state = initialState, action) {
      state.value = action.payload;
    },
    deleteActions(state = initialState, action) {
      state.actionCount -= 1;
      moduleArray.map((item: any) => {
        if (item.id == action.payload.moduleId) {
          item.addNewStepButtons[0].steps.map((e: any) => {
            if (e.id == action.payload.stepId) {
              e.actions.splice(action.payload.index, 1);
            }
          });
        }
      });
    },
    deleteModule(state = initialState, action) {
      moduleArray.map((item: any, index: number) => {
        if (item.id == action.payload.id) {
          moduleArray.splice(action.payload.index, 1);
        }
      });
    },
    deleteSteps(state = initialState, action) {
      state.stepCount -= 1;
      moduleArray.map((item: any, index: number) => {
        if (item.id == action.payload.id) {
          item.addNewStepButtons[0].steps.map((e: any, num: number) => {
            if (e.id == action.payload.sid) {
              item.addNewStepButtons[0].steps.splice(action.payload.index, 1);
            }
          });
        }
      });
    },
    duplicateActions(state = initialState, action) {
      state.actionCount += 1;
      moduleArray.map((item: any) => {
        if (item.id == action.payload.moduleId) {
          item.addNewStepButtons[0].steps.map((e: any) => {
            if (e.id == action.payload.stepId) {
              e.actionCount += 1;
              e.actions.splice(action.payload.index + 1, 0, {
                id: `${action.payload.stepId}a${e.actionCount}`,
                content: action.payload.value.content,
                value: action.payload.value.value,
                disable: action.payload.value.disable,
                actionValue: action.payload.value.actionValue,
                feedCount: action.payload.value.feedCount,
                feedResourceCount: action.payload.value.feedResourceCount,
                feedResourceByCoachCount: 0,
                feedback: action.payload.value.feedback,
                feedbackResource: action.payload.value.feedbackResource,
                feedbackResourceByCoach: [],
                feedbackCoachName: "",
                feedbackRatingByCouch: [
                  {
                    point: 0,
                  },
                  {
                    point: 0,
                  },
                  {
                    point: 0,
                  },
                  {
                    point: 0,
                  },
                  {
                    point: 0,
                  },
                ],
                feedbackInputByCouch: "",
                feedbackEmoji: "",
                queCount: action.payload.value.queCount,
              });
            }
          });
        }
      });
    },
    jointFeedback(state = initialState, action) {
      state.feedCount += 1;
      moduleArray.map((item: any) => {
        item.addNewStepButtons[0].steps.map((e: any) => {
          e.actions.map((feed: any) => {
            if (feed.id == action.payload) {
              feed.feedCount += 1;
              for (let i = feed.feedCount; i <= feed.feedCount; i++) {
                feed.feedback.push({
                  id: `${action.payload}f${i}`,
                  title: "",
                  description: "",
                  feedback: "",
                  feedbackRating: 0,
                });
              }
            }
          });
        });
      });
    },
    jointFeedbackResource(state = initialState, action) {
      moduleArray.map((item: any) => {
        item.addNewStepButtons[0].steps.map((e: any) => {
          e.actions.map((feed: any) => {
            if (feed.id == action.payload.id) {
              feed.feedResourceCount += 1;
              for (
                let i = feed.feedResourceCount;
                i <= feed.feedResourceCount;
                i++
              ) {
                feed.feedbackResource.push({
                  id: `${action.payload.id}fr${i}`,
                  title: action.payload.title,
                  url: action.payload.url,
                });
              }
            }
          });
        });
      });
      state.feedResourceCount += 1;
    },
    jointFeedbackResourceByCoach(state = initialState, action) {
      moduleArray.map((item: any) => {
        item.addNewStepButtons[0].steps.map((e: any) => {
          e.actions.map((feed: any) => {
            if (feed.id == action.payload.id) {
              feed.feedResourceByCoachCount += 1;
              for (
                let i = feed.feedResourceByCoachCount;
                i <= feed.feedResourceByCoachCount;
                i++
              ) {
                feed.feedbackResourceByCoach.push({
                  id: `${action.payload.id}fr${i}`,
                  title: action.payload.title,
                  url: action.payload.url,
                });
              }
            }
          });
        });
      });
      state.feedResourceCount += 1;
    },
    changeStepdata(state = initialState, action) {
      state.data = action.payload;
    },
    changeModuledata(state = initialState, action) {
      state.data = action.payload;
    },
    changeCheck(state = initialState) {
      state.check = !state.check;
    },
    changeModuleArrayValue(state = initialState, action) {
      state.moduleChange = !state.moduleChange;
      moduleArray = action.payload;
    },
    changeModuleCount(state = initialState, action) {
      counting = +action.payload;
    },
    changeGlobalResourceValue(state = initialState, action) {
      globalResource = action.payload.global;
      globalResourceCounting = action.payload.gbCount;
    },
    deleteImage(state = initialState, action) {
      imageCounting -= 1;
      moduleArray.map((item: any) => {
        if (item.id === action.payload.modId) {
          item.addNewStepButtons[0].steps.map((e: any) => {
            if (e.id === action.payload.stepId) {
              e.actions.map((act: any) => {
                if (act.id === action.payload.actionId) {
                  act.content.document.splice(action.payload.index, 1);
                }
              });
            }
          });
        }
      });
    },
    incrementImage(state = initialState, action) {
      imageCounting += action.payload;
    },
    moduleToPush(state = initialState, action) {
      state.stepCount += 1;
      moduleArray.map((item: any) => {
        if (item.id == action.payload.id) {
          item.addNewStepButtons[0].stepCount += 1;
          item.addNewStepButtons[0].steps.push(action.payload.item);
        }
      });
    },
    moduleFromIndex(state = initialState, action) {
      state.stepCount += 1;
      state.stepAdd += 1;
      moduleArray.map((item: any) => {
        if (item.id == action.payload.id) {
          item.addNewStepButtons[0].stepCount += 1;
          item.addNewStepButtons[0].steps.splice(
            action.payload.index,
            0,
            action.payload.item
          );
        }
      });
    },
    changeStepAdd(state = initialState) {
      state.stepAdd = 0;
    },
    publishStatus(state = initialState) {
      state.publish += 1;
    },
    sendToNextStep(state = initialState, action) {
      let checkActionStatus = false;
      let stepLength = 0;
      let stepIndex = 0;
      let moduleIndex = 0;
      moduleArray?.map((item: any, index: number) => {
        if (
          index ===
          (action.payload.sid === 0
            ? action.payload.mid - 1
            : action.payload.mid)
        ) {
          moduleIndex = index;
          stepLength = item?.addNewStepButtons[0].steps?.length - 1;
          item?.addNewStepButtons[0].steps?.map((e: any, num: number) => {
            if (
              num ===
              (action.payload.sid === 0 ? stepLength : action.payload.sid - 1)
            ) {
              stepIndex = num;
              checkActionStatus = e.actions.every(
                (a: any, number: number) => a.disable === 1
              );
              if (checkActionStatus && e.disabled === false) {
                if (stepIndex <= stepLength) {
                  moduleArray[action.payload.mid].addNewStepButtons[0].steps[
                    action.payload.sid
                  ].disabled = false;
                } else {
                  if (moduleIndex <= moduleArray.length - 1) {
                    moduleArray[action.payload.mid].disabled = true;
                    moduleArray[
                      action.payload.mid
                    ].addNewStepButtons[0].steps[0].disabled = false;
                  }
                }
              } else {
                state.runSidebar += 1;
              }
            }
          });
        }
      });
    },
    changeApiButtonStatus(state = initialState, action) {
      moduleArray?.map((item: any) => {
        if (item?.id === action.payload.modId) {
          item.addNewStepButtons[0].steps.map((e: any, num: number) => {
            if (e?.id === action.payload.stId) {
              e.apiButton = 1;
            }
          });
        }
      });
    },
    changeSidebar(state = initialState) {
      state.runSidebar = 0;
    },
    simulationIdGet(state = initialState, action) {
      simulationId = action.payload;
    },
    feedbackTeamName(state = initialState, action) {
      teamNameForFeedback = action.payload[0];
      teamidForFeedback = action.payload[1];
    },
    changeCompleteStatus(state = initialState, action) {
      action.payload[0].completedStatus = 1;
    },
    setTeamName(state = initialState, action) {
      teamName = action.payload;
    },
  },
});

export const {
  incrementModule,
  actionIncreaser,
  changeValue,
  changeStepValue,
  changeDivUrl,
  stepButton,
  deleteActions,
  deleteModule,
  deleteSteps,
  duplicateActions,
  changeStepdata,
  changeModuledata,
  changeCheck,
  changeModuleArrayValue,
  stepResourceIncreaser,
  adviceIncreaser,
  adviceUpdator,
  deleteStepFolder,
  deleteStepFile,
  deleteAdvice,
  jointFeedback,
  jointFeedbackResource,
  addQuestion,
  deleteQuestion,
  changeModuleCount,
  globalResourceIncreaser,
  changeGlobalResourceValue,
  deleteGlobalFolder,
  deleteGlobalFile,
  deleteImage,
  incrementImage,
  moduleToPush,
  moduleFromIndex,
  changeStepAdd,
  changeValueForD,
  changeValueForStep,
  publishStatus,
  sendToNextStep,
  changeSidebar,
  simulationIdGet,
  feedbackTeamName,
  jointFeedbackResourceByCoach,
  changeApiButtonStatus,
  changeCompleteStatus,
  setTeamName,
} = counterSlice.actions;
export default counterSlice.reducer;
