export const sanitizeUser = (user) => {
  const {
    password,
    verificationCode,
    verificationExpiresAt,
    deletedAt,
    ...safeUser
  } = user;
  return safeUser;
};

export const sanitizeUsers = (users) => {
  return users.map(sanitizeUser);
};
