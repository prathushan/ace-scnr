async function scan() {
  const url = document.getElementById('urlInput').value;
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = 'Scanning...';

  const res = await fetch('/scan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  const data = await res.json();

  if (data.violations && data.violations.length > 0) {
    resultsDiv.innerHTML = `<h2>Accessibility Issues Found: ${data.violations.length}</h2>`;
    data.violations.forEach(issue => {
      const issueDiv = document.createElement('div');
      issueDiv.className = 'issue';
      issueDiv.innerHTML = `
        <h3>${issue.help}</h3>
        <p>${issue.description}</p>
        <p><strong>Impact:</strong> ${issue.impact}</p>
        <ul>${issue.nodes.map(n => `<li>${n.html}</li>`).join('')}</ul>
      `;
      resultsDiv.appendChild(issueDiv);
    });
  } else {
    resultsDiv.innerHTML = '<p>No accessibility issues found!</p>';
  }
}
