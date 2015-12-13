module Pageflow
  module ProgressNavigationBar
    class HorizontalWidgetType < ProgressNavigationBar::WidgetType
      def name
        'progress_navigation_bar_horizontal'
      end

      def render(template, entry)
        super(template, entry, horizontal: true)
      end

      def translation_key
        'pageflow.progress_navigation_bar.horizontal.widget_type_name'
      end
    end
  end
end
