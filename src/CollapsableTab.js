import React, { Component } from "react";
import classNames from "classnames";
import CollapsableTabPanel from "./CollapsableTabPanel";
import Animate from "rc-animate";
import { noop } from './utils';

/**
 * CollapsableTab.
 * @param {string}   className
 * @param {string}   index
 * @param {*}        children
 * @param {object}   openAnimation
 * @param {string}   ariaName
 * @param {*}        header
 * @param {boolean}  isActive
 * @param {Function} onItemClick
 */
const CollapsableTab = (props) => {
  const { className, ariaName, header, children, isActive } = props;
  const key = props.index;

  const headerCls = `collapsable-header`;
  const itemCls = classNames({
    [`collapsable-item`]: true,
    [`collapsable-item-active`]: isActive,
    [className]: className
  });

  return (
    <div className={`${itemCls}`}>
      <div id={`${ariaName}-tab-${key}`}
           className={headerCls}
           onClick={props.onItemClick}
           role="tab"
           tabIndex="0"
           aria-controls={`${ariaName}-${key}`}
           aria-disabled={false}
           aria-expanded={isActive}
           aria-selected={isActive}>
        <i className="arrow"></i>
        <a title={header}>{header}</a>
      </div>
      <Animate showProp="isActive"
               exclusive
               component=""
               animation={props.openAnimation}>
        <CollapsableTabPanel index={key} ariaName={ariaName}
                             isActive={isActive}>
          {children}
        </CollapsableTabPanel>
      </Animate>
    </div>
  );
};

CollapsableTab.defaultProps = {
  isActive: false,
  onItemClick: noop
};

export default CollapsableTab;
