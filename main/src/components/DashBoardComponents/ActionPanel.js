import React, { useState, useRef, useEffect } from "react";
import { IoHomeOutline } from "react-icons/io5";
import { IoNotifications } from "react-icons/io5";
import { GiDiscussion } from "react-icons/gi";
import { FaPlus } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { GoProjectSymlink } from "react-icons/go";
import { IoIosArrowDropdown } from "react-icons/io";
import { IoIosArrowDropup } from "react-icons/io";
import { motion } from "framer-motion";

const ActionPanel = (props) => {
  const [project, refreshProject] = useState({});
  const selectedProjectClass = "bg-gray-500 text-white p-1 m-1 text-center";
  const [showProjects, setShowProjects] = useState(false);
  const [arrowIcon, setArrowIcon] = useState(<IoIosArrowDropdown />);
  const toggleShowProjects = () => {
    setShowProjects(!showProjects);
    setArrowIcon(showProjects ? <IoIosArrowDropdown /> : <IoIosArrowDropup />);
  };
  const [selectId, setSelectId] = useState();
  const handleClick = (id) => {
    setSelectId(id);
  };
  const navigate = useNavigate();

  useEffect(() => {
    updateProjects();
    return () => {};
  }, [props.updateStatus, props.user]);

  const navHome = () => {
    navigate(`/dashboard/${props.user.data.username}`);
    handleClick("home");
    return () => {};
  };

  const updateProjects = async () => {
    try {
      console.log(props.user);
      const response = await axios.post(
        process.env.REACT_APP_BASE_URL + "/api/v1/getProjects",
        {
          email: props.user.data.email,
        }
      );
      refreshProject(response);
    } catch (err) {
      console.log(err);
    }
  };

  const [showInput, setShowInput] = useState(false);
  const inputRef = useRef(null);

  const clickHandler = async () => {
    console.log(showInput);
    setShowInput(!showInput);
  };

  const handleClickOutside = (event) => {
    if (
      inputRef.current &&
      !inputRef.current.contains(event.target) &&
      (!event.target.id || event.target.name === "addProject")
    ) {
      setShowInput(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [projectName, setProjectName] = useState("");
  const changeHandler = (event) => {
    setProjectName(event.target.value);
  };

  const createHandler = async (event) => {
    event.preventDefault();
    if (projectName === "") return;

    try {
      const response = await axios.post(
        process.env.REACT_APP_BASE_URL + "/api/v1/createProject",
        {
          projectName: projectName,
          email: props.user.data.email,
        }
      );

      setProjectName("");
      if (response.status === 200) {
        setShowInput(false);
        updateProjects();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      {
        <motion.div
          className="flex justify-center sx:hidden  ml-4 z-0 transition-all duration-300 h-[87vh] select-none "
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="  transition-all duration-300 flex flex-col gap-3">
            <div className=" flex bg-[#fcf8ff] rounded-2xl flex-col items-center transition-all duration-300 text-lg">
              <motion.div
                onClick={navHome}
                className={`flex rounded-xl font-barlow  w-full px-4 font-bold items-center text-center hover:scale-105 transition-all duration-200 cursor-pointer mx-1 gap-3  py-2 text-black ${
                  selectId === "home" ? selectedProjectClass : "hover:bg-white"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IoHomeOutline />
                Home
              </motion.div>
              <NavLink
                to={`/dashboard/discuss`}
                onClick={() => handleClick("discussion")}
                className={`flex rounded-xl font-barlow  w-full px-4 font-bold items-center text-center hover:scale-105 transition-all duration-200 cursor-pointer mx-1 gap-3  py-2 text-black ${
                  selectId === "discussion"
                    ? selectedProjectClass
                    : "hover:bg-white"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <GiDiscussion />
                Discuss
              </NavLink>
              <NavLink
                to={"/dashboard/calender"}
                onClick={() => handleClick("Calender")}
                className={`flex rounded-xl font-barlow  w-full px-4 font-bold items-center text-center hover:scale-105 transition-all duration-200 cursor-pointer mx-1 gap-3   py-2 text-black ${
                  selectId === "Calender"
                    ? selectedProjectClass
                    : "hover:bg-white"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {" "}
                <FaCalendarAlt />
                Calender
              </NavLink>
              <motion.div
                onClick={async () => await clickHandler()}
                id="addProject"
                className="flex rounded-xl font-barlow hover:bg-white w-full  px-4 font-bold items-center text-center min-w-44  overflow-y-hidden  hover:scale-105 transition-all duration-200 cursor-pointer  gap-2  py-2 text-black "
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPlus />
                Projects
              </motion.div>
              {showInput && (
                <form
                  onSubmit={createHandler}
                  className="relative  transition-all font-barlow rounded-xl  duration-300 flex flex-col items-center gap-2 my-2 font-bold justify-center"
                  ref={inputRef}
                >
                  <label className="text-center  text-base font-poppins transition-all duration-300 relative">
                    <input
                      className="rounded-md w-40 transition-all duration-200 mx-2
                    py-1 px-2 bg-purple-100 text-center focus:outline-double focus:outline-purple-800 text-black placeholder:text-zinc-500 flex justify-center "
                      type="text"
                      placeholder="Project Name"
                      name="projectName"
                      autoComplete="off"
                      value={projectName}
                      onChange={changeHandler}
                    />
                  </label>
                  <motion.button
                    className={
                      `${
                        projectName.length > 0
                          ? "bg-green-500"
                          : "bg-gray-500 cursor-not-allowed"
                      }` + " text-white px-4 w-fit rounded-md "
                    }
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Done
                  </motion.button>
                </form>
              )}
            </div>

            <motion.div
              className="w-full font-barlow  max-h-[59vh] relative  bg-[#fcf8ff] rounded-2xl"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.div
                onClick={toggleShowProjects}
                className="text-black flex justify-center gap-2 cursor-pointer hover:bg-slate-200 px-2 py-2 rounded-xl  items-center w-full text-center  text-lg "
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <GoProjectSymlink />
                Catalogue
                <motion.div>{arrowIcon}</motion.div>
              </motion.div>
              <motion.div
                className={`dropdown-content ${showProjects ? "active" : ""}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {showProjects && (
                  <div className="text-xl my-2 text-black max-h-[45vh] h-fit custom-scrollbar rounded-sm  flex flex-col  overflow-y-scroll option">
                    {project.data ? (
                      project.data.data.map((ele) => (
                        <NavLink
                          to={`/dashboard/project/${ele._id}`}
                          key={ele._id}
                          onClick={() => handleClick(ele._id)}
                          className={`flex  items-center px-4 font-bold text-gray-700 transition-all duration-200 cursor-pointer rounded-md mx-1 gap-3 py-2 ${
                            selectId === ele._id
                              ? selectedProjectClass
                              : " hover:bg-gray-100 text-base hover:scale-105"
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="overflow-ellipsis max-w-[130px]  overflow-hidden whitespace-nowrap">
                            {ele.projectName}
                          </div>
                        </NavLink>
                      ))
                    ) : (
                      <div />
                    )}
                  </div>
                )}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      }
    </div>
  );
};

export default ActionPanel;
