
module.exports.getUniqueCode = function(length) {
  let uid = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charsLength = chars.length;
  for (let i = 0; i < length; ++i) {
    uid += chars[getRandomInterval(0, charsLength - 1)];
  }
  return uid;
};

function getRandomInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
