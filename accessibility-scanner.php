<?php
/**
 * Plugin Name: Accessibility Scanner
 * Description: Scan any URL for accessibility issues using a Node.js backend hosted on Vercel.
 * Version: 1.0
 * Author: Your Name
 */

add_action('admin_menu', 'accessibility_scanner_menu');
function accessibility_scanner_menu() {
    add_menu_page(
        'Accessibility Scanner',
        'Accessibility Scanner',
        'manage_options',
        'accessibility-scanner',
        'accessibility_scanner_page',
        'dashicons-visibility',
        100
    );
}

function accessibility_scanner_page() {
    ?>
    <div class="wrap">
        <h1>Accessibility Scanner</h1>
        <input type="text" id="urlInput" placeholder="Enter URL to scan" style="padding:8px;width:400px;" />
        <button onclick="runScan()" style="padding:8px 12px;margin-left:10px;">Scan</button>
        <div id="result" style="margin-top:1rem;">Results will appear here...</div>
    </div>

    <script>
    async function runScan() {
        const url = document.getElementById('urlInput').value;
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = "<p>Scanning...</p>";

        try {
            const res = await fetch("https://ace-scnr-prathushas-projects.vercel.app/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ url: url })
            });

            if (!res.ok) throw new Error("Failed to fetch from scanner API");

            const data = await res.json();
            const violations = data.violations || [];

            if (violations.length === 0) {
                resultDiv.innerHTML = "<p style='color: green;'>No accessibility violations found ✅</p>";
                return;
            }

            resultDiv.innerHTML = "<h3>Accessibility Violations Found:</h3>";
            violations.forEach(v => {
                const el = document.createElement('div');
                el.style.background = "#ffecec";
                el.style.borderLeft = "5px solid #f44336";
                el.style.padding = "10px";
                el.style.marginBottom = "10px";
                el.innerHTML = `
                    <strong>${v.help} (${v.impact || 'no impact'})</strong>
                    <p>${v.description}</p>
                    <pre>${v.nodes.map(n => n.html).join('\n\n')}</pre>
                `;
                resultDiv.appendChild(el);
            });

        } catch (err) {
            resultDiv.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
        }
    }
    </script>
    <?php
}
