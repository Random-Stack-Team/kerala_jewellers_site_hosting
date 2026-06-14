const fs = require('fs');
let content = fs.readFileSync('e:/Kerala-Jewellers-final/contact.html', 'utf8');

const pbSrc = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d73179.33654610635!2d80.16209376104958!3d13.085773551826774!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5266ff599f70c7%3A0x4a31398d2bd54e3e!2sKerala%20Jewellers!5e0!3m2!1sen!2sin!4v1781427289656!5m2!1sen!2sin';
const purasaiSrc = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d124383.69344535314!2d80.06390893357451!3d13.036281600000018!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52650ee5ca98f7%3A0x4f05935e85fd942!2sKERALA%20JEWELLERS%20PURASAIWALKKAM!5e0!3m2!1sen!2sin!4v1781427395556!5m2!1sen!2sin';
const porurSrc = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d124383.69344535314!2d80.06390893357451!3d13.036281600000018!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52610336849493%3A0x63775f892b2c9167!2sKerala%20Jewellers!5e0!3m2!1sen!2sin!4v1781427356122!5m2!1sen!2sin';

content = content.replace(/src=\"[^\"]+Kerala\+Jewellers\+Pondy\+Bazaar\+Chennai[^\"]+\"/, 'src=\"' + pbSrc + '\"');
content = content.replace(/src=\"[^\"]+Kerala\+Jewellers\+Purasawalkam\+Chennai[^\"]+\"/, 'src=\"' + purasaiSrc + '\"');
content = content.replace(/src=\"[^\"]+Kerala\+Jewellers\+Porur\+Chennai[^\"]+\"/, 'src=\"' + porurSrc + '\"');

fs.writeFileSync('e:/Kerala-Jewellers-final/contact.html', content, 'utf8');
console.log('Replaced map URLs in contact.html');
