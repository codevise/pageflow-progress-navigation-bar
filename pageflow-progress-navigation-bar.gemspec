# coding: utf-8

Gem::Specification.new do |spec|
  spec.name          = 'pageflow-progress-navigation-bar'
  spec.version       = '0.1.0'
  spec.authors       = ['Codevise Solutions Ltd.']
  spec.email         = ['info@codevise.de']
  spec.summary       = 'Pageflow navigation widget.'
  spec.homepage      = ''
  spec.license       = 'MIT'

  spec.files         = `git ls-files`.split($/)
  spec.executables   = spec.files.grep(%r{^bin/}) { |f| File.basename(f) }
  spec.test_files    = spec.files.grep(%r{^spec/})
  spec.require_paths = ['lib']

  spec.add_runtime_dependency 'pageflow'

  spec.add_development_dependency 'bundler'
  spec.add_development_dependency 'rake'
end
