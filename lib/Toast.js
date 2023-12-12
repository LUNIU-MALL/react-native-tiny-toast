import React, { useEffect, useState } from 'react';
import RootSiblings from 'react-native-root-siblings';
import ToastContainer, { position, duration } from './ToastContainer';

const Toast = (props) => {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const createToast = () => {
      setToast(new RootSiblings(<ToastContainer {...props} duration={0} />));
    };

    createToast();

    return () => {
      if (toast instanceof RootSiblings) {
        toast.destroy();
      }
    };
  }, [props]);

  useEffect(() => {
    if (toast instanceof RootSiblings) {
      toast.update(<ToastContainer {...props} duration={0} />);
    }
  }, [props]);

  const hideToast = (toastInstance) => {
    if (toastInstance instanceof RootSiblings) {
      toastInstance.destroy();
    } else if (toast instanceof RootSiblings) {
      toast.destroy();
    }
  };

  return null;
};

Toast.propTypes = ToastContainer.propTypes;
Toast.position = position;
Toast.duration = duration;

Toast.showSuccess = (message, options = {}) => {
  return Toast.show(message, {
    containerStyle: {
      minWidth: 105,
      minHeight: 105,
      backgroundColor: 'rgba(30,30,30,.85)',
    },
    imgStyle: {
      width: 45,
      height: 45,
    },
    textStyle: {
      marginTop: 10,
    },
    position: Toast.position.CENTER,
    imgSource: require('./icon_success.png'),
    ...options,
  });
};

Toast.showLoading = (message, options = {}) => {
  return Toast.show(message, {
    containerStyle: {
      minWidth: 90,
      minHeight: 80,
      backgroundColor: 'rgba(30,30,30,.85)',
    },
    textStyle: {
      fontSize: 14,
      top: 6,
    },
    mask: true,
    duration: 0,
    loading: true,
    position: Toast.position.CENTER,
    ...options,
  });
};

Toast.show = (message, options = {}) => {
  let onHidden = options.onHidden;
  let toast;
  options.onHidden = function () {
    if (toast instanceof RootSiblings) {
      toast.destroy();
    } else if (Toast.toast instanceof RootSiblings) {
      Toast.toast.destroy();
    }
    onHidden && onHidden();
  };

  toast = new RootSiblings(
    (
      <ToastContainer {...options} visible={true} showText={!!message}>
        {message}
      </ToastContainer>
    )
  );

  return toast;
};

Toast.hide = (toastInstance) => {
  if (toastInstance instanceof RootSiblings) {
    toastInstance.destroy();
  } else if (Toast.toast instanceof RootSiblings) {
    Toast.toast.destroy();
  }
};

export { RootSiblings as Manager };
export default Toast;
