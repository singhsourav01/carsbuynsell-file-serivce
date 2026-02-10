import { INTEGERS, STRINGS, UPLOAD_TYPES } from "../constants/app.constant";

export const getTypeData = async (
  uploadId: string,
  uploadType: string,
  userType: string
) => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  const profilePath =
    userType +
    STRINGS.FORWARD_SLASH +
    uploadId +
    STRINGS.FORWARD_SLASH +
    uploadType;

  let typeData = {
    [UPLOAD_TYPES.PORTFOLIO]: {
      keyPrefix: profilePath,
      isMultiMedia: false,
    },
    [UPLOAD_TYPES.PROFILE_PHOTO]: {
      keyPrefix: profilePath,
      isMultiMedia: false,
    },
    [UPLOAD_TYPES.SELFIE]: {
      keyPrefix: profilePath,
      isMultiMedia: false,
    },
    [UPLOAD_TYPES.REQUIREMENT]: {
      keyPrefix: profilePath,
      isMultiMedia: false,
    },
    [UPLOAD_TYPES.ADVERTISEMENT]: {
      keyPrefix: uploadType + STRINGS.FORWARD_SLASH + uploadId,
      isMultiMedia: false,
    },
    // [UPLOAD_TYPES.LICENSE]: {
    //   keyPrefix: profilePath,
    //   isMultiMedia: true,
    // },
    // [UPLOAD_TYPES.AWARD]: {
    //   keyPrefix: profilePath,
    //   isMultiMedia: true,
    // },
    // [UPLOAD_TYPES.CHAT]: {
    //   keyPrefix: uploadType + STRINGS.FORWARD_SLASH + uploadId,
    //   isMultiMedia: true,
    // },
    [UPLOAD_TYPES.REPORT_ISSUE]: {
      keyPrefix:
        uploadType +
        STRINGS.FORWARD_SLASH +
        day +
        STRINGS.HYPHEN +
        (month + INTEGERS.ONE) +
        STRINGS.HYPHEN +
        year,
      isMultiMedia: true,
    },
  };

  return typeData[uploadType];
};
