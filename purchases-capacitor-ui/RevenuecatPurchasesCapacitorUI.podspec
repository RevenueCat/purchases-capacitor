require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name = 'RevenuecatPurchasesCapacitorUi'
  s.version = package['version']
  s.summary = package['description']
  s.license = package['license']
  s.homepage = package['repository']['url']
  s.author = package['author']
  s.source = { :git => package['repository']['url'], :tag => s.version.to_s }
  s.source_files = 'ios/Sources/**/*.{swift,h,m,c,cc,mm,cpp}'
  s.ios.deployment_target = '15.0'
  s.dependency 'Capacitor'
  # TODO: before merging 15.0-dev into main, replace this development reference with the published PHC 21 version. (SDK-4604)
  s.dependency 'PurchasesHybridCommonUI', '21.0.0-SNAPSHOT'
  s.swift_version = '5.1'
end 