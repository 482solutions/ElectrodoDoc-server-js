import utils from '../utils/writer';
import { createVoting, getVoting, updateVoting } from '../service/VotingService';

export const CreateVoting = (req, res) => {
  const token = req.headers.authorization;
  const body = req.swagger.params.body.value;
  createVoting(body.hash,
    body.cid,
    body.dueDate,
    body.variants,
    body.excludedUsers,
    body.description,
    token)
    .then((response) => {
      utils.writeJson(res, response);
    })
    .catch((response) => {
      utils.writeJson(res, response);
    });
};

export const GetVoting = (req, res) => {
  const token = req.headers.authorization;
  getVoting(token)
    .then((response) => {
      utils.writeJson(res, response);
    })
    .catch((response) => {
      utils.writeJson(res, response);
    });
};

export const UpdateVoting = (req, res) => {
  const token = req.headers.authorization;
  const body = req.swagger.params.body.value;
  updateVoting(body.variant, token)
    .then((response) => {
      utils.writeJson(res, response);
    })
    .catch((response) => {
      utils.writeJson(res, response);
    });
};
