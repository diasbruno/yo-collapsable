import React, { Component } from "react";
import classnames from "classnames";

/**
 * CollasableTabPanel.
 * @param {string}  prefixCls Prefix for a11y.
 * @param {string}  index     Panel index.
 * @param {boolean} isActive  Is panel active?
 * @param {object}  children  React childrens.
 */
class CollasableTabPanel extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.isActive || nextProps.isActive;
  }

  render() {
    const { index, ariaName, isActive, children } = this.props;
    const contentCls = classnames({
      [`collapsable-content`]: true,
      [`collapsable-content-active`]: isActive,
      [`collapsable-content-inactive`]: !isActive
    });

    return (
      <div id={`${ariaName}-${index}`}
           className={contentCls}
           role="tabpanel"
           aria-hidden={!isActive}
           tabIndex={!isActive ? "-1" : "0"}>
        <div className={`collapsable-content-box`}>{children}</div>
      </div>
    );
  }
}

export default CollasableTabPanel;
