import core from "@actions/core"
import fs from "fs"
import path from "path"

var aws = require("aws-sdk")
var mime = require("mime")

try {
  const endpoint = core.getInput("endpoint")
  const accesskeyid = core.getInput("accesskeyid")
  const secretaccesskey = core.getInput("secretaccesskey")
  const bucket = core.getInput("bucket")
  const file = core.getInput("file")
  const destination = core.getInput("destination")

  var s3 = new aws.S3({
    accessKeyId: accesskeyid,
    secretAccessKey: secretaccesskey,
    endpoint: endpoint + destination,
  })

  var fileStream = fs.createReadStream(file)

  fileStream.on("error", function (err) {
    console.log("File Error", err)
    core.setFailed(err)
  })

  let key = ""
  if (destination == "") {
    key = path.basename(file)
  } else {
    key = destination
  }

  let params = {
    Bucket: bucket,
    Key: key,
    Body: fs.readFileSync(file),
    ContentType: mime.getType(file),
  }

  s3.putObject(params, function (err, data) {
    if (err) {
      console.log(err)
    } else {
      console.log("Successfully uploaded " + destination + " to " + bucket)
    }
  })
} catch (error) {
  core.setFailed(error.message)
}
