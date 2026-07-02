import { globalIgnores } from 'eslint/config'
import pluginVue from 'eslint-plugin-vue'
import { withVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default withVueTs(
  globalIgnores(['dist/**', 'dist-ssr/**', 'coverage/**']),

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommendedTypeChecked,

  {
    name: 'app/rule-overrides',
    rules: {
      // Sidebar/Topbar son términos de UI establecidos y sin ambigüedad;
      // renombrar los archivos queda fuera del alcance de esta limpieza.
      'vue/multi-word-component-names': ['error', { ignores: ['Sidebar', 'Topbar'] }],
    },
  },

  {
    name: 'app/main-entry-overrides',
    files: ['src/main.ts'],
    rules: {
      // Este archivo registra componentes globales de PrimeVue bajo su nombre
      // de librería (Button, Dialog, Select...); no está definiendo componentes
      // propios, así que las reglas de nomenclatura de componentes no aplican.
      'vue/multi-word-component-names': 'off',
      'vue/no-reserved-component-names': 'off',
    },
  },

  skipFormatting,
)
