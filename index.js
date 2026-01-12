/**
 * GitBook Plugin: Platform Tabs
 *
 * Provides platform switching (Android/iOS/HarmonyOS) and language switching
 * (Java/Kotlin, ObjC/Swift, TypeScript/JavaScript) for SDK documentation.
 *
 * Usage:
 *
 * 1. Single-level platform tabs ({% platformtabs %}):
 *    {% platformtabs id="unique-id" %}
 *    {% platform "Android" %}
 *    Content for Android...
 *    {% endplatform %}
 *    {% platform "iOS" %}
 *    Content for iOS...
 *    {% endplatform %}
 *    {% endplatformtabs %}
 *
 * 2. Two-level code sample tabs ({% codesample %}):
 *    {% codesample id="unique-id" %}
 *    {% platform "Android" %}
 *    {% lang "Java" %}
 *    ```java
 *    // Java code
 *    ```
 *    {% endlang %}
 *    {% lang "Kotlin" %}
 *    ```kotlin
 *    // Kotlin code
 *    ```
 *    {% endlang %}
 *    {% endplatform %}
 *    {% endcodesample %}
 */

var defined = require('./utils/defined');

// Counter for generating unique IDs
var tabIdCounter = 0;

/**
 * Get plugin configuration
 */
function getConfig(context, property, defaultValue) {
    var config = context.config ? context.config : context.book.config;
    return config.get(property, defaultValue);
}

/**
 * Generate a unique ID for tabs
 */
function generateId(prefix) {
    tabIdCounter++;
    return prefix + '-' + tabIdCounter;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Normalize content by removing wrapping <p> tags if present
 * This ensures consistent rendering across platforms
 */
function normalizeContent(content) {
    if (!content) return '';
    var trimmed = content.trim();

    // Case 1: Complete <p>...</p> wrapper
    var match = trimmed.match(/^\s*<p>([\s\S]*?)<\/p>\s*$/);
    if (match) {
        return match[1].trim();
    }

    // Case 2: Only opening <p> tag without closing </p> (GitBook quirk)
    // This happens when content is parsed and </p> ends up outside the platform block
    match = trimmed.match(/^\s*<p>([\s\S]*)$/);
    if (match && !trimmed.includes('</p>')) {
        return match[1].trim();
    }

    return trimmed;
}

/**
 * Parse platform blocks from content
 * Matches <!-- platform:name --> ... <!-- /platform -->
 */
function parsePlatformBlocks(content) {
    var platforms = [];
    var platformRegex = /<!--\s*platform:\s*([^>]+?)\s*-->([\s\S]*?)<!--\s*\/platform\s*-->/g;
    var match;

    while ((match = platformRegex.exec(content)) !== null) {
        platforms.push({
            name: match[1].trim(),
            content: match[2].trim()
        });
    }

    return platforms;
}

/**
 * Parse language blocks from content
 * Matches <!-- lang:name --> ... <!-- /lang -->
 */
function parseLangBlocks(content) {
    var langs = [];
    var langRegex = /<!--\s*lang:\s*([^>]+?)\s*-->([\s\S]*?)<!--\s*\/lang\s*-->/g;
    var match;

    while ((match = langRegex.exec(content)) !== null) {
        langs.push({
            name: match[1].trim(),
            content: match[2].trim()
        });
    }

    return langs;
}

/**
 * Get platform icon class
 */
function getPlatformIcon(platform) {
    var icons = {
        'Android': 'fa-android',
        'iOS': 'fa-apple',
        'HarmonyOS': 'fa-mobile'
    };
    return icons[platform] || 'fa-code';
}

/**
 * Process {% platformtabs %} block
 * Single-level platform switching
 */
function processPlatformTabs(block) {
    var book = this;
    var id = block.kwargs.id || generateId('platform-tabs');
    var defaultPlatform = getConfig(book, 'pluginsConfig.platform-tabs.defaultPlatform', 'Android');

    // Parse platform blocks
    var platforms = parsePlatformBlocks(block.body);

    if (platforms.length === 0) {
        return '<div class="platform-tabs-error">No platform blocks found</div>';
    }

    // Build HTML
    var html = '<div class="platform-tabs-container" id="' + id + '">';

    // Tab headers
    html += '<div class="platform-tabs-header">';
    platforms.forEach(function(platform, index) {
        var isActive = (platform.name === defaultPlatform) || (index === 0 && platforms.every(function(p) { return p.name !== defaultPlatform; }));
        var activeClass = isActive ? ' active' : '';
        var icon = getPlatformIcon(platform.name);
        html += '<button class="platform-tab' + activeClass + '" data-platform="' + platform.name + '" data-tabs-id="' + id + '">';
        html += '<i class="fa ' + icon + '"></i> ' + platform.name;
        html += '</button>';
    });
    html += '</div>';

    // Tab contents
    html += '<div class="platform-tabs-content">';
    platforms.forEach(function(platform, index) {
        var isActive = (platform.name === defaultPlatform) || (index === 0 && platforms.every(function(p) { return p.name !== defaultPlatform; }));
        var activeClass = isActive ? ' active' : '';
        html += '<div class="platform-content' + activeClass + '" data-platform="' + platform.name + '">';
        html += normalizeContent(platform.content);
        html += '</div>';
    });
    html += '</div>';

    html += '</div>';

    return html;
}

/**
 * Process {% codesample %} block
 * Two-level switching: platform + language
 */
function processCodeSample(block) {
    var book = this;
    var id = block.kwargs.id || generateId('code-sample');
    var defaultPlatform = getConfig(book, 'pluginsConfig.platform-tabs.defaultPlatform', 'Android');

    // Parse platform blocks
    var platforms = parsePlatformBlocks(block.body);

    if (platforms.length === 0) {
        return '<div class="platform-tabs-error">No platform blocks found</div>';
    }

    // Build HTML
    var html = '<div class="code-sample-container" id="' + id + '">';

    // Platform tab headers
    html += '<div class="platform-tabs-header">';
    platforms.forEach(function(platform, index) {
        var isActive = (platform.name === defaultPlatform) || (index === 0 && platforms.every(function(p) { return p.name !== defaultPlatform; }));
        var activeClass = isActive ? ' active' : '';
        var icon = getPlatformIcon(platform.name);
        html += '<button class="platform-tab' + activeClass + '" data-platform="' + platform.name + '" data-tabs-id="' + id + '">';
        html += '<i class="fa ' + icon + '"></i> ' + platform.name;
        html += '</button>';
    });
    html += '</div>';

    // Platform contents with language sub-tabs
    html += '<div class="platform-tabs-content">';
    platforms.forEach(function(platform, pIndex) {
        var isPlatformActive = (platform.name === defaultPlatform) || (pIndex === 0 && platforms.every(function(p) { return p.name !== defaultPlatform; }));
        var platformActiveClass = isPlatformActive ? ' active' : '';
        var platformId = id + '-' + platform.name.toLowerCase().replace(/\s+/g, '-');

        html += '<div class="platform-content' + platformActiveClass + '" data-platform="' + platform.name + '">';

        // Parse language blocks within this platform
        var langs = parseLangBlocks(platform.content);

        if (langs.length > 0) {
            // Language tab headers
            html += '<div class="language-tabs-header">';
            langs.forEach(function(lang, lIndex) {
                var isLangActive = lIndex === 0 ? ' active' : '';
                html += '<button class="language-tab' + isLangActive + '" data-lang="' + lang.name + '" data-platform-id="' + platformId + '">';
                html += lang.name;
                html += '</button>';
            });
            html += '</div>';

            // Language contents
            html += '<div class="language-tabs-content">';
            langs.forEach(function(lang, lIndex) {
                var isLangActive = lIndex === 0 ? ' active' : '';
                html += '<div class="language-content' + isLangActive + '" data-lang="' + lang.name + '">';
                html += normalizeContent(lang.content);
                html += '</div>';
            });
            html += '</div>';
        } else {
            // No language blocks, just show platform content directly
            html += normalizeContent(platform.content);
        }

        html += '</div>';
    });
    html += '</div>';

    html += '</div>';

    return html;
}

module.exports = {
    // Website assets
    website: {
        assets: './assets',
        css: ['platform-tabs.css'],
        js: ['platform-tabs.js']
    },

    // Ebook assets
    ebook: {
        assets: './assets',
        css: ['platform-tabs.css']
    },

    // Block handlers
    blocks: {
        // Single-level platform tabs
        platformtabs: {
            process: processPlatformTabs
        },
        // Two-level code sample tabs
        codesample: {
            process: processCodeSample
        }
    },

    // Hooks
    hooks: {
        // Initialize plugin
        init: function() {
            // Reset counter for each build
            tabIdCounter = 0;
        },

        // Process each page - handle platformtabs/codesample in page content
        page: function(page) {
            var book = this;
            var content = page.content;

            // Process platformtabs
            content = content.replace(
                /<!--\s*platformtabs\s+id="([^"]+)"\s*-->([\s\S]*?)<!--\s*\/platformtabs\s*-->/g,
                function(match, id, body) {
                    return processPlatformTabsContent(book, id, body);
                }
            );

            // Process codesample
            content = content.replace(
                /<!--\s*codesample\s+id="([^"]+)"\s*-->([\s\S]*?)<!--\s*\/codesample\s*-->/g,
                function(match, id, body) {
                    return processCodeSampleContent(book, id, body);
                }
            );

            page.content = content;
            return page;
        }
    }
};

/**
 * Process platformtabs content (called from page hook)
 */
function processPlatformTabsContent(book, id, body) {
    var defaultPlatform = getConfig(book, 'pluginsConfig.platform-tabs.defaultPlatform', 'Android');

    // Parse platform blocks
    var platforms = parsePlatformBlocks(body);

    if (platforms.length === 0) {
        return '<div class="platform-tabs-error">No platform blocks found</div>';
    }

    // Build HTML
    var html = '<div class="platform-tabs-container" id="' + id + '">';

    // Tab headers
    html += '<div class="platform-tabs-header">';
    platforms.forEach(function(platform, index) {
        var isActive = (platform.name === defaultPlatform) || (index === 0 && platforms.every(function(p) { return p.name !== defaultPlatform; }));
        var activeClass = isActive ? ' active' : '';
        var icon = getPlatformIcon(platform.name);
        html += '<button class="platform-tab' + activeClass + '" data-platform="' + platform.name + '" data-tabs-id="' + id + '">';
        html += '<i class="fa ' + icon + '"></i> ' + platform.name;
        html += '</button>';
    });
    html += '</div>';

    // Tab contents
    html += '<div class="platform-tabs-content">';
    platforms.forEach(function(platform, index) {
        var isActive = (platform.name === defaultPlatform) || (index === 0 && platforms.every(function(p) { return p.name !== defaultPlatform; }));
        var activeClass = isActive ? ' active' : '';
        html += '<div class="platform-content' + activeClass + '" data-platform="' + platform.name + '">';
        html += normalizeContent(platform.content);
        html += '</div>';
    });
    html += '</div>';

    html += '</div>';

    return html;
}

/**
 * Process codesample content (called from page hook)
 */
function processCodeSampleContent(book, id, body) {
    var defaultPlatform = getConfig(book, 'pluginsConfig.platform-tabs.defaultPlatform', 'Android');

    // Parse platform blocks
    var platforms = parsePlatformBlocks(body);

    if (platforms.length === 0) {
        return '<div class="platform-tabs-error">No platform blocks found</div>';
    }

    // Build HTML
    var html = '<div class="code-sample-container" id="' + id + '">';

    // Platform tab headers
    html += '<div class="platform-tabs-header">';
    platforms.forEach(function(platform, index) {
        var isActive = (platform.name === defaultPlatform) || (index === 0 && platforms.every(function(p) { return p.name !== defaultPlatform; }));
        var activeClass = isActive ? ' active' : '';
        var icon = getPlatformIcon(platform.name);
        html += '<button class="platform-tab' + activeClass + '" data-platform="' + platform.name + '" data-tabs-id="' + id + '">';
        html += '<i class="fa ' + icon + '"></i> ' + platform.name;
        html += '</button>';
    });
    html += '</div>';

    // Platform contents with language sub-tabs
    html += '<div class="platform-tabs-content">';
    platforms.forEach(function(platform, pIndex) {
        var isPlatformActive = (platform.name === defaultPlatform) || (pIndex === 0 && platforms.every(function(p) { return p.name !== defaultPlatform; }));
        var platformActiveClass = isPlatformActive ? ' active' : '';
        var platformId = id + '-' + platform.name.toLowerCase().replace(/\s+/g, '-');

        html += '<div class="platform-content' + platformActiveClass + '" data-platform="' + platform.name + '">';

        // Parse language blocks within this platform
        var langs = parseLangBlocks(platform.content);

        if (langs.length > 0) {
            // Language tab headers
            html += '<div class="language-tabs-header">';
            langs.forEach(function(lang, lIndex) {
                var isLangActive = lIndex === 0 ? ' active' : '';
                html += '<button class="language-tab' + isLangActive + '" data-lang="' + lang.name + '" data-platform-id="' + platformId + '">';
                html += lang.name;
                html += '</button>';
            });
            html += '</div>';

            // Language contents
            html += '<div class="language-tabs-content">';
            langs.forEach(function(lang, lIndex) {
                var isLangActive = lIndex === 0 ? ' active' : '';
                html += '<div class="language-content' + isLangActive + '" data-lang="' + lang.name + '">';
                html += normalizeContent(lang.content);
                html += '</div>';
            });
            html += '</div>';
        } else {
            // No language blocks, just show platform content directly
            html += normalizeContent(platform.content);
        }

        html += '</div>';
    });
    html += '</div>';

    html += '</div>';

    return html;
}
