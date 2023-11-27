export enum AuthErrorCodes {
  BadRequest = 1,
  Invalid = 2,
  IncorrectPassword = 3
}

export interface AuthMessageSuccess {
  type: 'auth-success';
}

export interface AuthMessageFailure {
  type: 'auth-failure';
  code: AuthErrorCodes;
  message: string;
}

export interface AuthMessageNewToken {
  type: 'auth-new-token';
  name: string;
  token: string;
}

export type ReceivedAuthMessage = AuthMessageSuccess | AuthMessageFailure | AuthMessageNewToken;

export interface AuthMessagePassword {
  type: 'auth-pwd';
  password: string;
}

export interface AuthMessageToken {
  type: 'auth-token';
  token: string;
}

export type SentAuthMessage = AuthMessagePassword | AuthMessageToken;
