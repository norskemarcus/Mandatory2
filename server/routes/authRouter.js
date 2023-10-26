import Router from "express";

const router = Router();

router.get("/auth", (req, res) => {
  res.send({data: "Du er logget ind"})
});


router.post("auth/login", (req, res) => {
  res.send({});
})


router.post("auth/signup", (req, res) => {
  res.send({});
})



export default router;