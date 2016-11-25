/**
 * Creates default Roles
 *
 * @public
 */
'use strict';

exports.create = function () {
  return Promise.all([Role.findOrCreate({ where: { name: 'admin' }, defaults: { name: 'admin' } }), Role.findOrCreate({ where: { name: 'registered' }, defaults: { name: 'registered' } }), Role.findOrCreate({ where: { name: 'public' }, defaults: { name: 'public' } })]);
};