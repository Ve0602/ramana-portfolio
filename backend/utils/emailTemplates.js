// emailTemplates.js
// All beautiful HTML email templates

const baseTemplate = ({ content, brandColor = '#d4a853', brandName = 'Vemunoori Collections', year = new Date().getFullYear(), unsubscribeNote = '' }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${brandName}</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background:#f4f4f4; color:#222; }
    .wrapper { max-width:600px; margin:0 auto; background:#ffffff; }
    .header { background:linear-gradient(135deg,#1a0800,#2d1500); padding:32px 40px; text-align:center; }
    .logo-circle { width:70px; height:70px; border-radius:50%; background:linear-gradient(135deg,${brandColor},#b8860b); display:inline-flex; align-items:center; justify-content:center; font-size:26px; font-weight:900; color:#000; margin-bottom:12px; }
    .brand-name { color:${brandColor}; font-size:24px; font-weight:900; letter-spacing:1px; }
    .brand-tag { color:rgba(255,255,255,0.5); font-size:12px; letter-spacing:3px; text-transform:uppercase; margin-top:4px; }
    .content { padding:36px 40px; }
    .footer { background:#1a1a1a; padding:24px 40px; text-align:center; }
    .footer p { color:#666; font-size:12px; line-height:1.7; }
    .footer a { color:${brandColor}; text-decoration:none; }
    .divider { height:3px; background:linear-gradient(90deg,${brandColor},transparent); margin:24px 0; }
    .btn { display:inline-block; background:linear-gradient(135deg,${brandColor},#b8860b); color:#000 !important; padding:14px 32px; border-radius:8px; font-weight:800; font-size:15px; text-decoration:none; margin:16px 0; }
    .highlight { background:linear-gradient(135deg,#fff8e1,#fff3cc); border-left:4px solid ${brandColor}; padding:16px 20px; border-radius:0 8px 8px 0; margin:16px 0; }
    @media(max-width:600px){ .content,.header,.footer{ padding:20px 20px; } }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo-circle">VC</div>
      <div class="brand-name">${brandName}</div>
      <div class="brand-tag">Fashion · Technology · Excellence</div>
    </div>
    ${content}
    <div class="footer">
      <p>© ${year} ${brandName} · Warangal, Telangana, India</p>
      <p style="margin-top:8px;">
        <a href="https://ramana-portfolio-one.vercel.app/home">Visit Website</a> &nbsp;·&nbsp;
        <a href="https://wa.me/918499882843">WhatsApp Us</a>
        ${unsubscribeNote ? `&nbsp;·&nbsp;<a href="#">Unsubscribe</a>` : ''}
      </p>
    </div>
  </div>
</body>
</html>
`;

// ── TEMPLATES ──────────────────────────────────────────────────

const templates = {

  // General announcement
  general: ({ subject, message, ctaText = 'Visit Now', ctaLink = 'https://ramana-portfolio-one.vercel.app/home', brandColor, brandName }) =>
    baseTemplate({
      brandColor, brandName,
      content: `
        <div class="content">
          <h2 style="font-size:22px;font-weight:800;margin-bottom:12px;">${subject}</h2>
          <div class="divider"></div>
          <p style="font-size:15px;line-height:1.8;color:#444;">${message}</p>
          <div style="text-align:center;margin-top:24px;">
            <a href="${ctaLink}" class="btn">${ctaText} →</a>
          </div>
        </div>`
    }),

  // New Product Added
  product: ({ productName, productDesc, price, category, imageUrl, ctaLink = 'https://ramana-portfolio-one.vercel.app/shop', brandColor, brandName }) =>
    baseTemplate({
      brandColor, brandName,
      content: `
        <div class="content">
          <p style="color:#888;font-size:13px;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;">✨ New Arrival</p>
          <h2 style="font-size:24px;font-weight:900;margin-bottom:6px;">${productName}</h2>
          <p style="color:#888;font-size:13px;margin-bottom:16px;">${category}</p>
          <div class="divider"></div>
          ${imageUrl ? `<img src="${imageUrl}" alt="${productName}" style="width:100%;max-height:280px;object-fit:cover;border-radius:10px;margin-bottom:16px;" />` : ''}
          <p style="font-size:15px;line-height:1.8;color:#444;margin-bottom:12px;">${productDesc}</p>
          ${price ? `<div class="highlight"><span style="font-size:28px;font-weight:900;color:#b8860b;">Price: ${price}</span></div>` : ''}
          <div style="text-align:center;margin-top:20px;">
            <a href="${ctaLink}" class="btn">🛍️ Shop Now →</a>
          </div>
          <p style="font-size:12px;color:#aaa;text-align:center;margin-top:12px;">Limited stock available. Order now!</p>
        </div>`
    }),

  // New Referral/Job Added
  referral: ({ platform, description, perks = [], ctaLink = 'https://ramana-portfolio-one.vercel.app/referrals', brandColor, brandName }) =>
    baseTemplate({
      brandColor, brandName,
      content: `
        <div class="content">
          <p style="color:#888;font-size:13px;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;">💼 New Opportunity</p>
          <h2 style="font-size:24px;font-weight:900;margin-bottom:12px;">${platform}</h2>
          <div class="divider"></div>
          <p style="font-size:15px;line-height:1.8;color:#444;margin-bottom:16px;">${description}</p>
          ${perks.length > 0 ? `
          <div class="highlight">
            <p style="font-weight:700;margin-bottom:8px;">What you get:</p>
            ${perks.map(p => `<p style="color:#555;margin:4px 0;">✅ ${p}</p>`).join('')}
          </div>` : ''}
          <div style="text-align:center;margin-top:20px;">
            <a href="${ctaLink}" class="btn">🔗 Apply Now →</a>
          </div>
        </div>`
    }),

  // Freelance service
  freelance: ({ serviceTitle, serviceDesc, price, ctaLink = 'https://ramana-portfolio-one.vercel.app/freelance', brandColor, brandName }) =>
    baseTemplate({
      brandColor, brandName,
      content: `
        <div class="content">
          <p style="color:#888;font-size:13px;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;">🚀 New Service Available</p>
          <h2 style="font-size:24px;font-weight:900;margin-bottom:12px;">${serviceTitle}</h2>
          <div class="divider"></div>
          <p style="font-size:15px;line-height:1.8;color:#444;margin-bottom:16px;">${serviceDesc}</p>
          ${price ? `<div class="highlight"><p style="font-size:18px;font-weight:700;">Starting at <span style="color:#b8860b;font-size:24px;">${price}</span></p></div>` : ''}
          <div style="text-align:center;margin-top:20px;">
            <a href="${ctaLink}" class="btn">💼 Hire Me →</a>
          </div>
        </div>`
    }),

  // Festival / Seasonal
  festival: ({ festivalName, festivalEmoji, message, offerText, ctaText = 'Explore Now', ctaLink = 'https://ramana-portfolio-one.vercel.app/home', bgColor = '#1a0800', brandColor, brandName }) =>
    baseTemplate({
      brandColor, brandName,
      content: `
        <div style="background:linear-gradient(135deg,${bgColor},#000);padding:40px;text-align:center;">
          <div style="font-size:60px;margin-bottom:12px;">${festivalEmoji}</div>
          <h1 style="color:${brandColor};font-size:32px;font-weight:900;margin-bottom:8px;">Happy ${festivalName}!</h1>
          <p style="color:rgba(255,255,255,0.7);font-size:16px;">From all of us at ${brandName}</p>
        </div>
        <div class="content">
          <div class="divider"></div>
          <p style="font-size:15px;line-height:1.8;color:#444;margin-bottom:16px;">${message}</p>
          ${offerText ? `
          <div style="background:linear-gradient(135deg,#fff8e1,#fffde7);border:2px dashed ${brandColor};border-radius:10px;padding:20px;text-align:center;margin:16px 0;">
            <p style="font-size:13px;text-transform:uppercase;letter-spacing:2px;color:#888;margin-bottom:6px;">Special Offer</p>
            <p style="font-size:22px;font-weight:900;color:#b8860b;">${offerText}</p>
          </div>` : ''}
          <div style="text-align:center;margin-top:20px;">
            <a href="${ctaLink}" class="btn">${ctaText} →</a>
          </div>
        </div>`
    }),

  // Welcome email for new users
  welcome: ({ userName, brandColor, brandName }) =>
    baseTemplate({
      brandColor, brandName,
      content: `
        <div class="content">
          <h2 style="font-size:24px;font-weight:900;margin-bottom:8px;">Welcome, ${userName}! 🎉</h2>
          <div class="divider"></div>
          <p style="font-size:15px;line-height:1.8;color:#444;margin-bottom:16px;">
            We're so happy you joined <strong>${brandName}</strong>! Here's what you can explore:
          </p>
          <div style="display:grid;gap:10px;margin:16px 0;">
            ${[['👗','Fashion Boutique','Beautiful kids dresses, women jackets & sarees','/shop'],['🧵','Tailoring Services','Custom stitching for every occasion','/shop?cat=tailoring'],['🤖','AI Portfolio','Prompt engineering & data science services','/portfolio'],['🔗','Job Referrals','Exclusive AI platform referral links','/referrals']].map(([icon,title,desc,link]) => `
            <div style="background:#f9f9f9;border-radius:8px;padding:14px 16px;display:flex;align-items:center;gap:12px;">
              <span style="font-size:24px;">${icon}</span>
              <div>
                <p style="font-weight:700;font-size:14px;">${title}</p>
                <p style="color:#888;font-size:12px;">${desc}</p>
              </div>
            </div>`).join('')}
          </div>
          <div style="text-align:center;margin-top:24px;">
            <a href="https://ramana-portfolio-one.vercel.app/home" class="btn">🚀 Start Exploring →</a>
          </div>
          <p style="text-align:center;margin-top:14px;font-size:13px;color:#aaa;">
            Need help? WhatsApp us at <a href="https://wa.me/918499882843" style="color:#b8860b;">+91 8499882843</a>
          </p>
        </div>`
    }),
};

module.exports = templates;
