// ==UserScript==
// @name        Daily Arxiv Highlight
// @namespace   logchan
// @match       *://dailyarxiv.com/#/list?*
// @grant       GM_getValue
// @version     1.0
// @author      logchan
// @description Because cs.CV sees more than a hundred papers every day.
// ==/UserScript==

class DailyArxivHighlighter {
  constructor() {
    this.keywords = GM_getValue("keywords", [])
    let observer = new MutationObserver(list => this.observerUpdate(list))
    observer.observe(document, { childList: true, subtree: true })
  }
  
  observerUpdate(list) {
    list.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        this.processUpdatedNode(node)
      })
    })
  }
  
  processUpdatedNode(node) {
    if (node.tagName === "DIV" && node.className.indexOf("arxiv_title") >= 0) {
      let title = node.innerText.toLowerCase()
      if (this.keywords.some(k => title.indexOf(k) >= 0)) {
        node.style.color = "red"
      }
      return
    }
    
    node.childNodes.forEach(child => {
      this.processUpdatedNode(child)
    })
  }
}

const highlighter = new DailyArxivHighlighter()