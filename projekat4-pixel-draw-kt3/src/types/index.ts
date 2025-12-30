declare global {
  namespace Express {
    interface Request {
      user?: import("../entities/User").User;
    }
  }
}

// API ERRORS
export type APIErrorCommon = {
  failed: true;
  code: ErrorCode;
};

export type ErrorCode =
  | "DUPLICATE_USERNAME"
  | "BAD_PICTURE_DATA"
  | "LOGGED_IN"
  | "INCORRECT_CREDENTIALS"
  | "INVALID_DATA"
  | "NO_SUCH_ENTITY"
  | "NOT_YOURS"
  | "NOT_AUTHENTICATED"
  | "INTERNAL_ERROR";

// LOGIN REQ/RES
export type LoginReq = {
  username: string;
  password: string;
};

export type LoginRes = {
  failed: false;
  token: string;
  user_id: string;
  username: string;
};

// USER CREATION REQ/RES
export type UserCreationReq = {
  username: string;
  password: string;
};

export type UserCreationRes = {
  failed: false;
  user_id: string;
};

// PICTURES
export type BasePictureDto = {
  name: string;
  picture_data: string[][];
};

export type PictureDto = BasePictureDto & {
  picture_id: string;
  author: {
    user_id: string;
    username: string;
  };
  created_at: string;
  updated_at: string;
};

// PICTURES - POST
export type NewPictureReq = BasePictureDto;

export type NewPictureRes = {
  failed: false;
  picture_id: string;
};

// PICTURES - GET (LIST, BY ID)
export type PictureListingPage = {
  pictures: PictureDto[];
  total: number;
};

export type GetPictureRes = {
  failed: false;
  picture: PictureDto;
};

// PICTURES - PATCH
export type UpdatePictureRes = {
  failed: false;
};

// PICTURES - DELETE
export type DeletePictureRes = {
  failed: false;
};
