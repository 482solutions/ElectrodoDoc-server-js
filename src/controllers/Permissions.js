import utils from '../utils/writer';
import { changePermissions, revokePermissions } from '../service/PermissionsService';

export const ChangePermissions = (req, res) => {
  const body = req.swagger.params.body.value;
  const token = req.headers.authorization;
  changePermissions(body.email, body.hash, body.permission, token)
    .then((response) => {
      utils.writeJson(res, response);
    })
    .catch((response) => {
      utils.writeJson(res, response);
    });
};

export const RevokePermissions = (req, res) => {
  const body = req.swagger.params.body.value;
  const token = req.headers.authorization;
  revokePermissions(body.email, body.hash, body.permission, token)
    .then((response) => {
      utils.writeJson(res, response);
    })
    .catch((response) => {
      utils.writeJson(res, response);
    });
};
