export default {
  fetchUserData: async (req, res, next) => {
    const db = req.app.get("db");
    const userId = req.query.userId;
    const registeredMeetings = [];
    let queryResult;
    let registeredMeetups = [];
    let registrationKeys = {};
    try {
      queryResult = await db
        .collection("registeredMeetup")
        .where("userId", "==", userId)
        .get();

      for (let doc of queryResult.docs) {
        registrationKeys[doc.data().meetupId] = doc.id;

        registeredMeetings.push(doc.data().meetupId);
      }
    } catch (err) {
      const error = new Error("Unable to fetch registered meetings");
      error.statusCode = 500;
      return next(error);
    }
    // console.log(registeredMeetings);
    // console.log(registrationKeys);
    res.json({
      msg: "fetched meetings",
      data: { registeredMeetings, registrationKeys }
    });
  },
  unregisterMeetup: async (req, res, next) => {
    const db = req.app.get("db");
    const registrationId = req.body.registrationKey;
    let result;
    //console.log("registration key: ", registrationId);
    try {
      result = await db
        .collection("registeredMeetup")
        .doc(registrationId)
        .delete();
    } catch (err) {
      const error = new Error("Unable to unregister meeting");
      error.statusCode = 500;
      return next(error);
    }
    //console.log(result);
    res.json({ msg: "unregistered" });
  },
  registerMeeting: async (req, res, next) => {
    const db = req.app.get("db");
    const meetupId = req.body.meetupId;
    const userId = req.body.userId;
    let result;
    let registrationId;
    let registerMeetup = {
      userId,
      meetupId
    };

    try {
      result = await db.collection("registeredMeetup").add(registerMeetup);
    } catch (err) {
      const error = new Error("Unable to register meeting");
      //console.log(err.message);
      error.statusCode = 500;
      return next(error);
    }

    registrationId = result._path.segments[1];
    res.json({ msg: "registration successful!", data: { registrationId } });
  },
  updateMeeting: async (req, res, next) => {
    const db = req.app.get("db");
    const meetupId = req.params.id;
    const updateObj = req.body;
    const meetingRef = db.collection("meetings");
    let queryResult;

    try {
      queryResult = await meetingRef.doc(meetupId).update(updateObj);

      res.json({ msg: "Update meeting success" });
      //console.log(queryResult);
    } catch (err) {
      const error = new Error("unable to update database");
      error.statusCode = 500;
      return next(error);
    }
  },
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

      let document = await db.collection("meetings").doc(blob.name);
      await document.update({ imageUrl: publicUrl });

      let query = await document.get();
      let response = query.data(); //getting the data back after the imageUrl is update, can then send back to client
      res.json({ message: "image stored successfully!", data: response });
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
      const error = new Error("Unable to store meeting");
      error.statusCode = 500;
      return next(error);
    }
    //console.log(db)
    res.json({ message: "store meeting route", data: result });
  }
};
