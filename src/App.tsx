import React, { Suspense, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation,
} from "react-router-dom";
import Login from "./login/Login";
import adminclasses from "./admin.style.module.scss";
import studentclasses from "./participant.style.module.scss";
import coachclasses from "./coach.style.module.scss";
import CreateSimulation from "./admin/pages/create_simulation/Create_simulation";
import CreateSimulationData from "./admin/pages/create_simulation_data/Create_simulation";
import CreateTeam from "./admin/pages/create_team/Create_team";
import Myteam from "./admin/pages/myteam/myteam";
import Simulation from "./admin/pages/simulation/simulation";
import Triage from "./participant/pages/triage/Triage";
import ManageTeam from "./admin/pages/manage_team/Manage_team";
import ViewSimulation from "./admin/pages/view_simulation/View_simulation";
import EditSimulation from "./admin/pages/edit_simulation/Edit_simulation";
import { useContext } from "react";
import GlobalContext from "../src/store/global-context";
import Error404 from "./404/404";
import Forgotpassword from "./components/forgotpassword/Forgotpassword";
import Changepassword from "./components/changepassword/Changepassword";
import LoadingSpinner from "./Custom_Components/LoadingSpinner/LoadingSpinner";
import {
  AdminRoutes,
  CoachRoutes,
  ParticipantRoutes,
  PublicRoutes,
  Roles,
} from "./types/types";
import ParticipantView from "./admin/pages/participant_view/Participant_view";
import Feedbacks from "./admin/pages/feedbacks/Feedbacks";
import FeedbacksDetails from "./admin/pages/feedbacks_details/Feedbacks_details";
import DashboardAdmin from "./admin/pages/dashboard/Dashboard";
import ReportingAdmin from "./admin/pages/data_reporting/Reporting";
import DashboardCoach from "./coach/pages/dashboard/Dashboard";
import CoachFeedbacks from "./coach/pages/feedbacks/Feedbacks";
import Coachteam from "./coach/pages/myteam/myteam";
import CoachManageTeam from "./coach/pages/manage_team/Manage_team";
import CoachFeedbacksDetails from "./coach/pages/feedbacks_details/Feedbacks_details";
import Onboardingsimulation from "./participant/pages/onboarding_simulation/Onboardingsimulation";
import Team from "./participant/pages/team/Team";
import DashboardParticipant from "./participant/pages/dashboard/Dashboard";
import Feedback from "./participant/pages/feedback/Feedback";
import Resourcebank from "./participant/pages/resourcebank/Resourcebank";
import Step1 from "./participant/pages/step1/Step1";
import Step2 from "./participant/pages/step2/Step2";
import Step3 from "./participant/pages/step3/Step3";
import Step4 from "./participant/pages/step4/Step4";
import Step5 from "./participant/pages/step5/Step5";
import Step6 from "./participant/pages/step6/Step6";
import Messages from "./participant/pages/messages/Messages";
import Message from "./admin/pages/messages/Message";
import CoachTriage from "./coach/pages/triage/Triage";
import ParticipantViewStudent from "./participant/pages/participant_view/Participant_view";
import IdleTimer from "./utils/IdleTimer";
import { getToken, messaging, onMessageListener } from "./firebase";
import { Toast } from "react-bootstrap";

// USING LAZY LOADING FOR PERFORMANCE PURPOSE IT WILL INCREASE THE PERFORMANCE BY LOADED A COMPONENT OR A PART OF CODE WHEN IT IS REQUIRED
//<-------------------------------------------------------------------------------->
const AdminAccount = React.lazy(() => import("./admin/pages/account/Account"));
const CoachAccount = React.lazy(() => import("./coach/pages/account/Account"));
const Account = React.lazy(() => import("./participant/pages/account/Account"));
// <------------------------------------------------------------------------------->

// PRIVATE ROUTES FOR CUSTOM COMPONENT PROTECTION OF ROUTES FOR ADMIN, COACH, PARTICIPANTS
const PrivateRoute = (props: any) => {
  const location = useLocation();

  const token = localStorage.getItem("token");
  const _expiredTime = localStorage.getItem("_expiredTime");

  const [isTimeout, setIsTimeout] = useState(false);
  const [show, setShow] = useState(false);
  const [notification, setNotification] = useState({ title: "", body: "" });
  const [isTokenFound, setTokenFound] = useState(false);
  getToken(setTokenFound);

  onMessageListener()
    .then((payload: any) => {
      setNotification({
        title: payload.notification.title,
        body: payload.notification.body,
      });
      setShow(true);
      console.log(payload);
    })
    .catch((err: any) => console.log("failed: ", err));

  const onShowNotificationClicked = () => {
    setNotification({
      title: "Notification",
      body: "This is a test notification",
    });
    setShow(true);
  };

  useEffect(() => {
    const timer = new IdleTimer({
      timeout: 900, //expire after 15 minutes
      onTimeout: () => {
        setIsTimeout(true);
      },
      onExpired: () => {
        //do something if expired on load
        setIsTimeout(true);
      },
    });

    return () => {
      if (!_expiredTime) {
        timer.cleanUp();
      }
    };
  }, []);

  if (isTimeout) {
    return (
      <Redirect
        to={{
          pathname: PublicRoutes.LOGIN_ROUTE,
        }}
      />
    );
  }

  if (token) {
    return (
      <>
        <Toast
          onClose={() => setShow(false)}
          show={show}
          delay={3000}
          autohide
          animation
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            minWidth: 200,
          }}
        >
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded mr-2"
              alt=""
            />
            <strong className="mr-auto">{notification.title}</strong>
            <small>just now</small>
          </Toast.Header>
          <Toast.Body>{notification.body}</Toast.Body>
        </Toast>
        <header className="App-header">
          {/* {isTokenFound && <h1> Notification permission enabled 👍🏻 <button onClick={() => onShowNotificationClicked()}>Show Toast</button></h1>}
    {!isTokenFound && <h1> Need notification permission ❗️<button onClick={() => onShowNotificationClicked()}>Show Toast</button> </h1>} */}
        </header>
        <Route {...props} />
      </>
    );
  }
  return (
    <Redirect
      to={{
        pathname: PublicRoutes.LOGIN_ROUTE,
      }}
    />
  );
};

// PRIVATE ROUTES CUSTOM COMPONENT ENDS

const PublicRoute = (props: any) => {
  const location = useLocation();

  const token = localStorage.getItem("token");
  const data = JSON.parse(localStorage.getItem("data")!);
  let pathname: string = "";
  if (data?.type === Roles.ADMIN) {
    pathname = AdminRoutes.ADMIN_DASHBOARD;
  } else if (data?.type === Roles.PARTICIPANTS) {
    pathname = ParticipantRoutes.PARTICIPANTS_DASHBOARD;
  } else if (data?.type === Roles.COACH) {
    pathname = CoachRoutes.COACH_DASHBOARD;
  } else {
    if (token) {
      localStorage.clear();
      pathname = PublicRoutes.LOGIN_ROUTE;
    }
  }

  return token ? (
    <Redirect to={{ pathname: pathname }} />
  ) : (
    <Route {...props} />
  );
};

const App: React.FC = () => {
  const globalCtx = useContext(GlobalContext);
  let cx = adminclasses;
  if (window.location.pathname.includes("/admin")) {
    cx = adminclasses;
  } else if (window.location.pathname.includes("/participant")) {
    cx = studentclasses;
  } else if (window.location.pathname.includes("/coach")) {
    cx = coachclasses;
  }

  return (
    <Router basename="/">
      <div>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Suspense
          fallback={
            <div className="centered">
              <LoadingSpinner />
            </div>
          }
        >
          <Switch>
            {/* PUBLIC ROUTE FOR USER */}
            <PublicRoute exact path={PublicRoutes.BASE_LOGIN_ROUTE}>
              <Login />
            </PublicRoute>
            <PublicRoute exact path={PublicRoutes.LOGIN_ROUTE}>
              <Login />
            </PublicRoute>

            <PublicRoute exact path={PublicRoutes.FORGOT_PASSWORD_ROUTE}>
              <Forgotpassword />
            </PublicRoute>

            <PublicRoute exact path={PublicRoutes.CHANGE_PASSWORD_ROUTE}>
              <Changepassword />
            </PublicRoute>

            <PublicRoute exact path={PublicRoutes.CHANGE_PASSWORD_ROUTE_BY_ID}>
              <Changepassword />
            </PublicRoute>
            {/* PUBLIC ROUTE FOR USER ENDS */}

            {/* ADMIN ROUTES  STARTED */}
            <PrivateRoute exact path={AdminRoutes.ADMIN_DASHBOARD}>
              <div
                className={`${globalCtx.deskMenu ? `${cx.fullWidthOpen}` : ""}`}
              >
                <DashboardAdmin />
              </div>
            </PrivateRoute>
            <PrivateRoute exact path={AdminRoutes.ADMIN_DATA_REPORTING}>
              <div
                className={`${globalCtx.deskMenu ? `${cx.fullWidthOpen}` : ""}`}
              >
                <ReportingAdmin />
              </div>
            </PrivateRoute>
            <PrivateRoute exact path={AdminRoutes.ADMIN_FEEDBACK}>
              <div
                className={`${globalCtx.deskMenu ? `${cx.fullWidthOpen}` : ""}`}
              >
                <Feedbacks />
              </div>
            </PrivateRoute>
            <PrivateRoute exact path={AdminRoutes.ADMIN_ACCOUNT}>
              <div
                className={`${globalCtx.deskMenu ? `${cx.fullWidthOpen}` : ""}`}
              >
                <AdminAccount />
              </div>
            </PrivateRoute>
            <PrivateRoute exact path={AdminRoutes.ADMIN_SIMULATION}>
              <div
                className={`${globalCtx.deskMenu ? `${cx.fullWidthOpen}` : ""}`}
              >
                <Simulation />
              </div>
            </PrivateRoute>
            <PrivateRoute exact path={AdminRoutes.ADMIN_CREATE_SIMULATION}>
              <div
                className={`${globalCtx.deskMenu ? `${cx.fullWidthOpen}` : ""}`}
              >
                <CreateSimulation />
              </div>
            </PrivateRoute>
            <PrivateRoute exact path={AdminRoutes.ADMIN_CREATE_SIMULATION_DATA}>
              <div
                className={`${globalCtx.deskMenu ? `${cx.fullWidthOpen}` : ""}`}
              >
                <CreateSimulationData />
              </div>
            </PrivateRoute>
            <PrivateRoute exact path={AdminRoutes.ADMIN_CREATE_TEAM}>
              <div
                className={`${globalCtx.deskMenu ? `${cx.fullWidthOpen}` : ""}`}
              >
                <CreateTeam />
              </div>
            </PrivateRoute>
            <PrivateRoute exact path={AdminRoutes.ADMIN_MYTEAM}>
              <div
                className={`${globalCtx.deskMenu ? `${cx.fullWidthOpen}` : ""}`}
              >
                <Myteam />
              </div>
            </PrivateRoute>
            <PrivateRoute exact path={AdminRoutes.ADMIN_MANAGE_TEAM}>
              <div
                className={`${globalCtx.deskMenu ? `${cx.fullWidthOpen}` : ""}`}
              >
                <ManageTeam />
              </div>
            </PrivateRoute>
            <PrivateRoute exact path={AdminRoutes.ADMIN_VIEW_SIMULATION}>
              <div
                className={`${globalCtx.deskMenu ? `${cx.fullWidthOpen}` : ""}`}
              >
                <ViewSimulation />
              </div>
            </PrivateRoute>
            <PrivateRoute exact path={AdminRoutes.ADMIN_EDIT_SIMULATION}>
              <div
                className={`${globalCtx.deskMenu ? `${cx.fullWidthOpen}` : ""}`}
              >
                <EditSimulation />
              </div>
            </PrivateRoute>

            <PrivateRoute exact path={AdminRoutes.ADMIN_PARTICIPANT_VIEW}>
              <div
                className={`${globalCtx.deskMenu ? `${cx.fullWidthOpen}` : ""}`}
              >
                <ParticipantView />
              </div>
            </PrivateRoute>

            <PrivateRoute exact path={AdminRoutes.ADMIN_FEEDBACK_DETAILS_VIEW}>
              <div
                className={`${globalCtx.deskMenu ? `${cx.fullWidthOpen}` : ""}`}
              >
                <FeedbacksDetails />
              </div>
            </PrivateRoute>

            <PrivateRoute exact path={AdminRoutes.ADMIN_MESSAGE}>
              <div
                className={`${globalCtx.deskMenu ? `${cx.fullWidthOpen}` : ""}`}
              >
                <Message />
              </div>
            </PrivateRoute>

            {/* ADMIN ROUTES  ENDS */}

            {/* PARTICIPANT ROUTES  STARTED */}
            <PrivateRoute exact path={ParticipantRoutes.PARTICIPANT_ACCOUNT}>
              <div
                className={`${globalCtx.deskMenu ? `${cx.fullWidthOpen}` : ""}`}
              >
                <Account />
              </div>
            </PrivateRoute>
            <PrivateRoute exact path={ParticipantRoutes.PARTICIPANTS_TRIAGE}>
              <div
                className={`${globalCtx.deskMenu ? `${cx.fullWidthOpen}` : ""}`}
              >
                <Triage />
              </div>
            </PrivateRoute>
            <PrivateRoute exact path={ParticipantRoutes.PARTICIPANTS_DASHBOARD}>
              <div
                className={`${globalCtx.deskMenu ? `${cx.fullWidthOpen}` : ""}`}
              >
                <DashboardParticipant />
              </div>
            </PrivateRoute>
            <PrivateRoute
              exact
              path={ParticipantRoutes.PARTICIPANTS_SIMULATION}
            >
              <div
                className={`${globalCtx.deskMenu ? `${cx.fullWidthOpen}` : ""}`}
              >
                <ParticipantViewStudent />
              </div>
            </PrivateRoute>
            <PrivateRoute
              exact
              path={ParticipantRoutes.PARTICIPANTS_ONBOARDING_SIMULATION}
            >
              <div
                className={`${globalCtx.deskMenu ? `${cx.fullWidthOpen}` : ""}`}
              >
                <Onboardingsimulation />
              </div>
            </PrivateRoute>
            <PrivateRoute exact path={ParticipantRoutes.PARTICIPANTS_TEAMS}>
              <div
                className={`${globalCtx.deskMenu ? `${cx.fullWidthOpen}` : ""}`}
              >
                <Team />
              </div>
            </PrivateRoute>
            <PrivateRoute exact path={ParticipantRoutes.PARTICIPANTS_FEEDBACK}>
              <div
                className={`${globalCtx.deskMenu ? `${cx.fullWidthOpen}` : ""}`}
              >
                <Feedback />
              </div>
            </PrivateRoute>
            <PrivateRoute exact path={ParticipantRoutes.PARTICIPANTS_RESOURCE}>
              <div
                className={`${globalCtx.deskMenu ? `${cx.fullWidthOpen}` : ""}`}
              >
                <Resourcebank />
              </div>
            </PrivateRoute>
            <PrivateRoute exact path={ParticipantRoutes.PARTICIPANTS_STEPONE}>
              <div
                className={`${globalCtx.deskMenu ? `${cx.fullWidthOpen}` : ""}`}
              >
                <Step1 />
              </div>
            </PrivateRoute>

            <PrivateRoute exact path={ParticipantRoutes.PARTICIPANTS_STEPTWO}>
              <div
                className={`${globalCtx.deskMenu ? `${cx.fullWidthOpen}` : ""}`}
              >
                <Step2 />
              </div>
            </PrivateRoute>

            <PrivateRoute exact path={ParticipantRoutes.PARTICIPANTS_STEPTHREE}>
              <div
                className={`${globalCtx.deskMenu ? `${cx.fullWidthOpen}` : ""}`}
              >
                <Step3 />
              </div>
            </PrivateRoute>

            <PrivateRoute exact path={ParticipantRoutes.PARTICIPANTS_STEPFOUR}>
              <div
                className={`${globalCtx.deskMenu ? `${cx.fullWidthOpen}` : ""}`}
              >
                <Step4 />
              </div>
            </PrivateRoute>

            <PrivateRoute exact path={ParticipantRoutes.PARTICIPANTS_STEPFIVE}>
              <div
                className={`${globalCtx.deskMenu ? `${cx.fullWidthOpen}` : ""}`}
              >
                <Step5 />
              </div>
            </PrivateRoute>

            <PrivateRoute exact path={ParticipantRoutes.PARTICIPANTS_STEPSIX}>
              <div
                className={`${globalCtx.deskMenu ? `${cx.fullWidthOpen}` : ""}`}
              >
                <Step6 />
              </div>
            </PrivateRoute>

            <PrivateRoute exact path={ParticipantRoutes.PARTICIPANTS_MESSAGE}>
              <div
                className={`${globalCtx.deskMenu ? `${cx.fullWidthOpen}` : ""}`}
              >
                <Message />
              </div>
            </PrivateRoute>

            {/* PARTICIPANT ROUTES  ENDS */}

            {/* COACH ROUTES  STARTED */}
            <PrivateRoute exact path={CoachRoutes.COACH_ACCOUNT}>
              <div
                className={`${globalCtx.deskMenu ? `${cx.fullWidthOpen}` : ""}`}
              >
                <CoachAccount />
              </div>
            </PrivateRoute>
            <PrivateRoute exact path={CoachRoutes.COACH_DASHBOARD}>
              <div
                className={`${globalCtx.deskMenu ? `${cx.fullWidthOpen}` : ""}`}
              >
                <DashboardCoach />
              </div>
            </PrivateRoute>
            <PrivateRoute exact path={CoachRoutes.COACH_TEAM}>
              <div
                className={`${globalCtx.deskMenu ? `${cx.fullWidthOpen}` : ""}`}
              >
                <Coachteam />
              </div>
            </PrivateRoute>
            <PrivateRoute exact path={CoachRoutes.COACH_FEEDBACK}>
              <div
                className={`${globalCtx.deskMenu ? `${cx.fullWidthOpen}` : ""}`}
              >
                <CoachFeedbacks />
              </div>
            </PrivateRoute>
            <PrivateRoute exact path={CoachRoutes.COACH_MANAGE_TEAM}>
              <div
                className={`${globalCtx.deskMenu ? `${cx.fullWidthOpen}` : ""}`}
              >
                <CoachManageTeam />
              </div>
            </PrivateRoute>
            <PrivateRoute exact path={CoachRoutes.COACH_FEEDBACK_DETAILS}>
              <div
                className={`${globalCtx.deskMenu ? `${cx.fullWidthOpen}` : ""}`}
              >
                <CoachFeedbacksDetails />
              </div>
            </PrivateRoute>

            <PrivateRoute exact path={CoachRoutes.COACH_TRIAGE}>
              <div
                className={`${globalCtx.deskMenu ? `${cx.fullWidthOpen}` : ""}`}
              >
                <CoachTriage />
              </div>
            </PrivateRoute>

            <PrivateRoute exact path={CoachRoutes.COACH_MESSAGE}>
              <div
                className={`${globalCtx.deskMenu ? `${cx.fullWidthOpen}` : ""}`}
              >
                <Message />
              </div>
            </PrivateRoute>
            {/* COACH ROUTES  ENDS */}

            {/* IF ANY USER WANTS TO ENTER IN THE APPLICATION THROUGH ROUTES OF ADMIN AND COACH WITHOUT AUTHORIZATION THAN IT WILL REDIRECT TO LOGIN PAGE  */}
            <PublicRoute path="*">
              <div
                className={`${globalCtx.deskMenu ? `${cx.fullWidthOpen}` : ""}`}
              >
                <Redirect
                  to={{
                    pathname: PublicRoutes.LOGIN_ROUTE,
                  }}
                />
              </div>
            </PublicRoute>
            {/* LOGIN REDIRECTION ENDS (UNWANTED USER/PERSON) */}
          </Switch>
        </Suspense>
      </div>
    </Router>
  );
};

export default App;
