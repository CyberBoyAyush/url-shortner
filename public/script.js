(function () {
    'use strict';

    var urlCount = parseInt(localStorage.getItem('urlCount')) || 0;

    var urlInput = document.getElementById('urlInput');
    var shortenBtn = document.getElementById('shortenBtn');
    var resultBox = document.getElementById('resultBox');
    var resultUrl = document.getElementById('resultUrl');
    var copyBtn = document.getElementById('copyBtn');
    var errorBox = document.getElementById('errorBox');
    var errorText = document.getElementById('errorText');
    var urlCounter = document.getElementById('urlCounter');
    var uptimeCounter = document.getElementById('uptimeCounter');
    var gaugeFill = document.getElementById('gaugeFill');
    var healthStatus = document.getElementById('healthStatus');
    var healthSub = document.getElementById('healthSub');

    var ARC_LENGTH = 251.327;
    var HEALTH_CHECK_INTERVAL = 10000;

    if (urlCount > 0) {
        urlCounter.textContent = '0';
        setTimeout(function () {
            animateCounter(urlCounter, urlCount, '+');
        }, 300);
    } else {
        urlCounter.textContent = '0';
    }

    function shortenUrl() {
        var url = urlInput.value.trim();
        if (!url) {
            showError('Please enter a URL to shorten.');
            return;
        }

        shortenBtn.classList.add('loading');
        shortenBtn.disabled = true;
        hideResult();
        hideError();

        fetch('/shorten', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url })
        })
        .then(function (response) {
            return response.json().then(function (data) {
                return { ok: response.ok, data: data };
            });
        })
        .then(function (result) {
            if (result.ok) {
                var shortUrl = window.location.origin + '/' + result.data.code;
                resultUrl.textContent = shortUrl;
                showResult();
                urlCount++;
                localStorage.setItem('urlCount', urlCount);
                animateCounter(urlCounter, urlCount, '+');
                urlInput.value = '';
            } else {
                showError(result.data.error || 'Failed to shorten URL.');
            }
        })
        .catch(function () {
            showError('Cannot connect to server. Is it running?');
        })
        .finally(function () {
            shortenBtn.classList.remove('loading');
            shortenBtn.disabled = false;
        });
    }

    shortenBtn.addEventListener('click', shortenUrl);

    urlInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            shortenUrl();
        }
    });

    function showResult() {
        resultBox.classList.add('visible');
    }

    function hideResult() {
        resultBox.classList.remove('visible');
    }

    function showError(message) {
        errorText.textContent = message;
        errorBox.classList.add('visible');
        errorBox.style.animation = 'none';
        void errorBox.offsetHeight;
        errorBox.style.animation = 'shake 0.4s ease';
    }

    function hideError() {
        errorBox.classList.remove('visible');
    }

    copyBtn.addEventListener('click', function () {
        var url = resultUrl.textContent;
        if (!url) return;

        navigator.clipboard.writeText(url).then(function () {
            copyBtn.classList.add('copied');
            setTimeout(function () {
                copyBtn.classList.remove('copied');
            }, 2000);
        });
    });

    function checkHealth() {
        fetch('/health')
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Unhealthy');
            })
            .then(function (data) {
                updateGauge(true, data);
            })
            .catch(function () {
                updateGauge(false);
            });
    }

    function updateGauge(isHealthy, data) {
        if (isHealthy) {
            gaugeFill.style.stroke = '#10B981';
            gaugeFill.style.strokeDashoffset = ARC_LENGTH * 0.05;
            healthStatus.textContent = 'Healthy';
            healthStatus.className = 'gauge-status healthy';
            healthSub.textContent = 'Uptime: ' + Math.floor(data.uptime) + 's';
            animateCounter(uptimeCounter, 99, '%');
        } else {
            gaugeFill.style.stroke = '#EF4444';
            gaugeFill.style.strokeDashoffset = ARC_LENGTH * 0.85;
            healthStatus.textContent = 'Offline';
            healthStatus.className = 'gauge-status unhealthy';
            healthSub.textContent = 'No response from server';
            animateCounter(uptimeCounter, 0, '%');
        }
    }

    checkHealth();
    setInterval(checkHealth, HEALTH_CHECK_INTERVAL);

    function animateCounter(element, target, suffix) {
        suffix = suffix || '';
        var current = parseInt(element.textContent) || 0;
        var duration = current === 0 ? 1200 : 600;
        var startTime = performance.now();

        function update(now) {
            var elapsed = now - startTime;
            var progress = Math.min(elapsed / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var value = Math.round(current + (target - current) * eased);
            element.textContent = value + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    var shakeStyle = document.createElement('style');
    shakeStyle.textContent = [
        '@keyframes shake {',
        '  0%, 100% { transform: translateX(0); }',
        '  20% { transform: translateX(-6px); }',
        '  40% { transform: translateX(6px); }',
        '  60% { transform: translateX(-4px); }',
        '  80% { transform: translateX(4px); }',
        '}'
    ].join('\n');
    document.head.appendChild(shakeStyle);

})();
