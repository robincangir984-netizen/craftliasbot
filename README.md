# Minecraft Discord Botu

Node.js 18+ ve `discord.js` v14 ile geliştirilmiş, modüler ve hatasız bir Minecraft sunucu yönetim/destek botu.

## Özellikler

- `/sunucu-kur` — Sadece yöneticiler. Rolleri, kategorileri ve kanalları sıfırlayıp belirlenen mimaride yeniden oluşturur. Tüm ID'ler SQLite veritabanına kaydedilir.
- `/destek-kur` — Seçilen kanala modern destek panelini gönderir.
- Ticket sistemi — Modal form, Canvas bilgi kartı, yetkili kontrol butonları, ses kanalı, HTML transcript ve 1-5 yıldız puanlama.
- `guildMemberAdd` — `•┃Halk` rolü otomatik atanır ve log atılır.
- Kapsamlı log sistemleri — mesaj silme/düzenleme, ban/kick, ses, kanal/rol değişiklikleri.
- Rate-limit koruması, eksik izin kontrolü ve `unhandledRejection` yakalayıcıları.

## Kurulum

1. Depoyu klonlayın ve dizine girin:
   ```bash
   git clone <repo-url>
   cd minecraft-discord-bot
   ```

2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

3. `.env.example` dosyasını kopyalayıp `.env` olarak doldurun:
   ```bash
   cp .env.example .env
   ```

   Gerekli alanlar: `DISCORD_TOKEN`, `CLIENT_ID`, `GUILD_ID`. İsteğe bağlı `BANNER_URL`.

4. Botu başlatın:
   ```bash
   npm start
   ```

   Geliştirme için otomatik yeniden başlatma:
   ```bash
   npm run dev
   ```

5. Sunucuda `/sunucu-kur` komutunu çalıştırın. Ardından destek paneli için `/destek-kur` ile bir kanal seçin.

## Klasör Yapısı

```
minecraft-discord-bot/
├── package.json
├── .env.example
├── .gitignore
├── README.md
└── src/
    ├── index.js
    ├── config.js
    ├── commands/
    │   ├── destek-kur.js
    │   └── sunucu-kur.js
    ├── events/
    │   ├── clientReady.js
    │   ├── guildBanAdd.js
    │   ├── guildMemberAdd.js
    │   ├── guildMemberRemove.js
    │   ├── interactionCreate.js
    │   ├── messageLogs.js
    │   ├── messageUpdate.js
    │   ├── structureLogs.js
    │   └── voiceStateUpdate.js
    ├── handlers/
    │   ├── commandHandler.js
    │   └── eventHandler.js
    ├── interactions/
    │   ├── setup.js
    │   ├── ticketActions.js
    │   └── ticketAdvanced.js
    ├── services/
    │   ├── cardService.js
    │   ├── channelFactory.js
    │   ├── clearGuild.js  (setupClear.js)
    │   ├── panelService.js
    │   ├── setupHelpers.js
    │   ├── setupService.js
    │   ├── ticketService.js
    │   ├── ticketUi.js
    │   └── logService.js
    ├── structure/
    │   ├── channels.js
    │   └── roles.js
    ├── utils/
    │   ├── logger.js
    │   ├── permissions.js
    │   ├── rateLimit.js
    │   └── safe.js
    └── database/
        └── Database.js
```

## Veritabanı

`data/bot.db` (SQLite, `better-sqlite3`) dosyasında rol/kanal ID eşleşmeleri, ticket kayıtları ve istatistikler kalıcı olarak tutulur.

## Geliştirici Notları

- Tüm slash komutlar bot başlangıcında hedef sunucuya otomatik olarak kaydedilir.
- Rol ve kanal isimleri Türkçe olup hiyerarşi `structure/roles.js` ve `structure/channels.js` dosyalarında tanımlıdır.
- Ticket kapatıldığında `data/transcripts/` altında HTML kayıt oluşturulup destek log kanalına gönderilir.
