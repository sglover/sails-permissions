/**
 * Creates default Roles
 *
 * @public
 */
exports.create = function () {
  return Promise.all([
  	Role.findOrCreate({ where: { name: 'admin' }, defaults: { name: 'admin' } }).spread((role, created) => role),
  	Role.findOrCreate({ where: { name: 'registered' }, defaults: { name: 'registered' } }).spread((role, created) => role),
  	Role.findOrCreate({ where: { name: 'public' }, defaults: { name: 'public' } }).spread((role, created) => role)
  ]);
};
