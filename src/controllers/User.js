import utils from '../utils/writer';
import {
  createUser, changeUser, logIn, logout,
} from '../service/UserService';

export const ChangeUser = (req, res) => {
  const token = req.headers.authorization;
  const body = req.swagger.params.body.value;
  changeUser(body.oldPassword, body.newPassword, token)
    .then((response) => {
      utils.writeJson(res, response);
    })
    .catch((response) => {
      utils.writeJson(res, response);
    });
};

export const CreateUser = (req, res) => {
  const body = req.swagger.params.body.value;

  createUser(body.login, body.email, body.password, body.privateKey, body.CSR)
    .then((response) => {
      utils.writeJson(res, response);
    })
    .catch((response) => {
      utils.writeJson(res, response);
    });
};

export const Login = (req, res) => {
  const body = req.swagger.params.body.value;
  logIn(body.login, body.password, body.certificate, body.privateKey)
    .then((response) => {
      utils.writeJson(res, response);
    })
    .catch((response) => {
      utils.writeJson(res, response);
    });
};

export const Logout = (req, res) => {
  const token = req.headers.authorization;
  logout(token)
    .then((response) => {
      utils.writeJson(res, response);
    })
    .catch((response) => {
      utils.writeJson(res, response);
    });
};
