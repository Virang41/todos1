import ToDoList from "./ToDoList";
import { Toaster } from "react-hot-toast";

// mrn stack app.jsx code
const App = () => {
  return (
    <>
      <ToDoList />

      <Toaster position="top-left" />
    </>
  );
};
// default app
export default App;
