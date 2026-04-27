const { Client, GatewayIntentBits } = require('discord.js');

const TOKEN = process.env.DISCORD_TOKEN;

// ID твоего аккаунта (кто может добавлять ботов)
const ALLOWED_USERS = ['598798724290052096']; // Замени на свой ID

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages
  ]
});

// Ответ на сообщения с именем Артур
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  
  const content = message.content.toLowerCase();
  
  if (content === 'артур') {
    await message.reply('hi');
  }
});

client.on('ready', () => {
  console.log(`Бот-протектор запущен как ${client.user.tag}`);
  console.log('Защита от добавления ботов активирована');
});

client.on('guildMemberAdd', async (member) => {
  if (!member.user.bot) return;
  
  console.log(`[ALERT] Обнаружен новый бот: ${member.user.tag}`);
  
  const auditLogs = await member.guild.fetchAuditLogs({
    limit: 1,
    type: 28
  });
  
  const entry = auditLogs.entries.first();
  const executor = entry ? entry.executor : null;
  
  const isAllowed = executor && ALLOWED_USERS.includes(executor.id);
  
  if (!isAllowed) {
    await member.kick('Бот-протектор: добавление ботов запрещено');
    
    if (executor && !executor.bot) {
      const targetMember = await member.guild.members.fetch(executor.id);
      if (targetMember) {
        await targetMember.kick('Бот-протектор: попытка добавить бота');
      }
    }
  } else {
    console.log(`[INFO] Разрешённый пользователь ${executor?.tag} добавил бота ${member.user.tag}`);
  }
});

client.login(TOKEN);
