/**
 * Creates default Roles
 *
 * @public
 */
'use strict';

exports.create = function () {
  return Promise.all([Role.findOrCreate({ where: { name: 'admin' }, defaults: { name: 'admin' } }).spread(function (role, created) {
    return role;
  }), Role.findOrCreate({ where: { name: 'registered' }, defaults: { name: 'registered' } }).spread(function (role, created) {
    return role;
  }), Role.findOrCreate({ where: { name: 'public' }, defaults: { name: 'public' } }).spread(function (role, created) {
    return role;
  })]);
};