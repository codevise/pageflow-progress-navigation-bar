//= require_self
//= require ./progress_navigation_bar/widget

pageflow.widgetTypes.register('progress_navigation_bar', {
  enhance: function(element) {
    element.progressNavigationBar();
  }
});

pageflow.widgetTypes.register('progress_navigation_bar_horizontal', {
  enhance: function(element) {
    element.progressNavigationBar();
  }
});
