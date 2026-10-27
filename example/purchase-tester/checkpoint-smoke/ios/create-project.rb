require 'xcodeproj'
require 'fileutils'

repo = File.expand_path('../../../../..', __FILE__)
output = File.join(repo, '.context', 'checkpoint-smoke-ios')
FileUtils.mkdir_p(output)
project = Xcodeproj::Project.new(File.join(output, 'CheckpointSmoke.xcodeproj'))
target = project.new_target(:ui_test_bundle, 'CheckpointSmoke', :ios, '15.0')
source = project.main_group.new_file(File.join(__dir__, 'CheckpointSmoke.swift'))
target.source_build_phase.add_file_reference(source)
target.build_configurations.each do |config|
  config.build_settings.merge!({
    'PRODUCT_BUNDLE_IDENTIFIER' => 'com.revenuecat.capacitor.checkpointsmoke',
    'SWIFT_VERSION' => '5.0',
    'GENERATE_INFOPLIST_FILE' => 'YES',
    'CODE_SIGNING_ALLOWED' => 'NO',
    'TARGETED_DEVICE_FAMILY' => '1,2',
    'SUPPORTED_PLATFORMS' => 'iphonesimulator',
  })
end
project.save
scheme = Xcodeproj::XCScheme.new
scheme.add_build_target(target)
scheme.add_test_target(target)
scheme.save_as(project.path, 'CheckpointSmoke', true)
puts project.path
