import { Host } from '@/web/background/IPC'
import { AppConfig } from '@/web/Config'
import { ParsedItem, parseClipboard } from '@/parser'

const POEDB_LANGS = { 'en': 'us', 'ru': 'ru', 'cmn-Hant': 'tw', 'zh_CN': 'cn', 'ko': 'kr' }

export function registerActions () {
  Host.onEvent('MAIN->CLIENT::item-text', (e) => {
    if (!['open-wiki', 'open-craft-of-exile', 'open-poedb', 'search-similar'].includes(e.target)) return
    const parsed = parseClipboard(e.clipboard)
    if (!parsed.isOk()) return

    if (e.target === 'open-wiki') {
      openWiki(parsed.value)
    } else if (e.target === 'open-craft-of-exile') {
      openCoE(parsed.value)
    } else if (e.target === 'open-poedb') {
      openPoedb(parsed.value)
    } else if (e.target === 'search-similar') {
      findSimilarItems(parsed.value)
    }
  })
}

export function openWiki (item: ParsedItem) {
  window.open(`https://www.poewiki.net/wiki/${item.info.refName}`)
}
export function openPoedb (item: ParsedItem) {
  window.open(`https://poedb.tw/${POEDB_LANGS[AppConfig().language]}/search?q=${item.info.refName}`)
}
export function openCoE (item: ParsedItem) {
  const encodedClipboard = encodeURIComponent(item.rawText)
  window.open(`https://craftofexile.com/?game=poe1&eimport=${encodedClipboard}`)
}

export function findSimilarItems (item: ParsedItem) {
  const text = JSON.stringify(item.info.name)
  Host.sendEvent({
    name: 'CLIENT->MAIN::user-action',
    payload: { action: 'stash-search', text }
  })
}
