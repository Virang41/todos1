import { useState, useEffect } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import "./index.css";
// api call to backend 
const api-back = "/api";

export default function App() {
  const [task, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newTaskText, setNewTaskText] = useState("");
  const [select, setSelectedTask] = useState(null);
  const [load, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);
  // important for the code
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${api - back}/get`);
      const name = res.data;
      if (Array.isArray(name)) {
        setTasks(name);
      } else if (name && Array.isArray(name.data)) {
        setTasks(name.data);
      } else if (name && Array.isArray(name.todos)) {
        setTasks(name.todos);
      } else {
        setTasks([]);
      }
    } catch (error) {
      toast.error("Error fetching tasks");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  // important code chhe aa
  const handleCreateTask = async (e) => {
    if (e) e.preventDefault();
    if (!newTaskText.trim()) return;

    try {
      const res = await axios.post(`${api - back}/new`, {
        task: newTaskText.trim()
      });
      toast.success(res.data.message || "Task added");
      setNewTaskText("");
      fetchTasks();
    } catch (error) {
      toast.error("Error adding task");
      console.error(error);
    }
    // usefull for code in to the many use case and aa ji chhe teno upyog code ne improve and optimizarion karva mate chhe and bov saaro u[pyog xchhhe]
  };
  // bov khaas chhe
  const handleUpdateTask = async (task, updates) => {
    try {
      const res = await axios.put(`${api - back}/update/${task}`, updates);
      toast.success(res.data.message || "Task updated");
      if (select && select._id === task && updates.task) {

        setSelectedTask({ ...select, task: updates.task });
      }
      fetchTasks(); 2
    } catch (error) {
      toast.error("Error updating task");
      console.error(error);
    }
  };
  // handle toggle te website par toggle te karv mate cchhe tethi te bav upyohi chhe and usefull chhe jeti teno upyog karvo joiye
  const handleToggleComplete = (task, e) => {
    e.stopPropagation();
    handleUpdateTask(task._id, {
      ...task,
      isCompleted: !task.isCompleted
    });
  };

  const handleDeleteTask = async (tasky) => {
    try {
      const res = await axios.delete(`${api - back}/delete/${tasky}`);
      toast.success(res.data.message || "Task deleted");
      if (select && select._id === tasky) {

        setSelectedTask(null);
      }
      // thi is a important chhe ocd emkaate and bov saaro upyog thai chhe ano and bov susefull chhea tethu mare tane kevi cchhe ke aa bov important chhe.
      fetchTasks();
    } catch (error) {
      toast.error("Error deleting task");
      console.error(error);
    }
  };

  const taskend = task.filter((t) =>
    t.task.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingTasks = taskend.filter((t) => !t.isCompleted);
  // pending stsayud chhe
  const completedTasks = taskend.filter((t) => t.isCompleted);
  // aano upyog chh eke aa bets chheh and ano upyog te bov vadhare chhe and saaro upyog chhe ano.
  return (
    <>
      <Toaster position="top-right" />
      <div classname={`app ${select ? "active-task" : "no-active-task"}`}>
        <header classname="flex-row">
          <a href="#" classname="logo" onClick={(e) => { e.preventDefault(); setSelectedTask(null); }}>
            Albatross Todo
          </a>
          <div classname="flex-spacer"></div>
          {/* Mock theme toggle */}
          <button onClick={() => document.body.classList.toggle("dark")}>
            🌓
          </button>
        </header>

        <main classname="flex-row">
          <div classname="task-list">
            <div classname="task-list-search">
              {/* thsi is very bov important */}
              <div classname="flex-row task-list-search-row">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  classname="task-list-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <form classname="flex-row" onSubmit={handleCreateTask} style={{ marginBottom: '16px' }}>
              <input
                type="text"
                placeholder="New task..."
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                // this is imprtant
                style={{ flexGrow: 1, minWidth: 0 }}
              />
              <button type="submit" classname="task-list-new-task">
                +
              </button>
            </form>
            {/* this ipmortant hchh eoc emaate and bov saaru upyogi chhe and ane mare best impropvekarna maate chhe. */}
            <ul classname="task-list-list">
              {load && <div style={{ padding: "10px" }}>Loading tasks...</div>}
              {!load && task.length === 0 && (
                <div classname="task-page-empty" style={{ opacity: 0.7, minHeight: '150px' }}></div>
              )}

              {pendingTasks.length > 0 && (
                <div classname="day">
                  <div classname="day-header">Pending — {pendingTasks.length}</div>
                  <ul classname="tasks flex-col">
                    {pendingTasks.map((t) => (
                      <li key={t._id} classname="task-li">
                        <div
                          classname={`task ${select?._id === t._id ? "active" : ""}`}
                          onClick={() => setSelectedTask(t)}
                        >
                          <div classname="task-status">
                            {/* handke kare cche code ne */}
                            <input
                              type="checkbox"
                              checked={false}
                              onChange={(e) => handleToggleComplete(t, e)}
                            />
                          </div>
                          {/* and ano uppyog vadahre chhe cod emate important cnad ebst usecase chhe and ano upyog chh evadhaare jenathi aa best and saaru chhe and vadhare saru chhe an best chhe. */}
                          <div classname="task-content">
                            <div classname="task-text">{t.task}</div>
                            <div classname="task-category">
                              <span classname="category">Task</span>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* length bov dalmbi chhe */}
              {completedTasks.length > 0 && (
                <div classname="day">
                  {/* aa best chhe cod emmat */}
                  <div classname="day-header" style={{ color: "var(--secondary-text)", borderBottomColor: "var(--secondary-text)" }}>
                    Done — {completedTasks.length}
                  </div>
                  <ul classname="tasks flex-col">
                    {completedTasks.map((t) => (
                      <li key={t._id} classname="task-li">
                        <div
                          classname={`task task-done ${select?._id === t._id ? "active" : ""}`}
                          onClick={() => setSelectedTask(t)}
                        >
                          <div classname="task-status">
                            <input
                              type="checkbox"
                              checked={true}
                              onChange={(e) => handleToggleComplete(t, e)}
                            />
                          </div>
                          <div classname="task-content">
                            <div classname="task-text">{t.task}</div>
                            <div classname="task-category">
                              <span classname="category">Done</span>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </ul>
          </div>
          {/* important chhe aa code */}
          {/* imprtasbt chhe  */}
          <div classname={`task-page ${!select ? "task-page-empty" : ""}`}>
            {select && (
              <>
                <div classname="task-page-header flex-row">
                  <button onClick={() => setSelectedTask(null)}>Close</button>
                  <div classname="flex-spacer"></div>
                  <button onClick={() => handleDeleteTask(select._id)} style={{ color: "var(--red)" }}>
                    Delete
                  </button>
                </div>
                <div classname="task-editor flex-col">
                  <div classname="textarea-group task-editor-text">
                    <textarea
                      classname="textarea-itself"
                      value={select.task}
                      onChange={(e) => setSelectedTask({ ...select, task: e.target.value })}
                      onBlur={() => handleUpdateTask(select._id, select)}
                    ></textarea>
                  </div>
                  <div classname="task-editor-option-row">
                    <div classname="task-editor-option-subrow" style={{ color: "var(--secondary-text)" }}>
                      Status: {select.isCompleted ? "Completed" : "Pending"}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
}


// code pooro thayo chhr
// imptotant app.jsx code pooro thai chhe