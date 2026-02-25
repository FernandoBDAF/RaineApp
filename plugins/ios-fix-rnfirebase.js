const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const DEFINES_MODULE_TAG = '# RNFB DEFINES_MODULE fix';
const DEFINES_MODULE_BLOCK = `
  ${DEFINES_MODULE_TAG}
  installer.pods_project.targets.each do |target|
    if target.name.start_with?('RNFB')
      target.build_configurations.each do |config|
        config.build_settings['DEFINES_MODULE'] = 'NO'
      end
    end
  end`;

module.exports = function withRNFirebaseFix(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const iosRoot = config.modRequest.platformProjectRoot;
      const podfilePath = path.join(iosRoot, 'Podfile');

      if (!fs.existsSync(podfilePath)) {
        console.warn('⚠️ Podfile não encontrado.');
        return config;
      }

      let podfile = fs.readFileSync(podfilePath, 'utf8');
      let updated = false;

      // 1. Garantir use_frameworks! :linkage => :static
      if (podfile.includes('use_frameworks!') && !podfile.includes(':static')) {
        podfile = podfile.replace(/use_frameworks!.*\n/, 'use_frameworks! :linkage => :static\n');
        updated = true;
      }

      // 2. Garantir inhibit_all_warnings!
      if (!podfile.includes('inhibit_all_warnings!')) {
        podfile = podfile.replace(/(use_frameworks!.*\n)/, `$1inhibit_all_warnings!\n`);
        updated = true;
      }

      // 3. Adicionar DEFINES_MODULE = NO apenas para targets RNFB no post_install
      if (!podfile.includes(DEFINES_MODULE_TAG)) {
        if (podfile.match(/post_install do \|installer\|\n/)) {
          podfile = podfile.replace(
            /post_install do \|installer\|\n/,
            `post_install do |installer|\n${DEFINES_MODULE_BLOCK}\n`
          );
        } else {
          podfile += `\npost_install do |installer|\n${DEFINES_MODULE_BLOCK}\nend\n`;
        }
        updated = true;
      }

      if (updated) {
        fs.writeFileSync(podfilePath, podfile);
        console.log('✅ Podfile atualizado com fixes para RNFirebase');
      }

      return config;
    }
  ]);
};
