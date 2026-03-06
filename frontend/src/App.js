import AppRoutes from "./routes/AppRoutes";
import {UserContext} from "./context/UserContext.js"

function App() {
  return (
    <UserContext>
          <AppRoutes/>
    </UserContext>
  );
}

export default App;
