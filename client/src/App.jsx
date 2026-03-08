import { useState, useEffect } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import "./index.css";

const API_BACKEND = "/api";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newTaskText, setNewTaskText] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BACKEND}/get`);
      const data = res.data;
      if (Array.isArray(data)) {
        setTasks(data);
      } else if (data && Array.isArray(data.data)) {
        setTasks(data.data);
      } else if (data && Array.isArray(data.todos)) {
        setTasks(data.todos);
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
      const res = await axios.post(`${API_BACKEND}/new`, {
        task: newTaskText.trim()
      });
      toast.success(res.data.message || "Task added");
      setNewTaskText("");
      fetchTasks();
    } catch (error) {
      toast.error("Error adding task");
      console.error(error);
    }
  };
  // bov khaas chhe
  const handleUpdateTask = async (taskId, updates) => {
    try {
      const res = await axios.put(`${API_BACKEND}/update/${taskId}`, updates);
      toast.success(res.data.message || "Task updated");
      if (selectedTask && selectedTask._id === taskId && updates.task) {

        setSelectedTask({ ...selectedTask, task: updates.task });
      }
      fetchTasks();
    } catch (error) {
      toast.error("Error updating task");
      console.error(error);
    }
  };

  const handleToggleComplete = (task, e) => {
    e.stopPropagation();
    handleUpdateTask(task._id, {
      ...task,
      isCompleted: !task.isCompleted
    });
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const res = await axios.delete(`${API_BACKEND}/delete/${taskId}`);
      toast.success(res.data.message || "Task deleted");
      if (selectedTask && selectedTask._id === taskId) {

        setSelectedTask(null);
      }
      fetchTasks();
    } catch (error) {
      toast.error("Error deleting task");
      console.error(error);
    }
  };

  const filteredTasks = tasks.filter((t) =>
    t.task.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingTasks = filteredTasks.filter((t) => !t.isCompleted);
  // pending stsayud chhe
  const completedTasks = filteredTasks.filter((t) => t.isCompleted);

  return (
    <>
      <Toaster position="top-right" />
      <div className={`app ${selectedTask ? "active-task" : "no-active-task"}`}>
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

            <ul className="task-list-list">
              {loading && <div style={{ padding: "10px" }}>Loading tasks...</div>}
              {!loading && tasks.length === 0 && (
                <div className="task-page-empty" style={{ opacity: 0.7, minHeight: '150px' }}></div>
              )}

              {pendingTasks.length > 0 && (
                <div className="day">
                  <div className="day-header">Pending — {pendingTasks.length}</div>
                  <ul className="tasks flex-col">
                    {pendingTasks.map((t) => (
                      <li key={t._id} className="task-li">
                        <div
                          className={`task ${selectedTask?._id === t._id ? "active" : ""}`}
                          onClick={() => setSelectedTask(t)}
                        >
                          <div className="task-status">
                            {/* handke kare cche code ne */}
                            <input
                              type="checkbox"
                              checked={false}
                              onChange={(e) => handleToggleComplete(t, e)}
                            />
                          </div>
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
                          className={`task task-done ${selectedTask?._id === t._id ? "active" : ""}`}
                          onClick={() => setSelectedTask(t)}
                        >
                          <div className="task-status">
                            <input
                              type="checkbox"
                              checked={true}
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
          <div className={`task-page ${!selectedTask ? "task-page-empty" : ""}`}>
            {selectedTask && (
              <>
                <div className="task-page-header flex-row">
                  <button onClick={() => setSelectedTask(null)}>Close</button>
                  <div className="flex-spacer"></div>
                  <button onClick={() => handleDeleteTask(selectedTask._id)} style={{ color: "var(--red)" }}>
                    Delete
                  </button>
                </div>
                <div className="task-editor flex-col">
                  <div className="textarea-group task-editor-text">
                    <textarea
                      className="textarea-itself"
                      value={selectedTask.task}
                      onChange={(e) => setSelectedTask({ ...selectedTask, task: e.target.value })}
                      onBlur={() => handleUpdateTask(selectedTask._id, selectedTask)}
                    ></textarea>
                  </div>
                  <div className="task-editor-option-row">
                    <div className="task-editor-option-subrow" style={{ color: "var(--secondary-text)" }}>
                      Status: {selectedTask.isCompleted ? "Completed" : "Pending"}
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