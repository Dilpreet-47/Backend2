import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/claudinary.js";
import { apiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // get details from frontend from user
  // validate details
  // check if user already exists check with username and email
  // check for images and for avatar also
  // upload them to cloudiniary
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return response
  const { username, email, fullName, password } = req.body;
  console.log("email: ", email);
  console.log("password: ", password);

  if (fullName === "") {
    throw new apiError(400, "fullname is required");
  }
  if (username === "") {
    throw new apiError(400, "fullname is required");
  }
  if (email === "") {
    throw new apiError(400, "email is required");
  }
  if (password === "") {
    throw new apiError(400, "password is required");
  }

  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new apiError(409, "User with email or username already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new apiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new apiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new apiError(500, "Something Went Wrong While registering the User");
  }

  return res
    .status(201)
    .json(new apiResponse(200, "User registered Succesfully"));
});

export { registerUser };
