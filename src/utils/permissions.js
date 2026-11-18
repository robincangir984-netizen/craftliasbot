const { PermissionFlagsBits } = require("discord.js");
const db = require("../database/Database");
const { ADMIN_AND_ABOVE, FULL_TICKET_STAFF, TICKET_STAFF, DEV_KEYS } = require("../structure/roles");

function roleId(guild, key) {
  return db.getRoles(guild.id)[key] || null;
}

function memberHasRoleKey(member, keys) {
  const roles = db.getRoles(member.guild.id);
  return keys.some((key) => roles[key] && member.roles.cache.has(roles[key]));
}

function isAdmin(member) {
  return member.permissions.has(PermissionFlagsBits.Administrator) || memberHasRoleKey(member, ADMIN_AND_ABOVE);
}

function isStaff(member) {
  return isAdmin(member) || memberHasRoleKey(member, TICKET_STAFF);
}

function isFullTicketStaff(member) {
  return isAdmin(member) || memberHasRoleKey(member, FULL_TICKET_STAFF);
}

function isDev(member) {
  return member.permissions.has(PermissionFlagsBits.Administrator) || memberHasRoleKey(member, DEV_KEYS);
}

function botCan(guild, permissions) {
  const me = guild.members.me;
  if (!me) return false;
  return me.permissions.has(permissions);
}

module.exports = {
  roleId,
  memberHasRoleKey,
  isAdmin,
  isStaff,
  isFullTicketStaff,
  isDev,
  botCan,
};
