import React, { ChangeEvent } from "react";

interface AuthFieldProps {
  onAliasChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (even: ChangeEvent<HTMLInputElement>) => void;
}

const AuthField: React.FC<AuthFieldProps> = (props: AuthFieldProps) => {
  return (
    <>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          size={50}
          id="aliasInput"
          aria-label="alias"
          placeholder="Alias"
          onChange={props.onAliasChange}
        />
        <label htmlFor="aliasInput">Alias</label>
      </div>
      <div className="form-floating mb-3">
        <input
          type="password"
          className="form-control"
          id="passwordInput"
          aria-label="password"
          placeholder="Password"
          onChange={props.onPasswordChange}
        />
        <label htmlFor="passwordInput">Password</label>
      </div>
    </>
  );
};

export default AuthField;
