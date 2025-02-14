class UserController {
  //[GET] /user
  index(req, res) {
    res.send("User!!");
  }
}
module.exports = new UserController();
