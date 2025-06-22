import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useChannel, ChannelProvider } from 'ably/react';
import { incrementUnreadCount } from '../redux/chatSlice';

const NotificationContent = () => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  const { channel } = useChannel(`notifications-${user?.id}`, (message) => {
    if (message.name === 'unread-message') {
      dispatch(incrementUnreadCount());
    }
  });

  return null; // This component doesn't render anything
};

const NotificationListener = () => {
  const user = useSelector(state => state.user);

  if (!user?.id) {
    return null;
  }

  return (
    <ChannelProvider channelName={`notifications-${user.id}`}>
      <NotificationContent />
    </ChannelProvider>
  );
};

export default NotificationListener;
