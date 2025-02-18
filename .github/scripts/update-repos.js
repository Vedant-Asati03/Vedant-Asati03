import { readFileSync, writeFileSync } from 'fs';
import { get } from 'https';

const REPOS = ['Aurras', 'Tusk', 'TerminalChess', 'Yggdrasill'];
const USERNAME = 'Vedant-Asati03';

async function getRepoData(repo) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.github.com',
            path: `/repos/${USERNAME}/${repo}`,
            headers: {
                'User-Agent': 'Node.js',
                'Authorization': `token ${process.env.GITHUB_TOKEN}`
            }
        };

        get(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        }).on('error', reject);
    });
}

async function updateReadme() {
    const readmePath = 'README.md';
    let readme = readFileSync(readmePath, 'utf8');

    let reposContent = '<div align="center">\n';
    for (const repo of REPOS) {
        const data = await getRepoData(repo);
        reposContent += `  <div style="border: 1px solid #e1e4e8; border-radius: 6px; padding: 16px; margin: 16px; width: 300px; display: inline-block;">
    <h3><a href="${data.html_url}">${repo}</a></h3>
    <p>${data.description}</p>
    <p>
      <img src="https://img.shields.io/github/stars/${USERNAME}/${repo}?style=flat-square&color=7F3FBF"/>
      <img src="https://img.shields.io/github/forks/${USERNAME}/${repo}?style=flat-square&color=7F3FBF"/>
    </p>
  </div>\n`;
    }
    reposContent += '</div>';

    readme = readme.replace(
        /<!-- REPO-LIST:START -->[\s\S]*<!-- REPO-LIST:END -->/,
        `<!-- REPO-LIST:START -->\n${reposContent}\n<!-- REPO-LIST:END -->`
    );

    writeFileSync(readmePath, readme);
}

updateReadme().catch(console.error);
