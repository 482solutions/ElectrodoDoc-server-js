import utils from '../utils/writer';
import { CreateVoting, GetVoting, UpdateVoting } from '../service/VotingService';

export const createVoting = (req, res) => {
  const token = req.headers.authorization;
  const body = req.swagger.params.body.value;
  CreateVoting(body.hash,
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

export const getVoting = (req, res) => {
  const token = req.headers.authorization;
  GetVoting(token)
    .then((response) => {
      utils.writeJson(res, response);
    })
    .catch((response) => {
      utils.writeJson(res, response);
    });
};

export const updateVoting = (req, res) => {
  const token = req.headers.authorization;
  const body = req.swagger.params.body.value;
  UpdateVoting(body.hash, body.variant, token)
    .then((response) => {
      utils.writeJson(res, response);
    })
    .catch((response) => {
      utils.writeJson(res, response);
    });
};
