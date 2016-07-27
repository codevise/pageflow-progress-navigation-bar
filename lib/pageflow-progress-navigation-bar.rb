require 'pageflow/progress_navigation_bar/engine'

module Pageflow
  module ProgressNavigationBar
    def self.widget_type
      ProgressNavigationBar::VerticalWidgetType.new
    end

    def self.vertical_widget_type
      ProgressNavigationBar::VerticalWidgetType.new
    end

    def self.horizontal_widget_type
      ProgressNavigationBar::HorizontalWidgetType.new
    end
  end
end
