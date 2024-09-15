const fs = require('fs');
const fetch = require('node-fetch');

const repos = [
  { name: 'Aurras', url: 'https://github.com/Vedant-Asati03/Aurras' },
  { name: 'TerminalChess', url: 'https://github.com/Vedant-Asati03/TerminalChess' },
  { name: 'Yggdrasill', url: 'https://github.com/Vedant-Asati03/Yggdrasill' },
  { name: 'Spamzee', url: 'https://github.com/Vedant-Asati03/Spamzee' }
];

async function fetchRepoData(repo) {
  const response = await fetch(`https://api.github.com/repos/Vedant-Asati03/${repo.name}`);
  const data = await response.json();
  return {
    ...repo,
    stars: data.stargazers_count,
    forks: data.forks_count,
    description: data.description
  };
}

async function updateReadme() {
  const repoData = await Promise.all(repos.map(fetchRepoData));
  const repoMarkdown = repoData.map(repo => `
  <div style="border: 1px solid #e1e4e8; border-radius: 6px; padding: 16px; width: 300px; box-shadow: 0 1px 3px rgba(27,31,35,0.12), 0 8px 24px rgba(27,31,35,0.12);">
    <h3><a href="${repo.url}" target="_blank">${repo.name}</a></h3>
    <p>${repo.description || 'No description available'}</p>
    <p>⭐ ${repo.stars} | 🍴 ${repo.forks}</p>
  </div>
  `).join('\n');

  const readmeContent = fs.readFileSync('README.md', 'utf8');
  const updatedReadme = readmeContent.replace(
    /<!-- REPO-LIST-START -->([\s\S]*?)<!-- REPO-LIST-END -->/,
    `<!-- REPO-LIST-START -->\n${repoMarkdown}\n<!-- REPO-LIST-END -->`
  );

  fs.writeFileSync('README.md', updatedReadme);
}

updateReadme();
