import React, { Component, createRef } from "react";
import { Machine } from "react-xstate-js";
import machineConfig from "./machineConfig";
import { actions } from "xstate";
import { isEmail } from "validator";
import isPasswordShort from "./isPasswordShort";
import contactAuthService from "./contactAuthService";
import Loader from "../Loader";
import StyledCheckbox from "../Checkbox/index";

import {
  Form,
  H1,
  Label,
  Recede,
  Input,
  ErrMsg,
  Button,
  Authenticated
  // MetaWrapper,
  // Pre
} from "./styles";

const { assign } = actions;
const delay = func => setTimeout(() => func());

class SignIn extends Component {
  state = {};
  emailInputRef = createRef();
  passwordInputRef = createRef();
  submitBtnRef = createRef();

  machineOptions = {
    actions: {
      focusEmailInput: () => {
        // work-around: this action is triggered before the button is un-disabled, else it wouldn't get focused
        delay(this.emailInputRef.current.focus());
      },
      focusPasswordInput: () => {
        delay(this.passwordInputRef.current.focus());
      },
      focusSubmitBtn: () => {
        delay(this.submitBtnRef.current.focus());
      },
      cacheEmail: assign((ctx, evt) => ({
        email: evt.value
      })),
      cachePassword: assign((ctx, evt) => ({
        password: evt.value
      })),
      // We’ll log a note in the console to confirm authentication
      onAuthentication: () => {
        console.log("user authenticated");
      }
    },
    guards: {
      isBadEmailFormat: ctx => !isEmail(ctx.email),
      isPasswordShort: ctx => isPasswordShort(ctx.password),
      isNoAccount: (ctx, evt) => evt.data.code === 1,
      isIncorrectPassword: (ctx, evt) => evt.data.code === 2,
      isServiceErr: (ctx, evt) => evt.data.code === 3
    },
    services: {
      requestSignIn: ctx => contactAuthService(ctx.email, ctx.password)
    }
  };

  render() {
    return (
      <Machine config={machineConfig} options={this.machineOptions}>
        {({ service, state }) => {
          const disableEmail =
            state.matches("passwordErr") ||
            state.matches("awaitingResponse") ||
            state.matches("serviceErr");

          const disablePassword =
            state.matches("emailErr") ||
            state.matches("awaitingResponse") ||
            state.matches("serviceErr");

          const disableSubmit =
            state.matches("emailErr") ||
            state.matches("passwordErr") ||
            state.matches("awaitingResponse");

          const fadeHeading =
            state.matches("emailErr") ||
            state.matches("passwordErr") ||
            state.matches("awaitingResponse") ||
            state.matches("serviceErr");

          //rvTest
          const disableCheckbox =
            state.matches("emailErr") ||
            state.matches("passwordErr") ||
            state.matches("awaitingResponse") ||
            state.matches("serviceErr");

          //rvTest

          return (
            <Form
              onSubmit={e => {
                e.preventDefault();
                service.send({ type: "SUBMIT" });
              }}
              noValidate
            >
              <H1 fade={fadeHeading}>Log In</H1>

              <Label htmlFor="email" disabled={disableEmail}>
                email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="user@email.com"
                onBlur={() => {
                  service.send({ type: "EMAIL_BLUR" });
                }}
                value={state.context.email}
                err={state.matches("emailErr")}
                disabled={disableEmail}
                onChange={e => {
                  service.send({
                    type: "ENTER_EMAIL",
                    value: e.target.value
                  });
                }}
                ref={this.emailInputRef}
                autoFocus
              />
              <ErrMsg>
                {state.matches({ emailErr: "badFormat" }) &&
                  "email format doesn't look right"}
                {state.matches({ emailErr: "noAccount" }) &&
                  "no account linked with this email"}
              </ErrMsg>

              <Label htmlFor="password" disabled={disablePassword}>
                password <Recede>(min. 8 characters)</Recede>
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Passw0rd!"
                value={state.context.password}
                err={state.matches("passwordErr")}
                disabled={disablePassword}
                onBlur={() => {
                  service.send({ type: "PASSWORD_BLUR" });
                }}
                onChange={e => {
                  service.send({
                    type: "ENTER_PASSWORD",
                    value: e.target.value
                  });
                }}
                ref={this.passwordInputRef}
              />
              <ErrMsg>
                {state.matches({ passwordErr: "tooShort" }) &&
                  "password too short (min. 8 characters)"}
                {state.matches({ passwordErr: "incorrect" }) &&
                  "incorrect password"}
              </ErrMsg>

              <StyledCheckbox fade={fadeHeading} />

              <Button
                type="submit"
                disabled={disableSubmit}
                loading={state.matches("awaitingResponse")}
                ref={this.submitBtnRef}
              >
                {state.matches("awaitingResponse") && (
                  <>
                    loading
                    <Loader />
                  </>
                )}
                {state.matches("serviceErr") && "retry"}
                {!state.matches("awaitingResponse") &&
                  !state.matches("serviceErr") &&
                  "sign in"}
              </Button>
              <ErrMsg>
                {state.matches("serviceErr") && "problem contacting server"}
              </ErrMsg>

              {state.matches("signedIn") && (
                <Authenticated>
                  <H1>authenticated</H1>
                </Authenticated>
              )}
            </Form>
          );
        }}
      </Machine>
    );
  }
}

export default SignIn;
