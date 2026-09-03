//Email format check used by both registration and login validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateRegistration = (req, res, next) => {
  const { name, email, password, role } = req.body || {};

  //Checking if name,email,password and role fields are not empty
  if (!name || !email || !password || !role) {
    return res.status(400).json({
      success: false,
      message: "Name, email, password and role are required."
    });
  }

//Checking if fields name,email,password and role are of type string
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof role !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message: "Name, email, password and role must be text values."
    });
  }

  const trimmedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedRole = role.trim().toLowerCase();

  if (!trimmedName) {
    return res.status(400).json({
      success: false,
      message: "Name cannot be empty."
    });
  }

  if (!EMAIL_REGEX.test(normalizedEmail)) {
    return res.status(400).json({
      success: false,
      message: "A valid email address is required."
    });
  }

//Checking if the password is more than 8 characters and throwing an error if not
  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters long."
    });
  }

  const allowedRoles = ["client", "freelancer"];

  if (!allowedRoles.includes(normalizedRole)) {
    return res.status(400).json({
      success: false,
      message: "Role must be either client or freelancer."
    });
  }

  req.body.name = trimmedName;
  req.body.email = normalizedEmail;
  req.body.role = normalizedRole;

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body || {};

//Both fields email and password are required to attempt to login
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required."
    });
  }

  //Reject non-string values before using string methods such as trim()
  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({
      success: false,
      message: "Email and password must be text values."
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  //Reject incorrect formatted email addresses before authentication
  if (!EMAIL_REGEX.test(normalizedEmail)) {
    return res.status(400).json({
      success: false,
      message: "A valid email address is required."
    });
  }

  req.body.email = normalizedEmail;

  next();
};

module.exports = {
  validateRegistration,
  validateLogin
};