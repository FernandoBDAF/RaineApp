const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const tag = '# BoringSSL-GRPC -G flag fix';
const block = [
  `  ${tag}`,
  '  installer.pods_project.targets.each do |target|',
  "    next unless target.name == 'BoringSSL-GRPC'",
  '    target.source_build_phase.files.each do |file|',
  "      next unless file.settings && file.settings['COMPILER_FLAGS']",
  "      flags = file.settings['COMPILER_FLAGS'].split",
  "      flags.reject! { |flag| flag == '-GCC_WARN_INHIBIT_ALL_WARNINGS' }",
  "      file.settings['COMPILER_FLAGS'] = flags.join(' ')",
  '    end',
  '  end'
].join('\n');

function addBoringSslFix(podfile) {
  if (podfile.includes(tag)) {
    return podfile;
  }

  if (podfile.match(/post_install do \|installer\|\n/)) {
    return podfile.replace(/post_install do \|installer\|\n/, (match) => `${match}${block}\n`);
  }

  return `${podfile}\npost_install do |installer|\n${block}\nend\n`;
}

module.exports = function withBoringSSLFlagFix(config) {
  return withDangerousMod(config, [
    'ios',
    async (modConfig) => {
      const podfilePath = path.join(modConfig.modRequest.platformProjectRoot, 'Podfile');
      const podfile = fs.readFileSync(podfilePath, 'utf8');
      const updated = addBoringSslFix(podfile);
      if (updated !== podfile) {
        fs.writeFileSync(podfilePath, updated);
      }
      return modConfig;
    }
  ]);
};
