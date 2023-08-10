const destinationIcon = `  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="green"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    class="w-6 h-6"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5"
    />
  </svg>`;

const personIcon = `<svg fill="#4757ed" height="800px" width="800px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
viewBox="0 0 188.111 188.111" xml:space="preserve">
<g>
<path d="M94.052,0C42.19,0.001,0,42.194,0.001,94.055c0,51.862,42.191,94.056,94.051,94.057
 c51.864-0.001,94.059-42.194,94.059-94.056C188.11,42.193,145.916,0,94.052,0z M94.052,173.111
 c-43.589-0.001-79.051-35.465-79.051-79.057C15,50.464,50.462,15.001,94.052,15c43.593,0,79.059,35.464,79.059,79.056
 C173.11,137.646,137.645,173.11,94.052,173.111z"/>
<path d="M94.053,50.851c-23.821,0.002-43.202,19.384-43.202,43.204c0,23.824,19.381,43.206,43.203,43.206
 c23.823,0,43.205-19.382,43.205-43.205C137.259,70.232,117.877,50.851,94.053,50.851z M94.054,122.261
 c-15.551,0-28.203-12.653-28.203-28.206c0-15.55,12.652-28.203,28.203-28.204c15.553,0,28.205,12.653,28.205,28.205
 C122.259,109.608,109.606,122.261,94.054,122.261z"/>
<circle cx="94.055" cy="94.056" r="16.229"/>
</g>
</svg>
`;

const pinLocationIcon = `<svg width="800px" fill="#4080bf" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<g>
    <path fill="none" d="M0 0h24v24H0z"/>
    <path d="M11 19.945A9.001 9.001 0 0 1 12 2a9 9 0 0 1 1 17.945V24h-2v-4.055z"/>
</g>
</svg>`;

const driversCarIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" id="car">
<circle cx="12.5" cy="13.5" r="13" fill="green"/>
<circle cx="12" cy="12" r="11" fill="black"/>
<g fill="white">
  <path d="M19,9.5h-.32L17.43,6.38A3,3,0,0,0,14.65,4.5h-6A3,3,0,0,0,5.7,6.91L5.18,9.5H5a3,3,0,0,0-3,3v3a1,1,0,0,0,1,1H4a3,3,0,0,0,6,0h4a3,3,0,0,0,6,0h1a1,1,0,0,0,1-1v-3A3,3,0,0,0,19,9.5Zm-6-3h1.65a1,1,0,0,1,.92.63l.95,2.37H13Zm-5.34.8a1,1,0,0,1,1-.8H11v3H7.22ZM7,17.5a1,1,0,1,1,1-1A1,1,0,0,1,7,17.5Zm10,0a1,1,0,1,1,1-1A1,1,0,0,1,17,17.5Zm3-3h-.78a3,3,0,0,0-4.44,0H9.22a3,3,0,0,0-4.44,0H4v-2a1,1,0,0,1,1-1H19a1,1,0,0,1,1,1Z"></path>
</g>
</svg>

`;

export const destinationIconUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  destinationIcon
)}`;
export const personIconUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  personIcon
)}`;
export const pinLocationIconUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  pinLocationIcon
)}`;
export const driversCarIconUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  driversCarIcon
)}`;
