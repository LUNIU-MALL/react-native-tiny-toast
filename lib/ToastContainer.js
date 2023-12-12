import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  ViewPropTypes,
  TextPropTypes,
  ImagePropTypes,
} from 'deprecated-react-native-prop-types';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Easing,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Platform,
  Image,
} from 'react-native';
import {
  getStatusBarHeight,
  getBottomSpace,
} from 'react-native-iphone-x-helper';

const position = {
  TOP: 40 + (Platform.OS === 'ios' ? getStatusBarHeight() : 0),
  BOTTOM: -40 - (Platform.OS === 'ios' ? getBottomSpace() : 0),
  CENTER: 0,
};

const duration = {
  LONG: 3500,
  SHORT: 2000,
};

const ToastContainer = ({
  containerStyle,
  duration: propDuration,
  delay,
  animationDuration,
  visible: propVisible,
  position: propPosition,
  animation,
  shadow,
  shadowColor,
  showText,
  textColor,
  textStyle,
  mask,
  maskColor,
  maskStyle,
  imgSource,
  imgStyle,
  loading = false,
  indicatorSize,
  onHidden,
  onMaskPress,
  children,
}) => {
  const [visible, setVisible] = useState(propVisible);
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      const showTimeout = setTimeout(() => show(), delay);
      return () => clearTimeout(showTimeout);
    }
  }, [visible, delay]);

  useEffect(() => {
    if (propVisible !== visible) {
      if (propVisible) {
        clearTimeout(showTimeout.current);
        clearTimeout(hideTimeout.current);
        showTimeout.current = setTimeout(() => show(), delay);
      } else {
        hide();
      }

      setVisible(propVisible);
    }
  }, [propVisible, delay, visible]);

  const animating = useRef(false);
  const hideTimeout = useRef(null);
  const showTimeout = useRef(null);

  const show = () => {
    clearTimeout(showTimeout.current);
    if (!animating.current) {
      clearTimeout(hideTimeout.current);
      animating.current = true;

      Animated.timing(opacity, {
        toValue: 1,
        duration: animation ? animationDuration : 0,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          animating.current = !finished;
          if (propDuration > 0) {
            hideTimeout.current = setTimeout(() => hide(), propDuration);
          }
        }
      });
    }
  };

  const hide = () => {
    clearTimeout(showTimeout.current);
    clearTimeout(hideTimeout.current);
    if (!animating.current) {
      Animated.timing(opacity, {
        toValue: 0,
        duration: animation ? animationDuration : 0,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          animating.current = false;
          onHidden && onHidden();
        }
      });
    }
  };

  const renderMaskToast = (children) => (
    <TouchableWithoutFeedback
      onPress={() => {
        onMaskPress && onMaskPress();
      }}
    >
      <View
        style={[
          styles.maskStyle,
          maskStyle,
          { backgroundColor: maskColor ? maskColor : '' },
        ]}
      >
        {children}
      </View>
    </TouchableWithoutFeedback>
  );

  const offset = propPosition;
  const toastPosition =
    offset !== 0
      ? offset > 0
        ? { top: offset }
        : { bottom: -offset }
      : { height: '100%' };

  const renderToast =
    visible || animating ? (
      <View
        style={[styles.defaultStyle, toastPosition]}
        pointerEvents='box-none'
      >
        <Animated.View
          style={[
            styles.containerStyle,
            containerStyle,
            {
              opacity: opacity,
            },
            shadow && styles.shadowStyle,
            shadowColor && { shadowColor: shadowColor },
          ]}
          pointerEvents='none'
        >
          {imgSource && (
            <Image resizeMode='contain' style={imgStyle} source={imgSource} />
          )}
          {loading && <ActivityIndicator color='#fff' size={indicatorSize} />}
          {showText && (
            <Text
              style={[
                styles.textStyle,
                textStyle,
                textColor && { color: textColor },
              ]}
            >
              {children}
            </Text>
          )}
        </Animated.View>
      </View>
    ) : null;

  return mask ? renderMaskToast(renderToast) : renderToast;
};

ToastContainer.propTypes = {
  containerStyle: ViewPropTypes.style,
  duration: PropTypes.number,
  delay: PropTypes.number,
  animationDuration: PropTypes.number,
  visible: PropTypes.bool,
  position: PropTypes.number,
  animation: PropTypes.bool,
  shadow: PropTypes.bool,
  shadowColor: PropTypes.string,
  showText: PropTypes.bool,
  textColor: PropTypes.string,
  textStyle: TextPropTypes.style,
  mask: PropTypes.bool,
  maskColor: PropTypes.string,
  maskStyle: ViewPropTypes.style,
  imgSource: PropTypes.any,
  imgStyle: ImagePropTypes.style,
  loading: PropTypes.bool,
  indicatorSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onHidden: PropTypes.func,
  onMaskPress: PropTypes.func,
  children: PropTypes.node,
};

ToastContainer.defaultProps = {
  visible: false,
  duration: duration.SHORT,
  animationDuration: 200,
  animation: true,
  position: position.BOTTOM,
  delay: 0,
  showText: true,
  indicatorSize: 'large',
};

const styles = StyleSheet.create({
  defaultStyle: {
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerStyle: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.85)',
    borderRadius: 5,
  },
  shadowStyle: {
    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 10,
  },
  textStyle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  maskStyle: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});

export default ToastContainer;
export { position, duration };
