import React from "react";
import styled, { css } from "styled-components";

const CheckboxContainer = styled.div`
  display: inline-block;
  vertical-align: middle;
`;

const Icon = styled.svg`
  fill: none;
  stroke: white;
  stroke-width: 3px;
`;
// Hide checkbox visually but remain accessible to screen readers.
// Source: https://polished.js.org/docs/#hidevisually
const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
  border: 0;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

const StyledCheckbox = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  box-shadow: 0 0 0 2px var(--color-border);
  background: ${props =>
    props.checked ? css`var(--color-border)` : css`var(--color-background)`};
  /* background: ${props => (props.checked ? "salmon" : "papayawhip")}; */
  border-radius: 3px;
  transition: all 150ms;

  

  ${HiddenCheckbox}:focus + & {
    box-shadow: 0 0 0 3px var(--color-focus);
  }

  ${Icon} {
    visibility: ${props => (props.checked ? "visible" : "hidden")};
  }
`;

const Checkbox = ({ className, checked, ...props }) => (
  <CheckboxContainer className={className}>
    <HiddenCheckbox checked={checked} {...props} />
    <StyledCheckbox checked={checked}>
      <Icon viewBox="0 0 24 24">
        <polyline points="20 6 9 17 4 12" />
      </Icon>
    </StyledCheckbox>
  </CheckboxContainer>
);

export default Checkbox;
