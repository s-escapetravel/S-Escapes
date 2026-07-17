/* Provider-neutral analytics queue. Connect a consented provider outside this file. */
window.SEscapesAnalytics = window.SEscapesAnalytics || []
window.trackSEscapes = (event, properties = {}) => window.SEscapesAnalytics.push({ event, properties, at: new Date().toISOString() })
