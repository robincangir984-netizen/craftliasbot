const { PermissionFlagsBits } = require("discord.js");

const ADMIN = [PermissionFlagsBits.Administrator];
const VIEW = [
  PermissionFlagsBits.ViewChannel,
  PermissionFlagsBits.SendMessages,
  PermissionFlagsBits.ReadMessageHistory,
];
const MEMBER = VIEW.concat([PermissionFlagsBits.Connect, PermissionFlagsBits.Speak]);

const ROLES = [
  { key: "ceo", name: "•┃Ceo", color: 0xe74c3c, hoist: true, permissions: ADMIN },
  { key: "tac", name: "•┃Tac", color: 0xc0392b, hoist: true, permissions: ADMIN },
  { key: "yonetici", name: "•┃Yönetici", color: 0xe67e22, hoist: true, permissions: ADMIN },
  { key: "dev_lead", name: "•┃</>", color: 0x9b59b6, hoist: true, permissions: ADMIN },
  { key: "dev_team", name: "•┃Dev Team", color: 0x8e44ad, hoist: true, permissions: ADMIN },
  { key: "dot", name: "•┃.", color: 0x2c3e50, hoist: true, permissions: ADMIN },
  {
    key: "bas_admin",
    name: "•┃Baş Admin",
    color: 0xe74c3c,
    hoist: true,
    permissions: [
      PermissionFlagsBits.ManageRoles,
      PermissionFlagsBits.ManageChannels,
      PermissionFlagsBits.ManageMessages,
      PermissionFlagsBits.ModerateMembers,
      PermissionFlagsBits.KickMembers,
      PermissionFlagsBits.BanMembers,
      PermissionFlagsBits.MuteMembers,
      PermissionFlagsBits.MoveMembers,
      ...VIEW,
    ],
  },
  {
    key: "admin",
    name: "•┃Admin",
    color: 0xe67e22,
    hoist: true,
    permissions: [
      PermissionFlagsBits.ManageMessages,
      PermissionFlagsBits.ModerateMembers,
      PermissionFlagsBits.KickMembers,
      PermissionFlagsBits.BanMembers,
      PermissionFlagsBits.MuteMembers,
      PermissionFlagsBits.DeafenMembers,
      PermissionFlagsBits.MoveMembers,
      ...VIEW,
    ],
  },
  {
    key: "genel_ekip",
    name: "•┃Genel Ekip Sorumlusu",
    color: 0xf1c40f,
    hoist: true,
    permissions: [
      PermissionFlagsBits.ManageMessages,
      PermissionFlagsBits.ModerateMembers,
      PermissionFlagsBits.KickMembers,
      PermissionFlagsBits.MuteMembers,
      PermissionFlagsBits.MoveMembers,
      ...VIEW,
    ],
  },
  {
    key: "ust_yonetim",
    name: "•┃Üst Yönetim",
    color: 0xf39c12,
    hoist: true,
    permissions: [
      PermissionFlagsBits.ManageMessages,
      PermissionFlagsBits.ModerateMembers,
      PermissionFlagsBits.KickMembers,
      ...VIEW,
    ],
  },
  {
    key: "yardimci_plus",
    name: "•┃Yardımcı+",
    color: 0x3498db,
    hoist: true,
    permissions: [
      PermissionFlagsBits.ManageMessages,
      PermissionFlagsBits.ModerateMembers,
      PermissionFlagsBits.MoveMembers,
      ...VIEW,
    ],
  },
  {
    key: "ayin_yetkilisi",
    name: "•┃Ayın Yetkilisi",
    color: 0xf1c40f,
    hoist: true,
    permissions: [
      PermissionFlagsBits.ManageMessages,
      PermissionFlagsBits.ModerateMembers,
      PermissionFlagsBits.CreateInstantInvite,
      PermissionFlagsBits.AttachFiles,
      PermissionFlagsBits.EmbedLinks,
      ...VIEW,
    ],
  },
  {
    key: "yardimci",
    name: "•┃Yardımcı",
    color: 0x2980b9,
    hoist: true,
    permissions: [PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ModerateMembers, ...VIEW],
  },
  {
    key: "bilgili_plus",
    name: "•┃Bilgili+",
    color: 0x1abc9c,
    hoist: true,
    permissions: [PermissionFlagsBits.ManageMessages, ...VIEW],
  },
  { key: "bilgili", name: "•┃Bilgili", color: 0x16a085, hoist: true, permissions: VIEW },
  { key: "deneme_bilgili", name: "•┃Deneme Bilgili", color: 0x95a5a6, hoist: true, permissions: VIEW },
  { key: "alt_yonetim", name: "•┃Alt Yönetim", color: 0x7f8c8d, hoist: true, permissions: VIEW },
  { key: "yetkili_kadrosu", name: "•┃Yetkili Kadrosu", color: 0x5865f2, hoist: true, permissions: VIEW },
  { key: "ozel_uye", name: "•┃Özel Üye", color: 0xffd700, hoist: true, permissions: MEMBER },
  { key: "aetherion", name: "•┃Aetherion", color: 0x9b59b6, hoist: true, permissions: MEMBER },
  { key: "thunderon", name: "•┃Thunderon", color: 0xf1c40f, hoist: true, permissions: MEMBER },
  { key: "glaciour", name: "•┃Glaciour", color: 0x74b9ff, hoist: true, permissions: MEMBER },
  { key: "pyrour", name: "•┃Pyrour", color: 0xe17055, hoist: true, permissions: MEMBER },
  { key: "aerion", name: "•┃Aerion", color: 0x00cec9, hoist: true, permissions: MEMBER },
  { key: "aquaris", name: "•┃Aquaris", color: 0x0984e3, hoist: true, permissions: MEMBER },
  { key: "terran", name: "•┃Terran", color: 0x6ab04c, hoist: true, permissions: MEMBER },
  { key: "s1", name: "•┃S1", color: 0xb2bec3, hoist: false, permissions: MEMBER },
  { key: "s2", name: "•┃S2", color: 0x636e72, hoist: false, permissions: MEMBER },
  { key: "mulakat_bekleme", name: "•┃Mülakat Bekleme Yetkisi", color: 0xfdcb6e, hoist: false, permissions: MEMBER },
  { key: "halk", name: "•┃Halk", color: 0x99aab5, hoist: false, permissions: MEMBER },
];

const STAFF_KEYS = ROLES.slice(0, 18).map((role) => role.key);
const ADMIN_AND_ABOVE = ["ceo", "tac", "yonetici", "dev_lead", "dev_team", "dot", "bas_admin", "admin"];
const DEV_KEYS = ["ceo", "tac", "yonetici", "dev_lead", "dev_team", "dot"];
const TICKET_STAFF = STAFF_KEYS.filter((key) => key !== "alt_yonetim");
const FULL_TICKET_STAFF = TICKET_STAFF.filter((key) => key !== "deneme_bilgili");

module.exports = { ROLES, STAFF_KEYS, ADMIN_AND_ABOVE, DEV_KEYS, TICKET_STAFF, FULL_TICKET_STAFF };
