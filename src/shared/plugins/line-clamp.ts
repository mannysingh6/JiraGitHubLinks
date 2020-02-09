import { PluginObject } from 'vue';
import { DirectiveBinding } from 'vue/types/options';

const currentValueProp = 'vLineClampValue';

const truncateText = function (el: any, binding: DirectiveBinding) {
  const lines = parseInt(binding.value, 10);
  if (isNaN(lines)) {
    console.error('Parameter for vue-line-clamp must be a number');
    return;
  } else if (lines !== el[currentValueProp]) {
    el[currentValueProp] = lines;

    (el.style as any).webkitLineClamp = lines ? `${lines}` : '';
  }
};

const vueLineClamp: PluginObject<{}> = {
  install(vue) {

    const styles = `
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      word-break: break-all;
    `;

    vue.directive('line-clamp', {
      bind(el) {
        el.style.cssText += styles;
      },
      inserted: (el, binding) => truncateText(el, binding),
      update: (el, binding) => truncateText(el, binding),
      componentUpdated: (el, binding) => truncateText(el, binding)
    });
  }
};

export default vueLineClamp;
