# analytics.js-integration-google-analytics [![Build Status][ci-badge]][ci-link]

Google Analytics integration for [Analytics.js][].

# Quick Start

A typical/minimal ga tracking would be like:

    <script>
    // the js tracking code from ga admin panel
    ga('create', 'UA-XXXXXXX-XX', 'auto');
    ga('send', 'pageview');
    </script>

A analytics equivalent would be like:

    <script>
    // somewhat loader to make sure the analytics instance is available
    var settings = {
      'Google Analytics': {
        trackingId: 'UA-7072136-17',
      }
    };
    analytics.init(settings);
    analytics.page();
    </script>

## License

Released under the [MIT license](LICENSE).


[Analytics.js]: https://segment.com/docs/libraries/analytics.js/
[ci-link]: https://circleci.com/gh/segment-integrations/analytics.js-integration-google-analytics
[ci-badge]: https://circleci.com/gh/segment-integrations/analytics.js-integration-google-analytics.svg?style=svg
