import React from "react";
import Checkbox from "./Checkbox";

class StyledCheckbox extends React.Component {
  state = { checked: false };

  handleCheckboxChange = event => {
    this.setState({ checked: event.target.checked });
  };

  render() {
    return (
      <div style={{ fontFamily: "system-ui" }}>
        <label>
          <Checkbox
            checked={this.state.checked}
            onChange={this.handleCheckboxChange}
          />
          <span style={{ marginLeft: 8 }}>Keep me logged in</span>
        </label>
      </div>
    );
  }
}

export default StyledCheckbox;
