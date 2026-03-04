import { useState, useEffect, useMemo } from "react";
import { RiCalendarTodoLine } from "react-icons/ri";
import { FiSearch } from "react-icons/fi";
import axios from "axios";
import toast from "react-hot-toast";
import ListItem from "./ListItem";

const ToDoList = () => {
  // stat object for the task
  const initialValue = {
    task: "",
  };

  const [addTask, setAddTask] = useState(initialValue);
  const [todoList, setTodoList] = useState([]);
  const [isListLoading, setIsListLoading] = useState(true);
  const [isButtonLoading, setButtonLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const API_BACKEND = "/api";

  // feeeetch to todo and in to the audioa nd solved thee error 
  const fetchTodoList = async () => {
    try {
      const response = await axios.get(`${API_BACKEND}/get`);

      // app array for this code
      const data = response.data;
      if (Array.isArray(data)) {
        setTodoList(data);
      } else if (data && Array.isArray(data.data)) {
        setTodoList(data.data);
      } else if (data && Array.isArray(data.todos)) {
        setTodoList(data.todos);
      } else {
        setTodoList([]);
      }
    } catch (err) {
      const message =
        err.response?.data?.errorMessage || "wrong todo list";
      console.error("Error:", message);
      toast.error(message);
      setTodoList([]);
    } finally {
      setIsListLoading(false);
    }
  };

  useEffect(() => {
    fetchTodoList();
  }, []);

  // Update input value
  const handleChange = (event) => {
    const { name, value } = event.target;
    setAddTask({ ...addTask, [name]: value });
  };

  // Add a new task or update an existing one
  const handleAddTask = (event) => {
    event.preventDefault();
    if (!addTask.task.trim()) return;

    if (addTask._id) {
      const updatedTask = { ...addTask, task: addTask.task.trim() };

      const headers = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      setButtonLoading(true);
      async function updateTodoList() {
        try {
          const res = await axios.put(
            `${API_BACKEND}/update/${addTask._id}`,
            updatedTask,
            headers
          );
          toast.success(res?.data?.message);

          await fetchTodoList();
          setAddTask(initialValue);
        } catch (err) {
          const message =
            err.response?.data?.errorMessage || "Something todo list";
          console.error("Error:", message);
          toast.error(message);
        } finally {
          setButtonLoading(false);
        }
      }
      updateTodoList();
    } else {
      // Create a new task
      const newTask = {
        task: addTask.task.trim(),
      };

      const headers = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      setButtonLoading(true);
      async function createTodoList() {
        try {
          const res = await axios.post(`${API_BACKEND}/new`, newTask, headers);

          await fetchTodoList();
          toast.success(res?.data?.message);

          setAddTask(initialValue);
        } catch (err) {
          const message =
            err.response?.data?.errorMessage || "Something todo for code";
          console.error("Error:", message);
          toast.error(message);
        } finally {
          setButtonLoading(false);
        }
      }
      createTodoList();
    }
  };

  const buttonText = () => {
    if (isButtonLoading) {
      return "Processing...";
    } else if (addTask._id) {
      return "UPDATE +";
    } else {
      return "ADD +";
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br to-black-600">
      <div className="w-[32rem] m-4 min-h-[24rem] flex flex-col justify-start items-start px-8 py-6 space-y-6 rounded-xl overflow-hidden border border-gray-300 shadow-lg bg-white">
        <div className="flex gap-3 justify-center items-center text-3xl font-semibold ">
          <RiCalendarTodoLine />
          <h1>To-Do List</h1>
        </div>

        {/* button click and enter to thee todo */}
        <form onSubmit={handleAddTask} className="w-full relative">
          <input
            id="task"
            name="task"
            type="text"
            required
            className="block w-full p-3 ps-4 pe-24 text-sm "
            value={addTask.task}
            onChange={(e) => {
              if (!isButtonLoading) {
                handleChange(e);
              }
            }}
            placeholder="Add task"
            autoComplete="off"
          />

          <button
            type="submit"
            disabled={isButtonLoading}
            className={`absolute right-2.5 bottom-[0.30rem] text-white font-semibold rounded-md text-sm px-4 py-2 
      ${isButtonLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-purple-700 transition duration-200"
              }`}
          >
            {buttonText()}
          </button>
        </form>

        {/* Search bar */}
        <div className="w-full relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2">
            <FiSearch size={18} />
          </span>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-md bg-gray-100 focus:ring-purple-500 focus:border-purple-500"
            autoComplete="off"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className=" text-gray-400 hover:text-gray-600 text-lg font-bold"
              aria-label="Clear search"
            >
              &times;
            </button>
          )}
        </div>

        {/* Render tasks using ListItem component */}
        <ListItem
          todoList={todoList.filter((item) =>
            item.task.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          setTodoList={setTodoList}
          setAddTask={setAddTask}
          isListLoading={isListLoading}
          fetchTodoList={fetchTodoList}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
};

export default ToDoList;
