module Pageflow
  module ProgressNavigationBar
    class WidgetType < Pageflow::WidgetType
      def name
        'progress_navigation_bar'
      end

      def roles
        ['navigation']
      end
    end
  end
end
