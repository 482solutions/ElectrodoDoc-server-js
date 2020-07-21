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
    body.decription,
    token)
    .then(function(response) {
      utils.writeJson(res, response);
    })
    .catch(function(response) {
      utils.writeJson(res, response);
    });
};

export const GetVoting = (req, res, next) => {
  const token = req.headers.authorization;
  getVoting(token)
    .then(function(response) {
      utils.writeJson(res, response);
    })
    .catch(function(response) {
      utils.writeJson(res, response);
    });
};

export const UpdateVoting = (req, res, next) => {
  const token = req.headers.authorization;
  const body = req.swagger.params.body.value;
  updateVoting(body.variant, token)
    .then(function(response) {
      utils.writeJson(res, response);
    })
    .catch(function(response) {
      utils.writeJson(res, response);
    });
};
