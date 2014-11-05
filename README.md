# Pageflow Progress Navigation Bar

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

    # app/assets/stylesheets/pageflow/application.css.scss
    @import "pageflow/progress_navigation_bar";

Execute `bundle install` Restart the application server.

## Troubleshooting

If you run into problems while installing the page type, please also refer to the
[Troubleshooting](https://github.com/codevise/pageflow/wiki/Troubleshooting) wiki
page in the [Pageflow  repository](https://github.com/codevise/pageflow). If that
doesn't help, consider
[filing an issue](https://github.com/codevise/pageflow-progress-navigation-bar/issues).