document.addEventListener('DOMContentLoaded', function() {
    const startBtn = document.getElementById('start-btn');
    const telegramConfig = document.getElementById('telegram-config');
    const generateConfigBtn = document.getElementById('generate-config-btn');
    const configOutput = document.getElementById('config-output');
    const configText = document.getElementById('config-text');
    const copyConfigBtn = document.getElementById('copy-config-btn');
    const downloadConfigBtn = document.getElementById('download-config-btn');

    const CLIENT_ID = '6437068';
    const CLIENT_SECRET = '2MJjPqfUReCjvTrAwPNx';
    const REDIRECT_URI = 'https://danny-live.github.io/configurator/configurator.html';
    const SCOPE = ['wall', 'photos', 'video', 'docs', 'audio', 'offline'];

    let vkAccessToken = null;
    let vkUserId = null;

    startBtn.addEventListener('click', function() {
        const scopeStr = SCOPE.join(',');
        const authUrl = `https://oauth.vk.com/authorize?client_id=${CLIENT_ID}&display=page&redirect_uri=${REDIRECT_URI}&response_type=token&scope=${scopeStr}&v=5.131`;
        window.location.href = authUrl;
    });

    function parseHashParams() {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        vkAccessToken = params.get('access_token');
        vkUserId = params.get('user_id');

        if (vkAccessToken && vkUserId) {
            startBtn.style.display = 'none';
            telegramConfig.style.display = 'block';
        }
    }

    parseHashParams();

    generateConfigBtn.addEventListener('click', function() {
        const tgBotToken = document.getElementById('tg-bot-token').value;
        const tgChannelId = document.getElementById('tg-channel-id').value;

        const config = {
            tg_bot_token: tgBotToken,
            tg_channel_id: tgChannelId,
            vk_access_token: vkAccessToken,
            vk_user_id: vkUserId
        };

        configText.textContent = JSON.stringify(config, null, 2);
        configOutput.style.display = 'block';
    });

    copyConfigBtn.addEventListener('click', function() {
        navigator.clipboard.writeText(configText.textContent)
            .then(() => alert('Configuration copied to clipboard!'))
            .catch(() => alert('Failed to copy configuration.'));
    });

    downloadConfigBtn.addEventListener('click', function() {
        const blob = new Blob([configText.textContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'config.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
});