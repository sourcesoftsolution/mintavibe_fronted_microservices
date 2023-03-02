import axios from "axios";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { allApi, API } from "../../apiwrapper";
import { apiURl } from "../../store/actions";

import { SIGNUP_USER_DATA } from "../../store/actions/ActionTypes";
import { SetpopupReducerData } from "../../store/reducer";
import {
  isValid,
  validateCPassWord,
  validateEmail,
  validateFirstName,
  validateLastName,
  validateMobile,
  validatePassWord,
} from "../../Validation/InputValidation";
function SignUp() {
  const dispatch = useDispatch();
  const { popupReducer } = useSelector((state) => state);
  const { modalType = "", showModal = false } = popupReducer?.modal;
  const [inpData, setInpData] = useState({
    firstname: "",
    lastname: "",
    contact: "",
    email: "",
    password: "",
    cpassword: "",
  });
  const [errors, setErrors] = useState({});
  const [apiErrors, setApiErrors] = useState({ message: "" });

  const [showPass, setShowPass] = useState(false);
  const [showCPass, setShowCPass] = useState(false);
  const [termsService, setTermsService] = useState(false);
  const [location, setLocation] = useState({});

  let regexNum = /^(?=.*[0-9])/;
  let regexSmlChar = /^(?=.*[a-z])/;
  let regexUprChar = /^(?=.*[A-Z])/;
  let regexSpclChar = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  const { firstname, lastname, contact, email, password, cpassword } = inpData;
  const handleClosePopup = () => {
    dispatch(SetpopupReducerData({ modalType: "", showModal: false }));
  };

  const handleChange = (e) => {
    setInpData({ ...inpData, [e.target.name]: e.target.value });
    handleValidate(e);
    setApiErrors({ message: "" });
  };
  const handleValidate = (e) => {
    const errors1 = {};
    switch (e.target.name) {
      case "firstname":
        errors1.firstname = validateFirstName(e.target.value);
        break;
      case "lastname":
        errors1.lastname = validateLastName(e.target.value);
        break;
      case "email":
        errors1.email = validateEmail(e.target.value);
        break;
      case "contact":
        errors1.contact = validateMobile(e.target.value);
        break;
      case "password":
        errors1.password = validatePassWord(e.target.value);
        break;
      case "cpassword":
        errors1.cpassword = validateCPassWord(e.target.value, password);
        break;
      default:
        break;
    }
    setErrors(errors1);
  };
  const validateAll = () => {
    let err1 = {};
    err1.firstname = validateFirstName(firstname);
    err1.lastname = validateLastName(lastname);
    err1.email = validateEmail(email);
    err1.contact = validateMobile(contact);
    err1.password = validatePassWord(password);
    err1.cpassword = validateCPassWord(cpassword, password);
    return err1;
  };
  const handleLogin = () => {
    dispatch(SetpopupReducerData({ modalType: "LOGIN", showModal: true }));
  };
  const handleTCS = async (e) => {
    try {
      setTermsService(e.target.checked);
      const res = await axios.get("https://geolocation-db.com/json/");
      setLocation(res?.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let err = validateAll();
      if (isValid(err)) {

        inpData["location"] = JSON.stringify(location);
        inpData["termsService"] = termsService;

        await allApi({
          url: `${process.env.REACT_APP_USER_BACKENDURL + apiURl.User}`,
          method: "POST",
          body: inpData,
          headers: {
            "Content-Type": "application/json"
          }
        }).then((data) => {
          const { Data } = data
          if (Data?.status || Data?.status === "true") {
            dispatch(
              SetpopupReducerData({ modalType: "OTP", showModal: true })
            );
            dispatch({
              type: SIGNUP_USER_DATA,
              payload: Data?.Save,
            });
          } else {
            setApiErrors({ message: data?.message });
          }
        });
      } else {
        setErrors(err);
      }
    } catch (error) {
      setApiErrors({ message: error?.message });
    }
  };
  return (
    <div>
      <Modal size="lg offerPoup" show={showModal} hide={handleClosePopup}>
        <div className="pop_content login-screen">
          <div>
            <div className="close-button" onClick={handleClosePopup}>
              <a href="#">
                <img src="/images/cross-button.svg" />
              </a>
            </div>
            <h2>Sign Up</h2>
            {/* <p className="sign-up-text">
              <span>Please fill in this form to create an account!</span>
            </p> */}
          </div>
          <div className="login-section">
            <form>
              <div className="row">
                <div className="form-div col-sm-6">
                  <label for="name">
                    Full Name <span className="text-danger"> *</span>
                  </label>
                  <input
                    type="text"
                    id="First_Name"
                    name="firstname"
                    value={firstname}
                    placeholder="First Name"
                    onBlur={handleValidate}
                    onChange={handleChange}
                  />
                  {errors.firstname ? (
                    <span className="text-danger" style={{ fontSize: "14px" }}>
                      {errors.firstname}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="form-div col-sm-6">
                  <label for="name">
                    Last Name <span className="text-danger"> *</span>
                  </label>
                  <input
                    type="text"
                    id="Last_Name"
                    name="lastname"
                    value={lastname}
                    placeholder="Last Name"
                    onBlur={handleValidate}
                    onChange={handleChange}
                  />
                  {errors.lastname ? (
                    <span className="text-danger" style={{ fontSize: "14px" }}>
                      {errors.lastname}
                    </span>
                  ) : (
                    ""
                  )}
                </div>

                <div className="form-div col-sm-6">
                  <label for="name">
                    Email <span className="text-danger"> *</span>
                  </label>
                  <input
                    type="email"
                    id="Email"
                    name="email"
                    value={email}
                    placeholder="Email"
                    onBlur={handleValidate}
                    onChange={handleChange}
                  />
                  {errors.email ? (
                    <span className="text-danger" style={{ fontSize: "14px" }}>
                      {errors.email}
                    </span>
                  ) : (
                    ""
                  )}
                </div>

                <div className="form-div col-sm-6">
                  <label for="name">Contact#</label>
                  <input
                    className="input[type=number]::-webkit-outer-spin-button"
                    type="number"
                    id="contact"
                    name="contact"
                    value={contact}
                    placeholder="Contact"
                    onBlur={handleValidate}
                    onChange={handleChange}
                  />
                  {errors.contact ? (
                    <span className="text-danger" style={{ fontSize: "14px" }}>
                      {errors.contact}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="form-div col-sm-6">
                  <label for="name">
                    Passw̵ord <span className="text-danger"> *</span>
                  </label>
                  <input
                    type={showPass ? "text" : "password"}
                    name="password"
                    autocomplete=""
                    value={password}
                    placeholder="Password"
                    id="id_password"
                    onBlur={handleValidate}
                    onChange={handleChange}
                  />
                  <i
                    className={`${showPass ? " fa fa-eye " : " fa fa-eye-slash "
                      } eye-icon`}
                    id="togglePassword"
                    onClick={() => setShowPass(!showPass)}
                  ></i>
                  {errors.password ? (
                    <>
                      <span
                        className="text-danger"
                        style={{ fontSize: "14px" }}
                      >
                        {`${errors.password}`}
                      </span>
                      <ul>
                        <li
                          className={
                            password.length >= 8
                              ? "text-success"
                              : "text-danger"
                          }
                          style={{ fontSize: "14px" }}
                        >
                          {password.length >= 8 && (
                            <i className="fas fa-check-circle"></i>
                          )}
                          8 characters
                        </li>

                        <li
                          className={
                            regexUprChar.test(password)
                              ? "text-success"
                              : "text-danger"
                          }
                          style={{ fontSize: "14px" }}
                        >
                          {regexUprChar.test(password) && (
                            <i className="fas fa-check-circle"></i>
                          )}{" "}
                          1 Uppercase{" "}
                        </li>
                        <li
                          className={
                            regexNum.test(password)
                              ? "text-success"
                              : "text-danger"
                          }
                          style={{ fontSize: "14px" }}
                        >
                          {regexNum.test(password) && (
                            <i className="fas fa-check-circle"></i>
                          )}{" "}
                          1 Number{" "}
                        </li>
                        <li
                          className={
                            regexSpclChar.test(password)
                              ? "text-success"
                              : "text-danger"
                          }
                          style={{ fontSize: "14px" }}
                        >
                          {regexSpclChar.test(password) && (
                            <i className="fas fa-check-circle"></i>
                          )}{" "}
                          1 Special character
                        </li>
                      </ul>
                    </>
                  ) : (
                    ""
                  )}
                </div>
                <div className="form-div col-sm-6 ">
                  <label for="name">
                    Confirm Password <span className="text-danger"> *</span>
                  </label>
                  <input
                    type={showCPass ? "text" : "password"}
                    name="cpassword"
                    value={cpassword}
                    autocomplete=""
                    placeholder="Confirm Password"
                    id="id_password"
                    onBlur={handleValidate}
                    onChange={handleChange}
                    disabled={!password || false}
                  />
                  <i
                    className={`${showCPass ? " fa fa-eye " : " fa fa-eye-slash "
                      } eye-icon`}
                    id="togglePassword"
                    onClick={() => setShowCPass(!showCPass)}
                  ></i>
                  {errors.cpassword ? (
                    <span className="text-danger" style={{ fontSize: "14px" }}>
                      {errors.cpassword}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              {apiErrors.message && (
                <span
                  className="text-danger mb-2 d-block"
                  style={{ fontSize: "14px" }}
                >
                  {apiErrors.message}
                </span>
              )}
              <div className="form-div  ">
                <div className="check-box-div" style={{ width: "100%" }}>
                  <input
                    type="checkbox"
                    className="check-button"
                    name="remember"
                    onChange={handleTCS}
                  />
                  <span style={{ fontSize: "12px" }}>
                    {" "}
                    I agree to the mintavibe
                    <Link to={"/terms-service"} target={"_blank"}>
                      {" "}
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to={"privacy-policy"} target={"_blank"}>
                      {" "}
                      Privacy Policy{" "}
                    </Link>
                  </span>
                </div>
              </div>
              <button
                className="login-screen-button"
                type="submit"
                onClick={handleSubmit}
                disabled={!termsService || false}
              >
                Register
              </button>
              <div className="form-div">
                <p>
                  Are you already a member?
                  <Link style={{ paddingLeft: "22px" }} onClick={handleLogin}>
                    Log in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default SignUp;
