import utils from '../utils/writer';
import {
  CreateFolder,
  DownloadFile,
  GetFolder,
  Search,
  UpdateFile,
  UploadFile,
  Versions,
  Tree,
} from '../service/FileSystemService';

export const createFolder = (req, res) => {
  const token = req.headers.authorization;
  const body = req.swagger.params.body.value;
  CreateFolder(body.name, body.parentFolder, token)
    .then((response) => {
      utils.writeJson(res, response);
    })
    .catch((response) => {
      utils.writeJson(res, response);
    });
};

export const downloadFile = (req, res) => {
  const token = req.headers.authorization;
  const hash = req.swagger.params.hash.value;
  const cid = req.swagger.params.cid.value;
  DownloadFile(hash, cid, token)
    .then((response) => {
      utils.writeJson(res, response);
    })
    .catch((response) => {
      utils.writeJson(res, response);
    });
};

export const getFolder = (req, res) => {
  const token = req.headers.authorization;
  const hash = req.swagger.params.hash.value;
  GetFolder(hash, token)
    .then((response) => {
      utils.writeJson(res, response);
    })
    .catch((response) => {
      utils.writeJson(res, response);
    });
};

export const uploadFile = (req, res) => {
  const token = req.headers.authorization;
  const name = req.swagger.params.name.value;
  const parentFolder = req.swagger.params.parentFolder.value;
  const file = req.swagger.params.file.value;
  UploadFile(name, parentFolder, file, token)
    .then((response) => {
      utils.writeJson(res, response);
    })
    .catch((response) => {
      utils.writeJson(res, response);
    });
};

export const updateFile = (req, res) => {
  const token = req.headers.authorization;
  const hash = req.swagger.params.hash.value;
  const file = req.swagger.params.file.value;
  UpdateFile(hash, file, token)
    .then((response) => {
      utils.writeJson(res, response);
    })
    .catch((response) => {
      utils.writeJson(res, response);
    });
};

export const search = (req, res) => {
  const token = req.headers.authorization;
  const name = req.swagger.params.name.value;
  Search(name, token)
    .then((response) => {
      utils.writeJson(res, response);
    })
    .catch((response) => {
      utils.writeJson(res, response);
    });
};

export const versions = (req, res) => {
  const token = req.headers.authorization;
  const hash = req.swagger.params.hash.value;
  Versions(hash, token)
    .then((response) => {
      utils.writeJson(res, response);
    })
    .catch((response) => {
      utils.writeJson(res, response);
    });
};

export const tree = (req, res) => {
  const token = req.headers.authorization;
  Tree(token)
    .then((response) => {
      utils.writeJson(res, response);
    })
    .catch((response) => {
      utils.writeJson(res, response);
    });
};
