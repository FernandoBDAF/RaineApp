const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

module.exports = function withRNFirebaseFix(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const iosRoot = config.modRequest.platformProjectRoot;
      const podfilePath = path.join(iosRoot, 'Podfile');

      if (!fs.existsSync(podfilePath)) {
        console.warn('⚠️ Podfile não encontrado. Pulando RNFirebase fix.');
        return config;
      }

      let podfile = fs.readFileSync(podfilePath, 'utf8');
      let updated = false;

      /**
       * 1️⃣ Remover use_modular_headers! (Firebase quebra com isso)
       */
      if (podfile.includes('use_modular_headers!')) {
        podfile = podfile.replace(/use_modular_headers!\n?/g, '');
        updated = true;
      }

      /**
       * 2️⃣ Garantir inhibit_all_warnings!
       * Evita Werror em pods do Firebase / Flipper
       */
      if (!podfile.includes('inhibit_all_warnings!')) {
        // tenta inserir após use_frameworks!
        if (podfile.match(/use_frameworks!.*\n/)) {
          podfile = podfile.replace(/(use_frameworks!.*\n)/, `$1inhibit_all_warnings!\n`);
        } else {
          // fallback: insere no topo do arquivo
          podfile = `inhibit_all_warnings!\n\n${podfile}`;
        }
        updated = true;
      }

      /**
       * 3️⃣ Garantir linkage estático (necessário p/ RNFirebase + Expo)
       */
      if (podfile.includes('use_frameworks!') && !podfile.includes(':static')) {
        podfile = podfile.replace(/use_frameworks!.*\n/, 'use_frameworks! :linkage => :static\n');
        updated = true;
      }

      if (updated) {
        fs.writeFileSync(podfilePath, podfile);
        console.log('✅ Podfile atualizado com fixes para RNFirebase');
      } else {
        console.log('ℹ️ Podfile já estava compatível com RNFirebase');
      }

      return config;
    }
  ]);
};
