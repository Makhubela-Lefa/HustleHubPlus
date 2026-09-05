//REGISTER
//Email format check used by both registration and login validation
const EMAIL_REGEX =
 /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

//Allow common characters used in real names while rejecting markup/special input
const NAME_REGEX = /^[\p{L}\p{M} .'-]+$/u;

const REGISTER_FIELDS = ["name", "email", "password", "role"];
const LOGIN_FIELDS = ["email", "password"];

const validateRegistration = (req, res, next) => {
  const { name, email, password, role } = req.body || {};

  //Reject fields that are not part of the registration API contract
const unexpectedFields = Object.keys(req.body || {}).filter(
  (field) => !REGISTER_FIELDS.includes(field)
);

if (unexpectedFields.length > 0) {
  return res.status(400).json({
    success: false,
    message: "Unexpected field provided."
  });
}

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

  //Require a sensible name length after surrounding whitespace is removed
  if (trimmedName.length < 2 || trimmedName.length > 50) {
  return res.status(400).json({
    success: false,
    message: "Name must be between 2 and 50 characters long."
  });
}
  //Reject markup and other invalid characters in names
  if (!NAME_REGEX.test(trimmedName)) {
  return res.status(400).json({
    success: false,
    message: "Name contains invalid characters."
  });
}

   //Reject excessively long email addresses before further processing
   if (normalizedEmail.length > 254) {
   return res.status(400).json({
    success: false,
    message: "Email address must not exceed 254 characters."
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

  //bcrypt only processes the first 72 bytes of a password
  //Reject longer values so users are not given a false sense of uniqueness
  if (Buffer.byteLength(password, "utf8") > 72) {
    return res.status(400).json({
      success: false,
      message: "Password must not exceed 72 bytes."
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

//LOGIN
const validateLogin = (req, res, next) => {
  const { email, password } = req.body || {};

  //Reject fields that are not part of the login API contract
const unexpectedFields = Object.keys(req.body || {}).filter(
  (field) => !LOGIN_FIELDS.includes(field)
);

if (unexpectedFields.length > 0) {
  return res.status(400).json({
    success: false,
    message: "Unexpected field provided."
  });
}

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

  //Keep login password validation consistent with registration
  if (Buffer.byteLength(password, "utf8") > 72) {
    return res.status(400).json({
      success: false,
      message: "Password must not exceed 72 bytes."
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  //Reject excessively long email addresses before further processing
   if (normalizedEmail.length > 254) {
   return res.status(400).json({
    success: false,
    message: "Email address must not exceed 254 characters."
  });
}

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