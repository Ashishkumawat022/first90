import React, { useEffect } from "react";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import Sidebar from "../../../components/sidebar/Sidebar";
import cx from "../../../coach.style.module.scss";
import lx from "./Account.module.scss";
import { useState, useRef } from "react";
import userImage from "../../../images/user.jpg";
import { Card, Col, Row, Form, Modal } from "react-bootstrap";
import useHttp from "../../../hooks/use-https";
import useInput from "../../../hooks/use-input";
import {
  AdminRoutes,
  CoachRoutes,
  ParticipantRoutes,
  Roles,
} from "../../../types/types";
import { useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { changeStatusLogin } from "../../../reduxToolkit/reducers/loginReducer";
import { useDispatch } from "react-redux";

const isEmpty = (value: any) => value?.trim() !== "";

const CoachAccount = () => {
  const { sendRequest } = useHttp();
  let history = useHistory();
  let Ldata = localStorage.getItem("data")!;
  let localData = JSON.parse(Ldata)!;
  const dispatch = useDispatch();
  const {
    value: firstNameValue,
    isValid: firstNameIsValid,
    hasError: firstNameHasError,
    valueChangeHandler: firstNameChangeHandler,
    inputBlurHandler: firstNameBlurHandler,
  } = useInput(isEmpty, localData?.coachFirstName);
  const {
    value: lastNameValue,
    isValid: lastNameIsValid,
    hasError: lastNameHasError,
    valueChangeHandler: lastNameChangeHandler,
    inputBlurHandler: lastNameBlurHandler,
  } = useInput(isEmpty, localData?.coachLastName);

  const [email, setEmail] = useState(localData?.coachEmail);
  const [role, setRole] = useState(localData?.role);
  const [biography, setBiography] = useState(localData?.Biography);
  const [password, setpassword] = useState("");
  const [cpassword, setcpassword] = useState("");
  const [rpassword, setrpassword] = useState("");
  const [fileURL, setFileURL] = useState<any>();

  //  uploading file and saving inside useState
  const [displayImages, setdisplayImages] = useState("");
  const [fileSelected, setFileSelected] = React.useState<File>(); // also tried <string | Blob>
  const [cropImage, setCropImage] = useState("");

  const handleImageChange = function (e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files;
    if (!fileList) return;
    let display = URL.createObjectURL(fileList[0]);
    setdisplayImages(display);
    setShow(true);
    setFileSelected(fileList[0]);
  };

  const handleImageRemove = function (e: React.ChangeEvent<HTMLInputElement>) {
    if (cropImage == "") {
      removeImage(localData._id);
    } else {
      e.target.value = "";
      const fileList = e.target.files;
      setdisplayImages(e.target.value);
      setCropImage("");
    }
  };
  // <----------------------------------------------->

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  //  WELCOME MESSAGES WILL SHOWS HERE
  const notify = (text: string) =>
    toast(text, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  const dashboardMessage = () =>
    toast("Thanks for updating your account - let's get started!");

  // MESSAGES ENDS HERE ONLY

  const Profile = (responseData: any) => {
    dashboardMessage();
    // localStorage.setItem("data", JSON.stringify(responseData.data));
    let datatype = JSON.parse(localStorage.getItem("data")!);
    setTimeout(() => {
      if (datatype.role === Roles.ADMIN) {
        history.push(AdminRoutes.ADMIN_DASHBOARD);
      } else if (datatype.role === Roles.PARTICIPANTS) {
        history.push(ParticipantRoutes.PARTICIPANTS_DASHBOARD);
      } else if (datatype.role === Roles.COACH) {
        history.push(CoachRoutes.COACH_DASHBOARD);
      }
    }, 2000);
    datatype?.isfirst === true
      ? statusChanger()
      : history.push("/coach/dashboard");
  };

  const ChangePassword = (responseData: any) => {
    console.log(responseData, "ChangePassword");
  };

  const validProfileForm = !firstNameIsValid && !lastNameIsValid && email;

  const submitProfile = () => {
    let formData = new FormData();
    formData.append("userid", localData._id);
    formData.append("firstName", firstNameValue);
    formData.append("lastName", lastNameValue);
    formData.append("email", email);
    formData.append("type", localData?.role);
    formData.append("role", role);
    formData.append("Biography", biography);
    if (cropImage) {
      formData.append("image", cropImage);
      formData.append("addimage", fileURL);
    }

    if (validProfileForm) {
      notify("Please fill all the fields");
    } else {
      sendRequest(
        {
          url: `${process.env.REACT_APP_BASEURL}/profile`,
          method: "POST",
          headers: {
            Authorization: localStorage.getItem("token"),
          },
          body: formData,
        },
        Profile
      );
    }
  };

  const { sendRequest: request } = useHttp();
  const { sendRequest: changeStatus } = useHttp();

  const imageRemove = (responseData: any) => {
    localStorage.clear();
    localStorage.setItem("data", JSON.stringify(responseData.data));
  };

  const removeImage = (id: any) => {
    request(
      {
        url: `${process.env.REACT_APP_BASEURL}/removeimage?id=62c5c3770c68970368e4a6cb`,
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
          "content-type": "application/json",
        },
      },
      imageRemove
    );
  };

  const submitPassword = () => {
    if (validProfileForm) {
      notify("Please first Update your profile");
      return;
    }
    if (password === rpassword) {
      let data = {
        Admin_id: localData._id,
        oldPassword: cpassword,
        newPassword: rpassword,
      };

      sendRequest(
        {
          url: `${process.env.REACT_APP_BASEURL}/changePassword`,
          method: "POST",
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
        ChangePassword
      );
    }
  };

  const cropperRef = useRef<HTMLImageElement>(null);
  const onCrop = () => {
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
    let urlImage = cropper.getCroppedCanvas().toDataURL();
    setCropImage(urlImage);
    setFileURL(urlImage);
  };

  const statusChangerResponse = (responseData: any) => {
    dispatch(changeStatusLogin(responseData.data.isfirst));
    localStorage.setItem("data", JSON.stringify(responseData.data));
    history.push("/coach/dashboard");
  };

  const statusChanger = () => {
    let data = JSON.stringify({
      id: localData._id,
    });
    changeStatus(
      {
        url: `${process.env.REACT_APP_STUDENT_BASEURL}/user_login_status`,
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
          "content-type": "application/json",
        },
        body: data,
      },
      statusChangerResponse
    );
  };

  return (
    <>
      <Header title="Account" />
      <Sidebar />
      <section className={`${cx.pageWrapper}`}>
        <ToastContainer />
        <Card>
          <Card.Title>Your Information</Card.Title>
          <Card.Body>
            <Card.Text>
              <Form>
                <Row>
                  <Col lg={3}>
                    <Form.Group
                      className={`col-lg-12 ${cx.formBox} ${lx.profileUpload}`}
                      controlId=""
                    >
                      <Form.Label className="d-block">Profile Photo</Form.Label>
                      <div className="text-center">
                        {cropImage ? (
                          <img
                            src={cropImage}
                            className={`${lx.updateProfile}`}
                            alt="Profile"
                          />
                        ) : (
                          <img
                            src={
                              localData?.addimage == ""
                                ? userImage
                                : localData?.addimage
                            }
                            className={`${lx.updateProfile}`}
                            alt="Profile"
                          />
                        )}
                      </div>
                      <button className={`${lx.uploadBtn}`}>
                        Upload Photo
                        <input
                          type="file"
                          onChange={(event) => {
                            handleImageChange(event);
                          }}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={(event: any) => {
                          handleImageRemove(event);
                        }}
                        className={`${lx.removeBtn}`}
                      >
                        Remove Photo
                      </button>
                    </Form.Group>
                  </Col>
                  <Col lg={9}>
                    <Form className="row">
                      <Form.Group
                        className={`col-lg-6 ${cx.formBox}`}
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                          type="text"
                          defaultValue={firstNameValue}
                          onChange={firstNameChangeHandler}
                          onBlur={firstNameBlurHandler}
                        />
                        {firstNameHasError && (
                          <span style={{ color: "red" }}>
                            Please Enter First Name
                          </span>
                        )}
                      </Form.Group>
                      <Form.Group
                        className={`col-lg-6 ${cx.formBox}`}
                        controlId="exampleForm.ControlInput2"
                      >
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                          type="text"
                          defaultValue={lastNameValue}
                          onChange={lastNameChangeHandler}
                          onBlur={lastNameBlurHandler}
                        />
                        {lastNameHasError && (
                          <span style={{ color: "red" }}>
                            Please Enter Last Name
                          </span>
                        )}
                      </Form.Group>
                      <Form.Group
                        className={`col-lg-6 ${cx.formBox}`}
                        controlId="exampleForm.ControlInput3"
                      >
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          value={localData?.coachEmail}
                          disabled
                          onChange={(event) => {
                            setEmail(event?.target.value);
                          }}
                        />
                      </Form.Group>
                      <Form.Group
                        className={`col-lg-6 ${cx.formBox}`}
                        controlId="exampleForm.ControlInput4"
                      >
                        <Form.Label>Position/Role</Form.Label>
                        <Form.Control
                          type="text"
                          defaultValue={localData?.role}
                          onChange={(event) => {
                            setRole(event?.target.value);
                          }}
                        />
                      </Form.Group>
                      <Form.Group
                        className={`col-lg-12 mb-0 ${cx.formBox}`}
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>Biography</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          defaultValue={localData?.Biography}
                          onChange={(event) => {
                            setBiography(event?.target.value);
                          }}
                        />
                        <small>Let people know a little about yourself.</small>
                      </Form.Group>
                    </Form>
                  </Col>
                </Row>
              </Form>
            </Card.Text>
          </Card.Body>
        </Card>

        <Col className={`text-end ${cx.submitActionBox}`}>
          <button
            className={`btn ${cx.submitBtn}`}
            onClick={() => {
              submitProfile();
            }}
          >
            Update profile{" "}
          </button>
        </Col>

        <Card className={`${lx.restPassword}`}>
          <Card.Title>Reset Your Password</Card.Title>
          <Card.Body>
            <Card.Text>
              <Row className="align-items-center">
                <Col lg={8} className={`${lx.changePassword}`}>
                  <Form className="row">
                    <Form.Group
                      className={`col-lg-6 ${cx.formBox}`}
                      controlId=""
                    >
                      <Form.Label>Current Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Enter current password"
                        value={cpassword}
                        onChange={(event) => {
                          setcpassword(event?.target.value);
                        }}
                      />
                    </Form.Group>
                    <Form.Group
                      className={`col-lg-6 ${cx.formBox}`}
                      controlId=""
                    >
                      <Form.Label>New Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Enter new password"
                        value={password}
                        onChange={(event) => {
                          setpassword(event?.target.value);
                        }}
                      />
                    </Form.Group>
                    <Form.Group
                      className={`col-lg-6 ${cx.formBox}`}
                      controlId=""
                    ></Form.Group>
                    <Form.Group
                      className={`col-lg-6 ${cx.formBox}`}
                      controlId=""
                    >
                      <Form.Label>Re-enter New Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Re-enter new password"
                        value={rpassword}
                        onChange={(event) => {
                          setrpassword(event?.target.value);
                        }}
                      />
                    </Form.Group>
                  </Form>
                </Col>

                <Col lg={4} className={`${lx.passwordReminder}`}>
                  <h5>Password Reminder</h5>
                  <p>
                    New passwords must be at least 8 characters in length and
                    must contain at least one number and one accepted special
                    character
                  </p>
                </Col>
              </Row>
            </Card.Text>
          </Card.Body>
        </Card>

        <Col className={`text-end ${cx.submitActionBox}`}>
          <button
            className={`btn ${cx.submitBtn}`}
            onClick={() => {
              submitPassword();
            }}
          >
            Save Password{" "}
          </button>
        </Col>
      </section>
      <Footer />

      <Modal
        className={`${cx.DeletePopup}`}
        show={show}
        onHide={handleClose}
        centered
      >
        <Modal.Body>
          <Col lg={12}>
            <Cropper src={displayImages} guides={true} ref={cropperRef} />
            <br />
            <button
              type="button"
              onClick={() => setShow(false)}
              className={`btn btn-danger ${cx.CancelBtn} mt-3`}
            >
              Cancel
            </button>
            <button
              type="button"
              className={`btn ${cx.submitBtn}`}
              onClick={() => {
                onCrop();
                setShow(false);
              }}
            >
              {" "}
              OK
            </button>
          </Col>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CoachAccount;
