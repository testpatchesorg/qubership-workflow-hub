class WildcardMatcher {
    constructor() {
        this.name = 'WildcardMatcher';
    }

    match(tag, pattern) {
        const t = tag.toLowerCase();
        const p = pattern.toLowerCase();

        // Спецкейс ?* (для инклюдов)
        if (p === '?*') {
            return /^[a-z0-9]+$/.test(t) && /\d/.test(t);
        }

        // Если нет ни '*' ни '?' — строгое сравнение
        if (!p.includes('*') && !p.includes('?')) {
            return t === p;
        }

        // Считаем сколько джокеров '*'
        const starCount = (p.match(/\*/g) || []).length;

        // Чистый префикс (xxx*) — ровно один '*', он в конце
        if (starCount === 1 && p.endsWith('*') && !p.startsWith('*') && !p.includes('?')) {
            return t.startsWith(p.slice(0, -1));
        }

        // Чистый суффикс (*xxx) — ровно один '*', он в начале
        if (starCount === 1 && p.startsWith('*') && !p.endsWith('*') && !p.includes('?')) {
            return t.endsWith(p.slice(1));
        }

        // Простое contains (*xxx*) — ровно два '*', один в начале и один в конце
        if (starCount === 2 && p.startsWith('*') && p.endsWith('*') && !p.includes('?')) {
            return t.includes(p.slice(1, -1));
        }

        // Общий случай: строим RegExp из паттерна
        // 1) экранируем все спецсимволы RegExp, включая '.', кроме '*' и '?'
        // 2) '*' → '.*', '?' → '.'
        const escaped = p
            .replace(/[-[\]{}()+\\^$|#\s]/g, '\\$&')  // note: точку мы не экранируем здесь
            .replace(/\./g, '\\.')                   // экранируем '.' отдельно
            .replace(/\*/g, '.*')
            .replace(/\?/g, '.');

        const re = new RegExp(`^${escaped}$`, 'i');
        return re.test(t);
    }
}

module.exports = WildcardMatcher;
