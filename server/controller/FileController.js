const fileTypes = require("../constants/fileTypes");
const HTTP_STATUS = require("../constants/statusCodes");
const fs = require("fs");
const path = require("path");
// const { sendResponse } = require("../util/common");
const { success, failure } = require("../utilities/common");

class FileController {
  async uploadFile(req, res, next) {
    try {
      if (!fileTypes.includes(req.filename)) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(
            failure("Only .jpg, .png, .jpeg, .txt, .pdf files can be uploaded")
          );
      }

      if (!req.file) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(failure("Failed to upload file"));
      }
      return res
        .status(HTTP_STATUS.OK)
        .send(success("Successfully uploaded file", req.file));
    } catch (error) {
      console.log(error);
      //   return sendResponse(
      //     res,
      //     HTTP_STATUS.INTERNAL_SERVER_ERROR,
      //     "Internal server error"
      //   );
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Internal Server Error"));
    }
  }

  async getFile(req, res, next) {
    try {
      const { filepath } = req.params;
      // console.log(path.join(__dirname, "..", "server", filepath));
      const exists = fs.existsSync(
        path.join(__dirname, "..", "server", filepath)
      );

      console.log("exists", exists);
      console.log("path", path.join(__dirname, "..", "server", filepath));

      if (!exists) {
        // return sendResponse(res, HTTP_STATUS.NOT_FOUND, "File not found");
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(failure("File not found"));
      }

      return res
        .status(200)
        .sendFile(path.join(__dirname, "..", "server", filepath));
    } catch (error) {
      console.log(error);
      //   return sendResponse(
      //     res,
      //     HTTP_STATUS.INTERNAL_SERVER_ERROR,
      //     "Internal server error"
      //   );
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Internal Server Error"));
    }
  }
}

module.exports = new FileController();
