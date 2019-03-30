import { withInfo } from "@storybook/addon-info";
import { addDecorator, configure } from "@storybook/react";

function loadStories() {
  require('../src/stories');
}

addDecorator(withInfo({source: true}));

configure(loadStories, module);
