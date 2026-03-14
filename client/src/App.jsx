import { useState, useEffect } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import "./index.css";
// api call to backend 
const apiBack = "/api";

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
      const res = await axios.get(`${apiBack}/get`);
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
      console.error("Fetch Tasks Error:", error.message || error);
      if (error.response) {
        console.error("Response Data:", error.response.data);
        console.error("Response Status:", error.response.status);
      }
    } finally {
      setLoading(false);
    }
  };
  // important code chhe aa
  const handleCreateTask = async (e) => {
    if (e) e.preventDefault();
    if (!newTaskText.trim()) return;

    try {
      const res = await axios.post(`${apiBack}/new`, {
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
  const handleUpdateTask = async (taskId, updates) => {
    try {
      // Sanitize updates to remove internal fields
      const { _id, __v, createdAt, updatedAt, ...sanitizedUpdates } = updates;
      const res = await axios.put(`${apiBack}/update/${taskId}`, sanitizedUpdates);
      toast.success(res.data.message || "Task updated");
      if (select && select._id === taskId) {
        setSelectedTask(res.data.updated || { ...select, ...sanitizedUpdates });
      }
      fetchTasks();
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
      const res = await axios.delete(`${apiBack}/delete/${tasky}`);
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
    t.task?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingTasks = taskend.filter((t) => !t.isCompleted);
  // pending stsayud chhe
  const completedTasks = taskend.filter((t) => t.isCompleted);
  // aano upyog chh eke aa bets chheh and ano upyog te bov vadhare chhe and saaro upyog chhe ano.
  return (
    <>
      <Toaster position="top-right" />
      <div className={`app ${select ? "active-task" : "no-active-task"}`}>
        <header className="flex-row">
          <a href="#" className="logo" onClick={(e) => { e.preventDefault(); setSelectedTask(null); }}>
            Albatross Todo
          </a>
          <div className="flex-spacer"></div>
          {/* Mock theme toggle */}
          <button onClick={() => document.body.classList.toggle("dark")}>
            🌓
          </button>
        </header>

        <main className="flex-row">
          <div className="task-list">
            <div className="task-list-search">
              {/* thsi is very bov important */}
              <div className="flex-row task-list-search-row">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="task-list-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <form className="flex-row" onSubmit={handleCreateTask} style={{ marginBottom: '16px' }}>
              <input
                type="text"
                placeholder="New task..."
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                // this is imprtant
                style={{ flexGrow: 1, minWidth: 0 }}
              />
              <button type="submit" className="task-list-new-task">
                +
              </button>
            </form>
            {/* this ipmortant hchh eoc emaate and bov saaru upyogi chhe and ane mare best impropvekarna maate chhe. */}
            <ul className="task-list-list">
              {load && <div style={{ padding: "10px" }}>Loading tasks...</div>}
              {!load && task.length === 0 && (
                <div className="task-page-empty" style={{ opacity: 0.7, minHeight: '150px' }}></div>
              )}

              {pendingTasks.length > 0 && (
                <div className="day">
                  <div className="day-header">Pending — {pendingTasks.length}</div>
                  <ul className="tasks flex-col">
                    {pendingTasks.map((t) => (
                      <li key={t._id} className="task-li">
                        <div
                          className={`task ${select?._id === t._id ? "active" : ""}`}
                          onClick={() => setSelectedTask(t)}
                        >
                          <div className="task-status">
                            {/* handke kare cche code ne */}
                            <input
                              type="checkbox"
                              checked={t.isCompleted}
                              onChange={(e) => handleToggleComplete(t, e)}
                            />
                          </div>
                          {/* and ano uppyog vadahre chhe cod emate important cnad ebst usecase chhe and ano upyog chh evadhaare jenathi aa best and saaru chhe and vadhare saru chhe an best chhe. */}
                          <div className="task-content">
                            <div className="task-text">{t.task}</div>
                            <div className="task-category">
                              <span className="category">Task</span>
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
                <div className="day">
                  {/* aa best chhe cod emmat */}
                  <div className="day-header" style={{ color: "var(--secondary-text)", borderBottomColor: "var(--secondary-text)" }}>
                    Done — {completedTasks.length}
                  </div>
                  <ul className="tasks flex-col">
                    {completedTasks.map((t) => (
                      <li key={t._id} className="task-li">
                        <div
                          className={`task task-done ${select?._id === t._id ? "active" : ""}`}
                          onClick={() => setSelectedTask(t)}
                        >
                          <div className="task-status">
                            <input
                              type="checkbox"
                              checked={t.isCompleted}
                              onChange={(e) => handleToggleComplete(t, e)}
                            />
                          </div>
                          <div className="task-content">
                            <div className="task-text">{t.task}</div>
                            <div className="task-category">
                              <span className="category">Done</span>
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
          <div className={`task-page ${!select ? "task-page-empty" : ""}`}>
            {select && (
              <>
                <div className="task-page-header flex-row">
                  <button onClick={() => setSelectedTask(null)}>Close</button>
                  <div className="flex-spacer"></div>
                  <button onClick={() => handleDeleteTask(select._id)} style={{ color: "var(--red)" }}>
                    Delete
                  </button>
                </div>
                <div className="task-editor flex-col">
                  <div className="textarea-group task-editor-text">
                    <textarea
                      className="textarea-itself"
                      value={select.task}
                      onChange={(e) => setSelectedTask({ ...select, task: e.target.value })}
                      onBlur={() => handleUpdateTask(select._id, select)}
                    ></textarea>
                  </div>
                  <div className="task-editor-option-row">
                    <div className="task-editor-option-subrow" style={{ color: "var(--secondary-text)" }}>
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