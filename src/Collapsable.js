import React, { Children } from "react";
import * as aria from './aria';
import {
  KeyCodes, isNextKey, isPrevKey, isKeyDownOnTabElement
} from "./keyboard";
import openAnimationFactory from "./openAnimationFactory";
import { toArray } from './utils';
import CollapsableTab from "./CollapsableTab";

const focusableRe = /input|select|textarea|button|object/;

/**
 * Collapsable.
 * @param {Panel}    children         List of Panels.
 * @param {string}   ariaName         Prefix of the Collapsable for a11y.
 * @param {array}    activeKey        List of active keys.
 * @param {array}    defaultActiveKey List of the default active keys.
 * @param {object}   openAnimation    Use animation?
 * @param {Function} onChange         Callback when it changes the panel.
 * @param {boolean}  mode             Accordeon
 */
class Collapsable extends React.Component {
  constructor(props) {
    super(props);

    const { activeKey, defaultActiveKey } = props;

    let currentActiveKey = defaultActiveKey;
    if ("activeKey" in props) {
      currentActiveKey = activeKey;
    }

    this.state = {
      openAnimation: props.openAnimation ||
        openAnimationFactory(props.ariaName),
      activeKey: toArray(currentActiveKey)
    };

    this.getNextActiveKey = this.getNextActiveKey.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.setFocusOnTab = this.setFocusOnTab.bind(this);
    this.changeTab = this.changeTab.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if ("activeKey" in nextProps) {
      this.setState({
        activeKey: toArray(nextProps.activeKey)
      });
    }

    if ("openAnimation" in nextProps) {
      this.setState({
        openAnimation: nextProps.openAnimation
      });
    }
  }

  onClickItem(key) {
    return () => {
      let activeKey = this.state.activeKey;
      if (this.props.accordion) {
        activeKey = activeKey[0] === key ? [] : [key];
      } else {
        activeKey = [...activeKey];
        const index = activeKey.indexOf(key);
        const isActive = index > -1;
        if (isActive) {
          // remove active state
          activeKey.splice(index, 1);
        } else {
          activeKey.push(key);
        }
      }
      this.changeTab(activeKey);
    };
  }

  setFocusOnTab(activeKey) {
    const tag = this.props.ariaName;
    let active = activeKey;
    if (Array.isArray(activeKey)) {
      active = activeKey[0];
    }
    const el = document.querySelector(
      `[aria-controls=${tag}-${active}]`
    );
    (el) && el.focus();
  }

  changeTab(key) {
    const { onChange } = this.props;
    this.setActiveKey(key);
    this.setFocusOnTab(key);
    (this.state.activeKey !== key) && onChange(key);
  }

  onKeyDown(event) {
    const eventKeyCode = event.keyCode;
    const nodeName = event.target.nodeName.toLowerCase();
    const focusable = focusableRe.test(nodeName);
    const isValidTab = isKeyDownOnTabElement(
      this.props.ariaName,
      event.target
    );

    if (!focusable && isValidTab) {
      if (eventKeyCode === KeyCodes.ENTER) {
        const ariaid = event.target.getAttribute("aria-controls");
        this.changeTab(aria.findId(ariaid));
      } else if (isNextKey(eventKeyCode)) {
        event.preventDefault();
        const nextKey = this.getNextActiveKey(true);
        this.changeTab(nextKey);
      } else if (isPrevKey(eventKeyCode)) {
        event.preventDefault();
        const previousKey = this.getNextActiveKey(false);
        this.changeTab(previousKey);
      }
    }

    return true;
  }

  getNextActiveKey(next) {
    const isAccordion = this.props.accordion;
    const activeKey = this.state.activeKey;
    const children = [];

    React.Children.map(this.props.children, (c) => {
      if (!c.props.disabled && next) {
        children.push(c);
      } else {
        children.unshift(c);
      }
    });

    const length = children.length;
    let ret = length && children[0].key;
    children.forEach((child, i) => {
      if (child.key === activeKey[0]) {
        if (i === length - 1) {
          ret = children[0];
        } else {
          ret = children[i + 1];
        }
        ret = ret.key;
      }
    });

    return ret;
  }

  getItems() {
    const activeKey = this.state.activeKey;
    const { ariaName, accordion } = this.props;
    return Children.map(this.props.children, (child, index) => {
      // If there is no key provide, use the panel order as default key
      const key = child.key || String(index);
      const header = child.props.header;

      let isActive = false;
      if (accordion) {
        isActive = activeKey[0] === key;
      } else {
        isActive = activeKey.indexOf(key) > -1;
      }

      const props = {
        key,
        index: key,
        header,
        isActive,
        ariaName,
        openAnimation: this.state.openAnimation,
        children: child.props.children,
        onItemClick: this.onClickItem(key).bind(this)
      };

      return React.cloneElement(child, props);
    });
  }

  setActiveKey(activeKey) {
    if (!("activeKey" in this.props)) {
      this.setState({ activeKey });
    }
    this.props.onChange(this.props.accordion ? activeKey[0] : activeKey);
  }

  render() {
    const ariaName = this.props.ariaName;

    return (
      <div id={ariaName}
           onKeyDown={this.onKeyDown}
           className={`collapsable ${ariaName}`}
           role="tablist">
        {this.getItems()}
      </div>
    );
  }
}

Collapsable.defaultProps = {
  ariaName: "collapsable",
  onChange() {},
  accordion: false
};

export default Collapsable;
