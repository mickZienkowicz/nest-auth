import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';

import {
  AuthenticateRequestBody,
  AuthenticateRequestSchema,
  ConfirmEmailRequestBody,
  ConfirmEmailRequestSchema,
  RegisterRequestBody,
  RegisterRequestSchema,
  ProfileRequestSchema,
  ProfileRequestBody,
} from './types';

@Injectable()
export class AuthService {
  private userPool: CognitoUserPool;

  constructor(private configService: ConfigService) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.configService.get<string>('AWS_COGNITO_USER_POOL_ID'),
      ClientId: this.configService.get<string>('AWS_COGNITO_CLIENT_ID'),
    });
  }

  register(registerRequest: RegisterRequestBody) {
    const parseResult = RegisterRequestSchema.safeParse(registerRequest);

    if (parseResult.success === false) {
      throw new Error('Invalid message body');
    }

    const { username, password } = registerRequest;

    return new Promise((resolve, reject) => {
      this.userPool.signUp(username, password, [], null, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.user);
        }
      });
    });
  }

  authenticate(authenticateRequest: AuthenticateRequestBody) {
    const parseResult =
      AuthenticateRequestSchema.safeParse(authenticateRequest);

    if (parseResult.success === false) {
      throw new Error('Invalid message body');
    }

    const { username, password } = authenticateRequest;

    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });

    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: this.userPool,
    });

    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (session) => {
          console.log(session);

          resolve(session.getIdToken().getJwtToken());
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }

  confirmEmail(confirmEmailRequest: ConfirmEmailRequestBody) {
    const parseResult =
      ConfirmEmailRequestSchema.safeParse(confirmEmailRequest);

    if (parseResult.success === false) {
      throw new Error('Invalid message body');
    }

    const { username, code } = confirmEmailRequest;

    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: this.userPool,
    });

    return new Promise((resolve, reject) => {
      cognitoUser.confirmRegistration(code, true, (err) => {
        if (err) {
          reject(err.message);
        } else {
          resolve({ message: 'Email confirmed successfully' });
        }
      });
    });
  }

  profile(profileRequest: ProfileRequestBody) {
    const parseResult = ProfileRequestSchema.safeParse(profileRequest);

    if (parseResult.success === false) {
      throw new Error('Invalid message body');
    }

    const { username } = profileRequest;

    return { email: username };
  }
}
