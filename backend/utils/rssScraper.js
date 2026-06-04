const axios = require('axios');
const AutoJob = require('../models/AutoJob');

const RSS_SOURCES = [
  { platform:'RemoteOK', platformIcon:'🌍', feeds:['https://remoteok.com/remote-ai-jobs.rss','https://remoteok.com/remote-machine-learning-jobs.rss'], referralUrl:'' },
  { platform:'WeWorkRemotely', platformIcon:'💻', feeds:['https://weworkremotely.com/categories/remote-programming-jobs.rss'], referralUrl:'' },
  { platform:'Jobicy', platformIcon:'🎯', feeds:['https://jobicy.com/?feed=job_feed&job_types=full-time&job_region=anywhere&search_keywords=AI','https://jobicy.com/?feed=job_feed&job_types=freelance&job_region=anywhere&search_keywords=machine+learning'], referralUrl:'' },
];

function parseRSSItems(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];
    const get = (tag) => {
      const r = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`);
      const m = r.exec(itemXml);
      return m ? (m[1] || m[2] || '').trim() : '';
    };
    const title = get('title');
    const link = get('link');
    const desc = get('description') || get('summary');
    const pubDate = get('pubDate') || get('published');
    const company = get('author') || get('company') || '';
    if (title && link) items.push({ title, link, desc, pubDate, company });
  }
  return items;
}

function stripHtml(html) {
  return (html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 500);
}

function extractTags(title, desc) {
  const keywords = ['Python','JavaScript','React','Node.js','AI','ML','LLM','NLP','Data Science','Machine Learning','Annotation','Prompt Engineering','Remote','Full-time','Freelance'];
  const text = (title + ' ' + desc).toLowerCase();
  return keywords.filter(k => text.includes(k.toLowerCase()));
}

async function syncRSSJobs() {
  console.log('🔄 Starting RSS job sync...');
  let totalAdded = 0, totalSkipped = 0;
  for (const source of RSS_SOURCES) {
    for (const feedUrl of source.feeds) {
      try {
        const response = await axios.get(feedUrl, { timeout: 10000, headers: { 'User-Agent': 'Mozilla/5.0 (compatible; RSS Reader)', 'Accept': 'application/rss+xml, application/xml, text/xml' } });
        const items = parseRSSItems(response.data);
        console.log(`  📡 ${source.platform}: ${items.length} items`);
        for (const item of items.slice(0, 20)) {
          try {
            await AutoJob.create({
              title: item.title, company: item.company || source.platform,
              platform: source.platform, platformIcon: source.platformIcon,
              description: stripHtml(item.desc), url: item.link,
              referralUrl: source.referralUrl || item.link,
              tags: extractTags(item.title, item.desc),
              location: 'Remote', postedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
              externalId: item.link, source: 'rss', isActive: true,
            });
            totalAdded++;
          } catch (e) { if (e.code === 11000) totalSkipped++; }
        }
      } catch (err) { console.log(`  ❌ Feed failed (${source.platform}): ${err.message}`); }
    }
  }
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const deleted = await AutoJob.deleteMany({ postedAt: { $lt: thirtyDaysAgo } });
  console.log(`✅ RSS sync: +${totalAdded} new, ${totalSkipped} dupes, ${deleted.deletedCount} cleaned`);
  return { added: totalAdded, skipped: totalSkipped };
}

module.exports = { syncRSSJobs };
