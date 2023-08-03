export enum Roles {
  ADMIN = "admin",
  SUBADMIN = "Subadmin",
  PARTICIPANTS = "student",
  COACH = "coach",
}

export enum AdminRoutes {
  ADMIN_DASHBOARD = "/admin/dashboard",
  ADMIN_DATA_REPORTING = "/admin/data-reporting",
  ADMIN_FEEDBACK = "/admin/feedback",
  ADMIN_ACCOUNT = "/admin/account",
  ADMIN_SIMULATION = "/admin/simulation",
  ADMIN_CREATE_SIMULATION = "/admin/create-simulation",
  ADMIN_CREATE_SIMULATION_DATA = "/admin/create-simulation-data",
  ADMIN_CREATE_TEAM = "/admin/create-team",
  ADMIN_MYTEAM = "/admin/myteam",
  ADMIN_MANAGE_TEAM = "/admin/manage-team/:id",
  ADMIN_VIEW_SIMULATION = "/admin/view-simulation/:id",
  ADMIN_EDIT_SIMULATION = "/admin/edit-simulation/:id",
  ADMIN_PARTICIPANT_VIEW = "/admin/participant-view/:id",
  ADMIN_FEEDBACK_DETAILS_VIEW = "/admin/feedback-details/:id",
  ADMIN_MESSAGE = "/admin/message",
}

export enum ParticipantRoutes {
  PARTICIPANT_ACCOUNT = "/participant/account",
  PARTICIPANTS_TRIAGE = "/participant/triage",
  PARTICIPANTS_DASHBOARD = "/participant/dashboard/:id",
  PARTICIPANTS_SIMULATION = "/participant/simulations/:id",
  PARTICIPANTS_ONBOARDING_SIMULATION = "/participant/onboarding-simulation",
  PARTICIPANTS_TEAMS = "/participant/teams/:id",
  PARTICIPANTS_FEEDBACK = "/participant/feedback/:id",
  PARTICIPANTS_RESOURCE = "/participant/resource/:id",
  PARTICIPANTS_STEPONE = "/participant/step1",
  PARTICIPANTS_STEPTWO = "/participant/step2",
  PARTICIPANTS_STEPTHREE = "/participant/step3",
  PARTICIPANTS_STEPFOUR = "/participant/step4",
  PARTICIPANTS_STEPFIVE = "/participant/step5",
  PARTICIPANTS_STEPSIX = "/participant/step6",
  PARTICIPANTS_MESSAGE = "/participant/message",
}

export enum CoachRoutes {
  COACH_ACCOUNT = "/coach/account",
  COACH_DASHBOARD = "/coach/dashboard",
  COACH_TEAM = "/coach/team",
  COACH_FEEDBACK = "/coach/feedback",
  COACH_FEEDBACK_DETAILS = "/coach/feedback-details/:id",
  COACH_MANAGE_TEAM = "/coach/manage-team/:id",
  COACH_TRIAGE = "/coach/triage",
  COACH_MESSAGE = "/coach/message",
}

export enum PublicRoutes {
  BASE_LOGIN_ROUTE = "/",
  LOGIN_ROUTE = "/login",
  FORGOT_PASSWORD_ROUTE = "/forgot-password",
  CHANGE_PASSWORD_ROUTE = "/change-password",
  CHANGE_PASSWORD_ROUTE_BY_ID = "/change-password/:id",
}
