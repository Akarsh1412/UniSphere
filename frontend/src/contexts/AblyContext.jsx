import { createContext, useContext, useEffect, useState } from 'react';
import { Realtime } from 'ably';
import { AblyProvider } from 'ably/react';

const AblyContext = createContext();

export const useAbly = () => {
  const context = useContext(AblyContext);
  if (!context) {
    throw new Error('useAbly must be used within an AblyProvider');
  }
  return context;
};

export const AblyContextProvider = ({ children, user }) => {
  const [client, setClient] = useState(null);

  useEffect(() => {
    if (user?.id) {
      const ablyClient = new Realtime({
        key: import.meta.env.VITE_ABLY_API_KEY,
        clientId: user.id.toString(),
        authCallback: async (tokenParams, callback) => {
          try {
            // Optional: implement token-based auth for production
            callback(null, import.meta.env.VITE_ABLY_API_KEY);
          } catch (error) {
            callback(error, null);
          }
        }
      });

      setClient(ablyClient);

      return () => {
        ablyClient.close();
      };
    } else {
      setClient(null);
    }
  }, [user]);

  if (!client) {
    return <div>Connecting to chat...</div>;
  }

  return (
    <AblyProvider client={client}>
      <AblyContext.Provider value={{ client }}>
        {children}
      </AblyContext.Provider>
    </AblyProvider>
  );
};
