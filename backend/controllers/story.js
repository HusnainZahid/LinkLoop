import { db } from "../connect.js";
// import jwt from "jsonwebtoken";
import moment from "moment";

export const getStories = (req, res) => {
  // const token = req.cookies.accessToken;
  // if (!token) return res.status(401).json("Not logged in!");

  // jwt.verify(token, "b3eda45bade5b0abaef1a264e0714502cc6dfb0f6fe614a25a9588d218ad9a26", (err, userInfo) => {
  //   if (err) return res.status(403).json("Token is not valid!");

    const q = `SELECT s.*, name FROM stories AS s JOIN users AS u ON (u.id = s.userId)
    LEFT JOIN relationships AS r ON (s.userId = r.followedUserId AND r.followerUserId= ?) ORDER BY s.createdAt DESC LIMIT 4`;

    db.query(q, [req.body.userId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  // });
};

export const addStory = (req, res) => {
  // const token = req.cookies.accessToken;
  // if (!token) return res.status(401).json("Not logged in!");

  // jwt.verify(token, "b3eda45bade5b0abaef1a264e0714502cc6dfb0f6fe614a25a9588d218ad9a26", (err, userInfo) => {
  //   if (err) return res.status(403).json("Token is not valid!");

    const q = "INSERT INTO stories(`img`, `createdAt`, `userId`) VALUES (?)";
    const values = [
      req.body.img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      req.body.userId,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Story has been created.");
    });
  // });
};

export const deleteStory = (req, res) => {
  // const token = req.cookies.accessToken;
  // if (!token) return res.status(401).json("Not logged in!");

  // jwt.verify(token, "b3eda45bade5b0abaef1a264e0714502cc6dfb0f6fe614a25a9588d218ad9a26", (err, userInfo) => {
  //   if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM stories WHERE `id`=?";

    db.query(q, [req.params.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0)
        return res.status(200).json("Story has been deleted.");
      return res.status(403).json("You can delete only your story!");
    });
  // });
};
