const bcrypt = require('bcrypt');

const usersRepo = require('./user.db.repository');
const tokenService = require('../token/token.service');
const settingsService = require('../settings/setting.service');
const statisticService = require('../statistics/statistic.service');
const { AUTHENTICATION_ERROR } = require('../../errors/appErrors');

const authenticate = async user => {
  const userEntity = await usersRepo.getUserByEmail(user.email);

  const isValidated = await bcrypt.compare(user.password, userEntity.password);
  if (!isValidated) {
    throw new AUTHENTICATION_ERROR();
  }

  const tokens = await tokenService.getTokens(userEntity._id);

  return { ...tokens, userId: userEntity._id, name: userEntity.name };
};

const get = id => usersRepo.get(id);

const save = async user => {
  const newUser = await usersRepo.save(user);
  const userId = newUser._id;
  await Promise.all([
    statisticService.upsert(userId, { userId }),
    settingsService.upsert(userId, { userId })
  ]);
  return newUser;
};

const update = (id, user) => usersRepo.update(id, user);

const remove = async id => {
  await statisticService.remove(id);
  await settingsService.remove(id);
  await usersRepo.remove(id);
};

module.exports = { authenticate, get, save, update, remove };
