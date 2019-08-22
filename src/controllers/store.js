export default {
  storeMeeting: async (req, res, next) => {
    const db = req.app.get("db");
    const meetupData = req.body;
    let result;
    //const {title,description,imageUrl,location,date,id} = meetup;
    //console.log(meetup);
    try {
      result = await db.collection("meetings").add(meetupData);
      console.log(result);
    } catch (err) {
      console.log(err.response);
    }
    //console.log(db)
    res.json({ message: "store meeting route", data: result });
  }
};
