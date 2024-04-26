import React, { useEffect } from "react";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { MdVisibility } from "react-icons/md";
import { MdVisibilityOff } from "react-icons/md";
import { IoMdCheckboxOutline } from "react-icons/io";
import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import { CiLogin } from "react-icons/ci";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ReactTyped } from "react-typed";
import Loader from "../Loader";

const LoginDiv = ({ setUser, setLogin, socket, isDisplay, setIsDisplay }) => {
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassWord] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    setIsDisplay(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/login",
        formdata
      );

      if (response.status === 200) {
        localStorage.setItem("token", response.data.data.token);
        setUser(response.data);
        socket.emit("login", {
          userId: response.data.data._id,
          socketId: socket.id,
        });
        navigate(`/dashboard/${response.data.data.username}`);
      } else {
        setMessage("*Internal Error");
        setUser("");
      }
    } catch (error) {
      const { response } = error;
      console.error("Error making the POST request:", response);

      if (response.status === 401) {
        if (response.data.error === "401-USER") setMessage("*User Not Exists");
        else if (response.data.error === "401-PASSWORD")
          setMessage("*Password is Incorrect");
      } else setMessage("*Internal Error");
    } finally {
      setIsDisplay(false);
    }
  };

  const loginHandler = async (event) => {
    event.preventDefault();
    if (formdata["identity"] === "" || formdata["password"] === "") {
      setMessage("Fill all Details...");
      return;
    } else if (formdata["password"].length < 8) {
      setMessage("Password should contains 8 characters...");
      return;
    }

    try {
      await fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const visibilityHandler = (event) => {
    setShowPassWord(!showPassword);
  };

  const [formdata, setFormdata] = useState({
    identity: "",
    password: "",
    rememberMe: false,
  });

  const changeHandler = (event) => {
    const { value, type, checked, name } = event.target;
    setFormdata((state) => {
      return {
        ...state,
        [name]: type === "checkbox" ? checked : value,
      };
    });
    setMessage("");
  };

  const validateData = () => {
    if (formdata.password)
      if (
        formdata.password[0] === " " ||
        formdata.password.split(" ").length > 1
      )
        setMessage("*Password should not contain spaces");
  };

  useEffect(() => {
    validateData();
  }, [formdata]);

  return (
    <div className="flex from-amber-500 to-orange-500 bg-gradient-to-b items-center justify-center w-full h-full select-none cursor-default">
      <Loader isDisplay={isDisplay} />
      <div className="flex w-full from-amber-500 to-orange-500 bg-gradient-to-b gap-y-4 justify-center h-full items-center flex-wrap">
        <div className="text-white px-4 font-bold flex-grow items-center justify-center from-indigo-500 to-purple-500 bg-gradient-to-br h-full group flex flex-col transition-all duration-200 ">
          <div className="flex flex-col">
            <p className="text-5xl xs:text-4xl font-roboto-slab leading-relaxed">
              Welcome to <br />{" "}
              <span className="text-7xl transition-all xs:text-5xl duration-300 font-poppins text-lime-200 group-hover:text-amber-300">
                <ReactTyped
                  strings={["CollaboHub!"]}
                  showCursor={true}
                  typeSpeed={300}
                  backSpeed={50}
                  loop
                />
              </span>
            </p>
            <br />
            <p className="text-3xl xs:text-xl text-pretty max-w-[800px] min-w-0 font-exo leading-13 text-gray-200">
              Immerse yourself in a collaborative work environment that empowers
              your team and enhances project management.
            </p>
          </div>

          <div className="flex items-center justify-center m-4 ">
            <button
              onClick={() => setLogin(false)}
              className="flex  group  hover:scale-105   border-slate-200 transition-all duration-300 font-roboto-slab text-xl items-center justify-center rounded-e-3xl rounded-t-3xl p-4 space-x-2 border "
            >
              <p>Sign Up</p>
              <FaArrowRight className="animate-pulse group-hover:scale-105 group-hover:border-indigo-500" />
            </button>
          </div>
        </div>

        <div className=" text-white bg-amber-500 border-amber-400 border-4 rounded-xl py-4 max-w-[400px]  w-full min-w-[30%] p-2 group flex flex-col items-center    transition-all duration-200 ">
          <div className="text-5xl xs:text-3xl font-poppins  text-white font-bold group-hover:scale-110  transitiom-all duration-1000 text-bold text-center">
            Login
          </div>

          <div className="flex flex-col  items-center mt-9 w-full h-full">
            <form
              className={`flex h-full flex-col items-center justify-center w-full space-y-3 ${
                isDisplay ? "hidden" : ""
              }`}
            >
              <label className="w-full px-10">
                <p className="py-1 text-xl  font-poppins">
                  Email Address/Username
                  <span className="text-orange-700 text-3xl">*</span>
                </p>
                <input
                  onChange={changeHandler}
                  className=" font-poppins placeholder:text-gray-500 text-black text-lg w-full px-3 py-2   shadow border-4 border-transparent focus:border-amber-500 outline-0 bg-amber-200 rounded-lg  "
                  type="text"
                  value={formdata["identity"]}
                  placeholder="Email Address/Username"
                  name="identity"
                ></input>
              </label>
              <label className="w-full px-10">
                <p className="py-1 font-poppins text-xl">
                  Password<span className="text-orange-700 text-3xl">*</span>
                </p>
                <div className="relative">
                  <input
                    onChange={changeHandler}
                    className=" font-poppins placeholder:text-gray-500 text-black text-lg w-full px-3 py-2   shadow border-4 border-transparent focus:border-amber-500 outline-0 bg-amber-200 rounded-lg  "
                    type={showPassword ? "text" : "password"}
                    value={formdata["password"]}
                    placeholder="Password"
                    name="password"
                  ></input>
                  <span
                    onClick={visibilityHandler}
                    className="absolute top-4 right-5 text-gray-600 text-xl"
                  >
                    {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                  </span>
                </div>
              </label>
              <div className="w-full mb-10">
                <label htmlFor="remId" className="w-full relative px-10 flex">
                  <input
                    onChange={changeHandler}
                    id="remId"
                    type="checkbox"
                    value={formdata["rememberMe"]}
                    className="absolute bottom-[0.2rem] hidden"
                    name="rememberMe"
                  />
                  <div className="flex space-x-1 text-xl cursor-pointer justify-center items-center ">
                    {formdata["rememberMe"] ? (
                      <IoMdCheckboxOutline />
                    ) : (
                      <MdOutlineCheckBoxOutlineBlank />
                    )}
                    <p>Remember Me</p>
                  </div>
                </label>
                <span className="italic-text px-10 font-bold text-blue-800">
                  {message}
                </span>
              </div>
              <button
                onClick={loginHandler}
                className="loginButton  px-5 py-2 flex items-center font-poppins text-xl rounded-xl hover:scale-110 transition-all"
              >
                LogIn <CiLogin className="font-extrabold text-3xl" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginDiv;
