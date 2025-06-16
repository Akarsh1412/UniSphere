import { Outlet } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import AuthProvider from "./components/AuthProvider";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";

function App() {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        }
        persistor={persistor}
      >
        <AuthProvider>
          <Navbar />
          <div className="mt-15">
            <Outlet />
          </div>
          <Footer />
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
