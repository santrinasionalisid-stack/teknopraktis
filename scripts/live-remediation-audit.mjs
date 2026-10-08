const urls = [
  'https://teknopraktis.my.id/artikel/cara-menggunakan-ai-meringkas-dokumen/',
  'https://teknopraktis.my.id/artikel/aturan-satu-fungsi-satu-aplikasi-produktivitas/',
  'https://teknopraktis.my.id/artikel/cara-memeriksa-file-download-sebelum-dibuka/',
  'https://teknopraktis.my.id/artikel/checklist-keamanan-akun-google/',
  'https://teknopraktis.my.id/artikel/sinkronisasi-cloud-bukan-backup/',
  'https://teknopraktis.my.id/artikel/cara-audit-izin-browser-kamera-mikrofon-lokasi/',
];

const marker = 'data-ui-version="editorial-remediation-20261008-v4"';
const forbiddenJustifyNeedles = [
  'text-align: justify',
  "setProperty('text-align', 'justify'",
];
const failures = [];

for (const url of urls) {
  const auditUrl = url + '?live_audit=' + Date.now();
  const response = await fetch(auditUrl, {
    headers: {
      'cache-control': 'no-cache, no-store, max-age=0',
      pragma: 'no-cache',
    },
    redirect: 'follow',
  });
  const html = await response.text();
  const name = new URL(url).pathname;

  const checks = {
    http200: response.ok,
    marker: html.includes(marker),
    disclosureAbsent: !html.includes('Proses editorial:'),
    forcedJustifyAbsent: forbiddenJustifyNeedles.every((needle) => !html.includes(needle)),
    featured16x9: html.includes('aspect-ratio: 16 / 9; overflow: hidden;'),
    finalWebp: /\/images\/articles\/[a-z0-9-]+\.webp/.test(html),
  };

  console.log(name, checks);
  for (const [key, ok] of Object.entries(checks)) {
    if (!ok) failures.push(`${name}: ${key}`);
  }
}

if (failures.length) {
  console.error('\nLIVE REMEDIATION AUDIT FAILED');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

console.log('\nLIVE REMEDIATION AUDIT PASS — 6/6 articles serving remediated production HTML.');
