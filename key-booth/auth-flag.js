/**
 * Remote switch for the Cotton AI marketing home page (index) password gate.
 * - true  = require 12h key before showing the home page
 * - false = home page is public
 *
 * Deploy this with your key-booth (e.g. pwd GitHub Pages / Vercel). The main site
 * loads this file from the booth URL — edit, commit, and deploy the booth; no
 * main-site deploy needed to change the switch (after cache updates — see index.html).
 */
window.__COTTON_SITE_AUTH = true;
