const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // try{
    // req.user.role is assumed to be a role ID (number)
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden: Insufficient permissions" });
    }
    next();

    // }catch(err) {
    //     return res.status()
    // }
  };
};

module.exports = allowRoles;
