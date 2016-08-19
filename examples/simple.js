// import 'rc-collapse/assets/index.less';
// import 'string.prototype.repeat';
import React from 'react';
import ReactDOM from 'react-dom';
import { Collapsable, CollapsableTab } from '../src';

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

function random() {
  return parseInt(Math.random() * 10, 10) + 1;
}

class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = { accordion: false };
    this.toggle = this.toggle.bind(this);
    this.reRender = this.reRender.bind(this);
    this.setActivityKey = this.setActivityKey.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(activeKey) {
    console.log("changed to " + activeKey);
    this.setState({ activeKey });
  }

  getItems() {
    const items = [];
    for (let i = 0, len = 3; i < len; i++) {
      const key = i + 1;
      items.push(
        <CollapsableTab header={`This is panel header ${key}`} key={key}>
          <p>{text}</p>
        </CollapsableTab>
      );
    }
    items.push(
      <CollapsableTab header={`This is panel header 4`} key="4">
        <Collapsable defaultActiveKey="1" ariaName="B">
          <CollapsableTab header={`This is panel nest panel 1`} key="1">
            <p>{text}</p>
          </CollapsableTab>
          <CollapsableTab header={`This is panel nest panel 2`} key="2">
            <p>{text}</p>
            <input type="text" tabIndex="0" />
          </CollapsableTab>
        </Collapsable>
      </CollapsableTab>
    );

    return items;
  }

  setActivityKey() {
    this.setState({ activeKey: ['2'] });
  }

  reRender() {
    this.setState({ time: random() });
  }

  toggle() {
    this.setState({
      accordion: !this.state.accordion
    });
  }

  render() {
    const accordion = this.state.accordion;
    const btn = accordion ? 'accordion' : 'collapse';
    const activeKey = this.state.activeKey;

    return (
      <div style={{ margin: 20, width: 400 }}>
        <button onClick={this.reRender}>reRender</button>
        <button onClick={this.toggle}>{btn}</button>
        <br/><br/>
        <button onClick={this.setActivityKey}>active header 2</button>
        <br/><br/>
        <Collapsable accordion={accordion}
                     onChange={this.onChange}
                     activeKey={activeKey}
                     ariaName="A">
          {this.getItems()}
        </Collapsable>
      </div>
    );
  }
}

Test.defaultProps = {
  time: random(),
  accordion: false,
  activeKey: ['4']
};

ReactDOM.render(<Test/>, document.getElementById('__react-content'));
