import React, { Component } from 'react';
import RootSiblings from 'react-native-root-siblings';
import ToastContainer, { position, duration } from './ToastContainer';
import { Platform } from 'react-native';

class Toast extends Component {
  static propTypes = ToastContainer.propTypes;
  static position = position;
  static duration = duration;
  static showSuccess(message, options = {}) {
    this.show(message, {
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
      position: this.position.CENTER,
      imgSource: require('./icon_success.png'),
      ...options,
    });
  }

  static showLoading(message, options = {}) {
    this.show(message, {
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
      position: this.position.CENTER,
      ...options,
    });
  }

  static show(message, options = {}) {
    let toast;

    if (Platform.OS === 'web') {
      console.log('show=====');
      const toastInstance = new ToastWeb({ message, options });

      console.log(toastInstance);

      toast = toastInstance.show();

      console.log(toast);

      return <ToastWeb />;
    } else {
      toast = ToastNative.show(message, options);
    }

    this.toast = toast;
    return toast;
  }

  static hide(toast) {
    if (Platform.OS === 'web') {
      ToastWeb.hide();
    } else {
      ToastNative.hide(toast);
    }
  }

  render() {
    return null;
  }
}

class ToastNative extends Component {
  static show(message, options = {}) {
    let onHidden = options.onHidden;
    let toast;
    options.onHidden = function () {
      toast && toast.destroy();
      onHidden && onHidden();
    };
    toast = new RootSiblings(
      (
        <ToastContainer {...options} visible={true} showText={!!message}>
          {message}
        </ToastContainer>
      )
    );
    this.toast = toast;
    return toast;
  }

  static hide(toast) {
    if (toast instanceof RootSiblings) {
      toast.destroy();
    } else if (this.toast instanceof RootSiblings) {
      this.toast.destroy();
    }
  }

  toast = null;

  componentWillMount() {
    this.toast = new RootSiblings(
      <ToastContainer {...this.props} duration={0} />
    );
  }

  componentWillReceiveProps(nextProps) {
    this.toast.update(<ToastContainer {...nextProps} duration={0} />);
  }

  componentWillUnmount() {
    this.toast.destroy();
  }

  render() {
    return null;
  }
}

export class ToastWeb extends Component {
  constructor(props) {
    console.log(props);
    super(props);
    this.state = { isVisible: false };
    this.isComponentMounted = false; // Added flag to track component mount status
  }

  componentDidMount() {
    this.isComponentMounted = true;
  }

  componentWillUnmount() {
    this.isComponentMounted = false;
  }

  show() {
    console.log('this.props   = ', this.props);
    const { options, message } = this.props;
    if (this.isComponentMounted) {
      this.setState({ isVisible: true }, () => {
        const { onHidden } = this.props.options;
        onHidden && onHidden();
      });
    }

    return (
      <ToastContainer {...options} visible={true} showText={!!message}>
        {message}
      </ToastContainer>
    );
  }

  static hide() {
    if (this.isComponentMounted) {
      this.setState({ isVisible: false });
    }
  }

  render() {
    console.log('render.....');
    const { isVisible } = this.state;
    const { options, message } = this.props;

    return (
      isVisible && (
        <ToastContainer {...options} visible={isVisible} showText={!!message}>
          {message}
        </ToastContainer>
      )
    );
  }
}

export { RootSiblings as Manager };
export default Toast;
