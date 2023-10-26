import Router from "express";
const router = Router();



// function butler(req, res, next) {
//   console.log("Welcome to the mansion", req.ip);
//   next(); // går til next i linje 11 i parantesen
// }



// router.get("/profile", butler, (req, res, next) => {
//   console.log("Profile secret")
//   res.send({ data: "This is the secret profile page" });
// });



// router.get("/profile", (req, res, next) => {
//   console.log("Profile");
//   res.send({ data: "This is the profile page" });
// });


export default router;