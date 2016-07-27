module Pageflow
  module ProgressNavigationBar
    class VerticalWidgetType < ProgressNavigationBar::WidgetType
      def name
        'progress_navigation_bar'
      end

      def render(template, entry)
        super(template, entry, horizontal: false)
      end

      def translation_key
        'pageflow.progress_navigation_bar.vertical.widget_type_name'
      end
    end
  end
end
