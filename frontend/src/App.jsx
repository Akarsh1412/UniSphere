import { Outlet } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import { AblyProvider, ChannelProvider } from "ably/react"; // Added ChannelProvider to import
import * as Ably from "ably";
import AuthProvider from "./components/AuthProvider";

const ablyClient = new Ably.Realtime({
  key: import.meta.env.VITE_ABLY_API_KEY,
  clientId: "community-user-" + Math.random().toString(36).substr(2, 9)
});

function App() {
  return (
    <AblyProvider client={ablyClient}>
      <ChannelProvider channelName="community-posts">
        <ChannelProvider channelName="online-users">
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <AuthProvider>
                <Outlet />
              </AuthProvider>
            </PersistGate>
          </Provider>
        </ChannelProvider>
      </ChannelProvider>
    </AblyProvider>
  );
}

export default App;
