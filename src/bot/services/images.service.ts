import { Storage } from "@google-cloud/storage";
import * as UUID from "uuid-v4";
const storage = new Storage();
const bucketName = "shopping-automation-22ccf.appspot.com";
const bucket = storage.bucket(bucketName);

export async function upload(filepath, name) {
  // Creates a client
  
  const uuid = UUID();
  return bucket.upload(filepath, {
    destination: name+'.png',
    metadata: {
      cacheControl: "public, max-age=315360000",
      contentType: "image/png",
    },
  }).then((data) => {

    const file = data[0];

    return Promise.resolve("https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(file.name) + "?alt=media&token=" + uuid);
});
}
// export async function download(fileName, destFileName) {
//   async function downloadFile() {
//     const options = {
//       destination: destFileName,
//     };

//     // Downloads the file
//     await bucket.file(fileName).download(options);

//     console.log(
//       `gs://${bucketName}/${fileName} downloaded to ${destFileName}.`
//     );
//   }

//   return downloadFile().catch(console.error);
// }
