const INFO_TEXT = [
  { key: "kurallar", name: "📜・kurallar", topic: "Sunucu ve oyun kuralları" },
  { key: "duyurular", name: "📣・duyurular", topic: "Resmi duyurular" },
  { key: "cekilisler", name: "🎉・çekilişler", topic: "Çekilişler" },
  { key: "guncellemeler", name: "🚀・güncellemeler", topic: "Sürüm ve içerik güncellemeleri" },
  { key: "sunucu_bilgi", name: "🔗・sunucu-bilgi", topic: "IP, sürüm ve site bilgileri" },
];

const COMMUNITY_TEXT = [
  { key: "genel_sohbet", name: "💬・genel-sohbet", topic: "Genel sohbet" },
  { key: "medya", name: "📷・medya-galeri", topic: "Ekran görüntüleri ve medya" },
  { key: "komut", name: "🤖・komut-kullanım", topic: "Bot ve oyun komutları" },
  { key: "oneri", name: "💡・öneri-şikayet", topic: "Öneri ve şikayetler" },
  { key: "ekip", name: "🤝・ekip-arama", topic: "Ekip ve parti arama" },
];

const STAFF_TEXT = [
  { key: "yetkili_sohbet", name: "💬・yetkili-sohbet", topic: "Yetkili sohbet" },
  { key: "yetkili_sohbet_2", name: "💬・yetkili-sohbet #2", topic: "Yetkili sohbet 2" },
  { key: "yetkili_sohbet_3", name: "💬・yetkili-sohbet #3", topic: "Yetkili sohbet 3" },
  { key: "yetkili_duyuru", name: "📢・yetkili-duyuru", topic: "Yetkili duyuruları" },
  { key: "yetkili_komut", name: "📋・yetkili-komut", topic: "Yetkili komutları" },
  { key: "yetkili_kurallar", name: "📜・yetkili-kurallar", topic: "Yetkili kuralları" },
  { key: "hatalar", name: "⚠️・hatalar", topic: "Sunucu ve plugin hataları" },
  { key: "mazeret", name: "🏖️・yetkili-mazeret", topic: "Yetkili mazeret bildirimleri" },
];

const DEV_TEXT = [
  { key: "dev_1", name: "💻・geliştirici-odası", topic: "Geliştirici odası" },
  { key: "dev_2", name: "💻・geliştirici-odası #2", topic: "Geliştirici odası 2" },
];

const LOG_TEXT = [
  { key: "destek_log", name: "🎫・destek-log", topic: "Ticket açılış, kapanış, transcript ve puanlar" },
  { key: "genel_log", name: "🛡️・genel-log", topic: "Mesaj, üye, ceza ve yapı logları" },
  { key: "ses_log", name: "🔊・ses-log", topic: "Ses kanalı hareketleri" },
];

function voice(key, name, limit) {
  return { key, name, userLimit: limit };
}

const COMMUNITY_VOICE = [
  voice("genel_ses_1", "🔊・Genel Sohbet #1", 99),
  voice("genel_ses_2", "🔊・Genel Sohbet #2", 99),
  voice("genel_ses_3", "🔊・Genel Sohbet #3", 99),
  voice("genel_ses_4", "🔊・Genel Sohbet #4", 99),
  voice("duo_1", "👥・Duo Odası #1", 2),
  voice("duo_2", "👥・Duo Odası #2", 2),
  voice("duo_3", "👥・Duo Odası #3", 2),
  voice("trio_1", "👥・Trio Odası #1", 3),
  voice("trio_2", "👥・Trio Odası #2", 3),
  voice("trio_3", "👥・Trio Odası #3", 3),
  voice("afk", "💤・AFK Odası", 99),
];

const STAFF_VOICE = [
  voice("yetkili_ses_1", "🔊・Yetkili Sohbet #1", 0),
  voice("yetkili_ses_2", "🔊・Yetkili Sohbet #2", 0),
  voice("toplanti", "🎙️・Yetkili Toplantı Odası", 0),
  voice("mulakat_bekleme", "⏳・Yetkili Mülakat Bekleme", 0),
  voice("mulakat", "🔒・Mülakat Odası", 0),
];

module.exports = {
  INFO_TEXT,
  COMMUNITY_TEXT,
  STAFF_TEXT,
  DEV_TEXT,
  LOG_TEXT,
  COMMUNITY_VOICE,
  STAFF_VOICE,
};
