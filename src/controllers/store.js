export default {
  storeImage: async (req, res, next) => {
    const bucket = req.app.get("bucket");
    const db = req.app.get("db");
    //const meetingRef = db.collection("meets");

    const options = {
      version: "v2", // defaults to 'v2' if missing.
      action: "read",
      expires: Date.now() + 1000 * 60 * 60 // one hour
    };
    if (!req.file) {
      //console.log(req);
      const error = new Error("no file attached");
      error.statusCode = 400;
      return next(error);
    }
    //console.log(req.file);

    const blob = bucket.file(req.file.originalname);
    // const meetupId = req.file;
    // console.log(meetupId);
    const blobStream = blob.createWriteStream();

    blobStream.on("error", err => {
      console.log(err.response);
      next(err);
    });

    blobStream.on("finish", async () => {
      // The public URL can be used to directly access the file via HTTP.
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      //update the firestore with thie public url as imageUrl in the document field

      //db.collection('books').doc('fK3ddutEpD2qQqRMXNW5').get()
      let document = await db.collection("meetings").doc(blob.name);
      await document.update({ imageUrl: publicUrl });
      //console.log(document);

      let query = await document.get();
      console.log(query.data()); //getting the data back after the imageUrl is update, can then send back to client
      res.json({ message: "storeImage route" });
    });

    blobStream.end(req.file.buffer);
  },
  fetchMeetings: async (req, res, next) => {
    const db = req.app.get("db");
    const meetingRef = db.collection("meetings");
    let meetings;
    let results = [];
    try {
      meetings = await meetingRef.get();
      meetings.forEach(meeting => {
        let temp = {};
        let id = meeting.id;
        let data = meeting.data();
        temp = { id, ...data };
        results.push(temp);
      });
    } catch (err) {
      console.log(err.response);
      const error = new Error("Unable to load meetings");
      error.statusCode = 500;
      return next(error);
    }
    res.json({ message: "Fetch Meetings successful", data: results });
  },
  storeMeeting: async (req, res, next) => {
    const db = req.app.get("db");
    const meetupData = req.body;
    let result;
    //const {title,description,imageUrl,location,date,id} = meetup;
    //console.log(meetup);
    try {
      result = await db.collection("meetings").add(meetupData);
      //console.log(result);
    } catch (err) {
      console.log(err.response);
    }
    //console.log(db)
    res.json({ message: "store meeting route", data: result });
  }
};
