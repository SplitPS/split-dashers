window.AccountAPI = {
  currentUser: null,

  _base() {
    return window._gdProxyUrl || 'https://split.ps.fhgdps.com';
  },

  _gjp(password) {
    let xored = '';
    for (let i = 0; i < password.length; i++) {
      xored += String.fromCharCode((password.charCodeAt(i) ^ 37526) & 0xFF);
    }
    return btoa(xored).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  },

  _formEncode(obj) {
    return Object.entries(obj).map(([k, v]) =>
      encodeURIComponent(k) + '=' + encodeURIComponent(v)
    ).join('&');
  },

  async checkSession() {
    const stored = localStorage.getItem('splitdash_account');
    if (stored) {
      try {
        this.currentUser = JSON.parse(stored);
      } catch {
        this.currentUser = null;
      }
    }
    return this.currentUser;
  },

  async login(username, password) {
    const body = this._formEncode({
      userName: username,
      password: password,
      secret: 'Wmfv3899gc9',
      udid: 'S' + Math.random().toString(36).slice(2, 12),
    });
    const res = await fetch(this._base() + '/accounts/loginGJAccount.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body,
    });
    const text = await res.text();
    if (!text || text === '-1') throw new Error('Login failed');
    const parts = text.split(',');
    const accountID = parts[0];
    const userID = parts[1] || '0';
    this.currentUser = {
      username: username,
      password: password,
      accountID: accountID,
      userID: userID,
    };
    localStorage.setItem('splitdash_account', JSON.stringify(this.currentUser));
    return this.currentUser;
  },

  async register(username, password, email) {
    const body = this._formEncode({
      userName: username,
      password: this._gjp(password),
      email: email || '',
      secret: 'Wmfv3899gc9',
    });
    const res = await fetch(this._base() + '/accounts/registerGJAccount.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body,
    });
    const text = await res.text();
    if (text === '-1' || text === '-2' || text === '-3' || text === '-4' || text === '-5' || text === '-6') {
      const errors = { '-1': 'Account creation failed', '-2': 'Username taken', '-3': 'Email taken', '-4': 'Invalid username', '-5': 'Invalid password', '-6': 'Invalid email' };
      throw new Error(errors[text] || 'Registration failed');
    }
    return this.login(username, password);
  },

  async logout() {
    this.currentUser = null;
    localStorage.removeItem('splitdash_account');
  },

  async getUserInfo(targetAccountID) {
    const body = this._formEncode({
      secret: 'Wmfd2893gb7',
      targetAccountID: String(targetAccountID),
    });
    const res = await fetch(this._base() + '/getGJUserInfo20.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    const text = await res.text();
    if (!text || text === '-1') throw new Error('Failed to load user info');
    const p = text.split(':');
    const m = {};
    for (let i = 0; i + 1 < p.length; i += 2) m[p[i]] = p[i + 1];
    return {
      username: m['1'] || 'Unknown',
      userID: m['2'] || '0',
      stars: m['3'] || '0',
      demons: m['4'] || '0',
      ranking: m['6'] || '0',
      creatorPoints: m['8'] || '0',
      secretCoins: m['13'] || '0',
      userCoins: m['17'] || '0',
      accountID: m['16'] || '0',
      diamonds: m['46'] || '0',
      globalRank: m['30'] || '0',
      modLevel: m['49'] || '0',
      youtube: m['20'] || '',
      twitter: m['44'] || '',
      twitch: m['45'] || '',
      icon: m['21'] || '1',
      ship: m['22'] || '1',
      ball: m['23'] || '1',
      bird: m['24'] || '1',
      wave: m['25'] || '1',
      robot: m['26'] || '1',
      spider: m['43'] || '1',
      explosion: m['48'] || '1',
      color1: m['10'] || '0',
      color2: m['11'] || '0',
      glow: m['28'] || '0',
    };
  },

  async getLeaderboard(type, count) {
    const body = this._formEncode({
      secret: 'Wmfd2893gb7',
      type: type || 'top',
      count: String(count || 50),
    });
    const res = await fetch(this._base() + '/getGJScores20.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    const text = await res.text();
    if (!text || text === '-1') throw new Error('Failed to load leaderboard');
    const entries = text.split('|').filter(Boolean);
    return entries.map((entry) => {
      const p = entry.split(':');
      const m = {};
      for (let i = 0; i + 1 < p.length; i += 2) m[p[i]] = p[i + 1];
      return {
        username: m['1'] || 'Unknown',
        userID: m['2'] || '0',
        stars: m['3'] || '0',
        demons: m['4'] || '0',
        ranking: m['6'] || '0',
        creatorPoints: m['8'] || '0',
        secretCoins: m['13'] || '0',
        userCoins: m['17'] || '0',
        accountID: m['16'] || '0',
        diamonds: m['46'] || '0',
        globalRank: m['30'] || '0',
      };
    });
  },

  clearClientData() {
    try {
      const keys = [
        'gd_settings', 'gd_totalAttempts', 'gd_totalJumps', 'gd_totalDeaths',
        'gd_completedLevels', 'created_levels', 'iconMainColor', 'iconSecondaryColor',
        'iconCurrentPlayer', 'iconCurrentShip', 'iconCurrentBall', 'iconCurrentWave',
        'iconCurrentSpider', 'iconCurrentBird', 'userMusicVol', 'userSfxVol',
        'menuMusicEnabled', 'splitdash_account',
      ];
      for (const key of keys) {
        localStorage.removeItem(key);
      }
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('bestPercent_') || key.startsWith('practiceBestPercent_'))) {
          localStorage.removeItem(key);
        }
      }
    } catch {}

    try {
      sessionStorage.clear();
    } catch {}
  },

  async unlinkAccount() {
    await this.logout();
    this.clearClientData();
  },

};

window.AccountAPI.checkSession().catch(() => {});
