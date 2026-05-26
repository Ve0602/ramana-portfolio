const axios = require('axios');
const AutoJob = require('../models/AutoJob');

// ── RSS FEED SOURCES ──────────────────────────────────────────
// These are legitimate RSS feeds from job platforms
const RSS_SOURCES = [
  {
    platform: 'LinkedIn',
    platformIcon: '🔵',
    // LinkedIn public job RSS for AI/ML remote jobs
    feeds: [
      'https://www.linkedin.com/jobs/search/?keywords=prompt+engineer&location=India&f_WT=2&f_JT=C%2CF&format=rss',
      'https://www.linkedin.com/jobs/search/?keywords=AI+data+annotation&location=India&f_WT=2&format=rss',
    ],
    referralUrl: 'https://www.linkedin.com/in/vemunoori-ramana-41b86b198',
  },
  {
    platform: 'RemoteOK',
    platformIcon: '🌍',
    feeds: [
      'https://remoteok.com/remote-ai-jobs.rss',
      'https://remoteok.com/remote-machine-learning-jobs.rss',
    ],
    referralUrl: '',
  },
  {
    platform: 'WeWorkRemotely',
    platformIcon: '💻',
    feeds: [
      'https://weworkremotely.com/categories/remote-programming-jobs.rss',
    ],
    referralUrl: '',
  },
  {
    platform: 'Jobicy',
    platformIcon: '🎯',
    feeds: [
      'https://jobicy.com/?feed=job_feed&job_types=full-time&job_region=anywhere&search_keywords=AI',
      'https://jobicy.com/?feed=job_feed&job_types=freelance&job_region=anywhere&search_keywords=machine+learning',
    ],
    referralUrl: '',
  },
];

// ── PARSE RSS XML ─────────────────────────────────────────────
function parseRSSItems(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];
    const get = (tag) => {
      const r = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\/${tag}>`);
      const m = r.exec(itemXml);
      return m ? (m[1] || m[2] || '').trim() : '';
    };
    const getAttr = (tag, attr) => {
      const r = new RegExp(`<${tag}[^>]*${attr}="([^"]*)"[^>]*>`);
      const m = r.exec(itemXml);
      return m ? m[1] : '';
    };
    const title = get('title');
    const link  = get('link') || getAttr('link', 'href');
    const desc  = get('description') || get('summary');
    const pubDate = get('pubDate') || get('published');
    const company = get('author') || get('company') || '';
    const location = get('location') || 'Remote';
    const salary = get('salary') || '';

    if (title && link) {
      items.push({ title, link, desc, pubDate, company, location, salary });
    }
  }
  return items;
}

// Strip HTML tags from description
function stripHtml(html) {
  return (html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 500);
}

// Extract tags from title/description
function extractTags(title, desc) {
  const keywords = ['Python','JavaScript','React','Node.js','AI','ML','LLM','NLP','Data Science',
    'Machine Learning','Annotation','Prompt Engineering','Remote','Full-time','Freelance','Part-time'];
  const text = (title + ' ' + desc).toLowerCase();
  return keywords.filter(k => text.includes(k.toLowerCase()));
}

// ── MAIN SYNC FUNCTION ────────────────────────────────────────
async function syncRSSJobs() {
  console.log('🔄 Starting RSS job sync...');
  let totalAdded = 0;
  let totalSkipped = 0;

  for (const source of RSS_SOURCES) {
    for (const feedUrl of source.feeds) {
      try {
        const response = await axios.get(feedUrl, {
          timeout: 10000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; RSS Reader)',
            'Accept': 'application/rss+xml, application/xml, text/xml',
          }
        });

        const items = parseRSSItems(response.data);
        console.log(`  📡 ${source.platform}: found ${items.length} items`);

        for (const item of items.slice(0, 20)) { // max 20 per feed
          try {
            await AutoJob.create({
              title: item.title,
              company: item.company || source.platform,
              platform: source.platform,
              platformIcon: source.platformIcon,
              description: stripHtml(item.desc),
              url: item.link,
              referralUrl: source.referralUrl || item.link,
              tags: extractTags(item.title, item.desc),
              location: item.location || 'Remote',
              salary: item.salary || '',
              postedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
              externalId: item.link,
              source: 'rss',
              isActive: true,
            });
            totalAdded++;
          } catch (e) {
            if (e.code === 11000) { totalSkipped++; } // duplicate
            else console.log(`    ⚠️ Skip: ${e.message}`);
          }
        }
      } catch (err) {
        console.log(`  ❌ Feed failed (${source.platform}): ${err.message}`);
      }
    }
  }

  // Clean up old jobs (older than 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const deleted = await AutoJob.deleteMany({ postedAt: { $lt: thirtyDaysAgo } });

  console.log(`✅ RSS sync done: +${totalAdded} new, ${totalSkipped} duplicates, ${deleted.deletedCount} cleaned`);
  return { added: totalAdded, skipped: totalSkipped, cleaned: deleted.deletedCount };
}

module.exports = { syncRSSJobs };
