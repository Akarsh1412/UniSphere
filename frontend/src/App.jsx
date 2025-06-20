import { Outlet } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import AuthProvider from "./components/AuthProvider";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <Outlet />
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
