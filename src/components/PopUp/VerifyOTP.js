import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { allApi, API } from "../../apiwrapper";
import { apiURl } from "../../store/actions";
import { SIGNUP_USER_DATA } from "../../store/actions/ActionTypes";
import { SetpopupReducerData } from "../../store/reducer";
import { isValid, validateOTP } from "../../Validation/InputValidation";
function VerifyOTP() {
  const dispatch = useDispatch();
  const { popupReducer, authUser } = useSelector((state) => state);
  const { modalType = "", showModal = false } = popupReducer?.modal;
  const [value, setValue] = useState({
    num1: "",
    num2: "",
    num3: "",
    num4: "",
  });
  const [apiErrors, setApiErrors] = useState({ message: "" });
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(30);
  const { num1 = "", num2 = "", num3 = "", num4 = "" } = value;

  const handleClosePopup = () => {
    dispatch(SetpopupReducerData({ modalType: "", showModal: false }));
  };
  const handleChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
    setApiErrors({ message: "" });
  };
  const handleInput = (e) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value.replace(/[^0-9]/g, ""),
    });
  };
  const inputfocus = (e) => {
    console.log(e.key, "e.key")
    if (e.key === "Delete" || e.key === "Backspace") {
      const next = e.target.tabIndex - 2;
      if (next > -1) {
        e.target.form.elements[next].focus();
      }
    } else {
      console.log("next");
      const next = e.target.tabIndex;
      if (next < 4) {
        e.target.form.elements[next].focus();
      }
    }
  };
  const validateAll = () => {
    let err1 = {};
    err1.message = validateOTP(`${num1}${num2}${num3}${num4}`);
    return err1;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let err = validateAll();
      if (isValid(err)) {
        const payload = {
          email: authUser?.signUpUser?.email.id,
          otp: `${num1}${num2}${num3}${num4}`,
        };
        await allApi({
          url: `${process.env.REACT_APP_USER_BACKENDURL + apiURl.otpverify}`,
          method: "POST",
          body: {
            ...payload,
          },
          headers: {
            "Content-Type": "application/json"
          }
        }).then((data) => {
          console.log(data);
          if (data?.status || data?.status === "true") {
            // toast(`${data?.message}`, { type: "success" });
            if (!Object.keys(authUser?.signUpUser).includes("forgetpassword")) {
              dispatch(
                SetpopupReducerData({ modalType: "LOGIN", showModal: true })
              );
              dispatch({
                type: SIGNUP_USER_DATA,
                payload: null,
              });
            } else {
              dispatch(
                SetpopupReducerData({
                  modalType: "CHANGEPASSWORD",
                  showModal: true,
                })
              );
            }
          } else {
            setApiErrors({ message: data?.message });
          }
        });
      } else {
        setApiErrors(err);
      }
    } catch (error) {
      setApiErrors({ message: error });
    }
  };
  const handleResendOTP = async (e) => {
    e.preventDefault();
    setMinutes(1);
    setSeconds(30);
    try {
      await API({
        url: apiURl.forgetpassword,
        method: "POST",
        body: { email: authUser?.signUpUser?.email },
        formData: false,
      }).then((data) => {
        // toast(`${data?.message}`, { type: "success" });
      });
    } catch (error) {
      toast(error, { type: "error" });
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }

      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval);
        } else {
          setSeconds(59);
          setMinutes(minutes - 1);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [seconds]);
  return (
    <div>
      <Modal show={showModal} hide={handleClosePopup}>
        <div className="pop_content login-screen">
          <div className="close-button" onClick={handleClosePopup}>
            <a href="#">
              <img src="/images/cross-button.svg" />
            </a>
          </div>
          <h2 className="signup-heading">Verify OTP</h2>
          <p className="sign-up-text">
            <span>
              Enter your four digits verification code that <br />
              you received on your registered email.
            </span>
          </p>
          <div className="login-section">
            <form action="" method="post">
              <div className="Verify-otp-div mb-0">
                <input
                  type="text"
                  name="num1"
                  value={num1}
                  maxLength={1}
                  onInput={handleInput}
                  onChange={handleChange}
                  tabIndex="1"
                  onKeyUp={inputfocus}
                // onKeyPress={keyPressed}
                />
                <input
                  type="text"
                  name="num2"
                  value={num2}
                  maxLength={1}
                  onInput={handleInput}
                  onChange={handleChange}
                  tabIndex="2"
                  onKeyUp={inputfocus}
                // onKeyPress={keyPressed}
                />
                <input
                  type="text"
                  name="num3"
                  value={num3}
                  maxLength={1}
                  onInput={handleInput}
                  onChange={handleChange}
                  tabIndex="3"
                  onKeyUp={inputfocus}
                // onKeyPress={keyPressed}
                />
                <input
                  type="text"
                  name="num4"
                  value={num4}
                  onInput={handleInput}
                  onChange={handleChange}
                  maxLength={1}
                  tabIndex="4"
                  onKeyUp={inputfocus}
                // onKeyPress={keyPressed}
                />
              </div>
              {apiErrors.message && (
                <span
                  className="text-danger mb-0 d-block"
                  style={{ fontSize: "14px" }}
                >
                  {apiErrors.message}
                </span>
              )}

              <button className="login-screen-button" onClick={handleSubmit}>
                Verify
              </button>
              <div className="form-div">
                {seconds > 0 || minutes > 0 ? (
                  <p>
                    Time Remaining: {minutes < 10 ? `0${minutes}` : minutes}:
                    {seconds < 10 ? `0${seconds}` : seconds}
                  </p>
                ) : (
                  <p>Didn't recieve code?</p>
                )}
                <p>
                  <a href="#">
                    <img
                      src="/images/resend-icon.svg"
                      style={{ paddingRight: "10px", width: "25p" }}
                    />
                    <button
                      className={`${seconds > 0 || minutes > 0 ? "btn-disable" : "btn-primary"
                        } btn`}
                      onClick={handleResendOTP}
                      disabled={seconds > 0 || minutes > 0}

                    >
                      Resend OTP{" "}
                    </button>
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default VerifyOTP;
