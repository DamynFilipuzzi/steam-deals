<p align="center">
  <br/>
  <a href="https://www.steamdeals.ca" target="_blank"><img width="96px" src="https://www.steamdeals.ca/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fandroid-chrome-192x192.7be14410.png&w=128&q=75" /></a>
  <h3 align="center">Steam Deals</h3>
  <p align="center">
    Steam Deals is a web application created with the intention of making purchasing steam games easier. This project is still in early development, but a live version can be found <a href='https://www.steamdeals.ca'>here</a>. This project is supported by this <a href="https://github.com/DamynFilipuzzi/scraper-py">repository</a> for the purpose of web scraping.
  </p>
</p>

## Features

- Tracks over 150,000 games and DLC.
- Historical price tracking for all apps
- Search for games and DLC using filterable fields (Search, Checkboxes, etc..)
- Steam OAuth Login integration
- Display stats, most played, top selling

## Planned Features

- Increase the amount of content tracked (Packages, Bundles Soundtracks).
- Expand functionality of price history graph. Add Filtering options.
- Wishlist feature with user defined low price notification setting.

## Usage

1. Make a copy of the `.env.example` file and rename it to `.env`. Then fill the blank fields in the `.env` file.
1.  Run `npm install`.
1.  Then run `npm run build`, and finally `npm run dev`.
1.  Finally run `npm run db:push` to build the database.

***Note:*** This repository depends on the <a target="_blank" href="https://github.com/DamynFilipuzzi/scraper-py">steam-scraper-py</a> project for scraping data from Steam's app library. If you haven’t run the scraper yet, no apps will be visible.

## Tech Stack

<table align="center">
  <thead><tr style="font-weight: bold;"><td>Tech</td><td>Version</td></tr></thead>
  <tbody>
    <tr><td>NextJS</td><td>14.1.1</td></tr>
    <tr><td>ReactJS</td><td>18.2.0</td></tr>
    <tr><td>TypeScript</td><td>5.3.3</td></tr>
    <tr><td>PostgreSQL</td><td>16.3.0</td></tr>
    <tr><td>Prisma</td><td>5.14.0</td></tr>
    <tr><td>tRPC</td><td>10.45.1</td></tr>
    <tr><td>Tailwind</td><td>3.4.1</td></tr>
  </tbody>
</table>

###### Note

Steam Deals is a hobby project and is not affiliated with Valve or Steam.

Steam and the Steam logo are trademarks of Valve Corporation. All other trademarks are property of their respective owners.

