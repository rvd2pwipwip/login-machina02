import React from "react";
import Checkbox from "./Checkbox";
import { Label } from "../SignIn/styles";

class StyledCheckbox extends React.Component {
  state = { checked: false };

  handleCheckboxChange = event => {
    this.setState({ checked: event.target.checked });
  };

  render() {
    return (
      <div style={{ fontFamily: "system-ui" }}>
        <Label>
          <Checkbox
            checked={this.state.checked}
            onChange={this.handleCheckboxChange}
          />
          <span style={{ marginLeft: 10 }}>Keep me logged in</span>
        </Label>
      </div>
    );
  }
}

export default StyledCheckbox;
