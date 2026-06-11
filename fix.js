const fs = require('fs');

const css = `
/* Regression Fix: Restore Rate Dropdown Arrow */
.rate-chevron {
  width: 16px;
  height: 16px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
`;

fs.appendFileSync('css/navbar.css', css, 'utf8');
console.log('Appended fix to css/navbar.css');
