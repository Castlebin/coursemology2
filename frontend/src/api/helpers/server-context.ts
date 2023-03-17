const serverContext = document.querySelector("meta[name='server-context']");

const getServerContextAttribute = (attributeName: string) => {
  return serverContext ? serverContext.getAttribute(attributeName) : null;
};

const i18nLocale = getServerContextAttribute("data-i18n-locale");
const timeZone = getServerContextAttribute("data-time-zone");

const csrfTag = document.querySelector('meta[name="csrf-token"]');
const csrfToken = csrfTag ? csrfTag.getAttribute("content") : null;

export { csrfToken, i18nLocale, timeZone };
