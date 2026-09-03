const http = require('http');
http.get('http://127.0.0.1:4173/', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    console.log('HTML length:', data.length);
    const cssMatch = data.match(/\/assets\/index-[^"']+\.css/);
    console.log('CSS path:', cssMatch ? cssMatch[0] : 'None');
    if (cssMatch) {
      http.get('http://127.0.0.1:4173' + cssMatch[0], (cRes) => {
        let cssData = '';
        cRes.on('data', chunk => cssData += chunk);
        cRes.on('end', () => {
          console.log('CSS length:', cssData.length);
          console.log('Contains text-white:', cssData.includes('text-white'));
          console.log('Contains bg-[#07080a]:', cssData.includes('07080a'));
          console.log('Sample CSS:', cssData.substring(0, 300));
        });
      });
    }
  });
});
