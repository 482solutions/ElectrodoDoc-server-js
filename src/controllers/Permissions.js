import utils from '../utils/writer';
import { ChangePermissions } from '../service/PermissionsService';

export const changePermissions = (req, res) => {
  const body = req.swagger.params.body.value;
  const token = req.headers.authorization;
  ChangePermissions(body.email, body.hash, body.permission, token)
    .then((response) => {
      utils.writeJson(res, response);
    })
    .catch((response) => {
      utils.writeJson(res, response);
    });
};
