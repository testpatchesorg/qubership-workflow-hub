class WildcardMatcher {
  constructor() {
    this.name = 'WildcardMatcher';
  }

  match(tag, pattern) {
    const t = tag.toLowerCase();
    const p = pattern.toLowerCase();

    // 1) точное соответствие (никаких джокеров)
    if (!p.includes('*') && !p.includes('?')) {
      return t === p;
    }

    // 2) префиксный метод (xxx*)
    if (p.endsWith('*') && !p.startsWith('*') && !p.includes('?')) {
      return t.startsWith(p.slice(0, -1));
    }

    // 3) суффиксный метод (*xxx)
    if (p.startsWith('*') && !p.endsWith('*') && !p.includes('?')) {
      return t.endsWith(p.slice(1));
    }

    // 4) спецкейс для чистых семвер‑тегов «x.y.z» (три цифры через точку)
    if (p === '*.*.*') {
      return /^\d+\.\d+\.\d+$/.test(tag);
    }

    // 5) спецкейс для семвер‑тегов с суффиксом «x.y.z-foo»
    if (p === '*.*.*-*') {
      return /^\d+\.\d+\.\d+-[\w.]+$/.test(tag);
    }

    // 6) общий вариант: экранируем RegExp‑спецсимволы, превращаем '*'→'.*' и '?'→'.'
    const escaped = p
      // экранируем всё, кроме '*' и '?'
      .replace(/[-[\]{}()+\\^$|#\s.]/g, '\\$&')
      // точку эскейпим отдельно
      .replace(/\./g, '\\.')
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.');

    const re = new RegExp(`^${escaped}$`, 'i');
    return re.test(tag);
  }
}

module.exports = WildcardMatcher;
