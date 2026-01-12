/**
 * Platform Tabs Plugin - Client-side JavaScript
 *
 * Handles tab switching for both platform tabs and language tabs
 * Each tab container is INDEPENDENT - no synchronization between sections
 */

(function() {
    'use strict';

    /**
     * Initialize platform tabs functionality
     */
    function initPlatformTabs() {
        // Handle platform tab clicks
        document.addEventListener('click', function(e) {
            var target = e.target.closest('.platform-tab');
            if (!target) return;

            var platform = target.getAttribute('data-platform');
            var tabsId = target.getAttribute('data-tabs-id');
            var container = document.getElementById(tabsId);

            if (!container) return;

            // Update tab active states (only within this container)
            var tabs = container.querySelectorAll('.platform-tabs-header .platform-tab');
            tabs.forEach(function(tab) {
                tab.classList.remove('active');
            });
            target.classList.add('active');

            // Update content active states (only within this container)
            var contents = container.querySelectorAll('.platform-tabs-content > .platform-content');
            contents.forEach(function(content) {
                content.classList.remove('active');
            });

            var activeContent = container.querySelector('.platform-content[data-platform="' + platform + '"]');
            if (activeContent) {
                activeContent.classList.add('active');
            }

            // Trigger resize event for code highlighting plugins
            window.dispatchEvent(new Event('resize'));
        });

        // Handle language tab clicks
        document.addEventListener('click', function(e) {
            var target = e.target.closest('.language-tab');
            if (!target) return;

            // Find the parent platform content
            var platformContent = target.closest('.platform-content');
            if (!platformContent) return;

            var lang = target.getAttribute('data-lang');

            // Update language tab active states (only within this platform content)
            var langTabs = platformContent.querySelectorAll('.language-tabs-header .language-tab');
            langTabs.forEach(function(tab) {
                tab.classList.remove('active');
            });
            target.classList.add('active');

            // Update language content active states (only within this platform content)
            var langContents = platformContent.querySelectorAll('.language-tabs-content > .language-content');
            langContents.forEach(function(content) {
                content.classList.remove('active');
            });

            var activeLangContent = platformContent.querySelector('.language-content[data-lang="' + lang + '"]');
            if (activeLangContent) {
                activeLangContent.classList.add('active');
            }

            // Trigger resize event for code highlighting plugins
            window.dispatchEvent(new Event('resize'));
        });
    }

    /**
     * Initialize when DOM is ready
     */
    function init() {
        initPlatformTabs();
        // No preference restoration - each container is independent
    }

    // Initialize on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Re-initialize on GitBook page navigation (for SPA mode)
    if (typeof gitbook !== 'undefined') {
        gitbook.events.bind('page.change', function() {
            // Nothing to restore - each container starts fresh
        });
    }
})();
