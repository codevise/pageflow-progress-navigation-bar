# Pageflow Progress Navigation Bar

[![Gem Version](https://badge.fury.io/rb/pageflow-progress-navigation-bar.svg)](http://badge.fury.io/rb/pageflow-progress-navigation-bar)

A navigation bar resembling a progress bar.

## Installation

Add this line to your application's `Gemfile`:

    gem 'pageflow-progress-navigation-bar'

Register the widget type inside the configure block in `config/initializers/pageflow.rb`

    Pageflow.configure do |config|
      config.widget_types.register(Pageflow::ProgressNavigationBar.widget_type)
    end

Include javascripts and stylesheets:

    # app/assets/javascripts/pageflow/application.js
    //= require pageflow/progress_navigation_bar

    # app/assets/stylesheets/pageflow/application.scss
    @import "pageflow/progress_navigation_bar";

    # Adding basic style to your theme
    # app/assets/stylesheets/pageflow/themes/default.scss
    @import "pageflow/progress_navigation_bar/themes/default";

Execute `bundle install` Restart the application server.

## Troubleshooting

If you run into problems while installing the page type, please also refer to the
[Troubleshooting](https://github.com/codevise/pageflow/wiki/Troubleshooting) wiki
page in the [Pageflow  repository](https://github.com/codevise/pageflow). If that
doesn't help, consider
[filing an issue](https://github.com/codevise/pageflow-progress-navigation-bar/issues).

## Contributing Locales

Edit the translations directly on the
[pageflow-progress-navigation-bar](http://www.localeapp.com/projects/public?search=tf/pageflow-progress-navigation-bar)
locale project.
