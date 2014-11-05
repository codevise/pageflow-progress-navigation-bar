module Pageflow
  module ProgressNavigationBar
    class Engine < Rails::Engine
      isolate_namespace Pageflow::ProgressNavigationBar

      config.autoload_paths << File.join(config.root, 'lib')
    end
  end
end
